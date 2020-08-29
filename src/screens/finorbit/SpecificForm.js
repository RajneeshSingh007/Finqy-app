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
import {FlatList} from 'react-native-gesture-handler';

let itemData = null;
let curpos = -1;
let floatCloneList = [
  {
    id: 1,
    name: '',
    gender: '',
    dob: '',
    relation: '',
  },
  {
    id: 2,
    name: '',
    gender: '',
    dob: '',
    relation: '',
  },
  {
    id: 3,
    name: '',
    gender: '',
    dob: '',
    relation: '',
  },
  {
    id: 4,
    name: '',
    gender: '',
    dob: '',
    relation: '',
  },
];

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

export default class SpecificForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.backClick = this.backClick.bind(this);
    this.saveData = this.saveData.bind(this);
    this.renderFloatRow = this.renderFloatRow.bind(this);
    this.onFloatDatePicker = this.onFloatDatePicker.bind(this);
    this.onFloatitemChange = this.onFloatitemChange.bind(this);
    this.enableCalendar = this.enableCalendar.bind(this);
    const date = new Date();
    date.setFullYear(2000, 0, 1);
    const maxDates = new Date();
    maxDates.setFullYear(2000, 0, 1);
    const filter = Lodash.orderBy(Pref.cityList, ['value'], ['asc']);
    const {title} = this.props;
    this.state = {
      company: '',
      amount: '',
      companylocation: '',
      aadharcardNo: '',
      pancardNo: '',
      turnover: '',
      nooldcard: '',
      existingcard: '',
      loan_property_city: 'Select Loan Property City *',
      rcbook: '',
      model: '',
      car_brand: '',
      car_value: '',
      car_model: '',
      reg_no: '',
      insurance: '',
      type_loan: '',
      claim_type: '',
      required_cover: '',
      family_floater: '',
      investment_amount: '',
      marital_status: '',
      profession: '',
      lifestyle: '',
      lifestyle2: '',
      payment_mode: '',
      existing_diseases: '',
      vectorTypeIns: `Select Type of Insurance`,
      vectorCover: `Select Required Cover`,
      cityList: filter,
      currentDate: date,
      maxDate: maxDates,
      showCarList: false,
      showCompanyCityList: false,
      showExisitingList: false,
      showCalendar: false,
      showLoanCityList: false,
      motorInsList: [{value: 'New'}, {value: 'Renewal'}],
      exisitingList: [{value: 'Yes'}, {value: 'No'}],
      employList: [{value: 'Self Employed'}, {value: 'Salaried'}],
      carList: [{value: 'New'}, {value: 'Old'}],
      termInsList: [
        {value: title === 'Term Insurance' ? 'ROP' : 'Single'},
        {value: title === 'Term Insurance' ? 'Without ROP' : 'Family Floater'},
      ],
      showmotorInsList: false,
      showtermInsList: false,
      healthFList: [
        {value: '2 Adult'},
        {value: '2 Adult 1 Child'},
        {value: '2 Adult 2 Children'},
        {value: '1 Adult 1 Child'},
        {value: '1 Adult 2 Children'},
      ],
      showHealthFlist: false,
      maritalList: [{value: 'Single'}, {value: 'Married'}],
      showmaritalList: false,
      vectorInsuList: [{value: `Individual`}, {value: 'Family Floater'}],
      showvectorInsuList: false,
      vectorCoverList: [{value: `50K`}, {value: '1 Lac'}],
      showvectorCoverList: false,
      floaterItemList: [],
      showItemCalendar: false,
    };
  }

  componentDidMount() {
    const {saveData, title} = this.props;
    if (title === `Vector Plus` || title === `Health Insurance`) {
      this.setState({
        healthFList: [
          {value: '2 Adult'},
          {value: '2 Adult 1 Child'},
          {value: '2 Adult 2 Children'},
          {value: '1 Adult 1 Child'},
          {value: '1 Adult 2 Children'},
          {value: '2 Adult 3 Children'},
          {value: '1 Adult 3 Children'},
        ],
      });
    }

    if (saveData !== undefined && saveData !== null) {
      this.saveData(
        saveData.company,
        saveData.amount,
        saveData.companylocation,
        saveData.aadharcardNo,
        saveData.pancardNo,
        saveData.turnover,
        saveData.nooldcard,
        saveData.existingcard,
        saveData.loan_property_city,
        saveData.rcbook,
        saveData.model,
        saveData.car_brand,
        saveData.car_value,
        saveData.car_model,
        saveData.reg_no,
        saveData.insurance,
        saveData.claim_type,
        saveData.required_cover,
        saveData.family_floater,
        saveData.investment_amount,
        saveData.marital_status,
        saveData.profession,
        saveData.lifestyle,
        saveData.lifestyle2,
        saveData.payment_mode,
        saveData.existing_diseases,
      );
    }
    BackHandler.addEventListener('hardwareBackPress', this.backClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
  }

  saveData = (
    company,
    amount,
    companylocation,
    aadharcardNo,
    pancardNo,
    turnover,
    nooldcard,
    existingcard,
    loan_property_city,
    rcbook,
    model,
    car_brand,
    car_value,
    car_model,
    reg_no,
    insurance,
    claim_type,
    required_cover,
    family_floater,
    investment_amount,
    marital_status,
    profession,
    lifestyle,
    lifestyle2,
    payment_mode,
    existing_diseases,
  ) => {
    this.setState({
      company: company,
      amount: amount,
      companylocation: companylocation,
      aadharcardNo: aadharcardNo,
      pancardNo: pancardNo,
      turnover: turnover,
      nooldcard: nooldcard,
      existingcard: existingcard,
      loan_property_city: loan_property_city,
      rcbook: rcbook,
      model: model,
      car_brand: car_brand,
      car_value: car_value,
      car_model: car_model,
      reg_no: reg_no,
      insurance: insurance,
      claim_type: claim_type,
      required_cover: required_cover,
      family_floater: family_floater,
      investment_amount: investment_amount,
      marital_status: marital_status,
      profession: profession,
      lifestyle: lifestyle,
      lifestyle2: lifestyle2,
      payment_mode: payment_mode,
      existing_diseases: existing_diseases,
    });
  };

  backClick = () => {
    const {
      showCompanyCityList,
      showExisitingList,
      showLoanCityList,
      showCarList,
      showmotorInsList,
      showtermInsList,
      showHealthFlist,
      showmaritalList,
      showvectorInsuList,
      showvectorCoverList,
    } = this.state;
    if (
      showCompanyCityList ||
      showExisitingList ||
      showLoanCityList ||
      showCarList ||
      showmotorInsList ||
      showtermInsList ||
      showHealthFlist ||
      showmaritalList ||
      showvectorInsuList ||
      showvectorCoverList ||
      showvectorCoverList
    ) {
      this.setState({
        showCompanyCityList: false,
        showExisitingList: false,
        showLoanCityList: false,
        showCarList: false,
        showmotorInsList: false,
        showtermInsList: false,
        showHealthFlist: false,
        showmaritalList: false,
        showvectorInsuList: false,
        showvectorCoverList: false,
        showvectorCoverList: false,
      });
      return true;
    } else {
      return false;
    }
  };

  onChange = (event, selectDate) => {
    if (event.type === 'set') {
      const fullDate = moment(selectDate).format('DD-MM-YYYY');
      this.setState({showCalendar: false, currentDate: selectDate});
    }
  };

  onFloatitemChange(value, item, type, index) {
    if (type === 0) {
      item.name = value;
    } else if (type === 1) {
      item.gender = value;
    } else if (type === 2) {
      item.dob = value;
    } else if (type === 3) {
      item.relation = value;
    }
    console.log(`item`, item);
    const {floaterItemList} = this.state;
    floaterItemList[index] = item;
    this.setState({floaterItemList: floaterItemList}, () => {
      this.forceUpdate();
    });
  }

  onFloatDatePicker = (event, selectDate) => {
    if (event.type === 'set') {
      const fullDate = moment(selectDate).format('DD-MM-YYYY');
      this.setState({showItemCalendar: false}, () => {
        this.onFloatitemChange(fullDate, itemData, 2, curpos);
      });
    }
  };

  enableCalendar(item, index) {
    itemData = item;
    curpos = index;
    this.setState({showItemCalendar: true});
  }

  renderFloatRow(item, index) {
    return (
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View>
          <View
            style={{
              marginTop: sizeHeight(2),
              marginBottom: sizeHeight(1),
            }}
            styleName="horizontal">
            <View styleName="vertical" style={{marginStart: sizeWidth(2)}}>
              <Subtitle style={styles.title}> {`Member Details *`}</Subtitle>
            </View>
          </View>
          <View style={styles.line} />
          <TextInput
            mode="flat"
            underlineColor="transparent"
            underlineColorAndroid="transparent"
            style={[
              styles.inputStyle,
              //{ marginVertical: sizeHeight(1) },
            ]}
            label={'Full Name'}
            placeholder={'Enter full name'}
            onChangeText={(value) =>
              this.onFloatitemChange(value, item, 0, index)
            }
            value={item.name}
            theme={theme}
            returnKeyType={'next'}
          />
          <TextInput
            mode="flat"
            underlineColor="transparent"
            underlineColorAndroid="transparent"
            style={[
              styles.inputStyle,
              //{ marginVertical: sizeHeight(1) },
            ]}
            label={'Relation'}
            placeholder={'Enter relation'}
            onChangeText={(value) =>
              this.onFloatitemChange(value, item, 3, index)
            }
            value={item.relation}
            theme={theme}
            returnKeyType={'done'}
          />
          <View
            style={{
              marginStart: 8,
              borderBottomColor: Colors.grey300,
              borderRadius: 2,
              borderBottomWidth: 0.6,
              alignContents: 'center',
            }}>
            <Subtitle style={styles.bbstyle}>{`Select Gender`}</Subtitle>

            <RadioButton.Group
              onValueChange={(value) =>
                this.onFloatitemChange(value, item, 1, index)
              }
              value={item.gender}>
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
          <View
            style={{
              marginHorizontal: sizeWidth(3),
            }}>
            <TouchableWithoutFeedback
              onPress={() => this.enableCalendar(item, index)}>
              <View style={styles.dropdownbox}>
                <Subtitle
                  style={[
                    styles.boxsubtitle,
                    {
                      color: item.dob === `` ? `#767676` : `#292929`,
                    },
                  ]}>
                  {item.dob === '' ? `Date of Birth` : item.dob}
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
        </View>
      </ScrollView>
    );
  }

  render() {
    const {
      title,
      heading = `Corporate Information`,
      showHeader = true,
    } = this.props;
    return (
      <View>
        {showHeader ? (
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
          </View>
        ) : null}

        {title !== 'Vector Plus' &&
        title !== 'Mutual Fund' &&
        title !== 'Demat' &&
        title !== 'Fixed Deposit' &&
        title !== 'Motor Insurance' &&
        title !== 'Term Insurance' &&
        title !== 'Health Insurance' &&
        title !== 'Life Cum Invt. Plan' ? (
          <View>
            <TextInput
              mode="flat"
              underlineColor="transparent"
              underlineColorAndroid="transparent"
              style={[
                styles.inputStyle,
                //{ marginVertical: sizeHeight(1) },
              ]}
              label={'Company Name'}
              placeholder={'Enter company name'}
              onChangeText={(value) => this.setState({company: value})}
              value={this.state.company}
              theme={theme}
              returnKeyType={'next'}
            />
            <TextInput
              mode="flat"
              underlineColor="transparent"
              underlineColorAndroid="transparent"
              style={[
                styles.inputStyle,
                //{ marginVertical: sizeHeight(1) },
              ]}
              label={
                title === `Home Loan` ||
                title === `Loan Against Property` ||
                title === `Personal Loan` ||
                title === `Business Loan` ||
                title === `Auto Loan`
                  ? 'Annual Turnover/CTC *'
                  : 'Annual Turnover/CTC'
              }
              keyboardType={'number-pad'}
              placeholder={'Enter annual turnover/ctc'}
              onChangeText={(value) => {
                if (value.match(/^[0-9]*$/g) !== null) {
                  this.setState({turnover: value});
                }
              }}
              value={this.state.turnover}
              theme={theme}
              returnKeyType={'next'}
            />
          </View>
        ) : null}

        {title === 'Term Insurance' || title === `Health Insurance` ? (
          <TextInput
            mode="flat"
            underlineColor="transparent"
            underlineColorAndroid="transparent"
            style={[
              styles.inputStyle,
              //{ marginVertical: sizeHeight(1) },
            ]}
            label={'Annual Turnover/CTC *'}
            keyboardType={'number-pad'}
            placeholder={'Enter annual turnover/ctc'}
            onChangeText={(value) => {
              if (value.match(/^[0-9]*$/g) !== null) {
                this.setState({turnover: value});
              }
            }}
            value={this.state.turnover}
            theme={theme}
            returnKeyType={'next'}
          />
        ) : null}

        {title !== 'Vector Plus' &&
        title !== 'Credit Card' &&
        title !== 'Demat' &&
        title !== 'Motor Insurance' &&
        title != 'Health Insurance' &&
        title !== 'Life Cum Invt. Plan' ? (
          <TextInput
            mode="flat"
            underlineColor="transparent"
            underlineColorAndroid="transparent"
            style={[
              styles.inputStyle,
              //{ marginVertical: sizeHeight(1) },
            ]}
            label={
              title === 'Term Insurance'
                ? 'Required Cover *'
                : title === 'Home Loan' ||
                  title === 'Loan Against Property' ||
                  title === `Personal Loan` ||
                  title === `Business Loan` ||
                  title === `Business Loan`
                ? 'Desired Amount *'
                : 'Investment Amount *'
            }
            placeholder={
              title === 'Term Insurance'
                ? 'Enter required cover'
                : 'Enter amount'
            }
            onChangeText={(value) => {
              if (value.match(/^[0-9]*$/g) !== null) {
                this.setState({amount: value});
              }
            }}
            keyboardType={'number-pad'}
            value={this.state.amount}
            theme={theme}
            returnKeyType={'next'}
          />
        ) : null}

        {title === 'Health Insurance' ? (
          <TextInput
            mode="flat"
            underlineColor="transparent"
            underlineColorAndroid="transparent"
            style={[
              styles.inputStyle,
              //{ marginVertical: sizeHeight(1) },
            ]}
            label={'Required Cover *'}
            placeholder={'Enter required cover'}
            onChangeText={(value) => {
              if (value.match(/^[0-9]*$/g) !== null) {
                this.setState({required_cover: value});
              }
            }}
            keyboardType={'number-pad'}
            value={this.state.required_cover}
            theme={theme}
            returnKeyType={'next'}
          />
        ) : null}

        {title === 'Life Cum Invt. Plan' ? (
          <View>
            <TextInput
              mode="flat"
              underlineColor="transparent"
              underlineColorAndroid="transparent"
              style={[
                styles.inputStyle,
                //{ marginVertical: sizeHeight(1) },
              ]}
              label={'Profession'}
              placeholder={'Enter profession'}
              onChangeText={(value) => this.setState({profession: value})}
              value={this.state.profession}
              theme={theme}
              returnKeyType={'next'}
            />

            <TextInput
              mode="flat"
              underlineColor="transparent"
              underlineColorAndroid="transparent"
              style={[
                styles.inputStyle,
                //{ marginVertical: sizeHeight(1) },
              ]}
              label={'Investment Amount *'}
              placeholder={'Enter investment amount'}
              onChangeText={(value) => {
                if (value.match(/^[0-9]*$/g) !== null) {
                  this.setState({investment_amount: value});
                }
              }}
              keyboardType={'number-pad'}
              value={this.state.investment_amount}
              theme={theme}
              returnKeyType={'next'}
            />
          </View>
        ) : null}

        {/* {title === 'Motor Insurance' ? <View>
                    <TextInput
                        mode="flat"
                        underlineColor="transparent"
                        underlineColorAndroid="transparent"
                        style={[
                            styles.inputStyle,
                            //{ marginVertical: sizeHeight(1) },
                        ]}
                        label={"Car Brand"}
                        placeholder={"Enter car brand"}
                        
                        onChangeText={(value) =>
                            this.setState({ car_brand: value })
                        }
                        value={this.state.car_brand}
                        theme={theme}
                        returnKeyType={"next"}
                    />

                    <TextInput
                        mode="flat"
                        underlineColor="transparent"
                        underlineColorAndroid="transparent"
                        style={[
                            styles.inputStyle,
                            //{ marginVertical: sizeHeight(1) },
                        ]}
                        label={"Car Model Year"}
                        placeholder={"Enter car year"}
                        
                        onChangeText={(value) =>
                            this.setState({ car_model: value })
                        }
                        value={this.state.car_model}
                        theme={theme}
                        returnKeyType={"next"}
                    />

                    <TextInput
                        mode="flat"
                        underlineColor="transparent"
                        underlineColorAndroid="transparent"
                        style={[
                            styles.inputStyle,
                            //{ marginVertical: sizeHeight(1) },
                        ]}
                        label={"Car Value"}
                        placeholder={"Enter car value"}
                        
                        onChangeText={(value) =>
                            this.setState({ car_value: value })
                        }
                        value={this.state.car_value}
                        theme={theme}
                        returnKeyType={"next"}
                    />

                    <TextInput
                        mode="flat"
                        underlineColor="transparent"
                        underlineColorAndroid="transparent"
                        style={[
                            styles.inputStyle,
                            //{ marginVertical: sizeHeight(1) },
                        ]}
                        label={"Registration Number"}
                        placeholder={"Enter registration number"}
                        
                        onChangeText={(value) =>
                            this.setState({ reg_no: value })
                        }
                        value={this.state.reg_no}
                        theme={theme}
                        returnKeyType={"next"}
                    />


                </View> : null} */}

        <TextInput
          mode="flat"
          underlineColor="transparent"
          underlineColorAndroid="transparent"
          style={[
            styles.inputStyle,
            //{ marginVertical: sizeHeight(1) },
          ]}
          label={'PAN Card Number'}
          placeholder={'Enter pan card number'}
          onChangeText={(value) => this.setState({pancardNo: value})}
          value={this.state.pancardNo}
          theme={theme}
          maxLength={10}
          returnKeyType={'next'}
        />
        <TextInput
          mode="flat"
          underlineColor="transparent"
          underlineColorAndroid="transparent"
          style={[
            styles.inputStyle,
            //{ marginVertical: sizeHeight(1) },
          ]}
          label={'Aadhar Card Number'}
          placeholder={'Enter aadhar card number'}
          maxLength={12}
          keyboardType={'number-pad'}
          onChangeText={(value) => {
            if (value.match(/^[0-9]*$/g) !== null) {
              this.setState({aadharcardNo: value});
            }
          }}
          value={this.state.aadharcardNo}
          theme={theme}
          returnKeyType={'next'}
        />

        {title === 'Motor Insurance' ? (
          <View>
            <View
              style={{
                marginTop: 8,
                marginStart: 8,
                borderBottomColor: Colors.grey300,
                borderRadius: 2,
                borderBottomWidth: 0.6,
                alignContents: 'center',
              }}>
              <Subtitle style={styles.bbstyle}>
                {`Any Claim Last Year *`}
              </Subtitle>

              <RadioButton.Group
                onValueChange={(value) => this.setState({insurance: value})}
                value={this.state.insurance}>
                <View styleName="horizontal" style={{marginBottom: 8}}>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton
                      value="Comprehensive"
                      style={{alignSelf: 'center'}}
                    />
                    <Subtitle styleName="v-center h-center">{`Comprehensive`}</Subtitle>
                  </View>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton
                      value="Third Party"
                      style={{alignSelf: 'center'}}
                    />
                    <Subtitle styleName="v-center h-center">{`Third Party`}</Subtitle>
                  </View>
                </View>
              </RadioButton.Group>
            </View>

            <View
              style={{
                marginTop: 8,
                marginStart: 8,
                borderBottomColor: Colors.grey300,
                borderRadius: 2,
                borderBottomWidth: 0.6,
                alignContents: 'center',
              }}>
              <Subtitle style={styles.bbstyle}>
                {`Types of Insurance *`}
              </Subtitle>

              <RadioButton.Group
                onValueChange={(value) => this.setState({claim_type: value})}
                value={this.state.claim_type}>
                <View styleName="horizontal" style={{marginBottom: 8}}>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value="YES" style={{alignSelf: 'center'}} />
                    <Subtitle styleName="v-center h-center">{`Yes`}</Subtitle>
                  </View>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value="NO" style={{alignSelf: 'center'}} />
                    <Subtitle styleName="v-center h-center">{`No`}</Subtitle>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
            {/* <View
                            style={{
                                
                                marginHorizontal: sizeWidth(3),
                            }}
                        >
                            <TouchableWithoutFeedback
                                onPress={() =>
                                    this.setState({
                                        showmotorInsList: !this.state.showmotorInsList,
                                        showCarList: false,
                                        showCompanyCityList: false,
                                        showLoanCityList: false,
                                        showExisitingList: false,
                                    })
                                }
                            >
                                <View
                                    style={styles.dropdownbox}
                                >
                                    <Subtitle
                                        style={styles.boxsubtitle}
                                    >

                                        {this.state.insurance === ""
                                            ? `Select Insurance Type`
                                            : this.state.insurance}
                                    </Subtitle>
                                    <Icon
                                        name={"chevron-down"}
                                        size={24}
                                        color={"#767676"}
                                        style={styles.downIcon}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                            {this.state.showmotorInsList ? <DropDown itemCallback={value => this.setState({ showmotorInsList: false, insurance: value })} list={this.state.motorInsList} /> : null}
                        </View> */}
          </View>
        ) : null}

        {title === 'Life Cum Invt. Plan' ||
        title === 'Term Insurance' ||
        title === 'Health Insurance' ? (
          <View>
            <View
              style={{
                marginStart: 8,
                borderBottomColor: Colors.grey300,
                borderRadius: 2,
                borderBottomWidth: 0.6,
                alignContents: 'center',
              }}>
              <Subtitle style={styles.bbstyle}>{`Marital Status`}</Subtitle>

              <RadioButton.Group
                onValueChange={(value) =>
                  this.setState({marital_status: value})
                }
                value={this.state.marital_status}>
                <View styleName="horizontal" style={{marginBottom: 8}}>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value="Single" style={{alignSelf: 'center'}} />
                    <Subtitle styleName="v-center h-center">{`Single`}</Subtitle>
                  </View>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton
                      value="Married"
                      style={{alignSelf: 'center'}}
                    />
                    <Subtitle styleName="v-center h-center">{`Married`}</Subtitle>
                  </View>
                </View>
              </RadioButton.Group>
            </View>

            {/* <View
                            style={{
                                
                                marginHorizontal: sizeWidth(3),
                            }}
                        >
                            <TouchableWithoutFeedback
                                onPress={() =>
                                    this.setState({
                                        showmaritalList: !this.state.showmaritalList,
                                        showCarList: false,
                                        showCompanyCityList: false,
                                        showLoanCityList: false,
                                        showExisitingList: false,
                                        showmotorInsList: false,
                                    })
                                }
                            >
                                <View
                                    style={styles.dropdownbox}
                                >
                                    <Subtitle
                                        style={styles.boxsubtitle}
                                    >

                                        {this.state.marital_status === ""
                                            ? `Select Marital Status`
                                            : this.state.marital_status}
                                    </Subtitle>
                                    <Icon
                                        name={"chevron-down"}
                                        size={24}
                                        color={"#767676"}
                                        style={styles.downIcon}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                            {this.state.showmaritalList ? <DropDown itemCallback={value => this.setState({ showmaritalList: false, marital_status: value })} list={this.state.maritalList} /> : null}
                        </View>
                     */}
          </View>
        ) : null}

        {title === 'Term Insurance' || title === `Health Insurance` ? (
          <View>
            <View
              style={{
                marginStart: 8,
                borderBottomColor: Colors.grey300,
                borderRadius: 2,
                borderBottomWidth: 0.6,
                alignContents: 'center',
              }}>
              <Subtitle style={styles.bbstyle}>
                {`Type Of Lifestyle *`}
              </Subtitle>

              <RadioButton.Group
                onValueChange={(value) => this.setState({lifestyle: value})}
                value={this.state.lifestyle}>
                <View styleName="horizontal" style={{marginBottom: 8}}>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value="Smoker" style={{alignSelf: 'center'}} />
                    <Subtitle styleName="v-center h-center">{`Smoker`}</Subtitle>
                  </View>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton
                      value="Non Smoker"
                      style={{alignSelf: 'center'}}
                    />
                    <Subtitle styleName="v-center h-center">{`Non Smoker`}</Subtitle>
                  </View>
                </View>
              </RadioButton.Group>
            </View>

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
                {`Type Of Lifestyle *`}
              </Subtitle>

              <RadioButton.Group
                onValueChange={(value) => this.setState({lifestyle2: value})}
                value={this.state.lifestyle2}>
                <View styleName="horizontal" style={{marginBottom: 8}}>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton
                      value="Alcoholic"
                      style={{alignSelf: 'center'}}
                    />
                    <Subtitle styleName="v-center h-center">{`Alcoholic`}</Subtitle>
                  </View>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton
                      value="Non Alcoholic"
                      style={{alignSelf: 'center'}}
                    />
                    <Subtitle styleName="v-center h-center">{`Non Alcoholic`}</Subtitle>
                  </View>
                </View>
              </RadioButton.Group>
            </View>

            <View
              style={{
                marginStart: 8,
                marginVertical: sizeHeight(0.5),
                alignContents: 'center',
                borderBottomColor: Colors.grey300,
                borderRadius: 2,
                borderBottomWidth: 0.6,
              }}>
              <Subtitle style={styles.bbstyle}>
                {`Any Pre Existing Diseases *`}
              </Subtitle>

              <RadioButton.Group
                onValueChange={(value) =>
                  this.setState({existing_diseases: value})
                }
                value={this.state.existing_diseases}>
                <View styleName="horizontal" style={{marginBottom: 8}}>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value="YES" style={{alignSelf: 'center'}} />
                    <Subtitle styleName="v-center h-center">{`Yes`}</Subtitle>
                  </View>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value="NO" style={{alignSelf: 'center'}} />
                    <Subtitle styleName="v-center h-center">{`No`}</Subtitle>
                  </View>
                </View>
              </RadioButton.Group>
            </View>

            <View
              style={{
                marginStart: 8,
                marginVertical: sizeHeight(0.5),
                alignContents: 'center',
                borderBottomColor: Colors.grey300,
                borderRadius: 2,
                borderBottomWidth: 0.6,
              }}>
              <Subtitle style={styles.bbstyle}>
                {`Preferred Payment Mode`}
              </Subtitle>

              <RadioButton.Group
                onValueChange={(value) => this.setState({payment_mode: value})}
                value={this.state.payment_mode}>
                <View styleName="horizontal" style={{marginBottom: 8}}>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton
                      value="Monthly"
                      style={{alignSelf: 'center'}}
                    />
                    <Subtitle styleName="v-center h-center">{`Monthly`}</Subtitle>
                  </View>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton
                      value="Quartley"
                      style={{alignSelf: 'center'}}
                    />
                    <Subtitle styleName="v-center h-center">{`Quartley`}</Subtitle>
                  </View>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value="Yearly" style={{alignSelf: 'center'}} />
                    <Subtitle styleName="v-center h-center">{`Yearly`}</Subtitle>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
          </View>
        ) : null}
        {title === 'Health Insurance' || title === 'Vector Plus' ? (
          <View>
            <View
              style={{
                marginStart: 8,
                marginVertical: sizeHeight(0.5),
                alignContents: 'center',
                borderBottomColor: Colors.grey300,
                borderRadius: 2,
                borderBottomWidth: 0.6,
              }}>
              <Subtitle style={styles.bbstyle}>
                {`Type of Insurance *`}
              </Subtitle>

              <RadioButton.Group
                onValueChange={(value) => this.setState({claim_type: value})}
                value={this.state.claim_type}>
                <View styleName="horizontal" style={{marginBottom: 8}}>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton
                      value={title === 'Vector Plus' ? 'Individual' : 'Single'}
                      style={{alignSelf: 'center'}}
                    />
                    <Subtitle styleName="v-center h-center">
                      {title === 'Vector Plus' ? 'Individual' : 'Single'}
                    </Subtitle>
                  </View>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton
                      value="Family Floater"
                      style={{alignSelf: 'center'}}
                    />
                    <Subtitle styleName="v-center h-center">{`Family Floater`}</Subtitle>
                  </View>
                </View>
              </RadioButton.Group>
            </View>

            {/* <View
                            style={{
                                
                                marginHorizontal: sizeWidth(3),
                            }}
                        >
                            <TouchableWithoutFeedback
                                onPress={() =>
                                    this.setState({
                                        showtermInsList: !this.state.showtermInsList,
                                        showCarList: false,
                                        showCompanyCityList: false,
                                        showLoanCityList: false,
                                        showExisitingList: false,
                                        showmotorInsList: false
                                    })
                                }
                            >
                                <View
                                    style={styles.dropdownbox}
                                >
                                    <Subtitle
                                        style={[styles.boxsubtitle, { color: this.state.claim_type === `Select Insurance Type *`? `#767676` : `#292929`}]}
                                    >

                                        {this.state.claim_type}
                                    </Subtitle>
                                    <Icon
                                        name={"chevron-down"}
                                        size={24}
                                        color={"#767676"}
                                        style={styles.downIcon}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                            {this.state.showtermInsList ? <DropDown itemCallback={value => this.setState({ showtermInsList: false, claim_type: value })} list={this.state.termInsList} /> : null}
                        </View>
                     */}
          </View>
        ) : null}

        {title === 'Vector Plus' ? (
          <View>
            <View
              style={{
                marginStart: 8,
                marginVertical: sizeHeight(0.5),
                alignContents: 'center',
                borderBottomColor: Colors.grey300,
                borderRadius: 2,
                borderBottomWidth: 0.6,
              }}>
              <Subtitle style={styles.bbstyle}>{`Required Cover *`}</Subtitle>

              <RadioButton.Group
                onValueChange={(value) =>
                  this.setState({required_cover: value})
                }
                value={this.state.required_cover}>
                <View styleName="horizontal" style={{marginBottom: 8}}>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value="50K" style={{alignSelf: 'center'}} />
                    <Subtitle styleName="v-center h-center">{`50K`}</Subtitle>
                  </View>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value="1 Lac" style={{alignSelf: 'center'}} />
                    <Subtitle styleName="v-center h-center">{`1 Lac`}</Subtitle>
                  </View>
                </View>
              </RadioButton.Group>
            </View>

            {/* <View
              style={{
                marginHorizontal: sizeWidth(3),
              }}>
              <TouchableWithoutFeedback
                onPress={() =>
                  this.setState({
                    showvectorCoverList: !this.state.showvectorCoverList,
                    showvectorInsuList: false,
                    showtermInsList: false,
                    showCarList: false,
                    showCompanyCityList: false,
                    showLoanCityList: false,
                    showExisitingList: false,
                    showmotorInsList: false,
                    showHealthFlist: false,
                  })
                }>
                <View style={styles.dropdownbox}>
                  <Subtitle style={styles.boxsubtitle}>
                    {this.state.vectorCover}
                  </Subtitle>
                  <Icon
                    name={'chevron-down'}
                    size={24}
                    color={'#767676'}
                    style={styles.downIcon}
                  />
                </View>
              </TouchableWithoutFeedback>
              {this.state.showvectorCoverList ? (
                <DropDown
                  itemCallback={(value) =>
                    this.setState({
                      showvectorCoverList: false,
                      vectorCover: value,
                    })
                  }
                  list={this.state.vectorCoverList}
                />
              ) : null}
            </View>
           */}
          </View>
        ) : null}

        {/* {title === 'Vector Plus' ? (
          <View>
            <View
              style={{
                marginHorizontal: sizeWidth(3),
              }}>
              <TouchableWithoutFeedback
                onPress={() =>
                  this.setState({
                    showvectorInsuList: !this.state.showvectorInsuList,
                    showtermInsList: false,
                    showCarList: false,
                    showCompanyCityList: false,
                    showLoanCityList: false,
                    showExisitingList: false,
                    showmotorInsList: false,
                    showHealthFlist: false,
                    showvectorCoverList: false,
                  })
                }>
                <View style={styles.dropdownbox}>
                  <Subtitle style={styles.boxsubtitle}>
                    {this.state.vectorTypeIns}
                  </Subtitle>
                  <Icon
                    name={'chevron-down'}
                    size={24}
                    color={'#767676'}
                    style={styles.downIcon}
                  />
                </View>
              </TouchableWithoutFeedback>
              {this.state.showvectorInsuList ? (
                <DropDown
                  itemCallback={(value) =>
                    this.setState({
                      showvectorInsuList: false,
                      vectorTypeIns: value,
                    })
                  }
                  list={this.state.vectorInsuList}
                />
              ) : null}
            </View>
          </View>
        ) : null} */}

        {title === 'Vector Plus' ||
        (title === 'Health Insurance' &&
          this.state.claim_type === 'Family Floater') ? (
          <View>
            <View
              style={{
                marginStart: 8,
                marginVertical: sizeHeight(0.5),
                alignContents: 'center',
                borderBottomColor: Colors.grey300,
                borderRadius: 2,
                borderBottomWidth: 0.6,
              }}>
              <Subtitle style={styles.bbstyle}>{`Family Floater *`}</Subtitle>

              <RadioButton.Group
                onValueChange={(value) => {
                  const clone = JSON.parse(JSON.stringify(floatCloneList));
                  if (value === `2 Adult` || value === `1 Adult 1 Child`) {
                    clone.length = 1;
                  } else if (
                    value === `2 Adult 1 Child` ||
                    value === `1 Adult 2 Children`
                  ) {
                    clone.length = 2;
                  } else if (
                    value === `2 Adult 2 Children` ||
                    value === `1 Adult 3 Children`
                  ) {
                    clone.length = 3;
                  } else if (value === `2 Adult 3 Children`) {
                    clone.length = 4;
                  }
                  this.setState({
                    family_floater: value,
                    floaterItemList: clone,
                  });
                }}
                value={this.state.family_floater}>
                <View styleName="vertical" style={{marginBottom: 8}}>
                  {this.state.healthFList.map((e) => (
                    <View styleName="horizontal">
                      <RadioButton
                        value={`${e.value}`}
                        style={{alignSelf: 'center', justifyContent: 'center'}}
                      />
                      <Subtitle
                        styleName="v-center h-center"
                        style={{
                          alignSelf: 'center',
                          justifyContent: 'center',
                        }}>{`${e.value}`}</Subtitle>
                    </View>
                  ))}
                </View>
              </RadioButton.Group>
            </View>
            {this.state.floaterItemList.length > 0 ? (
              <FlatList
                data={this.state.floaterItemList}
                renderItem={({item: item, index}) =>
                  this.renderFloatRow(item, index)
                }
                nestedScrollEnabled
                extraData={this.state}
                keyExtractor={(item, index) => `${item.id}`}
              />
            ) : null}
            {/* <View
              style={{
                marginHorizontal: sizeWidth(3),
              }}>
              <TouchableWithoutFeedback
                onPress={() =>
                  this.setState({
                    showHealthFlist: !this.state.showHealthFlist,
                    showCarList: false,
                    showCompanyCityList: false,
                    showLoanCityList: false,
                    showExisitingList: false,
                    showmotorInsList: false,
                    showtermInsList: false,
                    showvectorCoverList: false,
                    showvectorInsuList: false,
                  })
                }>
                <View style={styles.dropdownbox}>
                  <Subtitle
                    style={[
                      styles.boxsubtitle,
                      {
                        color:
                          this.state.family_floater === `Select Family Floater`
                            ? `#767676`
                            : `#292929`,
                      },
                    ]}>
                    {this.state.family_floater}
                  </Subtitle>
                  <Icon
                    name={'chevron-down'}
                    size={24}
                    color={'#767676'}
                    style={styles.downIcon}
                  />
                </View>
              </TouchableWithoutFeedback>
              {this.state.showHealthFlist ? (
                <DropDown
                  itemCallback={(value) =>
                    this.setState({
                      showHealthFlist: false,
                      family_floater: value,
                    })
                  }
                  list={this.state.healthFList}
                />
              ) : null}
            </View>
          */}
          </View>
        ) : null}

        {title === 'Auto Loan' ? (
          <View>
            <TextInput
              mode="flat"
              underlineColor="transparent"
              underlineColorAndroid="transparent"
              style={[
                styles.inputStyle,
                //{ marginVertical: sizeHeight(1) },
              ]}
              label={'Car RC Number'}
              placeholder={'Enter car rc number'}
              onChangeText={(value) => this.setState({rcbook: value})}
              value={this.state.rcbook}
              theme={theme}
              returnKeyType={'next'}
            />
            <TextInput
              mode="flat"
              underlineColor="transparent"
              underlineColorAndroid="transparent"
              style={[
                styles.inputStyle,
                //{ marginVertical: sizeHeight(1) },
              ]}
              label={'Car Model Number'}
              placeholder={'Enter car model number'}
              onChangeText={(value) => this.setState({model: value})}
              value={this.state.model}
              theme={theme}
              returnKeyType={'next'}
            />

            <View
              style={{
                marginTop: 8,
                marginStart: 8,
                borderBottomColor: Colors.grey300,
                borderRadius: 2,
                borderBottomWidth: 0.6,
                alignContents: 'center',
              }}>
              <Subtitle style={styles.bbstyle}>{`Type Of Car *`}</Subtitle>

              <RadioButton.Group
                onValueChange={(value) => this.setState({nooldcard: value})}
                value={this.state.nooldcard}>
                <View styleName="horizontal" style={{marginBottom: 8}}>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton
                      value="New Car"
                      style={{alignSelf: 'center'}}
                    />
                    <Subtitle styleName="v-center h-center">{`New Car`}</Subtitle>
                  </View>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton
                      value="Old Car"
                      style={{alignSelf: 'center'}}
                    />
                    <Subtitle styleName="v-center h-center">{`Old Car`}</Subtitle>
                  </View>
                </View>
              </RadioButton.Group>
            </View>

            {/* <View
                            style={{
                                
                                marginHorizontal: sizeWidth(3),
                            }}
                        >
                            <TouchableWithoutFeedback
                                onPress={() =>
                                    this.setState({
                                        showCarList: !this.state.showCarList,
                                        showCompanyCityList: false,
                                        showLoanCityList: false,
                                        showExisitingList: false
                                    })
                                }
                            >
                                <View
                                    style={styles.dropdownbox}
                                >
                                    <Subtitle
                                        style={styles.boxsubtitle}
                                    >

                                        {this.state.nooldcard === ""
                                            ? `Select Car Type`
                                            : this.state.nooldcard}
                                    </Subtitle>
                                    <Icon
                                        name={"chevron-down"}
                                        size={24}
                                        color={"#767676"}
                                        style={styles.downIcon}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                            {this.state.showCarList ? <DropDown itemCallback={value => this.setState({ showCarList: false, nooldcard: value })} list={this.state.carList} /> : null}
                        </View>
                     */}
          </View>
        ) : null}

        {title === `Home Loan` ||
        title === `Loan Against Property` ||
        title === `Personal Loan` ||
        title === `Business Loan` ? (
          <View
            style={{
              marginTop: 8,
              marginStart: 8,
              borderBottomColor: Colors.grey300,
              borderRadius: 2,
              borderBottomWidth: 0.6,
              alignContents: 'center',
            }}>
            <Subtitle style={styles.bbstyle}>{`Types Of Loan *`}</Subtitle>

            <RadioButton.Group
              onValueChange={(value) => this.setState({type_loan: value})}
              value={this.state.type_loan}>
              <View styleName="horizontal" style={{marginBottom: 8}}>
                <View
                  styleName="horizontal"
                  style={{alignSelf: 'center', alignItems: 'center'}}>
                  <RadioButton value="Fresh" style={{alignSelf: 'center'}} />
                  <Subtitle styleName="v-center h-center">{`Fresh`}</Subtitle>
                </View>
                <View
                  styleName="horizontal"
                  style={{alignSelf: 'center', alignItems: 'center'}}>
                  <RadioButton value="BT" style={{alignSelf: 'center'}} />
                  <Subtitle styleName="v-center h-center">{`BT`}</Subtitle>
                </View>
                <View
                  styleName="horizontal"
                  style={{alignSelf: 'center', alignItems: 'center'}}>
                  <RadioButton
                    value="BT Top Up"
                    style={{alignSelf: 'center'}}
                  />
                  <Subtitle styleName="v-center h-center">{`BT Top Up`}</Subtitle>
                </View>
              </View>
            </RadioButton.Group>
          </View>
        ) : null}

        {title !== 'Vector Plus' &&
        title !== 'Mutual Fund' &&
        title !== 'Demat' &&
        title !== 'Fixed Deposit' &&
        title !== 'Motor Insurance' &&
        title !== 'Term Insurance' &&
        title !== 'Health Insurance' &&
        title !== 'Life Cum Invt. Plan' ? (
          <View>
            <View
              style={{
                marginTop: 8,
                marginStart: 8,
                borderBottomColor: Colors.grey300,
                borderRadius: 2,
                borderBottomWidth: 0.6,
                alignContents: 'center',
              }}>
              <Subtitle style={styles.bbstyle}>
                {`Existing Card/Loan *`}
              </Subtitle>

              <RadioButton.Group
                onValueChange={(value) => this.setState({existingcard: value})}
                value={this.state.existingcard}>
                <View styleName="horizontal" style={{marginBottom: 8}}>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value="YES" style={{alignSelf: 'center'}} />
                    <Subtitle styleName="v-center h-center">{`Yes`}</Subtitle>
                  </View>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value="NO" style={{alignSelf: 'center'}} />
                    <Subtitle styleName="v-center h-center">{`No`}</Subtitle>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
            {/* <View
                        style={{
                            
                            marginHorizontal: sizeWidth(3),
                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={() =>
                                this.setState({
                                    showExisitingList: !this.state.showExisitingList,
                                    showCompanyCityList: false,
                                    showLoanCityList: false,
                                    showCarList: false
                                })
                            }
                        >
                            <View
                                style={styles.dropdownbox}
                            >
                                <Subtitle
                                    style={styles.boxsubtitle}
                                >

                                    {this.state.existingcard === ""
                                        ? `Select Existing Card/Loan`
                                        : this.state.existingcard}
                                </Subtitle>
                                <Icon
                                    name={"chevron-down"}
                                    size={24}
                                    color={"#767676"}
                                    style={styles.downIcon}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                        {this.state.showExisitingList ? <DropDown itemCallback={value => this.setState({ showExisitingList: false, existingcard: value })} list={this.state.exisitingList} /> : null}
                    </View> */}

            <View
              style={{
                marginHorizontal: sizeWidth(3),
              }}>
              <TouchableWithoutFeedback
                onPress={() =>
                  this.setState({
                    showCompanyCityList: !this.state.showCompanyCityList,
                    showExisitingList: false,
                    showLoanCityList: false,
                    showCarList: false,
                  })
                }>
                <View style={styles.dropdownbox}>
                  <Subtitle style={styles.boxsubtitle}>
                    {this.state.companylocation === ''
                      ? `Select Company Location`
                      : this.state.companylocation}
                  </Subtitle>
                  <Icon
                    name={'chevron-down'}
                    size={24}
                    color={'#767676'}
                    style={styles.downIcon}
                  />
                </View>
              </TouchableWithoutFeedback>
              {this.state.showCompanyCityList ? (
                <DropDown
                  itemCallback={(value) =>
                    this.setState({
                      showCompanyCityList: false,
                      companylocation: value,
                    })
                  }
                  list={this.state.cityList}
                  isCityList
                  enableSearch
                />
              ) : null}
            </View>
          </View>
        ) : null}

        {title !== 'Vector Plus' &&
        title !== 'Credit Card' &&
        title !== 'Personal Loan' &&
        title !== 'Business Loan' &&
        title !== 'Mutual Fund' &&
        title !== 'Demat' &&
        title !== 'Fixed Deposit' &&
        title !== 'Motor Insurance' &&
        title !== 'Term Insurance' &&
        title !== 'Health Insurance' &&
        title !== 'Life Cum Invt. Plan' &&
        title !== 'Auto Loan' ? (
          <View
            style={{
              marginHorizontal: sizeWidth(3),
            }}>
            <TouchableWithoutFeedback
              onPress={() =>
                this.setState({
                  showLoanCityList: !this.state.showLoanCityList,
                  showExisitingList: false,
                  showCompanyCityList: false,
                  showCarList: false,
                })
              }>
              <View style={styles.dropdownbox}>
                <Subtitle style={styles.boxsubtitle}>
                  {this.state.loan_property_city}
                </Subtitle>
                <Icon
                  name={'chevron-down'}
                  size={24}
                  color={'#767676'}
                  style={styles.downIcon}
                />
              </View>
            </TouchableWithoutFeedback>
            {this.state.showLoanCityList ? (
              <DropDown
                itemCallback={(value) =>
                  this.setState({
                    showLoanCityList: false,
                    loan_property_city: value,
                  })
                }
                list={this.state.cityList}
                isCityList
                enableSearch
              />
            ) : null}
          </View>
        ) : null}

        {this.state.showCalendar ? (
          <DateTimePicker
            testID="dateTimePicker"
            value={this.state.currentDate}
            mode={'date'}
            is24Hour={false}
            display={'spinner'}
            onChange={this.onChange}
            maximumDate={this.state.maxDate}
          />
        ) : null}

        {this.state.showItemCalendar ? (
          <DateTimePicker
            value={this.state.currentDate}
            mode={'date'}
            is24Hour={false}
            display={'spinner'}
            onChange={this.onFloatDatePicker}
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
    color: '#767676',
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
    height: sizeHeight(7.5),
    backgroundColor: 'white',
    color: '#767676',
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
  bbstyle: {
    fontSize: 16,
    fontFamily: 'Rubik',
    fontWeight: '400',
    color: '#767676',
    lineHeight: 25,
    padding: 4,
    marginHorizontal: 8,
  },
  downIcon: {
    padding: 4,
    alignSelf: 'center',
    marginHorizontal: 1,
  },
});
