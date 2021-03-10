/** @format */

import React, {Component} from 'react';
import {AppRegistry, YellowBox} from 'react-native';
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
YellowBox.ignoreWarnings(['Animated: `useNativeDriver`']);
YellowBox.ignoreWarnings(['VirtualizedList:']);
YellowBox.ignoreWarnings(['Require cycle:']);

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

const serviceHandler = async( data) =>{
  //console.log(data);
  const {outside} = data;
  if(outside){
    NavigationActions.navigate('DialerCalling', {editEnabled:true,isFollowup:-1,data:{
      name: '',
      mobile: '',
      editable: true,
    }});
  }
}

//AppRegistry.registerHeadlessTask('ServiceHandler', () =>  serviceHandler);

AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => firebaseBackgroundMessage);

AppRegistry.registerComponent(appName, () => codePush(options)(Main));

//AppRegistry.registerComponent(appName, () => Main);
