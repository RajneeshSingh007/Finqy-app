import React from "react";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Title, View } from "@shoutem/ui";
import * as Helper from "../../../util/Helper";
import * as Pref from "../../../util/Pref";
import { Colors, Button } from "react-native-paper";
import { sizeHeight, sizeWidth } from "../../../util/Size";
import AnimatedInputBox from "../../component/AnimatedInputBox";
import NewDropDown from "../../component/NewDropDown";
import Loader from "../../../util/Loader";
import NavigationActions from "../../../util/NavigationActions";
import moment from "moment";
import { ScrollView } from "react-native-gesture-handler";
import IconChooser from "../../common/IconChooser";
import Lodash from 'lodash';

let healthRequiredCover = [
  { value: `3`, name: "3Lac" },
  { value: `3.5`, name: "3.5Lac" },
  { value: `4`, name: "4Lac" },
  { value: `4.5`, name: "4.5Lac" },
  { value: `5`, name: "5Lac" },
  { value: `5.5`, name: "5.5Lac" },
  { value: `7`, name: "7Lac" },
  { value: `7.5`, name: "7.5Lac" },
  { value: `10`, name: "10Lac" },
  { value: `15`, name: "15Lac" },
  { value: `20`, name: "20Lac" },
  { value: `25`, name: "25Lac" },
  { value: `30`, name: "30Lac" },
  { value: `35`, name: "35Lac" },
  { value: `40`, name: "40Lac" },
  { value: `45`, name: "45Lac" },
  { value: `50`, name: "50Lac" },
  { value: `75`, name: "75Lac" },
  { value: `100`, name: "100Lac" },
];

let healthFList = [
  { value: "1 Adult", name: "1 Adults" },
  { value: "2 Adult", name: "2 Adult" },
];

let healthFChildList = [{ value: "1 Child" }, { value: "2 Children" }];

const policyTypeList = [
  {
    value: `New`,
    name: "New",
  },
  {
    value: `Top Up`,
    name: "Top Up",
  },
];

const deductibleList = [
  {
    value: `2`,
    name: "2",
  },
  {
    value: `3`,
    name: "3",
  },
  {
    value: `5`,
    name: "5",
  },
  {
    value: `10`,
    name: "10",
  },
];

const claimTypeList = [
  {
    value: "Individual",
    name: "Individual",
  },
  {
    value: "Family Floater",
    name: "Family Floater",
  },
];

const combinationList = [
  { value: "1 Adult", name: "1 Adult" },
  { value: "2 Adult", name: "2 Adult" },
  { value: "1 Adult 1 Child", name: "1 Adult 1 Child" },
  { value: "1 Adult 2 Children", name: "1 Adult 2 Children" },
  { value: "2 Adult 1 Child", name: "2 Adult 1 Child" },
  { value: "2 Adult 2 Children", name: "2 Adult 2 Children" },
]

export default class QuickHealth extends React.PureComponent {
  constructor(props) {
    super(props);
    this.fileState = null;
    this.fileUploadFormRef = React.createRef();
    this.token = "";
    this.userData = null;
    this.storeState = null;
    const { quickQuotes } = props;
    this.state = {
      family_floater_adult: "",
      family_floater_child: "",
      age: "",
      deductible: "",
      policy_type: "",
      required_cover: "",
      currentPosition: 0,
      scrollReset: false,
      editMode: false,
      disableClick: 0,
      name: "",
      mobile: "",
      formid: "",
      quickQuotes: quickQuotes,
      claim_type: "",
      combination_type:''
    };
    Pref.getVal(Pref.saveToken, (value) => {
      this.token = value;
      Pref.getVal(Pref.userData, (userData) => {
        this.userData = userData;
      });
    });
  }

  componentDidMount() {
    Pref.getVal(Pref.saveToken, (value) => {
      this.token = value;
      Pref.getVal(Pref.userData, (userData) => {
        this.userData = userData;
      });
    });
  }

