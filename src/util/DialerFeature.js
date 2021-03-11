import * as Helper from './Helper';
import {Alert} from 'react-native';
import FinproCallModule from '../../FinproCallModule';
import * as Pref from './Pref';

/**
 * ask permission and start Service
 * @param {*} user_role
 */
export const enableCallModule = (startService = false) => {
  Pref.getVal(Pref.DIALER_DATA, data => {                 
    if(Helper.nullCheck(data) === false){
      if (data.length > 0 && Helper.nullCheck(data[0].tc) === false) {
        FinproCallModule.askPermission().then(result => {
          if (result === true) {
            dialerPermissionAndServiceStart(startService);
          } else {
            Alert.alert(
              'Permission Required',
              'We need overlay permission\nPlease, Grant permission from setting.',
              [
                {
                  text: 'DECLINE',
                },
                {
                  text: 'GRANT',
                  onPress: () => dialerPermissionAndServiceStart(startService),
                },
              ],
            );
          }
        });
      }
    }
  });
};

/**
 * ask permission and enable service
 */
export const dialerPermissionAndServiceStart = (enableService) => {
  FinproCallModule.requestCallsPermission().then(op => {
    console.log('op', op);
    if (op === 'success') {
      Pref.setVal(Pref.DIALER_SERVICE_ENABLED, true);  
    } else {
      Alert.alert(
        'Permission Required',
        'Please, Grant CALL LOGS, PHONE CALL permissions',
        [
          {
            text: 'DECLINE',
          },
          {
            text: 'GRANT',
            onPress: () => {
              Helper.requestPermissionsDialer();
            },
          },
        ],
      );
    }
  });
};

/**
 * Stop service
 */
export const stopService = () => {
  FinproCallModule.stopService();
};

/**
 * Start service
 */
export const startService = () =>{
  FinproCallModule.startService();
}

/**
 * 
 */
export const enableService = () =>{
  Pref.getVal(Pref.DIALER_SERVICE_ENABLED, val =>{
    console.log('val', val);
    if(Helper.nullCheck(val) === false){
      startService();
    }
  })
}
