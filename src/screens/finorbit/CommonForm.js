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
  HelperText,
  RadioButton,
} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import { SafeAreaView } from 'react-navigation';
import { sizeFont, sizeHeight, sizeWidth } from '../../util/Size';
import Icon from 'react-native-vector-icons/Feather';
import Icons from 'react-native-vector-icons/FontAwesome5';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import DropDown from '../common/CommonDropDown';
import Lodash from 'lodash';
import AnimatedInputBox from '../component/AnimatedInputBox';

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

let layheight = 56;

export default class CommonForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.backClick = this.backClick.bind(this);
    this.saveData = this.saveData.bind(this);
    const date = new Date();
    //date.setFullYear(2000,0,1);
    const maxDates = new Date();
    //maxDates.setFullYear(2010, 0, 1);
    const filter = Lodash.orderBy(Pref.cityList, ['value'], ['asc']);
    this.state = {
      genderList: [{ value: 'Male' }, { value: 'Female' }, { value: 'Other' }],
      employList: [{ value: 'Self Employed' }, { value: 'Salaried' }],
      cityList: filter,
      showCityList: false,
      showGenderList: false,
      showCalendar: false,
      showEmployList: false,
      currentDate: date,
      maxDate: maxDates,
      name: '',
      pincode: '',
      currentlocation: '',
      email: '',
      mobile: '',
      gender: '',
      dob: '',
      employ: '',
      ofc_add: '',
      qualification: '',
      gst_no: '',
      nrelation: '',
      lastName: '',
      nomineename: '',
      emailTypeCd: '',
      contactTypeCd: '',
      currentlocation: '',
      state: ''
    };
  }

  componentDidMount() {

    // if (saveData !== undefined && saveData !== null) {
    //   this.saveData(
    //     saveData.name,
    //     saveData.pincode,
    //     saveData.currentlocation,
    //     saveData.email,
    //     saveData.mobile,
    //     saveData.gender,
    //     saveData.dob,
    //     saveData.employ,
    //     saveData.address,
    //     saveData.qualification,
    //     saveData.nrelation || '',
    //     saveData.lastName || '',
    //     saveData.nomineename || '',
    //     saveData.gst_no || '',
    //     saveData.ofc_add || '',
    //   );
    // }
    BackHandler.addEventListener('hardwareBackPress', this.backClick);
  }

  componentWillReceiveProps(prop) {
    const { saveData, title } = prop;
    //console.log('title', prop)
    // if (title === 'Fixed Deposit' || title === `Mutual Fund`) {
    //   this.setState({ dob: 'Date of Birth' });
    // } else if (title === 'Credit Card' || title === `Term Insurance` || title === 'Health Insurance' || title === 'Insure Check') {
    //   this.setState({ dob: 'Date of Birth *' });
    // } else 
    if (title === 'Vector Plus' || title === 'Religare Group Plan') {
      const maxDates = new Date();
      const getyear = maxDates.getFullYear() - 18;
      maxDates.setFullYear(getyear);
      const currentDate = new Date();
      currentDate.setFullYear(getyear);
      this.setState({ maxDate: maxDates, currentDate: currentDate });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
  }

  restoreData(obj) {
    if (obj !== undefined) {
      this.setState(obj);
    }
  }

  backClick = () => {
    if (this.state.showCityList) {
      this.setState({
        showCityList: false,
        showGenderList: false,
        showEmployList: false,
      });
      return true;
    } else {
      return false;
    }
  };

  onChange = (event, selectDate) => {
    const { type } = event;
    if (type === `set`) {
      this.setState({ currentDate: selectDate, showCalendar: false }, () => {
        const fullDate = moment(selectDate).format('DD-MM-YYYY');
        this.setState({ dob: fullDate });
      });
    } else {
      this.setState({ showCalendar: false });
    }
  };

  saveData = (
    name,
    pincode,
    currentlocation,
    email,
    mobile,
    gender,
    dob,
    employ,
    address,
    qualification,
    gst,
    nrelation,
    lastName,
    nomineename,
    gst_no = '',
    ofc_add = '',
  ) => {
    this.setState({
      name: name,
      pincode: pincode,
      currentlocation: currentlocation,
      email: email,
      mobile: mobile,
      gender: gender,
      dob: dob,
      employ: employ,
      ofc_add: ofc_add || address,
      qualification: qualification,
      gst_no: gst_no || gst,
      nrelation: nrelation || '',
      lastName: lastName || '',
      nomineename: nomineename || '',
    });
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
            const {res_type, data} = JSON.parse(result);
            //console.log(`result`, result, res_type);
            if (res_type === `error`) {
              this.setState({ currentlocation: '', state: '', pincode: value });
            } else {
              if(data.length > 0){
                const filterActive = Lodash.filter(data, io => io.status === 'Active');
               // console.log('filterActive', filterActive)
                const state = String(filterActive[0]['State']).trim();
                const city = String(filterActive[0]['City']).trim();
                          //      console.log('state', city)
                this.setState({ currentlocation: city, state: state, pincode: value });
              }else{
                this.setState({ currentlocation: '', state: '', pincode: value });
              }
            }
          },
          (error) => {
                            this.setState({ currentlocation: '', state: '', pincode: parse });
            //console.log(`error`, error);
          },
        );
      } else {
        this.setState({ currentlocation: '', state: '', pincode: parse });
      }
    } else {
      this.setState({ currentlocation: '', state: '', pincode: parse.match(/^[0-9]*$/g) !== null ? parse : this.state.pincode });
    }
  };

  render() {
    const {
      showemploy,
      title,
      editable = true,
      disabled = false,
      heading = `Personal Details`,
    } = this.props;
    const newform =
      title &&
        (title === 'Vector Plus' || title === 'Religare Group Plan' ||
          title.includes('Hello') ||
          title.includes('Sabse') ||
          title.includes('Asaan'))
        ? true
        : false;
    return (
      <View>
        {/* <View
          style={{
            marginTop: sizeHeight(2),
            marginBottom: sizeHeight(1),
          }}
          styleName="horizontal">
          <View styleName="vertical" style={{marginStart: sizeWidth(2)}}>
            <Title style={styles.title}> {heading}</Title>
          </View>
        </View>
        <View style={styles.line} /> */}
        <AnimatedInputBox
          onChangeText={(value) => this.setState({ name: value })}
          value={this.state.name}
          placeholder={
            title === 'Profile'
              ? 'Name'
              : newform === true
                ? 'First Name *'
                : 'Full Name *'
          }
          editable={title === 'Profile' ? false : editable}
          disabled={title === 'Profile' ? true : disabled}
          returnKeyType={'next'}
          changecolor
          containerstyle={styles.animatedInputCont}
        />

        {/* <TextInput
          mode="flat"
          underlineColor="transparent"
          underlineColorAndroid="transparent"
          style={[
            styles.inputStyle,
            // { marginVertical: sizeHeight(1) },
          ]}
          label={
            title === 'Profile'
              ? 'Name'
              : newform === true
              ? 'First Name *'
              : 'Full Name *'
          }
          placeholder={
            newform === true ? `Enter first name` : 'Enter full name'
          }
          placeholderTextColor={'#DEDEDE'}
          onChangeText={(value) => this.setState({name: value})}
          value={this.state.name}
          theme={theme}
          editable={editable}
          disabled={title === 'Profile' ? true : disabled}
          returnKeyType={'next'}
        /> */}
        {newform === true ? (
          <AnimatedInputBox
            onChangeText={(value) => this.setState({ lastName: value })}
            value={this.state.lastName}
            placeholder={'Last Name *'}
            returnKeyType={'next'}
            changecolor
            containerstyle={styles.animatedInputCont}
          />
        ) : // <TextInput
          //   mode="flat"
          //   underlineColor="transparent"
          //   underlineColorAndroid="transparent"
          //   style={[
          //     styles.inputStyle,
          //     // { marginVertical: sizeHeight(1) },
          //   ]}
          //   label={'Last Name *'}
          //   placeholder={'Enter last name'}
          //   placeholderTextColor={'#DEDEDE'}
          //   onChangeText={(value) => this.setState({lastName: value})}
          //   value={this.state.lastName}
          //   theme={theme}
          //   returnKeyType={'next'}
          // />
          null}

        <AnimatedInputBox
          placeholder={
            title === `Profile` ? `Mobile Number` : 'Mobile Number *'
          }
          changecolor
          containerstyle={styles.animatedInputCont}
          maxLength={10}
          keyboardType={'number-pad'}
          onChangeText={(value) => {
            if (String(value).match(/^[0-9]*$/g) !== null) {
              this.setState({ mobile: value });
            }
          }}
          value={this.state.mobile}
          editable={title === 'Profile' ? false : editable}
          disabled={title === 'Profile' ? true : disabled}
          returnKeyType={'next'}
        />
        {/* <TextInput
          mode="flat"
          underlineColor="transparent"
          underlineColorAndroid="transparent"
          style={[
            styles.inputStyle,
            // { marginVertical: sizeHeight(1) },
          ]}
          label={title === `Profile` ? `Mobile Number` : 'Mobile Number *'}
          placeholder={'Enter mobile number'}
          placeholderTextColor={'#DEDEDE'}
          maxLength={10}
          keyboardType={'number-pad'}
          onChangeText={(value) => {
            if (value.match(/^[0-9]*$/g) !== null) {
              this.setState({mobile: value});
            }
          }}
          value={this.state.mobile}
          editable={editable}
          disabled={title === 'Profile' ? true : disabled}
          returnKeyType={'next'}
          theme={theme}
        /> */}
        <AnimatedInputBox
          placeholder={
            title === title === 'Fixed Deposit' ||
              title === 'Health Insurance' ||
              //title === `Life Cum Invt. Plan` ||
              //title === `Motor Insurance` ||
              title === `Mutual Fund` ||
              title === `Profile` || title === 'Home Loan' || title === 'Loan Against Property' || title === 'Personal Loan' || title === 'Business Loan' || title === 'Auto Loan' || title === 'Term Insurance' || title == 'Fixed Deposit' || title === 'Motor Insurance'
              ? 'Email'
              : 'Email *'
          }
          changecolor
          containerstyle={styles.animatedInputCont}
          onChangeText={(value) => this.setState({ email: value })}
          value={this.state.email}
          editable={title === 'Profile' ? false : editable}
          disabled={title === 'Profile' ? true : disabled}
          returnKeyType={'next'}
        />
        {/* <TextInput
          mode="flat"
          underlineColor="transparent"
          underlineColorAndroid="transparent"
          style={[
            styles.inputStyle,
            // { marginVertical: sizeHeight(1) },
          ]}
          label={
            title === `Home Loan`
              ? 'Email *'
              : title === 'Fixed Deposit' ||
                title === 'Health Insurance' ||
                title === `Life Cum Invt. Plan` ||
                title === `Motor Insurance` ||
                title === `Mutual Fund` ||
                title === `Profile`
              ? 'Email'
              : 'Email *'
          }
          placeholder={'Enter email'}
          placeholderTextColor={'#DEDEDE'}
          onChangeText={(value) => this.setState({email: value})}
          value={this.state.email}
          editable={editable}
          disabled={title === 'Profile' ? true : disabled}
          returnKeyType={'next'}
        /> */}

        {newform === true ? (
          <AnimatedInputBox
            onChangeText={(value) => this.setState({ nomineename: value })}
            value={this.state.nomineename}
            placeholder={'Nominee Name *'}
            returnKeyType={'next'}
            changecolor
            containerstyle={styles.animatedInputCont}
          />
        ) : // <TextInput
          //   mode="flat"
          //   underlineColor="transparent"
          //   underlineColorAndroid="transparent"
          //   style={[
          //     styles.inputStyle,
          //     // { marginVertical: sizeHeight(1) },
          //   ]}
          //   label={'Nominee Name *'}
          //   placeholder={'Enter nominee name'}
          //   placeholderTextColor={'#DEDEDE'}
          //   onChangeText={(value) => this.setState({nomineename: value})}
          //   value={this.state.nomineename}
          //   theme={theme}
          //   returnKeyType={'next'}
          // />
          null}

        {title === 'Profile' ? (
          <AnimatedInputBox
            placeholder={'Office Address'}
            returnKeyType={'next'}
            changecolor
            containerstyle={StyleSheet.flatten([
              styles.animatedInputCont,
              {
                //height: this.state.ofc_add === '' ? 56 : layheight,
              },
            ])}
            // multiline
            // onContentSizeChange={(event) => {
            //   layheight =
            //     this.state.ofc_add === ''
            //       ? 56
            //       : event.nativeEvent.contentSize.height;
            // }}
            //selection={{start:0, end:0}}
            onChangeText={(value) => this.setState({ ofc_add: value })}
            value={this.state.ofc_add}
            editable={editable}
            disabled={disabled}
          />
        ) : // <TextInput
          //   mode="flat"
          //   underlineColor="transparent"
          //   underlineColorAndroid="transparent"
          //   style={[
          //     styles.inputStyle,
          //     {
          //       height: this.state.ofc_add === '' ? 56 : layheight,
          //     },
          //   ]}
          //   label={'Office Address'}
          //   placeholder={'Enter address'}
          //   placeholderTextColor={'#DEDEDE'}
          //               multiline
          //   onContentSizeChange={(event) => {
          //     layheight =
          //       this.state.ofc_add === ''
          //         ? 56
          //         : event.nativeEvent.contentSize.height;
          //   }}
          //   onChangeText={(value) => this.setState({ofc_add: value})}
          //   value={this.state.ofc_add}
          //   editable={editable}
          //   disabled={disabled}
          //   returnKeyType={'next'}
          //               theme={theme}

          // />
          null}

        {title === 'Profile' ? (
          <AnimatedInputBox
            onChangeText={(value) => this.setState({ gst_no: value })}
            value={this.state.gst_no}
            placeholder={'GST Number'}
            editable={editable}
            disabled={disabled}
            returnKeyType={'next'}
            maxLength={15}
            changecolor
            containerstyle={styles.animatedInputCont}
          />
        ) : // <TextInput
          //   mode="flat"
          //   underlineColor="transparent"
          //   underlineColorAndroid="transparent"
          //   style={[styles.inputStyle]}
          //   label={'GST Number'}
          //   placeholder={'Enter gst number'}
          //   placeholderTextColor={'#DEDEDE'}
          //   onChangeText={(value) => this.setState({gst_no: value})}
          //   value={this.state.gst_no}
          //   theme={theme}
          //   editable={editable}
          //   disabled={disabled}
          //   returnKeyType={'next'}
          //   maxLength={15}
          // />
          null}

        {title !== 'Profile' && title !== 'Insure Check' && newform === false ? (
          <AnimatedInputBox
            // onChangeText={(value) => {
            //   if (String(value).match(/^[0-9]*$/g) !== null) {
            //     this.setState({ pincode: value });
            //   }
            // }}
            onChangeText={this.fetchcityCurrentstate}
            maxLength={6}
            keyboardType={'number-pad'}
            value={this.state.pincode}
            //placeholder={'Current Residence Pincode'}
            placeholder={`Current Residence Pincode ${title === 'Credit Card' || title === 'Term Insurance' || title === `Life Cum Invt. Plan` || title === 'Fixed Deposit' || title === 'Mutual Fund' || title === 'Health Insurance' || title === 'Motor Insurance' || title === 'Insure Check' ? '*' : ''}`}
            editable={editable}
            disabled={disabled}
            returnKeyType={'next'}
            changecolor
            containerstyle={styles.animatedInputCont}
          />
        ) : // <TextInput
          //   mode="flat"
          //   underlineColor="transparent"
          //   underlineColorAndroid="transparent"
          //   style={[
          //     styles.inputStyle,
          //     // { marginVertical: sizeHeight(1) },
          //   ]}
          //   label={'Current Residence Pincode'}
          //   placeholder={'Enter residence pincode'}
          //   placeholderTextColor={'#DEDEDE'}
          //   onChangeText={(value) => {
          //     if (value.match(/^[0-9]*$/g) !== null) {
          //       this.setState({pincode: value});
          //     }
          //   }}
          //   maxLength={6}
          //   keyboardType={'number-pad'}
          //   value={this.state.pincode}
          //   theme={theme}
          //   editable={editable}
          //   disabled={disabled}
          //   returnKeyType={'next'}
          // />
          null}

        {title !== 'Profile' ? <>
        <AnimatedInputBox
          onChangeText={(value) => this.setState({ currentlocation: value })}
          value={this.state.currentlocation}
          placeholder={`City`}
          editable={false}
          disabled={true}
          returnKeyType={'next'}
          changecolor
          containerstyle={styles.animatedInputCont}
        />

        <AnimatedInputBox
          onChangeText={(value) => this.setState({ state: value })}
          value={this.state.state}
          placeholder={'State'}
          editable={false}
          disabled={true}
          returnKeyType={'next'}
          changecolor
          containerstyle={styles.animatedInputCont}
        />
        </> : null}


        {/* {title === `Term Insurance` ? (
          <AnimatedInputBox
            onChangeText={(value) => this.setState({ qualification: value })}
            value={this.state.qualification}
            placeholder={'Qualification *'}
            editable={editable}
            disabled={disabled}
            returnKeyType={'next'}
            changecolor
            containerstyle={styles.animatedInputCont}
          />
        ) :  <TextInput
            mode="flat"
            underlineColor="transparent"
            underlineColorAndroid="transparent"
            style={[
              styles.inputStyle,
              // { marginVertical: sizeHeight(1) },
            ]}
            label={`Qualification *`}
            placeholder={'Enter qualification'}
            placeholderTextColor={'#DEDEDE'}
            onChangeText={(value) => this.setState({qualification: value})}
            value={this.state.qualification}
            theme={theme}
            editable={editable}
            disabled={disabled}
            returnKeyType={'next'}
          />
          null} */}


        {title !== 'Profile' && title !== 'Motor Insurance' ? (
          <View>
            <View style={styles.radiocont}>
              <TouchableWithoutFeedback
                onPress={() =>
                  this.setState({
                    showCalendar: true,
                  })
                }>
                <View style={styles.dropdownbox}>
                  <Title
                    style={[
                      styles.boxsubtitle,
                      {
                        color:
                          this.state.dob === ''?
                             `#6d6a57`
                            : `#555555`,
                      },
                    ]}>
                    {this.state.dob === '' ? `Date of Birth ${title === 'Credit Card' || title === `Term Insurance` || title === 'Health Insurance' || title === 'Insure Check' ? `*` : ''}` : this.state.dob}
                  </Title>
                  <Icon
                    name={'calendar'}
                    size={24}
                    color={'#6d6a57'}
                    style={styles.downIcon}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>

            {title === 'Vector Plus' || title === 'Religare Group Plan' ? (
              <View>
                <View style={styles.radiocont}>
                  <View style={styles.radiodownbox}>
                    <Title
                      style={styles.bbstyle}>{`Select Contact Type *`}</Title>

                    <RadioButton.Group
                      onValueChange={(value) =>
                        this.setState({ contactTypeCd: value })
                      }
                      value={this.state.contactTypeCd}>
                      <View styleName="horizontal" style={{ marginBottom: 8 }}>
                        <View
                          styleName="horizontal"
                          style={{ alignSelf: 'center', alignItems: 'center' }}>
                          <RadioButton
                            value="MOBILE"
                            style={{ alignSelf: 'center' }}
                          />
                          <Title
                            styleName="v-center h-center"
                            style={styles.textopen}>{`Mobile`}</Title>
                        </View>
                        <View
                          styleName="horizontal"
                          style={{ alignSelf: 'center', alignItems: 'center' }}>
                          <RadioButton
                            value="RESIDENTIAL"
                            style={{ alignSelf: 'center' }}
                          />
                          <Title
                            styleName="v-center h-center"
                            style={styles.textopen}>{`Residential`}</Title>
                        </View>
                      </View>
                    </RadioButton.Group>
                  </View>
                </View>

                <View style={styles.radiocont}>
                  <View style={styles.radiodownbox}>
                    <Title
                      style={styles.bbstyle}>{`Select Email Type *`}</Title>
                    <RadioButton.Group
                      onValueChange={(value) =>
                        this.setState({ emailTypeCd: value })
                      }
                      value={this.state.emailTypeCd}>
                      <View styleName="horizontal" style={{ marginBottom: 8 }}>
                        <View
                          styleName="horizontal"
                          style={{ alignSelf: 'center', alignItems: 'center' }}>
                          <RadioButton
                            value="PERSONAL"
                            style={{ alignSelf: 'center' }}
                          />
                          <Title
                            styleName="v-center h-center"
                            style={styles.textopen}>{`Personal`}</Title>
                        </View>
                        <View
                          styleName="horizontal"
                          style={{ alignSelf: 'center', alignItems: 'center' }}>
                          <RadioButton
                            value="OFFICIAL"
                            style={{ alignSelf: 'center' }}
                          />
                          <Title
                            styleName="v-center h-center"
                            style={styles.textopen}>{`Official`}</Title>
                        </View>
                      </View>
                    </RadioButton.Group>
                  </View>
                </View>
              </View>
            ) : null}

            {title !== 'Insure Check' && title !== 'Motor Insurance' ? <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                <Title style={styles.bbstyle}>{`Select Gender ${title === 'Credit Card' || title === 'Term Insurance' || title === `Life Cum Invt. Plan` || title === 'Fixed Deposit' || title === 'Mutual Fund' || title === 'Health Insurance' || title === "Vector Plus" || title === 'Religare Group Plan' ? '*' : ''}`}</Title>
                <RadioButton.Group
                  onValueChange={(value) => this.setState({ gender: value })}
                  value={this.state.gender}>
                  <View styleName="horizontal" style={{ marginBottom: 8 }}>
                    <View
                      styleName="horizontal"
                      style={{ alignSelf: 'center', alignItems: 'center' }}>
                      <RadioButton value="Male" style={{ alignSelf: 'center' }} />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Male`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{ alignSelf: 'center', alignItems: 'center' }}>
                      <RadioButton
                        value="Female"
                        style={{ alignSelf: 'center' }}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Female`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{ alignSelf: 'center', alignItems: 'center' }}>
                      <RadioButton
                        value="Other"
                        style={{ alignSelf: 'center' }}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Other`}</Title>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </View>
              : null}
          </View>
        ) : null}

        {title === 'Health Insurance' || title === 'Term Insurance' ? <View style={styles.radiocont}>
          <View style={StyleSheet.flatten([styles.radiodownbox, {
            height: 124
          }])}>
            <Title style={styles.bbstyle}>{`Qualification *`}</Title>
            <RadioButton.Group
              onValueChange={(value) => this.setState({ qualification: value })}
              value={this.state.qualification}>
              <View styleName="horizontal" style={{ marginBottom: 8, flexWrap: title === 'Health Insurance' || title =='Term Insurance' ? 'wrap' : 'nowrap' }}>
                <View
                  styleName="horizontal"
                  style={{ alignSelf: 'center', alignItems: 'center' }}>
                  <RadioButton
                    value="Undergraduate"
                    style={{ alignSelf: 'center' }}
                  />
                  <Title
                    styleName="v-center h-center"
                    style={styles.textopen}>{`Undergraduate`}</Title>
                </View>
                <View
                  styleName="horizontal"
                  style={{ alignSelf: 'center', alignItems: 'center' }}>
                  <RadioButton
                    value="Graduate"
                    style={{ alignSelf: 'center' }}
                  />
                  <Title
                    styleName="v-center h-center"
                    style={styles.textopen}>{`Graduate`}</Title>
                </View>
                {title === 'Health Insurance' || title === 'Term Insurance' ? <>
                                  <View
                    styleName="horizontal"
                    style={{ alignSelf: 'center', alignItems: 'center' }}>
                    <RadioButton
                      value="Postgraduate"
                      style={{ alignSelf: 'center' }}
                    />
                    <Title
                      styleName="v-center h-center"
                      style={styles.textopen}>{`Post-Graduate`}</Title>
                  </View>

                  <View
                    styleName="horizontal"
                    style={{ alignSelf: 'center', alignItems: 'center' }}>
                    <RadioButton
                      value="Professional"
                      style={{ alignSelf: 'center' }}
                    />
                    <Title
                      styleName="v-center h-center"
                      style={styles.textopen}>{`Professional`}</Title>
                  </View>

                  <View
                    styleName="horizontal"
                    style={{ alignSelf: 'center', alignItems: 'center' }}>
                    <RadioButton
                      value="Diploma"
                      style={{ alignSelf: 'center' }}
                    />
                    <Title
                      styleName="v-center h-center"
                      style={styles.textopen}>{`Diploma`}</Title>
                  </View>

                  <View
                    styleName="horizontal"
                    style={{ alignSelf: 'center', alignItems: 'center' }}>
                    <RadioButton
                      value="Other"
                      style={{ alignSelf: 'center' }}
                    />
                    <Title
                      styleName="v-center h-center"
                      style={styles.textopen}>{`Other`}</Title>
                  </View>

                </> : null}
              </View>
            </RadioButton.Group>
          </View>
        </View>
          : null}

        {showemploy ? (
          <View style={styles.radiocont}>
            <View style={StyleSheet.flatten([styles.radiodownbox, {
              height: title === `Health Insurance` ? 90 : 56
            }])}>
              <Title style={styles.bbstyle}>{`Select Employment Type ${title === 'Credit Card' || title === 'Term Insurance' || title === 'Health Insurance' ? '*' : ''}`}</Title>
              <RadioButton.Group
                onValueChange={(value) => this.setState({ employ: value })}
                value={this.state.employ}>
                <View styleName="horizontal" style={{ marginBottom: 8, flexWrap: title === 'Health Insurance' ? 'wrap' : 'nowrap' }}>
                  <View
                    styleName="horizontal"
                    style={{ alignSelf: 'center', alignItems: 'center' }}>
                    <RadioButton
                      value="Self Employed"
                      style={{ alignSelf: 'center' }}
                    />
                    <Title
                      styleName="v-center h-center"
                      style={styles.textopen}>{`Self Employed`}</Title>
                  </View>
                  <View
                    styleName="horizontal"
                    style={{ alignSelf: 'center', alignItems: 'center' }}>
                    <RadioButton
                      value="Salaried"
                      style={{ alignSelf: 'center' }}
                    />
                    <Title
                      styleName="v-center h-center"
                      style={styles.textopen}>{`Salaried`}</Title>
                  </View>
                  {title === 'Health Insurance' ? <>
                    <View
                      styleName="horizontal"
                      style={{ alignSelf: 'center', alignItems: 'center' }}>
                      <RadioButton
                        value="Student"
                        style={{ alignSelf: 'center' }}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Student`}</Title>
                    </View>

                    <View
                      styleName="horizontal"
                      style={{ alignSelf: 'center', alignItems: 'center' }}>
                      <RadioButton
                        value="Housewife"
                        style={{ alignSelf: 'center' }}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Housewife`}</Title>
                    </View>

                  </> : null}
                </View>
              </RadioButton.Group>
            </View>
          </View>
        ) : null}

        {newform === true ? (
          <View style={StyleSheet.flatten([styles.radiocont, { marginTop: 8 }])}>
            <Title style={styles.bbstyle}>{`Nominee Relation *`}</Title>
            <RadioButton.Group
              onValueChange={(value) => this.setState({ nrelation: value })}
              value={this.state.nrelation}>
              <View styleName="horizontal" style={{ marginBottom: 8 }}>
                <View
                  styleName="horizontal"
                  style={{ alignSelf: 'center', alignItems: 'center' }}>
                  <RadioButton value="SPOUSE" style={{ alignSelf: 'center' }} />
                  <Title
                    styleName="v-center h-center"
                    style={styles.textopen}>{`Spouse`}</Title>
                </View>
                <View
                  styleName="horizontal"
                  style={{ alignSelf: 'center', alignItems: 'center' }}>
                  <RadioButton value="MOTHER" style={{ alignSelf: 'center' }} />
                  <Title
                    styleName="v-center h-center"
                    style={styles.textopen}>{`Mother`}</Title>
                </View>
                <View
                  styleName="horizontal"
                  style={{ alignSelf: 'center', alignItems: 'center' }}>
                  <RadioButton value="FATHER" style={{ alignSelf: 'center' }} />
                  <Title
                    styleName="v-center h-center"
                    style={styles.textopen}>{`Father`}</Title>
                </View>
                <View
                  styleName="horizontal"
                  style={{ alignSelf: 'center', alignItems: 'center' }}>
                  <RadioButton value="SON" style={{ alignSelf: 'center' }} />
                  <Title
                    styleName="v-center h-center"
                    style={styles.textopen}>{`Son`}</Title>
                </View>
              </View>
              <View styleName="horizontal" style={{ marginBottom: 8 }}>
                <View
                  styleName="horizontal"
                  style={{ alignSelf: 'center', alignItems: 'center' }}>
                  <RadioButton value="DAUGHTER" style={{ alignSelf: 'center' }} />
                  <Title
                    styleName="v-center h-center"
                    style={styles.textopen}>{`Daughter`}</Title>
                </View>
                {title === 'Vector Plus' || title === 'Religare Group Plan' ? null : (
                  <>
                    <View
                      styleName="horizontal"
                      style={{ alignSelf: 'center', alignItems: 'center' }}>
                      <RadioButton
                        value="BROTHER"
                        style={{ alignSelf: 'center' }}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Brother`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{ alignSelf: 'center', alignItems: 'center' }}>
                      <RadioButton
                        value="SISTER"
                        style={{ alignSelf: 'center' }}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Sister`}</Title>
                    </View>
                  </>
                )}
              </View>
            </RadioButton.Group>
          </View>
        ) : null}
        {/* 
                <View
                    style={{
                        
                        marginHorizontal: sizeWidth(3),
                    }}
                >
                    <TouchableWithoutFeedback
                        onPress={() =>
                            this.setState({
                                showGenderList: !this.state.showGenderList,
                                showCityList:false,
                                showEmployList:false
                            })
                        }
                    >
                        <View
                            style={styles.dropdownbox}
                        >
                            <Title
                                style={styles.boxsubtitle}
                            >

                                {this.state.gender === ""
                                    ? `Select Gender`
                                    : this.state.gender}
                            </Title>
                            <Icon
                                name={"chevron-down"}
                                size={24}
                                color={"#555555"}
                                style={styles.downIcon}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                    {this.state.showGenderList ? <DropDown itemCallback={value => this.setState({ showGenderList: false, gender: value })} list={this.state.genderList} /> : null}
                </View> */}

        {/* {title !== `Profile` && newform === false ? (
          <View style={styles.radiocont}>
            <TouchableWithoutFeedback
              onPress={() =>
                this.setState({
                  showCityList: !this.state.showCityList,
                  showGenderList: false,
                  showEmployList: false,
                })
              }>
              <View style={styles.dropdownbox}>
                <Title
                  style={[
                    styles.boxsubtitle,
                    {
                      color:
                        this.state.currentlocation === ``
                          ? `#6d6a57`
                          : `#555555`,
                    },
                  ]}>
                  {this.state.currentlocation === ''
                    ? `Select Current Location ${title === 'Credit Card' || title === 'Term Insurance' || title === `Life Cum Invt. Plan` || title === 'Fixed Deposit' || title === 'Mutual Fund' || title === 'Health Insurance' || title === 'Motor Insurance' || title === 'Insure Check' ? '*' : ''}`
                    : this.state.currentlocation}
                </Title>
                <Icon
                  name={'chevron-down'}
                  size={24}
                  color={'#6d6a57'}
                  style={styles.downIcon}
                />
              </View>
            </TouchableWithoutFeedback>
            {this.state.showCityList ? (
              <DropDown
                itemCallback={(value) =>
                  this.setState({ showCityList: false, currentlocation: value })
                }
                list={this.state.cityList}
                isCityList
                enableSearch
              />
            ) : null}
          </View>
        ) : null} */}
        {/* {showemploy ?
                    <View
                        style={{
                            
                            marginHorizontal: sizeWidth(3),
                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={() => this.setState({
                                showEmployList: !this.state.showEmployList, showGenderList: false,
                                showCityList: false
                            })}
                        >
                            <View
                                style={styles.dropdownbox}
                            >
                                <Title
                                    style={styles.boxsubtitle}
                                >

                                    {this.state.employ === ""
                                        ? `Select Employment Type`
                                        : this.state.employ}
                                </Title>
                                <Icon
                                    name={"chevron-down"}
                                    size={24}
                                    color={"#555555"}
                                    style={styles.downIcon}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                        {this.state.showEmployList ? <DropDown itemCallback={value => this.setState({ showEmployList: false, employ: value })} list={this.state.employList} /> : null}

                    </View> : null} */}


        {this.state.showCalendar ? (
          <DateTimePicker
            value={this.state.currentDate}
            mode={'date'}
            is24Hour={false}
            display={'spinner'}
            onChange={this.onChange}
            maximumDate={this.state.maxDate}
          />
        ) : null}
      </View>
    );
  }
}

/**
 * styles
 */
const styles = StyleSheet.create({
  radiocont: {
    marginStart: 10,
    marginEnd: 10,
    borderBottomWidth: 1.3,
    borderBottomColor: '#f2f1e6',
    alignContent: 'center',
  },
  animatedInputCont: {
    marginStart: 10,
    marginEnd: 10,
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
    paddingVertical: sizeHeight(0.5),
    marginHorizontal: sizeWidth(3),
    marginVertical: sizeHeight(3.5),
    backgroundColor: '#e61e25',
    textAlign: 'center',
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 1,
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
});
