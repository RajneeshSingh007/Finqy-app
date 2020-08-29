import React from 'react';
import {
  StatusBar,
  StyleSheet,
  ScrollView,
  BackHandler,
  Platform,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import {
  Screen,
  Subtitle,
  Title,
  Text,
  View,
  Heading,
} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {
  Button,
  Colors,
  TextInput,
  DefaultTheme,
  Checkbox,
} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import {SafeAreaView} from 'react-navigation';
import {sizeHeight, sizeWidth} from '../../util/Size';
import Icon from 'react-native-vector-icons/Feather';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import DropDown from '../common/CommonDropDown';
import Loader from '../../util/Loader';
import Lodash from 'lodash';

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
      mode: [{value: 'Individual'}, {value: 'Company'}],
      modetext: 'Are You An Individual Or A Company? *',
      showmode: false,
      isTermSelected: false,
      token: '',
      profession: 'Select Profession *',
      professionList: [
        {value: 'Salaried'},
        {value: 'Self Employed'},
        {value: 'Others'},
      ],
      showprofession: false,
      enabledprofession: false,
    };
    Pref.getVal(Pref.saveToken, (value) => this.setState({token: value}));
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
    console.log(this.state.modetext);
    if (this.state.name === '') {
      checkData = false;
      Helper.showToastMessage('Name empty', 0);
    } else if (this.state.email === '') {
      checkData = false;
      Helper.showToastMessage('Email empty', 0);
    } else if (this.state.contact === '') {
      checkData = false;
      Helper.showToastMessage('Mobile Number empty', 0);
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
      this.state.profession === 'Select Profession *'
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
    } else if (
      this.state.location === '' ||
      this.state.location === 'Select location'
    ) {
      checkData = false;
      Helper.showToastMessage('Location empty', 0);
    } else if (!this.state.email.includes('@')) {
      checkData = false;
      Helper.showToastMessage('Invalid email', 0);
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
    } else if (!Helper.checkPanCard(this.state.panno)) {
      checkData = false;
      Helper.showToastMessage('Invalid pancard number', 0);
    } else if (!this.state.isTermSelected) {
      checkData = false;
      Helper.showToastMessage('Please, Select Term & Condition', 0);
    }
    if (checkData && this.state.isTermSelected) {
      this.setState({loading: true});
      const jsonData = JSON.parse(JSON.stringify(this.state));
      delete jsonData.showCityList;
      delete jsonData.cityList;
      delete jsonData.isTermSelected;
      delete jsonData.loading;
      delete jsonData.mode;
      delete jsonData.professionList;
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
          this.setState({loading: false});
          const {data, response_header} = result;
          const {res_type} = response_header;
          if (res_type === `success`) {
            const {otp} = data;
            Helper.showToastMessage('Email Code Sent', 1);
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
          this.setState({loading: false});
          Helper.showToastMessage('something went wrong', 0);
        },
      );
    }
  };

  sendOTPCode() {
    // const to = "+91" + this.state.contact;
    // auth().signInWithPhoneNumber(to)
    //     .then(confirmResult => {
    //         //console.log('confirmResult', confirmResult);
    //         this.setState({confirmResult: confirmResult});
    //     })
    //     .catch(error => {
    //         console.log('otperror', error);
    //        // Helper.showToastMessage('Auth Failed', 0)
    //     });
  }

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
                    marginHorizontal: sizeWidth(3),
                  }}>
                  <Heading
                    styleName="v-center h-center"
                    style={{
                      fontSize: 24,
                      fontFamily: 'Rubik',
                      letterSpacing: 1,
                    }}>
                    {`Register`}
                  </Heading>

                  {/* <Image
                                        styleName={'small v-center h-center'}
                                        source={require('../../res/images/logo.png')}
                                        style={{ alignSelf: 'center', marginVertical: sizeHeight(2) }}

                                    /> */}

                  <Title
                    styleName="v-center h-center"
                    style={{
                      fontSize: 18,
                      fontFamily: 'Rubik',
                      fontFamily: 'Rubik',
                      fontWeight: '700',
                      lineHeight: 32,
                      letterSpacing: 1,
                      marginVertical: 8,
                    }}>
                    {`Fill form to create your account`}
                  </Title>
                </View>

                <TextInput
                  mode="flat"
                  underlineColor="transparent"
                  underlineColorAndroid="transparent"
                  style={[styles.inputStyle, {marginTop: sizeHeight(0.1)}]}
                  label={'Your Name *'}
                  placeholder={'Enter your name'}
                  placeholderTextColor={'#DEDEDE'}
                  onChangeText={(value) => this.setState({name: value})}
                  value={this.state.name}
                  theme={theme}
                  returnKeyType={'next'}
                />
                {/* <TextInput
                                    mode="flat"
                                    underlineColor="transparent"
                                    underlineColorAndroid="transparent"
                                    style={[
                                        styles.inputStyle,
                                        { marginVertical: sizeHeight(1) },
                                    ]}
                                    label={"Last Name"}
                                    placeholder={"Enter last name"}
                                    placeholderTextColor={"#DEDEDE"}
                                    onChangeText={(value) =>
                                        this.setState({ lastName: value })
                                    }
                                    value={this.state.lastName}
                                    theme={theme}
                                    returnKeyType={"next"}
                                /> */}
                <TextInput
                  mode="flat"
                  underlineColor="transparent"
                  underlineColorAndroid="transparent"
                  style={[styles.inputStyle, {marginVertical: sizeHeight(0.5)}]}
                  label={'Your Email *'}
                  placeholder={'Enter your email'}
                  placeholderTextColor={'#DEDEDE'}
                  onChangeText={(value) => this.setState({email: value})}
                  value={this.state.email}
                  theme={theme}
                  returnKeyType={'next'}
                />
                <TextInput
                  mode="flat"
                  underlineColor="transparent"
                  underlineColorAndroid="transparent"
                  style={[styles.inputStyle, {marginVertical: sizeHeight(0.5)}]}
                  label={'Your Mobile Number *'}
                  placeholder={'Enter your mobile number'}
                  placeholderTextColor={'#DEDEDE'}
                  onChangeText={(value) => {
                    if (value.match(/^[0-9]*$/g) !== null) {
                      this.setState({contact: value});
                    }
                  }}
                  maxLength={10}
                  keyboardType={'number-pad'}
                  value={this.state.contact}
                  theme={theme}
                  maxLength={10}
                  keyboardType={'number-pad'}
                  returnKeyType={'next'}
                />

                <View
                  style={{
                    paddingVertical: sizeHeight(0),
                    marginHorizontal: sizeWidth(3),
                  }}>
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
                    <View style={styles.boxstyle}>
                      <Subtitle
                        style={{
                          fontSize: 16,
                          fontFamily: 'Rubik',
                          fontWeight: '400',
                          color:
                            this.state.modetext ===
                            'Are You An Individual Or A Company? *'
                              ? '#767676'
                              : '#292929',
                          lineHeight: 25,
                          alignSelf: 'center',
                          padding: 4,
                          alignSelf: 'center',
                          marginHorizontal: 8,
                        }}>
                        {this.state.modetext}
                      </Subtitle>
                      <Icon
                        name={'chevron-down'}
                        size={24}
                        color={'#767676'}
                        style={{
                          padding: 4,
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
                </View>

                {this.state.modetext === 'Company' ? (
                  <TextInput
                    mode="flat"
                    underlineColor="transparent"
                    underlineColorAndroid="transparent"
                    style={[styles.inputStyle, {marginTop: sizeHeight(0.5)}]}
                    label={'Company Name *'}
                    placeholder={'Enter company name'}
                    placeholderTextColor={'#DEDEDE'}
                    onChangeText={(value) =>
                      this.setState({companyname: value})
                    }
                    value={this.state.companyname}
                    theme={theme}
                    returnKeyType={'next'}
                  />
                ) : this.state.modetext === 'Individual' ? (
                  <View
                    style={{
                      paddingVertical: sizeHeight(0),
                      marginHorizontal: sizeWidth(3),
                    }}>
                    <TouchableWithoutFeedback
                      onPress={() =>
                        this.setState({
                          showprofession: !this.state.showprofession,
                          showCityList: false,
                          showCityList: false,
                        })
                      }>
                      <View style={styles.boxstyle}>
                        <Subtitle
                          style={{
                            fontSize: 16,
                            fontFamily: 'Rubik',
                            fontWeight: '400',
                            color:
                              this.state.profession === 'Select Profession *'
                                ? '#767676'
                                : '#292929',
                            lineHeight: 25,
                            alignSelf: 'center',
                            padding: 4,
                            alignSelf: 'center',
                            marginHorizontal: 8,
                          }}>
                          {this.state.profession}
                        </Subtitle>
                        <Icon
                          name={'chevron-down'}
                          size={24}
                          color={'#767676'}
                          style={{
                            padding: 4,
                            alignSelf: 'center',
                          }}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                    {this.state.showprofession ? (
                      <DropDown
                        title={`Select Profession`}
                        itemCallback={(value) =>
                          this.setState({
                            showprofession: false,
                            profession: value,
                          })
                        }
                        ratioHeight={0.2}
                        list={this.state.professionList}
                        isCityList={false}
                        enableSearch={false}
                        autoFocus={false}
                      />
                    ) : null}
                  </View>
                ) : null}

                {/* <TextInput
                  mode="flat"
                  underlineColor="transparent"
                  underlineColorAndroid="transparent"
                  style={[styles.inputStyle, {marginTop: sizeHeight(0.5)}]}
                  label={'Profession'}
                  placeholder={'Enter profession'}
                  placeholderTextColor={'#DEDEDE'}
                  onChangeText={(value) => this.setState({profession: value})}
                  value={this.state.profession}
                  theme={theme}
                  returnKeyType={'next'}
                /> */}

                <TextInput
                  mode="flat"
                  underlineColor="transparent"
                  underlineColorAndroid="transparent"
                  style={[styles.inputStyle, {marginTop: sizeHeight(0.5)}]}
                  label={'PAN Details *'}
                  placeholder={'Enter pan details'}
                  placeholderTextColor={'#DEDEDE'}
                  onChangeText={(value) => this.setState({panno: value})}
                  value={this.state.panno}
                  maxLength={10}
                  theme={theme}
                  returnKeyType={'next'}
                />

                {/* <TextInput
                  mode="flat"
                  underlineColor="transparent"
                  underlineColorAndroid="transparent"
                  style={[styles.inputStyle, {marginTop: sizeHeight(0.5)}]}
                  label={'GST Number'}
                  placeholder={'Enter gst number'}
                  placeholderTextColor={'#DEDEDE'}
                  onChangeText={(value) => this.setState({gst: value})}
                  maxLength={15}
                  value={this.state.gst}
                  theme={theme}
                  returnKeyType={'done'}
                /> */}

                <View
                  style={{
                    paddingVertical: sizeHeight(0),
                    marginHorizontal: sizeWidth(3),
                  }}>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      this.setState({
                        showmode: false,
                        showprofession: false,
                        showCityList: !this.state.showCityList,
                      })
                    }>
                    <View style={styles.boxstyle}>
                      <Subtitle
                        style={{
                          fontSize: 16,
                          fontFamily: 'Rubik',
                          fontWeight: '400',
                          color:
                            this.state.location === '' ? '#767676' : '#292929',
                          lineHeight: 25,
                          alignSelf: 'center',
                          padding: 4,
                          alignSelf: 'center',
                          marginHorizontal: 8,
                        }}>
                        {this.state.location === ''
                          ? `Select Location *`
                          : this.state.location}
                      </Subtitle>
                      <Icon
                        name={'chevron-down'}
                        size={24}
                        color={'#767676'}
                        style={{
                          padding: 4,
                          alignSelf: 'center',
                        }}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                  {this.state.showCityList ? (
                    <DropDown
                      itemCallback={(value) =>
                        this.setState({showCityList: false, location: value})
                      }
                      list={this.state.cityList}
                      isCityList
                      enableSearch
                      autoFocus
                    />
                  ) : null}
                </View>

                <View
                  styleName="horizontal"
                  style={{
                    marginHorizontal: sizeWidth(2),
                    alignContent: 'center',
                  }}>
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
                    <Subtitle
                      style={{
                        fontSize: 16,
                        color: '#292929',
                        alignSelf: 'center',
                      }}>
                      {`I Accept `}
                      <Subtitle
                        style={{
                          fontSize: 16,
                          color: Pref.CARROT_ORANGE,
                          alignSelf: 'center',
                        }}>{`Terms & Conditions`}</Subtitle>
                    </Subtitle>
                  </TouchableWithoutFeedback>
                </View>

                <Button
                  mode={'flat'}
                  uppercase={true}
                  dark={true}
                  loading={false}
                  style={styles.loginButtonStyle}
                  onPress={this.register}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 16,
                      letterSpacing: 1,
                    }}>
                    {'Next'}
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
  },
  boxstyle: {
    flexDirection: 'row',
    height: 48,
    borderBottomColor: Colors.grey300,
    borderRadius: 2,
    borderBottomWidth: 0.6,
    marginVertical: sizeHeight(1),
    justifyContent: 'space-between',
  },
  inputPassStyle: {
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
    marginVertical: sizeHeight(3.5),
    backgroundColor: '#e61e25',
    textAlign: 'center',
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 1,
  },
});
