import React from 'react';
import {
  StyleSheet,
  BackHandler,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import { Title, View, Image } from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {
  Button,
  Colors,
  Checkbox,
} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import { sizeHeight, sizeWidth } from '../../util/Size';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Loader from '../../util/Loader';
import Lodash from 'lodash';
import IntroHeader from '../intro/IntroHeader';
import CScreen from '../component/CScreen';
import AnimatedInputBox from '../component/AnimatedInputBox';
import NewDropDown from '../component/NewDropDown';

const professionList = [
  { value: 'Salaried' },
  { value: 'Self Employed' },
  { value: 'Others' },
]

export default class RegisterScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    changeNavigationBarColor('white', true);
    this.backClick = this.backClick.bind(this);
    this.register = this.register.bind(this);
    const filter = Lodash.orderBy(Pref.cityList, ['value'], ['asc']);
    this.state = {
      name: '',
      lastName: '',
      location: '',
      email: '',
      contact: '',
      pass: '',
      companyname: '',
      panno: '',
      gst: '',
      mode: '0',
      loading: false,
      showCityList: false,
      cityList: filter,
      mode: [{ value: 'Individual' }, { value: 'Company' }],
      modetext: 'Are You An Individual Or A Company? *',
      showmode: false,
      isTermSelected: false,
      token: '',
      profession: '',
      showprofession: false,
      enabledprofession: false,
      city: '',
      state: '',
      pincode: ''
    };
    Pref.getVal(Pref.saveToken, (value) => this.setState({ token: value }));
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backClick);
    try {
      Helper.requestPermissions();
    } catch (e) {
      console.log(e);
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    if (this.unsubscribe) this.unsubscribe();
  }

  backClick = () => {
    if (
      this.state.showCityList ||
      this.state.showmode ||
      this.state.showprofession
    ) {
      this.setState({
        showCityList: false,
        showmode: false,
        showprofession: false,
      });
      return true;
    } else {
      return false;
    }
  };

  /**
   * register
   */
  register = () => {
    var checkData = true;
    //console.log(this.state.modetext);
    if (this.state.name === '') {
      checkData = false;
      Helper.showToastMessage('Name empty', 0);
    } else if (this.state.email === '') {
      checkData = false;
      Helper.showToastMessage('Email empty', 0);
    } else if (Helper.emailCheck(this.state.email) === false) {
      checkData = false;
      Helper.showToastMessage('Invalid email', 0);
    } else if (this.state.contact === '') {
      checkData = false;
      Helper.showToastMessage('Mobile Number empty', 0);
    } else if (
      this.state.contact === '9876543210' ||
      this.state.contact === '0000000000' ||
      this.state.contact === '1234567890' ||
      this.state.contact.length < 10
    ) {
      checkData = false;
      Helper.showToastMessage('Invalid mobile number', 0);
    } else if (this.state.contact.match(/^[0-9]*$/g) === null) {
      checkData = false;
      Helper.showToastMessage('Invalid mobile number', 0);
    } else if (
      this.state.modetext === 'Are You An Individual Or A Company? *'
    ) {
      checkData = false;
      Helper.showToastMessage(
        'Please, Select are you An individual or a company?',
        0,
      );
    } else if (
      this.state.enabledprofession === true &&
      this.state.profession === ''
    ) {
      checkData = false;
      Helper.showToastMessage('Profession empty', 0);
    } else if (
      this.state.modetext === 'Company' &&
      this.state.companyname === ''
    ) {
      checkData = false;
      Helper.showToastMessage('Company name empty', 0);
    } else if (this.state.panno === '') {
      checkData = false;
      Helper.showToastMessage('Pancard empty', 0);
    } else if (!Helper.checkPanCard(this.state.panno)) {
      checkData = false;
      Helper.showToastMessage('Invalid pancard number', 0);
    } else if (
      this.state.pincode === ''
    ) {
      checkData = false;
      Helper.showToastMessage('Residence Pincode empty', 0);
    } else if (
      this.state.pincode !== '' && (this.state.city === '' || this.state.state === '')
    ) {
      checkData = false;
      Helper.showToastMessage('Failed to find city & state, Please, check pincode', 0);
    }

    //  else if (
    //   this.state.location === '' ||
    //   this.state.location === 'Select location'
    // ) {
    //   checkData = false;
    //   Helper.showToastMessage('Location empty', 0);
    // } 

    else if (!this.state.isTermSelected) {
      checkData = false;
      Helper.showToastMessage('Please, Select Term & Condition', 0);
    }
    if (checkData && this.state.isTermSelected) {
      this.setState({ loading: true });
      const jsonData = JSON.parse(JSON.stringify(this.state));
      delete jsonData.showCityList;
      delete jsonData.cityList;
      delete jsonData.isTermSelected;
      delete jsonData.loading;
      delete jsonData.mode;
      //delete jsonData.professionList;
      delete jsonData.modetext;
      delete jsonData.showmode;
      delete jsonData.showprofession;

      //email_id
      const body = JSON.stringify({
        email_id: jsonData.email,
        panno: jsonData.panno,
        number: jsonData.contact,
      });

      //console.log(`body`, body);
      Helper.networkHelperTokenPost(
        Pref.EmailOTPUrl,
        body,
        Pref.methodPost,
        this.state.token,
        (result) => {
          this.setState({ loading: false });
          const { data, response_header } = result;
          const { res_type } = response_header;
          if (res_type === `success`) {
            const { otp } = data;
            Helper.showToastMessage('OTP sent successfully', 1);
            Helper.networkHelperGet(`${Pref.SMS_OTP}?invisible=1&otp=${otp}&authkey=345308AQ4dSpkOE55f9280a7P1&mobile=91${jsonData.contact}&template_id=5f929552dd5594798d2ead5e`, () => {
            }, () => {

            })
            NavigationActions.navigate('OtpScreen', {
              mode: 0,
              emailcode: otp,
              regData: jsonData,
              forgetMode: false,
            });
          } else {
            Helper.showToastMessage(
              `Some of data already exists, please check Email, Mobile and Pancard Number`,
              0,
            );
          }
        },
        () => {
          this.setState({ loading: false });
          Helper.showToastMessage('something went wrong', 0);
        },
      );
    }
  };

  fetchcityCurrentstate = (value) => {
    const parse = String(value);
    if (parse !== '' && parse.match(/^[0-9]*$/g) !== null) {
      if (parse.length === 6) {
        this.setState({ pincode: parse });
        const url = `${Pref.PostalCityUrl}?pincode=${parse}`;
        //console.log(`url`, url);
        Helper.getNetworkHelper(
          url,
          Pref.methodGet,
          (result) => {
            const { res_type, data } = JSON.parse(result);
            //console.log(`result`, result, res_type);
            if (res_type === `error`) {
              this.setState({ city: '', state: '', pincode: value });
            } else {
              if (data.length > 0) {
                const filterActive = Lodash.filter(data, io => io.status === 'Active');
                // console.log('filterActive', filterActive)
                const state = String(filterActive[0]['State']).trim();
                const city = String(filterActive[0]['City']).trim();
                //      console.log('state', city)
                this.setState({ city: city, state: state, pincode: value });
              } else {
                this.setState({ city: '', state: '', pincode: value });
              }
            }
          },
          () => {
            this.setState({ city: '', state: '', pincode: value });
            //console.log(`error`, error);
          },
        );
      } else {
        this.setState({ city: '', state: '', pincode: parse });
      }
    } else {
      this.setState({ city: '', state: '', pincode: parse.match(/^[0-9]*$/g) !== null ? parse : this.state.pincode });
    }
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
            <IntroHeader showRight={true} />
            <View style={{ flex: 0.87 }} styleName="v-center h-center md-gutter">
              {/* <Title style={styles.title}>{`Register`}</Title> */}
              <Title
                style={
                  styles.title1
                }>{`Partner Registration`}</Title>

              <View styleName="md-gutter">
                <AnimatedInputBox
                  onChangeText={(value) => this.setState({ name: value })}
                  value={this.state.name}
                  placeholder={'Your Name *'}
                  returnKeyType={'next'}
                  changecolor
                // containerstyle={{
                //   marginBottom: 8,
                // }}
                />
                <AnimatedInputBox
                  changecolor
                  // containerstyle={{
                  //   marginBottom: 8,
                  // }}
                  placeholder={'Your Email *'}
                  onChangeText={(value) => this.setState({ email: value })}
                  value={this.state.email}
                  returnKeyType={'next'}
                />
                <AnimatedInputBox
                  changecolor
                  // containerstyle={{
                  //   marginBottom: 8,
                  // }}
                  placeholder={'Your Mobile Number *'}
                  onChangeText={(value) => {
                    if (String(value).match(/^[0-9]*$/g) !== null) {
                      this.setState({ contact: value });
                    }
                  }}
                  maxLength={10}
                  keyboardType={'number-pad'}
                  value={this.state.contact}
                  returnKeyType={'next'}
                />

                <NewDropDown
                  list={this.state.mode}
                  placeholder={'Are You An Individual Or A Company? *'}
                  selectedItem={(value) => this.setState({
                    showmode: false,
                    modetext: value,
                    enabledprofession:
                      value === 'Individual' ? true : false,
                  })}
                  style={styles.newdropdown}
                  textStyle={styles.dropdowntext}
                />

                {/* <View style={styles.radiocont}>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      this.setState({
                        showmode: !this.state.showmode,
                        companyname: '',
                        profession: 'Select Profession *',
                        showCityList: false,
                        showprofession: false,
                      })
                    }>
                    <View style={styles.dropdownbox}>
                      <Title
                        style={StyleSheet.flatten([
                          styles.boxsubtitle,
                          {
                            color:
                              this.state.modetext ===
                                'Are You An Individual Or A Company? *'
                                ? `#6d6a57`
                                : `#555555`,
                            marginStart: -4,
                          },
                        ])}>
                        {this.state.modetext}
                      </Title>
                      <Icon
                        name={'chevron-down'}
                        size={24}
                        color={'#6d6a57'}
                        style={{
                          alignSelf: 'center',
                        }}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                  {this.state.showmode ? (
                    <DropDown
                      itemCallback={(value) =>
                        this.setState({
                          showmode: false,
                          modetext: value,
                          enabledprofession:
                            value === 'Individual' ? true : false,
                        })
                      }
                      title={`Are You An Individual Or A Company?`}
                      ratioHeight={0.2}
                      list={this.state.mode}
                      isCityList={false}
                      enableSearch={false}
                      autoFocus={false}
                    />
                  ) : null}
                </View> */}

                {this.state.modetext === 'Company' ? (
                  <>
                    <AnimatedInputBox
                      changecolor
                      // containerstyle={{
                      //   marginBottom: 8,
                      // }}
                      placeholder={'Name Of The Company *'}
                      onChangeText={(value) =>
                        this.setState({ companyname: value })
                      }
                      value={this.state.companyname}
                      returnKeyType={'next'}
                    />
                    <AnimatedInputBox
                      changecolor
                      // containerstyle={{
                      //   marginBottom: 8,
                      // }}
                      placeholder={'GST Number'}
                      onChangeText={(value) =>
                        this.setState({ gst: value })
                      }
                      value={this.state.gst}
                      returnKeyType={'next'}
                      maxLength={15}
                    />
                  </>
                ) : this.state.modetext === 'Individual' ? (
                  <NewDropDown
                    list={professionList}
                    placeholder={'Select Profession *'}
                    selectedItem={(value) => this.setState({
                      profession: value,
                    })}
                    style={styles.newdropdown}
                    textStyle={styles.dropdowntext}
                  />
                  // <View style={styles.radiocont}>
                  //   <TouchableWithoutFeedback
                  //     onPress={() =>
                  //       this.setState({
                  //         showprofession: !this.state.showprofession,
                  //         showCityList: false,
                  //         showCityList: false,
                  //       })
                  //     }>
                  //     <View style={styles.dropdownbox}>
                  //       <Title
                  //         style={StyleSheet.flatten([
                  //           styles.boxsubtitle,
                  //           {
                  //             color:
                  //               this.state.profession === 'Select Profession *'
                  //                 ? `#6d6a57`
                  //                 : `#555555`,
                  //             marginStart: -4,
                  //           },
                  //         ])}>
                  //         {this.state.profession}
                  //       </Title>
                  //       <Icon
                  //         name={'chevron-down'}
                  //         size={24}
                  //         color={'#6d6a57'}
                  //         style={{
                  //           alignSelf: 'center',
                  //         }}
                  //       />
                  //     </View>
                  //   </TouchableWithoutFeedback>
                  //   {this.state.showprofession ? (
                  //     <DropDown
                  //       title={`Select Profession`}
                  //       itemCallback={(value) =>
                  //         this.setState({
                  //           showprofession: false,
                  //           profession: value,
                  // //         })
                  //       }
                  //       ratioHeight={0.2}
                  //       list={this.state.professionList}
                  //       isCityList={false}
                  //       enableSearch={false}
                  //       autoFocus={false}
                  //     />
                  //   ) : null}
                  // </View>

                ) : null}
                <AnimatedInputBox
                  changecolor
                  // containerstyle={{
                  //   marginBottom: 8,
                  // }}
                  placeholder={'PAN Details *'}
                  onChangeText={(value) => this.setState({ panno: value })}
                  value={this.state.panno}
                  maxLength={10}
                  returnKeyType={'next'}
                />
                {/* <View style={styles.radiocont}>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      this.setState({
                        showmode: false,
                        showprofession: false,
                        showCityList: !this.state.showCityList,
                      })
                    }>
                    <View style={styles.dropdownbox}>
                      <Title
                        style={StyleSheet.flatten([
                          styles.boxsubtitle,
                          {
                            color:
                              this.state.location === ''
                                ? `#6d6a57`
                                : `#555555`,
                            marginStart: -4,
                          },
                        ])}>
                        {this.state.location === ''
                          ? `Select Location *`
                          : this.state.location}
                      </Title>
                      <Icon
                        name={'chevron-down'}
                        size={24}
                        color={'#6d6a57'}
                        style={{
                          alignSelf: 'center',
                        }}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                  {this.state.showCityList ? (
                    <DropDown
                      itemCallback={(value) =>
                        this.setState({
                          showCityList: false,
                          location: value,
                        })
                      }
                      list={this.state.cityList}
                      isCityList
                      enableSearch
                      autoFocus
                    />
                  ) : null}
                </View> */}

                <AnimatedInputBox
                  changecolor
                  // containerstyle={{
                  //   marginBottom: 8,
                  // }}
                  placeholder={'Current Residence Pincode *'}
                  onChangeText={this.fetchcityCurrentstate}
                  value={this.state.pincode}
                  maxLength={6}
                  keyboardType={'numeric'}
                //returnKeyType={'next'}
                />

                <AnimatedInputBox
                  changecolor
                  // containerstyle={{
                  //   marginBottom: 8,
                  // }}
                  placeholder={'City'}
                  onChangeText={(value) => this.setState({ city: value })}
                  value={this.state.city}
                  //returnKeyType={'next'}
                  editable={false}
                  disabled={true}
                />

                <AnimatedInputBox
                  changecolor
                  // containerstyle={{
                  //   marginBottom: 8,
                  // }}
                  placeholder={'State'}
                  onChangeText={(value) => this.setState({ state: value })}
                  value={this.state.state}
                  //returnKeyType={'next'}
                  editable={false}
                  disabled={true}

                />

                <View styleName="horizontal" style={styles.copy}>
                  <Checkbox.Android
                    status={this.state.isTermSelected ? 'checked' : 'unchecked'}
                    selectedColor={Pref.PRIMARY_COLOR}
                    onPress={() =>
                      this.setState({
                        isTermSelected: !this.state.isTermSelected,
                      })
                    }
                  />
                  <TouchableWithoutFeedback
                    onPress={() => Linking.openURL(Pref.TCondition)}>
                    <Title style={styles.textopen}>
                      {`I Accept `}
                      <Title
                        style={StyleSheet.flatten([
                          styles.textopen,
                          {
                            color: Pref.CARROT_ORANGE,
                          },
                        ])}>{`Terms & Conditions`}</Title>
                    </Title>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>

            <View
              styleName="horizontal md-gutter v-center v-center space-between"
              style={{
                marginStart: 16,
                marginTop: -24,
              }}>
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
                    width: '56%'
                  },
                ]}
                onPress={() => NavigationActions.goBack()}>
                <Title style={StyleSheet.flatten([
                  styles.btntext,
                  {
                    color: '#b8b28f',
                  },
                ])}>{'Back to login'}</Title>
              </Button>
              <Button
                mode={'flat'}
                uppercase={false}
                dark={true}
                loading={false}
                style={[styles.loginButtonStyle]}
                onPress={this.register}>
                <Title style={StyleSheet.flatten([styles.btntext])}>
                  {'Next'}
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
      />
    );
  }
}

/**
 * styles
 */
const styles = StyleSheet.create({
  dropdowntext: {
    color: '#6d6a57',
    fontSize: 14,
    fontFamily: Pref.getFontName(4),
  },
  newdropdown: {
    borderRadius: 0,
    borderBottomColor: '#f2f1e6',
    borderBottomWidth: 1.3,
    borderWidth: 0,
    marginStart: 4,
    marginEnd: 4,
    //paddingVertical: 10,
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
