import React from "react";
import {
  StyleSheet,
} from "react-native";
import {
  Title,
  View,
} from "@shoutem/ui";
import * as Helper from "../../util/Helper";
import * as Pref from "../../util/Pref";
import {
  Button,
} from "react-native-paper";
import NavigationActions from "../../util/NavigationActions";
import { sizeHeight, sizeWidth } from "../../util/Size";
import CommonForm from "./CommonForm";
import SpecificForm from "./SpecificForm";
import FileUploadForm from "./FileUploadForm";
//import StepIndicator from 'react-native-step-indicator';
import ApptForm from "./ApptForm";
import Lodash from "lodash";
import Loader from "../../util/Loader";
import LeftHeaders from "../common/CommonLeftHeader";
import CScreen from "../component/CScreen";
import StepIndicator from "../component/StepIndicator";

// const customStyles = {
//   stepIndicatorSize: 25,
//   currentStepIndicatorSize: 30,
//   separatorStrokeWidth: 2,
//   currentStepStrokeWidth: 3,
//   stepStrokeCurrentColor: Pref.RED,
//   stepStrokeWidth: 3,
//   stepStrokeFinishedColor: Pref.RED,
//   stepStrokeUnFinishedColor: Colors.grey300,
//   separatorFinishedColor: '#02c26a',
//   separatorUnFinishedColor: Colors.grey300,
//   stepIndicatorFinishedColor: Pref.RED,
//   stepIndicatorUnFinishedColor: Pref.WHITE,
//   stepIndicatorCurrentColor: Pref.WHITE,
//   stepIndicatorLabelFontSize: 13,
//   currentStepIndicatorLabelFontSize: 13,
//   stepIndicatorLabelCurrentColor: Pref.RED,
//   stepIndicatorLabelFinishedColor: Pref.WHITE,
//   stepIndicatorLabelUnFinishedColor: '#aaaaaa',
//   labelColor: '#292929',
//   labelSize: 12,
//   currentStepLabelColor: Pref.RED,
// };

