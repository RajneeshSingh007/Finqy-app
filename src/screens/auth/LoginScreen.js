import React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { Image, Subtitle, Title, View } from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import { Button, Colors } from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import { sizeHeight, sizeWidth } from '../../util/Size';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Loader from '../../util/Loader';
import IntroHeader from '../intro/IntroHeader';
import CScreen from '../component/CScreen';
import AnimatedInputBox from '../component/AnimatedInputBox';
import RNFetchBlob from 'rn-fetch-blob';
import { notifications, NotificationMessage, Android } from 'react-native-firebase-push-notifications'

const ConnectorMenuList = [
  {
    name: `My Profile`,
    expand: false,
    heading: true,
    iconname: require('../../res/images/menuicon1.png'),
    icontype: 0,
    sub: [
      {
        name: `Edit Profile`,
        expand: false,
        click: 'ProfileScreen',
        options: {},
      },
      {
        name: `My Agreement`,
        click: 'Agreement',
        expand: false,
        options: {},
      },
      {
        name: `My Certificate`,
        expand: false,
        click: 'Certificate',
        options: {},
      },
      {
        name: `Change Password`,
        expand: false,
        click: 'ChangePass',
        options: {},
      },
    ],
    click: '',
  },
  {
    name: `My FinPro`,
    expand: false,
    heading: true,
    iconname: require('../../res/images/menuicon2.png'),
    icontype: 2,
    sub: [
      // {
      //     name: `Dashboard`,
      //     expand: false,
      //     click: ''
      // },
      {
        name: `My New Lead`,
        expand: false,
        click: '',
        heading: true,
        sub: [
          {
            name: `Add Single Lead`,
            expand: false,
            click: `FinorbitScreen`,
            options: {},
          },
          {
            name: `Link Sharing Option`,
            expand: false,
            click: `LinkSharingOption`,
            options: {},
          },
        ],
      },
      {
        name: `My Lead Record`,
        expand: false,
        click: 'LeadList',
        options: {},
      },
    ],
    click: '',
  },
  {
    name: `FinNews`,
    expand: false,
    click: 'Blogs',
    options: {},
    iconname: require('../../res/images/menuicon9.png'),
    icontype: 2,
  },
  {
    name: `My Wallet`,
    expand: false,
    heading: true,
    iconname: require('../../res/images/menuicon4.png'),
    icontype: 2,
    sub: [
      {
        name: `My Payout Structure`,
        expand: false,
        click: 'Payout',
        options: {},
      },
      {
        name: `Earning History`,
        expand: false,
        click: 'MyWallet',
        options: {},
      },
      {
        name: `My Invoice`,
        expand: false,
        click: 'Invoice',
        options: {},
      },
      {
        name: `My 26AS`,
        expand: false,
        click: 'As26',
        options: {},
      },
      {
        name: `Payout Policy`,
        expand: false,
        click: 'PayoutPolicy',
        options: {},
      },
    ],
    click: '',
  },
  {
    name: `My Offers`,
    expand: false,
    click: `MyOffers`,
    options: {},
    iconname: require('../../res/images/menuicon5.png'),
    icontype: 2,
  },
  {
    name: `ERB Popular Plan`,
    expand: false,
    click: 'PopularPlan',
    options: {},
    iconname: require('../../res/images/menuicon6.png'),
    icontype: 2,
  },
  {
    name: `My Marketing Tool`,
    expand: false,
    click: 'MarketingTool',
    options: {},
    iconname: require('../../res/images/menuicon7.png'),
    icontype: 2,
  },
  {
    name: `FinTrain Learning`,
    expand: false,
    click: 'Training',
    options: {},
    iconname: require('../../res/images/menuicon8.png'),
    icontype: 2,
  },
];

