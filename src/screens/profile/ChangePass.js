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
  DropDownMenu,
  DropDownModal,
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
  FAB,
  Avatar,
} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import {SafeAreaView} from 'react-navigation';
import {sizeFont, sizeHeight, sizeWidth} from '../../util/Size';
import CommonScreen from '../common/CommonScreen';
import CustomForm from '../finorbit/CustomForm';
import FileUploadForm from '../finorbit/FileUploadForm';
import DocumentPicker from 'react-native-document-picker';
import LeftHeaders from '../common/CommonLeftHeader';
import SpecificForm from '../finorbit/SpecificForm';
import Lodash from 'lodash';
import Icon from 'react-native-vector-icons/Feather';
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

export default class AddTeam extends React.Component {
  constructor(props) {
    super(props);
    this.submitt = this.submitt.bind(this);
    this.state = {
      loading: false,
      oldpass: '',
      newpass: '',
      newpassc: '',
      refercode: '',
      token: '',
      userData: '',
      utype: '',
      passeye: 'eye',
      cpasseye: 'eye',
      oldpasseye:'eye',
      showpassword: true,
      cshowpassword: true,
      oldshowpassword:true,
    };
    Pref.getVal(Pref.userData, (value) => this.setState({userData: value}));
    Pref.getVal(Pref.saveToken, (value) =>
      this.setState({token: value}, () => {
        Pref.getVal(Pref.USERTYPE, (v) => this.setState({utype: v}));
      }),
    );
  }

  submitt = () => {
    const {id} = this.state.userData;
    let checkData = true;
    const body = JSON.parse(JSON.stringify(this.state));
    delete body.userData;
    delete body.token;
    delete body.loading;
    if (body.oldpass === '') {
      Helper.showToastMessage('Old Password empty', 0);
      return false;
    }

    if (body.newpass === '') {
      Helper.showToastMessage('New Password empty', 0);
      return false;
    }

    if (body.newpassc === '') {
      Helper.showToastMessage('New Confirm Password empty', 0);
      return false;
    }

    if (body.newpass !== body.newpassc) {
      Helper.showToastMessage('Failed to match password', 0);
      return false;
    }

    body.user_id = id;
    body.type = this.state.utype;

    console.log(`body`, body);

    if (checkData) {
      this.setState({loading: true});
      Helper.networkHelperTokenPost(
        Pref.ChangePass,
        JSON.stringify(body),
        Pref.methodPost,
        this.state.token,
        (result) => {
          console.log(`result`, result);
          const {data, response_header} = result;
          const {res_type, message} = response_header;
          this.setState({loading: false});
          if (res_type === `error`) {
            Helper.showToastMessage(message, 0);
          } else {
            this.setState({
              loading: false,
              oldpass: '',
              newpass: '',
              newpassc: '',
              refercode: '',
            });
            Helper.showToastMessage(`Password changed successfully`, 1);
          }
        },
        (error) => {
          console.log(`error`, error);
          this.setState({loading: false});
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

    passoldunlock = () => {
    const toggle = this.state.oldshowpassword;
    const togglename = this.state.oldpasseye;
    this.setState({
      oldshowpassword: !toggle,
      oldpasseye: togglename === 'eye' ? 'eye-off' : 'eye',
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
      <CommonScreen
        title={''}
        loading={this.state.loading}
        backgroundColor={'white'}
        absoluteBody={<Loader isShow={this.state.loading} />}
        body={
          <>
            {/* <LeftHeaders title={'Change Password'} showBack /> */}

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
                  {`Change Password`}
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
                  {`Change password of your account`}
                </Title>

                <View style={{marginTop: sizeHeight(2)}}>
                  <View styleName="horizontal" style={styles.inputPassStyle}>
                    <TextInput
                      mode="flat"
                      underlineColor={'rgba(0,0,0,0)'}
                      underlineColorAndroid={'transparent'}
                      label={'Old Password'}
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
                      placeholder={'Enter old password'}
                      secureTextEntry={this.state.oldshowpassword}
                      placeholderTextColor={'#DEDEDE'}
                      onChangeText={(value) => this.setState({oldpass: value})}
                      value={this.state.oldpass}
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
                      onPress={this.passoldunlock}>
                      <Icon
                        name={this.state.oldpasseye}
                        size={16}
                        color={
                          this.state.oldpasseye === 'eye'
                            ? '#777777'
                            : '#292929'
                        }
                      />
                    </TouchableOpacity>
                  </View>

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
                      onChangeText={(value) => this.setState({newpass: value})}
                      value={this.state.newpass}
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
                      onChangeText={(value) => this.setState({newpassc: value})}
                      value={this.state.newpassc}
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
                          this.state.cpasseye === 'eye' ? '#777777' : '#292929'
                        }
                      />
                    </TouchableOpacity>
                  </View>

                  <Button
                    mode={'flat'}
                    uppercase={true}
                    dark={true}
                    loading={false}
                    style={[styles.loginButtonStyle]}
                    onPress={this.submitt}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 16,
                        letterSpacing: 1,
                      }}>
                      {'SUBMIT'}
                    </Text>
                  </Button>
                </View>
              </View>
            </View>

            {/* <Card
              style={{
                marginHorizontal: sizeWidth(4),
                marginVertical: sizeHeight(2),
                paddingHorizontal: sizeWidth(0),
              }}>

                
              <CustomForm
                value={this.state.oldpass}
                onChange={(v) => this.setState({oldpass: v})}
                label={`Old Password *`}
                placeholder={`Enter old password`}
                keyboardType={'numeric'}
                maxLength={4}
                secureTextEntry
                theme={theme}
                style={{flex: 0.8}}
              />

              <CustomForm
                value={this.state.newpass}
                onChange={(v) => this.setState({newpass: v})}
                label={`New Password *`}
                placeholder={`Enter new password`}
                keyboardType={'numeric'}
                maxLength={4}
                secureTextEntry
              />

              <CustomForm
                value={this.state.newpassc}
                onChange={(v) => this.setState({newpassc: v})}
                label={`New Confirm Password *`}
                placeholder={`Enter new confirm password`}
                keyboardType={'numeric'}
                maxLength={4}
                secureTextEntry
              />

              <Button
                mode={'flat'}
                uppercase={true}
                dark={true}
                loading={false}
                style={[styles.loginButtonStyle]}
                onPress={this.submitt}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 16,
                    letterSpacing: 1,
                  }}>
                  {'SUBMIT'}
                </Text>
              </Button>
            </Card>
           */}
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
  inputStyle: {
    height: sizeHeight(8),
    backgroundColor: 'white',
    color: '#292929',
    borderBottomColor: '#dedede',
    fontFamily: 'Rubik',
    fontSize: 16,
    borderBottomWidth: 1,
    fontWeight: '400',
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
  },
  inputPassStyle: {
    height: 48,
    backgroundColor: 'white',
    color: '#292929',
    borderBottomColor: Colors.grey300,
    fontFamily: 'Rubik',
    fontSize: 16,
    borderBottomWidth: 0.6,
    fontWeight: '400',
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
    marginVertical: sizeHeight(2),
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
    marginVertical: sizeHeight(3.5),
    backgroundColor: Pref.RED,
    textAlign: 'center',
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 1,
  },
});
