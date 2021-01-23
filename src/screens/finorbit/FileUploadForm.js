import React from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {Subtitle, View, Title} from '@shoutem/ui';
import {Checkbox} from 'react-native-paper';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {sizeWidth} from '../../util/Size';
import moment from 'moment';
import CommonFileUpload from '../common/CommonFileUpload';
import Lodash from 'lodash';

export default class FileUploadForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.findFileName = this.findFileName.bind(this);
    this.fileselected = this.fileselected.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      fileList: [],
      multipleFilesList: [
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
      ],
      exisitng_loan_doc: '',
      current_add_proof: '',
      proof_of_property: '',
    };
  }

  restoreData(obj) {
    if (obj !== undefined) {
      //console.log(obj.fileList)
      this.setState(obj);
    }
  }

  componentDidMount() {
    const {
      multipleFilesList = [],
      exisitng_loan_doc = '',
      current_add_proof = '',
      proof_of_property = '',
    } = this.props;
    if (
      Helper.nullCheck(multipleFilesList) === false &&
      multipleFilesList.length > 0
    ) {
      const filter = Lodash.map(multipleFilesList, io => {
        const {downloadUrl} = io;
        const filters = Lodash.filter(downloadUrl, file => {
          if (Helper.extCheckReg(file)) {
            return file;
          }
        });
        if (filters.length > 0) {
          filters.splice(0, 1);
        }
        io.downloadUrl = filters;
        io.filled = new Array(filters.length).fill(1, 0, filters.length);
        io.count = io.filled.length;
        return io;
      });
      this.setState({multipleFilesList: filter});
    }
    this.setState({
      exisitng_loan_doc: exisitng_loan_doc,
      current_add_proof: current_add_proof,
      proof_of_property: proof_of_property,
    });
    //console.log(this.props.multipleFilesList);
  }

  findFileName = input => {
    //console.log('input', input);
    const {fileList} = this.state;
    if (Helper.nullStringCheck(input) === false && fileList.length > 0) {
      let find = Lodash.find(fileList, io => {
        if (Helper.nullCheck(io[input]) === false) {
          return io[input];
        } else {
          return undefined;
        }
      });
      return find !== undefined ? find[input].name : '';
    } else {
      return '';
    }
  };

  onChange = (event, selectDate) => {
    this.setState({showCalendar: false, currentDate: selectDate});
  };

  checkurl = (type, name) => {
    const exist = Helper.extCheckReg(name);
    if (type === 0) {
      return exist ? true : false;
    } else {
      return exist ? name : '';
    }
  };

  mandatoryName = (name, title) => {
    //return `${name} ${title === 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan' ? ` *` : ``}`;
    return `${name}`;
  };

  insertValueFormultipleFilePick = position => {
    const {multipleFilesList} = this.state;
    const oldercount = multipleFilesList[position].count;
    if (oldercount < Pref.MAX_FILE_PICK_LIMIT) {
      const increment = oldercount + 1;
      multipleFilesList[position].count = increment;
      const emptyArray = new Array(increment).fill(1, 0, increment);
      multipleFilesList[position].filled = emptyArray;
      this.setState({multipleFilesList: multipleFilesList}, () => {
        this.forceUpdate();
      });
    } else {
      Helper.showToastMessage('You can select upto 6 files', 0);
    }
  };

  removeValueFormultipleFilePick = (position, index) => {
    const {multipleFilesList} = this.state;
    const oldercount = multipleFilesList[position].count;
    multipleFilesList[position].filled.splice(index, 1);
    multipleFilesList[position].count = oldercount - 1;
    this.setState({multipleFilesList: multipleFilesList}, () => {
      this.forceUpdate();
    });
  };

  fileselected = (res, key, index, withIndex = false, arrayPosition = -1) => {
    let obj = {};
    let findPositionExisting = -1;
    let name = res.name;
    if (withIndex) {
      obj[`${key}${index + 1}`] = res;
      findPositionExisting = this.state.fileList.findIndex(
        io => io[`${key}${index + 1}`],
      );
    } else {
      obj[`${key}`] = res;
      findPositionExisting = this.state.fileList.findIndex(io => io[`${key}`]);
    }
    if (findPositionExisting !== -1) {
      this.state.fileList.splice(findPositionExisting);
    }
    if (arrayPosition !== -1 && index !== -1) {
      this.state.multipleFilesList[arrayPosition].names[index] = name;
    }
    this.state.fileList.push(obj);
  };

  renderSelectedMultiChoice = (
    selectedItems = '',
    checkKey = '',
    title = '',
    key = '',
    arrayposition,
    firstItemUrl,
  ) => {
    const {
      mode = false,
      downloadTitles = '',
      truDownloadEnable = -1,
      editMode = false,
    } = this.props;

    if (Helper.nullStringCheck(selectedItems) === true) {
      return null;
    }

    return (
      <>
        <CommonFileUpload
          showPlusIcon={true}
          truDownloadEnable={truDownloadEnable}
          downloadTitles={downloadTitles}
          mode={mode}
          title={title}
          type={2}
          keyName={key}
          pickedTitle={this.findFileName(key)}
          pickedCallback={(selected, res) =>
            this.fileselected(res, key, -1, false, -1)
          }
          enableDownloads={this.checkurl(0, firstItemUrl)}
          downloadUrl={this.checkurl(1, firstItemUrl)}
          plusClicked={() => this.insertValueFormultipleFilePick(arrayposition)}
        />

        {this.state.multipleFilesList[arrayposition].filled.map((e, index) => {
          const durl = this.state.multipleFilesList[arrayposition].downloadUrl;
          const namesList = this.state.multipleFilesList[arrayposition].names;
          return (
            <CommonFileUpload
              minusClicked={() => this.removeValueFormultipleFilePick(1, index)}
              showMinusIcon={true}
              pickedTitle={namesList[index]}
              //editMode={editMode}
              downloadTitles={downloadTitles}
              truDownloadEnable={truDownloadEnable}
              mode={mode}
              title={`${title} ${index + 2}`}
              keyName={key}
              type={2}
              pickedCallback={(selected, res) =>
                this.fileselected(res, key, index, true, arrayposition)
              }
              enableDownloads={this.checkurl(0, durl[index])}
              downloadUrl={this.checkurl(1, durl[index])}
            />
          );
        })}
      </>
    );
  };

  render() {
    const {
      panCard = null,
      title,
      cancelChq = null,
      aadharCard = null,
      gstImage = null,
      headerchange = false,
      rcCopy = null,
      oldInsCopy = null,
      puccopy = null,
      salarySlip = null,
      salarySlip1 = null,
      salarySlip2 = null,
      salarySlip3 = null,
      salarySlip4 = null,
      salarySlip5 = null,
      bankState = null,
      policycopy = null,
      mode = false,
      downloadTitles = '',
      truDownloadEnable = -1,

      editMode = false,
      existing = null,
      other = null,
      cap_aadhar = null,
      cap_passport = null,
      cap_rent_agreement = null,
      cap_licence = null,
      cap_voterid = null,
      cap_postpaid = null,
      pop_index_bill = null,
      pop_water_bill = null,
      statement_of_accounts = null,
      sanction_letter = null,
      cap_electricity = null,
      cap_landline = null,
      pop_electricity = null,
      current_loan_repayment_statement = null,
      credit_card_front_copy = null,
      passportPhoto = null,
      card_statement = null,
    } = this.props;

    const {
      exisitng_loan_doc,
      proof_of_property,
      current_add_proof,
    } = this.state;
    //console.log(exisitng_loan_doc, proof_of_property,current_add_proof)
    const loanCheck =
      (Helper.nullStringCheck(title) === false && title === 'Auto Loan') ||
      title === 'Business Loan' ||
      title === 'Personal Loan' ||
      title === 'Loan Against Property' ||
      title === 'Home Loan'
        ? true
        : false;

    return (
      <View>
        {loanCheck ? (
          <>
            {this.renderSelectedMultiChoice(
              current_add_proof,
              'Aadhar',
              'Current Address Proof',
              'cap_aadhar',
              10,
              cap_aadhar,
            )}

            {/* {this.renderSelectedMultiChoice(
              current_add_proof,
              'Electricity',
              'Electricity Bill',
              'cap_electricity',
              11,
              cap_electricity,
            )}

            {this.renderSelectedMultiChoice(
              current_add_proof,
              'Landline',
              'Landline',
              'cap_landline',
              12,
              cap_landline,
            )}

            {this.renderSelectedMultiChoice(
              current_add_proof,
              'License',
              'License',
              'cap_licence',
              13,
              cap_licence,
            )}

            {this.renderSelectedMultiChoice(
              current_add_proof,
              'Passport+B45',
              'Passport+B45',
              'cap_passport',
              14,
              cap_passport,
            )}

            {this.renderSelectedMultiChoice(
              current_add_proof,
              'Postpaid',
              'Postpaid',
              'cap_postpaid',
              15,
              cap_postpaid,
            )}

            {this.renderSelectedMultiChoice(
              current_add_proof,
              'Rent',
              'Rent Agreement',
              'cap_rent_agreement',
              16,
              cap_rent_agreement,
            )}

            {this.renderSelectedMultiChoice(
              current_add_proof,
              'Voter',
              'Voter ID',
              'cap_voterid',
              17,
              cap_voterid,
            )} */}

            {title === 'Home Loan' ? (
              <>
                {this.renderSelectedMultiChoice(
                  proof_of_property,
                  'Electricity',
                  'Proof Of Property',
                  'pop_electricity',
                  18,
                  pop_electricity,
                )}

                {/* {this.renderSelectedMultiChoice(
                  proof_of_property,
                  'Index',
                  'Index Bill',
                  'pop_index_bill',
                  19,
                  pop_index_bill,
                )}

                {this.renderSelectedMultiChoice(
                  proof_of_property,
                  'Water',
                  'Water Bill',
                  'pop_water_bill',
                  20,
                  pop_water_bill,
                )} */}
              </>
            ) : null}
            {this.renderSelectedMultiChoice(
              exisitng_loan_doc,
              'Current',
              'Existing Loan Document',
              'current_loan_repayment_statement',
              21,
              current_loan_repayment_statement,
            )}

            {/* {this.renderSelectedMultiChoice(
              exisitng_loan_doc,
              'Credit',
              'Credit Card Front Copy',
              'credit_card_front_copy',
              22,
              credit_card_front_copy,
            )}

            {this.renderSelectedMultiChoice(
              exisitng_loan_doc,
              'Sanction',
              'Sanction Letter',
              'sanction_letter',
              23,
              sanction_letter,
            )}

            {this.renderSelectedMultiChoice(
              exisitng_loan_doc,
              'Months',
              '2 Months Card Statement',
              'card_statement',
              24,
              card_statement,
            )}

            {this.renderSelectedMultiChoice(
              exisitng_loan_doc,
              'Statement',
              'Statement of Accounts',
              'statement_of_accounts',
              25,
              statement_of_accounts,
            )} */}

            <CommonFileUpload
              truDownloadEnable={truDownloadEnable}
              title={'Passport Size Photo'}
              type={2}
              keyName={'passport_photo'}
              pickedTitle={this.findFileName(`passport_photo`)}
              pickedCallback={(selected, res) =>
                this.fileselected(res, 'passport_photo', -1, false, -1)
              }
              enableDownloads={this.checkurl(0, passportPhoto)}
              downloadUrl={this.checkurl(1, passportPhoto)}
              mode={mode}
              downloadTitles={downloadTitles}
            />
          </>
        ) : null}

        {title !== 'Motor Insurance' ? (
          <>
            <CommonFileUpload
              //showPlusIcon={title !== 'Profile'}
              showPlusIcon={loanCheck}
              truDownloadEnable={truDownloadEnable}
              downloadTitles={downloadTitles}
              mode={mode}
              title={`${this.mandatoryName(`Pan Card`, title)} ${
                truDownloadEnable === 1 ? '1' : ''
              }`}
              type={2}
              pickedTitle={this.findFileName(`pancard`)}
              pickedCallback={(selected, res) =>
                this.fileselected(res, 'pancard', -1, false, -1)
              }
              enableDownloads={this.checkurl(0, panCard)}
              downloadUrl={this.checkurl(1, panCard)}
              plusClicked={() => this.insertValueFormultipleFilePick(0)}
              keyName={'pancard'}
            />

            {loanCheck &&
              this.state.multipleFilesList[0].filled.map((e, index) => {
                const durl = this.state.multipleFilesList[0].downloadUrl;
                const namesList = this.state.multipleFilesList[0].names;

                return (
                  <CommonFileUpload
                    minusClicked={() =>
                      this.removeValueFormultipleFilePick(0, index)
                    }
                    showMinusIcon={true}
                    //editMode={editMode}
                    truDownloadEnable={truDownloadEnable}
                    downloadTitles={downloadTitles}
                    mode={mode}
                    title={`Pan Card ${index+2}`}
                    keyName={`pancard${index + 1}`}
                    type={2}
                    pickedTitle={namesList[index]}
                    pickedCallback={(selected, res) =>
                      this.fileselected(res, 'pancard', index, true, 0)
                    }
                    enableDownloads={this.checkurl(0, durl[index])}
                    downloadUrl={this.checkurl(1, durl[index])}
                  />
                );
              })}

            <CommonFileUpload
              showPlusIcon={loanCheck}
              truDownloadEnable={truDownloadEnable}
              //title={'Aadhar Card'}
              title={`${this.mandatoryName(
                title === 'Demat' ? `Address Proof` : `Aadhar Card`,
                title,
              )} ${truDownloadEnable === 1 ? '1' : ''}`}
              // title={`Aadhar Card ${title === 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan' ? ` *` : ``}`}
              type={2}
              pickedTitle={this.findFileName(
                title === 'Demat' ? `addressproof` : `aadharcard`,
              )}
              pickedCallback={(selected, res) =>
                this.fileselected(
                  res,
                  title === 'Demat' ? 'addressproof' : 'aadharcard',
                  -1,
                  false,
                  -1,
                )
              }
              enableDownloads={this.checkurl(0, aadharCard)}
              downloadUrl={this.checkurl(1, aadharCard)}
              mode={mode}
              downloadTitles={downloadTitles}
              plusClicked={() => this.insertValueFormultipleFilePick(1)}
              keyName={title === 'Demat' ? 'addressproof' : 'aadharcard'}
            />

            {loanCheck &&
              this.state.multipleFilesList[1].filled.map((e, index) => {
                const durl = this.state.multipleFilesList[1].downloadUrl;
                return (
                  <CommonFileUpload
                    minusClicked={() =>
                      this.removeValueFormultipleFilePick(1, index)
                    }
                    showMinusIcon={true}
                    //editMode={editMode}
                    downloadTitles={downloadTitles}
                    title={`${title === 'Demat' ? 'Address Proof' : 'Aadhar Card'} ${index+2}`}
                    truDownloadEnable={truDownloadEnable}
                    mode={mode}
                    type={2}
                    keyName={
                      title === 'Demat'
                        ? `addressproof${index + 1}`
                        : `aadharcard${index + 1}`
                    }
                    pickedTitle={this.findFileName(
                      title === 'Demat'
                        ? `addressproof${index + 1}`
                        : `aadharcard${index + 1}`,
                    )}
                    pickedCallback={(selected, res) =>
                      this.fileselected(
                        res,
                        title === 'Demat' ? 'addressproof' : 'aadharcard',
                        index,
                        true,
                        1,
                      )
                    }
                    enableDownloads={this.checkurl(0, durl[index])}
                    downloadUrl={this.checkurl(1, durl[index])}
                  />
                );
              })}
          </>
        ) : null}

        {title === 'Profile' ? (
          <>
            <CommonFileUpload
              truDownloadEnable={truDownloadEnable}
              title={'Cancelled Cheque'}
              type={2}
              pickedTitle={this.findFileName(`cancel_chq`)}
              pickedCallback={(selected, res) => {
                this.state.fileList.push({cancel_chq: res});
              }}
              enableDownloads={this.checkurl(0, cancelChq)}
              downloadUrl={this.checkurl(1, cancelChq)}
              mode={mode}
              downloadTitles={downloadTitles}
              keyName={'cancel_chq'}
            />
            <CommonFileUpload
              truDownloadEnable={truDownloadEnable}
              title={'GST Certificate'}
              type={2}
              pickedTitle={this.findFileName(`gst_cert`)}
              pickedCallback={(selected, res) => {
                this.state.fileList.push({gst_cert: res});
              }}
              enableDownloads={this.checkurl(0, gstImage)}
              downloadUrl={this.checkurl(1, gstImage)}
              mode={mode}
              downloadTitles={downloadTitles}
              keyName={'gst_cert'}
            />
          </>
        ) : null}

        {title === 'Motor Insurance' ? (
          <View>
            <CommonFileUpload
              showPlusIcon={false}
              plusClicked={() => this.insertValueFormultipleFilePick(4)}
              truDownloadEnable={truDownloadEnable}
              title={`RC Book ${truDownloadEnable === 1 ? '1' : ''}`}
              type={2}
              pickedTitle={this.findFileName(`rcbookcopy`)}
              pickedCallback={(selected, res) =>
                this.fileselected(res, 'rcbookcopy', -1, false, -1)
              }
              enableDownloads={this.checkurl(0, rcCopy)}
              downloadUrl={this.checkurl(1, rcCopy)}
              mode={mode}
              downloadTitles={downloadTitles}
              keyName={'rcbookcopy'}
            />

            {this.state.multipleFilesList[4].filled.map((e, index) => {
              const durl = this.state.multipleFilesList[4].downloadUrl;
              const namesList = this.state.multipleFilesList[4].names;
              return (
                <CommonFileUpload
                  minusClicked={() =>
                    this.removeValueFormultipleFilePick(4, index)
                  }
                  showMinusIcon={true}
                  //editMode={editMode}
                  // downloadTitles={
                  //   truDownloadEnable === -1 ? '' : `RC Book ${index + 2}`
                  // }
                  truDownloadEnable={truDownloadEnable}
                  mode={mode}
                  title={`RC Book ${index+2}`}
                  type={2}
                  pickedTitle={namesList[index]}
                  pickedCallback={(selected, res) =>
                    this.fileselected(res, 'rcbookcopy', index, true, 4)
                  }
                  enableDownloads={this.checkurl(0, durl[index])}
                  downloadUrl={this.checkurl(1, durl[index])}
                  keyName={`rcbookcopy${index + 1}`}
                />
              );
            })}

            <CommonFileUpload
              showPlusIcon={false}
              plusClicked={() => this.insertValueFormultipleFilePick(5)}
              title={`Policy ${truDownloadEnable === 1 ? '1' : ''}`}
              type={2}
              pickedTitle={this.findFileName(`policycopy`)}
              pickedCallback={(selected, res) =>
                this.fileselected(res, 'policycopy', -1, false, -1)
              }
              enableDownloads={this.checkurl(0, policycopy)}
              downloadUrl={this.checkurl(1, policycopy)}
              mode={mode}
              downloadTitles={downloadTitles}
              truDownloadEnable={truDownloadEnable}
              keyName={`policycopy`}
            />
            {this.state.multipleFilesList[5].filled.map((e, index) => {
              const durl = this.state.multipleFilesList[5].downloadUrl;
              const namesList = this.state.multipleFilesList[5].names;
              return (
                <CommonFileUpload
                  minusClicked={() =>
                    this.removeValueFormultipleFilePick(5, index)
                  }
                  showMinusIcon={true}
                  // editMode={editMode}
                  // downloadTitles={
                  //   truDownloadEnable === -1 ? '' : `Policy ${index + 2}`
                  // }
                  // truDownloadEnable={truDownloadEnable}
                  truDownloadEnable={truDownloadEnable}
                  mode={mode}
                  title={`Policy ${index + 2}`}
                  type={2}
                  pickedTitle={namesList[index]}
                  pickedCallback={(selected, res) =>
                    this.fileselected(res, 'policycopy', index, true)
                  }
                  enableDownloads={this.checkurl(0, durl[index])}
                  downloadUrl={this.checkurl(1, durl[index])}
                  keyName={`policycopy${index + 1}`}
                />
              );
            })}

            <CommonFileUpload
              showPlusIcon={false}
              plusClicked={() => this.insertValueFormultipleFilePick(6)}
              title={`Old Insurance Policy ${
                truDownloadEnable === 1 ? '1' : ''
              }`}
              type={2}
              pickedTitle={this.findFileName(`oldinsurancecopy`)}
              pickedCallback={(selected, res) =>
                this.fileselected(res, 'oldinsurancecopy', -1, false, -1)
              }
              enableDownloads={this.checkurl(0, oldInsCopy)}
              downloadUrl={this.checkurl(1, oldInsCopy)}
              mode={mode}
              downloadTitles={downloadTitles}
              truDownloadEnable={truDownloadEnable}
              keyName={`oldinsurancecopy`}
            />

            {this.state.multipleFilesList[6].filled.map((e, index) => {
              const durl = this.state.multipleFilesList[6].downloadUrl;
              const namesList = this.state.multipleFilesList[6].names;
              return (
                <CommonFileUpload
                  minusClicked={() =>
                    this.removeValueFormultipleFilePick(6, index)
                  }
                  showMinusIcon={true}
                  //editMode={editMode}
                  downloadTitles={downloadTitles}
                  truDownloadEnable={truDownloadEnable}
                  mode={mode}
                  title={`Old Insurance Policy ${index + 2}`}
                  type={2}
                  keyName={`oldinsurancecopy${index + 1}`}
                  pickedTitle={namesList[index]}
                  pickedCallback={(selected, res) =>
                    this.fileselected(res, 'oldinsurancecopy', index, true, 6)
                  }
                  enableDownloads={this.checkurl(0, durl[index])}
                  downloadUrl={this.checkurl(1, durl[index])}
                />
              );
            })}

            <CommonFileUpload
              showPlusIcon={false}
              plusClicked={() => this.insertValueFormultipleFilePick(7)}
              title={`PUC ${truDownloadEnable === 1 ? '1' : ''}`}
              type={2}
              pickedTitle={this.findFileName(`puccopy`)}
              pickedCallback={(selected, res) =>
                this.fileselected(res, 'puccopy', -1, false, -1)
              }
              enableDownloads={this.checkurl(0, puccopy)}
              downloadUrl={this.checkurl(1, puccopy)}
              mode={mode}
              downloadTitles={downloadTitles}
              truDownloadEnable={truDownloadEnable}
              keyName={`puccopy`}
            />

            {this.state.multipleFilesList[7].filled.map((e, index) => {
              const durl = this.state.multipleFilesList[7].downloadUrl;
              const namesList = this.state.multipleFilesList[7].names;
              return (
                <CommonFileUpload
                  minusClicked={() =>
                    this.removeValueFormultipleFilePick(7, index)
                  }
                  showMinusIcon={true}
                  //editMode={editMode}
                  downloadTitles={downloadTitles}
                  truDownloadEnable={truDownloadEnable}
                  mode={mode}
                  title={`PUC ${index + 2}`}
                  type={2}
                  keyName={`puccopy${index + 1}`}
                  pickedTitle={namesList[index]}
                  pickedCallback={(selected, res) =>
                    this.fileselected(res, 'puccopy', index, true, 7)
                  }
                  enableDownloads={this.checkurl(0, durl[index])}
                  downloadUrl={this.checkurl(1, durl[index])}
                />
              );
            })}
          </View>
        ) : null}

        {title === 'Demat' ? (
          <CommonFileUpload
            title={'Cancelled Cheque'}
            type={0}
            pickedTitle={this.findFileName(`cancelcheque`)}
            pickedCallback={(selected, res) => {
              if (!selected) {
                this.state.fileList.push({cancelcheque: res});
              }
            }}
            mode={mode}
            downloadTitles={downloadTitles}
            truDownloadEnable={truDownloadEnable}
            keyName={`cancelcheque`}
          />
        ) : null}

        {loanCheck ? (
          <View>
            <CommonFileUpload
              showPlusIcon={true}
              truDownloadEnable={truDownloadEnable}
              title={
                truDownloadEnable === 1
                  ? `Salary Slip 1`
                  : this.mandatoryName(
                      `${
                        title.includes('Loan')
                          ? `3 Months Salary Slip/3 Year ITR`
                          : title === 'Credit Card'
                          ? `3 Months Salary Slip`
                          : `6 Months Salary Slip`
                      }`,
                      title,
                    )
              }
              type={2}
              pickedTitle={this.findFileName('salaryslip')}
              pickedCallback={(selected, res) =>
                this.fileselected(res, 'salaryslip', -1, false, -1)
              }
              enableDownloads={this.checkurl(0, salarySlip)}
              downloadUrl={this.checkurl(1, salarySlip)}
              mode={mode}
              downloadTitles={downloadTitles}
              plusClicked={() => this.insertValueFormultipleFilePick(2)}
              keyName={`salaryslip`}
            />

            {this.state.multipleFilesList[2].filled.map((e, index) => {
              const durl = this.state.multipleFilesList[2].downloadUrl;
              const namesList = this.state.multipleFilesList[2].names;
              return (
                <CommonFileUpload
                  minusClicked={() =>
                    this.removeValueFormultipleFilePick(2, index)
                  }
                  showMinusIcon={true}
                  //editMode={editMode}
                  downloadTitles={downloadTitles}
                  truDownloadEnable={truDownloadEnable}
                  mode={mode}
                  title={`Salary Slip ${index + 2}`}
                  type={2}
                  pickedTitle={namesList[index]}
                  pickedCallback={(selected, res) =>
                    this.fileselected(res, 'salaryslip', index, true, 2)
                  }
                  enableDownloads={this.checkurl(0, durl[index])}
                  downloadUrl={this.checkurl(1, durl[index])}
                  keyName={`salaryslip${index + 1}`}
                />
              );
            })}

            <CommonFileUpload
              showPlusIcon={true}
              plusClicked={() => this.insertValueFormultipleFilePick(3)}
              title={
                truDownloadEnable === 1
                  ? `Bank Statement 1`
                  : this.mandatoryName(
                      `${
                        title === 'Credit Card'
                          ? '3 Year Bank Statement'
                          : `6 Month Bank Statement`
                      }`,
                      title,
                    )
              }
              type={2}
              //fileType={1}
              pickedTitle={this.findFileName(`bankstate`)}
              pickedCallback={(selected, res) =>
                this.fileselected(res, 'bankstate', -1, false, -1)
              }
              enableDownloads={this.checkurl(0, bankState)}
              downloadUrl={this.checkurl(1, bankState)}
              mode={mode}
              downloadTitles={downloadTitles}
              truDownloadEnable={truDownloadEnable}
              keyName={`bankstate`}
            />

            {this.state.multipleFilesList[3].filled.map((e, index) => {
              const durl = this.state.multipleFilesList[3].downloadUrl;
              const namesList = this.state.multipleFilesList[3].names;
              return (
                <CommonFileUpload
                  minusClicked={() =>
                    this.removeValueFormultipleFilePick(3, index)
                  }
                  showMinusIcon={true}
                  //editMode={editMode}
                  downloadTitles={downloadTitles}
                  truDownloadEnable={truDownloadEnable}
                  mode={mode}
                  title={`Bank Statement ${index + 2}`}
                  type={2}
                  //fileType={1}
                  pickedTitle={namesList[index]}
                  pickedCallback={(selected, res) =>
                    this.fileselected(res, 'bankstate', index, true, 3)
                  }
                  enableDownloads={this.checkurl(0, durl[index])}
                  downloadUrl={this.checkurl(1, durl[index])}
                  keyName={`bankstate${index + 1}`}
                />
              );
            })}

            <CommonFileUpload
              showPlusIcon={true}
              plusClicked={() => this.insertValueFormultipleFilePick(9)}
              title={
                truDownloadEnable === 1
                  ? `Other 1`
                  : this.mandatoryName(`Other`, title)
              }
              type={2}
              fileType={-1}
              pickedTitle={this.findFileName(`Other`)}
              pickedCallback={(selected, res) =>
                this.fileselected(res, 'other', -1, false, -1)
              }
              enableDownloads={this.checkurl(0, other)}
              downloadUrl={this.checkurl(1, other)}
              mode={mode}
              downloadTitles={downloadTitles}
              truDownloadEnable={truDownloadEnable}
              keyName={`other`}
            />

            {this.state.multipleFilesList[9].filled.map((e, index) => {
              const durl = this.state.multipleFilesList[9].downloadUrl;
              const namesList = this.state.multipleFilesList[9].names;
              return (
                <CommonFileUpload
                  minusClicked={() =>
                    this.removeValueFormultipleFilePick(9, index)
                  }
                  showMinusIcon={true}
                  //editMode={editMode}
                  downloadTitles={downloadTitles}
                  truDownloadEnable={truDownloadEnable}
                  mode={mode}
                  title={`Other ${index + 2}`}
                  type={2}
                  fileType={-1}
                  pickedTitle={namesList[index]}
                  pickedCallback={(selected, res) =>
                    this.fileselected(res, 'other', index, true, 9)
                  }
                  enableDownloads={this.checkurl(0, durl[index])}
                  downloadUrl={this.checkurl(1, durl[index])}
                  keyName={`other${index + 1}`}
                />
              );
            })}

            {/* <CommonFileUpload
            showPlusIcon={true}
            plusClicked={() => this.insertValueFormultipleFilePick(8)}
            title={
              truDownloadEnable === 1
                ? `Existing Loan Document 1`
                : this.mandatoryName(`Existing Loan Document`, title)
            }
            type={2}
            fileType={-1}
            pickedTitle={this.findFileName(`existing`)}
            pickedCallback={(selected, res) => this.fileselected(res, 'existing', -1, false)}
            enableDownloads={this.checkurl(0, existing)}
            downloadUrl={this.checkurl(1, existing)}
            mode={mode}
            downloadTitles={downloadTitles}
            truDownloadEnable={truDownloadEnable}
            />

            {this.state.multipleFilesList[8].filled.map((e, index) => {
            const durl = this.state.multipleFilesList[8].downloadUrl;
            return (
              <CommonFileUpload
                editMode={editMode}
                downloadTitles={`Existing Loan Document ${index + 2}`}
                truDownloadEnable={truDownloadEnable}
                mode={mode}
                title={''}
                type={2}
                fileType={-1}
                pickedTitle={this.findFileName(`existing${index + 1}`)}
                pickedCallback={(selected, res) => this.fileselected(res, 'existing', index, true)}
                enableDownloads={this.checkurl(0, durl[index])}
                downloadUrl={this.checkurl(1, durl[index])}
              />
            );
            })} */}
          </View>
        ) : null}

        {title === 'Credit Card' ? (
          <View>
            {truDownloadEnable === 1 ? (
              <View
                styleName="vertical"
                style={{marginStart: sizeWidth(2), marginVertical: 0}}>
                {/* <Subtitle style={styles.title1}>
                  {this.showhideheading()}
                </Subtitle> */}
              </View>
            ) : (
              <View
                styleName="vertical"
                style={{marginStart: sizeWidth(2), marginVertical: 12}}>
                <Subtitle style={styles.title1}>
                  {title === 'Personal Loan'
                    ? `3 Months Salary Slip`
                    : title === 'Credit Card'
                    ? `3 Months Salary Slip or 1 Years ITR`
                    : (title === 'Home Loan' ||
                        title === 'Loan Against Property') &&
                      headerchange === true
                    ? `6 Months Salary Slip`
                    : (title === 'Home Loan' ||
                        title === 'Loan Against Property') &&
                      headerchange === false
                    ? `3 Years ITR`
                    : title === 'Loan Against Property'
                    ? `6 Months Salary Slip or 3 Years ITR`
                    : `3 Years ITR`}
                </Subtitle>
              </View>
            )}
            <CommonFileUpload
              title={this.mandatoryName(
                `${
                  (title === 'Home Loan' ||
                    title === 'Loan Against Property' ||
                    'Auto Loan' ||
                    title === 'Business Loan') &&
                  headerchange === false
                    ? ``
                    : `Salary Slip 1`
                }`,
                title,
              )}
              // title={`${(title === 'Home Loan' || title === 'Loan Against Property') && headerchange === false ? `` : `Salary Slip 1`}${title === 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan' ? ` *` : ``}`}
              type={2}
              pickedTitle={this.findFileName(`salaryslip`)}
              pickedCallback={(selected, res) => {
                this.state.fileList.push({salaryslip: res});
              }}
              enableDownloads={
                salarySlip != null && this.checkurl(0, salarySlip)
              }
              downloadUrl={this.checkurl(1, salarySlip)}
              mode={mode}
              downloadTitles={
                downloadTitles === '' ? downloadTitles : 'Salary Slip 1'
              }
              truDownloadEnable={truDownloadEnable}
            />

            <CommonFileUpload
              title={this.mandatoryName(
                `${
                  (title === 'Home Loan' ||
                    title === 'Loan Against Property' ||
                    'Auto Loan' ||
                    title === 'Business Loan') &&
                  headerchange === false
                    ? ``
                    : `Salary Slip 2`
                }`,
                title,
              )}
              // title={`${(title === 'Home Loan' || title === 'Loan Against Property') && headerchange === false ? `` : `Salary Slip 2`}${title === 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan' ? ` *` : ``}`}
              type={2}
              pickedTitle={this.findFileName(`salaryslip1`)}
              pickedCallback={(selected, res) => {
                this.state.fileList.push({salaryslip1: res});
              }}
              enableDownloads={
                salarySlip1 != null && this.checkurl(0, salarySlip1)
              }
              downloadUrl={this.checkurl(1, salarySlip1)}
              mode={mode}
              downloadTitles={
                downloadTitles === '' ? downloadTitles : 'Salary Slip 2'
              }
              truDownloadEnable={truDownloadEnable}
            />

            <CommonFileUpload
              // title={`${(title === 'Home Loan' || title === 'Loan Against Property') && headerchange === false ? `` : `Salary Slip 3`}${title === 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan' ? ` *` : ``}`}
              title={this.mandatoryName(
                `${
                  (title === 'Home Loan' ||
                    title === 'Loan Against Property' ||
                    'Auto Loan' ||
                    title === 'Business Loan') &&
                  headerchange === false
                    ? ``
                    : `Salary Slip 3`
                }`,
                title,
              )}
              type={2}
              pickedTitle={this.findFileName(`salaryslip2`)}
              pickedCallback={(selected, res) => {
                this.state.fileList.push({salaryslip2: res});
              }}
              enableDownloads={
                salarySlip2 != null && this.checkurl(0, salarySlip2)
              }
              downloadUrl={this.checkurl(1, salarySlip2)}
              mode={mode}
              downloadTitles={
                downloadTitles === '' ? downloadTitles : 'Salary Slip 3'
              }
              truDownloadEnable={truDownloadEnable}
            />

            {(title === 'Loan Against Property' || title === 'Home Loan') &&
            headerchange === true ? (
              <View>
                <CommonFileUpload
                  title={'Salary Slip 4'}
                  type={2}
                  pickedTitle={this.findFileName(`salaryslip3`)}
                  pickedCallback={(selected, res) => {
                    this.state.fileList.push({salaryslip3: res});
                  }}
                  enableDownloads={
                    salarySlip3 != null && this.checkurl(0, salarySlip3)
                  }
                  downloadUrl={this.checkurl(1, salarySlip3)}
                  mode={mode}
                  downloadTitles={
                    downloadTitles === '' ? downloadTitles : 'Salary Slip 4'
                  }
                  truDownloadEnable={truDownloadEnable}
                />
                <CommonFileUpload
                  title={'Salary Slip 5'}
                  type={2}
                  pickedTitle={this.findFileName(`salaryslip4`)}
                  pickedCallback={(selected, res) => {
                    this.state.fileList.push({salaryslip4: res});
                  }}
                  enableDownloads={
                    salarySlip4 != null && this.checkurl(0, salarySlip4)
                  }
                  downloadUrl={this.checkurl(1, salarySlip4)}
                  mode={mode}
                  downloadTitles={
                    downloadTitles === '' ? downloadTitles : 'Salary Slip 5'
                  }
                  truDownloadEnable={truDownloadEnable}
                />
                <CommonFileUpload
                  title={'Salary Slip 6'}
                  type={2}
                  pickedTitle={this.findFileName(`salaryslip5`)}
                  pickedCallback={(selected, res) => {
                    this.state.fileList.push({salaryslip5: res});
                  }}
                  enableDownloads={
                    salarySlip5 != null && this.checkurl(0, salarySlip5)
                  }
                  downloadUrl={this.checkurl(1, salarySlip5)}
                  mode={mode}
                  downloadTitles={
                    downloadTitles === '' ? downloadTitles : 'Salary Slip 6'
                  }
                  truDownloadEnable={truDownloadEnable}
                />
              </View>
            ) : null}

            <CommonFileUpload
              title={this.mandatoryName(
                `${
                  title === 'Home Loan'
                    ? '1 Year Bank Statement'
                    : `3 Month Bank Statement`
                }`,
                title,
              )}
              // title={
              //   title === 'Home Loan'
              //     ? '1 Year Bank Statement'
              //     : `3 Month Bank Statement ${title === 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan' ? ` *` : ``}`
              // }
              type={1}
              fileType={1}
              pickedTitle={this.findFileName(`bankstate`)}
              pickedCallback={(selected, res) => {
                this.state.fileList.push({bankstate: res});
              }}
              enableDownloads={bankState != null && this.checkurl(0, bankState)}
              downloadUrl={this.checkurl(1, bankState)}
              mode={mode}
              downloadTitles={downloadTitles}
              truDownloadEnable={truDownloadEnable}
            />
          </View>
        ) : null}
      </View>
    );
  }
}

/**
 * styles
 */
const styles = StyleSheet.create({
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
  line: {
    backgroundColor: Pref.RED,
    height: 1.2,
    marginHorizontal: sizeWidth(3),
    marginTop: 4,
    marginBottom: 4,
  },
  line1: {
    backgroundColor: '#dedede',
    height: 1.2,
    marginHorizontal: sizeWidth(3),
    marginTop: 4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
  },
  title1: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6d6a57',
    lineHeight: 20,
    marginStart: 4,
    marginVertical: 8,
  },
});
