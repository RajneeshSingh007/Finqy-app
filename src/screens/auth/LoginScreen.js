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
  Subtitle,
  Title,
  Text,
  Caption,
  View,
  Heading,
  TouchableOpacity,
} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {
  Button,
  Card,
  Colors,
  Snackbar,
  TextInput,
  DefaultTheme,
} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import {SafeAreaView} from 'react-navigation';
import {sizeFont, sizeHeight, sizeWidth} from '../../util/Size';
import Icon from 'react-native-vector-icons/Feather';
import messaging from '@react-native-firebase/messaging';
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
          (error) => {
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
                const {res_type, message,type} = response_header;
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
              (error) => {
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
      <SafeAreaView
        style={{flex: 1, backgroundColor: 'white'}}
        forceInset={{top: 'never'}}>
        <Screen style={{backgroundColor: 'white', flex: 1}}>
          {Platform.OS === 'android' ? (
            <StatusBar barStyle="dark-content" backgroundColor="white" />
          ) : null}

          <View styleName="fill-parent vertical">
            <ScrollView showsVerticalScrollIndicator={true} style={{flex: 1}}>
              <View
                styleName="v-center h-center md-gutter"
                style={{marginTop: sizeHeight(3)}}>
                <Image
                  styleName="medium v-center h-center"
                  source={require('../../res/images/squarelogo.png')}
                  style={styles.s}
                />
                <View
                  style={{
                    marginTop: sizeHeight(4),
                    marginHorizontal: sizeWidth(3),
                  }}>
                  <Heading
                    styleName="v-start"
                    style={{
                      fontSize: 24,
                      fontFamily: 'Rubik',
                      fontFamily: '400',
                      letterSpacing: 1,
                    }}>
                    {`Login`}
                  </Heading>
                  <Title
                    styleName="v-start"
                    style={{
                      fontSize: 18,
                      fontFamily: 'Rubik',
                      fontFamily: 'Rubik',
                      fontWeight: '700',
                      lineHeight: 32,
                      letterSpacing: 1,
                    }}>
                    {`Into your account`}
                  </Title>
                </View>
                <TextInput
                  mode="flat"
                  underlineColor="transparent"
                  underlineColorAndroid="transparent"
                  style={[styles.inputStyle, {marginVertical: sizeHeight(2)}]}
                  label={'Mobile Number/User ID'}
                  placeholder={'Enter your mobile number/User ID'}
                  maxLength={10}
                  keyboardType={'number-pad'}
                  placeholderTextColor={'#DEDEDE'}
                  onChangeText={(value) => this.setState({userid: value})}
                  value={this.state.userid}
                  theme={theme}
                />
                <View styleName="horizontal" style={styles.inputStyle}>
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
                    maxLength={4}
                    numberOfLines={1}
                    placeholder={'Enter your password'}
                    secureTextEntry={this.state.showpassword}
                    placeholderTextColor={'#DEDEDE'}
                    onChangeText={(value) => this.setState({password: value})}
                    value={this.state.password}
                    keyboardType={'numeric'}
                    theme={theme}
                  />
                  <TouchableOpacity
                    style={{
                      alignSelf: 'center',
                      flex: 0.2,
                      height: sizeHeight(8),
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: -6,
                      borderBottomColor: this.state.focusedPass
                        ? '#e21226'
                        : 'transparent',
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
                <TouchableWithoutFeedback
                  onPress={() =>
                    NavigationActions.navigate('OtpScreen', {
                      mode: 1,
                      forgetMode: true,
                    })
                  }>
                  <Subtitle
                    style={{
                      fontSize: 15,
                      marginTop: sizeHeight(1.7),
                      marginHorizontal: sizeWidth(3),
                      letterSpacing: 0.7,
                      color: '#292929',
                    }}>{`Don't remember your password?`}</Subtitle>
                </TouchableWithoutFeedback>
                <Button
                  mode={'flat'}
                  uppercase={true}
                  dark={true}
                  loading={false}
                  style={styles.loginButtonStyle}
                  onPress={this.login}>
                  <Text
                    style={{color: 'white', fontSize: 16, letterSpacing: 1}}>
                    {'Sign In'}
                  </Text>
                </Button>

                <View
                  style={{
                    marginTop: sizeHeight(4),
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <Title
                    styleName="v-start"
                    style={{
                      fontSize: 16,
                      fontFamily: 'Rubik',
                      fontFamily: 'Rubik',
                      fontWeight: '400',
                      lineHeight: 24,
                      letterSpacing: 1,
                    }}>
                    {`Don't Have Account? `}
                  </Title>
                  <TouchableWithoutFeedback
                    onPress={() => NavigationActions.navigate('Register')}>
                    <Title
                      style={{
                        fontSize: 16,
                        fontFamily: 'Rubik',
                        fontFamily: 'Rubik',
                        fontWeight: '700',
                        lineHeight: 24,
                        letterSpacing: 1,
                        color: '#f39f24',
                      }}>
                      {`REGISTER`}
                    </Title>
                  </TouchableWithoutFeedback>
                </View>
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
    paddingVertical: sizeHeight(0.5),
    marginHorizontal: sizeWidth(3),
    marginTop: sizeHeight(6),
    backgroundColor: Pref.RED,
    textAlign: 'center',
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 1,
  },
});