  /**
   * submit form
   */
  formSubmit = (jumped = false, position = 0) => {
    const { currentPosition, editMode, disableClick } = this.state;
    let checkData = true;
    let formData = new FormData();
    formData.append("health_insurance", "health_insurance");

    if (this.state.name === "") {
      alert("Full Name empty");
      checkData = false;
    } else if (this.state.mobile === "") {
      alert("Mobile Number empty");
      checkData = false;
    } else if (
      Number(this.state.mobile.length) < 10 ||
      this.state.mobile === "9876543210" ||
      this.state.mobile === "1234567890"
    ) {
      checkData = false;
      alert("Invalid mobile number");
    } else if (this.state.mobile.match(/^[0-9]*$/g) === null) {
      checkData = false;
      alert("Invalid mobile number");
    } else if (this.state.combination_type === "") {
      checkData = false;
      alert("Select Cover Type");
    } else if (this.state.required_cover === "") {
      checkData = false;
      alert("Select Sum Insured");
    } else if (this.state.policy_type === "") {
      checkData = false;
      alert("Select Policy Type");
    } else if (this.state.policy_type === "Top up" && this.state.deductible === "") {
      checkData = false;
      alert("Select Deductible");
    } else if (this.state.age === "") {
      checkData = false;
      alert("Age empty");
    } else if (Number(this.state.age) ===  0) {
      checkData = false;
      alert("Enter age greater than 0");
    }

    if (checkData) {
      if (disableClick === 0) {
        this.setState({ progressLoader: true, disableClick: 1 }, () => {
          this.forceUpdate();
        });
        const { refercode } = this.userData;
        formData.append("ref", refercode);
        formData.append("frommobile", "frommobile");
        const parse = Number(this.state.age);
        const date = new Date();
        const dates = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        const months = date.getMonth() < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1;
        const fullDob = `${dates}-${months}-${date.getFullYear()-parse}`;
        formData.append("dob", fullDob);

        let parseJs = JSON.parse(JSON.stringify(this.state));
        Object.entries(parseJs).forEach(([key, value]) => {
          if (Helper.arrayObjCheck(value, true)) {
            if (key === "deductible") {
              formData.append(key, `${value}00000`);
            }else if (key === "required_cover") {
              formData.append(key, `${String(value).replace('.', '')}00000`);
            } else {
              formData.append(key, value);
            }
          }
        });

        const formUrls = `${Pref.FinorbitFormUrl}health_insurance.php`;

        //console.log("formData", formData, formUrls);

        Helper.networkHelperTokenContentType(
          formUrls,
          formData,
          Pref.methodPost,
          this.token,
          (result) => {
            const { response_header } = result;
            const { res_type,res } = response_header;
            if (res_type === "success") {             
              if (Helper.nullCheck(res.id) === false && res.id !== "") {
                const { id, deductible } = res;
                //console.log('res', res)
                const cov = Number(this.state.required_cover);
                const formData = new FormData();
                formData.append('id', id);
                formData.append('sum_insured', cov);  
                console.log(formData);
                Helper.networkHelperContentType(
                  this.state.policy_type !== 'Top Up'  ? Pref.HealthQuickQouteCompanyUrl : Pref.HealthQuickTopupQouteCompanyUrl,
                  formData,
                  Pref.methodPost,
                  (result) => {
                    console.log('result', result);
                    const {type, company} = result;
                    this.props.close();
                    this.setState({ progressLoader: false });
                    Helper.showToastMessage(
                      editMode === false
                        ? "Form submitted successfully"
                        : "Form updated successfully",
                      1
                    );
                    let list = [];
                    if (type === 'success') {
                      if (company.length > 0) {
                        list = company.map((e, index) => {
                          const sp = e.split('$&');
                          return {
                            companyid: sp[0],
                            name: sp[1],
                            og: e,
                            id: index + 1,
                            select: index < 3 ? true : false,
                          };
                        });
                      }
                    }
                    this.navigateQuotes(Number(deductible),id, cov, list);
                  },
                  (error) => {
                    this.props.close();
                    this.setState({ progressLoader: false });
                    Helper.showToastMessage(
                      editMode === false
                        ? "Form submitted successfully"
                        : "Form updated successfully",
                      1
                    );
                    this.navigateQuotes(Number(deductible),id, cov, list);
                  },
                );
              }else{
                this.props.close();
                this.setState({ progressLoader: false });
                Helper.showToastMessage(
                  editMode === false
                    ? "Form submitted successfully"
                    : "Form updated successfully",
                  1
                );
              }
            } else {
              this.props.close();
              this.setState({ progressLoader: false });
              Helper.showToastMessage("Failed to submit form", 0);
            }
          },
          (e) => {
            console.log(e);
            this.props.close();
            this.setState({ progressLoader: false });
            Helper.showToastMessage("Something went wrong", 0);
          }
        );
      }
    }
  };

