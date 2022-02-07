import React from 'react';
import {
  StyleSheet,
  ScrollView,
  BackHandler,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import {Title, View} from '@shoutem/ui';
import * as Helper from '../../../util/Helper';
import * as Pref from '../../../util/Pref';
import {Colors, RadioButton} from 'react-native-paper';
import {sizeHeight, sizeWidth} from '../../../util/Size';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import DropDown from '../../common/CommonDropDown';
import Lodash from 'lodash';
import AnimatedInputBox from '../../component/AnimatedInputBox';
import NewDropDown from '../../component/NewDropDown';
import {findGoldPledge} from '../../../util/FormCheckHelper';

let freshTypeofLoan = [{value: 'Builder Purchase'}, {value: 'Resale Property'}];

let itemData = null;
let curpos = -1;
let floatCloneList = [
  {
    id: 1,
    name: '',
    gender: '',
    dob: '',
    relation: '',
    existing_diseases: '',
    diseases: '',
  },
  {
    id: 2,
    name: '',
    gender: '',
    dob: '',
    relation: '',
    existing_diseases: '',
    diseases: '',
  },
  {
    id: 3,
    name: '',
    gender: '',
    dob: '',
    relation: '',
    existing_diseases: '',
    diseases: '',
  },
  {
    id: 4,
    name: '',
    gender: '',
    dob: '',
    relation: '',
    existing_diseases: '',
    diseases: '',
  },
];

let healthCTCList = [
  {
    value: 'Less Than 3 Lakhs',
  },
  {
    value: '3 To 5 Lakhs',
  },
  {
    value: '5 To 10 Lakhs',
  },
  {
    value: 'Above 10 Lakhs',
  },
];

let relationList = [
  {
    value: 'Daughter',
  },
  {
    value: 'Father',
  },
  {
    value: 'Mother',
  },
  {
    value: 'Son',
  },
  {
    value: 'Spouse',
  },
];

let typeofOwnership = [
  {
    value: 'First Party',
  },
  {
    value: 'Second Party',
  },
  {
    value: 'Third Party',
  },
];

let healthRequiredCover = [
  {value: `3`, name: '3Lac'},
  {value: `3.5`, name: '3.5Lac'},
  {value: `4`, name: '4Lac'},
  {value: `4.5`, name: '4.5Lac'},
  {value: `5`, name: '5Lac'},
  {value: `5.5`, name: '5.5Lac'},
  {value: `7`, name: '7Lac'},
  {value: `7.5`, name: '7.5Lac'},
  {value: `10`, name: '10Lac'},
  {value: `15`, name: '15Lac'},
  {value: `20`, name: '20Lac'},
  {value: `25`, name: '25Lac'},
  {value: `30`, name: '30Lac'},
  {value: `35`, name: '35Lac'},
  {value: `40`, name: '40Lac'},
  {value: `45`, name: '45Lac'},
  {value: `50`, name: '50Lac'},
  {value: `75`, name: '75Lac'},
  {value: `100`, name: '100Lac'},
];

let healthFList = [
  {value: '1 Adult', name: '1 Adults'},
  {value: '2 Adult', name: '2 Adult'},
];

let healthFChildList = [{value: '1 Child'}, {value: '2 Children'}];

let termAddons = [
  {
    value: 'Critical Illness',
  },
  {
    value: 'Accidental Death Rider',
  },
  {
    value: 'Critical Illness & Accidental Death Rider',
  },
  {
    value: 'Return Of Premium',
  },
  {
    value: 'Increase Of Sum Insured',
  },
  {
    value: 'None',
  },
];

let motorTypesOfInsurance = [
  {
    value: 'Own Damages',
  },
  {
    value: 'Comprehensive',
  },
  {
    value: 'Comprehensive + Addons',
  },
  {
    value: 'Third Party with PA Cover',
  },
  {
    value: 'Third Party without PA Cover',
  },
];

const currentAddressProofList = [
  {
    value: 'Aadhar',
    checked: 'unchecked',
  },
  {
    value: 'Electricity Bill',
    checked: 'unchecked',
  },
  {
    value: 'Landline Bill',
    checked: 'unchecked',
  },
  {
    value: 'License',
    checked: 'unchecked',
  },
  // {
  //   value: 'Passport+B45',
  //   checked: 'unchecked',
  // },
  {
    value: 'Postpaid Bill',
    checked: 'unchecked',
  },
  {
    value: 'Rent Agreement',
    checked: 'unchecked',
  },
  {
    value: 'Voter ID',
    checked: 'unchecked',
  },
];

const proofOfProprtyList = [
  {
    value: `Electricity Bill`,
    checked: 'unchecked',
  },
  {
    value: `Society Maintenance Bill`,
    checked: 'unchecked',
  },
  {
    value: `Water Bill`,
    checked: 'unchecked',
  },
];

const existingLoanDocumentList = [
  {
    value: `Current Loan Repayment Statement`,
    checked: 'unchecked',
  },
  // {
  //   value: `Credit Card Front Copy`,
  //   checked: 'unchecked',
  // },
  // {
  //   value: `2 Months Card Statement`,
  //   checked: 'unchecked',
  // },
  {
    value: `Sanction Letter`,
    checked: 'unchecked',
  },
  {
    value: `Statement of Accounts`,
    checked: 'unchecked',
  },
];

const policyTypeList = [
  {
    value: `New`,
    name: 'New',
  },
  {
    value: `Top Up`,
    name: 'Top Up',
  },
];

const deductibleList = [
  {
    value: `200000`,
    name: '2',
  },
  {
    value: `300000`,
    name: '3',
  },
  {
    value: `500000`,
    name: '5',
  },
  {
    value: `1000000`,
    name: '10',
  },
];

export default class HealthInsurance extends React.PureComponent {
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
    //date.setFullYear(2000, 0, 1);
    const maxDates = new Date();
    maxDates.setFullYear(2000, 0, 1);
    const filter = Lodash.orderBy(Pref.cityList, ['value'], ['asc']);
    const {title} = this.props;
    this.state = {
      showHealthCompany: false,
      showLifeCompany: false,
      showCarList: false,
      showCompanyCityList: false,
      showExisitingList: false,
      showCalendar: false,
      showLoanCityList: false,
      showmotorInsList: false,
      showtermInsList: false,
      showHealthFlist: false,
      showmaritalList: false,
      showvectorInsuList: false,
      showvectorCoverList: false,
      showItemCalendar: false,
      cityList: filter,
      currentDate: date,
      maxDate: maxDates,
      company: '',
      amount: '',
      companylocation: '',
      aadharcardNo: '',
      pancardNo: '',
      turnover: '',
      nooldcard: '',
      existingcard: '',
      loan_property_city: '',
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
      policy_term: '',
      pay_type: '',
      addons: '',
      diseases: '',
      car_type: '',
      dependent: '',
      type_insurance: '',
      health_sum_assured: '',
      life_sum_assured: '',
      life_company: '',
      health_company: '',
      showInsureCheckList: 0,
      registration_type: '',
      vehicle_type: '',
      motor_type: '',
      expiry_date: '',
      ownership: '',
      lppincode: '',
      homestate: '',
      loan_property_address: '',
      floaterItemList: [],
      eaadharcardNo: '',
      cpincode: '',
      cstate: '',
      ccity: '',
      fresh_pop: '',
      desired_amount: '',
      goldDetailList: [],
      gold_karat: '',
      gold_pledge: '',
      ccfather: '',
      ccmother: '',
      // exisitng_loan_doc: '',
      // current_add_proof: '',
      // proof_of_property: '',
      // proofOfProprtyList1:[],
      // proofOfProprtyList2:[],
      // proof_of_property1:'',
      // proof_of_property2:'',
      policy_type: '',
      deductible: '',
      family_floater_adult: '',
      family_floater_child: '',
      baa: '',
    };
  }

  // multidropdownClosed = data => {
  //   let current_add_proof = '';
  //   if (data.length > 0) {
  //     const mapdata = Lodash.map(data, io => {
  //       if (io.checked === 'checked') {
  //         current_add_proof += `${io.value},`;
  //       }
  //     });
  //   }
  //   this.setState({
  //     current_add_proof: current_add_proof,
  //   });
  // };

  componentDidMount() {
    const {editItemRestore} = this.props;
    this.goldLoan_details();
    if (Helper.nullCheck(editItemRestore) === false) {
      this.restoreData(editItemRestore);
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
      this.setState({
        showCalendar: false,
        currentDate: selectDate,
        expiry_date: fullDate,
      });
    }
  };

  restoreData(obj) {
    if (Helper.nullCheck(obj) === false) {
      let date = new Date();
      let maxDate = new Date();
      if (Helper.nullStringCheck(obj.expiry_date) === false) {
        const split = obj.expiry_date.split('-');
        date.setFullYear(
          Number(split[2]),
          Number(split[1] - 1),
          Number(split[0]),
        );
        obj.currentDate = date;
      } else {
        obj.currentDate = date;
      }
      obj.maxDate = maxDate;
      obj.showHealthCompany = false;
      obj.showLifeCompany = false;
      obj.showCarList = false;
      obj.showCompanyCityList = false;
      obj.showExisitingList = false;
      obj.showCalendar = false;
      obj.showLoanCityList = false;
      obj.showmotorInsList = false;
      obj.showtermInsList = false;
      obj.showHealthFlist = false;
      obj.showmaritalList = false;
      obj.showvectorInsuList = false;
      obj.showvectorCoverList = false;
      obj.showItemCalendar = false;
      this.setState(obj);
    }
  }

  onFloatitemChange(value, item, type, index) {
    if (type === 0) {
      item.name = value;
    } else if (type === 1) {
      item.gender = value;
    } else if (type === 2) {
      item.dob = value;
    } else if (type === 3) {
      item.relation = value;
    } else if (type === 4) {
      //item.existing_diseases = value;
      if (value == 'No') {
        item.diseases = '';
        item.existing_diseases = 'No';
      } else {
        item.existing_diseases = 'Yes';
      }
    } else if (type === 5) {
      item.diseases = value;
    }
    //console.log(`item`, item);
    const {floaterItemList} = this.state;
    floaterItemList[index] = item;
    //console.log('item',item)
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
          <Title style={styles.textstyle12}>{`Member ${index + 1}`}</Title>
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
            showStarVisible={true}
            onChangeText={(value) =>
              this.onFloatitemChange(value, item, 0, index)
            }
            value={item.name}
            changecolor
            containerstyle={styles.animatedInputCont}
            returnKeyType={'next'}
          />
          <NewDropDown
            list={relationList}
            placeholder={'Relation'}
            starVisible={true}
            value={item.relation}
            selectedItem={(value) =>
              this.onFloatitemChange(value, item, 3, index)
            }
            style={{
              borderRadius: 0,
              borderBottomColor: '#f2f1e6',
              borderBottomWidth: 1.3,
              borderWidth: 0,
              marginStart: 10,
              marginEnd: 10,
              paddingVertical: 10,
            }}
            textStyle={{
              color: '#6d6a57',
              fontSize: 14,
              fontFamily: Pref.getFontName(4),
            }}
          />
          {/* <AnimatedInputBox
            placeholder={'Relation'}
            onChangeText={(value) =>
              this.onFloatitemChange(value, item, 3, index)
            }
            value={item.relation}
            changecolor
            containerstyle={styles.animatedInputCont}
            returnKeyType={'done'}
          /> */}
          <View style={styles.radiocont}>
            <View style={styles.radiodownbox}>
              {/* {`Select Gender *`} */}
              <Title style={styles.bbstyle}>{`Select Gender *`}</Title>

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
                  {/* Date of Birth * */}
                  {item.dob === '' ? `Date of Birth *` : item.dob}
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
          <View style={styles.radiocont}>
            <View style={styles.radiodownbox}>
              <Title style={styles.bbstyle}>
                {/* {`Any Pre Existing Diseases *`} */}
                {`Any Pre Existing Diseases *`}
              </Title>

              <RadioButton.Group
                onValueChange={(value) =>
                  this.onFloatitemChange(value, item, 4, index)
                }
                value={item.existing_diseases}>
                <View styleName="horizontal" style={{marginBottom: 8}}>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value="Yes" style={{alignSelf: 'center'}} />
                    <Title
                      styleName="v-center h-center"
                      style={styles.textopen}>{`Yes`}</Title>
                  </View>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value="No" style={{alignSelf: 'center'}} />
                    <Title
                      styleName="v-center h-center"
                      style={styles.textopen}>{`No`}</Title>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
          </View>
          {item.existing_diseases === 'Yes' ? (
            <AnimatedInputBox
              placeholder={'Specify Diseases *'}
              showStarVisible={false}
              onChangeText={(value) =>
                this.onFloatitemChange(value, item, 5, index)
              }
              value={item.diseases}
              changecolor
              containerstyle={styles.animatedInputCont}
              returnKeyType={'done'}
            />
          ) : null}
        </View>
      </ScrollView>
    );
  }

  fetchcityCurrentstate = (value) => {
    const parse = String(value);
    if (parse !== '' && parse.match(/^[0-9]*$/g) !== null) {
      if (parse.length === 6) {
        this.setState({lppincode: parse});
        const url = `${Pref.PostalCityUrl}?pincode=${parse}`;
        //console.log(`url`, url);
        Helper.getNetworkHelper(
          url,
          Pref.methodGet,
          (result) => {
            const {res_type, data} = result;
            //console.log(`result`, result, res_type);
            if (res_type === `error`) {
              this.setState({
                loan_property_city: '',
                homestate: '',
                lppincode: value,
              });
            } else {
              if (data.length > 0) {
                const filterActive = Lodash.filter(
                  data,
                  (io) => io.status === 'Active',
                );
                // //console.log('filterActive', filterActive)
                const state = String(filterActive[0]['State']).trim();
                const city = String(filterActive[0]['City']).trim();
                //      //console.log('state', city)
                this.setState({
                  loan_property_city: city,
                  homestate: state,
                  lppincode: value,
                });
              } else {
                this.setState({
                  loan_property_city: '',
                  homestate: '',
                  lppincode: value,
                });
              }
            }
          },
          (error) => {
            this.setState({
              loan_property_city: '',
              homestate: '',
              lppincode: parse,
            });
            //console.log(`error`, error);
          },
        );
      } else {
        this.setState({
          loan_property_city: '',
          homestate: '',
          lppincode: parse,
        });
      }
    } else {
      this.setState({
        loan_property_city: '',
        homestate: '',
        lppincode:
          parse.match(/^[0-9]*$/g) !== null ? parse : this.state.lppincode,
      });
    }
  };

  fetchcityCurrentstateCompany = (value) => {
    const parse = String(value);
    if (parse !== '' && parse.match(/^[0-9]*$/g) !== null) {
      if (parse.length === 6) {
        this.setState({cpincode: parse});
        const url = `${Pref.PostalCityUrl}?pincode=${parse}`;
        //console.log(`url`, url);
        Helper.getNetworkHelper(
          url,
          Pref.methodGet,
          (result) => {
            const {res_type, data} = result;
            //console.log(`result`, result, res_type);
            if (res_type === `error`) {
              this.setState({
                ccity: '',
                cstate: '',
                cpincode: value,
              });
            } else {
              if (data.length > 0) {
                const filterActive = Lodash.filter(
                  data,
                  (io) => io.status === 'Active',
                );
                const state = String(filterActive[0]['State']).trim();
                const city = String(filterActive[0]['City']).trim();
                this.setState({
                  ccity: city,
                  cstate: state,
                  cpincode: value,
                  companylocation: `${city},${state},${value}`,
                });
              } else {
                this.setState({
                  ccity: '',
                  cstate: '',
                  cpincode: value,
                });
              }
            }
          },
          (error) => {
            this.setState({
              ccity: '',
              cstate: '',
              cpincode: parse,
            });
            //console.log(`error`, error);
          },
        );
      } else {
        this.setState({
          ccity: '',
          cstate: '',
          cpincode: parse,
        });
      }
    } else {
      this.setState({
        ccity: '',
        cstate: '',
        cpincode:
          parse.match(/^[0-9]*$/g) !== null ? parse : this.state.cpincode,
      });
    }
  };

  /**
   * Gold Loan details fetch
   */
  goldLoan_details = () => {
    Helper.getNetworkHelper(
      Pref.GOLD_LOAN_DETAIL,
      Pref.methodGet,
      (result) => {
        const {res_type, data} = result;
        if (status) {
          this.setState({
            goldDetailList: data,
          });
        }
      },
      (error) => {},
    );
  };

  render() {
    const {
      title,
      heading = `Corporate Information`,
      showHeader = true,
    } = this.props;

    const loanCheck =
      Helper.nullStringCheck(title) === false &&
      (title === 'Business Loan' ||
        title === 'Personal Loan' ||
        title === 'Loan Against Property' ||
        title === 'Home Loan' ||
        title === 'Auto Loan')
        ? true
        : false;

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

        {title === `Insure Check` ? (
          <View>
            <AnimatedInputBox
              onChangeText={(value) => {
                if (String(value).match(/^[0-9]*$/g) !== null) {
                  this.setState({dependent: value});
                }
              }}
              showStarVisible={false}
              // onChangeText={(value) => this.setState({ dependent: value })}
              value={this.state.dependent}
              placeholder={'No Of Dependents'}
              returnKeyType={'next'}
              changecolor
              keyboardType={'numeric'}
              containerstyle={styles.animatedInputCont}
            />
          </View>
        ) : null}

        {title !== 'Vector Plus' &&
        title !== 'Mutual Fund' &&
        title !== 'Demat' &&
        title !== 'Fixed Deposit' &&
        title !== 'Motor Insurance' &&
        title !== 'Term Insurance' &&
        title !== 'Health Insurance' &&
        title !== 'Life Cum Invt. Plan' &&
        title !== 'Gold Loan' &&
        title !== 'Insure Check' ? (
          <View>
            <AnimatedInputBox
              onChangeText={(value) => this.setState({company: value})}
              value={this.state.company}
              placeholder={`Company Name`}
              showStarVisible={false}
              // placeholder={`Company Name ${title === 'Auto Loan' ||
              //   //title === 'Home Loan' ||
              //   title === 'Business Loan'
              //   //|| title === 'Personal Loan'
              //    ? '*' : ''}`}
              returnKeyType={'next'}
              changecolor
              containerstyle={styles.animatedInputCont}
            />

            <AnimatedInputBox
              keyboardType={'number-pad'}
              onChangeText={(value) => {
                if (String(value).match(/^[0-9]*$/g) !== null) {
                  this.setState({turnover: value});
                }
              }}
              value={this.state.turnover}
              placeholder={`Annual Turnover/CTC`}
              showStarVisible={false}
              // placeholder={
              //   //title === `Home Loan` ||
              //   //title === `Loan Against Property` ||
              //   //title === `Personal Loan` ||
              //   //title === `Business Loan` ||
              //   //title === `Auto Loan`
              //   //? 'Annual Turnover/CTC *'
              //   //:
              //   `Annual Turnover/CTC ${title === 'Auto Loan'
              //   //|| title === 'Home Loan'
              //   || title === 'Business Loan'
              //   //|| title === 'Personal Loan'
              //    ? ' *' : ''}`
              // }
              returnKeyType={'next'}
              changecolor
              containerstyle={styles.animatedInputCont}
              enableWords
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

        {title === 'Term Insurance' || title === 'Insure Check' ? (
          <AnimatedInputBox
            keyboardType={'number-pad'}
            onChangeText={(value) => {
              if (String(value).match(/^[0-9]*$/g) !== null) {
                this.setState({turnover: value});
              }
            }}
            value={this.state.turnover}
            //placeholder={'Annual Turnover/CTC *'}
            placeholder={'Annual Turnover/CTC'}
            showStarVisible={false}
            returnKeyType={'next'}
            changecolor
            containerstyle={styles.animatedInputCont}
            enableWords
          />
        ) : null}

        {/* {title === 'Health Insurance' ? (
          <NewDropDown
            list={healthCTCList}
            placeholder={'Annual Turnover/CTC'}
            starVisible={false}
            value={this.state.turnover}
            selectedItem={(value) => this.setState({turnover: value})}
            style={{
              borderRadius: 0,
              borderBottomColor: '#f2f1e6',
              borderBottomWidth: 1.3,
              borderWidth: 0,
              marginStart: 10,
              marginEnd: 10,
              paddingVertical: 10,
            }}
            textStyle={{
              color: '#6d6a57',
              fontSize: 14,
              fontFamily: Pref.getFontName(4),
            }}
          />
        ) : null} */}

        {title !== 'Vector Plus' &&
        title !== 'Credit Card' &&
        title !== 'Demat' &&
        title !== 'Motor Insurance' &&
        title != 'Health Insurance' &&
        title !== 'Life Cum Invt. Plan' &&
        title !== 'Gold Loan' &&
        title !== 'Insure Check' ? (
          <AnimatedInputBox
            keyboardType={'number-pad'}
            onChangeText={(value) => {
              if (String(value).match(/^[0-9]*$/g) !== null) {
                this.setState({amount: value});
              }
            }}
            value={this.state.amount}
            // placeholder={
            //   title === 'Term Insurance'
            //     ? 'Required Cover *'
            //     :
            //     title === 'Home Loan' ||
            //       title === 'Loan Against Property' ||
            //       title === `Business Loan` ||
            //       title === 'Auto Loan' ||
            //       title === `Personal Loan`
            //       ? `Desired Amount${title === 'Auto Loan'
            //       //|| title === 'Home Loan'
            //       || title === 'Business Loan'
            //       //|| title === 'Personal Loan'
            //       || title === 'Loan Against Property' ? ' *'
            //        : ''}`
            //       : 'Investment Amount *'
            // }
            placeholder={
              title === 'Term Insurance'
                ? `Required Cover`
                : title === 'Home Loan' ||
                  title === 'Loan Against Property' ||
                  title === `Business Loan` ||
                  title === 'Auto Loan' ||
                  title === `Personal Loan`
                ? `Desired Amount`
                : `Investment Amount`
            }
            showStarVisible={false}
            returnKeyType={'next'}
            changecolor
            containerstyle={styles.animatedInputCont}
            enableWords
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
          <>
            <NewDropDown
              list={healthRequiredCover}
              placeholder={'Required Cover (Amount in Lacs)'}
              starVisible={true}
              value={this.state.required_cover}
              selectedItem={(value) => this.setState({required_cover: value})}
              style={styles.newdropdowncontainers}
              textStyle={styles.newdropdowntextstyle}
            />
            <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                <Title style={styles.bbstyle}>{`Policy Type *`}</Title>

                <RadioButton.Group
                  onValueChange={(value) => this.setState({policy_type: value})}
                  value={this.state.policy_type}>
                  <View styleName="horizontal" style={{marginBottom: 8}}>
                    {policyTypeList.map((io) => {
                      return (
                        <View
                          styleName="horizontal"
                          style={{alignSelf: 'center', alignItems: 'center'}}>
                          <RadioButton
                            value={io.value}
                            style={{alignSelf: 'center'}}
                          />
                          <Title
                            styleName="v-center h-center"
                            style={styles.textopen}>
                            {io.name}
                          </Title>
                        </View>
                      );
                    })}
                  </View>
                </RadioButton.Group>
              </View>
            </View>
            {this.state.policy_type === 'Top Up'  ?
            <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                <Title style={styles.bbstyle}>{`Deductible *`}</Title>

                <RadioButton.Group
                  onValueChange={(value) => this.setState({deductible: value})}
                  value={this.state.deductible}>
                  <View styleName="horizontal" style={{marginBottom: 8}}>
                    {deductibleList.map((io) => {
                      return (
                        <View
                          styleName="horizontal"
                          style={{alignSelf: 'center', alignItems: 'center'}}>
                          <RadioButton
                            value={io.value}
                            style={{alignSelf: 'center'}}
                          />
                          <Title
                            styleName="v-center h-center"
                            style={styles.textopen}>
                            {io.name}
                          </Title>
                        </View>
                      );
                    })}
                  </View>
                </RadioButton.Group>
              </View>
            </View> : null}
          </>
        ) : // <AnimatedInputBox
        //   placeholder={'Required Cover *(Amount in Lacs)'}
        //   onChangeText={value => {
        //     if (String(value).match(/^[0-9]*$/g) !== null) {
        //       this.setState({ required_cover: value });
        //     }
        //   }}
        //   keyboardType={'number-pad'}
        //   value={this.state.required_cover}
        //   returnKeyType={'next'}
        //   changecolor
        //   containerstyle={styles.animatedInputCont}
        // />
        null}

        {title === 'Life Cum Invt. Plan' ? (
          <View>
            <AnimatedInputBox
              placeholder={'Profession'}
              showStarVisible={false}
              onChangeText={(value) => this.setState({profession: value})}
              value={this.state.profession}
              changecolor
              containerstyle={styles.animatedInputCont}
              returnKeyType={'next'}
            />

            <AnimatedInputBox
              placeholder={'Investment Amount'}
              showStarVisible={false}
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
              enableWords
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
        {/* {title !== 'Insure Check' && title !== 'Motor Insurance' ? (
          <View>
            <AnimatedInputBox
              // placeholder={`PAN Card Number${title === 'Auto Loan'
              // //|| title === 'Home Loan'
              // || title === 'Business Loan'
              // //|| title === 'Personal Loan'
              // ? ' *' : ''}`}
              placeholder={`PAN Card Number`}
              showStarVisible={false}
              onChangeText={(value) => this.setState({pancardNo: value})}
              value={this.state.pancardNo}
              changecolor
              containerstyle={styles.animatedInputCont}
              maxLength={10}
              returnKeyType={'next'}
            />

            {title.includes('Loan') ? (
              <>
                <View style={styles.radiocont}>
                  <View style={styles.radiodownbox}>
                    <Title style={styles.bbstyle}>{`Aadhar Card Detail`}</Title>
                    <RadioButton.Group
                      onValueChange={(value) =>
                        this.setState({eaadharcardNo: value, aadharcardNo: ''})
                      }
                      value={this.state.eaadharcardNo}>
                      <View styleName="horizontal" style={{marginBottom: 8}}>
                        <View
                          styleName="horizontal"
                          style={{alignSelf: 'center', alignItems: 'center'}}>
                          <RadioButton
                            value="Aadhar"
                            style={{alignSelf: 'center'}}
                          />
                          <Title
                            styleName="v-center h-center"
                            style={styles.textopen}>{`Aadhar`}</Title>
                        </View>
                        <View
                          styleName="horizontal"
                          style={{alignSelf: 'center', alignItems: 'center'}}>
                          <RadioButton
                            value="EAadhar"
                            style={{alignSelf: 'center'}}
                          />
                          <Title
                            styleName="v-center h-center"
                            style={styles.textopen}>{`E-Aadhar`}</Title>
                        </View>
                      </View>
                    </RadioButton.Group>
                  </View>
                </View>

                {this.state.eaadharcardNo !== '' ? (
                  <AnimatedInputBox
                    // placeholder={`Aadhar Card Number ${title === 'Auto Loan'
                    // //|| title === 'Home Loan'
                    // || title === 'Business Loan'
                    // //|| title === 'Personal Loan'
                    // ? ' *' : ''}`}
                    placeholder={`${
                      this.state.eaadharcardNo === 'Aadhar'
                        ? 'Aadhar'
                        : 'E-Aadhar'
                    } Card Number`}
                    showStarVisible={false}
                    maxLength={this.state.eaadharcardNo === 'Aadhar' ? 12 : 16}
                    keyboardType={'numeric'}
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
                ) : null}
              </>
            ) : null}

            {title === 'Profile' ||
            title === 'Demat' ||
            !title.includes('Loan') ? (
              <AnimatedInputBox
                // placeholder={`Aadhar Card Number ${title === 'Auto Loan'
                // //|| title === 'Home Loan'
                // || title === 'Business Loan'
                // //|| title === 'Personal Loan'
                // ? ' *' : ''}`}
                placeholder={`Aadhar Card Number`}
                showStarVisible={false}
                maxLength={16}
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
            ) : null}

            {/* <AnimatedInputBox
              // placeholder={`Aadhar Card Number ${title === 'Auto Loan'
              // //|| title === 'Home Loan'
              // || title === 'Business Loan'
              // //|| title === 'Personal Loan'
              // ? ' *' : ''}`}
              placeholder={`E-Aadhar Card`}
              showStarVisible={false}
              maxLength={16}
              keyboardType={'text'}
              onChangeText={value => {
                this.setState({eaadharcardNo: value});
              }}
              value={this.state.eaadharcardNo}
              changecolor
              containerstyle={styles.animatedInputCont}
              returnKeyType={'next'}
            /> */}
        {/* </View>
        ) : null} */}

        {title === 'Motor Insurance' ? (
          <View>
            <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                {/* {`Any Claims Last Year *`} */}
                <Title style={styles.bbstyle}>{`Any Claims Last Year`}</Title>

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

            <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                {/* {`Registration Types *`} */}
                <Title style={styles.bbstyle}>{`Registration Types`}</Title>

                <RadioButton.Group
                  onValueChange={(value) =>
                    this.setState({registration_type: value})
                  }
                  value={this.state.registration_type}>
                  <View styleName="horizontal" style={{marginBottom: 8}}>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="Private"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Private`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="Commercial"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Commercial`}</Title>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </View>

            <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                {/* {`Vehicle Type *`} */}
                <Title style={styles.bbstyle}>{`Vehicle Type`}</Title>

                <RadioButton.Group
                  onValueChange={(value) =>
                    this.setState({vehicle_type: value})
                  }
                  value={this.state.vehicle_type}>
                  <View styleName="horizontal" style={{marginBottom: 8}}>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="Two Wheeler"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Two Wheeler`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="Four Wheeler"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Four Wheeler`}</Title>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </View>

            <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                {/* {`Motor Type *`} */}
                <Title style={styles.bbstyle}>{`Motor Type`}</Title>

                <RadioButton.Group
                  onValueChange={(value) => this.setState({motor_type: value})}
                  value={this.state.motor_type}>
                  <View styleName="horizontal" style={{marginBottom: 8}}>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="Private"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Private`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="Commercial"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Commercial`}</Title>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </View>

            <NewDropDown
              list={motorTypesOfInsurance}
              placeholder={'Types Of Insurance'}
              starVisible={false}
              value={this.state.insurance}
              selectedItem={(value) => {
                this.setState({
                  insurance: value,
                });
              }}
              style={{
                borderRadius: 0,
                borderBottomColor: '#f2f1e6',
                borderBottomWidth: 1.3,
                borderWidth: 0,
                marginStart: 10,
                marginEnd: 10,
                paddingVertical: 10,
              }}
              textStyle={{
                color: '#6d6a57',
                fontSize: 14,
                fontFamily: Pref.getFontName(4),
              }}
            />

            {/* <View style={styles.radiocont}>
              <View
                style={StyleSheet.flatten([
                  styles.radiodownbox,
                  {
                    height: 164,
                  },
                ])}>
                <Title style={styles.bbstyle}>{`Types Of Insurance *`}</Title>

                <RadioButton.Group
                  onValueChange={value => this.setState({ insurance: value })}
                  value={this.state.insurance}>
                  <View
                    styleName="horizontal"
                    style={{ marginBottom: 8, flexGrow: 1, flexWrap: 'wrap' }}>
                    <View
                      styleName="horizontal"
                      style={{ alignSelf: 'center', alignItems: 'center' }}>
                      <RadioButton
                        value="Own Damages"
                        style={{ alignSelf: 'center' }}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Own Damages`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{ alignSelf: 'center', alignItems: 'center' }}>
                      <RadioButton
                        value="Comprehensive"
                        style={{ alignSelf: 'center' }}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={
                          styles.textopen
                        }>{`Comprehensive`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{ alignSelf: 'center', alignItems: 'center' }}>
                      <RadioButton
                        value="Comprehensive + Addons"
                        style={{ alignSelf: 'center' }}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={
                          styles.textopen
                        }>{`Comprehensive + Addons`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{ alignSelf: 'center', alignItems: 'center' }}>
                      <RadioButton
                        value="Third Party with PA cover"
                        style={{ alignSelf: 'center' }}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={
                          styles.textopen
                        }>{`Third Party with PA cover`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{ alignSelf: 'center', alignItems: 'center' }}>
                      <RadioButton
                        value="Third Party without PA cover"
                        style={{ alignSelf: 'center' }}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={
                          styles.textopen
                        }>{`Third Party without PA cover`}</Title>
                    </View>
                     <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="Third Party with PA unnamed passenger"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={
                          styles.textopen
                        }>{`Third Party with PA unnamed passenger`}</Title>
                    </View> 
                  </View>
                </RadioButton.Group>
              </View>
            </View> */}

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
                          this.state.expiry_date === `Expiry Date`
                            ? `#6d6a57`
                            : `#555555`,
                      },
                    ]}>
                    {this.state.expiry_date === ''
                      ? `Expiry Date`
                      : this.state.expiry_date}
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
            {/* <View style={styles.radiocont}>
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
            </View> */}

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
            {/* <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                {/* {`Smoker *`} 
                <Title style={styles.bbstyle}>{`Smoker *`}</Title>

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
                {/* {`Alcohol Consumption *`} 
                <Title style={styles.bbstyle}>{`Alcohol Consumption *`}</Title>
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
             */}
            <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                {/* {`Any Pre Existing Diseases *`} */}
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
          </View>
        ) : null}

        {title === 'Term Insurance' || title === 'Health Insurance' ? (
          this.state.existing_diseases === 'YES' ? (
            <AnimatedInputBox
              onChangeText={(value) => {
                this.setState({diseases: value});
              }}
              value={this.state.diseases}
              placeholder={'Specify Diseases *'}
              showStarVisible={false}
              changecolor
              containerstyle={styles.animatedInputCont}
            />
          ) : null
        ) : null}

        {title === 'Term Insurance' ? (
          <View>
            <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                {/* {`Preferred Payment Mode ${title === 'Term Insurance' ? '*' : ''
                  }`} */}
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
                        value="Quarterly"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Quarterly`}</Title>
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

            <View style={styles.radiocont}>
              <View
                style={StyleSheet.flatten([
                  styles.radiodownbox,
                  {
                    height: 96,
                  },
                ])}>
                {/* {`Pay Type *`} */}
                <Title style={styles.bbstyle}>{`Pay Type`}</Title>

                <RadioButton.Group
                  onValueChange={(value) => this.setState({pay_type: value})}
                  value={this.state.pay_type}>
                  <View
                    styleName="horizontal"
                    style={{marginBottom: 8, flexGrow: 1, flexWrap: 'wrap'}}>
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
                {/* {`Policy Term *`} */}
                <Title style={styles.bbstyle}>{`Policy Term`}</Title>

                <RadioButton.Group
                  onValueChange={(value) => this.setState({policy_term: value})}
                  value={this.state.policy_term}>
                  <View styleName="horizontal" style={{marginBottom: 8}}>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="60 Yearly"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Upto 60`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton value="75" style={{alignSelf: 'center'}} />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Upto 75`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton value="85" style={{alignSelf: 'center'}} />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Upto 85`}</Title>
                    </View>
                    {/* <View
                      styleName="horizontal"
                      style={{ alignSelf: 'center', alignItems: 'center' }}>
                      <RadioButton
                        value="Whole life cover"
                        style={{ alignSelf: 'center' }}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Whole life cover`}</Title>
                    </View> */}
                  </View>
                </RadioButton.Group>
              </View>
            </View>

            <NewDropDown
              list={termAddons}
              placeholder={'Addons'}
              starVisible={false}
              value={this.state.addons}
              selectedItem={(value) => {
                this.setState({
                  addons: value,
                });
              }}
              style={{
                borderRadius: 0,
                borderBottomColor: '#f2f1e6',
                borderBottomWidth: 1.3,
                borderWidth: 0,
                marginStart: 10,
                marginEnd: 10,
                paddingVertical: 10,
              }}
              textStyle={{
                color: '#6d6a57',
                fontSize: 14,
                fontFamily: Pref.getFontName(4),
              }}
            />

            {/* <View style={styles.radiocont}>
              <View
                style={StyleSheet.flatten([
                  styles.radiodownbox,
                  {
                    height: 156,
                  },
                ])}>
                <Title style={styles.bbstyle}>{`Addons *`}</Title>

                <RadioButton.Group
                  onValueChange={value => this.setState({ addons: value })}
                  value={this.state.addons}>
                  <View
                    styleName="horizontal"
                    style={{ marginBottom: 8, flexGrow: 1, flexWrap: 'wrap' }}>
                    <View
                      styleName="horizontal"
                      style={{ alignSelf: 'center', alignItems: 'center' }}>
                      <RadioButton
                        value="Critical illness"
                        style={{ alignSelf: 'center' }}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Critical illness`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{ alignSelf: 'center', alignItems: 'center' }}>
                      <RadioButton
                        value="Accidental Death Rider"
                        style={{ alignSelf: 'center' }}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={
                          styles.textopen
                        }>{`Accidental Death Rider`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{ alignSelf: 'center', alignItems: 'center' }}>
                      <RadioButton
                        value="Critical illness & Accidental Death Rider"
                        style={{ alignSelf: 'center' }}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={
                          styles.textopen
                        }>{`Critical illness & Accidental Death Rider`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{ alignSelf: 'center', alignItems: 'center' }}>
                      <RadioButton
                        value="Return of Premium"
                        style={{ alignSelf: 'center' }}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Return of Premium`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{ alignSelf: 'center', alignItems: 'center' }}>
                      <RadioButton
                        value="Increase of Sum Insured"
                        style={{ alignSelf: 'center' }}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Increase of Sum Insured`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{ alignSelf: 'center', alignItems: 'center' }}>
                      <RadioButton value="None" style={{ alignSelf: 'center' }} />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`None`}</Title>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </View>
          */}
          </View>
        ) : null}

        {title === 'Health Insurance' || title === 'Vector Plus' ? (
          <View>
            <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                {/* {`Type of Insurance *`} */}
                <Title style={styles.bbstyle}>
                  {title === 'Health Insurance'
                    ? 'Cover Type *'
                    : `Type of Insurance * `}
                </Title>

                <RadioButton.Group
                  onValueChange={(value) => {
                    this.setState({claim_type: value,                  
                    family_floater_child: 'Select Child',
                    family_floater_adult: 'Select Adult',
                    floaterItemList: [],})}
                  }
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
                {/* {`Required Cover *`} */}
                <Title style={styles.bbstyle}>{`Required Cover`}</Title>

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
            <NewDropDown
              list={healthFList}
              placeholder={'Select Adult'}
              starVisible={false}
              value={this.state.family_floater_adult}
              selectedItem={(value) => {
                let clone = JSON.parse(JSON.stringify(floatCloneList));
                if (value === `2 Adult` || value === `2 Adults`) {
                  clone.length = 1;
                }else{
                  clone = [];
                }
                //console.log('clone', clone);
                this.setState({
                  family_floater_child: 'Select Child',
                  family_floater_adult: value,
                  floaterItemList: clone,
                });
              }}
              style={{
                borderRadius: 0,
                borderBottomColor: '#f2f1e6',
                borderBottomWidth: 1.3,
                borderWidth: 0,
                marginStart: 10,
                marginEnd: 10,
                paddingVertical: 10,
              }}
              textStyle={{
                color: '#6d6a57',
                fontSize: 14,
                fontFamily: Pref.getFontName(4),
              }}
            />

            <NewDropDown
              list={healthFChildList}
              placeholder={'Select Child '}
              starVisible={false}
              value={this.state.family_floater_child}
              selectedItem={(value) => {
                const finalFloater = `${this.state.family_floater_adult} ${value}`;
                //console.log('finalFloater', finalFloater);
                const clone = JSON.parse(JSON.stringify(floatCloneList));
                if (
                  finalFloater === `2 Adult` ||
                  finalFloater === `1 Adult 1 Child`
                ) {
                  clone.length = 1;
                } else if (
                  finalFloater === `2 Adult 1 Child` ||
                  finalFloater === `1 Adult 2 Children`
                ) {
                  clone.length = 2;
                } else if (
                  finalFloater === `2 Adult 2 Children` ||
                  finalFloater === `1 Adult 3 Children`
                ) {
                  clone.length = 3;
                } else if (finalFloater === `2 Adult 3 Children`) {
                  clone.length = 4;
                }
                this.setState({
                  family_floater_child: value,
                  floaterItemList: clone,
                });
              }}
              style={{
                borderRadius: 0,
                borderBottomColor: '#f2f1e6',
                borderBottomWidth: 1.3,
                borderWidth: 0,
                marginStart: 10,
                marginEnd: 10,
                paddingVertical: 10,
              }}
              textStyle={{
                color: '#6d6a57',
                fontSize: 14,
                fontFamily: Pref.getFontName(4),
              }}
            />

            {/* <View style={styles.radiocont}>
                <View
                  style={StyleSheet.flatten([
                    styles.radiodownbox,
                    {
                      height: 264,
                    },
                  ])}>
                  <Title style={styles.bbstyle}>{`Members *`}</Title>

                  <RadioButton.Group
                    onValueChange={value => {
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
                    <View styleName="vertical" style={{ marginBottom: 8 }}>
                      {healthFList.map(e => (
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
             */}
            {this.state.floaterItemList.length > 0 ? (
              <FlatList
                data={this.state.floaterItemList}
                renderItem={({item: item, index}) =>
                  this.renderFloatRow(item, index)
                }
                style={{marginTop: 10}}
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
                  list={healthFList}
                />
              ) : null}
            </View>
          */}
          </View>
        ) : null}

        {title === 'Health Insurance' ? (
          <AnimatedInputBox
            placeholder={'Remark'}
            onChangeText={(value) => this.setState({baa: value})}
            value={this.state.baa}
            changecolor
            containerstyle={styles.animatedInputCont}
            returnKeyType={'next'}
          />
        ) : null}

        {title === 'Auto Loan' ? (
          <View>
            <AnimatedInputBox
              //placeholder={`Car RC Number ${title === 'Auto Loan' ? ' *' : ''}`}
              placeholder={`Car RC Number`}
              showStarVisible={false}
              onChangeText={(value) => this.setState({rcbook: value})}
              value={this.state.rcbook}
              changecolor
              containerstyle={styles.animatedInputCont}
              returnKeyType={'next'}
              maxLength={10}
            />
            <AnimatedInputBox
              //placeholder={`Car Model Number ${title === 'Auto Loan' ? ' *' : ''}`}
              placeholder={`Car Model Number`}
              showStarVisible={false}
              onChangeText={(value) => this.setState({model: value})}
              value={this.state.model}
              changecolor
              containerstyle={styles.animatedInputCont}
              returnKeyType={'next'}
            />

            <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                {/* {`Type Of Loan *`} */}
                <Title style={styles.bbstyle}>{`Type of Loan`}</Title>

                <RadioButton.Group
                  onValueChange={(value) => this.setState({nooldcard: value})}
                  value={this.state.nooldcard}>
                  <View styleName="horizontal" style={{marginBottom: 8}}>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="For New Car"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`For New Car`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="For Old Car"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`For Old Car`}</Title>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </View>

            <NewDropDown
              list={typeofOwnership}
              placeholder={'Type Of Ownership'}
              starVisible={false}
              value={this.state.ownership}
              selectedItem={(value) => this.setState({ownership: value})}
              style={{
                borderRadius: 0,
                borderBottomColor: '#f2f1e6',
                borderBottomWidth: 1.3,
                borderWidth: 0,
                marginStart: 10,
                marginEnd: 10,
                paddingVertical: 10,
              }}
              textStyle={{
                color: '#6d6a57',
                fontSize: 14,
                fontFamily: Pref.getFontName(4),
              }}
            />

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
            <View
              style={StyleSheet.flatten([
                styles.radiodownbox,
                {
                  height: 96,
                },
              ])}>
              {/* {`Type of Loan ${
                  //title === 'Home Loan' || 
                title === 'Business Loan' 
                //|| title === 'Personal Loan' 
                ? ' *' : ''}`} */}
              <Title style={styles.bbstyle}>{`Type of Loan`}</Title>

              <RadioButton.Group
                onValueChange={(value) => {
                  this.setState({
                    fresh_pop: '',
                    type_loan: value,
                    existingcard: value === 'Fresh' ? 'No' : 'Yes',
                  });
                }}
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
                <View styleName="horizontal" style={{marginBottom: 8}}>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value="Top Up" style={{alignSelf: 'center'}} />
                    <Title
                      styleName="v-center h-center"
                      style={styles.textopen}>{`Top Up`}</Title>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
          </View>
        ) : null}

        {title === `Home Loan` && this.state.type_loan === 'Fresh' ? (
          <NewDropDown
            list={freshTypeofLoan}
            placeholder={'Select Type of Fresh Loan'}
            value={this.state.fresh_pop}
            selectedItem={(value) => {
              this.setState({fresh_pop: value});
            }}
            style={styles.newdropdowncontainers}
            textStyle={styles.newdropdowntextstyle}
          />
        ) : null}

        {title !== 'Vector Plus' &&
        title !== 'Mutual Fund' &&
        title !== 'Demat' &&
        title !== 'Fixed Deposit' &&
        title !== 'Motor Insurance' &&
        title !== 'Term Insurance' &&
        title !== 'Health Insurance' &&
        title !== 'Life Cum Invt. Plan' &&
        title !== 'Auto Loan' &&
        title !== 'Gold Loan' &&
        title !== 'Insure Check' ? (
          <View>
            <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                {/* {`Existing Card/Loan ${title === 'Credit Card'
                  //|| title === 'Home Loan' 
                  || title === 'Business Loan' 
                  //|| title === 'Personal Loan' 
                  ? '*' : ''
                    }`} */}
                <Title style={styles.bbstyle}>{`Existing Card/Loan`}</Title>

                <RadioButton.Group
                  onValueChange={(value) =>
                    this.setState({existingcard: value})
                  }
                  value={this.state.existingcard}>
                  <View styleName="horizontal" style={{marginBottom: 8}}>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="Yes"
                        style={{alignSelf: 'center'}}
                        disabled={
                          title === 'Home Loan' ||
                          title === 'Loan Against Property'
                        }
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Yes`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="No"
                        style={{alignSelf: 'center'}}
                        disabled={
                          title === 'Home Loan' ||
                          title === 'Loan Against Property'
                        }
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`No`}</Title>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </View>
            {title === 'Credit Card' ? (
              <View>
                <AnimatedInputBox
                  onChangeText={(value) => {
                    if (String(value).match(/^[a-z, A-Z]*$/g) !== null) {
                      this.setState({ccfather: value});
                    }
                  }}
                  // maxLength={6}
                  // keyboardType={'number-pad'}
                  value={this.state.ccfather}
                  placeholder={`Father Name`}
                  showStarVisible={false}
                  returnKeyType={'next'}
                  changecolor
                  containerstyle={styles.animatedInputCont}
                />
                <AnimatedInputBox
                  onChangeText={(value) => {
                    if (String(value).match(/^[a-z, A-Z]*$/g) !== null) {
                      this.setState({ccmother: value});
                    }
                  }}
                  //maxLength={6}
                  //keyboardType={'number-pad'}
                  value={this.state.ccmother}
                  placeholder={`Mother Name`}
                  showStarVisible={false}
                  returnKeyType={'next'}
                  changecolor
                  containerstyle={styles.animatedInputCont}
                />
              </View>
            ) : null}
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

            {loanCheck ? (
              <View>
                <AnimatedInputBox
                  onChangeText={this.fetchcityCurrentstateCompany}
                  maxLength={6}
                  keyboardType={'number-pad'}
                  value={this.state.cpincode}
                  placeholder={`Company Pincode`}
                  showStarVisible={false}
                  returnKeyType={'next'}
                  changecolor
                  containerstyle={styles.animatedInputCont}
                />

                <AnimatedInputBox
                  onChangeText={(value) => this.setState({ccity: value})}
                  value={this.state.ccity}
                  placeholder={`Company City`}
                  editable={false}
                  disabled={true}
                  returnKeyType={'next'}
                  changecolor
                  containerstyle={styles.animatedInputCont}
                />

                <AnimatedInputBox
                  onChangeText={(value) => this.setState({cstate: value})}
                  value={this.state.cstate}
                  placeholder={'Company State'}
                  editable={false}
                  disabled={true}
                  returnKeyType={'next'}
                  changecolor
                  containerstyle={styles.animatedInputCont}
                />
              </View>
            ) : (
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
                      {/* {this.state.companylocation === ''
                      ? `Select Company Location ${title === 'Auto Loan' 
                      //|| title === 'Home Loan' 
                      || title === 'Business Loan' 
                      //|| title === 'Personal Loan' 
                      ? ' *' : ''}`
                      : this.state.companylocation} */}
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
            )}
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
        title !== 'Auto Loan' &&
        title !== 'Home Loan' &&
        title !== 'Loan Against Property' &&
        title !== 'Gold Loan' &&
        title !== 'Insure Check' ? (
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
                  {/* {this.state.loan_property_city === ''
                      ? title === 'Loan Against Property'
                        ? 'Select Loan Property City'
                        : 'Select Loan Property City *'
                      : this.state.loan_property_city} */}
                  {this.state.loan_property_city === ''
                    ? 'Select Loan Property City'
                    : this.state.loan_property_city}
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
        {title === 'Home Loan' || title === 'Loan Against Property' ? (
          <View>
            <AnimatedInputBox
              onChangeText={this.fetchcityCurrentstate}
              maxLength={6}
              keyboardType={'number-pad'}
              value={this.state.lppincode}
              placeholder={`Current Property Pincode`}
              showStarVisible={false}
              returnKeyType={'next'}
              changecolor
              containerstyle={styles.animatedInputCont}
            />

            <AnimatedInputBox
              onChangeText={(value) =>
                this.setState({loan_property_city: value})
              }
              value={this.state.loan_property_city}
              placeholder={`Current Property City`}
              editable={false}
              disabled={true}
              returnKeyType={'next'}
              changecolor
              containerstyle={styles.animatedInputCont}
            />

            <AnimatedInputBox
              onChangeText={(value) => this.setState({homestate: value})}
              value={this.state.homestate}
              placeholder={'Current Property State'}
              editable={false}
              disabled={true}
              returnKeyType={'next'}
              changecolor
              containerstyle={styles.animatedInputCont}
            />

            <AnimatedInputBox
              onChangeText={(value) =>
                this.setState({loan_property_address: value})
              }
              value={this.state.loan_property_address}
              // placeholder={`Property Address${
              //   //title === 'Home Loan' ||
              // title === 'Loan Against Property' ? ' *' : ''}`}
              placeholder={`Property Address`}
              showStarVisible={false}
              multiline
              maxLength={100}
              returnKeyType={'next'}
              changecolor
              containerstyle={styles.animatedInputCont}
            />
          </View>
        ) : null}
        {title === 'Insure Check' ? (
          <View>
            <View style={styles.radiocont}>
              <View
                style={StyleSheet.flatten([
                  styles.radiodownbox,
                  {
                    height: 96,
                  },
                ])}>
                {/* {`What type of insurance do you have? *`} */}
                <Title
                  style={
                    styles.bbstyle
                  }>{`What type of insurance do you have?`}</Title>

                <RadioButton.Group
                  onValueChange={(value) =>
                    this.setState({
                      type_insurance: value,
                      showInsureCheckList:
                        value === 'Health Insurance'
                          ? 1
                          : value === 'Life Insurance'
                          ? 2
                          : value === 'Health & Life Insurance'
                          ? 3
                          : 0,
                    })
                  }
                  value={this.state.type_insurance}>
                  <View
                    styleName="horizontal"
                    style={{marginBottom: 8, flexWrap: 'wrap'}}>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="Health Insurance"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Health Insurance`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="Life Insurance"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Life Insurance`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value="Health & Life Insurance"
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={
                          styles.textopen
                        }>{`Health & Life Insurance`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton value="None" style={{alignSelf: 'center'}} />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`None`}</Title>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </View>
            {this.state.showInsureCheckList === 1 ||
            this.state.showInsureCheckList === 3 ? (
              <>
                <View style={styles.radiocont1}>
                  <View
                    style={StyleSheet.flatten([
                      styles.radiodownbox,
                      {
                        height: 32,
                      },
                    ])}>
                    <Title
                      style={
                        styles.bbstyle
                      }>{`What is the sum assured for your Health Insurance Policy(in Lacs eg. 5 for 5 lakhs)?`}</Title>
                  </View>
                </View>
                <AnimatedInputBox
                  onChangeText={(value) => {
                    if (String(value).match(/^[0-9]*$/g) !== null) {
                      this.setState({health_sum_assured: value});
                    }
                  }}
                  value={this.state.health_sum_assured}
                  placeholder={'Sum Assured'}
                  showStarVisible={false}
                  returnKeyType={'next'}
                  changecolor
                  containerstyle={styles.animatedInputCont}
                  keyboardType={'numeric'}
                />

                <View style={styles.radiocont}>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      this.setState({
                        showHealthCompany: !this.state.showHealthCompany,
                      })
                    }>
                    <View style={styles.dropdownbox}>
                      <Title style={styles.boxsubtitle}>
                        {this.state.health_company === ''
                          ? 'Select Policy Company'
                          : this.state.health_company}
                        {/* {this.state.health_company === ''
                            ? 'Select Policy Company *'
                            : this.state.health_company} */}
                      </Title>
                      <Icon
                        name={'chevron-down'}
                        size={24}
                        color={'#6d6a57'}
                        style={styles.downIcon}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                  {this.state.showHealthCompany ? (
                    <DropDown
                      itemCallback={(value) =>
                        this.setState({
                          showHealthCompany: false,
                          health_company: value,
                        })
                      }
                      list={Pref.HealthCompany}
                    />
                  ) : null}
                </View>
              </>
            ) : null}

            {this.state.showInsureCheckList === 2 ||
            this.state.showInsureCheckList === 3 ? (
              <>
                <View style={styles.radiocont1}>
                  <View
                    style={StyleSheet.flatten([
                      styles.radiodownbox,
                      {
                        height: 32,
                      },
                    ])}>
                    <Title
                      style={
                        styles.bbstyle
                      }>{`What is the sum assured for your Life Insurance Policy(eg. 5 for 5 lakhs)?`}</Title>
                  </View>
                </View>
                <AnimatedInputBox
                  onChangeText={(value) => {
                    if (String(value).match(/^[0-9]*$/g) !== null) {
                      this.setState({life_sum_assured: value});
                    }
                  }}
                  value={this.state.life_sum_assured}
                  placeholder={'Sum Assured'}
                  showStarVisible={false}
                  returnKeyType={'next'}
                  changecolor
                  containerstyle={styles.animatedInputCont}
                  keyboardType={'numeric'}
                />

                <View style={styles.radiocont}>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      this.setState({
                        showLifeCompany: !this.state.showLifeCompany,
                      })
                    }>
                    <View style={styles.dropdownbox}>
                      <Title style={styles.boxsubtitle}>
                        {/* {this.state.life_company === ''
                            ? 'Select Policy Company *'
                            : this.state.life_company} */}
                        {this.state.life_company === ''
                          ? 'Select Policy Company'
                          : this.state.life_company}
                      </Title>
                      <Icon
                        name={'chevron-down'}
                        size={24}
                        color={'#6d6a57'}
                        style={styles.downIcon}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                  {this.state.showLifeCompany ? (
                    <DropDown
                      itemCallback={(value) =>
                        this.setState({
                          showLifeCompany: false,
                          life_company: value,
                        })
                      }
                      list={Pref.LifeCompany}
                    />
                  ) : null}
                </View>
              </>
            ) : null}

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

        {/* {
        title === 'Auto Loan' ||
        title === 'Business Loan' ||
        title === 'Personal Loan' ||
        title === 'Loan Against Property' ||
        title === 'Home Loan' ? (
          <>

                      {/* <MultiSelectDropDown
              list={currentAddressProofList}
              placeholder={`Select Current Address Proof`}
              style={styles.dropdownmulticontainer}
              textStyle={styles.dropdowntextstyle}
              value={this.state.current_add_proof}
              closedMenu={this.multidropdownClosed}
            /> 

            {this.state.existingcard === 'Yes' ? (
              <NewDropDown
                list={existingLoanDocumentList}
                placeholder={'Existing Loan Document'}
                value={this.state.exisitng_loan_doc}
                selectedItem={value =>
                  this.setState({exisitng_loan_doc: value})
                }
                style={styles.newdropdowncontainers}
                textStyle={styles.newdropdowntextstyle}
              />
            ) : null}

            {title === 'Home Loan' || title === 'Loan Against Property' ? (
              <>
              <NewDropDown
                list={proofOfProprtyList}
                placeholder={'Select Proof of Property'}
                value={this.state.proof_of_property}
                selectedItem={value =>{
                  const proofOfProprtyList1 = Lodash.filter(proofOfProprtyList, io => io.value !== value);
                  this.setState({proof_of_property: value,proofOfProprtyList1:proofOfProprtyList1})
                }}
                style={styles.newdropdowncontainers}
                textStyle={styles.newdropdowntextstyle}
              />
              {this.state.proof_of_property !== '' ? <NewDropDown
                list={this.state.proofOfProprtyList1}
                placeholder={'Select One'}
                value={this.state.proof_of_property1}
                selectedItem={value =>{
                  const proofOfProprtyList2 = Lodash.filter(this.state.proofOfProprtyList1, io => io.value !== value  && io !== this.state.proof_of_property);
                  this.setState({proof_of_property1: value,proofOfProprtyList2:proofOfProprtyList2})
                }}
                style={styles.newdropdowncontainers}
                textStyle={styles.newdropdowntextstyle}
              /> : null}
              {this.state.proof_of_property1 !== '' ? <NewDropDown
                list={this.state.proofOfProprtyList2}
                placeholder={'Select One'}
                value={this.state.proof_of_property2}
                selectedItem={value =>
                  this.setState({proof_of_property2: value})
                }
                style={styles.newdropdowncontainers}
                textStyle={styles.newdropdowntextstyle}
              /> : null}
              </>
            ) : null}

            <NewDropDown
              list={currentAddressProofList}
              placeholder={'Select Residence Proof'}
              value={this.state.current_add_proof}
              selectedItem={value => this.setState({current_add_proof: value})}
              style={styles.newdropdowncontainers}
              textStyle={styles.newdropdowntextstyle}
            />

          </>
        ) : null} */}

        {title === 'Gold Loan' ? (
          <>
            <AnimatedInputBox
              keyboardType={'number-pad'}
              onChangeText={(value) => {
                if (String(value).match(/^[0-9]*$/g) !== null) {
                  this.setState({
                    desired_amount: value,
                    gold_pledge: findGoldPledge(
                      this.state.goldDetailList,
                      this.state.gold_karat,
                      value,
                    ),
                  });
                }
              }}
              value={this.state.desired_amount}
              placeholder={`Desired Amount`}
              showStarVisible={false}
              returnKeyType={'next'}
              changecolor
              containerstyle={styles.animatedInputCont}
              enableWords
            />

            <NewDropDown
              list={this.state.goldDetailList}
              placeholder={'Gold Karat'}
              starVisible={false}
              value={this.state.gold_karat}
              selectedItem={(value) =>
                this.setState({
                  gold_karat: value,
                  gold_pledge: findGoldPledge(
                    this.state.goldDetailList,
                    value,
                    this.state.desired_amount,
                  ),
                })
              }
              style={styles.dropdownnewcontainer}
              textStyle={styles.dropdownnewtext}
            />

            <AnimatedInputBox
              value={this.state.gold_pledge}
              placeholder={`Required Gold to Pledge in Grams`}
              showStarVisible={false}
              returnKeyType={'done'}
              changecolor
              containerstyle={styles.animatedInputCont}
              editable={false}
              disabled={true}
            />
          </>
        ) : null}

        {this.state.showCalendar ? (
          <DateTimePicker
            testID="dateTimePicker"
            value={this.state.currentDate}
            mode={'date'}
            is24Hour={false}
            display={'spinner'}
            onChange={this.onChange}
            //maximumDate={this.state.maxDate}
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
  dropdownnewtext: {
    color: '#6d6a57',
    fontSize: 14,
    fontFamily: Pref.getFontName(4),
  },
  dropdownnewcontainer: {
    borderRadius: 0,
    borderBottomColor: '#f2f1e6',
    borderBottomWidth: 1.3,
    borderWidth: 0,
    marginStart: 10,
    marginEnd: 10,
    paddingVertical: 10,
  },
  newdropdowntextstyle: {
    color: '#6d6a57',
    fontSize: 14,
    fontFamily: Pref.getFontName(4),
  },
  newdropdowncontainers: {
    borderRadius: 0,
    borderBottomColor: '#f2f1e6',
    borderBottomWidth: 1.3,
    borderWidth: 0,
    marginStart: 10,
    marginEnd: 10,
    paddingVertical: 10,
  },
  radiocont: {
    marginStart: 10,
    marginEnd: 10,
    borderBottomWidth: 1.3,
    borderBottomColor: '#f2f1e6',
    alignContent: 'center',
  },
  radiocont1: {
    marginStart: 10,
    marginEnd: 10,
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
  textstyle12: {
    fontSize: 14,
    fontWeight: '700',
    color: Pref.RED,
    lineHeight: 20,
    marginStart: 8,
    paddingVertical: 8,
    marginVertical: 4,
  },
  dropdowntextstyle: {
    color: '#6d6a57',
    fontSize: 14,
    fontFamily: Pref.getFontName(4),
  },
  dropdownmulticontainer: {
    borderRadius: 0,
    borderBottomColor: '#f2f1e6',
    borderBottomWidth: 1.3,
    borderWidth: 0,
    marginStart: 10,
    marginEnd: 10,
    paddingVertical: 10,
  },
});
