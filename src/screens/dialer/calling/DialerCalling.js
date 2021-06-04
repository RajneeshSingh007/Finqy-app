import React from 'react';
import {
  StyleSheet,
  BackHandler,
  TouchableWithoutFeedback,
  FlatList,
  AppState,
} from 'react-native';
import {Title, View, Subtitle} from '@shoutem/ui';
import * as Helper from '../../../util/Helper';
import * as Pref from '../../../util/Pref';
import {ActivityIndicator, Colors, Portal, FAB} from 'react-native-paper';
import {sizeHeight} from '../../../util/Size';
import Lodash from 'lodash';
import LeftHeaders from '../../common/CommonLeftHeader';
import ListError from '../../common/ListError';
import IconChooser from '../../common/IconChooser';
import CScreen from './../../component/CScreen';
import NavigationActions from '../../../util/NavigationActions';
import DateRangePicker from 'react-native-daterange-picker';
import moment from 'moment';
import {
  enableIdleService,
  serverClientDateCheck,
  stopIdleService,
} from '../../../util/DialerFeature';
import Loader from '../../../util/Loader';
import FinproCallModule from '../../../../FinproCallModule';

const DATE_FORMAT = 'DD-MM-YYYY';

export default class DialerCalling extends React.PureComponent {
  constructor(props) {
    super(props);
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
    this.renderData = this.renderData.bind(this);
    this.backClick = this.backClick.bind(this);
    this.serverDateTime = [];
    this.whatsappClicked = false;
    this.state = {
      appState: AppState.currentState,
      dataList: [],
      loading: false,
      token: '',
      userData: '',
      cloneList: [],
      type: '',
      orderBy: 'asc',
      fileName: '',
      progressLoader: false,
      dateFilter: -1,
      startDate: moment(),
      endDate: null,
      displayedDate: moment(),
      userid: null,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backClick);
    AppState.addEventListener('change', this._handleAppStateChange);

    const {navigation} = this.props;
    const isFollowup = navigation.getParam('isFollowup', -1);

    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({
        loading: true,
      });
    });

    this.focusListener = navigation.addListener('didFocus', () => {
      stopIdleService();

      Helper.networkHelperGet(Pref.SERVER_DATE_TIME, (datetime) => {
        this.serverDateTime = serverClientDateCheck(datetime, false);
      });

      Pref.getVal(Pref.DIALER_DATA, (userdatas) => {
        const {id, tlid, pname} = userdatas[0].tc;
        this.setState({
          userid: id,
          teamName: pname,
          teamid: tlid,
          isFollowup: isFollowup,
        });
        Pref.getVal(Pref.saveToken, (value) => {
          this.setState({token: value}, () => {
            this.fetchData();
          });
        });
      });
    });
  }

  _handleAppStateChange = (nextState) => {
    console.log(nextState);
    FinproCallModule.whatsAppCallMode().then((result) => {
      //&& this.whatsappClicked
      if (result === 'Voip') {
        if (Helper.nullCheck(global.dialerCustomerItem) === false) {
          const param = {
            outside: false,
            editEnabled: false,
            isFollowup: -1,
            data: global.dialerCustomerItem,
            callTrack: 1,
          };
          if (global.dialerScreenName === 'DialerCalling') {
            delete global.dialerCustomerItem;
            delete global.dialerScreenName;  
            NavigationActions.navigate('DialerCallerForm', param);
          }
        }
      }
    });
  };

  componentWillUnMount() {
    this.startIdleServices();
    AppState.removeEventListener('change', this._handleAppStateChange);
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  fetchData = () => {
    this.setState({loading: true});
    const {isFollowup, teamName, teamid, userid} = this.state;
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
        const {data, status} = result;
        //console.log('result', result);
        if (status === true) {
          if (data.length > 0) {
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
              cloneList: data,
              dataList: itemList,
              loading: false,
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

  backClick = () => {
    this.startIdleServices();
    NavigationActions.navigate('SwitchUser');
    return true;
  };

  startIdleServices = () => {
    const {userid} = this.state;
    if (userid != null && this.serverDateTime.length > 0) {
      enableIdleService(`${userid}${this.serverDateTime[2]}`);
    }
  };

  /**
   * start calling
   * @param {} item
   * @param {*} isWhatsapp
   * @param {*} videocall
   */
  startCalling = (item, isWhatsapp = false, videocall = false) => {
    const {mobile} = item;
    global.dialerScreenName = 'DialerCalling';
    global.dialerCustomerItem = item;
    if (isWhatsapp === true) {
      FinproCallModule.whatsappCall({
        isvideo: videocall,
        phone: mobile,
      }).then((result) => {
        if (result === 'no permission granted') {
          Helper.showToastMessage(
            'Please, Grant Phone Call, Contact And Call Log Permissions',
            2,
          );
        } else if (result === 'success') {
          //this.whatsappClicked = true;
        } else {
          Helper.showToastMessage(result, 0);
        }
      });
    } else {
      FinproCallModule.phoneCall(mobile);
    }
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
        <View style={styles.leftpart}>
          <View style={styles.callcircle}>
            <Title style={styles.firstWord}>
              {rowData.name !== '' ? Lodash.capitalize(rowData.name[0]) : '#'}
            </Title>
          </View>
        </View>
        <View
          styleName="horizontal space-between v-center h-center"
          style={styles.rightpart}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={styles.topcalling}>
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
            <View styleName="horizontal v-center" style={styles.topcalling}>
              <View style={styles.callingcontainer}>
                <TouchableWithoutFeedback
                  onPress={() => this.startCalling(rowData, false, false)}>
                  <View style={styles.callingitem}>
                    <IconChooser
                      name={`phone-outgoing`}
                      size={24}
                      color={Colors.lightBlue500}
                      style={styles.iconmarg}
                    />
                  </View>
                </TouchableWithoutFeedback>
                <View style={styles.spacer}></View>
                <TouchableWithoutFeedback
                  onPress={() => this.startCalling(rowData, true, false)}>
                  <View style={styles.callingitem}>
                    <IconChooser
                      name={`whatsapp`}
                      size={24}
                      iconType={2}
                      color={Colors.green400}
                      style={styles.iconmarg}
                    />
                  </View>
                </TouchableWithoutFeedback>
                <View style={styles.spacer}></View>
                <TouchableWithoutFeedback
                  onPress={() => this.startCalling(rowData, true, true)}>
                  <View style={styles.callingitem}>
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

  closeCallback = () => {
    this.setState({
      startDate: null,
      endDate: null,
      datefilter: -1,
    });
  };

  render() {
    const {
      isFollowup,
      dateFilter,
      startDate,
      endDate,
      displayedDate,
    } = this.state;
    return (
      <CScreen
        refresh={() => this.fetchData()}
        absolute={
          <>
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
                  buttonTextStyle={styles.calendartext}
                  submitClicked={this.dateFilterSubmit}
                  closeCallback={this.closeCallback}
                />
              </Portal>
            ) : null}
          </>
        }
        body={
          <>
            <LeftHeaders
              showBack
              title={isFollowup === 1 ? 'Follow-up' : 'Start Calling'}
              backClicked={() => this.backClick()}
            />

            {this.state.loading ? (
              <View style={styles.loader}>
                <ActivityIndicator />
              </View>
            ) : this.state.dataList.length > 0 ? (
              <FlatList
                data={this.state.dataList}
                renderItem={({item, index}) => this.renderData(item, index)}
                keyExtractor={(item, index) => `${index}`}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptycont}>
                <ListError subtitle={'No Callers Data Found...'} />
              </View>
            )}
          </>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  calendartext: {
    fontSize: 15,
    fontWeight: '700',
    color: 'white',
  },
  iconmarg: {marginStart: 4},
  leftpart: {flex: 0.2},
  rightpart: {flex: 0.8},
  topcalling: {flex: 0.5},
  callingitem: {flex: 3},
  callingcontainer: {
    flex: 13,
    flexDirection: 'row',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Pref.RED,
  },
  spacer: {
    flex: 0.2,
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
