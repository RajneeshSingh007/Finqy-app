import {Dimensions, PermissionsAndroid, Platform} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
import NavigationAction from './../util/NavigationActions';
import Moment from 'moment';
import {showMessage, hideMessage} from 'react-native-flash-message';
import * as Pref from './Pref';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import reactNativePushAndroid from 'react-native-push-android';

/**
 *
 * @param props
 */
export const closeCurrentPage = (props) => {
  props.navigation.goBack(null);
};

/**
 * onBackClick navigation..i.e back to homepage
 * @param props
 */
export const backClick = (props) => {
  NavigationAction.navigate('Home');
};

/**
 * onItemClick navigation
 * @private
 * @param props
 * @param val
 */
export const itemClick = (props, val) => {
  NavigationAction.navigate(val);
};

export const passParamItemClick = (props, val, data) => {
  NavigationAction.navigate(val, data);
};

/**
 * return device width
 * @returns {*}
 */
export const deviceWidth = () => {
  return Dimensions.get('window').width;
};

/**
 * return device height
 * @returns {*}
 */
export const deviceHeight = () => {
  return Dimensions.get('window').height;
};

/**
 * Ask permission on android
 * @returns {Promise<void>}
 */
export const requestPermissions = async () => {
  try {
    if (Platform.OS === 'android') {
      const value = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]).then((result) => {
        if (
          result['android.permission.CALL_PHONE'] &&
          result['android.permission.READ_SMS'] &&
          result['android.permission.ACCESS_FINE_LOCATION'] &&
          result['android.permission.READ_EXTERNAL_STORAGE'] &&
          result['android.permission.CAMERA'] &&
          result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
        ) {
          //granted
        } else if (
          result['android.permission.CALL_PHONE'] ||
          result['android.permission.READ_SMS'] ||
          result['android.permission.ACCESS_FINE_LOCATION'] ||
          result['android.permission.READ_EXTERNAL_STORAGE'] ||
          result['android.permission.CAMERA'] ||
          result['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            'never_ask_again'
        ) {
          //ignore
        }
      });
      return value;
    }
  } catch (err) {
    console.warn(err);
  }
};

/**
 * networkHelper
 * @param url
 * @param jsonData
 * @param method
 * @param isTokenPresent
 * @param token
 * @param callback
 * @param errorCallback
 */
export const networkHelper = (
  url,
  jsonData,
  method,
  callback = (responseJson) => {},
  errorCallback = (error) => {},
) => {
  fetch(url, {
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: jsonData,
  })
    .then((response) => response.json())
    .then((responseJson) => {
      callback(responseJson);
    })
    .catch((error) => {
      errorCallback(error);
    });
};

/**
 *
 * @param {*} url
 * @param {*} callback
 * @param {*} errorCallback
 */
export const networkHelperGet = (
  url,
  callback = (responseJson) => {},
  errorCallback = (error) => {},
) => {
  fetch(url, {
    method: 'GET',
  })
    .then((response) => response.text())
    .then((responseJson) => {
      callback(responseJson);
    })
    .catch((error) => {
      errorCallback(error);
    });
};

/**
 * networkHelper
 * @param url
 * @param jsonData
 * @param method
 * @param isTokenPresent
 * @param token
 * @param callback
 * @param errorCallback
 */
export const getNetworkHelper = (
  url,
  method,
  callback = (responseJson) => {},
  errorCallback = (error) => {},
) => {
  fetch(url)
    .then((response) => response.text())
    .then((responseJson) => {
      callback(responseJson);
    })
    .catch((error) => {
      errorCallback(error);
    });
};

/**
 * networkHelper
 * @param url
 * @param jsonData
 * @param method
 * @param isTokenPresent
 * @param token
 * @param callback
 * @param errorCallback
 */
export const networkHelperContentType = (
  url,
  jsonData,
  method,
  callback = (responseJson) => {},
  errorCallback = (error) => {},
) => {
  fetch(url, {
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': `multipart/form-data`,
    },
    body: jsonData,
  })
    .then((response) => response.json())
    .then((responseJson) => {
      callback(responseJson);
    })
    .catch((error) => {
      ////console.log(error);
      errorCallback(error);
    });
};

