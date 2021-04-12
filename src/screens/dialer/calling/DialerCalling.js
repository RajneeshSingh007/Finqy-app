import React from 'react';
import {
  StyleSheet,
  BackHandler,
  TouchableWithoutFeedback,
  Platform,
  Linking,
  AppState,
  FlatList,
} from 'react-native';
import {Title, View, Subtitle} from '@shoutem/ui';
import * as Helper from '../../../util/Helper';
import * as Pref from '../../../util/Pref';
import {
  ActivityIndicator,
  Colors,
  Portal,
  Searchbar,
  FAB,
} from 'react-native-paper';
import {sizeHeight} from '../../../util/Size';
import Lodash from 'lodash';
import LeftHeaders from '../../common/CommonLeftHeader';
import ListError from '../../common/ListError';
import CommonTable from '../../common/CommonTable';
import IconChooser from '../../common/IconChooser';
import CScreen from './../../component/CScreen';
import CallerForm from './CallerForm';
import Loader from '../../../util/Loader';
import NavigationActions from '../../../util/NavigationActions';
import SendIntentAndroid from 'react-native-send-intent';
import PaginationNumbers from './../../component/PaginationNumbers';
import {firebase} from '@react-native-firebase/firestore';
import CallDetectorManager from 'react-native-call-detection';
import DateRangePicker from 'react-native-daterange-picker';
import moment from 'moment';
import {disableOffline, stopIdleService} from '../../../util/DialerFeature';

const DATE_FORMAT = 'DD-MM-YYYY';
const ITEM_LIMIT = 10;

const activeCallerPlaceholderJSON = {
  name: '',
  mobile: '',
  editable: false,
  dob: '',
  pincode: '',
  editable: '',
};

export default class DialerCalling extends React.PureComponent {
  constructor(props) {
    super(props);
    this.callerformsubmit = this.callerformsubmit.bind(this);
    this.renderData = this.renderData.bind(this);
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
    this.backClick = this.backClick.bind(this);
    this.startCalling = this.startCalling.bind(this);
    this.state = {
      appState: AppState.currentState,
      dataList: [],
      loading: false,
      token: '',
      userData: '',
      tableHead: ['Sr.No.', 'Call', 'Whatsapp', 'Name', 'Number'],
      widthArr: [60, 60, 100, 150, 100],
      cloneList: [],
      type: '',
      itemSize: ITEM_LIMIT,
      disableNext: false,
      disableBack: false,
      searchQuery: '',
      enableSearch: false,
      orderBy: 'asc',
      fileName: '',
      activeCallerItem: activeCallerPlaceholderJSON,
      callTrack: -1,
      productList: '',
      progressLoader: false,
      editEnabled: false,
      teamName: '',
      whatsappMode: false,
      dateFilter: -1,
      startDate: moment(),
      endDate: null,
      displayedDate: moment(),
    };
  }

