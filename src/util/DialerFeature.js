import * as Helper from './Helper';
import {Alert} from 'react-native';
import FinproCallModule from '../../FinproCallModule';
import * as Pref from './Pref';

/**
 * ask permission and start Service
 * @param {*} user_role
 */
export const enableCallModule = (startService = false) => {
  Pref.getVal(Pref.USERTYPE, type => {
    if (type === 'team') {
      Pref.getVal(Pref.userData, value => {
        const {user_role} = value;
        if (Helper.nullStringCheck(user_role) !== '' && user_role === '1') {
          FinproCallModule.askPermission().then(result => {
            if (result === true) {
              dialerPermissionAndServiceStart(startService);
            } else {
              Alert.alert(
                'Permission Required',
                'Call Features enabled for you. For that feature we need overlay permission\nPlease, Grant permission from setting.',
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
      });
    }
  });
};

/**
 * ask permission and enable service
 */
export const dialerPermissionAndServiceStart = (enableService) => {
  FinproCallModule.requestCallsPermission().then(op => {
    if (op === 'success') {
      if(enableService){
        startService();
      }
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

export const startService = (enable) =>{
  FinproCallModule.startService();
}