const MainMenuList = [
  {
    name: `My Profile`,
    expand: false,
    heading: true,
    iconname: require('../../res/images/menuicon1.png'),
    icontype: 0,
    sub: [
      {
        name: `Edit Profile`,
        expand: false,
        click: 'ProfileScreen',
        options: {},
      },
      {
        name: `My Agreement`,
        click: 'Agreement',
        expand: false,
        options: {},
      },
      {
        name: `My Certificate`,
        expand: false,
        click: 'Certificate',
        options: {},
      },
      {
        name: `Change Password`,
        expand: false,
        click: 'ChangePass',
        options: {},
      },
    ],
    click: '',
  },
  {
    name: `My FinPro`,
    expand: false,
    heading: true,
    iconname: require('../../res/images/menuicon2.png'),
    icontype: 2,
    sub: [
      // {
      //     name: `Dashboard`,
      //     expand: false,
      //     click: ''
      // },
      {
        name: `My New Lead`,
        expand: false,
        click: '',
        heading: true,
        sub: [
          {
            name: `Add Single Lead`,
            expand: false,
            click: `FinorbitScreen`,
            options: {},
          },
          {
            name: `Link Sharing Option`,
            expand: false,
            click: `LinkSharingOption`,
            options: {},
          },
        ],
      },
      {
        name: `My Lead Record`,
        expand: false,
        click: 'LeadList',
        options: {},
      },
    ],
    click: '',
  },
  {
    name: `FinNews`,
    expand: false,
    click: 'Blogs',
    options: {},
    iconname: require('../../res/images/menuicon9.png'),
    icontype: 2,
  },
  {
    name: `My Marketing Tool`,
    expand: false,
    click: 'MarketingTool',
    options: {},
    iconname: require('../../res/images/menuicon7.png'),
    icontype: 2,
  },
  {
    name: `FinTrain Learning`,
    expand: false,
    click: 'Training',
    options: {},
    iconname: require('../../res/images/menuicon8.png'),
    icontype: 2,
  },
  {
    name: `ERB Popular Plan`,
    expand: false,
    click: 'PopularPlan',
    options: {},
    iconname: require('../../res/images/menuicon6.png'),
    icontype: 2,
  },
  {
    name: `My Offers`,
    expand: false,
    click: `MyOffers`,
    options: {},
    iconname: require('../../res/images/menuicon5.png'),
    icontype: 2,
  },
  {
    name: `My Wallet`,
    expand: false,
    heading: true,
    iconname: require('../../res/images/menuicon4.png'),
    icontype: 2,
    sub: [
      {
        name: `My Payout Structure`,
        expand: false,
        click: 'Payout',
        options: {},
      },
      {
        name: `Earning History`,
        expand: false,
        click: 'MyWallet',
        options: {},
      },
      {
        name: `My Invoice`,
        expand: false,
        click: 'Invoice',
        options: {},
      },
      {
        name: `My 26AS`,
        expand: false,
        click: 'As26',
        options: {},
      },
      {
        name: `Payout Policy`,
        expand: false,
        click: 'PayoutPolicy',
        options: {},
      },
    ],
    click: '',
  },
  {
    name: `FinTeam Manager`,
    expand: false,
    heading: true,
    iconname: require('../../res/images/menuicon3.png'),
    icontype: 2,
    sub: [
      {
        name: `My Connector`,
        expand: false,
        click: '',
        heading: true,
        sub: [
          {
            name: `Add Connector`,
            expand: false,
            click: `AddConnector`,
            options: {},
          },
          {
            name: `View Connector`,
            expand: false,
            click: `ViewConnector`,
            options: {},
          },
        ],
      },
      {
        name: `My Team`,
        expand: false,
        click: '',
        heading: true,
        sub: [
          {
            name: `Add Team`,
            expand: false,
            click: `AddTeam`,
            options: {},
          },
          {
            name: `View Team`,
            expand: false,
            click: `ViewTeam`,
            options: {},
          },
        ],
      },
    ],
    click: '',
  },
];

const TeamMenuList = [
  {
    name: `My FinPro`,
    expand: false,
    heading: true,
    iconname: require('../../res/images/menuicon2.png'),
    icontype: 2,
    sub: [
      // {
      //     name: `Dashboard`,
      //     expand: false,
      //     click: ''
      // },
      {
        name: `My New Lead`,
        expand: false,
        click: '',
        heading: true,
        sub: [
          {
            name: `Add Single Lead`,
            expand: false,
            click: `FinorbitScreen`,
            options: {},
          },
          {
            name: `Link Sharing Option`,
            expand: false,
            click: `LinkSharingOption`,
            options: {},
          },
        ],
      },
      {
        name: `My Lead Record`,
        expand: false,
        click: 'LeadList',
        options: {},
      },
    ],
    click: '',
  },
  // {
  //   name: `My Offers`,
  //   expand: false,
  //   click: `MyOffers`,
  //   options: {},
  //   iconname: require('../../res/images/menuicon5.png'),
  //   icontype: 2,
  // },
  {
    name: `ERB Popular Plan`,
    expand: false,
    click: 'PopularPlan',
    options: {},
    iconname: require('../../res/images/menuicon6.png'),
    icontype: 2,
  },
  {
    name: `FinNews`,
    expand: false,
    click: 'Blogs',
    options: {},
    iconname: require('../../res/images/menuicon9.png'),
    icontype: 2,
  },
  {
    name: `My Marketing Tool`,
    expand: false,
    click: 'MarketingTool',
    options: {},
    iconname: require('../../res/images/menuicon7.png'),
    icontype: 2,
  },
  {
    name: `FinTrain Learning`,
    expand: false,
    click: 'Training',
    options: {},
    iconname: require('../../res/images/menuicon8.png'),
    icontype: 2,
  },
];

