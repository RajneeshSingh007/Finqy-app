import React from 'react';
import {
  StyleSheet,
  BackHandler,
  TouchableWithoutFeedback,
  PermissionsAndroid,
  Platform,
  Linking,
  AppState,
  Alert,
} from 'react-native';
import {Title, View} from '@shoutem/ui';
import * as Helper from '../../../util/Helper';
import * as Pref from '../../../util/Pref';
import {ActivityIndicator, Colors, Portal, Searchbar} from 'react-native-paper';
import {sizeHeight} from '../../../util/Size';
import Lodash from 'lodash';
import LeftHeaders from '../../common/CommonLeftHeader';
import ListError from '../../common/ListError';
import CommonTable from '../../common/CommonTable';
import RNFetchBlob from 'rn-fetch-blob';
import IconChooser from '../../common/IconChooser';
import CScreen from './../../component/CScreen';
import CallerForm from './CallerForm';
import Loader from '../../../util/Loader';
import NavigationActions from '../../../util/NavigationActions';
import SendIntentAndroid from 'react-native-send-intent';

const dummyJSON = {
  name: '',
  mobile: '',
};

export default class DialerCalling extends React.PureComponent {
  constructor(props) {
    super(props);
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
    this.backClick = this.backClick.bind(this);
    this.startCalling = this.startCalling.bind(this);
    this.state = {
      appState: AppState.currentState,
      dataList: [],
      loading: false,
      token: '',
      userData: '',
      tableHead: ['Sr. No.', 'Call',  'Whatsapp','Data'],
      widthArr: [60, 60,80, 150],
      cloneList: [],
      type: '',
      itemSize: 10,
      disableNext: false,
      disableBack: false,
      searchQuery: '',
      enableSearch: false,
      orderBy: 'asc',
      fileName: '',
      activeCallerItem: dummyJSON,
      callTrack: -1,
      productList: '',
      progressLoader: false,
      editEnabled:false
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backClick);
    AppState.addEventListener('change', this._handleAppStateChange);
    
    const {navigation} = this.props;
    const activeCallerItem = navigation.getParam('data', dummyJSON);
    const editEnabled = navigation.getParam('editEnabled', false);

    if(editEnabled === false){
      try {
        Helper.requestPermissionsDialer();
      } catch (error) {
        
      }
    }

    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({loading: true, dataList: [],editEnabled:true,callTrack:-1});
    });
    
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.userData, userData => {
        this.setState({userData: userData,editEnabled:editEnabled,activeCallerItem:activeCallerItem,progressLoader:false});
        Pref.getVal(Pref.USERTYPE, v => {
          this.getProducts();
          this.setState({type: v}, () => {
            Pref.getVal(Pref.saveToken, value => {
              this.setState({token: value}, () => {
                if(editEnabled === false){
                  this.fetchData();
                }
              });
            });
          });
        });
      });
    });
  }

  componentWillUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    AppState.removeEventListener('change', this._handleAppStateChange);
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      const {callTrack} = this.state;
      if (callTrack === 0) {
        this.setState({callTrack: 1});
      }
    }
    this.setState({appState: nextAppState});
  };

  fetchData = () => {
    this.setState({loading: true});
    const {team_id, id} = this.state.userData;
    const body = JSON.stringify({
      teamid: team_id,
      userid: id,
      active: 0,
    });
    //console.log('body', body)
    Helper.networkHelperTokenPost(
      Pref.DIALER_LEAD_RECORD,
      body,
      Pref.methodPost,
      this.state.token,
      result => {
        const {data, status} = result;
        if (status === true) {
          if (data.length > 0) {
            const {itemSize} = this.state;
            this.setState({
              cloneList: data,
              dataList: this.returnData(data, 0, data.length).slice(
                0,
                itemSize,
              ),
              loading: false,
              itemSize: data.length >= 10 ? 10 : data.length,
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
      e => {
        this.setState({loading: false});
      },
    );
  };

  getProducts = () => {
    Helper.networkHelperGet(
      Pref.DIALER_GET_PRODUCTS,
      result => {
        const parse = JSON.parse(result);
        const sorting = parse.sort((a, b) => {
          return String(a.value).localeCompare(b.value);
        });
        this.setState({productList: sorting});
      },
      e => {},
    );
  };

  backClick = () => {
    const {callTrack, editEnabled,activeCallerItem} = this.state;
    if (callTrack === 1) {
      if(editEnabled){
        NavigationActions.navigate("DialerRecords", {active:-1});
        BackHandler.removeEventListener('hardwareBackPress', this.backClick);
      }else{
        BackHandler.removeEventListener('hardwareBackPress', this.backClick);
        return true;    
      }
    }else{
      NavigationActions.goBack();
      BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    }
    this.setState({callTrack:-1});
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    return true;  
  };

  startCalling = (item, isWhatsapp = false, videocall = false) => {
    const {mobile, name} = item;
    if (Platform.OS === 'android') {
      try {
        if(isWhatsapp === true){
          SendIntentAndroid.whatsappPhone({
            isvideo:videocall,
            phone:'7208828396'
            //mobile
          }).then(result =>{
            if(result === 'no permission granted'){
              Helper.requestPermissionsDialer();
              Helper.showToastMessage('Please, Grant Phone Call, Contact Permissions', 2);      
            }else if(result === 'success'){
              this.setState({
                activeCallerItem: item,
                callTrack: 0,
                progressLoader: false,
              });          
            }else{
              Helper.showToastMessage(result, 0);       
            }
          })
        }else{
          this.setState({
            activeCallerItem: item,
            callTrack: 0,
            progressLoader: false,
          });      
          SendIntentAndroid.sendPhoneCall(mobile, false);
        }
      } catch (error) {
        //console.log(error);
        Helper.requestPermissionsDialer();
        Helper.showToastMessage('Please, Grant Phone Call, Contact Permissions', 2);
      }
    } else {
      this.setState({
        activeCallerItem: item,
        callTrack: 0,
        progressLoader: false,
      });  
      Linking.openURL(`tel:${mobile}`);
    }
  };

  /**
   *
   * @param {*} data
   */
  returnData = (sort, start = 0, end) => {
    const dataList = [];
    if (sort.length > 0) {
      if (start >= 0) {
        for (let i = start; i < end; i++) {
          const item = sort[i];
          if (Helper.nullCheck(item) === false) {
            const rowData = [];
            rowData.push(`${Number(i + 1)}`);
            const callCustomerView = value => (
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableWithoutFeedback
                  onPress={() => this.startCalling(value, false,false)}>
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
            const callCustomerWhatsappView = value => (
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
                <View style={{marginHorizontal:8}}></View>
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
            rowData.push(`${item.name}\n${item.mobile}`);
            //rowData.push(item.mobile);
            dataList.push(rowData);
          }
        }
      }
    }
    return dataList;
  };

  /**
   *
   * @param {*} mode true ? next : back
   */
  pagination = mode => {
    const {itemSize, cloneList} = this.state;
    let clone = JSON.parse(JSON.stringify(cloneList));
    let plus = itemSize;
    let slicedArray = [];
    if (mode) {
      plus += 10;
      if (itemSize < clone.length) {
        if (plus > clone.length) {
          const rem = clone.length - itemSize;
          plus = itemSize + rem;
        }
        slicedArray = this.returnData(clone, itemSize, plus);
        this.setState({dataList: slicedArray, itemSize: plus});
      }
    } else {
      if (itemSize <= 10) {
        plus = 0;
      } else {
        plus -= 10;
      }
      if (plus >= 0 && plus < clone.length) {
        slicedArray = this.returnData(clone, plus, itemSize);
        if (slicedArray.length > 0) {
          this.setState({dataList: slicedArray, itemSize: plus});
        }
      }
    }
  };

  onChangeSearch = query => {
    this.setState({searchQuery: query});
    const {cloneList, itemSize} = this.state;
    if (cloneList.length > 0) {
      const trimquery = String(query)
        .trim()
        .toLowerCase();
      const clone = JSON.parse(JSON.stringify(cloneList));
      const result = Lodash.filter(clone, it => {
        const {name, mobile, product} = it;
        return (
          (name &&
            name
              .trim()
              .toLowerCase()
              .includes(trimquery)) ||
          (mobile &&
            mobile
              .trim()
              .toLowerCase()
              .includes(trimquery)) ||
          (product &&
            product
              .trim()
              .toLowerCase()
              .includes(trimquery))
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
      const data = this.returnData(clone, 0, 10);
      this.setState({dataList: data});
    }
    this.setState({searchQuery: '', enableSearch: !enableSearch, itemSize: 10});
  };

  formResult = (status, message) => {
    Helper.showToastMessage(message, status === true ? 1 : 0);
    const {editEnabled} = this.state;
    if(editEnabled === true){
      NavigationActions.navigate("DialerRecords", {active:-1});
    }else{
      this.setState({callTrack: -1, activeCallerItem: dummyJSON});
      this.fetchData();  
    }
  };

  render() {
    const {
      searchQuery,
      enableSearch,
      productList,
      callTrack,
      token,
      editEnabled
    } = this.state;
    return (
      <CScreen
        refresh={() => {
          if(editEnabled === true){
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
                        title={ editEnabled === true ? 'Edit Details' : 'Customer Details'}
                        backClicked={ () =>this.backClick()}
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
                        editEnabled={this.state.editEnabled}
                        userData={this.state.userData}
                        productList={productList}
                        customerItem={this.state.activeCallerItem}
                        token={token}
                        formResult={this.formResult}
                        startLoader={(value, leadConfirm) => {
                          if (leadConfirm === 0) {
                            this.setState({
                              callTrack: -1,
                              activeCallerItem: dummyJSON,
                              progressLoader: false,
                            });
                          } else {
                            this.setState({progressLoader: value});
                          }
                        }}
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
          </>
        }
        body={
          <>
            <LeftHeaders
              showBack
              title={editEnabled === true ? '' : 'Start Calling'}
              backClicked={() => NavigationActions.goBack()}
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

            <View styleName="horizontal md-gutter space-between">
              <View styleName="horizontal">
                <TouchableWithoutFeedback
                  onPress={() => this.pagination(false)}>
                  <Title style={styles.itemtopText}>{`Back`}</Title>
                </TouchableWithoutFeedback>
                <View
                  style={{
                    height: 16,
                    marginHorizontal: 12,
                    backgroundColor: '#0270e3',
                    width: 1.5,
                  }}
                />
                <TouchableWithoutFeedback onPress={() => this.pagination(true)}>
                  <Title style={styles.itemtopText}>{`Next`}</Title>
                </TouchableWithoutFeedback>
              </View>
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
            ) : null}

            {this.state.loading ? (
              <View style={styles.loader}>
                <ActivityIndicator />
              </View>
            ) : this.state.dataList.length > 0 ? (
              <CommonTable
                enableHeight={false}
                dataList={this.state.dataList}
                widthArr={this.state.widthArr}
                tableHead={this.state.tableHead}
              />
            ) : (
              <View style={styles.emptycont}>
                <ListError subtitle={'No Callers Found...'} />
              </View>
            )}
            {this.state.dataList.length > 0 ? (
              <>
                <Title style={styles.itemtext}>{`Showing ${
                  this.state.itemSize
                }/${Number(this.state.cloneList.length)} entries`}</Title>
              </>
            ) : null}
          </>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  button: {
    color: 'white',
    paddingVertical: sizeHeight(0.5),
    marginTop: 24,
    marginHorizontal: 24,
    backgroundColor: '#e21226',
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
});
