import * as React from 'react';
import {
  View,
  FlatList,
  Alert,
  ActivityIndicator,
  StyleSheet,
  BackHandler,
  AppState,
} from 'react-native';
import * as Pref from '../../util/Pref';
import * as Helper from '../../util/Helper';
import CScreen from './../component/CScreen';
import LeftHeaders from '../common/CommonLeftHeader';
import {sizeWidth, sizeHeight} from '../../util/Size';
import DashboardItem from '../component/DashboardItem';
import NavigationActions from '../../util/NavigationActions';
import ListError from '../common/ListError';
import Loader from '../../util/Loader';
import Lodash from 'lodash';
import {firebase} from '@react-native-firebase/firestore';
import {
  enableCallModule,
  serverClientDateCheck,
  disableOffline,
  enableIdleService,
  stopService,
  stopIdleService
} from '../../util/DialerFeature';
import FinproCallModule from '../../../FinproCallModule';

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
  {
    name: 'Report',
    image: require('../../res/images/dialer/report.png'),
    click: 'TlReport',
    option: {},
    enabled: true,
  },
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
    enabled: true,
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
    enabled: true,
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

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.checkdeviceDataSetup(false);
    }
    this.setState({appState: nextAppState});
  };

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  checkdeviceDataSetup = (loading = true) => {
    if (loading) {
      enableCallModule(true);
    }
    Helper.networkHelperGet(
      Pref.SERVER_DATE_TIME,
      (datetime) => {
        const checkClientServer = serverClientDateCheck(datetime, true);
        if (checkClientServer) {
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
  };

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

  /**
   * item clicked
   * @param {*} param0
   * @param {*} index
   */
  itemClicked = ({name, click, option, enabled}, index) => {
    if (enabled) {
      if (name === 'Check In' || name == 'Check Out') {
        this.checkincheckout(
          name,
          name == 'Check Out' ? 'checkout' : 'checkin',
          name == 'Check Out' ? false : true,
        );
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

  //static contextType = CallContext;

  /**
   *
   * @param {*} id
   * @param {*} date
   */
  setupfirebase = (id, date, showToast, message) => {
    const {cloneList} = this.state;
    disableOffline();
    const docRef = firebase
      .firestore()
      .collection(Pref.COLLECTION_CHECKIN)
      .doc(`${id}${date}`);

    docRef
      .get()
      .then((result) => {
        if (result.exists) {
          const data = result.data();
          //console.log('datasetup', data);
          if (data) {
            const {breaktime, checkincheckout} = data;
            let evenoddcheck = false;
            let evenoddcheckCheck = false;
            let dataExist = false;
            if (breaktime && breaktime.length > 0) {
              evenoddcheck = Number(breaktime.length) % 2 === 0 ? false : true;
              dataExist = true;
            }
            if (checkincheckout && checkincheckout.length > 0) {
              evenoddcheckCheck =
                Number(checkincheckout.length) % 2 === 0 ? false : true;
              dataExist = true;
            }
            let filterList = [];
            let check = '';
            if (dataExist) {
              filterList = Lodash.map(cloneList, (io) => {
                if (io.name === 'Break' || io.name === 'Resume') {
                  io.name = evenoddcheck ? 'Resume' : 'Break';
                  io.enabled = evenoddcheckCheck ? true : false;
                } else if (io.name === 'Check Out' || io.name === 'Check In') {
                  io.name = evenoddcheckCheck ? 'Check Out' : 'Check In';
                  check = io.name;
                } else if (
                  io.name === 'Start Calling' ||
                  io.name === 'Follow-up'
                ) {
                  io.enabled = evenoddcheckCheck ? true : false;

                  if (evenoddcheck == false && evenoddcheckCheck == false) {
                    io.enabled = false;
                  } else if (evenoddcheck) {
                    io.enabled = false;
                  }
                }
                return io;
              });
            } else {
              filterList = cloneList;
            }

            let checkIn = false;

            if (String(check).toLowerCase().includes('out')) {
              enableIdleService(`${id}${date}`);
              checkIn = true;
              FinproCallModule.startCalling();
            } else {
              checkIn = false;
              stopIdleService();
              FinproCallModule.stopCalling();
            }

            Pref.setVal(Pref.DIALER_SERVICE_ENABLED, checkIn);

            this.setState(
              {
                dataList: filterList,
                loading: false,
                progressLoader: false,
              },
              () => {
                // //listen calls
                // this.context.callListerner();

                if (showToast) {
                  Helper.showToastMessage(message, 1);
                }
              },
            );
          }
        } else {
          docRef.set({
            checkincheckout: [],
            checkin: [],
            checkout: [],
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
      //server date time call
      Helper.networkHelperGet(
        Pref.SERVER_DATE_TIME,
        (datetime) => {
          const checkClientServer = serverClientDateCheck(datetime, false);
          firebase
            .firestore()
            .collection(Pref.COLLECTION_CHECKIN)
            .doc(`${id}${checkClientServer[2]}`)
            .get()
            .then((result) => {
              if (result.exists) {
                let {checkincheckout} = result.data();

                if (checkincheckout === undefined) {
                  checkincheckout = [];
                }

                checkincheckout.push(checkClientServer[1]);

                const obj = {};
                obj.checkincheckout = checkincheckout;

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
                      docName === 'checkin'
                        ? `Checked In Successfully`
                        : `Checked Out Successfully`,
                    );
                  })
                  .catch((e) => {
                    console.log(e);
                    Helper.showToastMessage('Something went wrong!', 0);
                    this.setState({progressLoader: false});
                  });
              }
            });
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
          const checkClientServer = serverClientDateCheck(datetime, false);
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