  navigateQuotes = (deductible, formId, sumInsurred, companyList = []) => {
    if (companyList.length === 0) {
      Helper.showToastMessage('Failed to find quote', 0);
      return false;
    }
    const map = Lodash.filter(companyList, {select: true});
    let finalUrl = '';
    let startUrl = '';
    if (map.length === 1) {
      const compId = `${map[0]['companyid']}`;
      if(deductible > 0){
        startUrl = `${Pref.FinURL}download_quoted1_wu.php`;
      }else{
        startUrl = `${Pref.FinURL}download_quote1_wu.php`;     
      }
      finalUrl = `${startUrl}?id=${formId}&product_id=${compId}&sum_insured=${sumInsurred}`;
    } else if (map.length === 2) {
      const compId = `${map[0]['companyid']}$$${map[1]['companyid']}`;
      if(deductible > 0){
        startUrl = `${Pref.FinURL}download_quoted2_wu.php`;
      }else{
        startUrl = `${Pref.FinURL}download_quote2_wu.php`;     
      }
      finalUrl = `${startUrl}?id=${formId}&product_id=${compId}&sum_insured=${sumInsurred}`;
    } else if (map.length === 3) {
      const compId = `${map[0]['companyid']}$$${map[1]['companyid']}$$${map[2]['companyid']}`;
      if(deductible > 0){
        startUrl = `${Pref.FinURL}download_quoted3_wu.php`;
      }else{
        startUrl = `${Pref.FinURL}download_quote3_wu.php`;     
      }
      finalUrl = `${startUrl}?id=${formId}&product_id=${compId}&sum_insured=${sumInsurred}`;
    }
    //console.log('finalUrl', finalUrl)
    NavigationActions.navigate("GetQuotesView", {
      editmode: false,
      url: finalUrl,
      company: [],
      formId: formId,
      sumInsurred: sumInsurred,
      deductible: deductible,
    });
  };

  btnText = () => {
    return "Submit";
  };

