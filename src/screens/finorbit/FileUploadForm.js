import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import {
  Subtitle,
  View,
} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import { sizeWidth } from '../../util/Size';
import moment from 'moment';
import CommonFileUpload from '../common/CommonFileUpload';
import Lodash from 'lodash';

export default class FileUploadForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {
      fileList: [],
    };
  }

  // componentDidMount(){
  //     const {saveData} = this.props;
  //     if(saveData !== undefined && saveData !== null){
  //         //console.log('saveData', saveData.fileList);
  //         this.setState({ fileList: saveData.fileList});
  //     }
  // }

  restoreData(obj) {
    //console.log('obj', obj)
    if (obj !== undefined) {
      this.setState(obj);
    }
  }

  findFileName = (input) => {
    const { fileList } = this.state;
    if (fileList.length > 0) {
      let returnName = null;
      Lodash.map(fileList, io =>{
        Object.entries(io).forEach(([key, value]) =>{
          if (input === key) {
            const { name } = value;
            if (name !== undefined && name !== '') {
              returnName = name;
              //break;
            }
          }
        })
      })
      // for (let index = 0; index < fileList.length; index++) {
      //   const io = fileList[index];
      //   Object.entries(io).forEach(([key, value]) =>{
      //     if (input === key) {
      //       const { name } = io[key];
      //       if (name !== undefined && name !== '') {
      //         returnName = name;
      //         //break;
      //       }
      //     }
      //   })
        // for (var key in io) {
        //   //console.log(key);
        //   if (input === key) {
        //     const { name } = io[key];
        //     if (name !== undefined && name !== '') {
        //       returnName = name;
        //       //break;
        //     }
        //   }
        // }
        //if (returnName !== null) {
         // break;
        //}
      //}
      return returnName;
    } else {
      return null;
    }
  }

  onChange = (event, selectDate) => {
    this.setState({ showCalendar: false, currentDate: selectDate });
  };

  checkurl = (type, name) => {
    const exist = name !== undefined && name !== null && (name.includes('.png') || name.includes('.jpeg') || name.includes('.jpg') || name.includes('.pdf'));
    if (type === 0) {
      return exist ? true : false
    } else {
      return exist ? name : ''
    }
  }

  getExt = (type, name) => {
    if (this.checkurl(0, name) === false) {
      return '';
    }
    if (type === 0) {
      if (name.includes('.png') || name.includes('.jpeg') || name.includes('.jpg')) {
        return '.jpg';
      } else {
        return '.pdf';
      }
    } else {
      if (name.includes('.png') || name.includes('.jpeg') || name.includes('.jpg')) {
        return 'images/jpg';
      } else {
        return 'application/pdf';
      }
    }
  }

  mandatoryName = (name, title) => {
    //return `${name} ${title === 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan' ? ` *` : ``}`;
    return `${name}`;
  }

  render() {
    const { title, cancelChq = null, panCard = null, aadharCard = null, gstImage = null, headerchange = false,
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
    } = this.props;
    return (
      <View>
        {title !== 'Motor Insurance' ? <>
          <CommonFileUpload
            downloadTitles={downloadTitles}
            mode={mode}
            title={this.mandatoryName('Pan Card', title)}
            type={2}
            pickedTitle={this.findFileName(`pancard`)}
            pickedCallback={(selected, res) => {
              this.state.fileList.push({ pancard: res });
            }}
            enableDownloads={panCard != null && this.checkurl(0, panCard)}
            downloadUrl={this.checkurl(1, panCard)}
            fileName={'Pancard'}
            ext={this.getExt(0, panCard)}
            mime={this.getExt(1, panCard)}
          />

          <CommonFileUpload
            //title={'Aadhar Card'}
            title={this.mandatoryName('Aadhar Card', title)}
            // title={`Aadhar Card ${title === 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan' ? ` *` : ``}`}
            type={2}
            pickedTitle={this.findFileName(title === 'Demat' ? `addressproof` : `aadharcard`)}
            pickedCallback={(selected, res) => {
              if (title === 'Demat') {
                this.state.fileList.push({ addressproof: res });
              } else {
                this.state.fileList.push({ aadharcard: res });
              }
            }}
            enableDownloads={aadharCard != null && this.checkurl(0, aadharCard)}
            downloadUrl={this.checkurl(1, aadharCard)}
            fileName={'Aadharcard'}
            ext={this.getExt(0, aadharCard)}
            mime={this.getExt(1, aadharCard)}
            mode={mode}
            downloadTitles={downloadTitles}
          />
        </> : null}

        {title === 'Profile' ? (
          <>
            <CommonFileUpload
              title={'Cancelled Cheque'}
              type={2}
              pickedTitle={this.findFileName(`cancel_chq`)}
              pickedCallback={(selected, res) => {
                this.state.fileList.push({ cancel_chq: res });
              }}
              enableDownloads={this.checkurl(0, cancelChq)}
              downloadUrl={this.checkurl(1, cancelChq)}
              fileName={'CancelledCheque'}
              ext={this.getExt(0, cancelChq)}
              mime={this.getExt(1, cancelChq)}
              mode={mode}
              downloadTitles={downloadTitles}
            />
            <CommonFileUpload
              title={'GST Certificate'}
              type={2}
              pickedTitle={this.findFileName(`gst_cert`)}
              pickedCallback={(selected, res) => {
                this.state.fileList.push({ gst_cert: res });
              }}
              enableDownloads={this.checkurl(0, gstImage)}
              downloadUrl={this.checkurl(1, gstImage)}
              fileName={'GST Certificate'}
              ext={this.getExt(0, gstImage)}
              mime={this.getExt(1, gstImage)}
              mode={mode}
              downloadTitles={downloadTitles}
            />
          </>
        ) : null}

        {title === 'Motor Insurance' ? (
          <View>
            {/* <View style={styles.line1} /> */}
            <CommonFileUpload
              // title={'RC Book *'}
              title={'RC Book'}
              type={2}
              pickedTitle={this.findFileName(`rcbookcopy`)}
              pickedCallback={(selected, res) => {
                this.state.fileList.push({ rcbookcopy: res });
              }}
              enableDownloads={rcCopy != null && this.checkurl(0, rcCopy)}
              downloadUrl={this.checkurl(1, rcCopy)}
              fileName={'RC_Book'}
              ext={this.getExt(0, rcCopy)}
              mime={this.getExt(1, rcCopy)}
              mode={mode}
              downloadTitles={downloadTitles}
            />

            <CommonFileUpload
              // title={'Policy *'}
              title={'Policy'}
              type={2}
              pickedTitle={this.findFileName(`policycopy`)}
              pickedCallback={(selected, res) => {
                this.state.fileList.push({ policycopy: res });
              }}
              enableDownloads={policycopy != null && this.checkurl(0, policycopy)}
              downloadUrl={this.checkurl(1, policycopy)}
              fileName={'Policy'}
              ext={this.getExt(0, policycopy)}
              mime={this.getExt(1, policycopy)}
              mode={mode}
              downloadTitles={downloadTitles}
            />
            <CommonFileUpload
              title={'Old Insurance Policy'}
              type={2}
              pickedTitle={this.findFileName(`oldinsurancecopy`)}
              pickedCallback={(selected, res) => {
                this.state.fileList.push({ oldinsurancecopy: res });
              }}
              enableDownloads={oldInsCopy != null && this.checkurl(0, oldInsCopy)}
              downloadUrl={this.checkurl(1, oldInsCopy)}
              fileName={'Old_Insurance_Policy'}
              ext={this.getExt(0, oldInsCopy)}
              mode={mode}
              mime={this.getExt(1, oldInsCopy)}
              downloadTitles={downloadTitles}
            />

            <CommonFileUpload
              title={'PUC'}
              type={2}
              pickedTitle={this.findFileName(`puccopy`)}
              pickedCallback={(selected, res) => {
                this.state.fileList.push({ puccopy: res });
              }}
              enableDownloads={puccopy != null && this.checkurl(0, puccopy)}
              downloadUrl={this.checkurl(1, puccopy)}
              fileName={'PUC'}
              ext={this.getExt(0, puccopy)}
              mime={this.getExt(1, puccopy)}
              mode={mode}
              downloadTitles={downloadTitles}
            />
          </View>
        ) : null}

        {title === 'Demat' ? (
          <CommonFileUpload
            title={'Cancelled Cheque'}
            type={0}
            pickedTitle={this.findFileName(`cancelcheque`)}
            pickedCallback={(selected, res) => {
              if (!selected) {
                this.state.fileList.push({ cancelcheque: res });
              }
            }}
            mode={mode}
            downloadTitles={downloadTitles}
          />
        ) : null}

        {title === 'Auto Loan' ||
          title === 'Business Loan' ||
          title === 'Personal Loan' ||
          title === 'Credit Card' ||
          title === 'Loan Against Property' ||
          title === 'Home Loan' ? (
            <View>
              {/* <View style={styles.line1} /> */}

              <View
                styleName="vertical"
                style={{ marginStart: sizeWidth(2), marginVertical: 12, }}>
                <Subtitle style={styles.title1}>

                  {title === 'Personal Loan'
                    ? `3 Months Salary Slip`
                    : title === 'Credit Card'
                      ? `3 Months Salary Slip or 1 Years ITR`
                      : (title === 'Home Loan' || title === 'Loan Against Property') && headerchange === true ? `6 Months Salary Slip` : (title === 'Home Loan' || title === 'Loan Against Property') && headerchange === false ? `3 Years ITR` : title === 'Loan Against Property'
                        ? `6 Months Salary Slip or 3 Years ITR`
                        : `3 Years ITR`}
                </Subtitle>
              </View>

              <CommonFileUpload
                title={this.mandatoryName(`${(title === 'Home Loan' || title === 'Loan Against Property' || 'Auto Loan' || title === 'Business Loan') && headerchange === false ? `` : `Salary Slip 1`}`, title)}
                // title={`${(title === 'Home Loan' || title === 'Loan Against Property') && headerchange === false ? `` : `Salary Slip 1`}${title === 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan' ? ` *` : ``}`}
                type={2}
                pickedTitle={this.findFileName(`salaryslip`)}
                pickedCallback={(selected, res) => {
                  this.state.fileList.push({ salaryslip: res });
                }}
                enableDownloads={salarySlip != null && this.checkurl(0, salarySlip)}
                downloadUrl={this.checkurl(1, salarySlip)}
                fileName={'Salary_Slip1'}
                ext={this.getExt(0, salarySlip)}
                mime={this.getExt(1, salarySlip)}
                mode={mode}
                downloadTitles={downloadTitles === '' ? downloadTitles : 'Salary Slip 1'}
              />

              <CommonFileUpload
                title={this.mandatoryName(`${(title === 'Home Loan' || title === 'Loan Against Property' || 'Auto Loan' || title === 'Business Loan') && headerchange === false ? `` : `Salary Slip 2`}`, title)}
                // title={`${(title === 'Home Loan' || title === 'Loan Against Property') && headerchange === false ? `` : `Salary Slip 2`}${title === 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan' ? ` *` : ``}`}
                type={2}
                pickedTitle={this.findFileName(`salaryslip1`)}
                pickedCallback={(selected, res) => {
                  this.state.fileList.push({ salaryslip1: res });
                }}
                enableDownloads={salarySlip1 != null && this.checkurl(0, salarySlip1)}
                downloadUrl={this.checkurl(1, salarySlip1)}
                fileName={'Salary_Slip2'}
                ext={this.getExt(0, salarySlip1)}
                mime={this.getExt(1, salarySlip1)}
                mode={mode}
                downloadTitles={downloadTitles === '' ? downloadTitles : 'Salary Slip 2'}
              />

              <CommonFileUpload
                // title={`${(title === 'Home Loan' || title === 'Loan Against Property') && headerchange === false ? `` : `Salary Slip 3`}${title === 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan' ? ` *` : ``}`}
                title={this.mandatoryName(`${(title === 'Home Loan' || title === 'Loan Against Property' || 'Auto Loan' || title === 'Business Loan') && headerchange === false ? `` : `Salary Slip 3`}`, title)}
                type={2}
                pickedTitle={this.findFileName(`salaryslip2`)}
                pickedCallback={(selected, res) => {
                  this.state.fileList.push({ salaryslip2: res });
                }}
                enableDownloads={salarySlip2 != null && this.checkurl(0, salarySlip2)}
                downloadUrl={this.checkurl(1, salarySlip2)}
                fileName={'Salary_Slip3'}
                ext={this.getExt(0, salarySlip2)}
                mime={this.getExt(1, salarySlip2)}
                mode={mode}
                downloadTitles={downloadTitles === '' ? downloadTitles : 'Salary Slip 3'}
                />

              {(title === 'Loan Against Property' || title === 'Home Loan') && headerchange === true ? (
                <View>
                  <CommonFileUpload
                    title={'Salary Slip 4'}
                    type={2}
                    pickedTitle={this.findFileName(`salaryslip3`)}
                    pickedCallback={(selected, res) => {
                      this.state.fileList.push({ salaryslip3: res });
                    }}
                    enableDownloads={salarySlip3 != null && this.checkurl(0, salarySlip3)}
                    downloadUrl={this.checkurl(1, salarySlip3)}
                    fileName={'Salary_Slip4'}
                    ext={this.getExt(0, salarySlip3)}
                    mime={this.getExt(1, salarySlip3)}
                    mode={mode}
                    downloadTitles={downloadTitles === '' ? downloadTitles : 'Salary Slip 4'}
                  />
                  <CommonFileUpload
                    title={'Salary Slip 5'}
                    type={2}
                    pickedTitle={this.findFileName(`salaryslip4`)}
                    pickedCallback={(selected, res) => {
                      this.state.fileList.push({ salaryslip4: res });
                    }}
                    enableDownloads={salarySlip4 != null && this.checkurl(0, salarySlip4)}
                    downloadUrl={this.checkurl(1, salarySlip4)}
                    fileName={'Salary_Slip5'}
                    ext={this.getExt(0, salarySlip4)}
                    mime={this.getExt(1, salarySlip4)}
                    mode={mode}
                    downloadTitles={downloadTitles === '' ? downloadTitles : 'Salary Slip 5'}
                  />
                  <CommonFileUpload
                    title={'Salary Slip 6'}
                    type={2}
                    pickedTitle={this.findFileName(`salaryslip5`)}
                    pickedCallback={(selected, res) => {
                      this.state.fileList.push({ salaryslip5: res });
                    }}
                    enableDownloads={salarySlip5 != null && this.checkurl(0, salarySlip5)}
                    downloadUrl={this.checkurl(1, salarySlip5)}
                    fileName={'Salary_Slip6'}
                    ext={this.getExt(0, salarySlip5)}
                    mime={this.getExt(1, salarySlip5)}
                    mode={mode}
                    downloadTitles={downloadTitles === '' ? downloadTitles : 'Salary Slip 6'}
                  />
                </View>
              ) : null}

              <CommonFileUpload
                title={this.mandatoryName(`${title === 'Home Loan'
                  ? '1 Year Bank Statement'
                  : `3 Month Bank Statement`}`, title)}
                // title={
                //   title === 'Home Loan'
                //     ? '1 Year Bank Statement'
                //     : `3 Month Bank Statement ${title === 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan' ? ` *` : ``}`
                // }
                type={1}
                fileType={1}
                pickedTitle={this.findFileName(`bankstate`)}
                pickedCallback={(selected, res) => {
                  this.state.fileList.push({ bankstate: res });
                }}
                enableDownloads={bankState != null && this.checkurl(0, bankState)}
                downloadUrl={this.checkurl(1, bankState)}
                fileName={'Bank_state'}
                ext={this.getExt(0, bankState)}
                mime={this.getExt(1, bankState)}
                mode={mode}
                downloadTitles={downloadTitles}
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
    marginVertical: 8
  },
});
