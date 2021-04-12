import * as React from 'react';
import {
  View,
  FlatList,
  Alert,
  ActivityIndicator,
  StyleSheet,
  BackHandler,
  AppState
} from 'react-native';
import * as Pref from '../../util/Pref';
import * as Helper from '../../util/Helper';
import CScreen from './../component/CScreen';
import LeftHeaders from '../common/CommonLeftHeader';
import {sizeWidth, sizeHeight} from '../../util/Size';
import DashboardItem from './components/DashboardItem';
import NavigationActions from '../../util/NavigationActions';
import ListError from '../common/ListError';
import Loader from '../../util/Loader';
import Lodash from 'lodash';
import {firebase} from '@react-native-firebase/firestore';
import { enableCallModule,serverClientDateCheck,enableIdleService,stopIdleService } from '../../util/DialerFeature';

const TLDashboard = [
  {
    name: 'Dashboard',
    image: require('../../res/images/dialer/dashboard.png'),
    click: 'TlDashboard',
    option: {},
    enabled: true,
  },
  {
    name: 'Live Tracking',
    image: require('../../res/images/dialer/live_tracking.png'),
    click: 'TlLiveTracker',
    option: {},
    enabled: true,
  },
  {
    name: 'My Team',
    image: require('../../res/images/dialer/team.png'),
    click: 'TlTeam',
    option: {},
    enabled: true,
  },
  // {
  //   name: 'Report',
  //   image: require('../../res/images/dialer/report.png'),
  //   click: 'TlReport',
  //   option: {},
  //   enabled: true,
  // },
];

const TCDashboard = [
  {
    name: 'Check In',
    image: require('../../res/images/dialer/checkin.png'),
    click: 'TcDashboard',
    option: {},
    enabled: true,
  },
  {
    name: 'Break',
    image: require('../../res/images/dialer/break.png'),
    click: 'TcDashboard',
    option: {},
    enabled: false,
  },
  {
    name: 'Start Calling',
    image: require('../../res/images/dialer/phone.png'),
    click: 'DialerCalling',
    option: {editEnabled: false},
    enabled: false,
  },
  {
    name: 'Follow-up',
    image: require('../../res/images/dialer/phonecall.png'),
    click: 'DialerCalling',
    option: {editEnabled: false, isFollowup: 1},
    enabled: false,
  },
  // {
  //   name: '...',
  //   image: require('../../res/images/dialer/emergency_call.png'),
  //   click: 'DialerCalling',
  //   option: {editEnabled: false, isFollowup: 2},
  //   enabled: false,
  // },
  {
    name: 'Dashboard',
    image: require('../../res/images/dialer/dashboard.png'),
    click: 'TcDashboard',
    option: {},
    enabled: true,
  },
  {
    name: 'Performance',
    image: require('../../res/images/dialer/growth.png'),
    click: 'TcPerformance',
    option: {},
  },
  {
    name: 'Call Records',
    image: require('../../res/images/dialer/report.png'),
    click: 'DialerRecords',
    option: {},
    enabled: true,
  },
  {
    name: 'Call Logs',
    image: require('../../res/images/dialer/calllogs.png'),
    click: 'CallLogs',
    option: {},
    enabled: true,
  },
  {
    name: 'Templates',
    image: require('../../res/images/dialer/template.png'),
    click: 'TcTemplates',
    option: {},
  },
];

/**
 * SwitchUser
 */
export default class SwitchUser extends React.PureComponent {
  constructor(props) {
    super(props);
    this.checkInCheckoutRef = null;
    this.itemClicked = this.itemClicked.bind(this);
    this.state = {
      appState: AppState.currentState,
      dialerData: null,
      cloneList: [],
      dataList: [],
      loading: true,
      appoint: false,
      tc: false,
      progressLoader: false,
    };
  }

