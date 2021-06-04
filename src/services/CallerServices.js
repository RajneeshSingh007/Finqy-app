import {AppRegistry} from 'react-native';
import NavigationActions from '../util/NavigationActions';
import * as Helper from '../util/Helper';
import {
  enableService,
  stopService,
  mobileNumberCleanup,
} from '../util/DialerFeature';
import FinproCallModule from '../../FinproCallModule';

//Caller Service Handler
const callerServiceHandler = async (data) => {
  const {phoneNumber, state} = data;

  // console.log(
  //   'callerServiceHandler',
  //   state,
  //   data,
  //   global.dialerCustomerItem,
  //   global.dialerScreenName,
  //   Helper.nullCheck(global.dialerScreenName),
  //   global.dialerFormSubmitted,
  //   global.dialerCheckIn,
  // );

  let lowercase = String(state).toLowerCase();

  global.dialerTempNumber = mobileNumberCleanup(phoneNumber);

  if (
    Helper.nullCheck(global.dialerScreenName) &&
    (lowercase === 'offhook' || lowercase === 'disconnected')
  ) {
    if (Helper.nullCheck(global.dialerFormSubmitted) === false) {
      stopService();
    } else {
      enableService();
    }
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
  delete global.dialerFormSubmitted;
};

AppRegistry.registerHeadlessTask(
  'CallerServiceHandler',
  () => callerServiceHandler,
);
