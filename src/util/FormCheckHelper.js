import * as Helper from './Helper';
import * as Pref from './Pref';
import Lodash from 'lodash';

/**
 * first form check
 * @param {} title
 * @param {*} commons
 */
export const firstFormCheck = (title, commons) => {
  let result = false;
  if (commons.name === '') {
    Helper.showToastMessage('Full Name empty', 0);
  } else if (commons.mobile === '') {
    Helper.showToastMessage('Mobile Number empty', 0);
  } else if (
    Number(commons.mobile.length) < 10 ||
    commons.mobile === '9876543210' ||
    commons.mobile === '1234567890'
  ) {
    Helper.showToastMessage('Invalid mobile number', 0);
  } else if (commons.mobile.match(/^[0-9]*$/g) === null) {
    Helper.showToastMessage('Invalid mobile number', 0);
  }
  // else if (
  //     //title !== "Term Insurance" &&
  //     //title !== "Health Insurance" &&
  //     //title !== "Fixed Deposit" &&
  //     //title !== `Life Cum Invt. Plan` &&
  //     //title !== `Motor Insurance` &&
  //     //title !== `Mutual Fund` &&
  //     title !== `Vector Plus` &&
  //     title !== `Home Loan` &&
  //     //title !== `Loan Against Property` &&
  //     //title !== `Personal Loan` &&
  //     //title !== `Business Loan` &&
  //     //title !== `Auto Loan` &&
  //     commons.email === ""
  // ) {
  //     Helper.showToastMessage("Email empty", 0);
  // }
  else if (
    commons.email !== '' &&
    Helper.emailCheck(commons.email) === false
    //!commons.email.includes("@")
  ) {
    Helper.showToastMessage('Invalid Email', 0);
  } else if (
    //title !== `Personal Loan` &&
    //title !== `Home Loan` &&
    //title !== `Loan Against Property` &&
    //title !== `Business Loan` &&
    //title !== `Auto Loan` &&
    //title !== `Motor Insurance` &&
    //commons.currentlocation === ""
    commons.pincode == ''
  ) {
    //Helper.showToastMessage("Please, Select Current Location", 0);
    Helper.showToastMessage('Please, Enter Current Residence Pincode', 0);
  } else if (commons.pincode !== '' && commons.pincode < 6) {
    Helper.showToastMessage('Invalid Pincode', 0);
  } else if (
    // title !== `Personal Loan` &&
    // title !== `Home Loan` &&
    // title !== `Loan Against Property` &&
    // title !== `Business Loan` &&
    // title !== `Auto Loan` &&
    //title !== `Motor Insurance` &&
    //commons.currentlocation === ""
    commons.pincode !== '' &&
    (commons.state === '' || commons.currentlocation === '')
  ) {
    //Helper.showToastMessage("Please, Select Current Location", 0);
    Helper.showToastMessage(
      'Failed to find city & state, Please, check pincode',
      0,
    );
  }
  // else if (
  //     title !== "Fixed Deposit" &&
  //     title !== `Mutual Fund` &&
  //     title !== `Home Loan` &&
  //     //title !== `Loan Against Property` &&
  //     title !== `Personal Loan` &&
  //     //title !== `Business Loan` &&
  //     //title !== `Auto Loan` &&
  //     title !== `Life Cum Invt. Plan` &&
  //     title !== 'Motor Insurance' &&
  //     (commons.dob === "" || commons.dob === `Date of Birth *` || commons.dob === `Date of Birth`)
  // ) {
  //     Helper.showToastMessage("Date of Birth empty", 0);
  // }
  else if (
    title === 'Health Insurance' &&
    (commons.dob === '' ||
      commons.dob === `Date of Birth *` ||
      commons.dob === `Date of Birth`)
  ) {
    Helper.showToastMessage('Date of Birth empty', 0);
  } else if (
    //title !== `Personal Loan` &&
    //title !== `Loan Against Property` &&
    //title !== `Home Loan` &&
    //title !== `Business Loan` &&
    //title !== `Auto Loan` &&
    title !== `Motor Insurance` &&
    //title !== `Insure Check` &&
    commons.gender === ''
  ) {
    Helper.showToastMessage('Please, Select Gender', 0);
  }
  // else if (
  //     (title === "Term Insurance" ||
  //         title === "Health Insurance") &&
  //     commons.qualification === ""
  // ) {
  //     Helper.showToastMessage("Please, Select Qualification", 0);
  // } else if (
  //     title !== `Personal Loan` &&
  //     title !== "Fixed Deposit" &&
  //     title !== "Business Loan" &&
  //     title !== `Motor Insurance` &&
  //     title !== `Mutual Fund` &&
  //     title !== `Vector Plus` &&
  //     title !== `Home Loan` &&
  //     //title !== `Loan Against Property` &&
  //     //title !== `Auto Loan` &&
  //     title !== `Life Cum Invt. Plan` &&
  //     title !== `Insure Check` &&
  //     commons.employ === ""
  // ) {
  //     Helper.showToastMessage("Please, Select Employment Type", 0);
  // }
  else {
    result = true;
  }
  return result;
};

/**
 * second form check
 * @param {} title
 * @param {*} commons
 */
