import React from 'react';
import {
  StyleSheet,
  PermissionsAndroid,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import {Title, View} from '@shoutem/ui';
import * as Helper from '../../../util/Helper';
import * as Pref from '../../../util/Pref';
import {Colors, Button, Portal} from 'react-native-paper';
import {sizeHeight, sizeWidth} from '../../../util/Size';
import moment from 'moment';
import AnimatedInputBox from '../../component/AnimatedInputBox';
import NewDropDown from '../../component/NewDropDown';
import OptionsDialog from '../../component/OptionsDialog';
import CallLogs from 'react-native-call-log';
import NavigationActions from '../../../util/NavigationActions';
import FlashMessage from 'react-native-flash-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';
import ModalDialog from '../../component/ModalDialog';
import {firebase} from '@react-native-firebase/firestore';
import {
  disableOffline,
  serverClientDateCheck,
} from '../../../util/DialerFeature';

let trackTypeList = [
  {
    value: 'Contactable',
  },
  {
    value: 'Non-Contactable',
  },
];

let trackTypeDetailContactableList = [
  {
    value: 'Interested',
  },
  {
    value: 'Not Interested',
  },
  {
    value: 'Follow-up',
  },
];

let trackTypeDetailNonContactableList = [
  {
    value: 'Ringing',
  },
  {
    value: 'Not Reachable',
  },
  {
    value: 'Wrong Number',
  },
];

export default class CallerForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.statusSelection = this.statusSelection.bind(this);
    this.productSelection = this.productSelection.bind(this);
    this.onChange = this.onChange.bind(this);
    const currentdate = moment().toDate();
    const maxDate = moment().add(1, 'months').toDate();
    this.serverDateTime = [];
    this.flashMessage = React.createRef();
    this.formSubmit = this.formSubmit.bind(this);
    this.contactDialogClicked = this.contactDialogClicked.bind(this);
    this.noncontactDialogClicked = this.noncontactDialogClicked.bind(this);
    this.outsideAgainsetup = false;
    this.state = {
      name: '',
      mobile: '',
      email: '',
      dob: '',
      pincode: '',
      trackingType: '',
      trackingDetail: '',
      product: '',
      remarks: '',
      showContactDialog: false,
      showNonContactDialog: false,
      clickedBtn: 0,
      callLogs: [],
      callDur: 0,
      showCalendar: false,
      currentDate: currentdate,
      showdatesx: currentdate,
      maxDates: maxDate,
      mode: 'date',
      currentTime: '',
      followup_date_time: '',
      editable: false,
      confirmModal: false,
    };
  }

  onChange = (event, selectedDate) => {
    if (selectedDate !== undefined && selectedDate !== null) {
      if (this.state.mode == 'date') {
        const current = moment(selectedDate).format('DD-MM-YYYY');
        this.setState({
          showdatesx: selectedDate,
          mode: 'time',
          intervaltime: 30,
          followup_date_time: current,
          //showCalendar: false,
        });
      } else {
        const hours = selectedDate.getHours();
        const time = selectedDate.getMinutes();
        //if (hours >= 10 && hours <= 18) {
        this.state.showdatesx.setHours(hours, time, 0, 0);
        const current = moment(this.state.showdatesx).format(
          'DD-MM-YYYY hh:mm A',
        );
        this.setState({
          followup_date_time: current,
          mode: 'date',
          showCalendar: false,
        });
        // } else {
        //   alert('Please, select time between 10AM - 7PM');
        //   this.setState({showCalendar: false, mode: 'date'});
        // }
      }
    } else {
      this.setState({showCalendar: false, mode: 'date'});
    }
  };

  //static contextType = CallContext;

  componentDidMount() {
    //this.context.dialerCallback('', null, false, false);

    //Pref.setVal(Pref.DIALER_TEMP_CUSTOMER_DATA, null);

    this.setupData();
  }

  setupData = () => {
    const {
      editItemRestore = null,
      editEnabled = false,
      customerItem,
    } = this.props;
    if (Helper.nullCheck(editItemRestore) === false) {
      this.restoreData(editItemRestore);
    }

    //console.log('customerItem', customerItem, editEnabled);

    Helper.networkHelperGet(Pref.SERVER_DATE_TIME, (datetime) => {
      this.serverDateTime = serverClientDateCheck(datetime, false);
    });

    const {
      mobile = '',
      name = '',
      editable = false,
      email = '',
      dob = '',
      pincode = '',
    } = customerItem;

    //ask permissions
    if (editEnabled === false) {
      this.setState({
        name: name,
        mobile: mobile,
        editable:
          Helper.nullStringCheck(name) && Helper.nullStringCheck(mobile)
            ? true
            : editable,
        email: email,
        dob: dob,
        pincode: pincode,
        trackingType: '',
        trackingDetail: '',
        product: '',
        remarks: '',
      });
    } else {
      let trackingType = '';
      let trackingDetail = '';
      let product = '';
      let remarks = '';
      if (Helper.nullStringCheck(customerItem.tracking_type_detail) === false) {
        trackingDetail = customerItem.tracking_type_detail;
      }

      if (Helper.nullStringCheck(customerItem.tracking_type) === false) {
        trackingType =
          customerItem.tracking_type === '0'
            ? 'Contactable'
            : 'Non-Contactable';
      }

      if (Helper.nullStringCheck(customerItem.product) === false) {
        product = customerItem.product;
      }

      if (Helper.nullStringCheck(customerItem.remarks) === false) {
        remarks = customerItem.remarks;
      }

      this.setState({
        name: name,
        mobile: mobile,
        editable: editable,
        email: email,
        dob: dob,
        pincode: pincode,
        trackingType: trackingType,
        trackingDetail: trackingDetail,
        product: product,
        remarks: remarks,
      });
    }
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CALL_LOG, {
        title: 'Permission Required',
        message: 'We required to access your call logs',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }).then((result) => {
        //console.log('result', result);
        if (result === 'granted') {
          let numberArray = [];
          if (Helper.nullStringCheck(mobile) === false) {
            let trimnumber = mobile.trim();
            numberArray.push(`+91${trimnumber}`);
            numberArray.push(trimnumber);
            numberArray.push(
              `${trimnumber.slice(0, 6)} ${trimnumber.slice(5, trimnumber.length)}`,
            );
            numberArray.push(`+91 ${trimnumber}`);
            numberArray.push(
              `+91 ${trimnumber.slice(0, 6)} ${trimnumber.slice(
                5,
                trimnumber.length,
              )}`,
            );
            CallLogs.load(-1, {
              phoneNumbers: numberArray,
            }).then((c) => {
              console.log('c', c);
              let callDur = 0;
              if (c.length > 0) {
                const {duration} = c[0];
                if (callDur > 60) {
                  callDur = Number(duration / 60).toPrecision(3);
                } else {
                  callDur = Number(duration);
                }
              }
              this.setState({
                callLogs: c,
                callDur: callDur,
              });
            });
          }
        }
      });
    }
  };

  componentDidUpdate() {
    const {customerItem} = this.props;
    const cItem = this.state;
    if (customerItem.mobile != '' && cItem.mobile === '') {
      this.setupData();
    } else if (
      customerItem.mobile != '' &&
      cItem.mobile !== '' &&
      customerItem.mobile !== cItem.mobile
    ) {
      this.setupData();
    } else if (this.outsideAgainsetup === false) {
      this.outsideAgainsetup = true;
      this.setupData();
    }
  }

  restoreData(obj) {
    if (Helper.nullCheck(obj) === false) {
      this.setState(obj);
    }
  }

  contactDialogClicked = (value) => {
    //console.log(value);
    this.setState({trackingDetail: value, showContactDialog: false});
  };

  noncontactDialogClicked = (value) => {
    this.setState({trackingDetail: value, showNonContactDialog: false});
  };

  showalertMessage = (msg) => {
    if (this.flashMessage.current && this.flashMessage.current.showMessage) {
      this.flashMessage.current.showMessage({
        message: msg,
        type: 'danger',
        icon: 'danger',
        duration: 7000,
        animated: true,
        floating: true,
      });
    }
  };

  formSubmit = () => {
    const {
      customerItem,
      token,
      userData,
      editEnabled = false,
      teamName = '',
    } = this.props;
    if ((customerItem === null || token == null, userData == null)) {
      this.showalertMessage('Something went wrong!');
      return false;
    }
    let id = '',
      team_id = '',
      user_id = '';
    if (Helper.nullCheck(customerItem.user_id) === true) {
      user_id = userData.id;
      team_id = '';
      id = '';
    } else {
      id = customerItem.id;
      team_id = customerItem.team_id;
      user_id = customerItem.user_id;
    }
    const {
      product,
      remarks,
      trackingType,
      clickedBtn,
      trackingDetail,
      callLogs,
      callDur,
      name,
      mobile,
      followup_date_time,
      dob,
      email,
      pincode,
    } = this.state;

    //console.log('product', product);

    let checkData = true;
    if (name === '') {
      checkData = false;
      this.showalertMessage('Name empty');
      //alert('Name empty');
    } else if (mobile === '') {
      checkData = false;
      this.showalertMessage('Mobile empty');
    } else if (
      mobile.length < 10 ||
      //|| mobile === '9876543210' ||
      mobile === '0000000000'
      //|| mobile === '1234567890'
    ) {
      errorData = false;
      this.showalertMessage('Invalid mobile number');
    } else if (trackingType === '') {
      checkData = false;
      this.showalertMessage('Please, Select Status');
    }
    //trackingType == 'Contactable' && trackingDetail === 'Interested' &&
    else if (product === '') {
      checkData = false;
      this.showalertMessage('Please, Select Product');
    } else if (
      trackingType == 'Contactable' &&
      trackingDetail === 'Follow-up' &&
      followup_date_time === ''
    ) {
      checkData = false;
      this.showalertMessage('Please, Enter Appointment Date & Time');
    }
    // else if (remarks === '') {
    //   checkData = false;
    //   alert('Remark Empty');
    // }

    if (checkData && clickedBtn == 0) {
      this.setState({clickedBtn: 1});
      this.props.startLoader(true, -1);

      let body = JSON.parse(JSON.stringify(this.state));
      delete body.showContactDialog;
      delete body.showNonContactDialog;
      delete body.showCalendar;
      delete body.currentDate;
      delete body.showdatesx;
      delete body.maxDates;
      delete body.mode;
      delete body.currentTime;
      delete body.confirmModal;

      const dates = new Date();
      const dateFormat = moment(dates).format('DD-MM-YYYY HH:mm:ss');

      body.active = 1;

      let leadConfirm = -1;

      if (trackingType == 'Contactable') {
        body.trackingType = 0;
      } else {
        body.trackingType = 1;
        body.active = 0;
      }

      if (trackingType == 'Contactable' && trackingDetail === 'Interested') {
        leadConfirm = 1;
      }

      body.leadConfirm = leadConfirm;
      body.callDate = dateFormat;
      body.customerId = id;
      body.teamID = team_id;
      body.userID = user_id;
      body.callLogs = callLogs;
      body.callDur = callDur;
      body.name = name;
      body.mobile = mobile;
      body.editmode = editEnabled === true ? '1' : '0';
      body.followup_date_time = followup_date_time;
      body.tname = teamName;
      if (body.customerId == undefined) {
        body.customerId = '';
      }
      if (callLogs.length == 0) {
        body.callLogs = '';
      }

      // let formName = product.trim().toLowerCase().replace(/\s/g, '_');

      // const formUrls = `${Pref.FinorbitFormUrl}${formName}.php`;

      // const formData = new FormData();
      // formData.append(formName, formName);
      // formData.append('formid', '');
      // formData.append('name', name);
      // formData.append('mobile', mobile);
      // formData.append('remark', remarks);

      // if (Helper.nullCheck(userData.refercode) === false) {
      //   const {refercode} = userData;
      //   formData.append('ref', refercode);
      // }

      //console.log('formData', formData, formUrls);

      //console.log(body);

      Helper.networkHelperTokenPost(
        Pref.DIALER_LEAD_UPDATE,
        JSON.stringify(body),
        Pref.methodPost,
        token,
        (result) => {
          console.log('result', result);
          const {status, message, id} = result;
          if (status == true) {
            Pref.setVal(Pref.DIALER_TEMP_BUBBLE_NUMBER, '');
            //live update
            if (this.serverDateTime.length > 0) {
              if (Helper.nullStringCheck(id) === false) {
                disableOffline();
                firebase
                  .firestore()
                  .collection(Pref.COLLECTION_CHECKIN)
                  .doc(`${user_id}${this.serverDateTime[2]}`)
                  .set({lead: Number(id)}, {merge: true});
              }
            }

            if (leadConfirm === 1) {
              //navigate to finorbit form
              NavigationActions.navigate('FinorbitForm', {
                title: product,
                dialerMobile: mobile,
                dialerName: name,
                dialerDob: dob,
                dialerEmail: email,
                dialerPincode: pincode,
              });

              // Helper.networkHelperTokenContentType(
              //   formUrls,
              //   formData,
              //   Pref.methodPost,
              //   token,
              //   result => {
              //     console.log('results', result);
              //     const {response_header} = result;
              //     const {res_type} = response_header;
              //     if (res_type === 'success') {
              //       this.props.startLoader(false, 0);
              //       NavigationActions.navigate('Finish', {
              //         top:
              //           editEnabled === true
              //             ? 'Edit Details'
              //             : 'Customer Details',
              //         red: 'Success',
              //         grey: `Lead ${
              //           editEnabled === true ? 'updated' : 'uploaded'
              //         } successfully`,
              //         blue: 'Go back',
              //         back:
              //           editEnabled === true
              //             ? 'DialerRecords'
              //             : 'DialerCalling',
              //         options: editEnabled === true ? {active: -1} : {},
              //       });
              //     } else {
              //       this.props.startLoader(false, -1);
              //       this.props.formResult(false, 'Failed to submit form');
              //     }
              //   },
              //   e => {
              //     console.log(e);
              //     this.props.startLoader(false, -1);
              //     this.props.formResult(false, 'Something went wrong!');
              //   },
              // );
            } else {
              this.props.startLoader(false, -1);
              this.props.formResult(status, message);
            }
            // this.props.startLoader(false, -1);
            // this.props.formResult(status, message);
          } else {
            this.props.startLoader(false, -1);
            this.props.formResult(status, message);
          }
        },
        (e) => {
          console.log(e);
          this.props.startLoader(false, -1);
          this.props.formResult(false, 'Something went wrong!');
        },
      );
    }
  };

  productSelection = (value) => {
    const {trackingDetail} = this.state;
    if (trackingDetail === 'Interested') {
      this.setState({confirmModal: true, product: value});
      // Alert.alert('Confirm', 'Please, Confirm before proceeding', [
      //   {
      //     text: 'Yes',
      //     onPress: () => {
      //       this.setState({product: value}, () => {
      //         this.formSubmit();
      //       });
      //     },
      //   },
      //   {
      //     text: 'No',
      //     onPress: () =>
      //       this.setState({product: '', trackingDetail: '', trackingType: ''}),
      //   },
      // ]);
    } else {
      this.setState({product: value});
    }
  };

  statusSelection = (value) => {
    let val = false;
    if (value === 'Contactable') {
      val = true;
    }
    this.setState({
      trackingType: value,
      showContactDialog: val,
      showNonContactDialog: !val,
    });
  };

  render() {
    const {remarks, name, mobile, editable} = this.state;
    const {customerItem, productList} = this.props;
    return (
      <>
        <View styleName="md-gutter">
          <AnimatedInputBox
            onChangeText={(value) => this.setState({name: value})}
            showStarVisible
            value={name}
            placeholder={'Name'}
            returnKeyType={'next'}
            editable={editable}
            disabled={!editable}
            changecolor
            containerstyle={styles.animatedInputCont}
          />
          <AnimatedInputBox
            onChangeText={(value) => {
              if (String(value).match(/^[0-9]*$/g) !== null) {
                this.setState({mobile: value});
              }
            }}
            showStarVisible
            value={mobile}
            placeholder={'Mobile'}
            returnKeyType={'next'}
            editable={editable}
            disabled={!editable}
            maxLength={10}
            keyboardType={'number-pad'}
            changecolor
            containerstyle={styles.animatedInputCont}
          />
          <NewDropDown
            list={trackTypeList}
            placeholder={`Select Disposition *`}
            showStarVisible
            value={this.state.trackingDetail}
            selectedItem={this.statusSelection}
            style={styles.dropdowncontainers}
            textStyle={styles.dropdowntextstyle}
          />
          <NewDropDown
            list={productList}
            placeholder={`Select Product`}
            starVisible
            value={this.state.product}
            selectedItem={this.productSelection}
            style={styles.dropdowncontainers}
            textStyle={styles.dropdowntextstyle}
          />
          <AnimatedInputBox
            onChangeText={(value) => this.setState({remarks: value})}
            showStarVisible={false}
            value={remarks}
            placeholder={'Remarks'}
            returnKeyType={'next'}
            multiLine
            changecolor
            maxLength={150}
            containerstyle={styles.animatedInputCont}
          />

          <OptionsDialog
            optionsList={trackTypeDetailContactableList}
            title={this.state.trackingType}
            visible={this.state.showContactDialog}
            onClicked={this.contactDialogClicked}
          />
          <OptionsDialog
            optionsList={trackTypeDetailNonContactableList}
            title={this.state.trackingType}
            visible={this.state.showNonContactDialog}
            onClicked={this.noncontactDialogClicked}
          />

          {this.state.trackingDetail === 'Follow-up' ? (
            <View>
              <View style={styles.radiocont}>
                <TouchableWithoutFeedback
                  onPress={() =>
                    this.setState({
                      showCalendar: true,
                    })
                  }>
                  <View style={styles.dropdownbox}>
                    <Title
                      style={{
                        fontSize: 14,
                        fontWeight: '700',
                        lineHeight: 20,
                        alignSelf: 'center',
                        color:
                          this.state.followup_date_time === ``
                            ? '#6d6a57'
                            : `#555555`,
                        alignSelf: 'center',
                      }}>
                      {this.state.followup_date_time === ''
                        ? `Schedule an Appointment *`
                        : this.state.followup_date_time}
                    </Title>
                    <Icon
                      name={'calendar'}
                      size={24}
                      color={'#6d6a57'}
                      style={{
                        alignSelf: 'center',
                      }}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          ) : null}

          {this.state.showCalendar ? (
            <DateTimePicker
              value={this.state.currentDate}
              onChange={this.onChange}
              maximumDate={this.state.maxDates}
              minimumDate={this.state.currentDate}
              mode={this.state.mode}
              is24Hour={false}
              //minimumDate={date}
              display={'spinner'}
            />
          ) : null}

          <View
            styleName={`horizontal space-between md-gutter v-center h-center`}>
            <Button
              mode={'flat'}
              uppercase={false}
              dark={true}
              loading={false}
              style={styles.loginButtonStyle}
              onPress={this.formSubmit}>
              <Title style={styles.btntext}>{`Submit`}</Title>
            </Button>
          </View>
        </View>

        <Portal>
          <FlashMessage
            position="bottom"
            ref={this.flashMessage}
            duration={5000}
          />
        </Portal>
        <ModalDialog
          visiblity={this.state.confirmModal}
          content={'Please, Confirm before proceeding'}
          cancelClicked={() =>
            this.setState({
              confirmModal: false,
              //product: '',
              //trackingDetail: '',
              //trackingType: '',
            })
          }
          okClicked={this.formSubmit}
        />
      </>
    );
  }
}

