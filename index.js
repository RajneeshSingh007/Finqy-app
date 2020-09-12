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
import {StatusBar} from 'react-native';
import codePush from "react-native-code-push";

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

const options = {
    updateDialog: {
        title: 'Update Avaialble',
        appendReleaseDescription: true,
        descriptionPrefix: "Please, Install update to use app",
        mandatoryContinueButtonLabel: 'Ok',
        mandatoryUpdateMessage: "Please, Install update to use app",
        optionalInstallButtonLabel: 'Cancel'
    },
    installMode: codePush.InstallMode.IMMEDIATE,
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
    deploymentKey: Pref.PRODUCTION_CODE_PUSH,
};

AppRegistry.registerComponent(appName, () => codePush(options)(Main));

//AppRegistry.registerComponent(appName, () => Main);
