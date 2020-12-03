import React from 'react';
import {
  StatusBar,
  StyleSheet,
  BackHandler,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Image,
  Title,
  View,
} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import { Button, Colors, DefaultTheme } from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import { sizeHeight, sizeWidth } from '../../util/Size';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Loader from '../../util/Loader';
import IntroHeader from '../intro/IntroHeader';
import CScreen from '../component/CScreen';
import AnimatedInputBox from '../component/AnimatedInputBox';


export default class OtpScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    changeNavigationBarColor(Pref.WHITE, true);
    StatusBar.setBackgroundColor(Pref.WHITE, false);
    StatusBar.setBarStyle('dark-content');
    this.backClick = this.backClick.bind(this);
    this.otpVerify = this.otpVerify.bind(this);
    this.passunlock = this.passunlock.bind(this);
    this.passunlockc = this.passunlockc.bind(this);
    this.state = {
      otp: '',
      password: '',
      cpassword: '',
      message: '',
      loading: false,
      passeye: 'eye',
      cpasseye: 'eye',
      showpassword: true,
      cshowpassword: true,
      timeout: true,
      timing: 30,
      mode: 0,
      emailcode: '',
      regData: null,
      isFirstTime: false,
      confirmResult: null,
      otpClone: '',
      forgetMode: false,
      token: '',
    };
    Pref.getVal(Pref.saveToken, (value) => this.setState({ token: value }));
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backClick);
    const { navigation } = this.props;
    const mode = navigation.getParam('mode', -1);
    if (mode !== -1) {
      const emailcode = navigation.getParam('emailcode', '');
      const regData = navigation.getParam('regData', null);
      const forgetMode = navigation.getParam('forgetMode', false);
      this.setState({
        mode: mode,
        emailcode: emailcode,
        regData: regData,
        forgetMode: forgetMode,
      });
      if (mode === 0) {
        this.startTimer();
      }
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
  }

  backClick = () => {
    if (this.state.mode === 0) {
      if (this.state.forgetMode) {
        this.setState({ otp: this.state.otpClone, mode: 1 });
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  startTimer = () => {
    this.otpTimer = setInterval(this.otpTimer, 1000);
  };

  /**
   * otp timer
   */
  otpTimer = () => {
    if (this.state.timing === 1) {
      this.setState({ timeout: false, timing: 0 });
      clearInterval(this.otpTimer);
    } else {
      this.setState((prevState) => {
        return {
          timing: prevState.timing - 1,
        };
      });
    }
  };

  /**
   * otpVerify
   */
  otpVerify = () => {
    let checkData = true;

    if (this.state.mode === 0) {
      if (this.state.otp === '') {
        checkData = false;
        Helper.showToastMessage('OTP empty', 0);
      } else if (this.state.password === '') {
        checkData = false;
        Helper.showToastMessage('Password empty', 0);
      } else if (this.state.password !== this.state.cpassword) {
        checkData = false;
        Helper.showToastMessage('Password match failed', 0);
      }
      if (checkData) {
        let mobileotpVerified = this.state.mode === 0 ? false : true;
        this.setState({ loading: true, otpClone: this.state.otp });
        if (
          mobileotpVerified ||
          (this.state.mode === 0
            ? Number(this.state.emailcode) > 0 &&
            Number(this.state.emailcode) === Number(this.state.otp) &&
            this.state.regData !== null
            : true)
        ) {
          this.apiCallback();
        } else {
          this.setState({ loading: false });
          Helper.showToastMessage('invalid code', 0);
        }
      }
    } else {
      if (this.state.otp === '') {
        checkData = false;
        Helper.showToastMessage('Mobile number empty', 0);
      } else if (
        this.state.otp === '9876543210' ||
        this.state.otp === '0000000000' ||
        this.state.otp === '1234567890'
      ) {
        checkData = false;
        Helper.showToastMessage('Invalid mobile number', 0);
      }
      if (checkData) {
        this.setState({ loading: true });
        let formdata = new FormData();
        formdata.append('submit', 'sub');
        formdata.append('email', this.state.otp);
        formdata.append('form', 'first_register');
        Helper.networkHelperContentType(
          Pref.ForgotUrl,
          formdata,
          Pref.methodPost,
          (result) => {
            //console.log(`result`, result);
            const { type } = result;
            this.setState({ loading: false, otp: '' });
            if (type === 'success') {
              Helper.showToastMessage(
                `Password sent successfully on registered mail`,
                1,
              );
            } else {
              Helper.showToastMessage(`Failed to find account`, 0);
            }
          },
          () => {
            this.setState({ loading: false });
          },
        );
      }
    }
  };

  sendOTPCode() {
    const jsonData = JSON.parse(JSON.stringify(this.state.regData));
    const body = JSON.stringify({
      email_id: jsonData.email,
    });
    Helper.networkHelperTokenPost(
      Pref.EmailOTPUrl,
      body,
      Pref.methodPost,
      this.state.token,
      (result) => {
        this.setState({ loading: false });
        const { data, response_header } = result;
        const { res_type, message } = response_header;
        if (res_type === `success`) {
          const { otp } = data;
          Helper.showToastMessage('OTP sent successfully', 1);
          Helper.networkHelperGet(`${Pref.SMS_OTP}?invisible=1&otp=${otp}&authkey=345308AQ4dSpkOE55f9280a7P1&mobile=91${jsonData.contact}&template_id=5f929552dd5594798d2ead5e`, result => {
          }, error => {

          })
          this.setState({ emailcode: otp });
        } else {
          Helper.showToastMessage(message, 0);
        }
      },
      (e) => {
        this.setState({ loading: false });
        Helper.showToastMessage('something went wrong', 0);
      },
    );
  }

  apiCallback = () => {
    const jsonData = JSON.parse(JSON.stringify(this.state.regData));
    if (this.state.mode === 0) {
      const otp = this.state.otp;
      const pass = this.state.password;
      jsonData.e_otp = otp;
      jsonData.m_otp = otp;
      jsonData.password = pass;
      jsonData.cnf_password = pass;

      //console.log(`jsonData`, jsonData, this.state.token);
      Helper.networkHelperTokenPost(
        Pref.RegisterUrl,
        JSON.stringify(jsonData),
        Pref.methodPost,
        this.state.token,
        (result) => {
          //console.log('result', result);
          this.setState({ loading: false });
          const { response_header } = result;
          const { res_type, message } = response_header;
          if (res_type === `success`) {
            const mess = `Dear User, Congratulations! you have successfully registered with ERB Finpro. Your Login credentials are: ID-${jsonData.contact} Password-${pass}`

            Helper.networkHelperGet(`${Pref.SMS_SEND}?authkey=345308AQ4dSpkOE55f9280a7P1&mobiles=${jsonData.contact}&message=${mess}&country=91&sender=erbfin&route=4`, result => {
            }, error => {

            })

            Helper.showToastMessage('Registered Successfully', 1);
            NavigationActions.navigate('Login');
          } else {
            Helper.showToastMessage(message, 0);
          }
        },
        (error) => {
          //console.log(error);
          this.setState({ loading: false });
          Helper.showToastMessage('something went wrong', 0);
        },
      );
    }
  };

  passunlock = () => {
    const toggle = this.state.showpassword;
    const togglename = this.state.passeye;
    this.setState({
      showpassword: !toggle,
      passeye: togglename === 'eye' ? 'eye-off' : 'eye',
    });
  };

  passunlockc = () => {
    const toggle = this.state.cshowpassword;
    const togglename = this.state.cpasseye;
    this.setState({
      cshowpassword: !toggle,
      cpasseye: togglename === 'eye' ? 'eye-off' : 'eye',
    });
  };

  render() {
    return (
      <CScreen
        showfooter={false}
        body={
          <>
            <IntroHeader />
            <View styleName="v-center h-center md-gutter">
              <Title style={styles.title}>{`${this.state.mode == 0 ? `Verification` : `Forgot`
                }`}</Title>
              <Title style={styles.title1}>{`${this.state.mode == 0
                  ? `Verify to create your account`
                  : `Enter you mobile number to Reset Account`
                }`}</Title>

              <View styleName="md-gutter">
                {this.state.mode === 0 ? (
                  <View>
                    <AnimatedInputBox
                      changecolor
                      containerstyle={{
                        marginBottom: 8,
                      }}
                      placeholder={'OTP'}
                      onChangeText={(value) => this.setState({ otp: value })}
                      keyboardType={'number-pad'}
                      value={this.state.otp}
                      returnKeyType={'next'}
                    />

                    <AnimatedInputBox
                      changecolor
                      containerstyle={{
                        marginBottom: 8,
                      }}
                      placeholder={'Password *'}
                      numberOfLines={1}
                      secureTextEntry={this.state.showpassword}
                      onChangeText={(value) => this.setState({ password: value })}
                      value={this.state.password}
                      maxLength={4}
                      keyboardType={'numeric'}
                      showRightIcon
                      leftIconName={this.state.passeye}
                      leftIconColor={
                        this.state.passeye === 'eye' ? '#555555' : '#6d6a57'
                      }
                      leftTextClick={this.passunlock}
                      secureTextEntry={this.state.showpassword}
                    />

                    <AnimatedInputBox
                      changecolor
                      containerstyle={{
                        marginBottom: 8,
                      }}
                      placeholder={'Confirm Password *'}
                      maxLength={4}
                      numberOfLines={1}
                      secureTextEntry={this.state.cshowpassword}
                      placeholderTextColor={'#DEDEDE'}
                      onChangeText={(value) =>
                        this.setState({ cpassword: value })
                      }
                      value={this.state.cpassword}
                      keyboardType={'numeric'}
                      showRightIcon
                      leftIconName={this.state.cpasseye}
                      leftIconColor={
                        this.state.cpasseye === 'eye' ? '#555555' : '#6d6a57'
                      }
                      leftTextClick={this.passunlockc}
                    />

                    {this.state.timeout ? (
                      <View style={styles.timer}>
                        <Title
                          style={StyleSheet.flatten([
                            styles.title1,
                            {
                              color: 'white',
                              fontSize: 18,
                            },
                          ])}>
                          {this.state.timing}
                        </Title>
                      </View>
                    ) : (
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                          }}>
                          <TouchableWithoutFeedback
                            onPress={() => this.sendOTPCode()}>
                            <Title
                              style={StyleSheet.flatten([
                                styles.title1,
                                {
                                  color: Pref.CARROT_ORANGE,
                                  fontSize: 16,
                                },
                              ])}>
                              {`Resend OTP`}
                            </Title>
                          </TouchableWithoutFeedback>
                        </View>
                      )}
                  </View>
                ) : (
                    <AnimatedInputBox
                      changecolor
                      containerstyle={{
                        marginBottom: 8,
                      }}
                      placeholder={'Mobile Number'}
                      onChangeText={(value) => {
                        if (String(value).match(/^[0-9]*$/g) !== null) {
                          this.setState({ otp: value });
                        }
                      }}
                      keyboardType={'number-pad'}
                      maxLength={10}
                      value={this.state.otp}
                      returnKeyType={'next'}
                    />
                  )}
              </View>
            </View>

            <View
              styleName="horizontal md-gutter v-center v-center"
              style={{
                marginStart: 16,
                marginTop: -24,
              }}>
              {/* <Button
                mode={'flat'}
                uppercase={true}
                dark={true}
                loading={false}
                style={styles.loginButtonStyle}
                onPress={this.login}>
                <Title style={styles.btntext}>{'Sign In'}</Title>
              </Button> */}
              <Button
                mode={'flat'}
                uppercase={false}
                dark={true}
                loading={false}
                style={[styles.loginButtonStyle]}
                onPress={this.otpVerify}>
                <Title style={StyleSheet.flatten([styles.btntext])}>
                  {'Submit'}
                </Title>
              </Button>
            </View>

            <View styleName="horizontal v-center h-center md-gutter">
              <Image
                source={require('../../res/images/login.jpg')}
                styleName={'large'}
                style={{
                  resizeMode: 'contain',
                }}
              />
            </View>
          </>
        }
        absolute={
          <>
            <Loader isShow={this.state.loading} />
          </>
        }
      />
    );
  }
}

