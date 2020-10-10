import React from 'react';
import {
  StatusBar,
  StyleSheet,
  ScrollView,
  BackHandler,
  Platform,
  TouchableWithoutFeedback,
  FlatList,
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
import AnimatedInputBox from '../component/AnimatedInputBox';

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
      policy_term:'',
      pay_type:'',
      addons:'',
      diseases:''
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
          {/* <View
            style={{
              marginTop: sizeHeight(2),
              marginBottom: sizeHeight(1),
            }}
            styleName="horizontal">
            <View styleName="vertical" style={{marginStart: sizeWidth(2)}}>
              <Title style={styles.title}> {`Member Details *`}</Title>
            </View>
          </View>
          <View style={styles.line} /> */}
          <AnimatedInputBox
            placeholder={'Full Name'}
            onChangeText={(value) =>
              this.onFloatitemChange(value, item, 0, index)
            }
            value={item.name}
            changecolor
            containerstyle={styles.animatedInputCont}
            returnKeyType={'next'}
          />
          <AnimatedInputBox
            placeholder={'Relation'}
            onChangeText={(value) =>
              this.onFloatitemChange(value, item, 3, index)
            }
            value={item.relation}
            changecolor
            containerstyle={styles.animatedInputCont}
            returnKeyType={'done'}
          />
          <View style={styles.radiocont}>
            <View style={styles.radiodownbox}>
              <Title style={styles.bbstyle}>{`Select Gender`}</Title>

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
                    <Title
                      styleName="v-center h-center"
                      style={styles.textopen}>{`Male`}</Title>
                  </View>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value="Female" style={{alignSelf: 'center'}} />
                    <Title
                      styleName="v-center h-center"
                      style={styles.textopen}>{`Female`}</Title>
                  </View>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value="Other" style={{alignSelf: 'center'}} />
                    <Title
                      styleName="v-center h-center"
                      style={styles.textopen}>{`Other`}</Title>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
          </View>
          <View style={styles.radiocont}>
            <TouchableWithoutFeedback
              onPress={() => this.enableCalendar(item, index)}>
              <View style={styles.dropdownbox}>
                <Title
                  style={[
                    styles.boxsubtitle,
                    {
                      color: item.dob === `` ? `#6d6a57` : `#292929`,
                    },
                  ]}>
                  {item.dob === '' ? `Date of Birth` : item.dob}
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
        {/* {showHeader ? (
          <View>
            <View
              style={{
                marginTop: sizeHeight(2),
                marginBottom: sizeHeight(1),
              }}
              styleName="horizontal">
              <View styleName="vertical" style={{marginStart: sizeWidth(2)}}>
                <Title style={styles.title}> {heading}</Title>
              </View>
            </View>
            <View style={styles.line} />
          </View>
        ) : null} */}

        {title !== 'Vector Plus' &&
        title !== 'Mutual Fund' &&
        title !== 'Demat' &&
        title !== 'Fixed Deposit' &&
        title !== 'Motor Insurance' &&
        title !== 'Term Insurance' &&
        title !== 'Health Insurance' &&
        title !== 'Life Cum Invt. Plan' ? (
          <View>
            <AnimatedInputBox
              onChangeText={(value) => this.setState({company: value})}
              value={this.state.company}
              placeholder={'Company Name'}
              returnKeyType={'next'}
              changecolor
              containerstyle={styles.animatedInputCont}
            />

            {/* <AnimatedInputBox
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
            /> */}
            <AnimatedInputBox
              keyboardType={'number-pad'}
              onChangeText={(value) => {
                if (String(value).match(/^[0-9]*$/g) !== null) {
                  this.setState({turnover: value});
                }
              }}
              value={this.state.turnover}
              placeholder={
                title === `Home Loan` ||
                title === `Loan Against Property` ||
                title === `Personal Loan` ||
                title === `Business Loan` ||
                title === `Auto Loan`
                  ? 'Annual Turnover/CTC *'
                  : 'Annual Turnover/CTC'
              }
              returnKeyType={'next'}
              changecolor
              containerstyle={styles.animatedInputCont}
            />
            {/* <AnimatedInputBox
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
              placeholder={'Enter annual turnover/ctc'}
              keyboardType={'number-pad'}
              onChangeText={(value) => {
                if (value.match(/^[0-9]*$/g) !== null) {
                  this.setState({turnover: value});
                }
              }}
              value={this.state.turnover}
              theme={theme}
              returnKeyType={'next'}
            /> */}
          </View>
        ) : null}

        {title === 'Term Insurance' || title === `Health Insurance` ? (
          <AnimatedInputBox
            keyboardType={'number-pad'}
            onChangeText={(value) => {
              if (String(value).match(/^[0-9]*$/g) !== null) {
                this.setState({turnover: value});
              }
            }}
            value={this.state.turnover}
            placeholder={'Annual Turnover/CTC *'}
            returnKeyType={'next'}
            changecolor
            containerstyle={styles.animatedInputCont}
          />
        ) : // <AnimatedInputBox
        //   mode="flat"
        //   underlineColor="transparent"
        //   underlineColorAndroid="transparent"
        //   style={[
        //     styles.inputStyle,
        //     //{ marginVertical: sizeHeight(1) },
        //   ]}
        //   label={'Annual Turnover/CTC *'}
        //   keyboardType={'number-pad'}
        //   placeholder={'Enter annual turnover/ctc'}
        //   onChangeText={(value) => {
        //     if (value.match(/^[0-9]*$/g) !== null) {
        //       this.setState({turnover: value});
        //     }
        //   }}
        //   value={this.state.turnover}
        //   theme={theme}
        //   returnKeyType={'next'}
        // />
        null}

        {title !== 'Vector Plus' &&
        title !== 'Credit Card' &&
        title !== 'Demat' &&
        title !== 'Motor Insurance' &&
        title != 'Health Insurance' &&
        title !== 'Life Cum Invt. Plan' ? (
          <AnimatedInputBox
            keyboardType={'number-pad'}
            onChangeText={(value) => {
              if (String(value).match(/^[0-9]*$/g) !== null) {
                this.setState({amount: value});
              }
            }}
            value={this.state.amount}
            placeholder={
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
            returnKeyType={'next'}
            changecolor
            containerstyle={styles.animatedInputCont}
          />
        ) : // <AnimatedInputBox
        //   mode="flat"
        //   underlineColor="transparent"
        //   underlineColorAndroid="transparent"
        //   style={[
        //     styles.inputStyle,
        //     //{ marginVertical: sizeHeight(1) },
        //   ]}
        //   label={
        //     title === 'Term Insurance'
        //       ? 'Required Cover *'
        //       : title === 'Home Loan' ||
        //         title === 'Loan Against Property' ||
        //         title === `Personal Loan` ||
        //         title === `Business Loan` ||
        //         title === `Business Loan`
        //       ? 'Desired Amount *'
        //       : 'Investment Amount *'
        //   }
        //   placeholder={
        //     title === 'Term Insurance'
        //       ? 'Enter required cover'
        //       : 'Enter amount'
        //   }
        //   onChangeText={(value) => {
        //     if (value.match(/^[0-9]*$/g) !== null) {
        //       this.setState({amount: value});
        //     }
        //   }}
        //   keyboardType={'number-pad'}
        //   value={this.state.amount}
        //   theme={theme}
        //   returnKeyType={'next'}
        // />
        null}

        {title === 'Health Insurance' ? (
          <AnimatedInputBox
            placeholder={'Required Cover *'}
            onChangeText={(value) => {
              if (String(value).match(/^[0-9]*$/g) !== null) {
                this.setState({required_cover: value});
              }
            }}
            keyboardType={'number-pad'}
            value={this.state.required_cover}
            returnKeyType={'next'}
            changecolor
            containerstyle={styles.animatedInputCont}
          />
        ) : null}

        {title === 'Life Cum Invt. Plan' ? (
          <View>
            <AnimatedInputBox
              placeholder={'Profession'}
              onChangeText={(value) => this.setState({profession: value})}
              value={this.state.profession}
              changecolor
              containerstyle={styles.animatedInputCont}
              returnKeyType={'next'}
            />

            <AnimatedInputBox
              placeholder={'Investment Amount *'}
              onChangeText={(value) => {
                if (String(value).match(/^[0-9]*$/g) !== null) {
                  this.setState({investment_amount: value});
                }
              }}
              keyboardType={'number-pad'}
              value={this.state.investment_amount}
              changecolor
              containerstyle={styles.animatedInputCont}
              returnKeyType={'next'}
            />
          </View>
        ) : null}

        {/* {title === 'Motor Insurance' ? <View>
                    <AnimatedInputBox
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

                    <AnimatedInputBox
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

                    <AnimatedInputBox
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

                    <AnimatedInputBox
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

        <AnimatedInputBox
          placeholder={'PAN Card Number'}
          onChangeText={(value) => this.setState({pancardNo: value})}
          value={this.state.pancardNo}
          changecolor
          containerstyle={styles.animatedInputCont}
          maxLength={10}
          returnKeyType={'next'}
        />
        <AnimatedInputBox
          placeholder={'Aadhar Card Number'}
          maxLength={12}
          keyboardType={'number-pad'}
          onChangeText={(value) => {
            if (String(value).match(/^[0-9]*$/g) !== null) {
              this.setState({aadharcardNo: value});
            }
          }}
          value={this.state.aadharcardNo}
          changecolor
          containerstyle={styles.animatedInputCont}
          returnKeyType={'next'}
        />

        {title === 'Motor Insurance' ? (
          <View>
            <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                <Title style={styles.bbstyle}>{`Any Claim Last Year *`}</Title>

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
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Comprehensive`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="Third Party"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Third Party`}</Title>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </View>

            <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                <Title style={styles.bbstyle}>{`Types of Insurance *`}</Title>

                <RadioButton.Group
                  onValueChange={(value) => this.setState({claim_type: value})}
                  value={this.state.claim_type}>
                  <View styleName="horizontal" style={{marginBottom: 8}}>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton value="YES" style={{alignSelf: 'center'}} />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Yes`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton value="NO" style={{alignSelf: 'center'}} />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`No`}</Title>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
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
                                    <Title
                                        style={styles.boxsubtitle}
                                    >

                                        {this.state.insurance === ""
                                            ? `Select Insurance Type`
                                            : this.state.insurance}
                                    </Title>
                                    <Icon
                                        name={"chevron-down"}
                                        size={24}
                                        color={"#6d6a57"}
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
            <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                <Title style={styles.bbstyle}>{`Marital Status`}</Title>

                <RadioButton.Group
                  onValueChange={(value) =>
                    this.setState({marital_status: value})
                  }
                  value={this.state.marital_status}>
                  <View styleName="horizontal" style={{marginBottom: 8}}>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="Single"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Single`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="Married"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Married`}</Title>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
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
                                    <Title
                                        style={styles.boxsubtitle}
                                    >

                                        {this.state.marital_status === ""
                                            ? `Select Marital Status`
                                            : this.state.marital_status}
                                    </Title>
                                    <Icon
                                        name={"chevron-down"}
                                        size={24}
                                        color={"#6d6a57"}
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
            <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                <Title style={styles.bbstyle}>{`Type Of Lifestyle *`}</Title>

                <RadioButton.Group
                  onValueChange={(value) => this.setState({lifestyle: value})}
                  value={this.state.lifestyle}>
                  <View styleName="horizontal" style={{marginBottom: 8}}>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="Smoker"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Smoker`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="Non Smoker"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Non Smoker`}</Title>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </View>

            <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                <Title style={styles.bbstyle}>{`Type Of Lifestyle *`}</Title>

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
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Alcoholic`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="Non Alcoholic"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Non Alcoholic`}</Title>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </View>
            <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                <Title style={styles.bbstyle}>
                  {`Any Pre Existing Diseases *`}
                </Title>

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
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Yes`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton value="NO" style={{alignSelf: 'center'}} />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`No`}</Title>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </View>

            <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                <Title style={styles.bbstyle}>{`Preferred Payment Mode`}</Title>

                <RadioButton.Group
                  onValueChange={(value) =>
                    this.setState({payment_mode: value})
                  }
                  value={this.state.payment_mode}>
                  <View styleName="horizontal" style={{marginBottom: 8}}>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="Monthly"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Monthly`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="Quartley"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Quartley`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="Yearly"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Yearly`}</Title>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </View>
          
          </View>
        ) : null}
        {title === 'Term Insurance' ? <View>
            <View style={styles.radiocont}>
              <View style={StyleSheet.flatten([styles.radiodownbox, {
                height:96
              }])}>
                <Title style={styles.bbstyle}>{`Pay Type *`}</Title>

                <RadioButton.Group
                  onValueChange={(value) =>
                    this.setState({pay_type: value})
                  }
                  value={this.state.pay_type}>
                  <View styleName="horizontal" style={{marginBottom: 8, flexGrow:1,flexWrap:'wrap'}}>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="Regular Pay"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Regular Pay`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="5 Pay"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`5 Pay`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="10 Pay"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`10 Pay`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="20 Pay"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`20 Pay`}</Title>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </View>

            <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                <Title style={styles.bbstyle}>{`Policy Term *`}</Title>

                <RadioButton.Group
                  onValueChange={(value) =>
                    this.setState({policy_term: value})
                  }
                  value={this.state.policy_term}>
                  <View styleName="horizontal" style={{marginBottom: 8}}>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="70"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`70`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="80"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`80`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="60 Yearly"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`60 Yearly`}</Title>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </View>
          
            <View style={styles.radiocont}>
              <View style={StyleSheet.flatten([styles.radiodownbox, {
                height:124
              }])}>
                <Title style={styles.bbstyle}>{`Addons *`}</Title>

                <RadioButton.Group
                  onValueChange={(value) =>
                    this.setState({addons: value})
                  }
                  value={this.state.addons}>
                  <View styleName="horizontal" style={{marginBottom: 8, flexGrow:1,flexWrap:'wrap'}}>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="Critical illness"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Critical illness`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="Accidental Death Rider"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Accidental Death Rider`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="Critical illness & Accidental Death Rider"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Critical illness & Accidental Death Rider`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="waiver of premium"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Waiver of premium`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="None"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`None`}</Title>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </View>
          
                    {this.state.existing_diseases === 'YES' ? 
              <AnimatedInputBox
                onChangeText={(value) => {
                    this.setState({diseases: value});
                }}
                value={this.state.diseases}
                placeholder={'Specify Diseases *'}
                changecolor
                containerstyle={styles.animatedInputCont}
              /> : null}

        </View> : null}
        {title === 'Health Insurance' || title === 'Vector Plus' ? (
          <View>
            <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                <Title style={styles.bbstyle}>{`Type of Insurance *`}</Title>

                <RadioButton.Group
                  onValueChange={(value) => this.setState({claim_type: value})}
                  value={this.state.claim_type}>
                  <View styleName="horizontal" style={{marginBottom: 8}}>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value={
                          title === 'Vector Plus' ? 'Individual' : 'Single'
                        }
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>
                        {title === 'Vector Plus' ? 'Individual' : 'Single'}
                      </Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="Family Floater"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Family Floater`}</Title>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
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
                                    <Title
                                        style={[styles.boxsubtitle, { color: this.state.claim_type === `Select Insurance Type *`? `#6d6a57` : `#292929`}]}
                                    >

                                        {this.state.claim_type}
                                    </Title>
                                    <Icon
                                        name={"chevron-down"}
                                        size={24}
                                        color={"#6d6a57"}
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
            <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                <Title style={styles.bbstyle}>{`Required Cover *`}</Title>

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
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`50K`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="1 Lac"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`1 Lac`}</Title>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
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
                  <Title style={styles.boxsubtitle}>
                    {this.state.vectorCover}
                  </Title>
                  <Icon
                    name={'chevron-down'}
                    size={24}
                    color={'#6d6a57'}
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
                  <Title style={styles.boxsubtitle}>
                    {this.state.vectorTypeIns}
                  </Title>
                  <Icon
                    name={'chevron-down'}
                    size={24}
                    color={'#6d6a57'}
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
            <View style={styles.radiocont}>
              <View style={StyleSheet.flatten([styles.radiodownbox,{
                height:264
              }])}>
                <Title style={styles.bbstyle}>{`Family Floater *`}</Title>

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
                          style={{
                            alignSelf: 'center',
                            justifyContent: 'center',
                          }}
                        />
                        <Title
                          styleName="v-center h-center"
                          style={styles.textopen}>{`${e.value}`}</Title>
                      </View>
                    ))}
                  </View>
                </RadioButton.Group>
              </View>
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
                  <Title
                    style={[
                      styles.boxsubtitle,
                      {
                        color:
                          this.state.family_floater === `Select Family Floater`
                            ? `#6d6a57`
                            : `#292929`,
                      },
                    ]}>
                    {this.state.family_floater}
                  </Title>
                  <Icon
                    name={'chevron-down'}
                    size={24}
                    color={'#6d6a57'}
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
            <AnimatedInputBox
              placeholder={'Car RC Number'}
              onChangeText={(value) => this.setState({rcbook: value})}
              value={this.state.rcbook}
              changecolor
              containerstyle={styles.animatedInputCont}
              returnKeyType={'next'}
            />
            <AnimatedInputBox
              placeholder={'Car Model Number'}
              onChangeText={(value) => this.setState({model: value})}
              value={this.state.model}
              changecolor
              containerstyle={styles.animatedInputCont}
              returnKeyType={'next'}
            />

            <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                <Title style={styles.bbstyle}>{`Type Of Car *`}</Title>

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
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`New Car`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="Old Car"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Old Car`}</Title>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
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
                                    <Title
                                        style={styles.boxsubtitle}
                                    >

                                        {this.state.nooldcard === ""
                                            ? `Select Car Type`
                                            : this.state.nooldcard}
                                    </Title>
                                    <Icon
                                        name={"chevron-down"}
                                        size={24}
                                        color={"#6d6a57"}
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
          <View style={styles.radiocont}>
            <View style={styles.radiodownbox}>
              <Title style={styles.bbstyle}>{`Types Of Loan *`}</Title>

              <RadioButton.Group
                onValueChange={(value) => this.setState({type_loan: value})}
                value={this.state.type_loan}>
                <View styleName="horizontal" style={{marginBottom: 8}}>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value="Fresh" style={{alignSelf: 'center'}} />
                    <Title
                      styleName="v-center h-center"
                      style={styles.textopen}>{`Fresh`}</Title>
                  </View>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value="BT" style={{alignSelf: 'center'}} />
                    <Title
                      styleName="v-center h-center"
                      style={styles.textopen}>{`BT`}</Title>
                  </View>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton
                      value="BT Top Up"
                      style={{alignSelf: 'center'}}
                    />
                    <Title
                      styleName="v-center h-center"
                      style={styles.textopen}>{`BT Top Up`}</Title>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
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
            <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                <Title style={styles.bbstyle}>{`Existing Card/Loan *`}</Title>

                <RadioButton.Group
                  onValueChange={(value) =>
                    this.setState({existingcard: value})
                  }
                  value={this.state.existingcard}>
                  <View styleName="horizontal" style={{marginBottom: 8}}>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton value="YES" style={{alignSelf: 'center'}} />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Yes`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton value="NO" style={{alignSelf: 'center'}} />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`No`}</Title>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
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
                                <Title
                                    style={styles.boxsubtitle}
                                >

                                    {this.state.existingcard === ""
                                        ? `Select Existing Card/Loan`
                                        : this.state.existingcard}
                                </Title>
                                <Icon
                                    name={"chevron-down"}
                                    size={24}
                                    color={"#6d6a57"}
                                    style={styles.downIcon}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                        {this.state.showExisitingList ? <DropDown itemCallback={value => this.setState({ showExisitingList: false, existingcard: value })} list={this.state.exisitingList} /> : null}
                    </View> */}

            <View style={styles.radiocont}>
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
                  <Title style={styles.boxsubtitle}>
                    {this.state.companylocation === ''
                      ? `Select Company Location`
                      : this.state.companylocation}
                  </Title>
                  <Icon
                    name={'chevron-down'}
                    size={24}
                    color={'#6d6a57'}
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
          <View style={styles.radiocont}>
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
                <Title style={styles.boxsubtitle}>
                  {this.state.loan_property_city}
                </Title>
                <Icon
                  name={'chevron-down'}
                  size={24}
                  color={'#6d6a57'}
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
    marginStart: 10,
    marginEnd: 10,
    borderBottomWidth: 1.3,
    borderBottomColor: '#f2f1e6',
    alignContent: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Rubik',
    fontFamily: 'bold',
    letterSpacing: 1,
    color: '#6d6a57',
    alignSelf: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6d6a57',
    lineHeight: 20,
    alignSelf: 'center',
    marginStart: 4,
  },
  inputStyle: {
    height: sizeHeight(7.5),
    backgroundColor: 'white',
    color: '#6d6a57',
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
  bbstyle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6d6a57',
    lineHeight: 20,
    marginStart: 4,
  },
  downIcon: {
    alignSelf: 'center',
  },
});