  renderFirstPart = () => {
    return (
      <View>
        <Loader
          isShow={this.state.progressLoader}
          bottomText={"Please do not press back button"}
        />

        <AnimatedInputBox
          onChangeText={(value) => {
            if (String(value).match(/^[a-z, A-Z]*$/g) !== null) {
              this.setState({ name: value });
            }
          }}
          value={this.state.name}
          showStarVisible
          placeholder={this.state.quickQuotes ? `Full Name` : `Owner Name`}
          returnKeyType={"next"}
          changecolor
          containerstyle={styles.animatedInputCont}
        />

        <AnimatedInputBox
          placeholder={`Mobile Number`}
          changecolor
          showStarVisible
          containerstyle={styles.animatedInputCont}
          maxLength={10}
          keyboardType={"number-pad"}
          onChangeText={(value) => {
            if (String(value).match(/^[0-9]*$/g) !== null) {
              this.setState({ mobile: value });
            }
          }}
          value={this.state.mobile}
          editable={this.state.dialerMobile ? false : true}
          disabled={this.state.dialerMobile ? true : false}
          returnKeyType={"next"}
        />

        <NewDropDown
          list={combinationList}
          starVisible
          placeholder={"Select Cover Type"}
          value={this.state.combination_type}
          selectedItem={(value) => {
            let child = '';
            let adult = '';
            let claimType = value === '1 Adult' ? 'Single' : 'Family Floater';
            if(value === '1 Adult'){
              child = ``
              adult = '';
            }else{
              const split = value.split(/\s/g);
              adult = claimType !== 'Single' ? `${Helper.nullStringCheckWithReturn(split[0])} ${Helper.nullStringCheckWithReturn(split[1])}` : '';
              child = claimType !== 'Single' ? `${Helper.nullStringCheckWithReturn(split[2])} ${Helper.nullStringCheckWithReturn(split[3])}` : ''
            }
            //console.log(claimType, adult, child)
            this.setState({
              combination_type:value,
              claim_type:claimType,
              family_floater_child:child ,
              family_floater_adult: adult
            });
          }}
          style={{
            borderRadius: 0,
            borderBottomColor: "#f2f1e6",
            borderBottomWidth: 1.3,
            borderWidth: 0,
            marginStart: 10,
            marginEnd: 10,
            paddingVertical: 10,
          }}
          textStyle={{
            color: "#6d6a57",
            fontSize: 14,
            fontFamily: Pref.getFontName(4),
          }}
        />

        <NewDropDown
          list={healthRequiredCover}
          placeholder={"Sum Insured (Amount in Lacs)"}
          starVisible={true}
          value={this.state.required_cover}
          selectedItem={(value) => this.setState({ required_cover: value })}
          style={styles.newdropdowncontainers}
          textStyle={styles.newdropdowntextstyle}
        />

        <NewDropDown
          list={policyTypeList}
          placeholder={"Policy Type"}
          starVisible={true}
          value={this.state.policy_type}
          selectedItem={(value) => this.setState({ policy_type: value })}
          style={styles.newdropdowncontainers}
          textStyle={styles.newdropdowntextstyle}
        />

        {this.state.policy_type === "Top Up" ? (
          <NewDropDown
            list={deductibleList}
            placeholder={"Deductible"}
            starVisible={true}
            value={this.state.deductible}
            selectedItem={(value) => this.setState({ deductible: value })}
            style={styles.newdropdowncontainers}
            textStyle={styles.newdropdowntextstyle}
          />
        ) : null}

        <AnimatedInputBox
          placeholder={`Age of ${this.state.combination_type !== '1 Adult' && this.state.combination_type !== '' ? 'the Eldest' : ''} Person`}
          changecolor
          showStarVisible
          containerstyle={styles.animatedInputCont}
          onChangeText={(value) => {
            if (String(value).match(/^[0-9]*$/g) !== null) {
              this.setState({ age: value });
            }
          }}
          keyboardType={"number-pad"}
          maxLength={2}
          value={this.state.age}
          returnKeyType={"next"}
        />
      </View>
    );
  };

