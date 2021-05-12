import {AppRegistry} from 'react-native';
import NavigationActions from '../util/NavigationActions';
import * as Helper from '../util/Helper';
import {enableService, stopService, mobileNumberCleanup} from '../util/DialerFeature';

//Caller Service Handler
const callerServiceHandler = async data => { 
  const {phoneNumber, state} = data;
 
  console.log('callerServiceHandler', state, data, global.dialerCustomerItem, global.dialerScreenName);

  let lowercase = String(state).toLowerCase();

  global.dialerTempNumber = mobileNumberCleanup(phoneNumber);

  if (Helper.nullCheck(global.dialerScreenName) &&(lowercase === 'offhook' || lowercase === 'disconnected')) {
    enableService();
  }else{
    stopService();
  }

  if (Helper.nullCheck(global.dialerCustomerItem) === false) {
    const param = {
      outside: false,
      editEnabled: false,
      isFollowup: -1,
      data: global.dialerCustomerItem,
      callTrack: 1,
    };
    if (global.dialerScreenName === 'DialerCalling') {
      NavigationActions.navigate('DialerCallerForm', param);
    }

    global.dialerCustomerItem = null;
    global.dialerScreenName = '';

  }

};

AppRegistry.registerHeadlessTask(
  'CallerServiceHandler',
  () => callerServiceHandler,
);