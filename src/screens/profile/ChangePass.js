import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import {
  Title,
  View,
} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {
  Button,
  Colors,
} from 'react-native-paper';
import { sizeHeight, sizeWidth } from '../../util/Size';
import LeftHeaders from '../common/CommonLeftHeader';
import Loader from '../../util/Loader';
import AnimatedInputBox from '../component/AnimatedInputBox';
import CScreen from '../component/CScreen';
import NavigationActions from '../../util/NavigationActions';


export default class ChangePass extends React.Component {
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
      oldpasseye: 'eye',
      showpassword: true,
      cshowpassword: true,
      oldshowpassword: true,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    //this.willfocusListener = navigation.addListener('willFocus', () => {
      Pref.getVal(Pref.userData, (value) => this.setState({ userData: value }, () => {
        Pref.getVal(Pref.saveToken, (token) =>
          this.setState({ token: token }, () => {
            Pref.getVal(Pref.USERTYPE, (v) => this.setState({ utype: v }));
          }),
        );
      }));
    //});
  }

  submitt = () => {
    const { id } = this.state.userData;
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

    //console.log(`body`, body);

    if (checkData) {
      this.setState({ loading: true });
      Helper.networkHelperTokenPost(
        Pref.ChangePass,
        JSON.stringify(body),
        Pref.methodPost,
        this.state.token,
        (result) => {
          const { response_header } = result;
          const { res_type, message } = response_header;
          this.setState({ loading: false });
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
            NavigationActions.navigate('Home');
          }
        },
        (error) => {
          //console.log(`error`, error);
          this.setState({ loading: false });
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
      <CScreen
        absolute={<Loader isShow={this.state.loading} />}
        body={
          <>
            <LeftHeaders
              showBack
              title={Helper.getScreenName(this.props)}
              // bottomtext={
              //   <>
              //     {`Change `}
              //     <Title style={styles.passText}>{`Password`}</Title>
              //   </>
              // }
              bottomtextStyle={{
                color: '#555555',
                fontSize: 20,
              }}
            />

            <View
              styleName="md-gutter"
              style={{
                marginStart: 16,
                marginEnd: 16,
              }}>
              <AnimatedInputBox
                placeholder={'Old Password'}
                secureTextEntry={this.state.oldshowpassword}
                onChangeText={(value) => this.setState({ oldpass: value })}
                value={this.state.oldpass}
                maxLength={4}
                keyboardType={'numeric'}
                showRightIcon
                leftIconName={this.state.oldpasseye}
                leftIconColor={
                  this.state.oldpasseye === 'eye' ? '#555555' : '#6d6a57'
                }
                leftTextClick={this.passoldunlock}
                placecolor={'#555555'}
                placefont={15}
              />

              <AnimatedInputBox
                placeholder={'New Password'}
                secureTextEntry={this.state.showpassword}
                onChangeText={(value) => this.setState({ newpass: value })}
                value={this.state.newpass}
                maxLength={4}
                keyboardType={'numeric'}
                showRightIcon
                leftIconName={this.state.passeye}
                leftIconColor={
                  this.state.passeye === 'eye' ? '#555555' : '#6d6a57'
                }
                leftTextClick={this.passunlock}
                placecolor={'#555555'}
                placefont={15}
                containerstyle={{
                  marginTop: 16,
                }}
              />

              <AnimatedInputBox
                placeholder={'Confirm Password'}
                secureTextEntry={this.state.cshowpassword}
                onChangeText={(value) => this.setState({ newpassc: value })}
                value={this.state.newpassc}
                maxLength={4}
                keyboardType={'numeric'}
                showRightIcon
                leftIconName={this.state.cpasseye}
                leftIconColor={
                  this.state.cpasseye === 'eye' ? '#555555' : '#6d6a57'
                }
                leftTextClick={this.passunlockc}
                placecolor={'#555555'}
                placefont={15}
                containerstyle={{
                  marginTop: 16,
                }}
              />

              <View styleName="horizontal v-center h-center md-gutter">
                <Button
                  mode={'flat'}
                  uppercase={true}
                  dark={true}
                  loading={false}
                  style={styles.loginButtonStyle}
                  onPress={this.submitt}>
                  <Title style={styles.btntext}>{'Submit'}</Title>
                </Button>
              </View>
            </View>
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
  passText: {
    fontSize: 20,
    letterSpacing: 0.5,
    color: Pref.RED,
    fontWeight: '700',
    lineHeight: 36,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingVertical: 16,
  },
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
    backgroundColor: Pref.RED,
    textAlign: 'center',
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 0.5,
    borderRadius: 48,
    width: '40%',
    paddingVertical: 4,
    fontWeight: '700',
    marginTop: 12
  },
  btntext: {
    color: 'white',
    fontSize: 16,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
});
