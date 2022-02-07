import * as Helper from './Helper';
import * as Pref from './Pref';
import Lodash from 'lodash';

const lapPopList = [
  {
    enable: true,
    value: '',
    options: [
      {
        value: `Electricity Bill`,
      },
      {
        value: `Society Maintenance Bill`,
      },
      {
        value: `Water Bill`,
      },
    ],
    key: 'pop_electricity',
    res: {},
  },
  {
    enable: false,
    value: '',
    options: [
      {
        value: `Electricity Bill`,
      },
      {
        value: `Society Maintenance Bill`,
      },
      {
        value: `Water Bill`,
      },
    ],
    key: 'pop_electricity1',
    res: {},
  },
  {
    enable: false,
    value: '',
    options: [
      {
        value: `Electricity Bill`,
      },
      {
        value: `Society Maintenance Bill`,
      },
      {
        value: `Water Bill`,
      },
    ],
    key: 'pop_electricity2',
    res: {},
  },
];

const btpopList = [
  {
    enable: true,
    value: '',
    options: [
      {value: 'Share Certificate'},
      {value: 'Maintenance Slip'},
      {value: 'Property Tax'},
      {value: 'Water Bill'},
    ],
    key: 'pop_electricity',
    res: {},
  },
  {
    enable: false,
    value: '',
    options: [
      {value: 'Share Certificate'},
      {value: 'Maintenance Slip'},
      {value: 'Property Tax'},
      {value: 'Water Bill'},
    ],
    key: 'pop_electricity1',
    res: {},
  },
  {
    enable: false,
    value: '',
    options: [
      {value: 'Share Certificate'},
      {value: 'Maintenance Slip'},
      {value: 'Property Tax'},
      {value: 'Water Bill'},
    ],
    key: 'pop_electricity2',
    res: {},
  },
  {
    enable: false,
    value: '',
    options: [
      {value: 'Share Certificate'},
      {value: 'Maintenance Slip'},
      {value: 'Property Tax'},
      {value: 'Water Bill'},
    ],
    key: 'pop_electricity3',
    res: {},
  },
];

const freshPopListBuild = [
  {
    enable: true,
    value: '',
    options: [{value: 'Cost Sheet'}, {value: 'Blue Print'}, {value: 'CC Copy'}],
    key: 'pop_electricity',
    res: {},
  },
  {
    enable: false,
    value: '',
    options: [{value: 'Cost Sheet'}, {value: 'Blue Print'}, {value: 'CC Copy'}],
    key: 'pop_electricity1',
    res: {},
  },
  {
    enable: false,
    value: '',
    options: [{value: 'Cost Sheet'}, {value: 'Blue Print'}, {value: 'CC Copy'}],
    key: 'pop_electricity2',
    res: {},
  },
];