/**
 * networkHelper
 * @param url
 * @param jsonData
 * @param method
 * @param isTokenPresent
 * @param token
 * @param callback
 * @param errorCallback
 */
export const networkHelperTokenContentType = (
  url,
  jsonData,
  method,
  token,
  callback = (responseJson) => {},
  errorCallback = (error) => {},
) => {
  const options = {
    method: method,
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': `multipart/form-data`,
    },
    body: jsonData,
  };
  fetch(url, options)
    .then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      callback(responseJson);
    })
    .catch((error) => {
      errorCallback(error);
    });
};

/**
 * networkHelper
 * @param url
 * @param method
 * @param token
 * @param callback
 * @param errorCallback
 */
export const networkHelperToken = (
  url,
  method,
  token,
  callback = (responseJson) => {},
  errorCallback = (error) => {},
) => {
  fetch(url, {
    method: method,
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      callback(responseJson);
    })
    .catch((error) => {
      ////console.log(error);
      errorCallback(error);
    });
};

/**
 * networkHelper
 * @param url
 * @param method
 * @param token
 * @param callback
 * @param errorCallback
 */
export const networkHelperTokenPost = (
  url,
  jsonData,
  method,
  token,
  callback = (responseJson) => {},
  errorCallback = (error) => {},
) => {
  fetch(url, {
    method: method,
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: jsonData,
  })
    .then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      callback(responseJson);
    })
    .catch((error) => {
      errorCallback(error);
    });
};

/**
 * finish current screen
 * @param props
 * @param screen
 */
export const navigateAfterFinish = (props, screen) => {
  const navigateAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: screen})],
  });
  props.navigation.dispatch(navigateAction);
};

/**
 * removeQuotes
 * @param text
 * @returns {string}
 */
export const removeQuotes = (text) => {
  if (text && text !== undefined && text !== null) {
    if (text.charAt(0) === '"' && text.charAt(text.length - 1) === '"') {
      return text.substr(1, text.length - 2);
    }
    return text;
  } else {
    return '';
  }
};

/**
 * check if json is object or string
 */
export const checkJson = (item) => {
  item = typeof item !== 'string' ? JSON.stringify(item) : item;

  try {
    item = JSON.parse(item);
  } catch (e) {
    return false;
  }
  if (typeof item === 'object' && item !== null) {
    return true;
  }
  return false;
};

/**
 *
 * @param {*} name
 * @param {*} length
 */
export const subslongText = (name, length) => {
  const size = name.length;
  return size > length ? name.substring(0, length) + '...' : name;
};

export const showToastMessage = (message, type = 0) => {
  showMessage({
    message: message,
    type:
      type === 0
        ? 'danger'
        : type === 1
        ? 'success'
        : type === 2
        ? 'info'
        : 'default',
    icon:
      type === 0
        ? 'danger'
        : type === 1
        ? 'success'
        : type === 2
        ? 'info'
        : 'default',
  });
};

export const isSpecialChar = (text) => {
  return text.includes('<>@!#$%^&*()_+[]{}?:;|\'"\\,./~`-=');
};

export const checkPanCard = (text) => {
  const regex = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
  return regex.test(text.toUpperCase());
};

/**
 *
 * @param {*} HEADER
 * @param {*} data
 * @param {*} callback
 */
export const writeCSV = (HEADER, data, FILEPATH, callback = (bool) => {}) => {
  try {
    const csvString = `${HEADER}${convertToCSV(data)}`;
    RNFetchBlob.fs
      .writeFile(FILEPATH, csvString, 'utf8')
      .then(() => callback(true))
      .catch((error) => callback(false));
  } catch (error) {
    callback(false);
    // Error retrieving data
  }
};

/**
 *
 * @param {*} objArray
 */
export const convertToCSV = (objArray) => {
  // var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  // var str = '';
  // for (var i = 0; i < array.length; i++) {
  //   var line = '';
  //   for (var index in array[i]) {
  //     if (line != '') line += ',';
  //     var obj = array[i][index];
  //     // && !obj.includes("https")
  //     if (typeof obj != 'object') {
  //       line += obj;
  //     } else {
  //       line += '';
  //     }
  //   }
  //   str += line + '\r\n';
  // }
              var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var str = '';

            for (var i = 0; i < array.length; i++) {
                var line = '';
                for (var index in array[i]) {
                    if (line != '') line += ','
                    if(typeof array[i][index]  === 'object'){
                    line += '';
                    }else{
                                          line += array[i][index];

                    }
                }

                str += line + '\r\n';
            }
  return str;
};

