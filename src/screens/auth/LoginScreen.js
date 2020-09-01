import React from 'react';
import {
  StatusBar,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Image,
  Screen,
  Subtitle,
  Title,
  View,
} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {
  Button,
  Colors,
  DefaultTheme,
} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import {SafeAreaView} from 'react-navigation';
import {sizeHeight, sizeWidth} from '../../util/Size';
import messaging from '@react-native-firebase/messaging';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Loader from '../../util/Loader';
import Toolbar from '../component/Toolbar';
import AnimatedInputBox from '../component/AnimatedInputBox';


export default class LoginScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    changeNavigationBarColor('white', true);
    this.login = this.login.bind(this);
    this.passunlock = this.passunlock.bind(this);
    this.state = {
      userid: '',
      password: '',
      message: '',
      loading: false,
      passeye: 'eye',
      showpassword: true,
      token: '',
    };
    Pref.setVal(Pref.userData, '');
    Pref.setVal(Pref.loggedStatus, false);
  }

  componentDidMount() {
    try {
      Helper.requestPermissions();
    } catch (e) {
      console.log(e);
    }
    Pref.getVal(Pref.saveToken, (value) => {
      console.log(`value`, value);
      if (value === undefined || value === null) {
        const body = JSON.stringify({
          username: `ERBFinPro`,
          product: `FinPro App`,
        });
        Helper.networkHelper(
          Pref.GetToken,
          body,
          Pref.methodPost,
          (result) => {
            console.log(`result`, result);
            const {data, response_header} = result;
            const {res_type} = response_header;
            if (res_type === `success`) {
              this.setState({token: Helper.removeQuotes(data)});
              Pref.setVal(Pref.saveToken, Helper.removeQuotes(data));
            }
          },
          () => {
            //console.log(`error`, error)
          },
        );
      } else {
        this.setState({token: value});
      }
    });
  }

  /**
   * login
   */
  login = () => {
    let errorData = true;

    if (this.state.userid === '') {
      errorData = false;
      Helper.showToastMessage('mobile number/User ID empty', 0);
    } else if (
      this.state.userid.length < 10 ||
      this.state.userid === '9876543210' ||
      this.state.userid === '0000000000' ||
      this.state.userid === '1234567890'
    ) {
      errorData = false;
      Helper.showToastMessage('Invalid mobile number', 0);
    } else if (this.state.password === '') {
      errorData = false;
      Helper.showToastMessage('Password empty', 0);
    } else if (this.state.password.length < 4) {
      errorData = false;
      Helper.showToastMessage('Invalid password', 0);
    }
    //console.log('token', this.state.token);
    if (errorData) {
      this.setState({loading: true});
      messaging()
        .getToken()
        .then((fcmToken) => {
          if (fcmToken) {
            const jsonData = JSON.stringify({
              username: this.state.userid,
              password: this.state.password,
              deviceid: fcmToken,
            });
            Helper.networkHelperTokenPost(
              Pref.LoginUrl,
              jsonData,
              Pref.methodPost,
              this.state.token,
              (result) => {
                console.log(`result`, result);
                const {data, response_header} = result;
                const {res_type, type} = response_header;
                this.setState({loading: false});
                if (res_type === `error`) {
                  Helper.showToastMessage('no account found', 0);
                } else {
                  Pref.setVal(Pref.USERTYPE, type);
                  const {id} = data[0];
                  Pref.setVal(Pref.userID, id);
                  Pref.setVal(Pref.userData, data[0]);
                  Pref.setVal(Pref.loggedStatus, true);
                  NavigationActions.navigate('Home');
                }
              },
              () => {
                this.setState({loading: false});
                Helper.showToastMessage('something went wrong', 0);
              },
            );
          }
        });
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

  render() {
    return (
      <SafeAreaView style={styles.maincontainer} forceInset={{top: 'never'}}>
        <Screen style={styles.maincontainer}>
          {Platform.OS === 'android' ? (
            <StatusBar barStyle="dark-content" backgroundColor="white" />
          ) : null}
          <KeyboardAvoidingView
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
            }}
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            enabled
            keyboardVerticalOffset={150}>
            <View styleName="fill-parent vertical">
              <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
                <View>
                  <Toolbar />
                  <View
                    style={{flex: 0.87}}
                    styleName="v-center h-center md-gutter">
                    <Title style={styles.title}>{`Welcome back`}</Title>
                    <Title
                      style={
                        styles.title1
                      }>{`please sign in\nto continue`}</Title>
                    <View styleName="md-gutter">
                      <AnimatedInputBox
                        onChangeText={(value) => this.setState({userid: value})}
                        value={this.state.userid}
                        placeholder={'Enter your mobile number/User ID'}
                        maxLength={10}
                        keyboardType={'number-pad'}
                      />

                      <AnimatedInputBox
                        onChangeText={(value) =>
                          this.setState({password: value})
                        }
                        value={this.state.password}
                        placeholder={'Enter your password'}
                        maxLength={4}
                        keyboardType={'number-pad'}
                        showRightIcon
                        leftIconName={this.state.passeye}
                        leftIconColor={
                          this.state.passeye === 'eye' ? '#555555' : '#6d6a57'
                        }
                        leftTextClick={this.passunlock}
                        secureTextEntry={this.state.showpassword}
                      />
                    </View>
                    <View styleName="horizontal space-between md-gutter">
                      <Button
                        mode={'flat'}
                        uppercase={true}
                        dark={true}
                        loading={false}
                        style={styles.loginButtonStyle}
                        onPress={this.login}>
                        <Title style={styles.btntext}>{'Sign In'}</Title>
                      </Button>
                      <Button
                        mode={'flat'}
                        uppercase={true}
                        dark={true}
                        loading={false}
                        style={[
                          styles.loginButtonStyle,
                          {
                            backgroundColor: 'transparent',
                            borderColor: '#d5d3c1',
                            borderWidth: 1.3,
                          },
                        ]}
                        onPress={() => NavigationActions.navigate('Register')}>
                        <Title
                          style={StyleSheet.flatten([
                            styles.btntext,
                            {
                              color: '#b8b28f',
                            },
                          ])}>
                          {'Sign up'}
                        </Title>
                      </Button>
                    </View>

                    <View styleName="horizontal space-between md-gutter">
                      <TouchableWithoutFeedback
                        onPress={() =>
                          NavigationActions.navigate('OtpScreen', {
                            mode: 1,
                            forgetMode: true,
                          })
                        }>
                        <Subtitle
                          style={styles.fgttext}>{`Forgot Password?`}</Subtitle>
                      </TouchableWithoutFeedback>
                    </View>

                    <View styleName="horizontal v-center h-center md-gutter">
                      <Image
                        source={require('../../res/images/referfriend.png')}
                        styleName={'medium'}
                        style={{
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>

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
  fgttext: {
    fontSize: 15,
    letterSpacing: 0.5,
    color: '#0270e3',
    textDecorationColor: '#0270e3',
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
  },
  btntext: {
    color: 'white',
    fontSize: 16,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  maincontainer: {flex: 1, backgroundColor: 'white'},
  s: {justifyContent: 'center', alignSelf: 'center'},
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
    paddingVertical: 4,
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
  },
});
