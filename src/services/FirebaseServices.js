import {AppRegistry} from 'react-native';

//firebase
const firebaseBackgroundMessage = async data => {};
AppRegistry.registerHeadlessTask(
  'RNFirebaseBackgroundMessage',
  () => firebaseBackgroundMessage,
);

const firebaseMessagingHeadlessTask = async data => {};
AppRegistry.registerHeadlessTask(
  'ReactNativeFirebaseMessagingHeadlessTask',
  () => firebaseMessagingHeadlessTask,
);