  render() {
    return (
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View>
          <Title style={styles.passText}>{`Health Insurance`}</Title>
          <TouchableWithoutFeedback onPress={() => this.props.close()}>
            <View style={{ position: "absolute", right: 16, top: 16 }}>
              <IconChooser name={"x"} size={24} />
            </View>
          </TouchableWithoutFeedback>
          <View styleName="md-gutter">{this.renderFirstPart()}</View>

          <View
            styleName={
              this.state.currentPosition > 0
                ? `horizontal space-between md-gutter`
                : `horizontal space-between md-gutter v-end h-end`
            }
          >
            <Button
              mode={"flat"}
              uppercase={false}
              dark={true}
              loading={false}
              style={styles.loginButtonStyle}
              onPress={() => this.formSubmit(false)}
            >
              <Title style={styles.btntext}>{this.btnText()}</Title>
            </Button>
          </View>
        </View>
      </ScrollView>
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
    borderBottomColor: "#f2f1e6",
    alignContent: "center",
  },
  dropdownnewtext: {
    color: "#6d6a57",
    fontSize: 14,
    fontFamily: Pref.getFontName(4),
  },
  dropdownnewcontainer: {
    borderRadius: 0,
    borderBottomColor: "#f2f1e6",
    borderBottomWidth: 1.3,
    borderWidth: 0,
    marginStart: 10,
    marginEnd: 10,
    paddingVertical: 10,
  },
  newdropdowntextstyle: {
    color: "#6d6a57",
    fontSize: 14,
    fontFamily: Pref.getFontName(4),
  },
  newdropdowncontainers: {
    borderRadius: 0,
    borderBottomColor: "#f2f1e6",
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
    borderBottomColor: "#f2f1e6",
    alignContent: "center",
  },
  radiocont1: {
    marginStart: 10,
    marginEnd: 10,
    alignContent: "center",
  },
  animatedInputCont: {
    marginStart: 10,
    marginEnd: 10,
    //paddingVertical: 10,
  },
  line: {
    marginStart: 10,
    marginEnd: 10,
    borderBottomWidth: 1.3,
    borderBottomColor: "#f2f1e6",
    alignContent: "center",
    marginTop: 4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Rubik",
    fontFamily: "bold",
    letterSpacing: 1,
    color: "#6d6a57",
    alignSelf: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6d6a57",
    lineHeight: 20,
    alignSelf: "center",
    marginStart: 4,
  },
  inputStyle: {
    height: sizeHeight(7.5),
    backgroundColor: "white",
    color: "#6d6a57",
    borderBottomColor: Colors.grey300,
    fontFamily: "Rubik",
    fontSize: 16,
    borderBottomWidth: 0.6,
    fontWeight: "400",
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
  },
  loginButtonStyle: {
    height: 40,
    color: "white",
    marginHorizontal: sizeWidth(3),
    marginVertical: sizeHeight(3.5),
    backgroundColor: "#e61e25",
    textAlign: "center",
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 1,
  },
  dropdownbox: {
    flexDirection: "row",
    height: 56,
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  radiodownbox: {
    flexDirection: "column",
    height: 56,
    justifyContent: "space-between",
    paddingVertical: 10,
    marginBottom: 16,
  },
  boxsubtitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6d6a57",
    lineHeight: 20,
    alignSelf: "center",
    marginStart: 4,
  },
  textopen: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555555",
    lineHeight: 20,
    alignSelf: "center",
    marginStart: 4,
    letterSpacing: 0.5,
  },
  bbstyle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6d6a57",
    lineHeight: 20,
    marginStart: 4,
  },
  downIcon: {
    alignSelf: "center",
  },
  textstyle12: {
    fontSize: 14,
    fontWeight: "700",
    color: Pref.RED,
    lineHeight: 20,
    marginStart: 8,
    paddingVertical: 8,
    marginVertical: 4,
  },
  dropdowntextstyle: {
    color: "#6d6a57",
    fontSize: 14,
    fontFamily: Pref.getFontName(4),
  },
  dropdownmulticontainer: {
    borderRadius: 0,
    borderBottomColor: "#f2f1e6",
    borderBottomWidth: 1.3,
    borderWidth: 0,
    marginStart: 10,
    marginEnd: 10,
    paddingVertical: 10,
  },
  loader: {
    justifyContent: "center",
    alignSelf: "center",
    flex: 1,
    marginVertical: 48,
    paddingVertical: 48,
  },

  passText: {
    fontSize: 20,
    letterSpacing: 0.5,
    color: Pref.RED,
    fontWeight: "700",
    lineHeight: 36,
    alignSelf: "center",
    justifyContent: "center",
    textAlign: "center",
    paddingVertical: 16,
  },
  inputStyle: {
    height: sizeHeight(8),
    backgroundColor: "white",
    color: "#292929",
    borderBottomColor: "#dedede",
    fontFamily: "Rubik",
    fontSize: 16,
    borderBottomWidth: 1,
    fontWeight: "400",
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
  },
  inputPassStyle: {
    height: sizeHeight(8),
    backgroundColor: "white",
    color: "#292929",
    borderBottomColor: "#dedede",
    fontFamily: "Rubik",
    fontSize: 16,
    borderBottomWidth: 1,
    fontWeight: "400",
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
    marginVertical: sizeHeight(1),
  },
  inputPass1Style: {
    height: sizeHeight(8),
    backgroundColor: "white",
    color: "#292929",
    fontFamily: "Rubik",
    fontSize: 16,
    fontWeight: "400",
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
    marginTop: -7,
  },
  loginButtonStyle: {
    height: 48,
    color: "white",
    backgroundColor: Pref.RED,
    textAlign: "center",
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 0.5,
    borderRadius: 48,
    width: "40%",
    fontWeight: "700",
  },
  btntext: {
    color: "white",
    fontSize: 15,
    letterSpacing: 0.5,
    fontWeight: "700",
    fontFamily: Pref.getFontName(4),
  },
  downIcon: {
    alignSelf: "center",
  },
});