const freshPopListResale = [
  {
    enable: true,
    value: '',
    options: [
      {value: 'Chain of Agreement'},
      {value: 'Society Registration'},
      {value: 'Share Certificate'},
      {value: 'Maintenance Slip'},
      {value: 'Property Tax'},
      {value: 'OC Copy'},
      {value: 'Water Bill'},
    ],
    key: 'pop_electricity',
    res: {},
  },
  {
    enable: false,
    value: '',
    options: [
      {value: 'Chain of Agreement'},
      {value: 'Society Registration'},
      {value: 'Share Certificate'},
      {value: 'Maintenance Slip'},
      {value: 'Property Tax'},
      {value: 'OC Copy'},
      {value: 'Water Bill'},
    ],
    key: 'pop_electricity1',
    res: {},
  },
  {
    enable: false,
    value: '',
    options: [
      {value: 'Chain of Agreement'},
      {value: 'Society Registration'},
      {value: 'Share Certificate'},
      {value: 'Maintenance Slip'},
      {value: 'Property Tax'},
      {value: 'OC Copy'},
      {value: 'Water Bill'},
    ],
    key: 'pop_electricity2',
    res: {},
  },
  {
    enable: false,
    value: '',
    options: [
      {value: 'Chain of Agreement'},
      {value: 'Society Registration'},
      {value: 'Share Certificate'},
      {value: 'Maintenance Slip'},
      {value: 'Property Tax'},
      {value: 'OC Copy'},
      {value: 'Water Bill'},
    ],
    key: 'pop_electricity3',
    res: {},
  },
  {
    enable: false,
    value: '',
    options: [
      {value: 'Chain of Agreement'},
      {value: 'Society Registration'},
      {value: 'Share Certificate'},
      {value: 'Maintenance Slip'},
      {value: 'Property Tax'},
      {value: 'OC Copy'},
      {value: 'Water Bill'},
    ],
    key: 'pop_electricity4',
    res: {},
  },
  {
    enable: false,
    value: '',
    options: [
      {value: 'Chain of Agreement'},
      {value: 'Society Registration'},
      {value: 'Share Certificate'},
      {value: 'Maintenance Slip'},
      {value: 'Property Tax'},
      {value: 'OC Copy'},
      {value: 'Water Bill'},
    ],
    key: 'pop_electricity5',
    res: {},
  },
  {
    enable: false,
    value: '',
    options: [
      {value: 'Chain of Agreement'},
      {value: 'Society Registration'},
      {value: 'Share Certificate'},
      {value: 'Maintenance Slip'},
      {value: 'Property Tax'},
      {value: 'OC Copy'},
      {value: 'Water Bill'},
    ],
    key: 'pop_electricity6',
    res: {},
  },
];

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
  else if (
      //title !== "Term Insurance" &&
      title === "Health Insurance" &&
      //title !== "Fixed Deposit" &&
      //title !== `Life Cum Invt. Plan` &&
      //title !== `Motor Insurance` &&
      //title !== `Mutual Fund` &&
      //title !== `Vector Plus` &&
      //title !== `Home Loan` &&
      //title !== `Loan Against Property` &&
      //title !== `Personal Loan` &&
      //title !== `Business Loan` &&
      //title !== `Auto Loan` &&
      commons.email === ""
  ) {
      Helper.showToastMessage("Email empty", 0);
  }
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
   (title === 'Health Insurance' ||
    title === 'Personal Loan' ) &&
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
    title !== `Gold Loan` &&
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
  // }
  else if (title === `Personal Loan` && commons.employ === '') {
    Helper.showToastMessage('Please, Select Employment Type', 0);
  } else {
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
  } 
  // else if (title === 'Personal Loan' && specificForms.plcompany === '') {
  //   result = false;
  //   Helper.showToastMessage('Please, Select Company Name', 0);
  // } else if (title === 'Personal Loan' && specificForms.plcompany === 'Others' && specificForms.company === '') {
  //   result = false;
  //   Helper.showToastMessage('Company name empty', 0);
  // } else if (title === 'Personal Loan' && specificForms.turnover === '') {
  //   result = false;
  //   Helper.showToastMessage('Net Income (Monthly) empty', 0);
  // } else if (title === 'Personal Loan' && specificForms.amount === '') {
  //   result = false;
  //   Helper.showToastMessage('Desired Amount empty', 0);
  // } else if (title === 'Personal Loan' && specificForms.pancardNo === '') {
  //   result = false;
  //   Helper.showToastMessage('PAN Card Number empty', 0);
  // }
  else if (
    title !== `Health Insurance` &&
    specificForms.pancardNo !== '' &&
    !Helper.checkPanCard(specificForms.pancardNo)
  ) {
    result = false;
    Helper.showToastMessage('Invalid pan card number', 0);
  } else if (
    title !== `Health Insurance` &&
    specificForms.aadharcardNo !== undefined &&
    specificForms.aadharcardNo !== '' &&
    specificForms.aadharcardNo.length < 12
  ) {
    result = false;
    Helper.showToastMessage('Invalid aadhar card number', 0);
  }
  // else if (title === `Health Insurance` && specificForms.lifestyle === '') {
  //   result = false;
  //   Helper.showToastMessage('Please, Select Smoker Type', 0);
  // } else if (title === `Health Insurance` && specificForms.lifestyle2 === '') {
  //   result = false;
  //   Helper.showToastMessage('Please, Select Alcohol Consumption Type', 0);
  // }
  else if (
    title === `Health Insurance` &&
    specificForms.policy_type === ``
  ) {
    result = false;
    Helper.showToastMessage('Select Policy Type', 0);
  }else if (
    title === `Health Insurance` &&
    specificForms.policy_type === `Top Up` &&
    specificForms.deductible === ''
  ) {
    result = false;
    Helper.showToastMessage('Select Deductible', 0);
  } else if (
    title === `Health Insurance` &&
    specificForms.existing_diseases === ''
  ) {
    result = false;
    Helper.showToastMessage('Select Any Pre Existing Disease', 0);
  } else if (
    title === `Health Insurance` &&
    specificForms.existing_diseases === 'YES' &&
    specificForms.diseases === ''
  ) {
    result = false;
    Helper.showToastMessage('Please, Specify diseases', 0);
  } else if (title === `Health Insurance` && specificForms.claim_type === '') {
    result = false;
    Helper.showToastMessage('Please, Select Cover Type', 0);
  } else if (
    title === `Health Insurance` &&
    specificForms.claim_type === 'Family Floater'
  ) {
    if (specificForms.family_floater_adult === '' || specificForms.family_floater_adult === 'Select Adult') {
      result = false;
      Helper.showToastMessage('Please, Select Adult', 0);
    } 
	//else if (specificForms.family_floater_child === '' || specificForms.family_floater_child === 'Select Child') {
      //result = false;
      //Helper.showToastMessage('Please, Select Child', 0);
    //} 
	else {
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
 * motor First Form check
 * @param {*} param0
 * @returns
 */
 export const motorFirstFormCheck = ({
  name,
  mobile,
  reg_number,
  registration_type,
  claim_type,
  policy_expiry_type,
  noclaim_bonus_type,
  vehicle_type
}) => {
  let result = false;
  if (name === '') {
    Helper.showToastMessage('Owner Name empty', 0);
  } else if (mobile === '') {
    Helper.showToastMessage('Mobile Number empty', 0);
  } else if (
    Number(mobile.length) < 10 ||
    mobile === '9876543210' ||
    mobile === '1234567890'
  ) {
    Helper.showToastMessage('Invalid mobile number', 0);
  }else if (mobile.match(/^[0-9]*$/g) === null) {
    Helper.showToastMessage('Invalid mobile number', 0);
  } else if (reg_number === '') {
    Helper.showToastMessage('Registration Number empty', 0);
  } else if (registration_type == '') {
    Helper.showToastMessage('Select Owner Type', 0);
  } else if (claim_type == '') {
    Helper.showToastMessage('Select Any Claim Made Recently', 0);
  } else if (policy_expiry_type == '') {
    Helper.showToastMessage('Select Policy Expiry', 0);
  } else if (noclaim_bonus_type == '') {
    Helper.showToastMessage('Select No Claim Bonus', 0);
  } else if (vehicle_type == '') {
    Helper.showToastMessage('Select Vehicle Type', 0);
  } else {
    result = true;
  }
  return result;
};

/**
 * motor Second Form check
 * @param {*} param0
 * @returns
 */
 export const motorSecondFormCheck = ({insurance, expiry_date}) => {
  let result = false;
  if (insurance === '') {
    Helper.showToastMessage('Select Policy Type', 0);
  }else if (expiry_date === 'Previous Policy Expiry Date *') {
    Helper.showToastMessage('Expiry Date Empty', 0);
  } else {
    result = true;
  }
  return result;
};


/**
 * tmp First Form check
 * @param {*} param0
 * @returns
 */
export const tmpFirstFormCheck = ({
  name,
  mobile,
  email,
  insType,
  insCompany,
  insPlan,
}) => {
  let result = false;
  if (name === '') {
    Helper.showToastMessage('Full Name empty', 0);
  } else if (mobile === '') {
    Helper.showToastMessage('Mobile Number empty', 0);
  } else if (
    Number(mobile.length) < 10 ||
    mobile === '9876543210' ||
    mobile === '1234567890'
  ) {
    Helper.showToastMessage('Invalid mobile number', 0);
  }else if (mobile.match(/^[0-9]*$/g) === null) {
    Helper.showToastMessage('Invalid mobile number', 0);
  } else if (email === '') {
    Helper.showToastMessage('Email empty', 0);
  } else if (email !== '' && Helper.emailCheck(email) === false) {
    Helper.showToastMessage('Invalid Email', 0);
  } else if (insType == '') {
    Helper.showToastMessage('Select Insurance Type', 0);
  } else if (insCompany == '') {
    Helper.showToastMessage('Select Company', 0);
  } else if (insPlan == '') {
    Helper.showToastMessage('Select Plan', 0);
  } else {
    result = true;
  }
  return result;
};

/**
 * tmp Second Form check
 * @param {*} param0
 * @returns
 */
export const tmpSecondFormCheck = ({sumAss, apremium, age}) => {
  let result = false;
  if (sumAss === '') {
    Helper.showToastMessage('Select Required Cover', 0);
  } else if (apremium === '') {
    Helper.showToastMessage('Annual premium empty', 0);
  } else if (age === '') {
    Helper.showToastMessage('Age empty', 0);
  } else {
    result = true;
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
    eaadharcard,
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
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      count: 0,
      filled: [],
      downloadUrl: [],
      names: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
  ];

  const fileurls = `${Pref.FinURL}${formname}`;

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

  let Existing = null;
  if (Helper.nullCheck(alldata.existing) === false) {
    if (Helper.separatorReg(alldata.existing)) {
      const splitPancard = alldata.existing.split(',').map(x => {
        return `${fileurls}/existing/${x}`;
      });
      Existing = splitPancard[0];
      multipleFilesList[8].downloadUrl = splitPancard;
      multipleFilesList[8].count = splitPancard.length - 1;
      multipleFilesList[8].filled = new Array(splitPancard.length - 1).fill(
        1,
        0,
        splitPancard.length - 1,
      );
    } else {
      Existing = `${fileurls}/existing/${alldata.existing}`;
    }
  }

  let Itrdoc = null;
  if (Helper.nullCheck(alldata.itrdoc) === false) {
    if (Helper.separatorReg(alldata.itrdoc)) {
      const splitPancard = alldata.itrdoc.split(',').map(x => {
        return `${fileurls}/itrdoc/${x}`;
      });
      Itrdoc = splitPancard[0];
      multipleFilesList[10].downloadUrl = splitPancard;
      multipleFilesList[10].count = splitPancard.length - 1;
      multipleFilesList[10].filled = new Array(splitPancard.length - 1).fill(
        1,
        0,
        splitPancard.length - 1,
      );
    } else {
      Itrdoc = `${fileurls}/itrdoc/${alldata.itrdoc}`;
    }
  }

  let passportPhoto = null;
  if (Helper.nullStringCheck(passport_photo) === false) {
    passportPhoto = `${fileurls}/passport_photo/${passport_photo}`;
  }

  let ccity = '',
    cpincode = '',
    cstate = '',
    companyLocation = '';
  if (Helper.nullStringCheck(companylocation) === false) {
    if (Helper.separatorReg(companylocation)) {
      const spx = companylocation.split(',').filter(io => io !== '');
      if (spx.length > 0) {
        ccity = spx[0];
        cpincode = spx[2];
        cstate = spx[1];
      }
    } else {
      companyLocation = companylocation;
    }
  }

  var popitemList = [];
  let proofList = [];

  if (product.includes('Against')) {
    if (popitemList.length > 0) {
      popitemList = returneditPop(lapPopList, proofList);
    }
  } else {
    if (Helper.nullStringCheck(proof_of_property) === false) {
      proofList = proof_of_property.split(',').filter(io => io !== '');
      if (Helper.nullStringCheck(alldata.fresh_pop) === false) {
        if (alldata.fresh_pop.toLowerCase() === 'builder purchase') {
          popitemList = returneditPop(freshPopListBuild, proofList);
        } else {
          popitemList = returneditPop(freshPopListResale, proofList);
        }
      } else if (
        Helper.nullStringCheck(existingcard) === false &&
        existingcard.toLowerCase() === 'yes'
      ) {
        popitemList = returneditPop(btpopList, proofList);
      }
    }
  }

  let ccfather = '';
  let ccmother = '';
  let deductible = '';
  let hpolicyType = '';
  let family_floater_adult = '',
    family_floater_child = '';

  if (Helper.nullCheck(alldata.father_name) === false) {
    ccfather = alldata.father_name;
  }
  if (Helper.nullCheck(alldata.mother_name) === false) {
    ccmother = alldata.mother_name;
  }

  if (Helper.nullCheck(alldata.deductible) === false) {
    deductible = alldata.deductible;
  }

  if (Helper.nullCheck(alldata.policy_type) === false) {
    hpolicyType = alldata.policy_type;
  }

  if (Helper.nullStringCheck(alldata.family_floater) === false) {
    const ffSplit = alldata.family_floater.split(/\s/g);
    family_floater_adult = `${ffSplit[0]} ${ffSplit[1]}`;
    family_floater_child = `${ffSplit[2]} ${ffSplit[3]}`;
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
      residence_address: Helper.nullStringCheckWithReturn(
        alldata.residence_address,
      ),
    },
    second: {
      family_floater_adult: family_floater_adult,
      family_floater_child: family_floater_child,
      deductible: deductible,
      policy_type: hpolicyType,
      fresh_pop: Helper.nullStringCheckWithReturn(alldata.fresh_pop),
      eaadharcardNo: Helper.nullStringCheckWithReturn(eaadharcard),
      // current_add_proof: Helper.nullStringCheckWithReturn(current_add_proof),
      // exisitng_loan_doc: Helper.nullStringCheckWithReturn(exisitng_loan_doc),
      // proof_of_property: Helper.nullStringCheckWithReturn(proof_of_property),
      company: Helper.nullStringCheckWithReturn(company),
      plcompany: Helper.nullStringCheckWithReturn(company),
      amount: Helper.nullStringCheckWithReturn(damount),
      companylocation: companyLocation,
      ccity: ccity,
      cpincode: cpincode,
      cstate: cstate,
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
      loan_property_address: Helper.nullStringCheckWithReturn(
        loan_property_address,
      ),
      floaterItemList: floaterItemList,
      type_loan: Helper.nullStringCheckWithReturn(loan_type),
      homestate: Helper.nullStringCheckWithReturn(lpstate),
      ccfather: Helper.nullStringCheckWithReturn(ccfather),
      ccmother: Helper.nullStringCheckWithReturn(ccmother),
    },
    third: {
      popitemList: popitemList,
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
      existing: Existing,
      itrdoc: Itrdoc,
      statement_bank:Helper.nullStringCheckWithReturn(alldata.statement_bank),
      bstatepass:Helper.nullStringCheckWithReturn(alldata.bankstatepass)
    },
    // third: {
    //     panCard: Helper.nullCheck(pan_card) === false ? `${Pref.FinURL}${formname}/pancard/${pan_card}` : null,
    //     aadharCard: Helper.nullCheck(aadhar_card) === false ? `${Pref.FinURL}${formname}/aadharcard/${aadhar_card}` : null,
    //     rcCopy: Helper.nullCheck(rc_copy) === false ? `${Pref.FinURL}${formname}/rcbookcopy/${rc_copy}` : null,
    //     oldInsCopy: Helper.nullCheck(old_insc_copy) === false ? `${Pref.FinURL}${formname}/oldinsurancecopy/${old_insc_copy}` : null,
    //     pucCopy: Helper.nullCheck(puc_copy) === false ? `${Pref.FinURL}${formname}/puccopy/${puc_copy}` : null,
    //     policycopy: Helper.nullCheck(policycopy) === false ? `${Pref.FinURL}${formname}/policycopy/${policycopy}` : null,
    //     salarySlip: Helper.nullCheck(salarySlip) === false ? `${Pref.FinURL}${formname}/salaryslip/${salarySlip}` : null,
    //     salarySlip1: Helper.nullCheck(salarySlip1) === false ? `${Pref.FinURL}${formname}/salaryslip/${salarySlip1}` : null,
    //     salarySlip2: Helper.nullCheck(salarySlip2) === false ? `${Pref.FinURL}${formname}/salaryslip/${salarySlip2}` : null,
    //     salarySlip3: Helper.nullCheck(salarySlip3) === false ? `${Pref.FinURL}${formname}/salaryslip/${salarySlip3}` : null,
    //     salarySlip4: Helper.nullCheck(salarySlip4) === false ? `${Pref.FinURL}${formname}/salaryslip/${salarySlip4}` : null,
    //     salarySlip5: Helper.nullCheck(salarySlip5) === false ? `${Pref.FinURL}${formname}/salaryslip/${salarySlip5}` : null,
    //     bankState: Helper.nullCheck(bank_state) === false ? `${Pref.FinURL}${formname}/bankstate/${bank_state}` : null
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
 * edit motor
 * @param {*} item
 */
 export const constructObjEditMotor = item => {
  const {name, mobile, remark, alldata} = item;
  let {
    id,
    expiry_date,
    file,
    noclaim_bonus_type,
    premium_amount,
    insurance,
    claim_type,
    vehicle_type,
    registration_type
  } = alldata;
  return {
    name: Helper.nullStringCheckWithReturn(name),
    mobile: Helper.nullStringCheckWithReturn(mobile),
    registration_type: Helper.nullStringCheckWithReturn(registration_type),
    claim_type: Helper.nullStringCheckWithReturn(claim_type),
    insurance: Helper.nullStringCheckWithReturn(insurance),
    vehicle_type: Helper.nullStringCheckWithReturn(vehicle_type),
    expiry_date: Helper.nullStringCheckWithReturn(expiry_date),
    noclaim_bonus_type: Helper.nullStringCheckWithReturn(noclaim_bonus_type),
    apremium: Helper.nullStringCheckWithReturn(premium_amount),
    //tmpPolicy: policyFile,
    formid: id,
  };
};

/**
 * edit tmp
 * @param {*} item
 */
export const constructObjEditTmp = item => {
  const {name, mobile, remark, alldata} = item;
  let {
    required_cover,
    id,
    family_floater,
    company_name,
    file,
    plan_name,
    premium_amount,
    dob,
    email,
  } = alldata;
  let rCover = '';
  if (Helper.nullStringCheck(required_cover) === false) {
    rCover = `${Number(required_cover) / 100000}`;
  }
  // let policyFile = '';
  // if (Helper.nullStringMultiCheck(file) === false) {
  //   policyFile = `${Pref.FinURL}tmp_form/policy/${file}`;
  // }
  let floater = '';
  if (Helper.nullStringMultiCheck(family_floater) === false) {
    const split = family_floater.split(/\s/g);
    if (split.length === 4) {
      floater = `${split[0].trim()} ${split[1].trim()} + ${split[2].trim()} ${split[3].trim()}`;
    } else {
      floater = family_floater;
    }
  }
  return {
    name: Helper.nullStringCheckWithReturn(name),
    mobile: Helper.nullStringCheckWithReturn(mobile),
    email: Helper.nullStringCheckWithReturn(email),
    sumAss: rCover,
    age: Helper.nullStringCheckWithReturn(dob),
    remark: Helper.nullStringCheckWithReturn(remark),
    insType: Helper.nullStringCheckWithReturn(floater),
    insCompany: Helper.nullStringCheckWithReturn(company_name),
    insPlan: Helper.nullStringCheckWithReturn(plan_name),
    apremium: Helper.nullStringCheckWithReturn(premium_amount),
    //tmpPolicy: policyFile,
    formid: id,
  };
};

/**
 * files check 3rd form
 * @param {} title
 * @param {*} allfileslist
 */
export const thirdFormFileCheck = (title, allfileslist, stateObj = {}, editMode = false) => {
  let result = true;
  let existence = '';
  return true;
  if (title === 'Personal Loan' && editMode === false) {
    if (stateObj.statement_bank == '') {
      Helper.showToastMessage('Please, Select Bank Name', 0);
    } else {
      const pancard = Lodash.find(allfileslist, io => {
        if ('pancard' in io) {
          io.key = 'pancard';
          return io;
        } else {
          return undefined;
        }
      });
      if (pancard !== undefined) {
        const {key} = pancard;
        const {name} = pancard[key];
        if (
          String(key) === `pancard` &&
          name !== undefined &&
          String(name).length === 0
        ) {
          existence = key;
        }
      } else {
        existence = 'pancard';
      }

      const bankstate = Lodash.find(allfileslist, io => {
        if ('bankstate' in io) {
          io.key = 'bankstate';
          return io;
        } else {
          return undefined;
        }
      });
      if (existence === '') {
        if (bankstate !== undefined) {
          const {key} = bankstate;
          const {name} = bankstate[key];
          if (
            String(key) === `bankstate` &&
            name !== undefined &&
            String(name).length === 0
          ) {
            existence = key;
          }
        } else {
          existence = 'bankstate';
        }
      }

      if (existence === 'pancard') {
        result = false;
        Helper.showToastMessage('Please,Upload Pancard File', 0);
      } else if (existence === 'bankstate') {
        result = false;
        Helper.showToastMessage('Please,Upload Bank statment File', 0);
      } else {
        result = true;
      }
      return result;
    }
  } else {
    return result;
  }
};

/**
 * star return
 */
export const returnAsterik = () => '*';

export const returneditPop = (data, existingPopList) => {
  const filterList = Lodash.map(data, (io, index) => {
    if (existingPopList.length > 0) {
      io.value = Helper.nullStringCheckWithReturn(existingPopList[index]);
      if (io.value !== '') {
        io.enable = true;
      } else {
        io.enable = false;
        io.value = '';
      }
    }
    return io;
  });
  //console.log('filterList', filterList)
  // var finalMapData = [];
  // for(let i = 0; i<filterList.length; i++){
  //   const value = filterList[i].value;
  //   if(value !== ''){
  //     finalMapData = mapData(filterList,filterList[i], i, value);
  //   }
  // }
  // console.log('finalMapData', finalMapData);
  return filterList;
};

export const mapData = (popitemList, item, index, value) => {
  const filter = Lodash.filter(item.options, io => io.value === value);
  item.options = filter;
  item.value = value;
  popitemList[index] = item;
  const nextpos = index + 1;
  if (nextpos < popitemList.length) {
    const next = popitemList[nextpos];
    const nextoptions = next.options;
    for (let i = 0; i < popitemList.length; i++) {
      const elmet = popitemList[i];
      if (elmet.value != '') {
        const find = Lodash.findLastIndex(
          nextoptions,
          io => io.value === elmet.value,
        );
        if (find !== -1) {
          nextoptions.splice(find, 1);
        }
      }
    }
    next.options = nextoptions;
    next.enable = true;
    popitemList[nextpos] = next;
  }
  return popitemList;
};

/**
 *
 * @param {*} goldList
 * @param {*} karat
 * @param {*} desiredAmt
 */
export const findGoldPledge = (goldList, karat, desiredAmt) => {
  if (Helper.nullCheck(goldList) === false) {
    const find = Lodash.find(goldList, io => io.gk === karat);
    if (find) {
      if (Helper.nullStringCheck(desiredAmt)) {
        return '';
      }
      const {dm} = find;
      const cal = Number(desiredAmt / dm).toPrecision(3);
      return `${cal}`;
    } else {
      return '';
    }
  } else {
    return '';
  }
};


/**
 * first form check
 * @param {} title
 * @param {*} commons
 */
 export const quickLeadFormCheck = (state) => {
  let result = false;
  if (state.catList === "" || state.catList === `Select Category *` || state.catList === `Select Category`) {
    alert("Select Category");
  }else if (state.productName === "" || state.productName === `Select Product *`) {
    alert("Select Product");
  }else if (state.name === '') {
    alert('Full Name empty');
  } else if (state.mobile === '') {
    alert('Mobile Number empty');
  } else if (
    Number(state.mobile.length) < 10 ||
    state.mobile === '9876543210' ||
    state.mobile === '1234567890'
  ) {
    alert('Invalid mobile number');
  } else if (state.mobile.match(/^[0-9]*$/g) === null) {
    alert('Invalid mobile number');
  }else if (state.email === '') {
  alert('Email Empty');
}else if (state.email !== '' &&
    Helper.emailCheck(state.email) === false
  ) {
    alert('Invalid Email');
  } else if (
    state.pincode == ''
  ) {
    alert('Please, Enter Current Residence Pincode');
  } else if (state.pincode !== '' && state.pincode < 6) {
    alert('Invalid Pincode');
  }else if (state.dob === "" || state.dob === `Date of Birth *` || state.dob === `Date of Birth`) {
    alert("Date of Birth empty");
  }else {
    result = true;
  }
  return result;
};