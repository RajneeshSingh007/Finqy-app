import React from 'react';
import CallContext from './CallContext';
import {
  stopService,
  enableService,
  stopIdleService,
  mobileNumberCleanup,
  serverClientDateCheck,
  enableIdleService,
} from '../../../util/DialerFeature';
import CallDetectorManager from 'react-native-call-detection';
import { AppState } from 'react-native';
import * as Pref from '../../../util/Pref';
import * as Helper from '../../../util/Helper';
import NavigationActions from '../../../util/NavigationActions';
import FinproCallModule from '../../../../FinproCallModule';
import SendIntentAndroid from 'react-native-send-intent';

export default class GlobalCallListerner extends React.Component {
  constructor(props) {
    super(props);
    this.callingListen = this.callingListen.bind(this);
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
    this.serverDateTime = [];
    this.userID = null;
    this.screenName = '';
    this.customerData = null;
    this.appState = AppState.currentState;

    Pref.getVal(Pref.DIALER_DATA, (data) => {
      if (Helper.nullCheck(data) === false && data.length > 0) {
        if (
          Helper.nullCheck(data[0]) === false &&
          Helper.nullCheck(data[0].tc) === false
        ) {
          const { id } = data[0].tc;
          this.userID = id;
        }
      }
    });
  }

  componentDidMount() {
    console.log('c');
    Helper.networkHelperGet(
      Pref.SERVER_DATE_TIME,
      (datetime) => {
        const checkClientServer = serverClientDateCheck(datetime, true);
        if (checkClientServer.length > 0) {
          this.serverDateTime = checkClientServer;
        }
        this.callListerner();
      },
      (error) => {
        this.callListerner();
      },
    );
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnMount() {
    this.stopServicesCaller();
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  componentDidUpdate(){
    console.log('update');
  }

  _handleAppStateChange = (nextAppState) => {
    this.appState = nextAppState;
  };

  callListerner = () => {
    console.log('ccall');
    if (this.appState === 'active') {
      this.stopServicesCaller();
    }

    Pref.getVal(Pref.DIALER_SERVICE_ENABLED, (value) => {
      if ((value == undefined && value === null) || value == false) {
        stopIdleService();
      } else {
        FinproCallModule.startCalling();
        // if (this.userID != null && this.serverDateTime.length > 0) {
        //   enableIdleService(`${this.userID}${this.serverDateTime[2]}`);
        // }
        //CallDetectorManager.listenCalls(this.callingListen, false);
      }
    });
  };

  callingListen = (event, phoneNumber) => {
    let lowercase = String(event).toLowerCase();

    Pref.setVal(Pref.DIALER_TEMP_BUBBLE_NUMBER, phoneNumber);

    console.log('event', event, phoneNumber, this.appState);

    if (this.appState === 'active') {
      stopService();
    }
    if (this.screenName === '' && (lowercase === 'connected' || lowercase === 'disconnected')) {
      enableService();
    }

    if (lowercase === 'connected' || lowercase === 'disconnected') {
      if (Helper.nullCheck(this.customerData) === false) {
        const param = {
          outside: false,
          editEnabled: false,
          isFollowup: -1,
          data: this.customerData,
          callTrack: 1,
        };
        if (this.screenName === 'DialerCalling') {
          NavigationActions.navigate('DialerCallerForm', param);
          this.screenName = '';
          this.customerData = null;

        }
      }
    }
  };

  stopServicesCaller = () => {
    this.screenName = '';
    this.customerData = null;
    stopService();
    stopIdleService();
    CallDetectorManager.dispose();
  };

  dialerCallback = (
    value = '',
    customerData = null,
    isWhatsapp = false,
    videocall = false,
  ) => {
    stopIdleService();
    if (isWhatsapp === false && customerData != null) {
      const { mobile } = customerData;
      this.screenName = value;
      this.customerData = customerData;
      FinproCallModule.phoneCall('8169186245');
    }else if (isWhatsapp && customerData != null) {
      this.screenName = value;
      this.customerData = customerData;
      const param = {
        outside: false,
        editEnabled: false,
        isFollowup: -1,
        data: this.customerData,
        callTrack: 1,
      };
      NavigationActions.navigate('DialerCallerForm', param);
      this.screenName = '';
      this.customerData = null;
    }
  };

  render() {
    return (
      <CallContext.Provider
        value={{
          callListerner: () => this.callListerner(),
          dialerCallback: () => this.dialerCallback(),
        }}>
        {this.props.children}
      </CallContext.Provider>
    );
  }
}
