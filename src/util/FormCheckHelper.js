import * as Helper from './Helper';

/**
 * first form check
 * @param {} title 
 * @param {*} commons 
 */
export const firstFormCheck = (title, commons) => {
    let result = false;
    if (commons.name === "") {
        Helper.showToastMessage("Full Name empty", 0);
    } else if (commons.mobile === "") {
        Helper.showToastMessage("Mobile Number empty", 0);
    } else if (
        Number(commons.mobile.length) < 10 ||
        commons.mobile === "9876543210" ||
        commons.mobile === "1234567890"
    ) {
        Helper.showToastMessage("Invalid mobile number", 0);
    } else if (commons.mobile.match(/^[0-9]*$/g) === null) {
        Helper.showToastMessage("Invalid mobile number", 0);
    } else if (
        //title !== "Term Insurance" &&
        //title !== "Health Insurance" &&
        //title !== "Fixed Deposit" &&
        //title !== `Life Cum Invt. Plan` &&
        //title !== `Motor Insurance` &&
        //title !== `Mutual Fund` &&
        title !== `Vector Plus` &&
        title !== `Home Loan` &&
       //title !== `Loan Against Property` &&
        //title !== `Personal Loan` &&
        //title !== `Business Loan` &&
        //title !== `Auto Loan` &&
        commons.email === ""
    ) {
        Helper.showToastMessage("Email empty", 0);
    } else if (
        commons.email !== "" &&
        Helper.emailCheck(commons.email) === false
        //!commons.email.includes("@")
    ) {
        Helper.showToastMessage("Invalid Email", 0);
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
        Helper.showToastMessage("Please, Enter Current Residence Pincode", 0);
    } else if (commons.pincode !== "" && commons.pincode < 6) {
        Helper.showToastMessage("Invalid Pincode", 0);
    } else if (
        // title !== `Personal Loan` &&
        // title !== `Home Loan` &&
        // title !== `Loan Against Property` &&
        // title !== `Business Loan` &&
        // title !== `Auto Loan` &&
        //title !== `Motor Insurance` &&
        //commons.currentlocation === ""
        commons.pincode !== '' && (commons.state === '' || commons.currentlocation === '')
    ) {
        //Helper.showToastMessage("Please, Select Current Location", 0);
        Helper.showToastMessage('Failed to find city & state, Please, check pincode', 0);
    } else if (
        title !== "Fixed Deposit" &&
        title !== `Mutual Fund` &&
        title !== `Home Loan` &&
        //title !== `Loan Against Property` &&
        //title !== `Personal Loan` &&
        //title !== `Business Loan` &&
        //title !== `Auto Loan` &&
        title !== `Life Cum Invt. Plan` &&
        title !== 'Motor Insurance' &&
        (commons.dob === "" || commons.dob === `Date of Birth *` || commons.dob === `Date of Birth`)
    ) {
        Helper.showToastMessage("Date of Birth empty", 0);
    } else if (
        //title !== `Personal Loan` &&
        //title !== `Loan Against Property` &&
        //title !== `Home Loan` &&
       //title !== `Business Loan` &&
        //title !== `Auto Loan` &&
        title !== `Motor Insurance` &&
        title !== `Insure Check` &&
        commons.gender === ""
    ) {
        Helper.showToastMessage("Please, Select Gender", 0);
    } else if (
        (title === "Term Insurance" ||
            title === "Health Insurance") &&
        commons.qualification === ""
    ) {
        Helper.showToastMessage("Please, Select Qualification", 0);
    } else if (
        //title !== `Personal Loan` &&
        title !== "Fixed Deposit" &&
        title !== "Business Loan" &&
        title !== `Motor Insurance` &&
        title !== `Mutual Fund` &&
        title !== `Vector Plus` &&
        //title !== `Home Loan` &&
        //title !== `Loan Against Property` &&
        //title !== `Auto Loan` &&
        title !== `Life Cum Invt. Plan` &&
        title !== `Insure Check` &&
        commons.employ === ""
    ) {
        Helper.showToastMessage("Please, Select Employment Type", 0);
    } else {
        result = true;
    }
    return result;
}


