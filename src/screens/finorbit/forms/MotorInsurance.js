import React from "react";
import {
  StyleSheet,
  BackHandler,
  TouchableWithoutFeedback,
  Linking,
} from "react-native";
import { Title, View } from "@shoutem/ui";
import * as Helper from "../../../util/Helper";
import * as Pref from "../../../util/Pref";
import { Colors, Button } from "react-native-paper";
import { sizeHeight, sizeWidth } from "../../../util/Size";
import Lodash from "lodash";
import AnimatedInputBox from "../../component/AnimatedInputBox";
import NewDropDown from "../../component/NewDropDown";
import CScreen from "../../component/CScreen";
import Loader from "../../../util/Loader";
import LeftHeaders from "../../common/CommonLeftHeader";
import FileUploadForm from "../FileUploadForm";
import Icon from "react-native-vector-icons/Feather";
import {
  motorFirstFormCheck,
  motorSecondFormCheck,
  tmpFirstFormCheck,
  tmpSecondFormCheck,
} from "../../../util/FormCheckHelper";
import NavigationActions from "../../../util/NavigationActions";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

let healthRequiredCover = [
  { value: `0`, name: "0" },
  { value: `20`, name: "20" },
  { value: `25`, name: "25" },
  { value: `35`, name: "35" },
  { value: `45`, name: "45" },
  { value: `50`, name: "50" },
];

let floaterList = [
  { value: "Individual", name: "Individual" },
  { value: "Company", name: "Company" },
];

let claimRecentList = [
  { value: "Yes", name: "Yes" },
  { value: "No", name: "No" },
];

let vehicleType = [
  { value: "Two Wheeler", name: "Two Wheeler" },
  { value: "Four Wheeler", name: "Four Wheeler" },
  { value: "Commercial", name: "Commercial" },
];

let motorTypesOfInsurance = [
  {
    value: "Third-Party",
  },
  {
    value: "Comprehensive",
  },
  {
    value: "Own Damage",
  },
];

export default class MotorInsurance extends React.PureComponent {
  constructor(props) {
    super(props);
    this.backClick = this.backClick.bind(this);
    this.fileState = null;
    this.fileUploadFormRef = React.createRef();
    this.token = "";
    this.userData = null;
    this.storeState = null;
    const date = new Date();
    this.state = {
      rcCopy: null,
      currentDate: date,
      maxDate: date,
      showCalendar: false,
      currentPosition: 0,
      scrollReset: false,
      editMode: false,
      disableClick: 0,
      name: "",
      reg_number: "",
      mobile: "",
      registration_type: "",
      claim_type: "",
      policy_expiry_type: "",
      noclaim_bonus_type: "",
      vehicle_type: "",
      insurance: "",
      addBenefit_type: "",
      vehicleloan_type: "",
      expiry_date: "Previous Policy Expiry Date *",
      sumAss: "",
      remark: "",
      apremium: "",
      formid: "",
      oldInsCopy: null,
      quickQuotes: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.backClick);
    const { navigation } = this.props;
    const quickQuotes = navigation.getParam("quickQuotes", false);
    console.log('quickQuotes', quickQuotes);
    const editMode = navigation.getParam("edit", false);
    const editLeadData = navigation.getParam("leadData", null);
    //dialer data
    const dialerName = navigation.getParam("dialerName", "");
    const dialerMobile = navigation.getParam("dialerMobile", "");
    const dialerEmail = navigation.getParam("dialerEmail", "");
    this.focusListener = navigation.addListener("didFocus", () => {
      Pref.getVal(Pref.saveToken, (value) => {
        this.token = value;
        Pref.getVal(Pref.userData, (userData) => {
          this.userData = userData;
          let state =
            editLeadData === null
              ? {
                  name: "",
                  reg_number: "",
                  mobile: "",
                  registration_type: "",
                  claim_type: "",
                  policy_expiry_type: "",
                  noclaim_bonus_type: "",
                  vehicle_type: "",
                  insurance: "",
                  addBenefit_type: "",
                  vehicleloan_type: "",
                  expiry_date: "Previous Policy Expiry Date *",
                  sumAss: "",
                  remark: "",
                  apremium: "",
                  formid: "",
                }
              : editLeadData;
          state.dialerEmail = dialerEmail;
          state.editMode = editMode;
          state.dialerName = dialerName;
          state.currentPosition = 0;
          state.dialerMobile = dialerMobile;
          state.quickQuotes = quickQuotes;
          this.storeState = state;
          this.setState(state);
        });
      });
    });
  }