const SalesMarketing =   {
  name: `Sales Marketing`,
  expand: false,
  heading: true,
  iconname: require('../../res/images/menuicon7.png'),
  icontype: 2,

  sub: [
    {
      name: `Payout Structure`,
      expand: false,
      click: 'PayinProducts',
      options: {},
    },
    {
      name: `Partner Payout`,
      expand: false,
      click: 'PartnerSelect',
      options: {},
    },
  ],
  click: '',
};

const HelpDeskMenu =   {
  name: `Helpdesk`,
  expand: false,
  heading: true,
  iconname: require('../../res/images/menuicon10.png'),
  icontype: 2,

  sub: [
    {
      name: `Relation Manager`,
      expand: false,
      click: 'Manager',
      options: {},
    },
    {
      name: `Raise A Query`,
      expand: false,
      click: 'RaiseQueryForm',
      options: {},
    },
    {
      name: `Track My Query`,
      expand: false,
      click: 'TrackQuery',
      options: {},
    },
  ],
  click: '',
};

export default class LoginScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    changeNavigationBarColor(Pref.WHITE, true);
    StatusBar.setBackgroundColor(Pref.WHITE, false);
    StatusBar.setBarStyle('dark-content');
    this.submitBtnClick = this.submitBtnClick.bind(this);
    this.otherLogin = this.otherLogin.bind(this);
    this.passunlock = this.passunlock.bind(this);
    this.state = {
      userid: '',
      password: '',
      message: '',
      loading: false,
      passeye: 'eye',
      showpassword: true,
      token: '',
      loginType:''
    };
    Pref.setVal(Pref.MENU_LIST, null);
    Pref.setVal(Pref.DIALER_TEAM_LEADER, null);
    Pref.setVal(Pref.DIALER_DATA, null);
    Pref.setVal(Pref.salespayoutUpdate, null);
    Pref.setVal(Pref.userData, null);
    Pref.setVal(Pref.userID, null);
    Pref.setVal(Pref.USERTYPE, '');
    Pref.setVal(Pref.loggedStatus, false);
    Pref.setVal(Pref.MENU_LIST, null);
  }

  componentDidMount() {
    Pref.setVal(Pref.saveToken, Pref.API_TOKEN);
    try {
      Helper.requestPermissions();
    } catch (e) {
      //console.log(e);
    }
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      if(Platform.OS === 'ios'){
        this.requestPermission();
      }
      Pref.getVal(Pref.saveToken, (value) => {
        if (Helper.nullStringCheck(value) === true) {
          const body = JSON.stringify({
            username: `ERBFinPro`,
            product: `FinPro App`,
          });
          Helper.networkHelper(
            Pref.GetToken,
            body,
            Pref.methodPost,
            (result) => {
              //console.log('result', result)
              const { data, response_header } = result;
              const { res_type } = response_header;
              if (res_type === `success`) {
                this.setState({ token: Helper.removeQuotes(data) });
                Pref.setVal(Pref.saveToken, Helper.removeQuotes(data));
              }
            },
            (error) => {
              //console.log(`error`, error)
            },
          );
        } else {
          this.setState({ token: value });
        }
      });
   });
  }

  requestPermission = async () => {
    return await notifications.requestPermission()
  }


  getToken = async () => {
    const token = await notifications.getToken()
    return token
  }


  /**
   * Other Users login
   */
  otherLogin = (token) => {
    this.getToken().then(deviceID =>{
      if(Helper.nullStringCheck(deviceID) === false){
        const jsonData = JSON.stringify({
          username: this.state.userid,
          password: this.state.password,
          deviceid: deviceID,
        });
        Helper.networkHelperTokenPost(
          Pref.LoginUrl,
          jsonData,
          Pref.methodPost,
          token,
          (result) => {
            
            const { data, response_header } = result;
            //console.log(`result`, data);
            
            const { res_type, type } = response_header;

            this.setState({ loading: false });
            if (res_type === `error`) {
              const {message} = response_header;
              Helper.showToastMessage(`${message}`, 0);
            } else {
              Pref.setVal(Pref.USERTYPE, type);
              
              //silently download agreement,certificate for faster load
              const { id, refercode } = data[0];
              
              let certPath = `${RNFetchBlob.fs.dirs.DownloadDir}/${refercode}_MyCertificate.pdf`;
              let agreePath = `${RNFetchBlob.fs.dirs.DownloadDir}/${refercode}_MyAgreement.pdf`;
              
              this.downloadFile(certPath, () => {
                const cert = `${Pref.CertUrl}?refercode=${refercode}&type=${type}`;
                Helper.silentDownloadFileWithFileName(cert, `${refercode}_MyCertificate`, `${refercode}_MyCertificate.pdf`, 'application/pdf', false);
              })
              
              this.downloadFile(agreePath, () => {
                Helper.silentDownloadFileWithFileName(`${Pref.AgreeUrl}`, `${refercode}_MyAgreement`, `${refercode}_MyAgreement.pdf`, 'application/pdf', false);
              });

              //save userdata
              Pref.setVal(Pref.userID, id);
              Pref.setVal(Pref.userData, data[0]);
              Pref.setVal(Pref.loggedStatus, true);
              
              var menuList = [];

              if(type === 'referral'){
                menuList = MainMenuList;
              }else if(type === 'team'){
                menuList = TeamMenuList;
              }else {
                menuList = ConnectorMenuList;
              }

              if(Helper.nullStringCheck(data[0].sales_enable) === false){
                if(Number(data[0].sales_enable) === 1){
                  menuList.push(SalesMarketing);
                }
              }
              
              menuList.push(HelpDeskMenu);

              Pref.setVal(Pref.MENU_LIST, menuList);

              NavigationActions.navigate('Home');
            }
          },
          (e) => {
            this.setState({ loading: false });
            Helper.showToastMessage('something went wrong', 0);
          },
        );
      }
    }).catch(e => console.log(e));
  };

  /**
   * submit button click
   */
  submitBtnClick = () =>{
    Pref.setVal(Pref.userData, null);
    Pref.setVal(Pref.userID, null);
    Pref.setVal(Pref.USERTYPE, '');
    Pref.setVal(Pref.saveToken, Pref.API_TOKEN);
    const {loginType} = this.state;
    let errorData = true;

    if (this.state.userid === '') {
      errorData = false;
      Helper.showToastMessage('Mobile number empty', 0);
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
      this.setState({ loading: true });
      let token = this.state.token;
      if(Helper.nullStringCheck(token) === true){
        token = Pref.API_TOKEN
      }
      this.otherLogin(token);
    }
  }

  downloadFile = (filePath, callback = () => { }) => {
    RNFetchBlob.fs.exists(filePath)
      .then((exist) => {
        //console.log(exist, filePath)
        if (exist) {
        } else {
          callback();
        }
      })
      .catch((err) => {
        callback();
      });
  }

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
      <CScreen
        showfooter={false}
        absolute={
          <>
            <Loader isShow={this.state.loading} />
          </>
        }
        body={
          <>
            <IntroHeader />
            <View style={{ flex: 0.87 }} styleName="v-center h-center md-gutter">
              <Title style={styles.title}>{`Welcome back`}</Title>
              <Title
                style={styles.title1}>{`please sign in\nto continue`}</Title>

              <View styleName="md-gutter">
                <AnimatedInputBox
                  onChangeText={(value) => {
                    if (String(value).match(/^[0-9]*$/g) !== null) {
                      this.setState({ userid: value })
                    }
                  }}
                  value={this.state.userid}
                  placeholder={'Enter your mobile number'}
                  maxLength={10}
                  keyboardType={'number-pad'}
                  changecolor
                  containerstyle={{
                    marginBottom: 8,
                  }}
                />

                <AnimatedInputBox
                  onChangeText={(value) => this.setState({ password: value })}
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
                  changecolor
                />              
              </View>
              <View styleName="horizontal space-between md-gutter">
                <Button
                  mode={'flat'}
                  uppercase={false}
                  dark={true}
                  loading={false}
                  style={styles.loginButtonStyle}
                  onPress={this.submitBtnClick}>
                  <Title style={styles.btntext}>{'Sign In'}</Title>
                </Button>
                <Button
                  mode={'flat'}
                  uppercase={false}
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
                  source={require('../../res/images/login.jpg')}
                  styleName={'large'}
                  style={{
                    resizeMode: 'contain',
                  }}
                />
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
    marginStart: 4,
    marginEnd: 4,
  },
});
