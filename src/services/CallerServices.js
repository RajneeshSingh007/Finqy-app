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

  console.log(
    'callerServiceHandler',
    state,
    data,
    global.dialerCustomerItem,
    global.dialerScreenName,
    Helper.nullCheck(global.dialerScreenName),
  );

  let lowercase = String(state).toLowerCase();

  global.dialerTempNumber = mobileNumberCleanup(phoneNumber);

  if (
    Helper.nullCheck(global.dialerScreenName) &&
    (lowercase === 'offhook' || lowercase === 'disconnected')
  ) {
    enableService();
  } else {
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
