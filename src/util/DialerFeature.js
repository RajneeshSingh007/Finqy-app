import * as Helper from './Helper';
import {Alert} from 'react-native';
import FinproCallModule from '../../FinproCallModule';
import * as Pref from './Pref';
import moment from 'moment';
import {firebase} from '@react-native-firebase/firestore';

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
                  onPress:() =>{
                    
                  }
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
    if(Helper.nullCheck(val) === false){
      startService();
    }
  })
}

/**
 * client and server date time check
 * @param {*} serverDate 
 * @returns 
 */
export const serverClientDateCheck = (serverDate, checkClient = false) =>{
  const splitServerTime = serverDate.split(/\s/g);
  const dateServerTime = splitServerTime[0].split(/-/g);
  const currentTime = moment().format('DD-MM-YYYY');
  const splitUserTime = currentTime.split(/-/g);
  const daycheck = Number(dateServerTime[0]) === Number(splitUserTime[0]);
  const monthcheck = Number(dateServerTime[1]) === Number(splitUserTime[1]);
  const yearcheck = Number(dateServerTime[2]) === Number(splitUserTime[2]);
  let serverDateTime = [splitServerTime[0], splitServerTime[1], splitServerTime[0].replace(/-/g, '')];

  if(checkClient){
    if (daycheck && monthcheck && yearcheck) {
      return serverDateTime;
    }else{
      return [];
    }
  }else{
    return serverDateTime;
  }
}

/**
 * mobile number cleanup
 * @param {*} number 
 * @returns 
 */
export const mobileNumberCleanup = (number = '') =>{
  if(Helper.nullStringCheck(number) === false){
    const rep = number.replace(/\s/g, '').replace(/\+91/g, '');
    return rep;
  }
  return '';
}

export const totalTimeinMinutes = (date, firstTime, secondTime) =>{
  const firstTimeSp = `${date} ${firstTime}`;
  const secondTimeSp = `${date} ${secondTime}`;
  const minutes = moment(firstTimeSp).getDate();
}

export const disableOffline = () =>{
  firebase.firestore()
    .settings({persistence:false});
}

/**
 * start idle Service
 * @param {*} date 
 */
export const enableIdleService = (date) =>{
  const obj = {date:date};
  FinproCallModule.startIdleService(obj).then(res =>{
    console.log(res)
  }).catch(e =>{
    console.log(e);
  })
}

/**
 * stop idle Service
 */
 export const stopIdleService = () =>{
  FinproCallModule.stopIdleService().then(res =>{
    console.log(res)
  }).catch(e =>{
    console.log(e);
  })
}