import * as React from 'react';
import {
  StatusBar,
  View,
  BackHandler,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import {AppContainer} from './src/util/AppRouter';
import NavigationActions from './src/util/NavigationActions';
import {inject, observer} from 'mobx-react';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import FlashMessage from 'react-native-flash-message';
import CodePush from 'react-native-code-push';
import Loader from './src/util/Loader';
import Crashes from 'appcenter-crashes';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import {
  notifications,
  NotificationMessage,
  Android,
} from 'react-native-firebase-push-notifications';
import * as Helper from './src/util/Helper';
import * as Pref from './src/util/Pref';
import {
  enableCallModule,
  enableService,
  stopService,
  serverClientDateCheck,
  mobileNumberCleanup,
  enableIdleService,
  stopIdleService,
} from './src/util/DialerFeature';
import CallDetectorManager from 'react-native-call-detection';
import {firebase} from '@react-native-firebase/firestore';
import moment from 'moment';

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.serverDateTime = [];
    changeNavigationBarColor('white', true);
    StatusBar.setBackgroundColor('white', false);
    StatusBar.setBarStyle('dark-content');
    this.state = {
      restartAllowed: true,
      downloading: -1,
    };
  }

  componentDidMount() {
    //this.syncImmediate();
    
    Crashes.setEnabled(true);

    analytics().setAnalyticsCollectionEnabled(true);

    crashlytics().setCrashlyticsCollectionEnabled(true);

    this.onNotificationListener();

    this.checkVersionForUpdate();

    //dialer
    this.callDetectionListerner();

    //this.dialerCheckCheckin();
    //stopService();
    //enableIdleService();
    //stopIdleService();
  }

  /**
   *
   */
  onNotificationListener = () => {
    this.removeOnNotification = notifications.onNotification(
      (notification) => {},
    );
  };

  /**
   * call detection
   */
  callDetectionListerner = () => {
    this.callDetection = new CallDetectorManager((event, phoneNumber) => {
      //console.log('event', event);
      //if(event === 'Incoming' || event === 'Connected' || event === 'Disconnected' || event === 'Missed'){
      if (Helper.nullStringCheck(phoneNumber) === false) {
        Pref.setVal(
          Pref.DIALER_TEMP_BUBBLE_NUMBER,
          mobileNumberCleanup(phoneNumber),
        );
      }
      Pref.getVal(Pref.DIALER_DATA, (value) => {
        console.log('ddata', value);
        if (
          Helper.nullCheck(value) == false &&
          value.length > 0 &&
          Helper.nullCheck(value[0].tc) === false
        ) {
          const {checkin} = value[0].tc;
          if (checkin) {
            enableService();
          } else {
            stopService();
          }
          //const {id} = value[0].tc;
          //   if(this.serverDateTime.length > 0){
          //     firebase
          //       .firestore()
          //       .collection(Pref.COLLECTION_CHECKIN)
          //       .doc(`${id}${this.serverDateTime[2]}`)
          //       .get()
          //       .then(ret =>{
          //         if(ret){
          //           const {breaktime, checkincheckout} = ret.data();
          //                       let evenoddcheck = false;
          // let evenoddcheckCheck = false;
          // let dataExist = false;
          // if (breaktime && breaktime.length > 0) {
          //   evenoddcheck = Number(breaktime.length) % 2 === 0 ? false : true;
          //   dataExist = true;
          // }
          // if (checkincheckout && checkincheckout.length > 0) {
          //   evenoddcheckCheck = Number(checkincheckout.length) % 2 === 0 ? false : true;
          //   dataExist = true;
          // }
          //           if(Helper.nullStringCheck(checkin) === false && Helper.nullStringCheck(checkout) === false){
          //             stopService();
          //           }else if(Helper.nullStringCheck(checkin) === false && Helper.nullStringCheck(checkout)){
          //             enableService();
          //           }
          //         }
          //       })
          //   }
        } else {
          stopService();
        }
      });
      //}
    }, false);
  };

  /**
   * check server client date and time
   * and store date in array
   */
  dialerCheckCheckin = () => {
    Helper.networkHelperGet(Pref.SERVER_DATE_TIME, (datetime) => {
      const checkClientServer = serverClientDateCheck(datetime, true);
      if (checkClientServer.length > 0) {
        this.serverDateTime = checkClientServer;
      }
    });
  };

  /**
   * check app version for update dialog
   */
  checkVersionForUpdate = () => {
    Helper.getNetworkHelper(
      Pref.UPDATE_DIALOG,
      Pref.methodGet,
      (result) => {
        CodePush.getConfiguration().then(({appVersion}) => {
          if (result !== appVersion) {
            Alert.alert(
              'New version available',
              'Please, update app to new version to continue',
              [
                {
                  text: 'UPDATE',
                  onPress: () => {
                    if (Platform.OS === 'android') {
                      Linking.openURL(`${Pref.APP_PLAY_STORE_LINK}`);
                    }
                    BackHandler.exitApp();
                  },
                },
              ],
            );
          }
        });
      },
      (error) => {},
    );
  };

  componentWillUnmount() {
    if (this.removeOnNotification) {
      this.removeOnNotification();
    }
    if (this.callDetection !== undefined) this.callDetection.dispose();
  }

  codePushStatusDidChange(syncStatus) {
    switch (syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        this.setState({downloading: -1});
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        this.setState({downloading: 1});
        break;
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        this.setState({downloading: 1});
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        this.setState({downloading: 1});
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        this.setState({downloading: -1});
        break;
      case CodePush.SyncStatus.UPDATE_IGNORED:
        this.setState({downloading: -1});
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        this.setState({downloading: 2});
        break;
    }
  }

  codePushDownloadDidProgress() {}

  syncImmediate() {
    CodePush.sync(
      {installMode: CodePush.InstallMode.IMMEDIATE, updateDialog: true},
      this.codePushStatusDidChange.bind(this),
      this.codePushDownloadDidProgress.bind(this),
    );
  }

  codepushDialog = () => {
    const {downloading} = this.state;
    return <Loader isShow={downloading === 1 ? true : false} />;
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <AppContainer
          ref={(ref) => NavigationActions.setTopLevelNavigator(ref)}
          onNavigationStateChange={this.handleNavigationChange}
        />

        <FlashMessage position="bottom" />
        {this.codepushDialog()}
      </View>
    );
  }

  handleNavigationChange = (prevState, newState) => {
    const currentScreen = getActiveRouteName(newState);
    const prevScreen = getActiveRouteName(prevState);
    if (prevScreen !== currentScreen) {
      this.props.navigationStore.onChangeNavigation(prevScreen, currentScreen);
    }
  };
}

const getActiveRouteName = (navigationState) => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
};

export default inject('navigationStore')(observer(App));
