import React, {Component} from 'react';
import {AppRegistry, YellowBox, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {
  Colors,
  DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import stores from './src/mobx';
import {Provider} from 'mobx-react';
import * as Pref from '././src/util/Pref';
import {StatusBar,Platform} from 'react-native';
import codePush from "react-native-code-push";
import NavigationActions from '././src/util/NavigationActions';
import * as Helper from '././src/util/Helper';
import {stopService} from '././src/util/DialerFeature';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Pref.PRIMARY_COLOR,
    accent: Pref.ACCENT_COLOR,
    backgroundColor: Pref.BACKGROUND_COLOR,
    surface: Colors.white,
  },
};

console.disableYellowBox = true;
YellowBox.ignoreWarnings(['VirtualizedList:','Animated: `useNativeDriver`','Require cycle:','Warning:','createStackNavigator']);
LogBox.ignoreAllLogs(true)

StatusBar.setBackgroundColor('white', false);
StatusBar.setBarStyle('dark-content');

function Main() {
  return (
    <Provider {...stores}>
      <PaperProvider theme={theme}>
        <App />
      </PaperProvider>
    </Provider>
  );
}

const releasemode = true;
let codepushKey = Platform.OS === 'ios' ? Pref.STAGING_CODE_PUSH_IOS : Pref.STAGING_CODE_PUSH;
if(releasemode === true){
  codepushKey = Platform.OS === 'ios' ? Pref.PRODUCTION_CODE_PUSH_IOS : Pref.PRODUCTION_CODE_PUSH;
}

const options = {
    updateDialog: {
        title: 'New Update Available',
        appendReleaseDescription: true,
        descriptionPrefix: "Please, Install update to use app",
        mandatoryContinueButtonLabel: 'Ok',
        mandatoryUpdateMessage: "Please, Install update to use app",
        optionalInstallButtonLabel: 'Cancel'
    },
    installMode: codePush.InstallMode.IMMEDIATE,
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
    deploymentKey: codepushKey,
};

/**
 * Dialer Bubble service handler
 * @param {*} data 
 */
const serviceHandler = async( data) =>{
  const {outside} = data;
  if(outside){
    stopService();
    Pref.getVal(Pref.DIALER_TEMP_BUBBLE_NUMBER, phoneNumber =>{
      let outsideAppNumber = ''
      if(Helper.nullStringCheck(phoneNumber) === false){
        outsideAppNumber = phoneNumber;
      }
      NavigationActions.navigate('DialerCalling', {outside:true,editEnabled:true,isFollowup:-1,data:{
        name: '',
        mobile: outsideAppNumber,
        editable: true,
      }});
    });
  }
}
AppRegistry.registerHeadlessTask('ServiceHandler', () =>  serviceHandler);


//Idle Service
const idleServiceHandler = async(data) =>{

}
AppRegistry.registerHeadlessTask('IdleHandler', () => idleServiceHandler);


//firebase
const firebaseBackgroundMessage = async(data) =>{
  
}
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => firebaseBackgroundMessage);

//codepush
AppRegistry.registerComponent(appName, () => codePush(options)(Main));

//main
//AppRegistry.registerComponent(appName, () => Main);