/**
 * styles
 */
const styles = StyleSheet.create({
  dropdowntextstyle: {
    color: '#6d6a57',
    fontSize: 14,
    fontFamily: Pref.getFontName(4),
  },
  dropdowncontainers: {
    borderRadius: 0,
    borderBottomColor: '#f2f1e6',
    borderBottomWidth: 1.3,
    borderWidth: 0,
    marginStart: 10,
    marginEnd: 10,
    paddingVertical: 10,
  },
  radiocont: {
    marginStart: 10,
    marginEnd: 10,
    borderBottomWidth: 1.3,
    borderBottomColor: '#f2f1e6',
    alignContent: 'center',
  },
  animatedInputCont: {
    marginStart: 8,
    marginEnd: 8,
    paddingVertical: 10,
  },
  line: {
    backgroundColor: Pref.RED,
    height: 1.2,
    marginHorizontal: sizeWidth(3),
    marginTop: 4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Rubik',
    fontFamily: 'bold',
    letterSpacing: 1,
    color: '#555555',
    alignSelf: 'center',
  },
  title: {
    fontSize: 17,
    fontFamily: Pref.getFontName(4),
    color: '#292929',
    alignSelf: 'center',
    marginVertical: 8,
  },
  inputStyle: {
    height: sizeHeight(8),
    backgroundColor: 'white',
    color: '#555555',
    borderBottomColor: '#dedede',
    fontFamily: 'Rubik',
    fontSize: 16,
    borderBottomWidth: 1,
    fontWeight: '400',
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
  },
  inputPassStyle: {
    height: sizeHeight(8),
    backgroundColor: 'white',
    color: '#555555',
    borderBottomColor: Colors.grey300,
    fontFamily: 'Rubik',
    fontSize: 16,
    borderBottomWidth: 0.6,
    fontWeight: '400',
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
    marginVertical: sizeHeight(1),
  },
  inputPass1Style: {
    height: sizeHeight(8),
    backgroundColor: 'white',
    color: '#555555',
    fontFamily: 'Rubik',
    fontSize: 16,
    fontWeight: '400',
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
    marginTop: -7,
  },
  loginButtonStyle: {
    color: 'white',
    backgroundColor: Pref.RED,
    textAlign: 'center',
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 0.5,
    borderRadius: 48,
    width: '40%',
    paddingVertical: 4,
    fontWeight: '700',
    marginTop: 24,
  },
  dropdownbox: {
    flexDirection: 'row',
    height: 56,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  radiodownbox: {
    flexDirection: 'column',
    height: 56,
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 16,
  },
  boxsubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6d6a57',
    lineHeight: 20,
    alignSelf: 'center',
    marginStart: 4,
  },
  textopen: {
    fontSize: 14,
    fontWeight: '700',
    color: '#555555',
    lineHeight: 20,
    alignSelf: 'center',
    marginStart: 4,
    letterSpacing: 0.5,
  },
  downIcon: {
    alignSelf: 'center',
  },
  bbstyle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6d6a57',
    lineHeight: 20,
    marginStart: 4,
  },
  btntext: {
    color: 'white',
    fontSize: 16,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
});
