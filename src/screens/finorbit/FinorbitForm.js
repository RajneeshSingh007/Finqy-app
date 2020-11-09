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
  ActivityIndicator
} from "react-native-paper";
import NavigationActions from "../../util/NavigationActions";
import { sizeHeight, sizeWidth } from "../../util/Size";
import CommonForm from "./CommonForm";
import SpecificForm from "./SpecificForm";
import FileUploadForm from "./FileUploadForm";
import ApptForm from "./ApptForm";
import Lodash from "lodash";
import Loader from "../../util/Loader";
import LeftHeaders from "../common/CommonLeftHeader";
import CScreen from "../component/CScreen";
import StepIndicator from "../component/StepIndicator";
import { firstFormCheck } from "../../util/FormCheckHelper";

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
    // NavigationActions.navigate("GetQuotes", {
    //   formId: 1420,
    //   sumin:10,
    // });
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
    //console.log("title", title);
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
      //console.log("d", commons);
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
      } else if (title === 'Insure Check') {
        uniq = 'insure_check';
      }
      //console.log(`uniq`, uniq, title);
      formData.append(uniq, uniq);

      if (commonForms !== undefined && this.state.currentPosition === 0) {
        checkData = firstFormCheck(title, commonForms);
        // if (checkData) {
        //   let parseJs = JSON.parse(JSON.stringify(commonForms));
        //   if (parseJs.currentlocation === "Select Current Location *") {
        //     parseJs.currentlocation === "";
        //   }
        //   for (var key in parseJs) {
        //     const value = parseJs[key];
        //     if (value !== undefined) {
        //       if (Array.isArray(value) === false) {
        //         formData.append(key, parseJs[key]);
        //       }
        //     }
        //   }
        // }
      }

      if (specificForms !== undefined && this.state.currentPosition === 1) {
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
          title !== `Insure Check` &&
          title !== `Term Insurance` &&
          specificForms.amount === ``
        ) {
          checkData = false;
          Helper.showToastMessage(
            title === "Term Insurance"
              ? "Required Cover empty"
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
          title !== `Insure Check` &&
          specificForms.existingcard === ``
        ) {
          checkData = false;
          Helper.showToastMessage("Select Existing Card/Loan", 0);
        } else if ((title === "Home Loan" || title === "Business Loan" || title === "Personal Loan") && specificForms.company === '') {
          checkData = false;
          Helper.showToastMessage("Company name empty", 0);
        } else if ((title === "Home Loan" || title === "Business Loan" || title === "Personal Loan") && specificForms.turnover === '') {
          checkData = false;
          Helper.showToastMessage("Annual Turnover empty", 0);
        } else if ((title === "Home Loan" || title === "Business Loan" || title === "Personal Loan") && specificForms.turnover.length < 2) {
          checkData = false;
          Helper.showToastMessage("Invalid turnover", 0);
        } else if ((title === "Home Loan" || title === "Business Loan" || title === "Personal Loan") && specificForms.amount === '') {
          checkData = false;
          Helper.showToastMessage("Desired Amount empty", 0);
        } else if ((title === "Home Loan" || title === "Business Loan" || title === "Personal Loan") && specificForms.amount.length < 2) {
          checkData = false;
          Helper.showToastMessage("Invalid desired amount", 0);
        } else if ((title === "Home Loan" || title === "Business Loan" || title === "Personal Loan") && specificForms.pancardNo === "") {
          checkData = false;
          Helper.showToastMessage("Pancard number empty", 0);
        } else if (
          specificForms.pancardNo !== "" &&
          !Helper.checkPanCard(specificForms.pancardNo)
        ) {
          checkData = false;
          Helper.showToastMessage("Invalid pan card number", 0);
        } else if ((title === "Home Loan" || title === "Business Loan" || title === "Personal Loan") && specificForms.aadharcardNo === "") {
          checkData = false;
          Helper.showToastMessage("Aadhar card number empty", 0);
        } else if ((title === "Home Loan" || title === "Business Loan" || title === "Personal Loan") && specificForms.aadharcardNo !== undefined && specificForms.aadharcardNo !== "" && specificForms.aadharcardNo.length < 12) {
          checkData = false;
          Helper.showToastMessage("Invalid aadhar card number", 0);
        } else if ((title === "Home Loan" || title === "Business Loan" || title === "Personal Loan") && specificForms.type_loan === "") {
          checkData = false;
          Helper.showToastMessage("Select Type of Loan", 0);
        } else if ((title === "Home Loan" || title === "Business Loan" || title === "Personal Loan") && specificForms.existingcard === "") {
          checkData = false;
          Helper.showToastMessage("Select Existing Card/Loan", 0);
        } else if ((title === "Home Loan" || title === "Business Loan" || title === "Personal Loan") && specificForms.companylocation === "") {
          checkData = false;
          Helper.showToastMessage("Please, Select Company Location", 0);
        } else if ((title === 'Home Loan'
          //|| title === 'Loan Against Property'
        ) &&
          specificForms.pincode === "") {
          checkData = false;
          Helper.showToastMessage("Please, Enter Loan Property Pincode", 0);
          //Helper.showToastMessage("Loan property pincode empty", 0);
        } else if ((title === 'Home Loan'
          //|| title === 'Loan Against Property'
        ) && specificForms.pincode !== '' &&
          specificForms.pincode.length < 6) {
          checkData = false;
          Helper.showToastMessage("Please, Correct Loan Property Pincode", 0);
          //Helper.showToastMessage("Loan property pincode empty", 0);
        } else if ((title === 'Home Loan'
          //|| title === 'Loan Against Property'
        ) &&
          specificForms.pincode !== '' && (specificForms.loan_property_city === '' || specificForms.homestate === '')) {
          checkData = false;
          Helper.showToastMessage('Failed to find city & state, Please, check loan property pincode', 0);
        } else if (title === "Home Loan" && specificForms.loan_property_address === "") {
          checkData = false;
          Helper.showToastMessage("Property Address empty", 0);
        } else {
          if (title === "Life Cum Invt. Plan") {
            if (specificForms.investment_amount === "") {
              checkData = false;
              Helper.showToastMessage("Investment Amount empty", 0);
            } else if (specificForms.aadharcardNo !== undefined && specificForms.aadharcardNo !== "" && specificForms.aadharcardNo.length < 12) {
              checkData = false;
              Helper.showToastMessage("Invalid aadhar card number", 0);
            } else if (
              specificForms.pancardNo !== "" &&
              !Helper.checkPanCard(specificForms.pancardNo)
            ) {
              checkData = false;
              Helper.showToastMessage("Invalid pan card number", 0);
            }
            // else {
            //   let parseJs = JSON.parse(JSON.stringify(specificForms));
            //   for (var key in parseJs) {
            //     if (key !== "floaterItemList") {
            //       const value = parseJs[key];
            //       if (value !== undefined) {
            //         if (Array.isArray(value) === false) {
            //           formData.append(key, parseJs[key]);
            //         }
            //       }
            //     }
            //   }
            // }
            //}
          } else if (title === "Motor Insurance") {
            if (specificForms.claim_type === "") {
              checkData = false;
              Helper.showToastMessage("Please, Select Any Claims Last Year", 0);
            } else if (specificForms.registration_type === "") {
              checkData = false;
              Helper.showToastMessage("Please, Select Registration Type", 0);
            } else if (specificForms.vehicle_type === "") {
              checkData = false;
              Helper.showToastMessage("Please, Select Vehicle Type", 0);
            } else if (specificForms.motor_type === "") {
              checkData = false;
              Helper.showToastMessage("Please, Select Motor Type", 0);
            }

            // else if (specificForms.car_type === "") {
            //   checkData = false;
            //   Helper.showToastMessage("Please, Select Car Type", 0);
            // } 
            else if (
              specificForms.insurance === `` ||
              specificForms.insurance === `Select Insurance Type *`
            ) {
              checkData = false;
              Helper.showToastMessage("Please, Select Insurance Type", 0);
            } else {
              if (specificForms.aadharcardNo !== undefined && specificForms.aadharcardNo !== "" && specificForms.aadharcardNo.length < 12) {
                checkData = false;
                Helper.showToastMessage("Invalid aadhar card number", 0);
              } else if (
                specificForms.pancardNo !== "" &&
                !Helper.checkPanCard(specificForms.pancardNo)
              ) {
                checkData = false;
                Helper.showToastMessage("Invalid pan card number", 0);
              }
              // else {
              //   let parseJs = JSON.parse(JSON.stringify(specificForms));
              //   for (var key in parseJs) {
              //     if (key !== "floaterItemList") {
              //       const value = parseJs[key];
              //       if (value !== undefined) {
              //         if (Array.isArray(value) === false) {
              //           formData.append(key, parseJs[key]);
              //         }
              //       }
              //     }
              //   }
              // }
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
              if (specificForms.aadharcardNo !== undefined && specificForms.aadharcardNo !== "" && specificForms.aadharcardNo.length < 12) {
                checkData = false;
                Helper.showToastMessage("Invalid aadhar card number", 0);
              } else if (
                specificForms.pancardNo !== "" &&
                !Helper.checkPanCard(specificForms.pancardNo)
              ) {
                checkData = false;
                Helper.showToastMessage("Invalid pan card number", 0);
              }
              // else {
              //   let parseJs = JSON.parse(JSON.stringify(specificForms));
              //   for (var key in parseJs) {
              //     if (key !== "floaterItemList") {
              //       const value = parseJs[key];
              //       if (value !== undefined) {
              //         if (Array.isArray(value) === false) {
              //           formData.append(key, parseJs[key]);
              //         }
              //       }
              //     }
              //   }
              // }
            }
          } else if (title === "Auto Loan") {
            if (specificForms.company === '') {
              checkData = false;
              Helper.showToastMessage("Company name empty", 0);
            } else if (specificForms.turnover === '') {
              checkData = false;
              Helper.showToastMessage("Annual Turnover empty", 0);
            } else if (specificForms.turnover.length < 2) {
              checkData = false;
              Helper.showToastMessage("Invalid turnover", 0);
            } else if (specificForms.amount === '') {
              checkData = false;
              Helper.showToastMessage("Desired Amount empty", 0);
            } else if (specificForms.amount !== '' && specificForms.amount.length < 2) {
              checkData = false;
              Helper.showToastMessage("Invalid Desired Amount", 0);
            } else if (specificForms.pancardNo === "") {
              checkData = false;
              Helper.showToastMessage("Pancard number empty", 0);
            } else if (
              specificForms.pancardNo !== "" &&
              !Helper.checkPanCard(specificForms.pancardNo)
            ) {
              checkData = false;
              Helper.showToastMessage("Invalid pan card number", 0);
            } else if (specificForms.aadharcardNo !== undefined && specificForms.aadharcardNo === "") {
              checkData = false;
              Helper.showToastMessage("Aadhar card number empty", 0);
            } else if (specificForms.aadharcardNo !== undefined && specificForms.aadharcardNo !== "" && specificForms.aadharcardNo.length < 12) {
              checkData = false;
              Helper.showToastMessage("Invalid aadhar card number", 0);
            } else if (specificForms.rcbook === "") {
              checkData = false;
              Helper.showToastMessage("Car RC number empty", 0);
            } else if (specificForms.model === "") {
              checkData = false;
              Helper.showToastMessage("Car Model number empty", 0);
            } else if (specificForms.nooldcard === "") {
              checkData = false;
              Helper.showToastMessage("Select Type of Car", 0);
            } else if (specificForms.ownership === "") {
              checkData = false;
              Helper.showToastMessage("Select Type of Ownership", 0);
            }
            // else {
            //   let parseJs = JSON.parse(JSON.stringify(specificForms));
            //   for (var key in parseJs) {
            //     if (key !== "floaterItemList") {
            //       const value = parseJs[key];
            //       if (value !== undefined) {
            //         if (Array.isArray(value) === false) {
            //           formData.append(key, parseJs[key]);
            //         }
            //       }
            //     }
            //   }
            // }
            //}
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
              specificForms.amount !== '' && specificForms.amount.length < 2
            ) {
              checkData = false;
              Helper.showToastMessage("Inavlid Required Cover", 0);
            } else if (specificForms.lifestyle === "") {
              checkData = false;
              Helper.showToastMessage("Please, Select Smoker Type", 0);
            } else if (specificForms.lifestyle2 === "") {
              checkData = false;
              Helper.showToastMessage("Please, Select Alcohol Consumption Type", 0);
            } else if (specificForms.existing_diseases === "") {
              checkData = false;
              Helper.showToastMessage("Select Existing Disease", 0);
            } else if (
              title === `Term Insurance` && specificForms.payment_mode === '' &&
              specificForms.diseases === ""
            ) {
              checkData = false;
              Helper.showToastMessage("Please, Select Preferred Payment Mode", 0);
            } else if (
              title === `Term Insurance` &&
              specificForms.pay_type === ""
            ) {
              checkData = false;
              Helper.showToastMessage("Please, Select Pay Type", 0);
            } else if (
              title === `Term Insurance` &&
              specificForms.policy_term === ""
            ) {
              checkData = false;
              Helper.showToastMessage("Please, Select Policy Term", 0);
            } else if (
              title === `Term Insurance` &&
              specificForms.addons === ""
            ) {
              checkData = false;
              Helper.showToastMessage("Please, Select Addons Type", 0);
            } else if (
              title === `Health Insurance` &&
              specificForms.claim_type === ""
            ) {
              checkData = false;
              Helper.showToastMessage("Please, Select Type Of Insurance", 0);
            } else if (specificForms.existing_diseases === 'YES' &&
              specificForms.diseases === ""
            ) {
              checkData = false;
              Helper.showToastMessage("Please, Specify diseases", 0);
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
                      if (specificForms.aadharcardNo !== undefined && specificForms.aadharcardNo !== "" && specificForms.aadharcardNo.length < 12) {
                        checkData = false;
                        Helper.showToastMessage("Invalid aadhar card number", 0);
                      } else if (
                        specificForms.pancardNo !== "" &&
                        !Helper.checkPanCard(specificForms.pancardNo)
                      ) {
                        checkData = false;
                        Helper.showToastMessage("Invalid pan card number", 0);
                      }
                      // else {
                      //   let keypos = 1;
                      //   let parseJs = JSON.parse(JSON.stringify(specificForms));
                      //   for (var key in parseJs) {
                      //     if (key !== `floaterItemList`) {
                      //       const value = parseJs[key];
                      //       if (value !== undefined) {
                      //         if (Array.isArray(value) === false) {
                      //           formData.append(key, parseJs[key]);
                      //         }
                      //       }
                      //     }
                      //   }
                      // }
                    }
                  }
                }
              }
            } else {
              if (specificForms.aadharcardNo !== undefined && specificForms.aadharcardNo !== "" && specificForms.aadharcardNo.length < 12) {
                checkData = false;
                Helper.showToastMessage("Invalid aadhar card number", 0);
              } else if (
                specificForms.pancardNo !== "" &&
                !Helper.checkPanCard(specificForms.pancardNo)
              ) {
                checkData = false;
                Helper.showToastMessage("Invalid pan card number", 0);
              }
              // else {
              //   let parseJs = JSON.parse(JSON.stringify(specificForms));
              //   for (var key in parseJs) {
              //     if (key !== "floaterItemList") {
              //       const value = parseJs[key];
              //       if (value !== undefined) {
              //         if (Array.isArray(value) === false) {
              //           formData.append(key, parseJs[key]);
              //         }
              //       }
              //     }
              //   }
              // }
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
              if (specificForms.aadharcardNo !== undefined && specificForms.aadharcardNo !== "" && specificForms.aadharcardNo.length < 12) {
                checkData = false;
                Helper.showToastMessage("Invalid aadhar card number", 0);
              } else if (
                specificForms.pancardNo !== "" &&
                !Helper.checkPanCard(specificForms.pancardNo)
              ) {
                checkData = false;
                Helper.showToastMessage("Invalid pan card number", 0);
              }
              // else {
              //   let parseJs = JSON.parse(JSON.stringify(specificForms));
              //   for (var key in parseJs) {
              //     if (key !== "floaterItemList") {
              //       const value = parseJs[key];
              //       if (value !== undefined) {
              //         if (Array.isArray(value) === false) {
              //           formData.append(key, parseJs[key]);
              //         }
              //       }
              //     }
              //   }
              // }
            }
          } else if (specificForms.aadharcardNo !== undefined && specificForms.aadharcardNo !== "" && specificForms.aadharcardNo.length < 12) {
            checkData = false;
            Helper.showToastMessage("Invalid aadhar card number", 0);
          } else if (
            specificForms.pancardNo !== "" &&
            !Helper.checkPanCard(specificForms.pancardNo)
          ) {
            checkData = false;
            Helper.showToastMessage("Invalid pan card number", 0);
          } else if (title === 'Insure Check' && specificForms.type_insurance === '') {
            checkData = false;
            Helper.showToastMessage("Please, Select Type of Insurance", 0);
          } else if (title === 'Insure Check' && specificForms.type_insurance === 'Life Insurance' && specificForms.life_sum_assured === '') {
            checkData = false;
            Helper.showToastMessage("Please, Enter Sum Assured", 0);
          } else if (title === 'Insure Check' && specificForms.type_insurance === 'Health Insurance' && specificForms.health_sum_assured === '') {
            checkData = false;
            Helper.showToastMessage("Please, Enter Sum Assured", 0);
          } else if (title === 'Insure Check' && specificForms.type_insurance === 'Health Insurance' && specificForms.health_sum_assured !== '' && specificForms.health_sum_assured.length < 2) {
            checkData = false;
            Helper.showToastMessage("Please, Invalid Sum Assured", 0);
          } else if (title === 'Insure Check' && specificForms.type_insurance === 'Life Insurance' && specificForms.life_company === '') {
            checkData = false;
            Helper.showToastMessage("Please, Select Life Policy Company", 0);
          } else if (title === 'Insure Check' && specificForms.type_insurance === 'Health Insurance' && specificForms.health_company === '') {
            checkData = false;
            Helper.showToastMessage("Please, Select Health Policy Company", 0);
          } else if (title === 'Insure Check' && specificForms.turnover === "") {
            checkData = false;
            Helper.showToastMessage("Annual Turnover Empty", 0);
          }
          // else {
          //   let parseJs = JSON.parse(JSON.stringify(specificForms));
          //   for (var key in parseJs) {
          //     if (key !== "floaterItemList") {
          //       const value = parseJs[key];
          //       if (value !== undefined) {
          //         if (Array.isArray(value) === false) {
          //           formData.append(key, parseJs[key]);
          //         }
          //       }
          //     }
          //   }
          // }
        }
      }
      let allfileslist = [];
      if (fileListForms !== undefined) {
        allfileslist = fileListForms.fileList;
        let existence = "";
        //console.log('allfileslist', allfileslist)
        if (allfileslist !== undefined && allfileslist.length > 0) {
          // const loops = Lodash.map(allfileslist, (ele) => {
          //   let parseJs = JSON.parse(JSON.stringify(ele));
          //   for (var key in parseJs) {
          //     const value = parseJs[key];
          //     if (value !== undefined) {
          //       if (Array.isArray(value) === false) {
          //         formData.append(key, parseJs[key]);
          //       }
          //     }
          //   }
          // });
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
              if ('policycopy' in io) {
                io.key = 'policycopy';
                return io;
              } else {
                return undefined;
              }
            });
            if (existence === "") {
              if (oldInCopy !== undefined) {
                const { key } = oldInCopy;
                const { name } = oldInCopy[key];
                if (String(key) === `policycopy` && name !== undefined && String(name).length === 0) {
                  existence = key;
                }
              } else {
                existence = "policycopy";
              }
            }
          } else if (title === 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan') {
            //pan card
            const pancard = Lodash.find(allfileslist, io => {
              if ('pancard' in io) {
                io.key = 'pancard';
                return io;
              } else {
                return undefined;
              }
            });
            if (pancard !== undefined) {
              const { key } = pancard;
              const { name } = pancard[key];
              if (String(key) === `pancard` && name !== undefined && String(name).length === 0) {
                existence = key;
              }
            } else {
              existence = "pancard";
            }

            //aadhar card
            const aadharcard = Lodash.find(allfileslist, io => {
              if ('aadharcard' in io) {
                io.key = 'aadharcard';
                return io;
              } else {
                return undefined;
              }
            });
            if (existence === "") {
              if (aadharcard !== undefined) {
                const { key } = aadharcard;
                const { name } = aadharcard[key];
                if (String(key) === `aadharcard` && name !== undefined && String(name).length === 0) {
                  existence = key;
                }
              } else {
                existence = "aadharcard";
              }
            }

            //salary slip 
            const salaryslip = Lodash.find(allfileslist, io => {
              if ('salaryslip' in io) {
                io.key = 'salaryslip';
                return io;
              } else {
                return undefined;
              }
            });
            if (existence === "") {

              if (salaryslip !== undefined) {
                const { key } = salaryslip;
                const { name } = salaryslip[key];
                if (String(key) === `salaryslip` && name !== undefined && String(name).length === 0) {
                  existence = key;
                }
              } else {
                existence = "salaryslip";
              }
            }

            //salary slip 1 
            const salaryslip1 = Lodash.find(allfileslist, io => {
              if ('salaryslip1' in io) {
                io.key = 'salaryslip1';
                return io;
              } else {
                return undefined;
              }
            });
            if (existence === "") {

              if (salaryslip1 !== undefined) {
                const { key } = salaryslip1;
                const { name } = salaryslip1[key];
                if (String(key) === `salaryslip1` && name !== undefined && String(name).length === 0) {
                  existence = key;
                }
              } else {
                existence = "salaryslip1";
              }
            }


            //salary slip 2
            const salaryslip2 = Lodash.find(allfileslist, io => {
              if ('salaryslip2' in io) {
                io.key = 'salaryslip2';
                return io;
              } else {
                return undefined;
              }
            });
            if (existence === "") {

              if (salaryslip2 !== undefined) {
                const { key } = salaryslip2;
                const { name } = salaryslip2[key];
                if (String(key) === `salaryslip2` && name !== undefined && String(name).length === 0) {
                  existence = key;
                }
              } else {
                existence = "salaryslip2";
              }
            }
            //3month bank statement
            const bankstate = Lodash.find(allfileslist, io => {
              if ('bankstate' in io) {
                io.key = 'bankstate';
                return io;
              } else {
                return undefined;
              }
            });
            if (existence === "") {

              if (bankstate !== undefined) {
                const { key } = bankstate;
                const { name } = bankstate[key];
                if (String(key) === `bankstate` && name !== undefined && String(name).length === 0) {
                  existence = key;
                }
              } else {
                existence = "bankstate";
              }
            }
          }

        } else {
          if (title == 'Motor Insurance') {
            existence = "rcbookcopy";
          } else if (title == 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan') {
            existence = "pancard";
          }
        }
        //console.log('existence', existence)
        if (this.state.currentPosition === 2) {
          if (title === `Motor Insurance`) {
            if (existence === 'rcbookcopy') {
              checkData = false;
              Helper.showToastMessage('Please, Select RC Book', 0);
            } else if (existence === 'policycopy') {
              checkData = false;
              Helper.showToastMessage('Please, Select Policy', 0);
            }
          } else if (title === `Auto Loan` || title === 'Business Loan' || title === 'Personal Loan') {
            if (existence === 'pancard') {
              checkData = false;
              Helper.showToastMessage('Please, Select Pancard', 0);
            } else if (existence === 'aadharcard') {
              checkData = false;
              Helper.showToastMessage('Please, Select Aadhar Card', 0);
            } else if (existence === 'salaryslip') {
              checkData = false;
              Helper.showToastMessage('Please, Select Salary Slip 1', 0);
            } else if (existence === 'salaryslip1') {
              checkData = false;
              Helper.showToastMessage('Please, Select Salary Slip 2', 0);
            } else if (existence === 'salaryslip2') {
              checkData = false;
              Helper.showToastMessage('Please, Select Salary Slip 3', 0);
            } else if (existence === 'bankstate') {
              checkData = false;
              Helper.showToastMessage('Please, Select Bank Statement', 0);
            }
          }
        }
      }

      if (dateForm !== undefined && this.state.currentPosition === 3) {
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
        const limit = title === 'Insure Check' ? 1 : 3;
        if (currentPosition < limit) {
          if (this.state.title === 'Insure Check') {
            this.setState((prevState) => {
              return {
                currentPosition: prevState.currentPosition + 1,
                bottontext: prevState.currentPosition + 1 > 0 ? "Submit" : "Next",
                scrollReset: true
              };
            }, () => {
              if (this.state.currentPosition === 0) {
                this.commonFormRef.current.restoreData(this.restoreList[0]);
              } else if (this.state.currentPosition === 1) {
                this.specificFormRef.current.restoreData(this.restoreList[1]);
              }
            });
          } else {
            this.setState((prevState) => {
              return {
                currentPosition: prevState.currentPosition + 1,
                bottontext: prevState.currentPosition + 1 > 2 ? "Submit" : "Next",
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

          }

        } else {
          this.setState({ progressLoader: true });
          const { refercode } = this.state.userData;
          formData.append("ref", refercode);

          //construct form data

          //1st form 
          if (commonForms) {
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

          //2nd form
          if (specificForms) {
            let parseJs = JSON.parse(JSON.stringify(specificForms));
            if (parseJs.floaterItemList != undefined && parseJs.floaterItemList.length > 0) {
              let keypos = 1;
              const loops = Lodash.map(floaterItemList, (ele) => {
                let parseJs = JSON.parse(JSON.stringify(ele));
                for (var key in parseJs) {
                  const value = parseJs[key];
                  if (value !== undefined) {
                    if (key.includes('existing_diseases')) {
                      formData.append(`existing_diseases${keypos}`, parseJs[key]);
                    } else if (key.includes('diseases')) {
                      formData.append(`diseases${keypos}`, parseJs[key]);
                    } else {
                      formData.append(
                        keypos === 1
                          ? `floater_${key}`
                          : `floater_${key}${keypos}`,
                        parseJs[key]
                      );
                    }
                  }
                }
                keypos += 1;
              });
            }
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


          //3rd form
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
          }

          const formUrls = `${Pref.FinOrbitFormUrl}${uniq}.php`;

          console.log('formData', formData);
          console.log('formUrls', formUrls);

          Helper.networkHelperTokenContentType(
            formUrls,
            formData,
            Pref.methodPost,
            this.state.token,
            (result) => {
              //console.log('result', result)
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
                    sumin: cov,
                  });
                } else {
                  NavigationActions.navigate("Finish", {
                    top: "Add New Lead",
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
            (e) => {
              console.log(e);
              this.setState({ progressLoader: false });
              Helper.showToastMessage("Something went wrong", 0);
              //Helper.showToastMessage("Form submitted successfully", 1);
              // NavigationActions.navigate("Finish", {
              //   top: "Edit Profile",
              //   red: "Success",
              //   grey: "Details uploaded",
              //   blue: "Add another lead?",
              //   back: "FinorbitScreen",
              // });
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
                // split.length === 2
                //   ? `${split[0]} ${split[1]}`
                //   : split.length === 3
                //     ? `${split[0]} ${split[1]} ${split[2]}`
                //     : split.length === 4
                //       ? `${split[0]} ${split[1]} ${split[2]} ${split[3]}`
                //       : split[0]
                `Add New Lead`
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
            {title == '' ? <View style={styles.loader}>
              <ActivityIndicator />
            </View> : <>


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
              </>}
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
  loader: {
    justifyContent: 'center',
    alignSelf: 'center',
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
