import {AppRegistry} from 'react-native';

//Idle Service
const idleServiceHandler = async(data) => {
    console.log('idleServiceHandler', data);
};
AppRegistry.registerHeadlessTask(
  'IdleServiceHandler',
  () => idleServiceHandler,
);