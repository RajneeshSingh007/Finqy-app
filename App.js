import * as React from 'react';
import {StatusBar, View, BackHandler, Alert, Linking,Platform, AppState} from 'react-native';
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
import { enableCallModule,enableService, stopService } from './src/util/DialerFeature';
import CallDetectorManager from 'react-native-call-detection';

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
    changeNavigationBarColor('white', true);
    StatusBar.setBackgroundColor('white', false);
    StatusBar.setBarStyle('dark-content');
    this.state = {restartAllowed: true, downloading: -1,appState:AppState.currentState};
  }

  componentDidMount() {
   
    this.checkVersionForUpdate(); 

    Crashes.setEnabled(true);
    
    analytics().setAnalyticsCollectionEnabled(true);
    
    crashlytics().setCrashlyticsCollectionEnabled(true);

    //this.syncImmediate();

    //stopService();
    //enableCallModule(true);

    //AppState.addEventListener('change', this._handleAppStateChange);
  
    this.onNotificationListener();

    //this.callDetectionListerner();

  }

  /**
   * 
   */
  onNotificationListener = () => {
    this.removeOnNotification = notifications.onNotification(
      notification => {
      },
    );
  }

  callDetectionListerner = () =>{
    this.callDetection = new CallDetectorManager(
      (event, phoneNumber) => {
        console.log('event', event);
        enableService();
      },
      true,
      () => {},
      {
        title: 'Phone Permission Required For Dialer',
        message:'This app needs access to your phone state in order to use this feature',
      },
    );
  }


  /**
   * check app version for update dialog
   */
  checkVersionForUpdate = () =>{
    Helper.getNetworkHelper(Pref.UPDATE_DIALOG, Pref.methodGet, result =>{
      CodePush.getConfiguration().then(({appVersion}) =>{
        if(result !== appVersion){
          Alert.alert('New version available', 'Please, update app to new version to continue', [
            {
              text:'UPDATE',
              onPress:() =>{
                if(Platform.OS === 'android'){
                  Linking.openURL(`${Pref.APP_PLAY_STORE_LINK}`)
                }
                BackHandler.exitApp();
              }
            }
          ]);
        }
      })  
    }, error =>{
    })
    
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      stopService();
    }else{
      stopService();
    }
    this.setState({appState: nextAppState});
  };


  componentWillUnmount() {
    //AppState.removeEventListener('change', this._handleAppStateChange);
    
    if (this.removeOnNotification) {
      this.removeOnNotification();
    }

    //if(this.callDetection !== undefined) this.callDetection.dispose();

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
          ref={ref => NavigationActions.setTopLevelNavigator(ref)}
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

const getActiveRouteName = navigationState => {
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