/**
 *
 * @param {*} url
 * @param {*} name
 */
export const downloadFile = (url, name) => {
  showToastMessage('Download Started', 1);
  const sp = url.split('/');
  let lsp = sp[sp.length - 1];
  const {config, fs} = RNFetchBlob;
  let DownloadDir = fs.dirs.DownloadDir;
  let options = {
    fileCache: true,
    addAndroidDownloads: {
      title: ``,
      useDownloadManager: true,
      notification: true,
      path: `${DownloadDir}/${lsp.replace('.php', '')}`,
      description: name || '',
    },
  };
  config(options)
    .fetch('GET', `${url}`)
    .then((res) => {
      console.log(`res`, res);
      showToastMessage('Download Complete', 1);
      // do some magic here
    });
};

/**
 *
 * @param {*} url
 * @param {*} name
 */
export const saveFile = (url, name) => {
  showToastMessage('Download Started', 1);
  var Base64Code = url.split('data:image/png;base64,');
  const dirs = RNFetchBlob.fs.dirs;
  var path = dirs.DownloadDir + `/${name.replace(' ', '_')}.png`;
  RNFetchBlob.fs.writeFile(path, Base64Code[1], 'base64').then((res) => {
    if (res > 0) {
      RNFetchBlob.android.addCompleteDownload({
        title: name,
        description: name || '',
        mime: 'image/png',
        path: path,
        showNotification: true,
        notification: true,
      });

      showToastMessage('Download Complete', 1);
    }
  });
};
/**
 *
 * @param {*} start
 * @param {*} end
 */
export const maxminDate = (start = 18, end = 60) => {
  const dateArray = [];
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth();

  const year = currentDate.getFullYear();
  const currentyear = year - start;
  currentDate.setFullYear(currentyear, month, day);
  dateArray.push(currentDate);
  const old = new Date();
  old.setFullYear(currentyear - end, month, day);
  dateArray.push(old);
  return dateArray;
};

/**
 *
 * @param {*} start
 * @param {*} end
 */
export const maxminDateMonth = (minMonth = 3, maxAge = 25) => {
  const dateArray = [];
  const currentDate = new Date();
  const day = currentDate.getDate();
  const currentyear = currentDate.getFullYear();
  const month =
    currentDate.getMonth() > 0
      ? currentDate.getMonth() - minMonth
      : currentDate.getMonth();
  currentDate.setFullYear(currentyear, month, day);
  dateArray.push(currentDate);
  const old = new Date();
  old.setFullYear(currentyear - maxAge, month, day);
  dateArray.push(old);
  return dateArray;
};

/**
 *
 * @param {*} url
 */
export const base64Imageencode = (url) => {
  let imagePath = '';
  RNFetchBlob.config({
    fileCache: true,
  })
    .fetch('GET', `${url}`)
    .then((resp) => {
      return resp.readFile('base64');
    })
    .then((base64Data) => {
      imagePath = base64Data;
      return imagePath;
    });
  return imagePath;
};

/**
 *
 * @param {*} data
 */
export const nullCheck = (data) => {
  return data === undefined || data === null ? true : false;
};

/**
 * string check
 * @param {*} data
 */
export const nullStringCheck = (data) => {
  return data === undefined || data === null || data == '' ? true : false;
};

/**
 * string check
 * @param {*} data
 */
export const nullStringMultiCheck = (...data) => {
  let result = false;
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    if (element === undefined || element === null || element == '') {
      result = true;
      break;
    }
  }
  return result;
};

/**
 *
 * @param {*} dt date
 * @param {*} delimeter  date separator
 */
export const dateObj = (dt, delimeter) => {
  if (nullStringCheck(dt) === false) {
    let sp = dt.split('-');
    const db = new Date();
    db.setFullYear(Number(sp[2]), Number(sp[1])-1, Number(sp[0]));
    return db;
  } else {
    return new Date();
  }
};
