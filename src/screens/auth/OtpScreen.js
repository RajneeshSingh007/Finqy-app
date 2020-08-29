import React from 'react';
import {
  StatusBar,
  StyleSheet,
  ScrollView,
  BackHandler,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Image,
  Screen,
  Title,
  Text,
  View,
  Heading,
  TouchableOpacity,
} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {
  Button,
  Colors,
  TextInput,
  DefaultTheme,
} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import {SafeAreaView} from 'react-navigation';
import {sizeHeight, sizeWidth} from '../../util/Size';
import Icon from 'react-native-vector-icons/Feather';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Loader from '../../util/Loader';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'transparent',
    accent: 'transparent',
    backgroundColor: Colors.white,
    surface: Colors.white,
  },
};

export default class OtpScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    changeNavigationBarColor('white', true);
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
    Pref.getVal(Pref.saveToken, (value) => this.setState({token: value}));
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backClick);
    const {navigation} = this.props;
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
    // this.signOut = auth().signOut();
    // this.unsubscribe = auth().onAuthStateChanged(user => {
    //     if (user) {
    //         if (this.state.isFirstTime === true){
    //             this.apiCallback();
    //         }
    //     }
    // });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
  }

  backClick = () => {
    if (this.state.mode === 0) {
      if (this.state.forgetMode) {
        this.setState({otp: this.state.otpClone, mode: 1});
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
      this.setState({timeout: false, timing: 0});
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
        this.setState({loading: true, otpClone: this.state.otp});
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
          this.setState({loading: false});
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
                        this.setState({loading: true});
        let formdata = new FormData();
        formdata.append('submit', 'sub');
                formdata.append('email', this.state.otp);
        formdata.append('form', 'first_register');
        Helper.networkHelperContentType(
          Pref.ForgotUrl,
          formdata,
          Pref.methodPost,
          (result) => {
              console.log(`result`, result);
              const {type} = result;
                        this.setState({loading: false,otp:''});
                        if(type ==='success'){
            Helper.showToastMessage(`Password sent successfully on registered mail`, 1);
                        }else{
                                        Helper.showToastMessage(`Failed to find account`, 0);
                        }
          },
          () => {
                        this.setState({loading: false});
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
        this.setState({loading: false});
        const {data, response_header} = result;
        const {res_type, message} = response_header;
        if (res_type === `success`) {
          const {otp} = data;
          Helper.showToastMessage('OTP sent successfully', 1);
          this.setState({emailcode: otp});
        } else {
          Helper.showToastMessage(message, 0);
        }
      },
      () => {
        this.setState({loading: false});
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

      console.log(`jsonData`, jsonData, this.state.token);
      Helper.networkHelperTokenPost(
        Pref.RegisterUrl,
        JSON.stringify(jsonData),
        Pref.methodPost,
        this.state.token,
        (result) => {
          console.log('result', result);
          this.setState({loading: false});
          const {response_header} = result;
          const {res_type, message} = response_header;
          if (res_type === `success`) {
            Helper.showToastMessage('Registered Successfully', 1);
            NavigationActions.navigate('Login');
          } else {
            Helper.showToastMessage(message, 0);
          }
        },
        (error) => {
          console.log(error);
          this.setState({loading: false});
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
      <SafeAreaView
        style={{flex: 1, backgroundColor: 'white'}}
        forceInset={{top: 'never'}}>
        <Screen style={{backgroundColor: 'white', flex: 1}}>
          {Platform.OS === 'android' ? (
            <StatusBar barStyle="dark-content" backgroundColor="white" />
          ) : null}
          <View styleName="fill-parent vertical">
            <ScrollView showsVerticalScrollIndicator={true} style={{flex: 1}}>
              <View styleName="v-center h-center md-gutter">
                <TouchableWithoutFeedback
                  onPress={() => NavigationActions.goBack()}>
                  <Icon
                    name={'arrow-left'}
                    size={24}
                    color={'#292929'}
                    style={{marginTop: sizeHeight(1)}}
                  />
                </TouchableWithoutFeedback>
                <View
                  styleName={'v-center h-center'}
                  style={{
                    marginVertical: sizeHeight(2),
                    marginHorizontal: sizeWidth(3),
                  }}>
                  <Heading
                    styleName="v-center h-center"
                    style={{
                      fontSize: 24,
                      fontFamily: 'Rubik',
                      fontFamily: '700',
                      letterSpacing: 1,
                    }}>
                    {this.state.mode == 0 ? `Verification` : `Forgot`}
                  </Heading>

                  <Image
                    styleName={'small v-center h-center'}
                    source={{
                      uri:
                        'https://user-images.githubusercontent.com/4661784/56352614-4631a680-61d8-11e9-880d-86ecb053413d.png',
                    }}
                    style={{
                      alignSelf: 'center',
                      marginVertical: sizeHeight(2),
                    }}
                  />

                  <Title
                    styleName="v-center h-center"
                    style={{
                      marginTop: 8,
                      fontSize: 17,
                      fontFamily: 'Rubik',
                      fontFamily: 'Rubik',
                      fontWeight: '700',
                      lineHeight: 32,
                      letterSpacing: 1,
                    }}>
                    {`${
                      this.state.mode == 0
                        ? `Verify to create your account`
                        : `Enter you mobile number\nto Reset Account`
                    }`}
                  </Title>
                </View>
                {this.state.mode === 0 ? (
                  <View>
                    <TextInput
                      mode="flat"
                      underlineColor="transparent"
                      underlineColorAndroid="transparent"
                      style={[
                        styles.inputStyle,
                        {marginVertical: sizeHeight(1)},
                      ]}
                      label={'OTP'}
                      placeholder={'Enter OTP'}
                      placeholderTextColor={'#DEDEDE'}
                      onChangeText={(value) => this.setState({otp: value})}
                      keyboardType={'number-pad'}
                      value={this.state.otp}
                      theme={theme}
                      returnKeyType={'next'}
                    />
                    <View styleName="horizontal" style={styles.inputPassStyle}>
                      <TextInput
                        mode="flat"
                        underlineColor={'rgba(0,0,0,0)'}
                        underlineColorAndroid={'transparent'}
                        label={'Password'}
                        style={{
                          borderBottomColor: 'transparent',
                          flex: 0.9,
                          backgroundColor: 'white',
                          color: '#131313',
                          fontFamily: 'Rubik',
                          fontSize: 16,
                          borderBottomWidth: 1,
                          fontWeight: '400',
                          letterSpacing: 1,
                        }}
                        numberOfLines={1}
                        placeholder={'Enter password'}
                        secureTextEntry={this.state.showpassword}
                        placeholderTextColor={'#DEDEDE'}
                        onChangeText={(value) =>
                          this.setState({password: value})
                        }
                        value={this.state.password}
                        theme={theme}
                        maxLength={4}
                        keyboardType={'numeric'}
                      />
                      <TouchableOpacity
                        style={{
                          alignSelf: 'center',
                          flex: 0.2,
                          height: sizeHeight(8),
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: -16,
                        }}
                        onPress={this.passunlock}>
                        <Icon
                          name={this.state.passeye}
                          size={16}
                          color={
                            this.state.passeye === 'eye' ? '#777777' : '#292929'
                          }
                        />
                      </TouchableOpacity>
                    </View>

                    <View styleName="horizontal" style={styles.inputPassStyle}>
                      <TextInput
                        mode="flat"
                        underlineColor={'rgba(0,0,0,0)'}
                        underlineColorAndroid={'transparent'}
                        label={'Confirm Password'}
                        style={{
                          borderBottomColor: 'transparent',
                          flex: 0.9,
                          backgroundColor: 'white',
                          color: '#131313',
                          fontFamily: 'Rubik',
                          fontSize: 16,
                          borderBottomWidth: 1,
                          fontWeight: '400',
                          letterSpacing: 1,
                        }}
                        maxLength={4}
                        numberOfLines={1}
                        placeholder={'Enter confirm password'}
                        secureTextEntry={this.state.cshowpassword}
                        placeholderTextColor={'#DEDEDE'}
                        onChangeText={(value) =>
                          this.setState({cpassword: value})
                        }
                        value={this.state.cpassword}
                        theme={theme}
                        keyboardType={'numeric'}
                      />
                      <TouchableOpacity
                        style={{
                          alignSelf: 'center',
                          flex: 0.2,
                          height: sizeHeight(8),
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: -16,
                        }}
                        onPress={this.passunlockc}>
                        <Icon
                          name={this.state.cpasseye}
                          size={16}
                          color={
                            this.state.cpasseye === 'eye'
                              ? '#777777'
                              : '#292929'
                          }
                        />
                      </TouchableOpacity>
                    </View>

                    {this.state.timeout ? (
                      <View
                        style={{
                          marginVertical: sizeHeight(3.5),
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'row',
                          borderRadius: 48,
                          borderColor: '#dedede',
                          backgroundColor: Pref.RED,
                          width: 60,
                          height: 60,
                          borderRadius: 60 / 2,
                          alignItems: 'center',
                          alignSelf: 'center',
                          borderWidth: 3,
                        }}>
                        <Title
                          style={{
                            fontSize: 16,
                            fontFamily: 'Rubik',
                            fontFamily: 'Rubik',
                            fontWeight: '700',
                            color: 'white',
                          }}>
                          
                          {this.state.timing}
                        </Title>
                      </View>
                    ) : (
                      <View
                        style={{
                          marginVertical: sizeHeight(4),
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'row',
                        }}>
                        <TouchableWithoutFeedback
                          onPress={() => this.sendOTPCode()}>
                          <Title
                            style={{
                              fontSize: 14,
                              fontFamily: 'Rubik',
                              fontFamily: 'Rubik',
                              fontWeight: '700',
                              lineHeight: 24,
                              letterSpacing: 1,
                              color: '#f39f24',
                            }}>
                            
                            {`Resend OTP`}
                          </Title>
                        </TouchableWithoutFeedback>
                      </View>
                    )}
                  </View>
                ) : (
                  <TextInput
                    mode="flat"
                    underlineColor="transparent"
                    underlineColorAndroid="transparent"
                    style={[
                      styles.inputStyle,
                      {
                        marginVertical:
                          this.state.mode === 0 ? sizeHeight(1) : sizeHeight(4),
                      },
                    ]}
                    label={'Mobile Number'}
                    placeholder={'Enter mobile number'}
                    placeholderTextColor={'#DEDEDE'}
                    onChangeText={(value) => {
                      if(value.match(/^[0-9]*$/g) !== null){
                        this.setState({otp: value});
                      }
                    }}
                    keyboardType={'number-pad'}
                    maxLength={10}
                    value={this.state.otp}
                    theme={theme}
                    returnKeyType={'next'}
                  />
                )}

                <Button
                  mode={'flat'}
                  uppercase={true}
                  dark={true}
                  loading={false}
                  style={[
                    styles.loginButtonStyle,
                    {
                      marginVertical:
                        this.state.mode === 0
                          ? sizeHeight(3.5)
                          : sizeHeight(10),
                    },
                  ]}
                  onPress={this.otpVerify}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 16,
                      letterSpacing: 1,
                    }}>
                    {'Submit'}
                  </Text>
                </Button>
              </View>
            </ScrollView>
          </View>

          <Loader isShow={this.state.loading} />
        </Screen>
      </SafeAreaView>
    );
  }
}

/**
 * styles
 */
const styles = StyleSheet.create({
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
  inputPassStyle: {
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
    marginVertical: sizeHeight(1),
  },
  inputPass1Style: {
    height: sizeHeight(8),
    backgroundColor: 'white',
    color: '#292929',
    fontFamily: 'Rubik',
    fontSize: 16,
    fontWeight: '400',
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
    marginTop: -7,
  },
  loginButtonStyle: {
    color: 'white',
    paddingVertical: sizeHeight(0.5),
    marginHorizontal: sizeWidth(3),
    backgroundColor: '#e61e25',
    textAlign: 'center',
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 1,
  },
});