  componentWillUnMount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backClick);
    if (this.focusListener !== undefined) this.focusListener.remove();
  }

  backClick = () => {
    const { editMode, dialerMobile } = this.state;
    if(this.state.quickQuotes){
      NavigationActions.navigate("Home");
      return true;
    }
    if (Helper.nullStringCheck(dialerMobile) === false) {
      return false;
    } else {
      if (editMode === true) {
        NavigationActions.navigate("LeadList");
        return true;
      } else {
        NavigationActions.goBack();
        return true;
      }
    }
  };

  backNav = (jumped = false, position = 0) => {
    this.storeState = this.state;
    if (this.state.currentPosition === 1) {
      this.fileState = JSON.parse(
        JSON.stringify(this.fileUploadFormRef.current.state)
      );
    }
    this.setState((prev) => {
      return {
        currentPosition: prev.currentPosition - 1,
        scrollReset: true,
        name: this.storeState != null ? this.storeState.name : "",
        mobile: this.storeState != null ? this.storeState.mobile : "",
        reg_number: this.storeState != null ? this.storeState.reg_number : "",
        registration_type:
          this.storeState != null ? this.storeState.registration_type : "",
        claim_type: this.storeState != null ? this.storeState.claim_type : "",
        policy_expiry_type:
          this.storeState != null ? this.storeState.policy_expiry_type : "",
        noclaim_bonus_type:
          this.storeState != null ? this.storeState.noclaim_bonus_type : "",
        vehicle_type:
          this.storeState != null ? this.storeState.vehicle_type : "",
      };
    });
  };

  /**
   * submit form
   */
  formSubmit = (jumped = false, position = 0) => {
    const { currentPosition, editMode, disableClick } = this.state;

    let checkData = true;
    let formData = new FormData();
    formData.append("motor_insurance", "motor_insurance");

    if (currentPosition === 0) {
      checkData = motorFirstFormCheck(this.state);
    } else if (currentPosition === 1 && this.state.quickQuotes === false) {
      checkData = motorSecondFormCheck(this.state);
    }

    if (checkData) {
      if (currentPosition == 0 && this.state.vehicle_type === "Commercial") {
        this.setState(
          (prevState) => {
            return {
              currentPosition: prevState.currentPosition + 1,
              scrollReset: true,
              insurance:
                this.storeState != null ? this.storeState.insurance : "",
              addBenefit_type:
                this.storeState != null ? this.storeState.addBenefit_type : "",
              vehicleloan_type:
                this.storeState != null ? this.storeState.vehicleloan_type : "",
              expiry_date:
                this.storeState != null
                  ? this.storeState.expiry_date
                  : "Previous Policy Expiry Date *",
            };
          },
          () => {
            this.storeState = this.state;
            if (
              this.fileUploadFormRef != null &&
              this.fileUploadFormRef.current
            ) {
              this.fileUploadFormRef.current.restoreData(this.fileState);
            }
          }
        );
      } else {
        if (disableClick === 0) {
          this.setState({ progressLoader: true, disableClick: 1 }, () => {
            this.forceUpdate();
          });
          const { refercode } = this.userData;
          formData.append("ref", refercode);
          formData.append("frommobile", "frommobile");

          delete this.state.date;
          delete this.state.maxDate;
          delete this.state.rcCopy;
          delete this.state.oldInsCopy;
          delete this.state.currentDate;

          let parseJs = JSON.parse(JSON.stringify(this.state));
          Object.entries(parseJs).forEach(([key, value]) => {
            if (Helper.arrayObjCheck(value, true)) {
              formData.append(key, value);
            }
          });

          if (currentPosition === 1 && this.state.quickQuotes === false) {
            this.fileState = JSON.parse(
              JSON.stringify(this.fileUploadFormRef.current.state)
            );

            let allfileslist = this.fileState.fileList;
            if (
              Helper.nullCheck(allfileslist) === false &&
              allfileslist.length > 0
            ) {
              const loops = Lodash.map(allfileslist, (ele) => {
                let parseJs = JSON.parse(JSON.stringify(ele));
                Object.entries(parseJs).forEach(([key, value]) => {
                  if (
                    Helper.arrayObjCheck(value, false) &&
                    (key === "oldinsurancecopy" || key === "rcbookcopy")
                  ) {
                    let val = value;
                    if(value === 'Previous Policy Expiry Date *'){
                      val = value.replace('Previous Policy Expiry Date *', '');
                    }
                    formData.append(key, val);
                  }
                });
              });
            }
          }

          const formUrls = `${Pref.FinorbitFormUrl}motor_insurance.php`;

          console.log("formData", formData, formUrls);

          Helper.networkHelperTokenContentType(
            formUrls,
            formData,
            Pref.methodPost,
            this.token,
            (result) => {
              const { response_header } = result;
              const { res_type } = response_header;
              if (res_type === "success") {
                const {vehicle_type} = this.state;
                if (
                  vehicle_type === "Two Wheeler" ||
                  vehicle_type === "Four Wheeler"
                ) {
                  let client_id = "",
                    client_secret = "";
                  if (vehicle_type == "Two Wheeler") {
                    client_id = Pref.TWO_WHEELER_Client_ID;
                    client_secret = Pref.TWO_WHEELER_Client_Secret;
                  } else {
                    client_id = Pref.FOUR_WHEELER_Client_ID;
                    client_secret = Pref.FOUR_WHEELER_Client_Secret;
                  }

                  const body = {
                    clientId: client_id,
                    clientSecret: client_secret,
                    payload: {
                      registrationNo: this.state.reg_number,
                      policyIsExpired:
                        this.state.policy_expiry_type === "Yes" ? true : false,
                      policyExpiryDate: this.state.expiry_date,
                      previousClaimFlag: this.state.claim_type,
                      ownerType: this.state.registration_type,
                      ownerMobileNo: this.state.mobile,
                      ownerFullName: this.state.name,
                    },
                  };

                  //console.log("body", body);

                  Helper.networkHelper(
                    Pref.ASSURE_KIT_API,
                    JSON.stringify(body),
                    Pref.methodPost,
                    (result) => {
                      this.setState({ progressLoader: false });
                      //console.log(result);
                      const { url = "" } = result;
                      Helper.showToastMessage(
                        editMode === false
                          ? "Form submitted successfully"
                          : "Form updated successfully",
                        1
                      );
                      if (url !== "") {
                        this.finishForm();
                        Linking.openURL(url);
                      }
                    },
                    (error) => {
                      console.log(error, error);
                    }
                  );
                } else {
                  this.setState({ progressLoader: false });
                  Helper.showToastMessage(
                    editMode === false
                      ? "Form submitted successfully"
                      : "Form updated successfully",
                    1
                  );
                  this.finishForm();
                }
              } else {
                this.setState({ progressLoader: false });
                Helper.showToastMessage("Failed to submit form", 0);
              }
            },
            (e) => {
              console.log(e);
              this.setState({ progressLoader: false });
              Helper.showToastMessage("Something went wrong", 0);
            }
          );
        }
      }
    }
  };

  finishForm = () => {
    const { editMode } = this.state;
    let backScreenName = editMode === false ? "FinorbitScreen" : "LeadList";
    //for dialer screen

    if (Helper.nullStringCheck(this.state.dialerMobile) === false) {
      backScreenName = "DialerCalling";
    }

    //finish screen
    NavigationActions.navigate("Finish", {
      top: editMode === false ? "Add New Lead" : "Edit Lead",
      red: "Success",
      grey: editMode === false ? "Details uploaded" : "Details updated",
      blue: editMode === false ? "Add another lead?" : "Back to Lead Record",
      back: backScreenName,
    });
  };

  btnText = () => {
    const { currentPosition } = this.state;
    const btnText = currentPosition === 1 ? "Submit" : this.state.quickQuotes ? 'Submit' : "Next";
    return btnText;
  };

  renderFirstPart = () => {
    return (
      <View>
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

        <AnimatedInputBox
          placeholder={`Registration Number`}
          changecolor
          showStarVisible
          containerstyle={styles.animatedInputCont}
          onChangeText={(value) => this.setState({ reg_number: value })}
          value={this.state.reg_number}
          returnKeyType={"next"}
          keyboardType={"email"}
        />

        {!this.state.quickQuotes ? (
          <View>
            <NewDropDown
              list={floaterList}
              placeholder={"Owner Types"}
              starVisible
              value={this.state.registration_type}
              selectedItem={(value) =>
                this.setState({ registration_type: value })
              }
              style={styles.newdropdowncontainers}
              textStyle={styles.newdropdowntextstyle}
            />
            <NewDropDown
              list={claimRecentList}
              placeholder={"Any Claim Made Recently"}
              starVisible
              value={this.state.claim_type}
              selectedItem={(value) => this.setState({ claim_type: value })}
              style={styles.newdropdowncontainers}
              textStyle={styles.newdropdowntextstyle}
            />
            <NewDropDown
              list={claimRecentList}
              placeholder={"Policy Expiry"}
              starVisible
              value={this.state.policy_expiry_type}
              selectedItem={(value) =>
                this.setState({ policy_expiry_type: value })
              }
              style={styles.newdropdowncontainers}
              textStyle={styles.newdropdowntextstyle}
            />
            <NewDropDown
              list={healthRequiredCover}
              placeholder={"No Claim Bonus"}
              starVisible
              value={this.state.noclaim_bonus_type}
              selectedItem={(value) => {
                this.setState({ noclaim_bonus_type: value });
              }}
              style={styles.newdropdowncontainers}
              textStyle={styles.newdropdowntextstyle}
            />
            <NewDropDown
              list={vehicleType}
              placeholder={"Vehicle Types"}
              starVisible
              value={this.state.vehicle_type}
              selectedItem={(v) => this.setState({ vehicle_type: v })}
              style={styles.newdropdowncontainers}
              textStyle={styles.newdropdowntextstyle}
            />
          </View>
        ) : null}
      </View>
    );
  };

  onChange = (event, selectDate) => {
    const { type } = event;
    if (type === `set`) {
      this.setState({ currentDate: selectDate, showCalendar: false }, () => {
        const fullDate = moment(selectDate).format("DD-MM-YYYY");
        this.setState({ expiry_date: fullDate });
      });
    } else {
      this.setState({ showCalendar: false });
    }
  };

  renderSecondPart = () => {
    return (
      <View>
        <NewDropDown
          list={motorTypesOfInsurance}
          placeholder={"Policy Type"}
          starVisible
          value={this.state.insurance}
          selectedItem={(v) => this.setState({ insurance: v })}
          style={styles.newdropdowncontainers}
          textStyle={styles.newdropdowntextstyle}
        />

        <NewDropDown
          list={claimRecentList}
          placeholder={"Additional Benefits"}
          starVisible={false}
          value={this.state.addBenefit_type}
          selectedItem={(value) => this.setState({ addBenefit_type: value })}
          style={styles.newdropdowncontainers}
          textStyle={styles.newdropdowntextstyle}
        />

        <NewDropDown
          list={claimRecentList}
          placeholder={"Is your vehicle on loan"}
          starVisible={false}
          value={this.state.vehicleloan_type}
          selectedItem={(value) => this.setState({ vehicleloan_type: value })}
          style={styles.newdropdowncontainers}
          textStyle={styles.newdropdowntextstyle}
        />

        <View>
          <View style={styles.radiocont}>
            <TouchableWithoutFeedback
              onPress={() =>
                this.setState({
                  showCalendar: true,
                })
              }
            >
              <View style={styles.dropdownbox}>
                <Title
                  style={[
                    styles.boxsubtitle,
                    {
                      color:
                        this.state.expiry_date ===
                        "Previous Policy Expiry Date *"
                          ? `#6d6a57`
                          : `#555555`,
                    },
                  ]}
                >
                  {this.state.expiry_date}
                </Title>
                <Icon
                  name={"calendar"}
                  size={24}
                  color={"#6d6a57"}
                  style={styles.downIcon}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <FileUploadForm
          ref={this.fileUploadFormRef}
          title={"Motor Insurance"}
          headerchange={false}
          editItemRestore={this.state}
          rcCopy={this.state.rcCopy}
          oldInsCopy={this.state.oldInsCopy}
          editMode={this.state.editMode}
        />
      </View>
    );
  };

  render() {
    const { editMode } = this.state;
    return (
      <CScreen
        scrollreset={this.state.scrollReset}
        absolute={
          <>
            <Loader
              isShow={this.state.progressLoader}
              bottomText={"Please do not press back button"}
            />
          </>
        }
        body={
          <>
            <LeftHeaders
              backClicked={this.backClick}
              showBack
              title={!editMode ? `Add New Lead` : `Edit Lead`}
              bottomtext={
                <>
                  {`Motor `}
                  <Title style={styles.passText}>{`Insurance`}</Title>
                </>
              }
              bottomtextStyle={{
                color: "#000",
                fontSize: 20,
              }}
            />
            {/* <StepIndicator
              activeCounter={this.state.currentPosition}
              stepCount={2}
              positionClicked={(pos) => {
                // const {currentPosition} = this.state;
                // if(pos > currentPosition){
                //   this.formSubmit(true, pos);
                // }else{
                //   this.backNav(true, pos);
                // }
              }}
            /> */}

            <View styleName="md-gutter">
              {this.state.currentPosition === 0
                ? this.renderFirstPart()
                : this.state.currentPosition === 1
                ? this.renderSecondPart()
                : null}
            </View>

            <View
              styleName={
                this.state.currentPosition > 0
                  ? `horizontal space-between md-gutter`
                  : `horizontal space-between md-gutter v-end h-end`
              }
            >
              {this.state.currentPosition > 0 ? (
                <Button
                  mode={"flat"}
                  uppercase={true}
                  dark={true}
                  loading={false}
                  style={[
                    styles.loginButtonStyle,
                    {
                      backgroundColor: "transparent",
                      borderColor: "#dedede",
                      borderWidth: 1.3,
                    },
                  ]}
                  onPress={() => this.backNav(false)}
                >
                  <Title
                    style={StyleSheet.flatten([
                      styles.btntext,
                      {
                        color: Pref.RED,
                      },
                    ])}
                  >
                    {"Back"}
                  </Title>
                </Button>
              ) : null}
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

            {this.state.showCalendar ? (
              <DateTimePicker
                value={this.state.currentDate}
                mode={"date"}
                is24Hour={false}
                display={"spinner"}
                onChange={this.onChange}
                maximumDate={this.state.maxDate}
              />
            ) : null}
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