/**
 * second form check
 * @param {} title 
 * @param {*} commons 
 */
export const secondFormCheck = (title, specificForms) => {
    let result = false;
    if (commons.name === "") {
        Helper.showToastMessage("Full Name empty", 0);
    } else if (commons.mobile === "") {
        Helper.showToastMessage("Mobile Number empty", 0);
    } else if (
        Number(commons.mobile.length) < 10 ||
        commons.mobile === "9876543210" ||
        commons.mobile === "1234567890"
    ) {
        Helper.showToastMessage("Invalid mobile number", 0);
    } else if (commons.mobile.match(/^[0-9]*$/g) === null) {
        Helper.showToastMessage("Invalid mobile number", 0);
    } else if (
        //title !== "Term Insurance" &&
        //title !== "Health Insurance" &&
        //title !== "Fixed Deposit" &&
        //title !== `Life Cum Invt. Plan` &&
        //title !== `Motor Insurance` &&
        //title !== `Mutual Fund` &&
        title !== `Vector Plus` &&
        title !== `Home Loan` &&
       //title !== `Loan Against Property` &&
        //title !== `Personal Loan` &&
        //title !== `Business Loan` &&
        //title !== `Auto Loan` &&
        commons.email === ""
    ) {
        Helper.showToastMessage("Email empty", 0);
    } else if (
        commons.email !== "" &&
        Helper.emailCheck(commons.email) === false
        //!commons.email.includes("@")
    ) {
        Helper.showToastMessage("Invalid Email", 0);
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
        Helper.showToastMessage("Please, Enter Current Residence Pincode", 0);
    } else if (commons.pincode !== "" && commons.pincode < 6) {
        Helper.showToastMessage("Invalid Pincode", 0);
    } else if (
        // title !== `Personal Loan` &&
        // title !== `Home Loan` &&
        // title !== `Loan Against Property` &&
        // title !== `Business Loan` &&
        // title !== `Auto Loan` &&
        //title !== `Motor Insurance` &&
        //commons.currentlocation === ""
        commons.pincode !== '' && (commons.state === '' || commons.currentlocation === '')
    ) {
        //Helper.showToastMessage("Please, Select Current Location", 0);
        Helper.showToastMessage('Failed to find city & state, Please, check pincode', 0);
    } else if (
        title !== "Fixed Deposit" &&
        title !== `Mutual Fund` &&
        title !== `Home Loan` &&
        //title !== `Loan Against Property` &&
        //title !== `Personal Loan` &&
        //title !== `Business Loan` &&
        //title !== `Auto Loan` &&
        title !== `Life Cum Invt. Plan` &&
        title !== 'Motor Insurance' &&
        (commons.dob === "" || commons.dob === `Date of Birth *` || commons.dob === `Date of Birth`)
    ) {
        Helper.showToastMessage("Date of Birth empty", 0);
    } else if (
        //title !== `Personal Loan` &&
        //title !== `Loan Against Property` &&
        //title !== `Home Loan` &&
       //title !== `Business Loan` &&
        //title !== `Auto Loan` &&
        title !== `Motor Insurance` &&
        title !== `Insure Check` &&
        commons.gender === ""
    ) {
        Helper.showToastMessage("Please, Select Gender", 0);
    } else if (
        (title === "Term Insurance" ||
            title === "Health Insurance") &&
        commons.qualification === ""
    ) {
        Helper.showToastMessage("Please, Select Qualification", 0);
    } else if (
        //title !== `Personal Loan` &&
        title !== "Fixed Deposit" &&
        title !== "Business Loan" &&
        title !== `Motor Insurance` &&
        title !== `Mutual Fund` &&
        title !== `Vector Plus` &&
        //title !== `Home Loan` &&
        //title !== `Loan Against Property` &&
        //title !== `Auto Loan` &&
        title !== `Life Cum Invt. Plan` &&
        title !== `Insure Check` &&
        commons.employ === ""
    ) {
        Helper.showToastMessage("Please, Select Employment Type", 0);
    } else {
        result = true;
    }
    return result;
}