export default class FinorbitForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.submitt = this.submitt.bind(this);
    this.commonFormRef = React.createRef();
    this.specificFormRef = React.createRef();
    this.FileUploadFormRef = React.createRef();
    this.ApptFormRef = React.createRef();
    //this.backClick = this.backClick.bind(this);
    this.restoreList = [];
    this.state = {
      loading: false,
      progressLoader: false,
      currentPosition: 0,
      bottontext: "Next",
      dataArray: [],
      userData: {},
      appliedref: "",
      refcode: "",
      bannerList: [],
      token: "",
      userData: "",
      title: "",
      scrollReset: false
    };
  }

  componentDidMount() {
    //BackHandler.addEventListener("hardwareBackPress", this.backClick);
    const { navigation } = this.props;
    const url = navigation.getParam("url", "");
    const title = navigation.getParam("title", "");
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.saveToken, (value) => {
        //console.log('token', value);
        this.setState({ token: value }, () => {
          Pref.getVal(Pref.userData, (userData) => {
            this.setState({
              userData: userData,
              imageUrl: url,
              title: title,
              isMounted: true,
              currentPosition: 0,
            });
          });
        });
      });
    });
  }

  backClick = () => {
    NavigationActions.navigate("FinorbitScreen");
    return true;
  };

  componentWillUnMount() {
    // BackHandler.removeEventListener("hardwareBackPress", this.backClick);
    if (this.focusListener !== undefined) this.focusListener.remove();
  }

  onPageChange(position) {
    this.setState({
      currentPosition: position,
      bottontext: position === 3 ? "Submit" : "Next",
    });
    this.insertData(this.state.currentPosition, false);
  }

  submitt = () => {
    const { currentPosition } = this.state;
    this.insertData(currentPosition, true);
  };

  backNav = () => {
    const { currentPosition } = this.state;
    if (currentPosition === 0) {
      this.setState({ scrollReset: true })
      return false;
    }
    this.setState((prev) => {
      return {
        currentPosition: prev.currentPosition - 1,
        bottontext: "Next",
        scrollReset: true
      };
    }, () => {
      if (this.state.currentPosition === 0) {
        this.commonFormRef.current.restoreData(this.restoreList[0]);
      } else if (this.state.currentPosition === 1) {
        this.specificFormRef.current.restoreData(this.restoreList[1]);
      } else if (this.state.currentPosition === 2) {
        this.FileUploadFormRef.current.restoreData(this.restoreList[2]);
      } else if (this.state.currentPosition === 3) {
        this.ApptFormRef.current.restoreData(this.restoreList[3]);
      }
    });
  };

  insertData(currentPosition, mode) {
    const { title } = this.state;
    let commons = null;
    console.log("title", title);
    if (currentPosition === 0) {
      commons = JSON.parse(JSON.stringify(this.commonFormRef.current.state));
      this.restoreList[0] = commons;
      delete commons.genderList;
      delete commons.employList;
      delete commons.cityList;
      delete commons.showCityList;
      delete commons.showGenderList;
      delete commons.showCalendar;
      delete commons.showEmployList;
      delete commons.currentDate;
      delete commons.maxDate;
    } else if (currentPosition === 1) {
      commons = JSON.parse(JSON.stringify(this.specificFormRef.current.state));
      this.restoreList[1] = commons;
      delete commons.cityList;
      delete commons.showCarList;
      delete commons.showExisitingList;
      delete commons.showCalendar;
      delete commons.showLoanCityList;
      delete commons.motorInsList;
      delete commons.exisitingList;
      delete commons.employList;
      delete commons.carList;
      delete commons.termInsList;
      delete commons.showmotorInsList;
      delete commons.showtermInsList;
      delete commons.healthFList;
      delete commons.showHealthFlist;
      delete commons.maritalList;
      delete commons.showmaritalList;
      delete commons.showCompanyCityList;
      delete commons.currentDate;
      delete commons.maxDate;
      delete commons.vectorInsuList;
      delete commons.showvectorInsuList;
      delete commons.vectorCoverList;
      delete commons.showvectorCoverList;
      if (title !== "Health Insurance") {
        delete commons.floaterItemList;
      }
      delete commons.vectorTypeIns;
      delete commons.showItemCalendar;
      console.log("d", commons);
    } else if (currentPosition === 2) {
      commons = JSON.parse(
        JSON.stringify(this.FileUploadFormRef.current.state)
      );
      this.restoreList[2] = commons;
    } else if (currentPosition === 3) {
      commons = JSON.parse(JSON.stringify(this.ApptFormRef.current.state));
      this.restoreList[3] = commons;
      delete commons.showCalendar;
      delete commons.showdatesx;
      delete commons.mode;
      delete commons.currentTime;
      delete commons.currentDate;
      delete commons.intervaltime;
    }
    let result = false;
    if (commons !== null) {
      this.state.dataArray[currentPosition] = commons;
      result = true;
    }

    if (mode && result) {
      const commonForms = this.state.dataArray[0];
      const specificForms = this.state.dataArray[1];
      const fileListForms = this.state.dataArray[2];
      const dateForm = this.state.dataArray[3];

      let checkData = true;
      let formData = new FormData();
      let uniq = "";
      if (title.includes(" ")) {
        uniq = title.trim().toLowerCase().replace(" ", "_");
      }
      if (title === `Life Cum Invt. Plan`) {
        uniq = "life_cum_investment";
      }
      //console.log(`uniq`, uniq, title);
      formData.append(uniq, uniq);

      if (commonForms !== undefined) {
        if (commonForms.name === "") {
          checkData = false;
          Helper.showToastMessage("Full Name empty", 0);
        } else if (commonForms.mobile === "") {
          checkData = false;
          Helper.showToastMessage("Mobile Number empty", 0);
        } else if (commonForms.mobile.match(/^[0-9]*$/g) === null) {
          checkData = false;
          Helper.showToastMessage("Invalid mobile number", 0);
        } else if (
          title !== "Term Insurance" &&
          title !== "Health Insurance" &&
          title !== "Fixed Deposit" &&
          //title !== `Life Cum Invt. Plan` &&
          //title !== `Motor Insurance` &&
          title !== `Mutual Fund` &&
          title !== `Vector Plus` &&
          title !== `Home Loan` &&
          title !== `Loan Against Property` &&
          title !== `Personal Loan` &&
          title !== `Business Loan` &&
          title !== `Auto Loan` &&
          commonForms.email === ""
        ) {
          checkData = false;
          Helper.showToastMessage("Email empty", 0);
        } else if (
          (title === "Term Insurance" ||
            title === "Health Insurance") &&
          commonForms.qualification === ""
        ) {
          checkData = false;
          Helper.showToastMessage("Qualification empty", 0);
        } else if (
          title !== "Fixed Deposit" &&
          title !== `Mutual Fund` &&
          title !== `Home Loan` &&
          title !== `Loan Against Property` &&
          title !== `Personal Loan` &&
          title !== `Business Loan` &&
          title !== `Auto Loan` &&
          (commonForms.dob === "" || commonForms.dob === `Date of Birth *` || commonForms.dob === `Date of Birth`)
        ) {
          checkData = false;
          Helper.showToastMessage("Date of Birth empty", 0);
        } else if (
          title !== `Personal Loan` &&
          title !== `Loan Against Property` &&
          title !== `Home Loan` &&
          title !== `Business Loan` &&
          title !== `Auto Loan` &&
          title !== `Motor Insurance` &&
          title !== `Insure Check` &&
          commonForms.gender === ""
        ) {
          checkData = false;
          Helper.showToastMessage("Please, Select Gender", 0);
        } else if (
          title !== `Personal Loan` &&
          title !== "Fixed Deposit" &&
          title !== "Business Loan" &&
          title !== `Motor Insurance` &&
          title !== `Mutual Fund` &&
          title !== `Vector Plus` &&
          title !== `Home Loan` &&
          title !== `Loan Against Property` &&
          title !== `Auto Loan` &&
          title !== `Life Cum Invt. Plan` &&
          title !== `Insure Check` &&
          commonForms.employ === ""
        ) {
          checkData = false;
          Helper.showToastMessage("Please, Select Employment Type", 0);
        } else if (
          title !== `Personal Loan` &&
          title !== `Home Loan` &&
          title !== `Loan Against Property` &&
          title !== `Business Loan` &&
          title !== `Auto Loan` &&
          //title !== `Motor Insurance` &&
          commonForms.currentlocation === ""
        ) {
          checkData = false;
          Helper.showToastMessage("Please, Select Current Location", 0);
        } else if (
          Number(commonForms.mobile.length) < 10 ||
          commonForms.mobile === "9876543210" ||
          commons.mobile === "1234567890"
        ) {
          checkData = false;
          Helper.showToastMessage("Invalid mobile number", 0);
        } else if (
          commonForms.email !== "" &&
          !commonForms.email.includes("@")
        ) {
          checkData = false;
          Helper.showToastMessage("Invalid Email", 0);
        } else if (commonForms.pincode !== "" && commonForms.pincode < 6) {
          checkData = false;
          Helper.showToastMessage("Invalid Pincode", 0);
        } else {
          let parseJs = JSON.parse(JSON.stringify(commonForms));
          if (parseJs.currentlocation === "Select Current Location *") {
            parseJs.currentlocation === "";
          }
          for (var key in parseJs) {
            const value = parseJs[key];
            if (value !== undefined) {
              if (Array.isArray(value) === false) {
                formData.append(key, parseJs[key]);
              }
            }
          }
        }
      }

      if (specificForms !== undefined) {
        if (
          title !== `Personal Loan` &&
          title !== `Loan Against Property` &&
          title !== `Home Loan` &&
          title !== "Credit Card" &&
          title !== "Health Insurance" &&
          title !== "Life Cum Invt. Plan" &&
          title !== `Motor Insurance` &&
          title !== `Vector Plus` &&
          title !== `Business Loan` &&
          title !== `Auto Loan` &&
          specificForms.amount === ``
        ) {
          checkData = false;
          Helper.showToastMessage(
            title === "Term Insurance"
              ? "Required Cover *"
              : title === "Home Loan" ||
                title === "Loan Against Property" ||
                title === `Personal Loan` ||
                title === `Business Loan`
                ? `Desired Amount empty`
                : `Investment Amount empty`,
            0
          );
        } else if (
          title !== `Personal Loan` &&
          title !== `Loan Against Property` &&
          title !== `Home Loan` &&
          title !== "Health Insurance" &&
          title !== "Fixed Deposit" &&
          title !== "Life Cum Invt. Plan" &&
          title !== `Motor Insurance` &&
          title !== `Mutual Fund` &&
          title !== `Term Insurance` &&
          title !== `Vector Plus` &&
          title !== `Business Loan` &&
          title !== `Auto Loan` &&
          specificForms.existingcard === ``
        ) {
          checkData = false;
          Helper.showToastMessage("Select Existing Card/Loan", 0);
        } else if (title === 'Home Loan' &&
          (specificForms.loan_property_city === "" ||
            specificForms.loan_property_city ===
            `Select Loan Property City *`)) {
          checkData = false;
          Helper.showToastMessage("Select Loan Property City", 0);
        } else {
          if (title === "Life Cum Invt. Plan") {
            if (specificForms.investment_amount === "") {
              checkData = false;
              Helper.showToastMessage("Investment Amount empty", 0);
            } else {
              if (
                specificForms.pancardNo !== "" &&
                !Helper.checkPanCard(specificForms.pancardNo)
              ) {
                checkData = false;
                Helper.showToastMessage("Invalid pan card number", 0);
              } else {
                let parseJs = JSON.parse(JSON.stringify(specificForms));
                for (var key in parseJs) {
                  if (key !== "floaterItemList") {
                    const value = parseJs[key];
                    if (value !== undefined) {
                      if (Array.isArray(value) === false) {
                        formData.append(key, parseJs[key]);
                      }
                    }
                  }
                }
              }
            }
          } else if (title === "Motor Insurance") {
            if (specificForms.claim_type === "") {
              checkData = false;
              Helper.showToastMessage("Please, Select Any Claim Last Year", 0);
            } else if (specificForms.car_type === "") {
              checkData = false;
              Helper.showToastMessage("Please, Select Car Type", 0);
            } else if (
              specificForms.insurance === `` ||
              specificForms.insurance === `Select Insurance Type *`
            ) {
              checkData = false;
              Helper.showToastMessage("Please, Select Insurance Type", 0);
            } else {
              if (
                specificForms.pancardNo !== "" &&
                !Helper.checkPanCard(specificForms.pancardNo)
              ) {
                checkData = false;
                Helper.showToastMessage("Invalid pan card number", 0);
              } else {
                let parseJs = JSON.parse(JSON.stringify(specificForms));
                for (var key in parseJs) {
                  if (key !== "floaterItemList") {
                    const value = parseJs[key];
                    if (value !== undefined) {
                      if (Array.isArray(value) === false) {
                        formData.append(key, parseJs[key]);
                      }
                    }
                  }
                }
              }
            }
          } else if (title === "Vector Plus") {
            //required_cover
            if (
              specificForms.claim_type === `` ||
              specificForms.claim_type === `Select Insurance Type *`
            ) {
              checkData = false;
              Helper.showToastMessage("Select Insurance Type", 0);
            } else if (specificForms.required_cover === "") {
              checkData = false;
              Helper.showToastMessage("Select Required Cover", 0);
            } else {
              if (
                specificForms.pancardNo !== "" &&
                !Helper.checkPanCard(specificForms.pancardNo)
              ) {
                checkData = false;
                Helper.showToastMessage("Invalid pan card number", 0);
              } else {
                let parseJs = JSON.parse(JSON.stringify(specificForms));
                for (var key in parseJs) {
                  if (key !== "floaterItemList") {
                    const value = parseJs[key];
                    if (value !== undefined) {
                      if (Array.isArray(value) === false) {
                        formData.append(key, parseJs[key]);
                      }
                    }
                  }
                }
              }
            }
          } else if (title === "Auto Loan") {
            if (title !== `Auto Loan` && specificForms.nooldcard === "") {
              checkData = false;
              Helper.showToastMessage("Select Type Of Car", 0);
            } else {
              if (
                specificForms.pancardNo !== "" &&
                !Helper.checkPanCard(specificForms.pancardNo)
              ) {
                checkData = false;
                Helper.showToastMessage("Invalid pan card number", 0);
              } else {
                let parseJs = JSON.parse(JSON.stringify(specificForms));
                for (var key in parseJs) {
                  if (key !== "floaterItemList") {
                    const value = parseJs[key];
                    if (value !== undefined) {
                      if (Array.isArray(value) === false) {
                        formData.append(key, parseJs[key]);
                      }
                    }
                  }
                }
              }
            }
          } else if (
            title === "Term Insurance" ||
            title === `Health Insurance`
          ) {
            if (specificForms.turnover === "") {
              checkData = false;
              Helper.showToastMessage("Annual TurnOver Empty", 0);
            } else if (
              title === `Health Insurance` &&
              specificForms.required_cover === ""
            ) {
              checkData = false;
              Helper.showToastMessage("Required Cover Empty", 0);
            } else if (
              title === `Term Insurance` &&
              specificForms.amount === ""
            ) {
              checkData = false;
              Helper.showToastMessage("Required Cover Empty", 0);
            } else if (
              title === `Term Insurance` &&
              specificForms.pay_type === ""
            ) {
              checkData = false;
              Helper.showToastMessage("Please, Select Pay Type", 0);
            } else if (
              title === `Term Insurance` &&
              specificForms.addons === ""
            ) {
              checkData = false;
              Helper.showToastMessage("Please, Select Addons Type", 0);
            } else if (
              title === `Term Insurance` &&
              specificForms.policy_term === ""
            ) {
              checkData = false;
              Helper.showToastMessage("Please, Select Policy Term", 0);
            } else if (specificForms.lifestyle === "") {
              checkData = false;
              Helper.showToastMessage("Select Lifestyle", 0);
            } else if (specificForms.lifestyle2 === "") {
              checkData = false;
              Helper.showToastMessage("Select Lifestyle", 0);
            } else if (specificForms.existing_diseases === "") {
              checkData = false;
              Helper.showToastMessage("Select Existing Disease", 0);
            } else if (
              title === `Term Insurance` && specificForms.existing_diseases === 'YES' &&
              specificForms.diseases === ""
            ) {
              checkData = false;
              Helper.showToastMessage("Please, Specify diseases", 0);
            } else if (
              title === `Term Insurance` && specificForms.payment_mode === '' &&
              specificForms.diseases === ""
            ) {
              checkData = false;
              Helper.showToastMessage("Please, Select Preferred Payment Mode", 0);
            } else if (
              title === `Health Insurance` &&
              specificForms.claim_type === ""
            ) {
              checkData = false;
              Helper.showToastMessage("Please, Select Type Of Insurance", 0);
            } else if (
              title === `Health Insurance` &&
              specificForms.claim_type === "Family Floater"
            ) {
              if (specificForms.family_floater === "") {
                checkData = false;
                Helper.showToastMessage("Please, Select Family Floater", 0);
              } else {
                if (
                  specificForms !== null &&
                  specificForms.floaterItemList !== undefined &&
                  specificForms.floaterItemList !== null
                ) {
                  const floaterItemList = JSON.parse(
                    JSON.stringify(specificForms.floaterItemList)
                  );
                  if (floaterItemList.length > 0) {
                    let checker = false;
                    for (
                      let index = 0;
                      index < floaterItemList.length;
                      index++
                    ) {
                      const element = floaterItemList[index];
                      const { name, gender, dob, relation, diseases, existing_diseases } = element;
                      if (
                        name === "" ||
                        gender === "" ||
                        dob === "" ||
                        relation === "" ||
                        diseases === "" ||
                        existing_diseases === ""
                      ) {
                        checker = true;
                      }
                    }
                    if (checker) {
                      checkData = false;
                      Helper.showToastMessage(
                        "Please, Fill all member details",
                        0
                      );
                    } else {
                      if (
                        specificForms.pancardNo !== "" &&
                        !Helper.checkPanCard(specificForms.pancardNo)
                      ) {
                        checkData = false;
                        Helper.showToastMessage("Invalid pan card number", 0);
                      } else {
                        let keypos = 1;
                        let parseJs = JSON.parse(JSON.stringify(specificForms));
                        for (var key in parseJs) {
                          if (key !== `floaterItemList`) {
                            const value = parseJs[key];
                            if (value !== undefined) {
                              if (Array.isArray(value) === false) {
                                formData.append(key, parseJs[key]);
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            } else {
              if (
                specificForms.pancardNo !== "" &&
                !Helper.checkPanCard(specificForms.pancardNo)
              ) {
                checkData = false;
                Helper.showToastMessage("Invalid pan card number", 0);
              } else {
                let parseJs = JSON.parse(JSON.stringify(specificForms));
                for (var key in parseJs) {
                  if (key !== "floaterItemList") {
                    const value = parseJs[key];
                    if (value !== undefined) {
                      if (Array.isArray(value) === false) {
                        formData.append(key, parseJs[key]);
                      }
                    }
                  }
                }
              }
            }
          } else if (title === `Auto Loan`) {
            if (specificForms.turnover === "") {
              checkData = false;
              Helper.showToastMessage("Annual Turnover empty", 0);
            } else if (
              title !== `Business Loan` &&
              title !== `Personal Loan` &&
              (specificForms.loan_property_city === "" ||
                specificForms.loan_property_city ===
                `Select Loan Property City *`)
            ) {
              checkData = false;
              Helper.showToastMessage("Select Loan Property city", 0);
            } else if (
              (title === `Personal Loan` || title === `Business Loan`) &&
              specificForms.type_loan === ``
            ) {
              checkData = false;
              Helper.showToastMessage("Select Type of Loan", 0);
            } else {
              if (
                specificForms.pancardNo !== "" &&
                !Helper.checkPanCard(specificForms.pancardNo)
              ) {
                checkData = false;
                Helper.showToastMessage("Invalid pan card number", 0);
              } else {
                let parseJs = JSON.parse(JSON.stringify(specificForms));
                for (var key in parseJs) {
                  if (key !== "floaterItemList") {
                    const value = parseJs[key];
                    if (value !== undefined) {
                      if (Array.isArray(value) === false) {
                        formData.append(key, parseJs[key]);
                      }
                    }
                  }
                }
              }
            }
          } else if (
            specificForms.pancardNo !== "" &&
            !Helper.checkPanCard(specificForms.pancardNo)
          ) {
            checkData = false;
            Helper.showToastMessage("Invalid pan card number", 0);
          } else {
            let parseJs = JSON.parse(JSON.stringify(specificForms));
            for (var key in parseJs) {
              if (key !== "floaterItemList") {
                const value = parseJs[key];
                if (value !== undefined) {
                  if (Array.isArray(value) === false) {
                    formData.append(key, parseJs[key]);
                  }
                }
              }
            }
          }
        }
      }

      if (fileListForms !== undefined) {
        const allfileslist = fileListForms.fileList;
        let existence = "";
        //console.log('allfileslist', allfileslist)
        if (allfileslist !== undefined && allfileslist.length > 0) {
          const loops = Lodash.map(allfileslist, (ele) => {
            let parseJs = JSON.parse(JSON.stringify(ele));
            for (var key in parseJs) {
              const value = parseJs[key];
              if (value !== undefined) {
                if (Array.isArray(value) === false) {
                  formData.append(key, parseJs[key]);
                }
              }
            }
          });
          if (title === 'Motor Insurance') {
            const rcCopy = Lodash.find(allfileslist, io => {
              if ('rcbookcopy' in io) {
                io.key = 'rcbookcopy';
                return io;
              } else {
                return undefined;
              }
            });
            if (rcCopy !== undefined) {
              const { key } = rcCopy;
              const { name } = rcCopy[key];
              if (String(key) === `rcbookcopy` && name !== undefined && String(name).length === 0) {
                existence = key;
              }
            } else {
              existence = "rcbookcopy";
            }

            const oldInCopy = Lodash.find(allfileslist, io => {
              if ('oldinsurancecopy' in io) {
                io.key = 'oldinsurancecopy';
                return io;
              } else {
                return undefined;
              }
            });
            if (oldInCopy !== undefined) {
              const { key } = oldInCopy;
              const { name } = oldInCopy[key];
              if (String(key) === `oldinsurancecopy` && name !== undefined && String(name).length === 0) {
                existence = key;
              }
            } else {
              existence = "oldinsurancecopy";
            }
          }
        } else {
          existence = "rcbookcopy";
        }
        //console.log('existence', existence)
        if (title === `Motor Insurance`) {
          if (existence === 'rcbookcopy') {
            checkData = false;
            Helper.showToastMessage('Please, Select RC Copy', 0);
          } else if (existence === 'oldinsurancecopy') {
            checkData = false;
            Helper.showToastMessage('Please, Select Old Insurance Copy', 0);
          }
        }
      }

      if (dateForm !== undefined) {
        if (dateForm.baa === "") {
          checkData = false;
          Helper.showToastMessage("Please, Select Appointment Date", 0);
        } else {
          let parseJs = JSON.parse(JSON.stringify(dateForm));
          for (var key in parseJs) {
            const value = parseJs[key];
            if (value !== undefined) {
              if (Array.isArray(value) === false) {
                formData.append(key, parseJs[key]);
              }
            }
          }
        }
      }

      if (checkData) {
        if (currentPosition < 3) {
          this.setState((prevState) => {
            return {
              currentPosition: prevState.currentPosition + 1,
              bottontext: prevState.currentPosition + 1 > 2 ? "Submit" : "Next",
              scrollReset: true
            };
          });
        } else {
          this.setState({ progressLoader: true });
          const { refercode } = this.state.userData;
          formData.append("ref", refercode);

          const formUrls = `${Pref.FinOrbitFormUrl}${uniq}.php`;

          //console.log('formData', formData);
          //console.log('formUrls', formUrls);

          Helper.networkHelperTokenContentType(
            formUrls,
            formData,
            Pref.methodPost,
            this.state.token,
            (result) => {
              //console.log('result',result)
              const { response_header } = result;
              const { res_type, res } = response_header;
              this.setState({ progressLoader: false });
              if (res_type === "success") {
                Helper.showToastMessage("Form submitted successfully", 1);
                if (title === `Health Insurance`) {
                  const { id } = res;
                  const cov = Number(specificForms.required_cover);
                  NavigationActions.navigate("GetQuotes", {
                    formId: id,
                    sumin: Number(cov / 100000).toFixed(1),
                  });
                } else {
                  NavigationActions.navigate("Finish", {
                    top: "Edit Profile",
                    red: "Success",
                    grey: "Details uploaded",
                    blue: "Add another lead?",
                    back: "FinorbitScreen",
                  });
                }
              } else {
                Helper.showToastMessage("failed to submit form", 0);
              }
            },
            () => {
              this.setState({ progressLoader: false });
              Helper.showToastMessage("Form submitted successfully", 1);
              NavigationActions.navigate("Finish", {
                top: "Edit Profile",
                red: "Success",
                grey: "Details uploaded",
                blue: "Add another lead?",
                back: "FinorbitScreen",
              });
            }
          );
        }
      }
    }
  }

  findImage() {
    const { title } = this.props;
    const productList = JSON.parse(JSON.stringify(Pref.productList));
    const search = Lodash.find(productList, (io) => io.name === title);
    console.log(title, search);
    return search === undefined
      ? require("../../res/images/logo.png")
      : search.url;
  }

  render() {
    const { title } = this.state;
    const split =
      title !== "" ? (title.includes(" ") ? title.split(" ") : [title]) : [""];
    return (
      <CScreen
        scrollreset={this.state.scrollReset}
        absolute={
          <>
            <Loader isShow={this.state.progressLoader} />
          </>
        }
        body={
          <>
            <LeftHeaders
              showBack
              title={
                split.length === 2
                  ? `${split[0]} ${split[1]}`
                  : split.length === 3
                    ? `${split[0]} ${split[1]} ${split[2]}`
                    : split.length === 4
                      ? `${split[0]} ${split[1]} ${split[2]} ${split[3]}`
                      : split[0]
              }
              bottomtext={
                <>
                  {`${split[0]} `}
                  {split.length === 2 ? (
                    <Title style={styles.passText}>{`${split[1]}`}</Title>
                  ) : split.length === 3 ? (
                    <Title
                      style={styles.passText}
                    >{`${split[1]} ${split[2]}`}</Title>
                  ) : split.length === 4 ? (
                    <Title
                      style={styles.passText}
                    >{`${split[1]} ${split[2]} ${split[3]}`}</Title>
                  ) : null}
                </>
              }
              bottomtextStyle={{
                color: "#555555",
                fontSize: 20,
              }}
            />
            <StepIndicator
              activeCounter={this.state.currentPosition}
              stepCount={this.state.title === 'Insure Check' ? 2 : 4}
            />

            {/* <StepIndicator
                customStyles={customStyles}
                //labels={['Personal', 'Corporate', 'Upload', 'Submit']}
                currentPosition={this.state.currentPosition}
                labels={['', '']}
                //onPress={(pos) => this.onPageChange(pos)}
                //stepCount={4}
                stepCount={2}
              /> */}

            <View styleName="md-gutter">
              {this.state.currentPosition === 0 ? (
                <CommonForm
                  ref={this.commonFormRef}
                  showemploy={
                    this.state.title !== "Fixed Deposit" &&
                    this.state.title !== "Vector Plus" &&
                    this.state.title !== "Business Loan" &&
                    this.state.title !== "Mutual Fund" &&
                    this.state.title !== "Motor Insurance" &&
                    this.state.title !== 'Life Cum Invt. Plan' &&
                    this.state.title !== 'Insure Check'
                  }
                  saveData={this.state.dataArray[0]}
                  title={this.state.title}
                />
              ) : this.state.currentPosition === 1 ? (
                <SpecificForm
                  ref={this.specificFormRef}
                  saveData={this.state.dataArray[1]}
                  title={this.state.title}
                />
              ) : this.state.currentPosition === 2 ? (
                <FileUploadForm
                  ref={this.FileUploadFormRef}
                  title={this.state.title}
                  saveData={this.state.dataArray[2]}
                />) : this.state.currentPosition === 3 ? (
                  <ApptForm
                    ref={this.ApptFormRef}
                    title={this.state.title}
                    saveData={this.state.dataArray[3]}
                  />
                ) : null}
            </View>

            <View styleName={this.state.currentPosition > 0 ? `horizontal space-between md-gutter` : `horizontal space-between md-gutter v-end h-end`}>
              {this.state.currentPosition > 0 ? <Button
                mode={'flat'}
                uppercase={true}
                dark={true}
                loading={false}
                style={[styles.loginButtonStyle, {
                  backgroundColor: 'transparent',
                  borderColor: '#d5d3c1',
                  borderWidth: 1.3,
                }]}
                onPress={this.backNav}>
                <Title style={StyleSheet.flatten([styles.btntext, {
                  color: '#b8b28f',
                }])}>{'Back'}</Title>
              </Button> : null}
              <Button
                mode={"flat"}
                uppercase={false}
                dark={true}
                loading={false}
                style={styles.loginButtonStyle}
                onPress={this.submitt}
              >
                <Title style={styles.btntext}>{this.state.bottontext}</Title>
              </Button>
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
    color: "white",
    backgroundColor: Pref.RED,
    textAlign: "center",
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 0.5,
    borderRadius: 48,
    width: "40%",
    paddingVertical: 4,
    fontWeight: "700",
  },
  btntext: {
    color: "white",
    fontSize: 16,
    letterSpacing: 0.5,
    fontWeight: "700",
  },
});
