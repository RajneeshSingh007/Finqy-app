import { Title, View } from "@shoutem/ui";
import React from "react";
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  Alert,
} from "react-native";
import { Portal } from "react-native-paper";
import * as Helper from "../../util/Helper";
import { sizeWidth, sizeHeight } from "../../util/Size";
import NavigationActions from "../../util/NavigationActions";
import LeftHeaders from "../common/CommonLeftHeader";
import * as Pref from "../../util/Pref";
import CScreen from "../component/CScreen";
import Lodash from "lodash";
import IconChooser from "../common/IconChooser";
import Purechart from "react-native-pure-chart";
import DateRangePicker from "react-native-daterange-picker";
import moment from "moment";

const productList = [
  "All Products",
  "Credit Card",
  "Insurance",
  "Loan",
  "Investment",
];

export default class HomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.crousel = React.createRef();
    const allProducts = Pref.productListClone;
    this.state = {
      startDate: null,
      endDate: null,
      displayedDate: moment(),
      loading: false,
      progressloader: false,
      dataList: [],
      bannerList: [],
      showRefDialog: false,
      userData: null,
      pageIndex: 0,
      showNotification: false,
      noteContent: "",
      leadcount: 0,
      token: "",
      showProfile: false,
      type: "",
      leadData: {
        confirm_lead: 0,
        total_credit_card_lead: 0,
        total_insurance_lead: 0,
        total_investment_lead: 0,
        total_lead: 0,
        total_loan_lead: 0,
        convertedPercent: 0,
      },
      pieData: [],
      barData: [
        { x: productList[1], y: 0, color: "#87c1fc" },
        { x: productList[2], y: 0, color: "#fe8c8c" },
        { x: productList[3], y: 0, color: "#ffe251" },
        { x: productList[4], y: 0, color: "#77e450" },
      ],
      enableFilter: false,
      selectedProdut: "All Products",
      enableDropdown: false,
      allProducts: allProducts,
      pieTextData: [],
      datefilter: false,
      filterdates: '',
    };
    Pref.getVal(Pref.userData, (value) => {
      if (value !== undefined && value !== null) {
        const pp = value.user_prof;
        //console.log('pp', pp)
        let profilePic = pp === undefined || pp === null || pp === '' || (!pp.includes('.jpg') && !pp.includes('.jpeg') && !pp.includes('.png')) ? null : { uri: decodeURIComponent(pp) };
        this.setState({ userData: value, profilePic: profilePic });
      }
    });
    Pref.getVal(Pref.USERTYPE, (v) => {
      this.setState({ type: v });
    });

  }

  setDates = (dates) => {
    this.setState({
      ...dates
    });
  };

  dateFilterSubmit = (val) => {
    const { token, userData, dates, endDate, startDate } = this.state;
    const { refercode } = userData;
    //const { endDate, startDate, } = dates;
    //console.log('dates', endDate, startDate)
    if (startDate != null) {
      const parse = moment(startDate).format('DD-MM-YYYY');
      this.setState({ datefilter: false, endDate: null, startDate: null })
      let endparse = null
      if (endDate != null) {
        endparse = moment(endDate).format('DD-MM-YYYY');
      } else {
        endparse = parse;
      }
      this.fetchDashboard(token, `${parse}@${endparse}`);
    } else {
      this.setState({ datefilter: false, endDate: null, startDate: null })
    }
  }


  componentDidMount() {
    try {
      Helper.requestPermissions();
    } catch (e) {
      // //console.log(e);
    }
    const { navigation } = this.props;
    this.willfocusListener = navigation.addListener("willFocus", () => {
      this.setState({ loading: false });
    });
    this.focusListener = navigation.addListener('didFocus', () => {
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
              const { data, response_header } = result;
              const { res_type } = response_header;
              if (res_type === `success`) {
                this.setState({ token: Helper.removeQuotes(data) });
                Pref.setVal(Pref.saveToken, Helper.removeQuotes(data));
                this.fetchDashboard(Helper.removeQuotes(data), '');
              }
            },
            (error) => {
              //console.log(`error`, error)
            }
          );
        } else {
          this.setState({ token: value });
          this.fetchDashboard(value, '');
        }
      });
    });
    
  }

  fetchDashboard = (token,filterdates = '') => {
    const { refercode} = this.state.userData;
    const body = JSON.stringify({
      user_id: refercode,
      flag: this.state.type === "referral" ? 2 : 1,
      date_range: filterdates
    });
    //console.log('body', body)
    Helper.networkHelperTokenPost(
      Pref.NewDashBoardUrl,
      body,
      Pref.methodPost,
      token,
      (result) => {
        let { leadData } = this.state;
        leadData = result;
        const barData = this.returnBarData(result);
        const pieData = this.returnPieData(result);
        const filter = Lodash.filter(pieData, io => io.value != 0);
        //console.log('leadData', barData)
        this.setState({
          pieData: filter, leadData: leadData, barData: barData, datefilter: false,
          endDate: null,
          startDate: null
        });
      },
      (error) => {
        //console.log(error);
      }
    );
  };

  getFilterList = (selectedProdut) => {
    const { allProducts } = this.state;
    let filter = Lodash.filter(allProducts, (io) => {
      if (selectedProdut.includes("Insurance")) {
        return (
          io.name.includes(selectedProdut) ||
          io.name.includes("Vector") ||
          io.name.includes("Policy") ||
          io.name.includes("Sabse")
        );
      } else {
        return io.name.includes(selectedProdut);
      }
    });
    if (selectedProdut.includes("Investment")) {
      filter = Lodash.filter(
        allProducts,
        (io) =>
          !io.name.includes("Loan") &&
          !io.name.includes("Insurance") &&
          !io.name.includes("Credit") &&
          !io.name.includes("Vector") &&
          !io.name.includes("Policy") &&
          !io.name.includes("Sabse")
      );
    }
    return filter;
  };

  filterResult = (ed) => {
    if (ed === 'All Products') {
      this.reset();
      return false;
    }
    const leadData = JSON.parse(JSON.stringify(this.state.leadData));
    //console.log('leadData', leadData)
    const cloneList = this.getFilterList(ed);
    const color = this.returnSelectProductColor(ed);
    let mapBarData = [];
    let mapPieData = [];
    let pieTextData = [];
    cloneList.map((item) => {
      const { name } = item;
      //console.log('name', name)
      let y = 0;
      let colorx = color;
      let x = name;
      if (name === 'Term Insurance') {
        y = leadData.term_insurance;
        colorx = '#e27373';
      } else if (name === 'Motor Insurance') {
        y = leadData.motor_insurance;
        colorx = '#fea3a3';
      } else if (name === 'Health Insurance') {
        y = leadData.health_insurance;
        colorx = '#f7b2b2';
      } else if (name === 'Insurance Samadhan') {
        y = leadData.insurance_samadhan;
        colorx = "#fed1d1";
      } else if (name === 'Mutual Fund') {
        y = leadData.mutual_fund;
        colorx = '#85f95b';
      } else if (name === 'Fixed Deposit') {
        y = leadData.fixed_deposit;
        colorx = '#98f377';
      } else if (name.includes("Life")) {
        y = leadData.life_cum_investment;
        colorx = "#78f54b";
      } else if (name === 'Home Loan') {
        y = leadData.home_loan;
        colorx = '#f9e062'
      } else if (name === 'Loan Against Property') {
        y = leadData.loan_against_property;
        colorx = '#f5e076'
      } else if (name === 'Business Loan') {
        y = leadData.business_loan;
        colorx = '#ccbb69'
      } else if (name === 'Personal Loan') {
        y = leadData.personal_loan;
        colorx = '#e8d785'
      } else if (name === 'Auto Loan') {
        y = leadData.auto_loan;
        colorx = '#decf89'
      } else if (name === 'Credit Card') {
        y = leadData.total_credit_card_lead;
      } else if (name === 'Vector Plus') {
        y = leadData.religare;
        colorx = '#f78282';
        x = 'Religare'
      } else if (name === `Hello Doctor Policy`) {
        y = leadData.aditya_birla_doc;
        x = 'Aditya Birla DOC';
        colorx = '#e89898';
      } else if (name === `Sabse Asaan Health Plan`) {
        y = leadData.aditya_birla_cio;
        colorx = '#f19f9f';
        x = 'Aditya Birla CIO';
      } else if (name === 'Asaan Health Policy') {
        y = leadData.aditya_birla_ci;
        colorx = '#ea9a9a';
        x = 'Aditya Birla CI';
      }
      mapBarData.push({ x: x, y: y, color: colorx });
      //if (y > 0) {
      mapPieData.push({
        value: y,
        label: x,
        color: colorx,
      })
      //}
    });
    const piearraySize = mapPieData.length;
    let counter = 0;
    //console.log('mapPieData', mapPieData)
    if (mapPieData.length > 0) {
      const totalSum = Lodash.sumBy(mapPieData, op => op.value);
      pieTextData = Lodash.map(mapPieData, (i => {
        const perc = this.getPercentage(totalSum, i.value);
        i.perc = perc;
        if (perc === 0) {
          counter += 1;
        }
        return i;
      }))
    }
    //console.log(mapBarData)
    //mapBarData = [];
    if (piearraySize === counter) {
      pieTextData = [];
    }
    this.setState({
      barData: mapBarData,
      pieData: mapPieData.length > 0 ? ed.includes('Credit') ? [] : Lodash.filter(mapPieData, io => io.value != 0)
        : [],
      selectedProdut: ed,
      enableDropdown: false,
      enableFilter: true,
      pieTextData: pieTextData
    }, () => {
      this.forceUpdate();
    });
  };

  getPercentage = (total, got) => {
    return total > 0 && got > 0
      ? Number((got * 100) / total).toFixed(1)
      : 0
  }

  returnBarData = (result) => {
    const {
      total_credit_card_lead,
      total_insurance_lead,
      total_investment_lead,
      total_loan_lead,
    } = result;
    const barData = [
      { x: productList[1], y: total_credit_card_lead, color: "#87c1fc" },
      { x: productList[2], y: total_insurance_lead, color: "#fe8c8c" },
      { x: productList[3], y: total_loan_lead, color: "#ffe251" },
      { x: productList[4], y: total_investment_lead, color: "#77e450" },
    ];
    return barData
  };

  returnPieData = (result) => {
    const {
      total_credit_card_lead,
      total_insurance_lead,
      total_investment_lead,
      total_loan_lead,
    } = result;

    let pie = [];
    if (
      total_credit_card_lead === 0 &&
      total_insurance_lead === 0 &&
      total_investment_lead === 0 &&
      total_loan_lead
    ) {
      pie = [];
    } else {
      pie = [
        {
          value: total_credit_card_lead,
          label: productList[1],
          color: "#87c1fc",
        },
        {
          value: total_insurance_lead,
          label: productList[2],
          color: "#fe8c8c",
        },
        {
          value: total_loan_lead,
          label: productList[3],
          color: "#ffe251",
        },
        {
          value: total_investment_lead,
          label: productList[4],
          color: "#77e450",
        },
      ];
    }
    return pie;
  }

  reset = () => {
    const { leadData } = this.state;
    const barData = this.returnBarData(leadData);
    const pieData = this.returnPieData(leadData);
    const filter = Lodash.filter(pieData, io => io.value != 0);
    this.setState({ pieData: filter, barData: barData, enableDropdown: false, enableFilter: false, selectedProdut: 'All Products', pieTextData: [] });
  }

  getconvertedPercentage = () => {
    const total_lead = this.returnTotalLead();
    const confirm_lead = this.returnConfirmLead();
    return confirm_lead ? this.getPercentage(total_lead, confirm_lead) : 0;
  };

  returnTotalLead = () => {
    const { selectedProdut, leadData } = this.state;
    if (selectedProdut === "All Products") {
      return leadData.total_lead;
    } else if (selectedProdut === "Credit Card") {
      return leadData.total_credit_card_lead;
    } else if (selectedProdut === "Insurance") {
      return leadData.total_insurance_lead;
    } else if (selectedProdut === "Investment") {
      return leadData.total_investment_lead;
    } else if (selectedProdut === "Loan") {
      return leadData.total_loan_lead;
    } else {
      return 0;
    }
  };

  returnConfirmLead = () => {
    const { selectedProdut, leadData } = this.state;
    if (selectedProdut === "All Products") {
      return leadData.confirm_lead;
    } else if (selectedProdut === "Credit Card") {
      return leadData.cc_confirm_lead;
    } else if (selectedProdut === "Insurance") {
      return leadData.insurance_confirm_lead;
    } else if (selectedProdut === "Investment") {
      return leadData.investment_confirm_lead;
    } else if (selectedProdut === "Loan") {
      return leadData.loan_confirm_lead;
    } else {
      return 0;
    }
  };

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  logout = () => {
    Alert.alert("Logout", "Are you sure want to Logout?", [
      {
        text: "Cancel",
      },
      {
        text: "Ok",
        onPress: () => {
          Pref.setVal(Pref.saveToken, null);
          Pref.setVal(Pref.userData, null);
          Pref.setVal(Pref.userID, null);
          Pref.setVal(Pref.USERTYPE, "");
          Pref.setVal(Pref.loggedStatus, false);
          NavigationActions.navigate("IntroScreen");
        },
      },
    ]);
  };

  dismisssProfile = () => {
    this.setState({ showProfile: false });
  };

  /**
   *
   * @param {*} count
   * @param {*} title
   * @param {*} icon
   * @param {*} iconClick
   */
  renderCircleItem = (
    count = 0,
    title = "",
    icon = "bell",
    iconClick = () => { },
    type = 1
  ) => {
    return (
      <View
        styleName="md-gutter vertical  v-center h-center"
        style={styles.leadcircle}
      >
        <TouchableWithoutFeedback onPress={iconClick}>
          <View style={styles.circle} styleName="v-center h-center">
            <IconChooser
              name={icon}
              size={20}
              color={"white"}
              style={styles.iconcenter}
              iconType={type}
            />
          </View>
        </TouchableWithoutFeedback>
        <Title
          style={StyleSheet.flatten([
            styles.passText,
            {
              fontSize: 26,
              lineHeight: 30,
              color: "#6e6e6e",
              marginBottom: 10,
            },
          ])}
        >{`${count}`}</Title>
        <Title
          style={StyleSheet.flatten([
            styles.passText,
            {
              fontSize: 17,
              lineHeight: 18,
              color: "#6e6e6e",
            },
          ])}
        >{`${title}`}</Title>
      </View>
    );
  };

  renderFooter = (title, color, style = {}, textColor = null) => {
    return (
      <View
        styleName="horizontal"
        style={StyleSheet.flatten([{
          marginHorizontal: 16,
          flex: 1,
        }, style])}
      >
        <View
          style={StyleSheet.flatten([
            styles.circle1,
            {
              backgroundColor: `${color}`,
            },
          ])}
        />
        <Title
          style={StyleSheet.flatten([
            styles.passText,
            {
              color: textColor === null ? `${color}` : `${textColor}`,
              fontSize: 17,
              lineHeight: 20,
              fontWeight: "400",
              fontFamily: Pref.getFontName(4),
              marginStart: 16,
              textAlign: "left",
              flex: 1,
            },
          ])}
        >{`${title}`}</Title>
      </View>
    );
  };

  returnSelectProductPos = () => {
    const { selectedProdut } = this.state;
    const find = Lodash.findLastIndex(productList, (e) => e === selectedProdut);
    return find;
  };

  returnSelectProductColor = (selectedProdut) => {
    if (selectedProdut === "All Products") {
      return "#87c1fc";
    } else if (selectedProdut === "Credit Card") {
      return "#87c1fc";
    } else if (selectedProdut === "Insurance") {
      return "#fe8c8c";
    } else if (selectedProdut === "Investment") {
      return "#77e450";
    } else if (selectedProdut === "Loan") {
      return "#ffe251";
    } else {
      return "#77e450";
    }
  };

  itemClick = (e, i) => {
    this.filterResult(e);
  };

  render() {
    const { showProfile, type, userData, leadData, pieTextData, profilePic, endDate, startDate, displayedDate, datefilter } = this.state;
    let name = "";
    if (Helper.nullCheck(userData) === false) {
      name = userData.rname === undefined ? userData.username : userData.rname;
      //profilePic = userData.user_prof === undefined || userData.user_prof === null ? null : {uri:userData.user_prof};
    }
    return (
      <CScreen
        refresh={() => this.fetchDashboard(this.state.token, '')}
        bgColor={Pref.WHITE}
        absolute={
          <>
            {/* {showProfile ? (
              <Portal>
                <TouchableWithoutFeedback onPress={this.dismisssProfile}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      backgroundColor: "transparent",
                    }}
                    onPress={this.dismisssProfile}
                  >
                    <View style={{ flex: 0.13 }} />
                    <View style={{ flex: 0.1 }}>
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <View style={{ flex: 0.2 }} />
                        <View
                          styleName="vertical md-gutter"
                          style={styles.filtercont}
                        >
                           <View style={styles.tri}></View> 
                          <Title
                            style={StyleSheet.flatten([
                              styles.passText,
                              {
                                lineHeight: 24,
                                fontSize: 18,
                              },
                            ])}
                          >
                            {Lodash.truncate(name, {
                              length: 24,
                              separator: "...",
                            })}
                          </Title>
                          <Title
                            style={StyleSheet.flatten([
                              styles.passText,
                              {
                                color: Pref.RED,
                                fontSize: 16,
                                lineHeight: 20,
                                paddingVertical: 0,
                                marginBottom: 8,
                                marginTop: 4,
                              },
                            ])}
                          >
                            {`${type === "connector"
                              ? `Connector`
                              : type === `referral`
                                ? "Referral"
                                : `Team`
                              } Partner`}
                          </Title>

                          <View style={styles.line}></View>

                          <TouchableWithoutFeedback onPress={this.logout}>
                            <Title
                              style={StyleSheet.flatten([
                                styles.passText,
                                {
                                  marginTop: 8,
                                  color: "#0270e3",
                                  fontSize: 14,
                                  lineHeight: 20,
                                  paddingVertical: 0,
                                  textDecorationColor: "#0270e3",
                                  textDecorationStyle: "solid",
                                  textDecorationLine: "underline",
                                },
                              ])}
                            >
                              {`Logout`}
                            </Title>
                          </TouchableWithoutFeedback>
                        </View>
                        <View style={{ flex: 0.2 }} />
                      </View>
                    </View>
                    <View style={{ flex: 0.77 }} />
                  </View>
                </TouchableWithoutFeedback>
              </Portal>
            ) : null} */}
            {datefilter === true ?
              <DateRangePicker
                onChange={this.setDates}
                endDate={endDate}
                startDate={startDate}
                displayedDate={displayedDate}
                range
                //presetButtons
                //buttonStyle={styles.submitbuttonpicker}
                buttonTextStyle={{
                  fontSize: 15,
                  fontWeight: '700',
                  color: 'white',
                }}
                submitClicked={this.dateFilterSubmit}
                closeCallback={() => this.setState({startDate:null, endDate:null,datefilter:false})}
              /> : null}
          </>
        }
        body={
          <TouchableWithoutFeedback onPress={this.dismisssProfile}>
            <View>
              <LeftHeaders
                //profile={() => this.setState({ showProfile: !showProfile })}
                backClicked={() => NavigationActions.openDrawer()}
                title={`Hi,`}
                name={name}
                profilePic={profilePic}
                type={type}
              />

              {/* {this.state.enableFilter === false ? ( */}
              <View styleName="horizontal md-gutter v-center h-center">
                <View styleName="vertical v-center h-center">
                  <View styleName="horizontal">
                    <Title
                      style={StyleSheet.flatten([
                        styles.itemtopText,
                        {
                          color: "#6e6e6e",
                          fontSize: 16,
                          fontWeight: "700",
                          marginStart: 16,
                        },
                      ])}
                    >
                      {`Filter By:`}
                    </Title>

                    <TouchableWithoutFeedback
                      onPress={() =>
                        this.setState({
                          enableDropdown: !this.state.enableDropdown,
                          datefilter: false,
                          endDate: null,
                          startDate: null
                        })
                      }
                    >
                      <View styleName="horizontal">
                        <Title
                          style={StyleSheet.flatten([
                            styles.itemtopText,
                            {
                              color: "#0270e3",
                              fontSize: 16,
                              fontWeight: "700",
                              marginStart: 16,
                            },
                          ])}
                        >
                          {`${this.state.selectedProdut}`}
                        </Title>
                        <IconChooser
                          name={
                            this.state.enableFilter
                              ? "chevron-up"
                              : "chevron-down"
                          }
                          size={20}
                          color={"#0270e3"}
                          style={{
                            alignSelf: "center",
                            justifyContent: "center",
                            marginStart: 12,
                          }}
                        />
                      </View>
                    </TouchableWithoutFeedback>

                    <View style={{
                      width: 1,
                      height: '100%',
                      backgroundColor: '#5555',
                      alignSelf: 'center',
                      marginStart: 6
                    }} />
                    <TouchableWithoutFeedback
                      onPress={() =>
                        this.setState({
                          datefilter: !this.state.datefilter,
                        })
                      }
                    >
                      <View styleName="horizontal">
                        <Title
                          style={StyleSheet.flatten([
                            styles.itemtopText,
                            {
                              color: "#0270e3",
                              fontSize: 16,
                              fontWeight: "700",
                              marginStart: 16,
                            },
                          ])}
                        >
                          {`Date Range`}
                        </Title>
                        {/* <IconChooser
                          name={
                            this.state.enableFilter
                              ? "chevron-up"
                              : "chevron-down"
                          }
                          size={20}
                          color={"#0270e3"}
                          style={{
                            alignSelf: "center",
                            justifyContent: "center",
                            marginStart: 12,
                          }}
                        /> */}
                      </View>
                    </TouchableWithoutFeedback>

                  </View>
                  {this.state.enableDropdown === true ? (
                    <View
                      styleName="vertical v-end h-end"
                      style={styles.pfiltercont}
                    >
                      {productList.map((e, i) => {
                        return (
                          <View
                            styleName="vertical"
                            style={{
                              marginVertical: 6,
                            }}
                          >
                            <TouchableWithoutFeedback
                              onPress={() => this.itemClick(e, i)}
                            >
                              <Title
                                style={StyleSheet.flatten([
                                  styles.passText,
                                  {
                                    color: "#6e6852",
                                    fontSize: 16,
                                    lineHeight: 20,
                                    fontWeight: "400",
                                    paddingHorizontal: 8,
                                    alignSelf: "flex-start",
                                    justifyContent: "flex-start",
                                    textAlign: "left",
                                  },
                                ])}
                              >
                                {`${e}`}
                              </Title>
                            </TouchableWithoutFeedback>
                            <View
                              style={{
                                height: 1,
                                width: "100%",
                                backgroundColor: "#dcdace",
                                marginVertical: 1,
                              }}
                            />
                          </View>
                        );
                      })}
                    </View>
                  ) : null}
                  {/* <View style={{
                      width:'100%',
                      height:1,
                      backgroundColor:'#5555',
                      alignSelf:'center',
                      marginVertical:8
                    }}/> */}
                </View>
              </View>
              {/* ) : (
                  <View styleName='vertical space-between'>
                    <Title
                      style={StyleSheet.flatten([
                        styles.itemtopText,
                        {
                          color: '#0270e3',
                          fontSize: 18,
                          fontWeight: "400",
                          alignContent: 'center',
                          alignSelf: 'center',
                          justifyContent: 'center',
                          marginTop: 12
                        },
                      ])}
                    >{this.state.selectedProdut}</Title>
                    <TouchableWithoutFeedback onPress={this.reset}>
                      <View
                        styleName="horizontal v-end h-end md-gutter"
                        style={{
                          marginEnd: 16,
                          marginTop: -24
                        }}
                      >
                        <DrawerTop
                          backClicked={this.reset}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                )} */}
              <View
                styleName="md-gutter vertical v-center h-center"
                style={styles.leadercont}
              >
                {this.renderCircleItem(
                  `${this.returnTotalLead()}`,
                  "Total\nLeads",
                  "bell",
                  () => { },
                  1
                )}
                {this.renderCircleItem(
                  `${this.returnConfirmLead()}`,
                  "Total Converted\nLeads",
                  "filter",
                  () => { }
                )}
                {this.renderCircleItem(
                  `${this.getconvertedPercentage()}%`,
                  "Total Converted\nPercentage",
                  "percent",
                  () => { }
                )}
              </View>

              <Purechart
                data={this.state.barData}
                type="bar"
                yAxisGridLineColor={"#d5d5d5"}
                yAxislabelColor={"#656565"}
                labelColor={"#656565"}
                showEvenNumberXaxisLabel={false}
                backgroundColor={Pref.WHITE}
                height={250}
                defaultColumnWidth={60}
                defaultColumnMargin={12}
                highlightColor={"#d5d5d5"}
              />

              <View
                style={{
                  paddingVertical: 10,
                }}
              >
                <Title
                  style={StyleSheet.flatten([
                    styles.passText,
                    {
                      color: "#555555",
                      fontSize: 24,
                      lineHeight: 24,
                      marginVertical: 8,
                      paddingVertical: 6,
                    },
                  ])}
                >{`All Leads`}</Title>
                {this.state.selectedProdut === "All Products" ? (
                  <>
                    <View styleName="horizontal space-between v-center h-center">
                      {this.renderFooter(productList[1], "#87c1fc")}
                      {this.renderFooter(productList[2], "#fe8c8c")}
                    </View>
                    <View
                      styleName="horizontal space-between v-center h-center"
                      style={{
                        marginTop: 10,
                      }}
                    >
                      {this.renderFooter(productList[3], "#ffe251")}
                      {this.renderFooter(productList[4], "#77e450")}
                    </View>
                  </>
                ) : (
                    <View styleName="horizontal space-between v-center h-center">
                      {this.renderFooter(
                        productList[this.returnSelectProductPos()],
                        this.returnSelectProductColor(this.state.selectedProdut)
                      )}
                    </View>
                  )}
              </View>

              {this.state.pieData.length > 0 ? (
                <>
                  <View styleName="h-center v-center">
                    <View
                      styleName="horizontal h-center v-center"
                      style={{
                        marginVertical: 16,
                      }}
                    >
                      <Purechart
                        data={this.state.pieData}
                        type="pie"
                        size={200}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      paddingVertical: 10,
                    }}
                  >
                    {pieTextData.length > 0 || this.state.selectedProdut === 'All Products' ? <Title
                      style={StyleSheet.flatten([
                        styles.passText,
                        {
                          color: "#555555",
                          fontSize: 24,
                          lineHeight: 24,
                          marginVertical: 8,
                          paddingVertical: 10,
                        },
                      ])}
                    >{`Sales By Category`}</Title> : null}

                    {this.state.selectedProdut === 'All Products' ? <>
                      <View styleName="horizontal space-between v-center h-center">
                        {this.renderFooter(productList[1], "#87c1fc")}
                        {this.renderFooter(productList[2], "#fe8c8c")}
                      </View>
                      <View
                        styleName="horizontal space-between v-center h-center"
                        style={{
                          marginTop: 10,
                        }}
                      >
                        {this.renderFooter(productList[3], "#ffe251")}
                        {this.renderFooter(productList[4], "#77e450")}
                      </View>
                    </> : pieTextData.length > 0 ? pieTextData.map(ei => {
                      return this.renderFooter(`${ei.label} - ${ei.perc}%`, "#bebcb3", {
                        marginVertical: 10
                      }, '#b9b6ae')
                    }) : null}
                  </View>
                </>
              ) : null}
            </View>
          </TouchableWithoutFeedback>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  submitbuttonpicker: {
    backgroundColor: Pref.RED,
    borderColor: 'transparent',
    borderWidth: 0,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    width: '100%',
    borderRadius: 0,
    marginEnd: 10,
    marginBottom: -2,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8
  },
  iconcenter: {
    alignSelf: "center",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignSelf: "flex-end",
    borderRadius: 42 / 2,
    backgroundColor: "#0270e3",
    marginEnd: 16,
    marginBottom: 8,
  },
  circle1: {
    width: 16,
    height: 16,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 16 / 2,
    backgroundColor: "#0270e3",
  },
  leadercont: {
    alignItems: "center",
    alignContent: "center",
  },
  leadcircle: {
    borderColor: "#dbd9cc",
    width: sizeWidth(56),
    height: sizeWidth(56),
    borderRadius: sizeWidth(56) / 2.0,
    borderWidth: 1.5,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  tri: {
    //position: 'absolute',
    backgroundColor: "transparent",
    borderTopWidth: 36 / 2.0,
    borderRightWidth: 0,
    borderBottomWidth: 36 / 2.0,
    borderLeftWidth: 24,
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "white",
    flexDirection: "row",
    alignSelf: "flex-end",
    right: -28,
  },
  pfiltercont: {
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 8,
    paddingHorizontal: 16,
    borderColor: "#dbdacd",
    borderWidth: 0.8,
    backgroundColor: Pref.WHITE,
    borderRadius: 8,
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    }),
  },
  filtercont: {
    flex: 0.6,
    //position: 'absolute',
    //zIndex: 99,
    borderColor: "#dbdacd",
    borderWidth: 0.8,
    backgroundColor: Pref.WHITE,
    alignSelf: "flex-end",
    borderRadius: 8,
    //top: 24,
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    }),
  },
  passText: {
    fontSize: 20,
    letterSpacing: 0.5,
    color: "#555555",
    fontWeight: "700",
    lineHeight: 20,
    alignSelf: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  line: {
    backgroundColor: "#f2f1e6",
    height: 1.2,
    marginStart: 12,
    marginEnd: 12,
    marginTop: 8,
  },
});
