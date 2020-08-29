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
import {SafeAreaView} from 'react-navigation';
import {sizeFont, sizeHeight, sizeWidth} from '../../util/Size';
import Icon from 'react-native-vector-icons/Feather';
import Icons from 'react-native-vector-icons/FontAwesome5';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import DropDown from '../common/CommonDropDown';
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
      genderList: [{value: 'Male'}, {value: 'Female'}, {value: 'Other'}],
      employList: [{value: 'Self Employed'}, {value: 'Salaried'}],
      cityList: filter,
      showCityList: false,
      showGenderList: false,
      showCalendar: false,
      showEmployList: false,
      currentDate: date,
      maxDate: maxDates,
      name: '',
      pincode: '',
      currentlocation: 'Select Current Location *',
      email: '',
      mobile: '',
      gender: '',
      dob: 'Date of Birth *',
      employ: '',
      ofc_add: '',
      qualification: '',
      gst_no: '',
      nrelation: '',
      lastName: '',
      nomineename: '',
      emailTypeCd: '',
      contactTypeCd: '',
    };
  }

  componentDidMount() {
    const {saveData, title} = this.props;
    if (title === 'Fixed Deposit' || title === `Mutual Fund`) {
      this.setState({dob: 'Date of Birth'});
    } else if (title === 'Vector Plus') {
      const maxDates = new Date();
      const getyear = maxDates.getFullYear() - 18;
      maxDates.setFullYear(getyear);
      const currentDate = new Date();
      currentDate.setFullYear(getyear);
      this.setState({maxDate: maxDates, currentDate: currentDate});
    }
    if (saveData !== undefined && saveData !== null) {
      this.saveData(
        saveData.name,
        saveData.pincode,
        saveData.currentlocation,
        saveData.email,
        saveData.mobile,
        saveData.gender,
        saveData.dob,
        saveData.employ,
        saveData.address,
        saveData.qualification,
        saveData.nrelation || '',
        saveData.lastName || '',
        saveData.nomineename || '',
      );
    }
    BackHandler.addEventListener('hardwareBackPress', this.backClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
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
    const {type} = event;
    if (type === `set`) {
      this.setState({currentDate: selectDate, showCalendar: false}, () => {
        const fullDate = moment(selectDate).format('DD-MM-YYYY');
        this.setState({dob: fullDate});
      });
    } else {
      this.setState({showCalendar: false});
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
      ofc_add: address,
      qualification: qualification,
      gst_no: gst || '',
      nrelation: nrelation || '',
      lastName: lastName || '',
      nomineename: nomineename || '',
    });
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
      (title === 'Vector Plus' ||
        title.includes('Hello') ||
        title.includes('Sabse') ||
        title.includes('Asaan'))
        ? true
        : false;
    return (
      <View>
        <View
          style={{
            marginTop: sizeHeight(2),
            marginBottom: sizeHeight(1),
          }}
          styleName="horizontal">
          {/* <Icons name={'npm'} size={24} style={{ color: '#e21226', padding: 4, alignSelf: 'center', marginStart: sizeWidth(1) }} /> */}
          <View styleName="vertical" style={{marginStart: sizeWidth(2)}}>
            <Subtitle style={styles.title}> {heading}</Subtitle>
          </View>
        </View>
        <View style={styles.line} />
        <TextInput
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
        />
        {newform === true ? (
          <TextInput
            mode="flat"
            underlineColor="transparent"
            underlineColorAndroid="transparent"
            style={[
              styles.inputStyle,
              // { marginVertical: sizeHeight(1) },
            ]}
            label={'Last Name *'}
            placeholder={'Enter last name'}
            placeholderTextColor={'#DEDEDE'}
            onChangeText={(value) => this.setState({lastName: value})}
            value={this.state.lastName}
            theme={theme}
            returnKeyType={'next'}
          />
        ) : null}
        <TextInput
          mode="flat"
          underlineColor="transparent"
          underlineColorAndroid="transparent"
          style={[
            styles.inputStyle,
            // { marginVertical: sizeHeight(1) },
          ]}
          label={title === `Profile` ? `Mobile Number` : 'Mobile Number *'}
          maxLength={10}
          keyboardType={'number-pad'}
          placeholder={'Enter mobile number'}
          placeholderTextColor={'#DEDEDE'}
          onChangeText={(value) => {
            if (value.match(/^[0-9]*$/g) !== null) {
              this.setState({mobile: value});
            }
          }}
          value={this.state.mobile}
          theme={theme}
          editable={editable}
          disabled={title === 'Profile' ? true : disabled}
          returnKeyType={'next'}
        />
        <TextInput
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
          theme={theme}
          editable={editable}
          disabled={title === 'Profile' ? true : disabled}
          returnKeyType={'next'}
        />

        {newform === true ? (
          <TextInput
            mode="flat"
            underlineColor="transparent"
            underlineColorAndroid="transparent"
            style={[
              styles.inputStyle,
              // { marginVertical: sizeHeight(1) },
            ]}
            label={'Nominee Name *'}
            placeholder={'Enter nominee name'}
            placeholderTextColor={'#DEDEDE'}
            onChangeText={(value) => this.setState({nomineename: value})}
            value={this.state.nomineename}
            theme={theme}
            returnKeyType={'next'}
          />
        ) : null}

        {title === 'Profile' ? (
          <TextInput
            mode="flat"
            underlineColor="transparent"
            underlineColorAndroid="transparent"
            style={[
              styles.inputStyle,
              {
                height: this.state.ofc_add === '' ? 56 : layheight,
              },
            ]}
            label={'Office Address'}
            multiline
            onContentSizeChange={(event) => {
              layheight =
                this.state.ofc_add === ''
                  ? 56
                  : event.nativeEvent.contentSize.height;
            }}
            placeholder={'Enter address'}
            placeholderTextColor={'#DEDEDE'}
            onChangeText={(value) => this.setState({ofc_add: value})}
            value={this.state.ofc_add}
            theme={theme}
            editable={editable}
            disabled={disabled}
            returnKeyType={'next'}
          />
        ) : null}

        {title === 'Profile' ? (
          <TextInput
            mode="flat"
            underlineColor="transparent"
            underlineColorAndroid="transparent"
            style={[styles.inputStyle]}
            label={'GST Number'}
            placeholder={'Enter gst number'}
            placeholderTextColor={'#DEDEDE'}
            onChangeText={(value) => this.setState({gst_no: value})}
            value={this.state.gst_no}
            theme={theme}
            editable={editable}
            disabled={disabled}
            returnKeyType={'next'}
            maxLength={15}
          />
        ) : null}

        {title !== 'Profile' && newform === false ? (
          <TextInput
            mode="flat"
            underlineColor="transparent"
            underlineColorAndroid="transparent"
            style={[
              styles.inputStyle,
              // { marginVertical: sizeHeight(1) },
            ]}
            label={'Current Residence Pincode'}
            placeholder={'Enter residence pincode'}
            placeholderTextColor={'#DEDEDE'}
            onChangeText={(value) => {
              if (value.match(/^[0-9]*$/g) !== null) {
                this.setState({pincode: value});
              }
            }}
            maxLength={6}
            keyboardType={'number-pad'}
            value={this.state.pincode}
            theme={theme}
            editable={editable}
            disabled={disabled}
            returnKeyType={'next'}
          />
        ) : null}

        {title === `Term Insurance` || title === `Health Insurance` ? (
          <TextInput
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
        ) : null}

        {title !== 'Profile' ? (
          <View>
            <View
              style={{
                marginHorizontal: sizeWidth(3),
              }}>
              <TouchableWithoutFeedback
                onPress={() =>
                  this.setState({
                    showCalendar: true,
                  })
                }>
                <View style={styles.dropdownbox}>
                  <Subtitle
                    style={[
                      styles.boxsubtitle,
                      {
                        color:
                          this.state.dob === `Date of Birth *` ||
                          'Date of Birth'
                            ? `#767676`
                            : `#292929`,
                      },
                    ]}>
                    {this.state.dob}
                  </Subtitle>
                  <Icon
                    name={'calendar'}
                    size={24}
                    color={'#767676'}
                    style={styles.downIcon}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>

            {title === 'Vector Plus' ? (
              <View>
                <View
                  style={{
                    marginStart: 8,
                    borderBottomColor: Colors.grey300,
                    borderRadius: 2,
                    borderBottomWidth: 0.6,
                    alignContents: 'center',
                  }}>
                  <Subtitle
                    style={styles.bbstyle}>{`Select Contact Type *`}</Subtitle>

                  <RadioButton.Group
                    onValueChange={(value) =>
                      this.setState({contactTypeCd: value})
                    }
                    value={this.state.contactTypeCd}>
                    <View styleName="horizontal" style={{marginBottom: 8}}>
                      <View
                        styleName="horizontal"
                        style={{alignSelf: 'center', alignItems: 'center'}}>
                        <RadioButton
                          value="MOBILE"
                          style={{alignSelf: 'center'}}
                        />
                        <Subtitle styleName="v-center h-center">{`Mobile`}</Subtitle>
                      </View>
                      <View
                        styleName="horizontal"
                        style={{alignSelf: 'center', alignItems: 'center'}}>
                        <RadioButton
                          value="RESIDENTIAL"
                          style={{alignSelf: 'center'}}
                        />
                        <Subtitle styleName="v-center h-center">{`Residential`}</Subtitle>
                      </View>
                    </View>
                  </RadioButton.Group>
                </View>

                <View
                  style={{
                    marginStart: 8,
                    borderBottomColor: Colors.grey300,
                    borderRadius: 2,
                    borderBottomWidth: 0.6,
                    alignContents: 'center',
                  }}>
                  <Subtitle
                    style={styles.bbstyle}>{`Select Email Type *`}</Subtitle>

                  <RadioButton.Group
                    onValueChange={(value) =>
                      this.setState({emailTypeCd: value})
                    }
                    value={this.state.emailTypeCd}>
                    <View styleName="horizontal" style={{marginBottom: 8}}>
                      <View
                        styleName="horizontal"
                        style={{alignSelf: 'center', alignItems: 'center'}}>
                        <RadioButton
                          value="PERSONAL"
                          style={{alignSelf: 'center'}}
                        />
                        <Subtitle styleName="v-center h-center">{`Personal`}</Subtitle>
                      </View>
                      <View
                        styleName="horizontal"
                        style={{alignSelf: 'center', alignItems: 'center'}}>
                        <RadioButton
                          value="OFFICIAL"
                          style={{alignSelf: 'center'}}
                        />
                        <Subtitle styleName="v-center h-center">{`Official`}</Subtitle>
                      </View>
                    </View>
                  </RadioButton.Group>
                </View>
              </View>
            ) : null}

            <View
              style={{
                marginStart: 8,
                borderBottomColor: Colors.grey300,
                borderRadius: 2,
                borderBottomWidth: 0.6,
                alignContents: 'center',
              }}>
              <Subtitle style={styles.bbstyle}>{`Select Gender *`}</Subtitle>

              <RadioButton.Group
                onValueChange={(value) => this.setState({gender: value})}
                value={this.state.gender}>
                <View styleName="horizontal" style={{marginBottom: 8}}>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value="Male" style={{alignSelf: 'center'}} />
                    <Subtitle styleName="v-center h-center">{`Male`}</Subtitle>
                  </View>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value="Female" style={{alignSelf: 'center'}} />
                    <Subtitle styleName="v-center h-center">{`Female`}</Subtitle>
                  </View>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value="Other" style={{alignSelf: 'center'}} />
                    <Subtitle styleName="v-center h-center">{`Other`}</Subtitle>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
          </View>
        ) : null}

        {showemploy ? (
          <View
            style={{
              marginStart: 8,
              marginVertical: sizeHeight(0.5),
              borderBottomColor: Colors.grey300,
              borderRadius: 2,
              borderBottomWidth: 0.6,
              alignContents: 'center',
            }}>
            <Subtitle style={styles.bbstyle}>
              {`Select Employment Type *`}
            </Subtitle>

            <RadioButton.Group
              onValueChange={(value) => this.setState({employ: value})}
              value={this.state.employ}>
              <View styleName="horizontal" style={{marginBottom: 8}}>
                <View
                  styleName="horizontal"
                  style={{alignSelf: 'center', alignItems: 'center'}}>
                  <RadioButton
                    value="Self Employed"
                    style={{alignSelf: 'center'}}
                  />
                  <Subtitle styleName="v-center h-center">{`Self Employed`}</Subtitle>
                </View>
                <View
                  styleName="horizontal"
                  style={{alignSelf: 'center', alignItems: 'center'}}>
                  <RadioButton value="Salaried" style={{alignSelf: 'center'}} />
                  <Subtitle styleName="v-center h-center">{`Salaried`}</Subtitle>
                </View>
              </View>
            </RadioButton.Group>
          </View>
        ) : null}

        {newform === true ? (
          <View
            style={{
              marginStart: 8,
              marginVertical: sizeHeight(0.5),
              borderBottomColor: Colors.grey300,
              borderRadius: 2,
              borderBottomWidth: 0.6,
              alignContents: 'center',
            }}>
            <Subtitle style={styles.bbstyle}>{`Nominee Relation *`}</Subtitle>

            <RadioButton.Group
              onValueChange={(value) => this.setState({nrelation: value})}
              value={this.state.nrelation}>
              <View styleName="horizontal" style={{marginBottom: 8}}>
                <View
                  styleName="horizontal"
                  style={{alignSelf: 'center', alignItems: 'center'}}>
                  <RadioButton value="SPOUSE" style={{alignSelf: 'center'}} />
                  <Subtitle styleName="v-center h-center">{`Spouse`}</Subtitle>
                </View>
                <View
                  styleName="horizontal"
                  style={{alignSelf: 'center', alignItems: 'center'}}>
                  <RadioButton value="MOTHER" style={{alignSelf: 'center'}} />
                  <Subtitle styleName="v-center h-center">{`Mother`}</Subtitle>
                </View>
                <View
                  styleName="horizontal"
                  style={{alignSelf: 'center', alignItems: 'center'}}>
                  <RadioButton value="FATHER" style={{alignSelf: 'center'}} />
                  <Subtitle styleName="v-center h-center">{`Father`}</Subtitle>
                </View>
                <View
                  styleName="horizontal"
                  style={{alignSelf: 'center', alignItems: 'center'}}>
                  <RadioButton value="SON" style={{alignSelf: 'center'}} />
                  <Subtitle styleName="v-center h-center">{`Son`}</Subtitle>
                </View>
              </View>
              <View styleName="horizontal" style={{marginBottom: 8}}>
                <View
                  styleName="horizontal"
                  style={{alignSelf: 'center', alignItems: 'center'}}>
                  <RadioButton value="DAUGHTER" style={{alignSelf: 'center'}} />
                  <Subtitle styleName="v-center h-center">{`Daughter`}</Subtitle>
                </View>
                {title === 'Vector Plus' ? null : (
                  <>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="BROTHER"
                        style={{alignSelf: 'center'}}
                      />
                      <Subtitle styleName="v-center h-center">{`Brother`}</Subtitle>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="SISTER"
                        style={{alignSelf: 'center'}}
                      />
                      <Subtitle styleName="v-center h-center">{`Sister`}</Subtitle>
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
                            <Subtitle
                                style={styles.boxsubtitle}
                            >

                                {this.state.gender === ""
                                    ? `Select Gender`
                                    : this.state.gender}
                            </Subtitle>
                            <Icon
                                name={"chevron-down"}
                                size={24}
                                color={"#292929"}
                                style={styles.downIcon}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                    {this.state.showGenderList ? <DropDown itemCallback={value => this.setState({ showGenderList: false, gender: value })} list={this.state.genderList} /> : null}
                </View> */}

        {title !== `Profile` && newform === false ? (
          <View
            style={{
              marginHorizontal: sizeWidth(3),
            }}>
            <TouchableWithoutFeedback
              onPress={() =>
                this.setState({
                  showCityList: !this.state.showCityList,
                  showGenderList: false,
                  showEmployList: false,
                })
              }>
              <View style={styles.dropdownbox}>
                <Subtitle
                  style={[
                    styles.boxsubtitle,
                    {
                      color:
                        this.state.currentlocation ===
                        `Select Current Location *`
                          ? `#767676`
                          : `#292929`,
                    },
                  ]}>
                  {this.state.currentlocation}
                </Subtitle>
                <Icon
                  name={'chevron-down'}
                  size={24}
                  color={'#767676'}
                  style={styles.downIcon}
                />
              </View>
            </TouchableWithoutFeedback>
            {this.state.showCityList ? (
              <DropDown
                itemCallback={(value) =>
                  this.setState({showCityList: false, currentlocation: value})
                }
                list={this.state.cityList}
                isCityList
                enableSearch
              />
            ) : null}
          </View>
        ) : null}
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
                                <Subtitle
                                    style={styles.boxsubtitle}
                                >

                                    {this.state.employ === ""
                                        ? `Select Employment Type`
                                        : this.state.employ}
                                </Subtitle>
                                <Icon
                                    name={"chevron-down"}
                                    size={24}
                                    color={"#292929"}
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
    color: '#292929',
    alignSelf: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Rubik',
    fontFamily: 'bold',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
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
    marginVertical: sizeHeight(3.5),
    backgroundColor: '#e61e25',
    textAlign: 'center',
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 1,
  },
  dropdownbox: {
    flexDirection: 'row',
    height: 48,
    borderBottomColor: Colors.grey300,
    borderRadius: 2,
    borderBottomWidth: 0.6,
    marginVertical: sizeHeight(1),
    justifyContent: 'space-between',
  },
  boxsubtitle: {
    fontSize: 16,
    fontFamily: 'Rubik',
    fontWeight: '400',
    color: '#767676',
    lineHeight: 25,
    alignSelf: 'center',
    padding: 4,
    alignSelf: 'center',
    marginHorizontal: 8,
  },
  downIcon: {
    padding: 4,
    alignSelf: 'center',
    marginHorizontal: 1,
  },
  bbstyle: {
    fontSize: 16,
    fontFamily: 'Rubik',
    fontWeight: '400',
    color: '#767676',
    lineHeight: 25,
    padding: 4,
    marginHorizontal: 8,
  },
});
