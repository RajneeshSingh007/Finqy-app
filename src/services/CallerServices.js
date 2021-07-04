import {AppRegistry} from 'react-native';
import NavigationActions from '../util/NavigationActions';
import * as Helper from '../util/Helper';
import {
  enableService,
  stopService,
  mobileNumberCleanup,
} from '../util/DialerFeature';

//Caller Service Handler
const callerServiceHandler = async (data) => {
  const {phoneNumber, state} = data;

  global.dialerCallDisconnected = 1;

  let lowercase = String(state).toLowerCase();

  global.dialerTempNumber = mobileNumberCleanup(phoneNumber);

  console.log(global.dialerFormSubmitted, global.dialerScreenName, global.dialerCallDisconnected);

  if(lowercase === 'disconnected'){
    global.dialerCallDisconnected = 2;
  }

  if (lowercase === 'disconnected' || lowercase === 'offhook') {
    if (Helper.nullCheck(global.dialerScreenName) === false) {
      stopService();
    } else {
      if(global.dialerCallDisconnected === 1){
        enableService();
      }else{
        stopService();       
      }
    }
  } else {
    stopService();
  }

  if(global.dialerCallDisconnected === 2){
    stopService();  
  }


  if (Helper.nullCheck(global.dialerCustomerItem) === false) {
    if (global.dialerScreenName === 'DialerCalling') {
      const param = {
        outside: false,
        editEnabled: false,
        isFollowup: -1,
        data: global.dialerCustomerItem,
        callTrack: 1,
      };
      NavigationActions.navigate('DialerCallerForm', param);
    }
  }

  delete global.dialerCustomerItem;
  delete global.dialerScreenName;
};

AppRegistry.registerHeadlessTask(
  'CallerServiceHandler',
  () => callerServiceHandler,
);
