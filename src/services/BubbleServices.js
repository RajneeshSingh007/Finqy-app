import {AppRegistry} from 'react-native';
import NavigationActions from '../util/NavigationActions';
import * as Helper from '../util/Helper';
import {stopService} from '../util/DialerFeature';

//stop bubble
stopService();

/**
 * Bubble service handler
 */
const floatingServiceHandler = async (data) => {
  // console.log('floatingServiceHandler', data, global.dialerTempNumber);
  const {outside} = data;
  if (outside) {
    stopService();
    let phoneNumbers = '';
    if(Helper.nullCheck(global.dialerTempNumber) === false){
      phoneNumbers = global.dialerTempNumber;
    }
    const param = {
      outside: true,
      editEnabled: true,
      isFollowup: -1,
      data: {
        name: '',
        mobile: phoneNumbers,
        editable: true,
      },
    };
    NavigationActions.navigate('DialerCallerForm', param);
    delete global.dialerTempNumber;
  }
};
AppRegistry.registerHeadlessTask(
  'FloatingServiceHandler',
  () => floatingServiceHandler,
);