  /**
   *
   */
  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.checkdeviceDataSetup(true);
    });
  }

  _handleAppStateChange = (nextAppState) =>{
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.checkdeviceDataSetup(false);
    }
    this.setState({appState: nextAppState});
  }

  componentWillUnmount(){
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  checkdeviceDataSetup = (loading = true) =>{
    Helper.networkHelperGet(
      Pref.SERVER_DATE_TIME,
      (datetime) => {
        const checkClientServer = serverClientDateCheck(datetime, true);
        if (checkClientServer) {
          enableCallModule(true);
          this.setState({progressLoader: false, loading: loading});
          Pref.getVal(Pref.USERTYPE, (type) => {
            if (type === 'team') {
              Pref.getVal(Pref.DIALER_DATA, (value) => {
                //console.log('value', value);
                let result = [];
                if (
                  Helper.nullCheck(value) == false &&
                  value.length > 0 &&
                  Helper.nullCheck(value[0].tc) === false
                ) {
                  result = TCDashboard;
                  const {id, tlid, pname} = value[0].tc;
                  this.setState(
                    {
                      tc: true,
                      dialerData: value,
                      //dataList: result,
                      //loading: false,
                      cloneList: result,
                    },
                    () => {
                      this.followupAvailableCheck(tlid, id, pname);
                      this.setupfirebase(id, checkClientServer[2], false, '');
                    },
                  );
                } else if (
                  Helper.nullCheck(value) == false &&
                  value.length > 0 &&
                  Helper.nullCheck(value[0].tl) === false
                ) {
                  result = TLDashboard;
                  this.setState({
                    tc: false,
                    dialerData: value,
                    dataList: result,
                    loading: false,
                    cloneList: result,
                  });
                }
              });
            }
          });
        } else {
          this.setState({progressLoader: false});
          Alert.alert(
            ``,
            `Please, correct your device's date & time to use this feature`,
            [
              {
                text: 'Ok',
                onPress: () => {
                  BackHandler.exitApp();
                },
              },
            ],
          );
        }
      },
      (e) => {
        console.log('e', e);
      },
    );
  }

  /**
   * follow check
   * @param {} tlid
   * @param {*} id
   * @param {*} tname
   */
  followupAvailableCheck = (tlid, id, tname) => {
    Pref.getVal(Pref.saveToken, (value) => {
      const body = JSON.stringify({
        teamid: tlid,
        userid: id,
        tname: tname,
      });
      Helper.networkHelperTokenPost(
        Pref.DIALER_TC_Follow,
        body,
        Pref.methodPost,
        value,
        (result) => {
          //console.log('result', result);
          const {appoint} = result;
          this.setState({appoint: appoint});
        },
        (e) => {},
      );
    });
  };

  itemClicked = ({name, click, option, enabled}, index) => {
    if (enabled) {
      const {dataList, tc, dialerData} = this.state;
      if (name === 'Check In') {
        Alert.alert('', 'Are you sure want to check in?', [
          {
            text: 'Yes',
            onPress: () => {
              this.checkincheckout(name, 'checkin', true);
            },
          },
          {
            text: 'No',
          },
        ]);
      } else if (name === 'Check Out') {
        Alert.alert('', 'Are you sure want to checkout?', [
          {
            text: 'Yes',
            onPress: () => {
              this.checkincheckout(name, 'checkout', false);
            },
          },
          {
            text: 'No',
          },
        ]);
      } else if (name === 'Break' || name === 'Resume') {
        this.breakResume(name, 'breaktime', false);
      } else {
        const {tc, dialerData} = this.state;
        let finalDataProcess = option;
        if (tc && name === 'Call Logs') {
          const {id, tlid, pname} = dialerData[0].tc;
          finalDataProcess = {id: id, tlid: tlid, tname: pname};
        }
        NavigationActions.navigate(click, finalDataProcess);
      }
    }
  };

  /**
   *
   * @param {*} id
   * @param {*} date
   */
  setupfirebase = (id, date, showToast, message) => {
    const {cloneList} = this.state;
    const docRef = firebase
      .firestore()
      .collection(Pref.COLLECTION_CHECKIN)
      .doc(`${id}${date}`);

    docRef
      .get()
      .then((result) => {
        if (result.exists) {
          const data = result.data();
          if (data) {
            const {checkin, checkout, idle, breaktime} = data;
            const checkinval = Helper.nullStringCheck(checkin);
            const checkoutval = Helper.nullStringCheck(checkout);
            let evenoddcheck = false;
            if (breaktime && breaktime.length > 0) {
              evenoddcheck = Number(breaktime.length) % 2 === 0 ? false : true;
            }
            const enableList = Lodash.map(cloneList, (io) => {
              if (checkinval && checkoutval) {
                io.enabled = io.name !== 'Check In' ? false : true;
              } else if (checkinval === false && checkoutval) {
                io.enabled = io.name !== 'Check In' ? true : false;
              } else if (checkoutval === false && checkinval === false) {
                io.enabled = io.name !== 'Check Out' ? false : true;
              }
              if (io.name === 'Break' || io.name === 'Resume') {
                io.name = evenoddcheck ? 'Resume' : 'Break';
              } else if (io.name === 'Check Out') {
                io.name = checkoutval ? 'Check Out' : 'Check In';
                io.enabled = true;
              } else if (io.name === 'Check In') {
                io.name =
                  checkinval === false && checkoutval === false
                    ? 'Check In'
                    : checkinval
                    ? 'Check In'
                    : 'Check Out';
                io.enabled = true;
              } else if (
                io.name === 'Call Records' ||
                io.name === 'Call Logs' ||
                io.name === 'Dashboard' ||
                io.name === 'Templates' ||
                io.name === 'Performance'
              ) {
                io.enabled = true;
              }
              // else if(io.name === 'Check In'){
              //   io.name = checkinval === false ? 'Check Out' : 'Check In';
              //   io.enabled = true;
              // }
              return io;
            });
            const findisResume = Lodash.find(
              enableList,
              (io) => io.name === 'Resume',
            );
            const findIsbreakFilter = Lodash.map(enableList, (io) => {
              if (
                io.name === 'Call Records' ||
                io.name === 'Call Logs' ||
                io.name === 'Dashboard' ||
                io.name === 'Templates' ||
                io.name === 'Performance'
              ) {
                io.enabled = true;
              } else if (io.name === 'Check In' || io.name === 'Check Out') {
                io.enabled = true;
              } else if (findisResume && io.name !== 'Resume') {
                io.enabled = false;
              }
              return io;
            });
            this.setState(
              {
                dataList: findIsbreakFilter,
                loading: false,
                progressLoader: false,
              },
              () => {
                if (showToast) {
                  Helper.showToastMessage(message, 1);
                }
              },
            );
          }
        } else {
          docRef.set({
            checkin: '',
            checkout: '',
            breaktime: [],
            idle: [],
          });
          this.setState({
            dataList: cloneList,
            loading: false,
            progressLoader: false,
          });
        }
      })
      .catch((e) => {
        this.setState({dataList: cloneList, loading: false});
      });
  };

  /**
   * check in/out
   * @param {*} title
   * @param {*} docName
   * @param {*} checkout
   */
  checkincheckout = (title, docName, checkout = false) => {
    const {cloneList, tc, dialerData} = this.state;
    if (tc) {
      const {id, tlid, pname} = dialerData[0].tc;
      this.setState({progressLoader: true});
      Helper.networkHelperGet(
        Pref.SERVER_DATE_TIME,
        (datetime) => {
          const checkClientServer = serverClientDateCheck(datetime,false);
          if (docName === 'checkin') {
            firebase
              .firestore()
              .collection(Pref.COLLECTION_CHECKIN)
              .doc(`${id}${checkClientServer[2]}`)
              .get()
              .then((result) => {
                if (result.exists) {
                  const data = result.data();
                  if (data) {
                    const {checkout} = data;
                    if (Helper.nullStringCheck(checkout) === false) {
                      stopIdleService();
                      this.setState({progressLoader: false});
                      Helper.showToastMessage(
                        'You have already Checked-out',
                        0,
                      );
                    } else {
                      //check in  update time
                      const obj = {};
                      obj[docName] = checkClientServer[1];
                      firebase
                        .firestore()
                        .collection(Pref.COLLECTION_CHECKIN)
                        .doc(`${id}${checkClientServer[2]}`)
                        .set(obj, {merge: true})
                        .then((result) => {
                          if(docName === 'checkin'){
                            enableIdleService(`${id}${checkClientServer[2]}`);
                          }else{
                            stopIdleService();
                          }
                          this.setupfirebase(
                            id,
                            checkClientServer[2],
                            true,
                            docName === 'checkin'
                              ? `Checked In Successfully`
                              : `Checked Out Successfully`,
                          );
                        })
                        .catch((e) => {
                          Helper.showToastMessage('Something went wrong!', 0);
                          this.setState({progressLoader: false});
                        });
                    }
                  }
                }
              });
          } else {
            //check out update time
            const obj = {};
            obj[docName] = checkClientServer[1];
            firebase
              .firestore()
              .collection(Pref.COLLECTION_CHECKIN)
              .doc(`${id}${checkClientServer[2]}`)
              .set(obj, {merge: true})
              .then((result) => {
                if(docName === 'checkin'){
                  enableIdleService(`${id}${checkClientServer[2]}`);
                }else{
                  stopIdleService();
                }
                this.setupfirebase(
                  id,
                  checkClientServer[2],
                  true,
                  docName === 'checkin'
                    ? `Checked In Successfully`
                    : `Checked Out Successfully`,
                );
              })
              .catch((e) => {
                Helper.showToastMessage('Something went wrong!', 0);
                this.setState({progressLoader: false});
              });
          }
        },
        (e) => {},
      );
    }
  };

  /**
   * break resume
   * @param {*} title
   * @param {*} docName
   * @param {*} checkout
   */
  breakResume = (title, docName, checkout = false) => {
    const {cloneList, tc, dialerData} = this.state;
    if (tc) {
      const {id, tlid, pname} = dialerData[0].tc;
      this.setState({progressLoader: true});
      Helper.networkHelperGet(
        Pref.SERVER_DATE_TIME,
        (datetime) => {
          const checkClientServer = serverClientDateCheck(datetime,false);
          firebase
            .firestore()
            .collection(Pref.COLLECTION_CHECKIN)
            .doc(`${id}${checkClientServer[2]}`)
            .get()
            .then((result) => {
              if (result.exists) {
                const data = result.data();
                if (data) {
                  const {breaktime} = data;
                  const obj = {};
                  breaktime.push(checkClientServer[1]);
                  obj.breaktime = breaktime;
                  firebase
                    .firestore()
                    .collection(Pref.COLLECTION_CHECKIN)
                    .doc(`${id}${checkClientServer[2]}`)
                    .set(obj, {merge: true})
                    .then((result) => {
                      this.setupfirebase(
                        id,
                        checkClientServer[2],
                        true,
                        title === 'Break'
                          ? `Break Granted Successfully`
                          : `Work Resumed Successfully`,
                      );
                    })
                    .catch((e) => {
                      Helper.showToastMessage('Something went wrong!', 0);
                      this.setState({progressLoader: false});
                    });
                }
              }
            });
        },
        (e) => {},
      );
    }
  };

  render() {
    const {dataList, appoint, progressLoader} = this.state;
    return (
      <CScreen
        absolute={
          <>
            <Loader isShow={progressLoader} />
          </>
        }
        body={
          <>
            <LeftHeaders showBack title={'Dialer'} />

            {this.state.loading ? (
              <View style={styles.loader}>
                <ActivityIndicator color={Pref.RED} />
              </View>
            ) : dataList && dataList.length > 0 ? (
              <FlatList
                style={{
                  marginHorizontal: sizeWidth(2),
                  flex: 1,
                  marginVertical: 12,
                }}
                data={this.state.dataList}
                renderItem={({item, index}) => (
                  <DashboardItem
                    item={item}
                    index={index}
                    itemClick={() => this.itemClicked(item, index)}
                    appoint={appoint}
                  />
                )}
                keyExtractor={(_item, index) => `${index}`}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={false}
                extraData={this.state}
                numColumns={2}
              />
            ) : (
              <View style={styles.emptycont}>
                <ListError subtitle={'No data found...'} />
              </View>
            )}
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