export const secondFormCheck = (title, specificForms) => {
  let result = true;
  if (title === `Health Insurance` && specificForms.required_cover === '') {
    result = false;
    Helper.showToastMessage('Please, Select Required Cover', 0);
  } else if (
    specificForms.pancardNo !== '' &&
    !Helper.checkPanCard(specificForms.pancardNo)
  ) {
    result = false;
    Helper.showToastMessage('Invalid pan card number', 0);
  } else if (
    specificForms.aadharcardNo !== undefined &&
    specificForms.aadharcardNo !== '' &&
    specificForms.aadharcardNo.length < 12
  ) {
    result = false;
    Helper.showToastMessage('Invalid aadhar card number', 0);
  } else if (title === `Health Insurance` && specificForms.claim_type === '') {
    result = false;
    Helper.showToastMessage('Please, Select Type Of Insurance', 0);
  } else if (
    title === `Health Insurance` &&
    specificForms.claim_type === 'Family Floater'
  ) {
    if (specificForms.family_floater === '') {
      result = false;
      Helper.showToastMessage('Please, Select Family Floater', 0);
    } else {
      if (
        specificForms !== null &&
        specificForms.floaterItemList !== undefined &&
        specificForms.floaterItemList !== null
      ) {
        const floaterItemList = JSON.parse(
          JSON.stringify(specificForms.floaterItemList),
        );
        if (floaterItemList.length > 0) {
          let checker = false;
          for (let index = 0; index < floaterItemList.length; index++) {
            const element = floaterItemList[index];
            const {
              name,
              gender,
              dob,
              relation,
              diseases,
              existing_diseases,
            } = element;
            if (
              name === '' ||
              gender === '' ||
              dob === '' ||
              relation === '' ||
              existing_diseases === ''
            ) {
              checker = true;
            } else if (existing_diseases === 'Yes' && diseases === '') {
              checker = true;
            }
          }
          if (checker === true) {
            result = false;
            Helper.showToastMessage('Please, Fill all member details', 0);
          }
        }
      }
    }
  }
  return result;
  if (
    title !== `Personal Loan` &&
    title !== `Loan Against Property` &&
    title !== `Home Loan` &&
    title !== 'Credit Card' &&
    title !== 'Health Insurance' &&
    title !== 'Life Cum Invt. Plan' &&
    title !== `Motor Insurance` &&
    title !== `Vector Plus` &&
    title !== `Business Loan` &&
    title !== `Auto Loan` &&
    title !== `Insure Check` &&
    title !== `Term Insurance` &&
    specificForms.amount === ``
  ) {
    result = false;
    Helper.showToastMessage(
      title === 'Term Insurance'
        ? 'Required Cover empty'
        : title === 'Home Loan' ||
          title === 'Loan Against Property' ||
          title === `Personal Loan` ||
          title === `Business Loan`
        ? `Desired Amount empty`
        : `Investment Amount empty`,
      0,
    );
  } else if (
    title !== `Personal Loan` &&
    title !== `Loan Against Property` &&
    title !== `Home Loan` &&
    title !== 'Health Insurance' &&
    title !== 'Fixed Deposit' &&
    title !== 'Life Cum Invt. Plan' &&
    title !== `Motor Insurance` &&
    title !== `Mutual Fund` &&
    title !== `Term Insurance` &&
    title !== `Vector Plus` &&
    title !== `Business Loan` &&
    title !== `Auto Loan` &&
    title !== `Insure Check` &&
    specificForms.existingcard === ``
  ) {
    result = false;
    Helper.showToastMessage('Select Existing Card/Loan', 0);
  } else if (
    //(title === "Home Loan" ||
    title === 'Business Loan' &&
    //|| title === "Personal Loan")
    specificForms.company === ''
  ) {
    result = false;
    Helper.showToastMessage('Company name empty', 0);
  } else if (
    //(title == "Home Loan" ||
    title === 'Business Loan' &&
    //|| title === "Personal Loan")
    specificForms.turnover === ''
  ) {
    result = false;
    Helper.showToastMessage('Annual Turnover empty', 0);
  } else if (
    //(title === "Home Loan" ||
    title === 'Business Loan' &&
    //|| title === "Personal Loan")
    specificForms.turnover.length < 2
  ) {
    result = false;
    Helper.showToastMessage('Invalid turnover', 0);
  } else if (
    //title === "Home Loan" ||
    (title === 'Business Loan' || title === 'Loan Against Property') &&
    //|| title === "Personal Loan"
    specificForms.amount === ''
  ) {
    result = false;
    Helper.showToastMessage('Desired Amount empty', 0);
  } else if (
    //title === "Home Loan" ||
    (title === 'Business Loan' || title === 'Loan Against Property') &&
    //|| title === "Personal Loan"
    specificForms.amount.length < 2
  ) {
    result = false;
    Helper.showToastMessage('Invalid desired amount', 0);
  } else if (
    //(
    //title === "Home Loan" ||
    title === 'Business Loan' &&
    //|| title === 'Loan Against Property'
    //|| title === "Personal Loan"
    //)
    specificForms.pancardNo === ''
  ) {
    result = false;
    Helper.showToastMessage('Pancard number empty', 0);
  } else if (
    specificForms.pancardNo !== '' &&
    !Helper.checkPanCard(specificForms.pancardNo)
  ) {
    result = false;
    Helper.showToastMessage('Invalid pan card number', 0);
  } else if (
    //(
    //title === "Home Loan" ||
    title === 'Business Loan' &&
    //|| title === 'Loan Against Property'
    //|| title === "Personal Loan"
    //)
    specificForms.aadharcardNo === ''
  ) {
    result = false;
    Helper.showToastMessage('Aadhar card number empty', 0);
  } else if (
    //(
    //title === "Home Loan" ||
    title === 'Business Loan' &&
    //|| title === 'Loan Against Property'
    //|| title === "Personal Loan"
    //)
    specificForms.aadharcardNo !== undefined &&
    specificForms.aadharcardNo !== '' &&
    specificForms.aadharcardNo.length < 12
  ) {
    result = false;
    Helper.showToastMessage('Invalid aadhar card number', 0);
  } else if (
    //(
    //title === "Home Loan" ||
    title === 'Business Loan' &&
    //|| title === 'Loan Against Property'
    //|| title === "Personal Loan"
    //)
    specificForms.type_loan === ''
  ) {
    result = false;
    Helper.showToastMessage('Select Type of Loan', 0);
  } else if (
    //(
    //title === "Home Loan" ||
    title === 'Business Loan' &&
    //|| title === 'Loan Against Property'
    //|| title === "Personal Loan"
    //)
    specificForms.existingcard === ''
  ) {
    result = false;
    Helper.showToastMessage('Select Existing Card/Loan', 0);
  } else if (
    //(
    //title === "Home Loan" ||
    title === 'Business Loan' &&
    //|| title === 'Loan Against Property'
    //|| title === "Personal Loan"
    //)
    specificForms.companylocation === ''
  ) {
    result = false;
    Helper.showToastMessage('Please, Select Company Location', 0);
  } else if (
    //( title === 'Home Loan'||
    title === 'Loan Against Property' &&
    //)
    specificForms.lppincode === ''
  ) {
    result = false;
    Helper.showToastMessage('Please, Enter Loan Property Pincode', 0);
    //Helper.showToastMessage("Loan property pincode empty", 0);
  } else if (
    //( title === 'Home Loan'||
    title === 'Loan Against Property' &&
    //)
    specificForms.lppincode !== '' &&
    specificForms.lppincode.length < 6
  ) {
    result = false;
    Helper.showToastMessage('Please, Correct Loan Property Pincode', 0);
    //Helper.showToastMessage("Loan property pincode empty", 0);
  } else if (
    //( title === 'Home Loan'||
    title === 'Loan Against Property' &&
    //)
    specificForms.lppincode !== '' &&
    (specificForms.loan_property_city === '' || specificForms.homestate === '')
  ) {
    result = false;
    Helper.showToastMessage(
      'Failed to find city & state, Please, check loan property pincode',
      0,
    );
  } else if (
    //( title === 'Home Loan'||
    title === 'Loan Against Property' &&
    //)
    specificForms.loan_property_address === ''
  ) {
    result = false;
    Helper.showToastMessage('Property Address empty', 0);
  } else if (
    title === 'Life Cum Invt. Plan' &&
    specificForms.investment_amount === ''
  ) {
    result = false;
    Helper.showToastMessage('Investment Amount empty', 0);
  } else if (
    title === 'Life Cum Invt. Plan' &&
    specificForms.aadharcardNo !== undefined &&
    specificForms.aadharcardNo !== '' &&
    specificForms.aadharcardNo.length < 12
  ) {
    result = false;
    Helper.showToastMessage('Invalid aadhar card number', 0);
  } else if (
    title === 'Life Cum Invt. Plan' &&
    specificForms.pancardNo !== '' &&
    !Helper.checkPanCard(specificForms.pancardNo)
  ) {
    result = false;
    Helper.showToastMessage('Invalid pan card number', 0);
  } else {
    if (title === 'Motor Insurance') {
      if (specificForms.claim_type === '') {
        result = false;
        Helper.showToastMessage('Please, Select Any Claims Last Year', 0);
      } else if (specificForms.registration_type === '') {
        result = false;
        Helper.showToastMessage('Please, Select Registration Type', 0);
      } else if (specificForms.vehicle_type === '') {
        result = false;
        Helper.showToastMessage('Please, Select Vehicle Type', 0);
      } else if (specificForms.motor_type === '') {
        result = false;
        Helper.showToastMessage('Please, Select Motor Type', 0);
      }

      // else if (specificForms.car_type === "") {
      //   result = false;
      //   Helper.showToastMessage("Please, Select Car Type", 0);
      // }
      else if (
        specificForms.insurance === `` ||
        specificForms.insurance === `Select Insurance Type *`
      ) {
        result = false;
        Helper.showToastMessage('Please, Select Insurance Type', 0);
      }
      // else {
      //     if (specificForms.aadharcardNo !== undefined && specificForms.aadharcardNo !== "" && specificForms.aadharcardNo.length < 12) {
      //         result = false;
      //         Helper.showToastMessage("Invalid aadhar card number", 0);
      //     } else if (
      //         specificForms.pancardNo !== "" &&
      //         !Helper.checkPanCard(specificForms.pancardNo)
      //     ) {
      //         result = false;
      //         Helper.showToastMessage("Invalid pan card number", 0);
      //     }
      // }
    } else if (title === 'Vector Plus') {
      //required_cover
      if (
        specificForms.claim_type === `` ||
        specificForms.claim_type === `Select Insurance Type *`
      ) {
        result = false;
        Helper.showToastMessage('Select Insurance Type', 0);
      } else if (specificForms.required_cover === '') {
        result = false;
        Helper.showToastMessage('Select Required Cover', 0);
      } else {
        if (
          specificForms.aadharcardNo !== undefined &&
          specificForms.aadharcardNo !== '' &&
          specificForms.aadharcardNo.length < 12
        ) {
          result = false;
          Helper.showToastMessage('Invalid aadhar card number', 0);
        } else if (
          specificForms.pancardNo !== '' &&
          !Helper.checkPanCard(specificForms.pancardNo)
        ) {
          result = false;
          Helper.showToastMessage('Invalid pan card number', 0);
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
    } else if (title === 'Auto Loan') {
      if (specificForms.company === '') {
        result = false;
        Helper.showToastMessage('Company name empty', 0);
      } else if (specificForms.turnover === '') {
        result = false;
        Helper.showToastMessage('Annual Turnover empty', 0);
      } else if (specificForms.turnover.length < 2) {
        result = false;
        Helper.showToastMessage('Invalid turnover', 0);
      } else if (specificForms.amount === '') {
        result = false;
        Helper.showToastMessage('Desired Amount empty', 0);
      } else if (
        specificForms.amount !== '' &&
        specificForms.amount.length < 2
      ) {
        result = false;
        Helper.showToastMessage('Invalid Desired Amount', 0);
      } else if (specificForms.pancardNo === '') {
        result = false;
        Helper.showToastMessage('Pancard number empty', 0);
      } else if (
        specificForms.pancardNo !== '' &&
        !Helper.checkPanCard(specificForms.pancardNo)
      ) {
        result = false;
        Helper.showToastMessage('Invalid pan card number', 0);
      } else if (
        specificForms.aadharcardNo !== undefined &&
        specificForms.aadharcardNo === ''
      ) {
        result = false;
        Helper.showToastMessage('Aadhar card number empty', 0);
      } else if (
        specificForms.aadharcardNo !== undefined &&
        specificForms.aadharcardNo !== '' &&
        specificForms.aadharcardNo.length < 12
      ) {
        result = false;
        Helper.showToastMessage('Invalid aadhar card number', 0);
      } else if (specificForms.rcbook === '') {
        result = false;
        Helper.showToastMessage('Car RC number empty', 0);
      } else if (specificForms.model === '') {
        result = false;
        Helper.showToastMessage('Car Model number empty', 0);
      } else if (specificForms.nooldcard === '') {
        result = false;
        Helper.showToastMessage('Select Type of Loan', 0);
      } else if (specificForms.ownership === '') {
        result = false;
        Helper.showToastMessage('Select Type of Ownership', 0);
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
    } else if (title === 'Term Insurance' || title === `Health Insurance`) {
      if (specificForms.turnover === '') {
        result = false;
        Helper.showToastMessage('Annual Turnover Empty', 0);
      } else if (
        title === `Health Insurance` &&
        specificForms.required_cover === ''
      ) {
        result = false;
        Helper.showToastMessage('Please, Select Required Cover', 0);
      } else if (title === `Term Insurance` && specificForms.amount === '') {
        result = false;
        Helper.showToastMessage('Required Cover Empty', 0);
      } else if (
        title === `Term Insurance` &&
        specificForms.amount !== '' &&
        specificForms.amount.length < 2
      ) {
        result = false;
        Helper.showToastMessage('Invalid Required Cover', 0);
      } else if (specificForms.lifestyle === '') {
        result = false;
        Helper.showToastMessage('Please, Select Smoker Type', 0);
      } else if (specificForms.lifestyle2 === '') {
        result = false;
        Helper.showToastMessage('Please, Select Alcohol Consumption Type', 0);
      } else if (specificForms.existing_diseases === '') {
        result = false;
        Helper.showToastMessage('Select Existing Disease', 0);
      } else if (
        title === `Term Insurance` &&
        specificForms.payment_mode === '' &&
        specificForms.diseases === ''
      ) {
        result = false;
        Helper.showToastMessage('Please, Select Preferred Payment Mode', 0);
      } else if (title === `Term Insurance` && specificForms.pay_type === '') {
        result = false;
        Helper.showToastMessage('Please, Select Pay Type', 0);
      } else if (
        title === `Term Insurance` &&
        specificForms.policy_term === ''
      ) {
        result = false;
        Helper.showToastMessage('Please, Select Policy Term', 0);
      } else if (title === `Term Insurance` && specificForms.addons === '') {
        result = false;
        Helper.showToastMessage('Please, Select Addons Type', 0);
      } else if (
        title === `Health Insurance` &&
        specificForms.claim_type === ''
      ) {
        result = false;
        Helper.showToastMessage('Please, Select Type Of Insurance', 0);
      } else if (
        specificForms.existing_diseases === 'YES' &&
        specificForms.diseases === ''
      ) {
        result = false;
        Helper.showToastMessage('Please, Specify diseases', 0);
      } else if (
        title === `Health Insurance` &&
        specificForms.claim_type === 'Family Floater'
      ) {
        if (specificForms.family_floater === '') {
          result = false;
          Helper.showToastMessage('Please, Select Family Floater', 0);
        } else {
          if (
            specificForms !== null &&
            specificForms.floaterItemList !== undefined &&
            specificForms.floaterItemList !== null
          ) {
            const floaterItemList = JSON.parse(
              JSON.stringify(specificForms.floaterItemList),
            );
            //console.log('floaterItemList', floaterItemList)
            if (floaterItemList.length > 0) {
              let checker = false;
              for (let index = 0; index < floaterItemList.length; index++) {
                const element = floaterItemList[index];
                const {
                  name,
                  gender,
                  dob,
                  relation,
                  diseases,
                  existing_diseases,
                } = element;
                if (
                  name === '' ||
                  gender === '' ||
                  dob === '' ||
                  relation === '' ||
                  existing_diseases === ''
                ) {
                  checker = true;
                } else if (existing_diseases === 'Yes' && diseases === '') {
                  checker = true;
                }
              }
              //console.log('checker',checker)
              if (checker === true) {
                result = false;
                Helper.showToastMessage('Please, Fill all member details', 0);
              } else {
                if (
                  specificForms.aadharcardNo !== undefined &&
                  specificForms.aadharcardNo !== '' &&
                  specificForms.aadharcardNo.length < 12
                ) {
                  result = false;
                  Helper.showToastMessage('Invalid aadhar card number', 0);
                } else if (
                  specificForms.pancardNo !== '' &&
                  !Helper.checkPanCard(specificForms.pancardNo)
                ) {
                  result = false;
                  Helper.showToastMessage('Invalid pan card number', 0);
                }
              }
            }
          }
        }
      } else {
        if (
          specificForms.aadharcardNo !== undefined &&
          specificForms.aadharcardNo !== '' &&
          specificForms.aadharcardNo.length < 12
        ) {
          result = false;
          Helper.showToastMessage('Invalid aadhar card number', 0);
        } else if (
          specificForms.pancardNo !== '' &&
          !Helper.checkPanCard(specificForms.pancardNo)
        ) {
          result = false;
          Helper.showToastMessage('Invalid pan card number', 0);
        }
      }
    } else if (title === `Auto Loan`) {
      if (specificForms.turnover === '') {
        result = false;
        Helper.showToastMessage('Annual Turnover empty', 0);
      } else if (
        title !== `Business Loan` &&
        title !== `Personal Loan` &&
        (specificForms.loan_property_city === '' ||
          specificForms.loan_property_city === `Select Loan Property City *`)
      ) {
        result = false;
        Helper.showToastMessage('Select Loan Property city', 0);
      } else if (
        (title === `Personal Loan` || title === `Business Loan`) &&
        specificForms.type_loan === ``
      ) {
        result = false;
        Helper.showToastMessage('Select Type of Loan', 0);
      } else {
        if (
          specificForms.aadharcardNo !== undefined &&
          specificForms.aadharcardNo !== '' &&
          specificForms.aadharcardNo.length < 12
        ) {
          result = false;
          Helper.showToastMessage('Invalid aadhar card number', 0);
        } else if (
          specificForms.pancardNo !== '' &&
          !Helper.checkPanCard(specificForms.pancardNo)
        ) {
          result = false;
          Helper.showToastMessage('Invalid pan card number', 0);
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
    } else if (
      title === 'Insure Check' &&
      specificForms.type_insurance === ''
    ) {
      result = false;
      Helper.showToastMessage('Please, Select Type of Insurance', 0);
    } else if (
      title === 'Insure Check' &&
      specificForms.type_insurance === 'Life Insurance' &&
      specificForms.life_sum_assured === ''
    ) {
      result = false;
      Helper.showToastMessage('Please, Enter Sum Assured', 0);
    } else if (
      title === 'Insure Check' &&
      specificForms.type_insurance === 'Health Insurance' &&
      specificForms.health_sum_assured === ''
    ) {
      result = false;
      Helper.showToastMessage('Please, Enter Sum Assured', 0);
    } else if (
      title === 'Insure Check' &&
      specificForms.type_insurance === 'Health Insurance' &&
      specificForms.health_sum_assured !== '' &&
      specificForms.health_sum_assured.length < 2
    ) {
      result = false;
      Helper.showToastMessage('Please, Invalid Sum Assured', 0);
    } else if (
      title === 'Insure Check' &&
      specificForms.type_insurance === 'Life Insurance' &&
      specificForms.life_company === ''
    ) {
      result = false;
      Helper.showToastMessage('Please, Select Life Policy Company', 0);
    } else if (
      title === 'Insure Check' &&
      specificForms.type_insurance === 'Health Insurance' &&
      specificForms.health_company === ''
    ) {
      result = false;
      Helper.showToastMessage('Please, Select Health Policy Company', 0);
    } else if (title === 'Insure Check' && specificForms.turnover === '') {
      result = false;
      Helper.showToastMessage('Annual Turnover Empty', 0);
    } else if (
      specificForms.aadharcardNo !== undefined &&
      specificForms.aadharcardNo !== '' &&
      specificForms.aadharcardNo.length < 12
    ) {
      result = false;
      Helper.showToastMessage('Invalid aadhar card number', 0);
    } else if (
      specificForms.pancardNo !== '' &&
      !Helper.checkPanCard(specificForms.pancardNo)
    ) {
      result = false;
      Helper.showToastMessage('Invalid pan card number', 0);
    }
  }
  return result;
};

/**
 * edit lead
 * @param {*} item
 */
export const constructObjEditLead = item => {
  const {name, mobile, product, bank, alldata} = item;

  let {
    id,
    email,
    dob,
    gender,
    currentlocation,
    pincode,
    damount,
    pan_card,
    aadhar_card,
    baa,
    pancard_no,
    aadharcard_no,
    company,
    employment_type,
    employ_type,
    lifestyle,
    qualification,
    state,
    remark,
    rc_copy,
    old_insc_copy,
    puc_copy,
    six_salaru_s,
    bank_state,
    insurance,
    car_brand,
    car_value,
    reg_no,
    turnover,
    vehicle_type,
    motor_type,
    expiry_date,
    ownership,
    claim_type,
    required_cover,
    existingcard,
    loan_property_city,
    rcbook,
    model,
    nooldcard,
    family_floater,
    investment_amount,
    marital_status,
    profession,
    type_loan,
    lifestyle2,
    existing_diseases,
    payment_mode,
    loan_property_address,
    homestate,
    registration_type,
    health_company,
    health_sum_assured,
    life_sum_assured,
    life_company,
    policy_term,
    pay_type,
    addons,
    diseases,
    car_type,
    dependent,
    type_insurance,
    companylocation,
    policycopy,
    floater_name,
    floater_dob,
    floater_relation,
    floater_gender,
    existing_diseases1,
    diseases1,
    floater_name2,
    floater_dob2,
    floater_relation2,
    floater_gender2,
    existing_diseases2,
    diseases2,
    floater_name3,
    floater_dob3,
    floater_relation3,
    floater_gender3,
    existing_diseases3,
    diseases3,
    floater_name4,
    floater_dob4,
    floater_relation4,
    floater_gender4,
    existing_diseases4,
    diseases4,
    loan_type,
    lpstate,
    cap_aadhar,
    pop_electricity,
    current_loan_repayment_statement,
    other,
    passport_photo,
    proof_of_property,
    exisitng_loan_doc,
    current_add_proof,
    eaadharcard
  } = alldata;

  let salarySlip = null,
    salarySlip1 = null,
    salarySlip2 = null,
    salarySlip3 = null,
    salarySlip4 = null,
    salarySlip5 = null;
  let floaterItemList = [];

  if (Helper.nullStringCheck(six_salaru_s) === false) {
    const split = String(six_salaru_s)
      .trim()
      .split(',');
    if (split.length === 1) {
      salarySlip = split[0];
    } else if (split.length === 2) {
      salarySlip = split[0];
      salarySlip1 = split[1];
    } else if (split.length === 3) {
      salarySlip = split[0];
      salarySlip1 = split[1];
      salarySlip2 = split[2];
    } else if (split.length === 4) {
      salarySlip = split[0];
      salarySlip1 = split[1];
      salarySlip2 = split[2];
      salarySlip3 = split[3];
    } else if (split.length === 5) {
      salarySlip = split[0];
      salarySlip1 = split[1];
      salarySlip2 = split[2];
      salarySlip3 = split[3];
      salarySlip4 = split[4];
    } else if (split.length === 6) {
      salarySlip = split[0];
      salarySlip1 = split[1];
      salarySlip2 = split[2];
      salarySlip3 = split[3];
      salarySlip4 = split[4];
      salarySlip5 = split[5];
    }
  }

  if (Helper.nullStringCheck(family_floater) === false) {
    floaterItemList = [
      {
        id: 1,
        name: Helper.nullStringCheckWithReturn(floater_name),
        gender: Helper.nullStringCheckWithReturn(floater_gender),
        dob: Helper.nullStringCheckWithReturn(floater_dob),
        relation: Helper.nullStringCheckWithReturn(floater_relation),
        existing_diseases: Helper.nullStringCheckWithReturn(existing_diseases1),
        diseases: Helper.nullStringCheckWithReturn(diseases1),
      },
      {
        id: 2,
        name: Helper.nullStringCheckWithReturn(floater_name2),
        gender: Helper.nullStringCheckWithReturn(floater_gender2),
        dob: Helper.nullStringCheckWithReturn(floater_dob2),
        relation: Helper.nullStringCheckWithReturn(floater_relation2),
        existing_diseases: Helper.nullStringCheckWithReturn(existing_diseases2),
        diseases: Helper.nullStringCheckWithReturn(diseases2),
      },
      {
        id: 3,
        name: Helper.nullStringCheckWithReturn(floater_name3),
        gender: Helper.nullStringCheckWithReturn(floater_gender3),
        dob: Helper.nullStringCheckWithReturn(floater_dob3),
        relation: Helper.nullStringCheckWithReturn(floater_relation3),
        existing_diseases: Helper.nullStringCheckWithReturn(existing_diseases3),
        diseases: Helper.nullStringCheckWithReturn(diseases3),
      },
      {
        id: 4,
        name: Helper.nullStringCheckWithReturn(floater_name4),
        gender: Helper.nullStringCheckWithReturn(floater_gender4),
        dob: Helper.nullStringCheckWithReturn(floater_dob4),
        relation: Helper.nullStringCheckWithReturn(floater_relation4),
        existing_diseases: Helper.nullStringCheckWithReturn(existing_diseases4),
        diseases: Helper.nullStringCheckWithReturn(diseases4),
      },
    ];

    if (family_floater === `2 Adult` || family_floater === `1 Adult 1 Child`) {
      floaterItemList.length = 1;
    } else if (
      family_floater === `2 Adult 1 Child` ||
      family_floater === `1 Adult 2 Children`
    ) {
      floaterItemList.length = 2;
    } else if (
      family_floater === `2 Adult 2 Children` ||
      family_floater === `1 Adult 3 Children`
    ) {
      floaterItemList.length = 3;
    } else if (family_floater === `2 Adult 3 Children`) {
      floaterItemList.length = 4;
    }
  }

  //console.log('floaterItemList', floaterItemList)

  const formname = String(product)
    .replace(/ /g, '_')
    .toLowerCase();

  //console.log('formname', formname)

  const count = Number(id);

  let empType = '';

  if (Helper.nullStringCheck(employ_type) === false) {
    empType = employ_type;
  } else if (Helper.nullStringCheck(employment_type) === false) {
    empType = employment_type;
  }

  let aadharcardnos = Helper.nullStringCheckWithReturn(aadharcard_no);

  if (aadharcardnos === '0') {
    aadharcardnos = '';
  }

  let multipleFilesList = [
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names:["","","","","","","","","","","","","","","","","","","","","","","","","","",]
    },
  ];

  const fileurls = `${Pref.ErbFinorbitFormUrl}${formname}`;

  let Pancard = null;
  if (Helper.nullCheck(pan_card) === false) {
    if (Helper.separatorReg(pan_card)) {
      const splitPancard = pan_card.split(',').map(x => {
        return `${fileurls}/pancard/${x}`;
      });
      Pancard = splitPancard[0];
      multipleFilesList[0].downloadUrl = splitPancard;
      multipleFilesList[0].count = splitPancard.length - 1;
      multipleFilesList[0].filled = new Array(splitPancard.length - 1).fill(
        1,
        0,
        splitPancard.length - 1,
      );
    } else {
      Pancard = `${fileurls}/pancard/${pan_card}`;
    }
  }

  let Aadharcard = null;
  if (Helper.nullCheck(aadhar_card) === false) {
    if (Helper.separatorReg(aadhar_card)) {
      let splitPancard = aadhar_card.split(',').map(x => {
        return `${fileurls}/aadharcard/${x}`;
      });
      Aadharcard = splitPancard[0];
      multipleFilesList[1].downloadUrl = splitPancard;
      multipleFilesList[1].count = splitPancard.length - 2;
      multipleFilesList[1].filled = new Array(splitPancard.length - 2).fill(
        1,
        0,
        splitPancard.length - 1,
      );
    } else {
      Aadharcard = `${fileurls}/aadharcard/${aadhar_card}`;
    }
  }

  let SalarySlip = null;
  if (Helper.nullCheck(six_salaru_s) === false) {
    if (Helper.separatorReg(six_salaru_s)) {
      const splitPancard = six_salaru_s.split(',').map(x => {
        return `${fileurls}/salaryslip/${x}`;
      });
      SalarySlip = splitPancard[0];
      multipleFilesList[2].downloadUrl = splitPancard;
      multipleFilesList[2].count = splitPancard.length - 1;
      multipleFilesList[2].filled = new Array(splitPancard.length - 1).fill(
        1,
        0,
        splitPancard.length - 1,
      );
    } else {
      SalarySlip = `${fileurls}/salaryslip/${six_salaru_s}`;
    }
  }

  let BankState = null;
  if (Helper.nullCheck(bank_state) === false) {
    if (Helper.separatorReg(bank_state)) {
      const splitPancard = bank_state.split(',').map(x => {
        return `${fileurls}/bankstate/${x}`;
      });
      BankState = splitPancard[0];
      multipleFilesList[3].downloadUrl = splitPancard;
      multipleFilesList[3].count = splitPancard.length - 1;
      multipleFilesList[3].filled = new Array(splitPancard.length - 1).fill(
        1,
        0,
        splitPancard.length - 1,
      );
    } else {
      BankState = `${fileurls}/bankstate/${bank_state}`;
    }
  }

  let RcCopy = null;
  if (Helper.nullCheck(rc_copy) === false) {
    if (Helper.separatorReg(rc_copy)) {
      const splitPancard = rc_copy.split(',').map(x => {
        return `${fileurls}/rcbookcopy/${x}`;
      });
      RcCopy = splitPancard[0];
      multipleFilesList[4].downloadUrl = splitPancard;
      multipleFilesList[4].count = splitPancard.length - 1;
      multipleFilesList[4].filled = new Array(splitPancard.length - 1).fill(
        1,
        0,
        splitPancard.length - 1,
      );
    } else {
      RcCopy = `${fileurls}/rcbookcopy/${rc_copy}`;
    }
  }

  let OldInsCopy = null;
  if (Helper.nullCheck(old_insc_copy) === false) {
    if (Helper.separatorReg(old_insc_copy)) {
      const splitPancard = old_insc_copy.split(',').map(x => {
        return `${fileurls}/oldinsurancecopy/${x}`;
      });
      OldInsCopy = splitPancard[0];
      multipleFilesList[6].downloadUrl = splitPancard;
      multipleFilesList[6].count = splitPancard.length - 1;
      multipleFilesList[6].filled = new Array(splitPancard.length - 1).fill(
        1,
        0,
        splitPancard.length - 1,
      );
    } else {
      OldInsCopy = `${fileurls}/oldinsurancecopy/${old_insc_copy}`;
    }
  }

  let PucyCopy = null;
  if (Helper.nullCheck(puc_copy) === false) {
    if (Helper.separatorReg(puc_copy)) {
      const splitPancard = puc_copy.split(',').map(x => {
        return `${fileurls}/puccopy/${x}`;
      });
      PucyCopy = splitPancard[0];
      multipleFilesList[7].downloadUrl = splitPancard;
      multipleFilesList[7].count = splitPancard.length - 1;
      multipleFilesList[7].filled = new Array(splitPancard.length - 1).fill(
        1,
        0,
        splitPancard.length - 1,
      );
    } else {
      PucyCopy = `${fileurls}/puccopy/${puc_copy}`;
    }
  }

  let Policycopy = null;
  if (Helper.nullCheck(policycopy) === false) {
    if (Helper.separatorReg(policycopy)) {
      const splitPancard = policycopy.split(',').map(x => {
        return `${fileurls}/policycopy/${x}`;
      });
      Policycopy = splitPancard[0];
      multipleFilesList[5].downloadUrl = splitPancard;
      multipleFilesList[5].count = splitPancard.length - 1;
      multipleFilesList[5].filled = new Array(splitPancard.length - 1).fill(
        1,
        0,
        splitPancard.length - 1,
      );
    } else {
      Policycopy = `${fileurls}/policycopy/${policycopy}`;
    }
  }

  let CapAadhar = null;
  if (Helper.nullCheck(cap_aadhar) === false) {
    if (Helper.separatorReg(cap_aadhar)) {
      const splitPancard = cap_aadhar.split(',').map(x => {
        return `${fileurls}/cap_aadhar/${x}`;
      });
      CapAadhar = splitPancard[0];
      multipleFilesList[10].downloadUrl = splitPancard;
      multipleFilesList[10].count = splitPancard.length - 1;
      multipleFilesList[10].filled = new Array(splitPancard.length - 1).fill(
        1,
        0,
        splitPancard.length - 1,
      );
    } else {
      CapAadhar = `${fileurls}/cap_aadhar/${cap_aadhar}`;
    }
  }

  let Popelectricity = null;
  if (Helper.nullCheck(pop_electricity) === false) {
    if (Helper.separatorReg(pop_electricity)) {
      const splitPancard = pop_electricity.split(',').map(x => {
        return `${fileurls}/pop_electricity/${x}`;
      });
      Popelectricity = splitPancard[0];
      multipleFilesList[18].downloadUrl = splitPancard;
      multipleFilesList[18].count = splitPancard.length - 1;
      multipleFilesList[18].filled = new Array(splitPancard.length - 1).fill(
        1,
        0,
        splitPancard.length - 1,
      );
    } else {
      Popelectricity = `${fileurls}/pop_electricity/${pop_electricity}`;
    }
  }

  let CurrentLoan = null;
  if (Helper.nullCheck(current_loan_repayment_statement) === false) {
    if (Helper.separatorReg(current_loan_repayment_statement)) {
      const splitPancard = current_loan_repayment_statement
        .split(',')
        .map(x => {
          return `${fileurls}/current_loan_repayment_statement/${x}`;
        });
      CurrentLoan = splitPancard[0];
      multipleFilesList[21].downloadUrl = splitPancard;
      multipleFilesList[21].count = splitPancard.length - 1;
      multipleFilesList[21].filled = new Array(splitPancard.length - 1).fill(
        1,
        0,
        splitPancard.length - 1,
      );
    } else {
      CurrentLoan = `${fileurls}/current_loan_repayment_statement/${current_loan_repayment_statement}`;
    }
  }

  let Other = null;
  if (Helper.nullCheck(other) === false) {
    if (Helper.separatorReg(other)) {
      const splitPancard = other.split(',').map(x => {
        return `${fileurls}/other/${x}`;
      });
      Other = splitPancard[0];
      multipleFilesList[9].downloadUrl = splitPancard;
      multipleFilesList[9].count = splitPancard.length - 1;
      multipleFilesList[9].filled = new Array(splitPancard.length - 1).fill(
        1,
        0,
        splitPancard.length - 1,
      );
    } else {
      Other = `${fileurls}/other/${other}`;
    }
  }

  let passportPhoto = null;
  if(Helper.nullStringCheck(passport_photo) === false){
    passportPhoto =`${fileurls}/passport_photo/${passport_photo}`;
  }


  let ccity = '', cpincode = '', cstate = '',companyLocation = '';
  if(Helper.nullStringCheck(companylocation) === false){
    if(Helper.separatorReg(companylocation)){
      const spx = companylocation.split(',').filter(io => io !== '');
      if(spx.length > 0){
        ccity = spx[0];
        cpincode = spx[2];
        cstate = spx[1];  
      }
    }else{
      companyLocation = companylocation;
    }
  }


  const convertedjsonObj = {
    first: {
      name: Helper.nullStringCheckWithReturn(name),
      pincode: Helper.nullStringCheckWithReturn(pincode),
      currentlocation: Helper.nullStringCheckWithReturn(currentlocation),
      email: Helper.nullStringCheckWithReturn(email),
      mobile: Helper.nullStringCheckWithReturn(mobile),
      gender: Helper.nullStringCheckWithReturn(gender),
      dob: Helper.nullStringCheckWithReturn(dob),
      employ: Helper.nullStringCheckWithReturn(empType),
      ofc_add: '',
      qualification: Helper.nullStringCheckWithReturn(qualification),
      gst_no: '',
      nrelation: '',
      lastName: '',
      nomineename: '',
      emailTypeCd: '',
      contactTypeCd: '',
      state: Helper.nullStringCheckWithReturn(state),
    },
    second: {
      eaadharcardNo:Helper.nullStringCheckWithReturn(eaadharcard),
      // current_add_proof: Helper.nullStringCheckWithReturn(current_add_proof),
      // exisitng_loan_doc: Helper.nullStringCheckWithReturn(exisitng_loan_doc),
      // proof_of_property: Helper.nullStringCheckWithReturn(proof_of_property),
      company: Helper.nullStringCheckWithReturn(company),
      amount: Helper.nullStringCheckWithReturn(damount),
      companylocation:companyLocation,
      ccity:ccity,
      cpincode:cpincode,
      cstate:cstate,
      //companylocation: Helper.nullStringCheckWithReturn(companylocation),
      aadharcardNo: aadharcardnos,
      pancardNo: Helper.nullStringCheckWithReturn(pancard_no),
      turnover: Helper.nullStringCheckWithReturn(turnover),
      nooldcard: Helper.nullStringCheckWithReturn(nooldcard),
      existingcard: Helper.nullStringCheckWithReturn(existingcard),
      loan_property_city: Helper.nullStringCheckWithReturn(loan_property_city),
      rcbook: Helper.nullStringCheckWithReturn(rcbook),
      model: Helper.nullStringCheckWithReturn(model),
      car_brand: Helper.nullStringCheckWithReturn(car_brand),
      car_value: Helper.nullStringCheckWithReturn(car_value),
      reg_no: Helper.nullStringCheckWithReturn(reg_no),
      insurance: Helper.nullStringCheckWithReturn(insurance),
      type_loan: Helper.nullStringCheckWithReturn(type_loan),
      claim_type: Helper.nullStringCheckWithReturn(claim_type),
      required_cover: Helper.nullStringCheckWithReturn(required_cover),
      family_floater: Helper.nullStringCheckWithReturn(family_floater),
      investment_amount: Helper.nullStringCheckWithReturn(investment_amount),
      marital_status: Helper.nullStringCheckWithReturn(marital_status),
      profession: Helper.nullStringCheckWithReturn(profession),
      lifestyle: Helper.nullStringCheckWithReturn(lifestyle),
      lifestyle2: Helper.nullStringCheckWithReturn(lifestyle2),
      payment_mode: Helper.nullStringCheckWithReturn(payment_mode),
      existing_diseases: Helper.nullStringCheckWithReturn(existing_diseases),
      policy_term: Helper.nullStringCheckWithReturn(policy_term),
      pay_type: Helper.nullStringCheckWithReturn(pay_type),
      addons: Helper.nullStringCheckWithReturn(addons),
      diseases: Helper.nullStringCheckWithReturn(diseases),
      car_type: Helper.nullStringCheckWithReturn(car_type),
      dependent: Helper.nullStringCheckWithReturn(dependent),
      type_insurance: Helper.nullStringCheckWithReturn(type_insurance),
      health_sum_assured: Helper.nullStringCheckWithReturn(health_sum_assured),
      life_sum_assured: Helper.nullStringCheckWithReturn(life_sum_assured),
      life_company: Helper.nullStringCheckWithReturn(life_company),
      health_company: Helper.nullStringCheckWithReturn(health_company),
      showInsureCheckList: 0,
      registration_type: Helper.nullStringCheckWithReturn(registration_type),
      vehicle_type: Helper.nullStringCheckWithReturn(vehicle_type),
      motor_type: Helper.nullStringCheckWithReturn(motor_type),
      expiry_date: Helper.nullStringCheckWithReturn(expiry_date),
      ownership: Helper.nullStringCheckWithReturn(ownership),
      pincode: Helper.nullStringCheckWithReturn(pincode),
      homestate: Helper.nullStringCheckWithReturn(homestate),
      loan_property_address: Helper.nullStringCheckWithReturn(loan_property_address),
      floaterItemList: floaterItemList,
      type_loan: Helper.nullStringCheckWithReturn(loan_type),
      homestate: Helper.nullStringCheckWithReturn(lpstate),
    },
    third: {
      existingcard: Helper.nullStringCheckWithReturn(existingcard),
      current_add_proof: Helper.nullStringCheckWithReturn(current_add_proof),
      exisitng_loan_doc: Helper.nullStringCheckWithReturn(exisitng_loan_doc),
      proof_of_property: Helper.nullStringCheckWithReturn(proof_of_property),
      other: Other,
      passportPhoto: passportPhoto,
      cap_aadhar: CapAadhar,
      pop_electricity: Popelectricity,
      current_loan_repayment_statement: CurrentLoan,
      panCard: Pancard,
      aadharCard: Aadharcard,
      salarySlip: SalarySlip,
      bankState: BankState,
      rcCopy: RcCopy,
      oldInsCopy: OldInsCopy,
      pucCopy: PucyCopy,
      policycopy: Policycopy,
      multipleFilesList: multipleFilesList,
    },
    // third: {
    //     panCard: Helper.nullCheck(pan_card) === false ? `${Pref.ErbFinorbitFormUrl}${formname}/pancard/${pan_card}` : null,
    //     aadharCard: Helper.nullCheck(aadhar_card) === false ? `${Pref.ErbFinorbitFormUrl}${formname}/aadharcard/${aadhar_card}` : null,
    //     rcCopy: Helper.nullCheck(rc_copy) === false ? `${Pref.ErbFinorbitFormUrl}${formname}/rcbookcopy/${rc_copy}` : null,
    //     oldInsCopy: Helper.nullCheck(old_insc_copy) === false ? `${Pref.ErbFinorbitFormUrl}${formname}/oldinsurancecopy/${old_insc_copy}` : null,
    //     pucCopy: Helper.nullCheck(puc_copy) === false ? `${Pref.ErbFinorbitFormUrl}${formname}/puccopy/${puc_copy}` : null,
    //     policycopy: Helper.nullCheck(policycopy) === false ? `${Pref.ErbFinorbitFormUrl}${formname}/policycopy/${policycopy}` : null,
    //     salarySlip: Helper.nullCheck(salarySlip) === false ? `${Pref.ErbFinorbitFormUrl}${formname}/salaryslip/${salarySlip}` : null,
    //     salarySlip1: Helper.nullCheck(salarySlip1) === false ? `${Pref.ErbFinorbitFormUrl}${formname}/salaryslip/${salarySlip1}` : null,
    //     salarySlip2: Helper.nullCheck(salarySlip2) === false ? `${Pref.ErbFinorbitFormUrl}${formname}/salaryslip/${salarySlip2}` : null,
    //     salarySlip3: Helper.nullCheck(salarySlip3) === false ? `${Pref.ErbFinorbitFormUrl}${formname}/salaryslip/${salarySlip3}` : null,
    //     salarySlip4: Helper.nullCheck(salarySlip4) === false ? `${Pref.ErbFinorbitFormUrl}${formname}/salaryslip/${salarySlip4}` : null,
    //     salarySlip5: Helper.nullCheck(salarySlip5) === false ? `${Pref.ErbFinorbitFormUrl}${formname}/salaryslip/${salarySlip5}` : null,
    //     bankState: Helper.nullCheck(bank_state) === false ? `${Pref.ErbFinorbitFormUrl}${formname}/bankstate/${bank_state}` : null
    // },
    four: {
      mode: 'date',
      currentTime: '',
      baa: Helper.nullStringCheckWithReturn(baa),
      remark: Helper.nullStringCheckWithReturn(remark),
    },
    og: item,
  };
  //console.log(alldata);
  //console.log(convertedjsonObj.second)
  return convertedjsonObj;
};

/**
 * edit samadhan
 * @param {*} item
 */
export const constructObjEditSamadhan = item => {
  const {name, mobile, alldata} = item;
  let {complaint_type, policy_type, id, email} = alldata;
  return {
    name: Helper.nullStringCheckWithReturn(name),
    mobile: Helper.nullStringCheckWithReturn(mobile),
    email: Helper.nullStringCheckWithReturn(email),
    complaint_type: Helper.nullStringCheckWithReturn(complaint_type),
    policy_type: Helper.nullStringCheckWithReturn(policy_type),
    formid: id,
  };
};

/**
 * files check 3rd form
 * @param {} title
 * @param {*} allfileslist
 */
export const thirdFormFileCheck = (title, allfileslist) => {
  let result = true;
  return result;

  let existence = '';
  //console.log('allfileslist', allfileslist)
  if (Helper.nullCheck(allfileslist) === false && allfileslist.length > 0) {
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
        const {key} = rcCopy;
        const {name} = rcCopy[key];
        if (
          String(key) === `rcbookcopy` &&
          name !== undefined &&
          String(name).length === 0
        ) {
          existence = key;
        }
      } else {
        existence = 'rcbookcopy';
      }

      const oldInCopy = Lodash.find(allfileslist, io => {
        if ('policycopy' in io) {
          io.key = 'policycopy';
          return io;
        } else {
          return undefined;
        }
      });
      if (existence === '') {
        if (oldInCopy !== undefined) {
          const {key} = oldInCopy;
          const {name} = oldInCopy[key];
          if (
            String(key) === `policycopy` &&
            name !== undefined &&
            String(name).length === 0
          ) {
            existence = key;
          }
        } else {
          existence = 'policycopy';
        }
      }
    }
    // else if (title === 'Business Loan') {
    //   //|| title === 'Personal Loan'
    //   //title === 'Auto Loan' ||
    //   //pan card
    //   const pancard = Lodash.find(allfileslist, io => {
    //     if ('pancard' in io) {
    //       io.key = 'pancard';
    //       return io;
    //     } else {
    //       return undefined;
    //     }
    //   });
    //   if (pancard !== undefined) {
    //     const { key } = pancard;
    //     const { name } = pancard[key];
    //     if (String(key) === `pancard` && name !== undefined && String(name).length === 0) {
    //       existence = key;
    //     }
    //   } else {
    //     existence = "pancard";
    //   }

    //   //aadhar card
    //   const aadharcard = Lodash.find(allfileslist, io => {
    //     if ('aadharcard' in io) {
    //       io.key = 'aadharcard';
    //       return io;
    //     } else {
    //       return undefined;
    //     }
    //   });
    //   if (existence === "") {
    //     if (aadharcard !== undefined) {
    //       const { key } = aadharcard;
    //       const { name } = aadharcard[key];
    //       if (String(key) === `aadharcard` && name !== undefined && String(name).length === 0) {
    //         existence = key;
    //       }
    //     } else {
    //       existence = "aadharcard";
    //     }
    //   }

    //   //salary slip
    //   const salaryslip = Lodash.find(allfileslist, io => {
    //     if ('salaryslip' in io) {
    //       io.key = 'salaryslip';
    //       return io;
    //     } else {
    //       return undefined;
    //     }
    //   });
    //   if (existence === "") {

    //     if (salaryslip !== undefined) {
    //       const { key } = salaryslip;
    //       const { name } = salaryslip[key];
    //       if (String(key) === `salaryslip` && name !== undefined && String(name).length === 0) {
    //         existence = key;
    //       }
    //     } else {
    //       existence = "salaryslip";
    //     }
    //   }

    //   //salary slip 1
    //   const salaryslip1 = Lodash.find(allfileslist, io => {
    //     if ('salaryslip1' in io) {
    //       io.key = 'salaryslip1';
    //       return io;
    //     } else {
    //       return undefined;
    //     }
    //   });
    //   if (existence === "") {

    //     if (salaryslip1 !== undefined) {
    //       const { key } = salaryslip1;
    //       const { name } = salaryslip1[key];
    //       if (String(key) === `salaryslip1` && name !== undefined && String(name).length === 0) {
    //         existence = key;
    //       }
    //     } else {
    //       existence = "salaryslip1";
    //     }
    //   }

    //   //salary slip 2
    //   const salaryslip2 = Lodash.find(allfileslist, io => {
    //     if ('salaryslip2' in io) {
    //       io.key = 'salaryslip2';
    //       return io;
    //     } else {
    //       return undefined;
    //     }
    //   });
    //   if (existence === "") {

    //     if (salaryslip2 !== undefined) {
    //       const { key } = salaryslip2;
    //       const { name } = salaryslip2[key];
    //       if (String(key) === `salaryslip2` && name !== undefined && String(name).length === 0) {
    //         existence = key;
    //       }
    //     } else {
    //       existence = "salaryslip2";
    //     }
    //   }
    //   //3month bank statement
    //   const bankstate = Lodash.find(allfileslist, io => {
    //     if ('bankstate' in io) {
    //       io.key = 'bankstate';
    //       return io;
    //     } else {
    //       return undefined;
    //     }
    //   });
    //   if (existence === "") {

    //     if (bankstate !== undefined) {
    //       const { key } = bankstate;
    //       const { name } = bankstate[key];
    //       if (String(key) === `bankstate` && name !== undefined && String(name).length === 0) {
    //         existence = key;
    //       }
    //     } else {
    //       existence = "bankstate";
    //     }
    //   }
    // }
  } else {
    if (title == 'Motor Insurance') {
      existence = 'rcbookcopy';
    }
    // else if (title == 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan') {
    //   existence = "pancard";
    // }
  }
  //console.log('existence', existence)
  if (this.state.currentPosition === 2) {
    if (title === `Motor Insurance`) {
      if (existence === 'rcbookcopy') {
        result = false;
        Helper.showToastMessage('Please, Select RC Book', 0);
      } else if (existence === 'policycopy') {
        result = false;
        Helper.showToastMessage('Please, Select Policy', 0);
      }
    }
    // else if (title === `Auto Loan` || title === 'Business Loan' || title === 'Personal Loan') {
    //   if (existence === 'pancard') {
    //     result = false;
    //     Helper.showToastMessage('Please, Select Pancard', 0);
    //   } else if (existence === 'aadharcard') {
    //     result = false;
    //     Helper.showToastMessage('Please, Select Aadhar Card', 0);
    //   } else if (existence === 'salaryslip') {
    //     result = false;
    //     Helper.showToastMessage('Please, Select Salary Slip 1', 0);
    //   } else if (existence === 'salaryslip1') {
    //     result = false;
    //     Helper.showToastMessage('Please, Select Salary Slip 2', 0);
    //   } else if (existence === 'salaryslip2') {
    //     result = false;
    //     Helper.showToastMessage('Please, Select Salary Slip 3', 0);
    //   } else if (existence === 'bankstate') {
    //     result = false;
    //     Helper.showToastMessage('Please, Select Bank Statement', 0);
    //   }
    // }
  }
  return result;
};

/**
 * star return
 */
export const returnAsterik = () => '*';