  componentDidMount() {
    try {
      Helper.requestPermissionsDialer();
    } catch (error) {}

    BackHandler.addEventListener('hardwareBackPress', this.backClick);
    AppState.addEventListener('change', this._handleAppStateChange);

    const {navigation} = this.props;
    const activeCallerItem = navigation.getParam(
      'data',
      activeCallerPlaceholderJSON,
    );
    const editEnabled = navigation.getParam('editEnabled', false);
    const isFollowup = navigation.getParam('isFollowup', -1);
    const outside = navigation.getParam('outside', false);

    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({
        loading: true,
        //dataList: [],
        //editEnabled: true,
        //callTrack: -1,
      });
    });

    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.DIALER_DATA, (userdatas) => {
        const {id, tlid, pname} = userdatas[0].tc;
        activeCallerItem.team_id = tlid;
        activeCallerItem.user_id = id;
        Pref.getVal(Pref.userData, (userData) => {
          this.setState({
            userid: id,
            teamName: pname,
            teamid: tlid,
            outside: outside,
            userData: userData,
            editEnabled: editEnabled,
            activeCallerItem: activeCallerItem,
            progressLoader: false,
            callTrack: editEnabled ? 1 : -1,
            isFollowup: isFollowup,
            whatsappMode: false,
          });
          Pref.getVal(Pref.USERTYPE, (v) => {
            this.setState({type: v}, () => {
              Pref.getVal(Pref.saveToken, (value) => {
                this.setState({token: value}, () => {
                  if (editEnabled === false) {
                    this.fetchData();
                  }
                });
              });
            });
          });
        });
      });
    });

    disableOffline();
    this.firebaseListerner = firebase
      .firestore()
      .collection(Pref.COLLECTION_PRODUCT)
      .onSnapshot((querySnapshot) => {
        const productList = [];
        querySnapshot.forEach((documentSnapshot) => {
          const {enabled, name} = documentSnapshot.data();
          if (Number(enabled) === 0) {
            documentSnapshot.data().value = name;
            productList.push(documentSnapshot.data());
          }
        });
        if (productList.length > 0) {
          const sorting = productList.sort((a, b) => {
            return String(a.value).localeCompare(b.value);
          });
          this.setState({productList: sorting});
        }
      });

    this.callDetection = new CallDetectorManager(
      (event, phoneNumber) => {
        //console.log(event, phoneNumber);
        const {callTrack, activeCallerItem} = this.state;
        if (Helper.nullCheck(activeCallerItem) === false) {
          const {mobile} = activeCallerItem;
          if (
            callTrack === 0 &&
            //(event === 'Disconnected' || event === 'Connected') &&
            String(phoneNumber).toLowerCase() === String(mobile).toLowerCase()
          ) {
            this.setState({callTrack: 1, progressLoader: false});
          }
        }
      },
      true,
      () => {},
      {
        title: 'Phone Permission',
        message:
          'This app needs access to your phone state in order to use this feature',
      },
    );
  }

  componentWillUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    AppState.removeEventListener('change', this._handleAppStateChange);
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
    if (this.firebaseListerner !== undefined) this.firebaseListerner.remove();
    if (this.callDetection !== undefined) this.callDetection.dispose();
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      const {callTrack, whatsappMode} = this.state;
      if (callTrack === 0 && whatsappMode) {
        this.setState({callTrack: 1});
      }
    }
    this.setState({appState: nextAppState});
  };

  fetchData = () => {
    this.setState({loading: true});
    const {isFollowup, teamName, teamid, userid} = this.state;
    //const {team_id, id} = this.state.userData;
    const body = JSON.stringify({
      teamid: teamid,
      userid: userid,
      active: 0,
      tname: teamName,
      follow: isFollowup,
    });
    //console.log('body', body);
    Helper.networkHelperTokenPost(
      Pref.DIALER_LEAD_RECORD,
      body,
      Pref.methodPost,
      this.state.token,
      (result) => {
        //console.log('result', result);
        const {data, status} = result;
        if (status === true) {
          if (data.length > 0) {
            //const {itemSize} = this.state;
            // const tableHead = [
            //   'Sr.No.',
            //   'Call',
            //   'Whatsapp',
            //   'Name',
            //   'Number',
            // ];
            // const widthArr = [60, 60, 100, 150, 100];
            // if (isFollowup) {
            //   tableHead.push('Appointment Date');
            //   widthArr.push(140);
            // }
            let itemList = [];
            if (isFollowup == 1) {
              const currentDate = moment().format(DATE_FORMAT);
              const spacespli = String(currentDate).split(/\s/g);
              const startSp = String(spacespli[0]).split(/-/g);

              itemList = Lodash.filter(data, (io) => {
                const {followup_datetime} = io;
                const spli = String(followup_datetime).split(/\s/g);
                const datespl = String(spli[0]).split(/-/g);

                const datecheck = Number(datespl[0]) === Number(startSp[0]);
                const monthCheck = Number(datespl[1]) === Number(startSp[1]);
                const yearCheck = Number(datespl[2]) === Number(startSp[2]);

                if (
                  followup_datetime &&
                  Helper.nullStringCheck(followup_datetime) === false &&
                  datecheck &&
                  monthCheck &&
                  yearCheck
                ) {
                  return io;
                }
              });
            } else {
              itemList = data;
            }

            this.setState({
              //tableHead: tableHead,
              //widthArr: widthArr,
              cloneList: data,
              dataList: itemList,
              // this.returnData(data, 0, data.length).slice(
              //   0,
              //   itemSize,
              // ),
              loading: false,
              //itemSize: data.length <= ITEM_LIMIT ? data.length : ITEM_LIMIT,
            });
          } else {
            this.setState({
              loading: false,
            });
          }
        } else {
          this.setState({loading: false});
        }
      },
      (e) => {
        this.setState({loading: false});
      },
    );
  };

  getProducts = () => {
    Helper.networkHelperGet(
      Pref.DIALER_GET_PRODUCTS,
      (result) => {
        const parse = JSON.parse(result);
        //console.log('parse', parse);
        const sorting = parse.sort((a, b) => {
          return String(a.value).localeCompare(b.value);
        });
        this.setState({productList: sorting});
      },
      () => {},
    );
  };

  backClick = () => {
    const {callTrack, editEnabled, whatsappMode} = this.state;
    if (editEnabled) {
      this.clearback();
    }
    if (callTrack === 1 || whatsappMode) {
      return true;
    }
    this.clearback();
    return true;
  };

  clearback = () => {
    NavigationActions.goBack();
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
  };

  // backClick = () => {
  //   const {callTrack, editEnabled} = this.state;
  //   if (callTrack === 1) {
  //     if (editEnabled) {
  //       NavigationActions.navigate('DialerRecords', {active: -1});
  //       if (this.focusListener !== undefined) this.focusListener.remove();
  //       if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  //       BackHandler.removeEventListener('hardwareBackPress', this.backClick);
  //     } else {
  //       if (this.focusListener !== undefined) this.focusListener.remove();
  //       if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  //       BackHandler.removeEventListener('hardwareBackPress', this.backClick);
  //       return true;
  //     }
  //   } else {
  //     NavigationActions.goBack();
  //     if (this.focusListener !== undefined) this.focusListener.remove();
  //     if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  //     BackHandler.removeEventListener('hardwareBackPress', this.backClick);
  //   }
  //   this.setState({callTrack: -1});
  //   if (this.focusListener !== undefined) this.focusListener.remove();
  //   if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  //   BackHandler.removeEventListener('hardwareBackPress', this.backClick);
  //   return true;
  // };

  /**
   * start calling
   * @param {} item
   * @param {*} isWhatsapp
   * @param {*} videocall
   */
  startCalling = (item, isWhatsapp = false, videocall = false) => {
    const {mobile} = item;
    if (mobile === '' && item.name === '') {
      item.editable = true;
    }
    if (Platform.OS === 'android') {
      try {
        if (isWhatsapp === true) {
          //check number and permission then whatsapp call
          SendIntentAndroid.whatsappPhone({
            isvideo: videocall,
            phone: mobile,
          }).then((result) => {
            if (result === 'no permission granted') {
              Helper.showToastMessage(
                'Please, Grant Phone Call, Contact And Call Log Permissions',
                2,
              );
              try {
                Helper.requestPermissionsDialer();
              } catch (error) {}
            } else if (result === 'success') {
              stopIdleService();
              this.setState({
                progressLoader: true,
                activeCallerItem: item,
                callTrack: 0,
                whatsappMode: true,
              });
            } else {
              Helper.showToastMessage(result, 0);
            }
          });
        } else {
          stopIdleService();
          SendIntentAndroid.sendPhoneCall(mobile, false);
          this.setState({
            progressLoader: true,
            activeCallerItem: item,
            callTrack: 0,
            whatsappMode: false,
          });
        }
      } catch (error) {
        //console.log(error);
        Helper.showToastMessage(
          'Please, Grant Phone Call, Contact And Call Log Permissions',
          2,
        );
        Helper.requestPermissionsDialer();
      }
    } else {
      stopIdleService();
      this.setState({
        progressLoader: true,
        activeCallerItem: item,
        callTrack: 0,
        whatsappMode: false,
      });
      Linking.openURL(`tel:${mobile}`);
    }
  };

  /**
   *
   * @param {*} data
   */
  returnData = (sort, start = 0, end) => {
    const {isFollowup} = this.state;
    const dataList = [];
    if (sort.length > 0) {
      if (start >= 0) {
        for (let i = start; i < end; i++) {
          const item = sort[i];
          if (Helper.nullCheck(item) === false) {
            const rowData = [];
            rowData.push(`${Number(i + 1)}`);
            const callCustomerView = (value) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableWithoutFeedback
                  onPress={() => this.startCalling(value, false, false)}>
                  <View>
                    <IconChooser
                      name={`phone`}
                      size={20}
                      color={Colors.lightBlue500}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            );
            rowData.push(callCustomerView(item));
            const callCustomerWhatsappView = (value) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableWithoutFeedback
                  onPress={() => this.startCalling(value, true, false)}>
                  <View>
                    <IconChooser
                      name={`whatsapp`}
                      size={20}
                      iconType={2}
                      color={Colors.green400}
                    />
                  </View>
                </TouchableWithoutFeedback>
                <View style={{marginHorizontal: 16}}></View>
                <TouchableWithoutFeedback
                  onPress={() => this.startCalling(value, true, true)}>
                  <View>
                    <IconChooser
                      name={`video`}
                      size={20}
                      iconType={2}
                      color={Colors.amber500}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            );
            rowData.push(callCustomerWhatsappView(item));
            rowData.push(
              Lodash.truncate(item.name, {
                separator: '...',
                length: 40,
              }),
            );
            rowData.push(item.mobile);
            if (isFollowup) {
              rowData.push(item.followup_datetime);
            }
            dataList.push(rowData);
          }
        }
      }
    }
    return dataList;
  };

  onChangeSearch = (query) => {
    this.setState({searchQuery: query});
    const {cloneList, itemSize} = this.state;
    if (cloneList.length > 0) {
      const trimquery = String(query).trim().toLowerCase();
      const clone = JSON.parse(JSON.stringify(cloneList));
      const result = Lodash.filter(clone, (it) => {
        const {name, mobile, product} = it;
        return (
          (name && name.trim().toLowerCase().includes(trimquery)) ||
          (mobile && mobile.trim().toLowerCase().includes(trimquery)) ||
          (product && product.trim().toLowerCase().includes(trimquery))
        );
      });
      const data =
        result.length > 0 ? this.returnData(result, 0, result.length) : [];
      const count = result.length > 0 ? result.length : itemSize;
      this.setState({dataList: data, itemSize: count});
    }
  };

  revertBack = () => {
    const {enableSearch} = this.state;
    const {cloneList} = this.state;
    if (enableSearch === true && cloneList.length > 0) {
      const clone = JSON.parse(JSON.stringify(cloneList));
      const data = this.returnData(clone, 0, ITEM_LIMIT);
      this.setState({dataList: data});
    }
    this.setState({
      searchQuery: '',
      enableSearch: !enableSearch,
      itemSize: ITEM_LIMIT,
    });
  };

  formResult = (status, message) => {
    const {editEnabled} = this.state;
    //console.log('editEnabled', editEnabled)
    if (editEnabled === true) {
      //NavigationActions.navigate('DialerRecords', {active: -1});
      Helper.showToastMessage(message, status === true ? 1 : 0);
      this.backClick();
    } else {
      Helper.showToastMessage(message, status === true ? 1 : 0);
      this.setState({
        callTrack: -1,
        activeCallerItem: activeCallerPlaceholderJSON,
      });
      this.fetchData();
    }
  };

  pageNumberClicked = (start, end) => {
    const {cloneList} = this.state;
    const clone = JSON.parse(JSON.stringify(cloneList));
    const data = this.returnData(clone, start, end);
    this.setState({
      dataList: data,
      itemSize: end,
    });
  };

  /**
   *
   * @param {*} rowData
   * @param {*} sectionID
   * @param {*} rowID
   */
  renderData = (rowData, index) => {
    return (
      <View styleName="horizontal v-center" style={styles.mainTcontainer}>
        <View style={{flex: 0.2}}>
          <View style={styles.callcircle}>
            <Title style={styles.firstWord}>
              {rowData.name !== '' ? Lodash.capitalize(rowData.name[0]) : '#'}
            </Title>
          </View>
        </View>
        <View
          styleName="horizontal space-between v-center h-center"
          style={{flex: 0.8}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 0.5}}>
              {rowData.name !== '' ? (
                <Title style={styles.timelinetitle}>{rowData.name}</Title>
              ) : null}
              <Title style={styles.tlphone}>{rowData.mobile}</Title>
              {this.state.isFollowup == 1 ? (
                <Subtitle style={{fontSize: 12, color: 'grey'}}>
                  {`${rowData.followup_datetime}`}
                </Subtitle>
              ) : null}
            </View>
            <View styleName="horizontal v-center" style={{flex: 0.5}}>
              <View
                style={{
                  flex: 12,
                  flexDirection: 'row',
                }}>
                <TouchableWithoutFeedback
                  onPress={() => this.startCalling(rowData, false, false)}>
                  <View style={{flex: 3}}>
                    <IconChooser
                      name={`phone-outgoing`}
                      size={24}
                      color={Colors.lightBlue500}
                    />
                  </View>
                </TouchableWithoutFeedback>
                <View style={styles.spacer}></View>
                <TouchableWithoutFeedback
                  onPress={() => this.startCalling(rowData, true, false)}>
                  <View style={{flex: 3}}>
                    <IconChooser
                      name={`whatsapp`}
                      size={24}
                      iconType={2}
                      color={Colors.green400}
                    />
                  </View>
                </TouchableWithoutFeedback>
                <View style={styles.spacer}></View>
                <TouchableWithoutFeedback
                  onPress={() => this.startCalling(rowData, true, true)}>
                  <View style={{flex: 3}}>
                    <IconChooser
                      name={`video`}
                      size={24}
                      color={Colors.deepOrange400}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  setDates = (dates) => {
    this.setState({
      ...dates,
    });
  };

  fabClick = () => {
    this.setState({dateFilter: 1});
  };

  dateFilterSubmit = () => {
    const {startDate, endDate, cloneList} = this.state;
    if (startDate != null) {
      const parse = moment(startDate).format(DATE_FORMAT);
      let endparse = null;
      if (endDate != null) {
        endparse = moment(endDate).format(DATE_FORMAT);
      } else {
        endparse = parse;
      }

      //console.log('parse', parse, 'end', endparse);

      //start date//18-03
      const startParseSp = String(parse).split(/\s/g);
      const startSp = String(startParseSp).split(/-/g);

      const endParseSp = String(endparse).split(/\s/g);
      const endSp = String(endParseSp).split(/-/g);

      //console.log(parse, endparse);
      const itemList = Lodash.filter(cloneList, (io) => {
        const {followup_datetime} = io;
        const spli = String(followup_datetime).split(/\s/g);
        const datespl = String(spli[0]).split(/-/g);

        const datecheck = Number(datespl[0]) >= Number(startSp[0]);
        const monthCheck = Number(datespl[1]) >= Number(startSp[1]);
        const yearCheck = Number(datespl[2]) >= Number(startSp[2]);

        const dateEndcheck = Number(datespl[0]) <= Number(endSp[0]);
        const monthEndCheck = Number(datespl[1]) <= Number(endSp[1]);
        const yearEndCheck = Number(datespl[2]) <= Number(endSp[2]);

        // console.log(
        //   followup_datetime,
        //   spli,
        //   datespl,
        //   datecheck,
        //   monthCheck,
        //   yearCheck,
        //   dateEndcheck,
        //   monthEndCheck,
        //   yearEndCheck,
        // );
        if (
          datecheck &&
          monthCheck &&
          yearCheck &&
          dateEndcheck &&
          monthEndCheck &&
          yearEndCheck
        ) {
          return io;
        }
      });

      //console.log('itemList', itemList);

      this.setState({
        dataList: itemList,
        dateFilter: -1,
        endDate: endparse,
        startDate: parse,
      });
    } else {
      this.setState({
        dateFilter: -1,
      });
    }
  };

  callerformsubmit = (value, leadConfirm) => {
    if (leadConfirm === 0) {
      this.setState({
        callTrack: -1,
        activeCallerItem: activeCallerPlaceholderJSON,
        progressLoader: false,
      });
    } else {
      this.setState({progressLoader: value});
    }
  };

  render() {
    const {
      searchQuery,
      enableSearch,
      productList,
      callTrack,
      token,
      editEnabled,
      isFollowup,
      outside,
      dateFilter,
      startDate,
      endDate,
      displayedDate,
    } = this.state;
    return (
      <CScreen
        refresh={() => {
          if (editEnabled === true) {
            this.fetchData();
          }
        }}
        absolute={
          <>
            {callTrack === 1 ? (
              <Portal>
                <CScreen
                  body={
                    <>
                      <LeftHeaders
                        showBack
                        title={
                          outside
                            ? 'Add Customer Details'
                            : editEnabled === true
                            ? 'Edit Details'
                            : 'Customer Details'
                        }
                        backClicked={this.backClick}
                        bottomBody={
                          <>
                            {/* <View styleName="md-gutter">
                      <Searchbar
                        placeholder="Search"
                        onChangeText={this.onChangeSearch}
                        value={searchQuery}
                      />
                    </View> */}
                          </>
                        }
                      />

                      <CallerForm
                        teamName={this.state.teamName}
                        editEnabled={this.state.editEnabled}
                        userData={this.state.userData}
                        productList={productList}
                        customerItem={this.state.activeCallerItem}
                        token={token}
                        formResult={this.formResult}
                        startLoader={this.callerformsubmit}
                      />
                    </>
                  }
                />
              </Portal>
            ) : null}
            <Loader
              isShow={this.state.progressLoader}
              bottomText={'Please do not press back button'}
            />
            {isFollowup === 1 ? (
              <FAB style={styles.fab} icon="filter" onPress={this.fabClick} />
            ) : null}

            {dateFilter !== -1 ? (
              <Portal>
                <DateRangePicker
                  onChange={this.setDates}
                  endDate={endDate}
                  startDate={startDate}
                  displayedDate={displayedDate}
                  range
                  //presetButtons
                  //buttonStyle={styles.submitbuttonpicker}
                  buttonTextStyle={{
                    fontSize: 15,
                    fontWeight: '700',
                    color: 'white',
                  }}
                  submitClicked={this.dateFilterSubmit}
                  closeCallback={() =>
                    this.setState({
                      startDate: null,
                      endDate: null,
                      datefilter: -1,
                    })
                  }
                />
              </Portal>
            ) : null}
          </>
        }
        body={
          <>
            <LeftHeaders
              showBack
              title={
                this.state.loading
                  ? ''
                  : isFollowup === 1
                  ? 'Follow-up'
                  : isFollowup === 2
                  ? 'Need Name'
                  : editEnabled === true
                  ? ''
                  : 'Start Calling'
              }
              backClicked={this.backClick}
              bottomBody={
                <>
                  {/* <View styleName="md-gutter">
                    <Searchbar
                      placeholder="Search"
                      onChangeText={this.onChangeSearch}
                      value={searchQuery}
                    />
                  </View> */}
                </>
              }
            />

            {/* <View styleName="horizontal md-gutter space-between">
              <PaginationNumbers
                dataSize={this.state.cloneList.length}
                itemSize={this.state.itemSize}
                itemLimit={ITEM_LIMIT}
                pageNumberClicked={this.pageNumberClicked}
              />
              <TouchableWithoutFeedback onPress={this.revertBack}>
                <View styleName="horizontal v-center h-center">
                  <IconChooser
                    name={enableSearch ? 'x' : 'search'}
                    size={24}
                    color={'#555555'}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>

            {enableSearch === true ? (
              <View styleName="md-gutter">
                <Searchbar
                  placeholder="Search"
                  onChangeText={this.onChangeSearch}
                  value={searchQuery}
                  style={{
                    elevation: 0,
                    borderColor: '#dbd9cc',
                    borderWidth: 0.5,
                    borderRadius: 8,
                  }}
                  clearIcon={() => null}
                />
              </View>
            ) : null} */}

            {this.state.loading ? (
              <View style={styles.loader}>
                <ActivityIndicator />
              </View>
            ) : this.state.dataList.length > 0 ? (
              <>
                <FlatList
                  data={this.state.dataList}
                  renderItem={({item, index}) => this.renderData(item, index)}
                  keyExtractor={(item, index) => `${index}`}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                />
                {/* <CommonTable
                enableHeight={false}
                dataList={this.state.dataList}
                widthArr={this.state.widthArr}
                tableHead={this.state.tableHead}
              /> */}
              </>
            ) : (
              <View style={styles.emptycont}>
                <ListError subtitle={'No Callers Data Found...'} />
              </View>
            )}
            {/* {this.state.dataList.length > 0 ? (
              <>
                <Title style={styles.itemtext}>{`Showing ${
                  this.state.itemSize
                }/${Number(this.state.cloneList.length)} entries`}</Title>
              </>
            ) : null} */}
          </>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Pref.RED,
  },
  spacer: {
    flex: 0.15,
  },
  firstWord: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 14,
  },
  callcircle: {
    width: 48,
    height: 48,
    backgroundColor: Pref.RED,
    borderRadius: 48,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: 6,
  },
  mainTcontainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: '#bcbaa1',
    borderWidth: 0.8,
    borderRadius: 10,
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 6,
    marginHorizontal: 16,
  },
  button: {
    color: 'white',
    paddingVertical: sizeHeight(0.5),
    marginTop: 24,
    marginHorizontal: 24,
    backgroundColor: Pref.RED,
    textAlign: 'center',
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 1,
  },
  emptycont: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginVertical: 48,
    paddingVertical: 56,
  },
  loader: {
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 1,
    marginVertical: 48,
    paddingVertical: 48,
  },
  itemtext: {
    letterSpacing: 0.5,
    fontWeight: '700',
    lineHeight: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#0270e3',
    fontSize: 14,
    paddingVertical: 16,
    marginTop: 4,
  },
  itemtopText: {
    letterSpacing: 0.5,
    fontWeight: '700',
    lineHeight: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#0270e3',
    fontSize: 16,
  },
  timelinetitle: {
    color: '#292929',
    fontSize: 15,
    fontWeight: '700',
  },
  tlphone: {
    color: '#555',
    fontSize: 13,
    fontWeight: '700',
  },
});