/**
 * styles
 */
const styles = StyleSheet.create({
  timer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#ebeceb',
    backgroundColor: '#0270e3',
    width: 56,
    height: 56,
    borderRadius: 56 / 2,
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1.3,
  },
  fgttext: {
    fontSize: 15,
    letterSpacing: 0.5,
    color: '#0270e3',
    textDecorationColor: '#0270e3',
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
    fontFamily: Pref.getFontName(4),
  },
  btntext: {
    color: 'white',
    fontSize: 16,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  maincontainer: { flex: 1, backgroundColor: 'white' },
  s: { justifyContent: 'center', alignSelf: 'center' },
  inputStyle: {
    height: sizeHeight(8),
    backgroundColor: 'white',
    color: '#292929',
    borderBottomColor: Colors.grey300,
    fontFamily: 'Rubik',
    fontSize: 16,
    borderBottomWidth: 0.6,
    fontWeight: '400',
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
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
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 18,
    letterSpacing: 0.5,
    color: '#bbb8ad',
    alignSelf: 'center',
    fontWeight: '400',
    lineHeight: 24,
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: 12,
  },
  subtitle1: {
    fontSize: 18,
    letterSpacing: 0.5,
    color: '#0276ec',
    alignSelf: 'center',
    fontWeight: '400',
    lineHeight: 24,
    justifyContent: 'center',
    textAlign: 'center',
  },
  title: {
    fontSize: 30,
    letterSpacing: 0.5,
    color: '#555555',
    fontWeight: '700',
    lineHeight: 36,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: Pref.getFontName(3),
  },
  title1: {
    fontSize: 32,
    letterSpacing: 0.5,
    color: '#ea343c',
    fontWeight: '700',
    lineHeight: 36,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: Pref.getFontName(3),
  },
  copy: {
    alignContent: 'center',
    paddingVertical: 10,
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
  radiocont: {
    marginStart: 10,
    marginEnd: 10,
    borderBottomWidth: 1.3,
    borderBottomColor: '#f2f1e6',
    alignContent: 'center',
  },
  boxsubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6d6a57',
    lineHeight: 20,
    alignSelf: 'center',
    marginStart: 4,
  },
  dropdownbox: {
    flexDirection: 'row',
    height: 56,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
});
