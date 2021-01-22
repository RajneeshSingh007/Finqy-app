import React from 'react';
import {StyleSheet, BackHandler} from 'react-native';
import {Title, View} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {Button, ActivityIndicator} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import {sizeHeight, sizeWidth} from '../../util/Size';
import CommonForm from './CommonForm';
import SpecificForm from './SpecificForm';
import FileUploadForm from './FileUploadForm';
import ApptForm from './ApptForm';
import Lodash from 'lodash';
import Loader from '../../util/Loader';
import LeftHeaders from '../common/CommonLeftHeader';
import CScreen from '../component/CScreen';
import StepIndicator from '../component/StepIndicator';
import {
  firstFormCheck,
  secondFormCheck,
  thirdFormFileCheck,
} from '../../util/FormCheckHelper';

export default class FinorbitForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.formSubmit = this.formSubmit.bind(this);
    this.commonFormRef = React.createRef();
    this.specificFormRef = React.createRef();
    this.FileUploadFormRef = React.createRef();
    this.ApptFormRef = React.createRef();
    this.backClick = this.backClick.bind(this);
    this.headerchange = false;
    this.restoreList = [];
    this.state = {
      loading: false,
      progressLoader: false,
      currentPosition: 0,
      bottontext: 'Next',
      //dataArray: [],
      userData: {},
      appliedref: '',
      refcode: '',
      bannerList: [],
      token: '',
      userData: '',
      title: '',
      scrollReset: false,
      //headerchange: false,
      editMode: false,
      editFirst: null,
      editSecond: null,
      editThird: null,
      editFour: null,
      editLeadData: null,
      disableClick: 0,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backClick);
    const {navigation} = this.props;
    const url = navigation.getParam('url', '');
    const title = navigation.getParam('title', '');
    const editMode = navigation.getParam('edit', false);
    const editLeadData = navigation.getParam('leadData', null);
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.saveToken, value => {
        this.setState({token: value}, () => {
          Pref.getVal(Pref.userData, userData => {
            const checknullEdit = Helper.nullCheck(editLeadData);
            this.setState({
              userData: userData,
              imageUrl: url,
              title: title,
              isMounted: true,
              currentPosition: 0,
              editMode: editMode,
              editLeadData: editLeadData,
              editFirst: checknullEdit === false ? editLeadData.first : null,
              editSecond: checknullEdit === false ? editLeadData.second : null,
              editThird: checknullEdit === false ? editLeadData.third : null,
              editFour: checknullEdit === false ? editLeadData.four : null,
            });
            if (checknullEdit === false) {
              if (
                Helper.nullCheck(editLeadData.first) === false &&
                Helper.nullStringCheck(editLeadData.first.employ) === false
              ) {
                if (
                  (title === 'Home Loan' ||
                    title === 'Loan Against Property') &&
                  editLeadData.first &&
                  editLeadData.first.employ === 'Salaried'
                ) {
                  this.headerchange = true;
                } else if (
                  (title === 'Home Loan' ||
                    title === 'Loan Against Property') &&
                  editLeadData.first &&
                  editLeadData.first.employ === 'Self Employed'
                ) {
                  this.headerchange = false;
                }
              }
            }
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
    const {title, currentPosition, editMode} = this.state;
    if (editMode === true) {
      NavigationActions.navigate('LeadList');
    } else {
      NavigationActions.goBack();
    }
    return true;
  };

  componentWillUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    if (this.focusListener !== undefined) this.focusListener.remove();
  }

  backNav = () => {
    const {currentPosition} = this.state;
    if (currentPosition === 0) {
      this.setState({scrollReset: true});
      return false;
    }
    this.setState(
      prev => {
        return {
          currentPosition: prev.currentPosition - 1,
          bottontext: 'Next',
          scrollReset: true,
        };
      },
      () => {
        if (this.state.currentPosition === 0) {
          this.commonFormRef.current.restoreData(this.restoreList[0]);
        } else if (this.state.currentPosition === 1) {
          this.specificFormRef.current.restoreData(this.restoreList[1]);
        } else if (this.state.currentPosition === 2) {
          this.FileUploadFormRef.current.restoreData(this.restoreList[2]);
        } else if (this.state.currentPosition === 3) {
          this.ApptFormRef.current.restoreData(this.restoreList[3]);
        }
      },
    );
  };

  /**
   * submit form
   */
  formSubmit = () => {
    const {
      title,
      currentPosition,
      editMode,
      editLeadData,
      disableClick,
    } = this.state;
    let commons = null;
    //console.log("title", title);
    if (currentPosition === 0) {
      commons = JSON.parse(JSON.stringify(this.commonFormRef.current.state));
      this.restoreList[0] = commons;
    } else if (currentPosition === 1) {
      commons = JSON.parse(JSON.stringify(this.specificFormRef.current.state));
      this.restoreList[1] = commons;
    } else if (currentPosition === 2) {
      commons = JSON.parse(
        JSON.stringify(this.FileUploadFormRef.current.state),
      );
      this.restoreList[2] = commons;
    } else if (currentPosition === 3) {
      commons = JSON.parse(JSON.stringify(this.ApptFormRef.current.state));
      this.restoreList[3] = commons;
    }
    // let result = false;
    // if (commons !== null) {
    //   this.state.dataArray[currentPosition] = commons;
    //   result = true;
    // }

    const commonForms = this.restoreList[0];
    //this.state.dataArray[0];
    const specificForms = this.restoreList[1];
    let fileListForms = null;
    let dateForm = null;
    if (this.state.title !== 'Insure Check') {
      fileListForms = this.restoreList[2];
      dateForm = this.restoreList[3];
    }

    let checkData = true;
    let formData = new FormData();
    let uniq = '';
    if (title.includes(' ')) {
      uniq = title
        .trim()
        .toLowerCase()
        .replace(' ', '_');
    }
    if (title === `Life Cum Invt. Plan`) {
      uniq = 'life_cum_investment';
    } else if (title === 'Insure Check') {
      uniq = 'insure_check';
    } else if (title === 'Loan Against Property') {
      uniq = 'loan_against_property';
    }
    //console.log(`uniq`, uniq, title);
    formData.append(uniq, uniq);

    if (commonForms !== undefined && this.state.currentPosition === 0) {
      checkData = firstFormCheck(title, commonForms);
      if (
        checkData &&
        (title === 'Home Loan' || title === 'Loan Against Property') &&
        commonForms.employ === 'Salaried'
      ) {
        this.headerchange = true;
      } else if (
        checkData &&
        (title === 'Home Loan' || title === 'Loan Against Property') &&
        commonForms.employ === 'Self Employed'
      ) {
        this.headerchange = false;
      }
    }

    if (specificForms && this.state.currentPosition === 1) {
      checkData = secondFormCheck(title, specificForms);
    }

    let allfileslist = [];
    if (fileListForms) {
      allfileslist = fileListForms.fileList;
      checkData = thirdFormFileCheck(title, allfileslist);
    }

    //console.log('checkData', checkData);
    if (checkData) {
      const limit = title === 'Insure Check' ? 1 : 3;
      if (currentPosition < limit) {
        if (this.state.title === 'Insure Check') {
          this.setState(
            prevState => {
              return {
                currentPosition: prevState.currentPosition + 1,
                bottontext:
                  prevState.currentPosition + 1 > 0 ? 'Submit' : 'Next',
                scrollReset: true,
              };
            },
            () => {
              if (this.state.currentPosition === 0) {
                this.commonFormRef.current.restoreData(this.restoreList[0]);
              } else if (this.state.currentPosition === 1) {
                this.specificFormRef.current.restoreData(this.restoreList[1]);
              }
            },
          );
        } else {
          this.setState(
            prevState => {
              return {
                currentPosition: prevState.currentPosition + 1,
                bottontext:
                  prevState.currentPosition + 1 > 2 ? 'Submit' : 'Next',
                scrollReset: true,
              };
            },
            () => {
              if (this.state.currentPosition === 0) {
                this.commonFormRef.current.restoreData(this.restoreList[0]);
              } else if (this.state.currentPosition === 1) {
                this.specificFormRef.current.restoreData(this.restoreList[1]);
              } else if (this.state.currentPosition === 2) {
                this.FileUploadFormRef.current.restoreData(this.restoreList[2]);
              } else if (this.state.currentPosition === 3) {
                this.ApptFormRef.current.restoreData(this.restoreList[3]);
              }
            },
          );
        }
      } else {
        if (disableClick === 0) {
          this.setState({progressLoader: true, disableClick: 1}, () => {
            this.forceUpdate();
          });
          const {refercode} = this.state.userData;
          formData.append('ref', refercode);

          //console.log('formData', formData);
          //console.log('formUrls', formUrls);

          //construct form data

          //1st form
          if (commonForms) {
            delete commonForms.maxDate;
            delete commonForms.currentDate;
            let parseJs = JSON.parse(JSON.stringify(commonForms));
            if (parseJs.currentlocation === 'Select Current Location *') {
              parseJs.currentlocation === '';
            }
            Object.entries(parseJs).forEach(([key, value]) => {
              if (Helper.arrayObjCheck(value, true)) {
                formData.append(key, value);
              }
            });
            // for (var key in parseJs) {
            //   const value = parseJs[key];
            //   if (Helper.arrayObjCheck(value, true)) {
            //     formData.append(key, parseJs[key]);
            //   }
            // }
          }

          //2nd form
          if (specificForms) {
            delete specificForms.pincode;
            delete specificForms.maxDate;
            delete specificForms.currentDate;
            let parseJs = JSON.parse(JSON.stringify(specificForms));
            if (
              Helper.nullCheck(parseJs.floaterItemList) === false &&
              parseJs.floaterItemList.length > 0
            ) {
              let keypos = 1;
              const floaterItemList = JSON.parse(
                JSON.stringify(specificForms.floaterItemList),
              );
              const loops = Lodash.map(floaterItemList, ele => {
                let parseJs = JSON.parse(JSON.stringify(ele));
                for (var key in parseJs) {
                  const value = parseJs[key];
                  if (Helper.nullCheck(value) === false) {
                    if (key.includes('existing_diseases')) {
                      formData.append(`existing_diseases${keypos}`, value);
                    } else if (key.includes('diseases')) {
                      formData.append(`diseases${keypos}`, value);
                    } else {
                      formData.append(
                        keypos === 1
                          ? `floater_${key}`
                          : `floater_${key}${keypos}`,
                        value,
                      );
                    }
                  }
                }
                keypos += 1;
              });
            }
            Object.entries(parseJs).forEach(([key, value]) => {
              if (Helper.arrayObjCheck(value, true)) {
                formData.append(key, value);
              }
            });
            // for (var key in parseJs) {
            //   const value = parseJs[key];
            //   if (Helper.arrayObjCheck(value, true)) {
            //     formData.append(key, parseJs[key]);
            //   }
            // }
          }

          //3rd form
          if (allfileslist !== undefined && allfileslist.length > 0) {
            const loops = Lodash.map(allfileslist, ele => {
              let parseJs = JSON.parse(JSON.stringify(ele));
              Object.entries(parseJs).forEach(([key, value]) => {
                if (Helper.arrayObjCheck(value, false)) {
                  formData.append(key, value);
                }
              });
              // for (var key in parseJs) {
              //   const value = parseJs[key];
              //   if (Helper.arrayObjCheck(value, false)) {
              //     formData.append(key, parseJs[key]);
              //   }
              // }
            });
          }

          //forth
          if (dateForm && this.state.currentPosition === 3) {
            // if (dateForm.baa === "") {
            //checkData = false;
            //Helper.showToastMessage("Please, Select Appointment Date", 0);
            //} else {
            delete dateForm.maxDate;
            delete dateForm.currentDate;
            delete dateForm.showdatesx;
            delete dateForm.maxDates;
            let parseJs = JSON.parse(JSON.stringify(dateForm));
            Object.entries(parseJs).forEach(([key, value]) => {
              if (Helper.arrayObjCheck(value, true)) {
                formData.append(key, value);
              }
            });
            // for (var key in parseJs) {
            //   const value = parseJs[key];
            //   if (Helper.arrayObjCheck(value, true)) {
            //     formData.append(key, parseJs[key]);
            //   }
            // }
            //}
          }

          if (editMode === false) {
            formData.append('formid', '');
          } else {
            const {og} = editLeadData;
            const {id} = og.alldata;
            formData.append('formid', id);
          }

          formData.append('frommobile', 'frommobile');

          const formUrls = `${Pref.FinorbitFormUrl}${uniq}.php`;

          //console.log('formData', formData);

          Helper.networkHelperTokenContentType(
            formUrls,
            formData,
            Pref.methodPost,
            this.state.token,
            result => {
              //console.log('result', result);
              const {response_header} = result;
              const {res_type, res} = response_header;
              this.setState({progressLoader: false});
              if (res_type === 'success') {
                Helper.showToastMessage(
                  editMode === false
                    ? 'Form submitted successfully'
                    : 'Form updated successfully',
                  1,
                );
                if (title === `Health Insurance` && editMode === false) {
                  const {id} = res;
                  const cov = Number(specificForms.required_cover);
                  NavigationActions.navigate('GetQuotes', {
                    formId: id,
                    sumin: cov,
                  });
                } else {
                  NavigationActions.navigate('Finish', {
                    top: editMode === false ? 'Add New Lead' : 'Edit Lead',
                    red: 'Success',
                    grey:
                      editMode === false
                        ? 'Details uploaded'
                        : 'Details updated',
                    blue:
                      editMode === false
                        ? 'Add another lead?'
                        : 'Back to Lead Record',
                    back: editMode === false ? 'FinorbitScreen' : 'LeadList',
                  });
                }
              } else {
                Helper.showToastMessage('Failed to submit form', 0);
              }
            },
            e => {
              console.log(e);
              this.setState({progressLoader: false});
              Helper.showToastMessage('Something went wrong', 0);
            },
          );
        }
      }
    }
  };

  render() {
    const {
      title,
      editMode,
      editFirst,
      editSecond,
      editThird,
      editFour,
    } = this.state;
    const split =
      title !== '' ? (title.includes(' ') ? title.split(' ') : [title]) : [''];
    return (
      <CScreen
        scrollreset={this.state.scrollReset}
        absolute={
          <>
            <Loader
              isShow={this.state.progressLoader}
              bottomText={'Please do not press back button'}
            />
          </>
        }
        body={
          <>
            <LeftHeaders
              backClicked={this.backClick}
              showBack
              title={
                // split.length === 2
                //   ? `${split[0]} ${split[1]}`
                //   : split.length === 3
                //     ? `${split[0]} ${split[1]} ${split[2]}`
                //     : split.length === 4
                //       ? `${split[0]} ${split[1]} ${split[2]} ${split[3]}`
                //       : split[0]
                title === '' ? '' : !editMode ? `Add New Lead` : `Edit Lead`
              }
              bottomtext={
                <>
                  {`${split[0]} `}
                  {split.length === 2 ? (
                    <Title style={styles.passText}>{`${split[1]}`}</Title>
                  ) : split.length === 3 ? (
                    <Title
                      style={
                        styles.passText
                      }>{`${split[1]} ${split[2]}`}</Title>
                  ) : split.length === 4 ? (
                    <Title
                      style={
                        styles.passText
                      }>{`${split[1]} ${split[2]} ${split[3]}`}</Title>
                  ) : null}
                </>
              }
              bottomtextStyle={{
                color: '#555555',
                fontSize: 20,
              }}
            />
            <StepIndicator
              activeCounter={this.state.currentPosition}
              stepCount={this.state.title === 'Insure Check' ? 2 : 4}
            />
            {title === '' ? (
              <View style={styles.loader}>
                <ActivityIndicator />
              </View>
            ) : (
              <>
                <View styleName="md-gutter">
                  {this.state.currentPosition === 0 ? (
                    <CommonForm
                      ref={this.commonFormRef}
                      showemploy={
                        this.state.title !== 'Fixed Deposit' &&
                        this.state.title !== 'Vector Plus' &&
                        this.state.title !== 'Business Loan' &&
                        this.state.title !== 'Mutual Fund' &&
                        this.state.title !== 'Motor Insurance' &&
                        this.state.title !== 'Life Cum Invt. Plan' &&
                        this.state.title !== 'Insure Check'
                      }
                      editItemRestore={editFirst}
                      title={this.state.title}
                    />
                  ) : this.state.currentPosition === 1 ? (
                    <SpecificForm
                      ref={this.specificFormRef}
                      editItemRestore={editSecond}
                      title={this.state.title}
                    />
                  ) : this.state.currentPosition === 2 ? (
                    <FileUploadForm
                      ref={this.FileUploadFormRef}
                      title={this.state.title}
                      headerchange={this.headerchange}
                      editItemRestore={editThird}
                      panCard={editThird && editThird.panCard}
                      aadharCard={editThird && editThird.aadharCard}
                      rcCopy={editThird && editThird.rcCopy}
                      oldInsCopy={editThird && editThird.oldInsCopy}
                      pucCopy={editThird && editThird.pucCopy}
                      salarySlip={editThird && editThird.salarySlip}
                      salarySlip1={editThird && editThird.salarySlip1}
                      salarySlip2={editThird && editThird.salarySlip2}
                      salarySlip3={editThird && editThird.salarySlip3}
                      salarySlip4={editThird && editThird.salarySlip4}
                      salarySlip5={editThird && editThird.salarySlip5}
                      bankState={editThird && editThird.bankState}
                      policycopy={editThird && editThird.policycopy}
                      multipleFilesList={
                        editThird &&
                        editThird.multipleFilesList != null &&
                        editThird.multipleFilesList
                      }
                      editMode={this.state.editMode}
                      exisitng_loan_doc={
                        this.restoreList[1] &&
                        this.restoreList[1].exisitng_loan_doc
                      }
                      current_add_proof={
                        this.restoreList[1] &&
                        this.restoreList[1].current_add_proof
                      }
                      proof_of_property={
                        this.restoreList[1] &&
                        this.restoreList[1].proof_of_property
                      }
                      other = {editThird && editThird.other}
                      passportPhoto = {editThird && editThird.passportPhoto}
                      cap_aadhar = {editThird && editThird.cap_aadhar}
                      pop_electricity = {editThird && editThird.pop_electricity}
                      current_loan_repayment_statement = {editThird && editThird.current_loan_repayment_statement}
                    />
                  ) : this.state.currentPosition === 3 ? (
                    <ApptForm
                      ref={this.ApptFormRef}
                      title={this.state.title}
                      editItemRestore={editFour}
                    />
                  ) : null}
                </View>

                <View
                  styleName={
                    this.state.currentPosition > 0
                      ? `horizontal space-between md-gutter`
                      : `horizontal space-between md-gutter v-end h-end`
                  }>
                  {this.state.currentPosition > 0 ? (
                    <Button
                      mode={'flat'}
                      uppercase={true}
                      dark={true}
                      loading={false}
                      style={[
                        styles.loginButtonStyle,
                        {
                          backgroundColor: 'transparent',
                          borderColor: '#d5d3c1',
                          borderWidth: 1.3,
                        },
                      ]}
                      onPress={this.backNav}>
                      <Title
                        style={StyleSheet.flatten([
                          styles.btntext,
                          {
                            color: '#b8b28f',
                          },
                        ])}>
                        {'Back'}
                      </Title>
                    </Button>
                  ) : null}
                  <Button
                    mode={'flat'}
                    uppercase={false}
                    dark={true}
                    loading={false}
                    style={styles.loginButtonStyle}
                    onPress={this.formSubmit}>
                    <Title style={styles.btntext}>
                      {this.state.bottontext}
                    </Title>
                  </Button>
                </View>
              </>
            )}
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
    fontWeight: '700',
    lineHeight: 36,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingVertical: 16,
  },
  inputStyle: {
    height: sizeHeight(8),
    backgroundColor: 'white',
    color: '#292929',
    borderBottomColor: '#dedede',
    fontFamily: 'Rubik',
    fontSize: 16,
    borderBottomWidth: 1,
    fontWeight: '400',
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
  },
  inputPassStyle: {
    height: sizeHeight(8),
    backgroundColor: 'white',
    color: '#292929',
    borderBottomColor: '#dedede',
    fontFamily: 'Rubik',
    fontSize: 16,
    borderBottomWidth: 1,
    fontWeight: '400',
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
    marginVertical: sizeHeight(1),
  },
  inputPass1Style: {
    height: sizeHeight(8),
    backgroundColor: 'white',
    color: '#292929',
    fontFamily: 'Rubik',
    fontSize: 16,
    fontWeight: '400',
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
    marginTop: -7,
  },
  loginButtonStyle: {
    color: 'white',
    backgroundColor: Pref.RED,
    textAlign: 'center',
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 0.5,
    borderRadius: 48,
    width: '40%',
    paddingVertical: 4,
    fontWeight: '700',
  },
  btntext: {
    color: 'white',
    fontSize: 16,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
});
