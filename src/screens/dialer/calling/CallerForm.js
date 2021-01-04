import React from 'react';
import {
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {Title, View} from '@shoutem/ui';
import * as Helper from '../../../util/Helper';
import * as Pref from '../../../util/Pref';
import {Colors, Button} from 'react-native-paper';
import {sizeHeight, sizeWidth} from '../../../util/Size';
import moment from 'moment';
import AnimatedInputBox from '../../component/AnimatedInputBox';
import NewDropDown from '../../component/NewDropDown';
import OptionsDialog from '../../component/OptionsDialog';
import CallLogs from 'react-native-call-log';
import NavigationActions from '../../../util/NavigationActions';

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
];

let trackTypeDetailNonContactableList = [
  {
    value: 'Ringing',
  },
  {
    value: 'Not Reachable',
  },
];

export default class CallerForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.formSubmit = this.formSubmit.bind(this);
    this.contactDialogClicked = this.contactDialogClicked.bind(this);
    this.noncontactDialogClicked = this.noncontactDialogClicked.bind(this);
    this.state = {
      name: '',
      mobile: '',
      trackingType: '',
      trackingDetail: '',
      product: '',
      remarks: '',
      showContactDialog: false,
      showNonContactDialog: false,
      clickedBtn: 0,
      callLogs: [],
      callDur: 0,
      permissionGranted: false,
    };
  }

  componentDidMount() {
    const {editItemRestore} = this.props;
    if (Helper.nullCheck(editItemRestore) === false) {
      this.restoreData(editItemRestore);
    }
    const {customerItem} = this.props;
    const {mobile = ''} = customerItem;
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CALL_LOG, {
        title: 'Permission Required',
        message: 'We required to access your call logs',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }).then(result => {
        if (result === 'granted') {
          let numberArray = [];
          if (Helper.nullStringCheck(mobile) === false) {
            let trimnumber = mobile.trim();
            numberArray.push(`+91${trimnumber}`);
            numberArray.push(trimnumber);
            numberArray.push(
              `${trimnumber.slice(0, 6)} ${trimnumber.slice(
                5,
                trimnumber.length,
              )}`,
            );
            numberArray.push(`+91 ${trimnumber}`);
            numberArray.push(
              `+91 ${trimnumber.slice(0, 6)} ${trimnumber.slice(
                5,
                trimnumber.length,
              )}`,
            );
            //console.log('numberArray', numberArray);
            CallLogs.load(-1, {
              phoneNumbers: numberArray,
            }).then(c => {
              let callDur = 0;
              if (c.length > 0) {
                const {duration} = c[0];
                if (callDur > 60) {
                  callDur = Number(duration / 60).toPrecision(3);
                }
              }
              this.setState({
                callLogs: c,
                callDur: callDur,
                permissionGranted: true,
              });
            });
          }
        }
      });
    }
  }

  restoreData(obj) {
    if (Helper.nullCheck(obj) === false) {
      this.setState(obj);
    }
  }

  contactDialogClicked = value => {
    console.log(value);
    this.setState({trackingDetail: value, showContactDialog: false});
  };

  noncontactDialogClicked = value => {
    this.setState({trackingDetail: value, showNonContactDialog: false});
  };

  formSubmit = () => {
    const {customerItem, token} = this.props;
    if (customerItem === null || token == null) {
      alert('Something went wrong');
      return false;
    }
    const {name = '', mobile = '', id, team_id, user_id} = customerItem;
    const {
      product,
      remarks,
      trackingType,
      clickedBtn,
      trackingDetail,
      callLogs,
      callDur,
      permissionGranted,
    } = this.state;
    if (permissionGranted === false) {
      alert('Please, Allow Call Logs Permission');
      return false;
    }

    let checkData = true;
    if (name === '' || mobile === '') {
      checkData = false;
      alert('Failed to find customer!');
    } else if (trackingType === '') {
      checkData = false;
      alert('Please, Select Response');
    } else if (trackingType == 'Contactable' && trackingDetail === 'Interested' && product === '') {
      checkData = false;
      alert('Please, Select Product');
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

      let formName = product
        .trim()
        .toLowerCase()
        .replace(/\s/g, '_');
      const formUrls = `${Pref.FinorbitFormUrl}${formName}.php`;

      const formData = new FormData();
      formData.append(formName, formName);
      formData.append('formid', '');
      formData.append('name', name);
      formData.append('mobile', mobile);
      formData.append('remark', remarks);

      console.log('formData', formData, formUrls);

      //console.log(body, token);

      Helper.networkHelperTokenPost(
        Pref.DIALER_LEAD_UPDATE,
        JSON.stringify(body),
        Pref.methodPost,
        token,
        result => {
          //console.log('result', result);
          const {status, message} = result;
          if (status == true) {
            if (leadConfirm === 1) {
              Helper.networkHelperTokenContentType(
                formUrls,
                formData,
                Pref.methodPost,
                token,
                result => {
                  //console.log('results', result);
                  const {response_header} = result;
                  const {res_type} = response_header;
                  if (res_type === 'success') {
                    this.props.startLoader(false, 0);
                    NavigationActions.navigate('Finish', {
                      top: 'Form Detail',
                      red: 'Success',
                      grey: 'Lead uploaded successfully',
                      blue: 'Go back',
                      back: 'DialerCalling',
                    });
                  } else {
                    this.props.startLoader(false, -1);
                    this.props.formResult(false, 'Failed to submit form');
                  }
                },
                e => {
                  console.log(e);
                  this.props.startLoader(false, -1);
                  this.props.formResult(false, 'Something went wrong!');
                },
              );
            } else {
              this.props.startLoader(false, -1);
              this.props.formResult(status, message);
            }
          } else {
            this.props.startLoader(false, -1);
            this.props.formResult(status, message);
          }
        },
        () => {
          //console.log(e);
          this.props.startLoader(false, -1);
          this.props.formResult(false, 'Something went wrong!');
        },
      );
    }
  };

  render() {
    const {remarks} = this.state;
    const {customerItem, productList} = this.props;
    const {name = '', mobile = ''} = customerItem;
    return (
      <>
        <View styleName="md-gutter">
          <AnimatedInputBox
            value={name}
            placeholder={'Name'}
            returnKeyType={'next'}
            editable={false}
            disabled={true}
            changecolor
            containerstyle={styles.animatedInputCont}
          />
          <AnimatedInputBox
            value={mobile}
            placeholder={'Mobile'}
            returnKeyType={'next'}
            editable={false}
            disabled={true}
            changecolor
            containerstyle={styles.animatedInputCont}
          />
          <NewDropDown
            list={trackTypeList}
            placeholder={`Select Status`}
            starVisible
            value={this.state.trackingType}
            selectedItem={value => {
              let val = false;
              if (value === 'Contactable') {
                val = true;
              }
              this.setState({
                trackingType: value,
                showContactDialog: val,
                showNonContactDialog: !val,
              });
            }}
            style={styles.dropdowncontainers}
            textStyle={styles.dropdowntextstyle}
          />
          <NewDropDown
            list={productList}
            placeholder={`Select Product`}
            starVisible={this.state.trackingType == 'Contactable' && this.state.trackingDetail === 'Interested'}
            value={this.state.product}
            selectedItem={value => this.setState({product: value})}
            style={styles.dropdowncontainers}
            textStyle={styles.dropdowntextstyle}
          />
          <AnimatedInputBox
            onChangeText={value => this.setState({remarks: value})}
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
    fontSize: 16,
    fontFamily: 'Rubik',
    fontFamily: 'bold',
    letterSpacing: 1,
    color: '#555555',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
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
