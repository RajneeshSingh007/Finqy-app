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
  //         console.log('saveData', saveData.fileList);
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
      for (let index = 0; index < fileList.length; index++) {
        const io = fileList[index];
        for (var key in io) {
          console.log(key);
          if (input === key) {
            const { name } = io[key];
            if (name !== undefined && name !== '') {
              returnName = name;
              break;
            }
          }
        }
        if (returnName !== null) {
          break;
        }
      }
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

  render() {
    const { title, cancelChq = null, panCard = null, aadharCard = null, gstImage = null } = this.props;
    return (
      <View>
        {/* <View
          style={{
            marginTop: sizeHeight(2),
            marginBottom: sizeHeight(1),
          }}
          styleName="horizontal">
          <View styleName="vertical" style={{marginStart: sizeWidth(2)}}>
            <Subtitle style={styles.title}> {heading}</Subtitle>
          </View>
        </View>
        <View style={styles.line} /> */}

        {title !== 'Motor Insurance' ? <>
          <CommonFileUpload
            title={`Pan Card ${title === 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan' ? ` *` : ``}`}
            type={2}
            pickedTitle={this.findFileName(`pancard`)}
            pickedCallback={(selected, res) => {
              if (!selected) {
                const { name } = res;
                if (
                  name.includes('pdf') ||
                  name.includes('png') ||
                  name.includes('jpeg') ||
                  name.includes('jpg')
                ) {
                  console.log(`res`, res);
                  this.state.fileList.push({ pancard: res });
                  //this.state.fileList.push({ pan_image: res});
                } else {
                  Helper.showToastMessage('Please, select Pdf or Image', 0);
                }
              }
            }}
            enableDownloads={panCard != null && this.checkurl(0, panCard)}
            downloadUrl={this.checkurl(1, panCard)}
            fileName={'Pancard'}
            ext={this.getExt(0, panCard)}
            mime={this.getExt(1, panCard)}
          />

          <CommonFileUpload
            //title={'Aadhar Card'}
            title={`Aadhar Card ${title === 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan' ? ` *` : ``}`}
            type={2}
            pickedTitle={this.findFileName(title === 'Demat' ? `addressproof` : `aadharcard`)}
            pickedCallback={(selected, res) => {
              if (!selected) {
                const { name } = res;
                if (
                  name.includes('pdf') ||
                  name.includes('png') ||
                  name.includes('jpeg') ||
                  name.includes('jpg')
                ) {
                  if (title === 'Demat') {
                    this.state.fileList.push({ addressproof: res });
                  } else {
                    this.state.fileList.push({ aadharcard: res });
                  }
                } else {
                  Helper.showToastMessage('Please, select Pdf or Image', 0);
                }
              }
            }}
            enableDownloads={aadharCard != null && this.checkurl(0, aadharCard)}
            downloadUrl={this.checkurl(1, aadharCard)}
            fileName={'Aadharcard'}
            ext={this.getExt(0, aadharCard)}
            mime={this.getExt(1, aadharCard)}
          />
        </> : null}

        {title === 'Profile' ? (
          <CommonFileUpload
            title={'Cancelled Cheque'}
            type={2}
            pickedTitle={this.findFileName(`cancel_chq`)}
            pickedCallback={(selected, res) => {
              if (!selected) {
                const { name } = res;
                if (
                  name.includes('pdf') ||
                  name.includes('png') ||
                  name.includes('jpeg') ||
                  name.includes('jpg')
                ) {
                  this.state.fileList.push({ cancel_chq: res });
                } else {
                  Helper.showToastMessage('Please, select Pdf or Image', 0);
                }
              }
            }}
            enableDownloads={this.checkurl(0, cancelChq)}
            downloadUrl={this.checkurl(1, cancelChq)}
            fileName={'CancelledCheque'}
            ext={this.getExt(0, cancelChq)}
            mime={this.getExt(1, cancelChq)}
          />
        ) : null}

        {title === 'Profile' ? (
          <CommonFileUpload
            title={'GST Certificate'}
            type={2}
            pickedTitle={this.findFileName(`gst_cert`)}
            pickedCallback={(selected, res) => {
              if (!selected) {
                const { name } = res;
                if (
                  name.includes('pdf') ||
                  name.includes('png') ||
                  name.includes('jpeg') ||
                  name.includes('jpg')
                ) {
                  this.state.fileList.push({ gst_cert: res });
                } else {
                  Helper.showToastMessage('Please, select Pdf or Image', 0);
                }
              }
            }}
            enableDownloads={this.checkurl(0, gstImage)}
            downloadUrl={this.checkurl(1, gstImage)}
            fileName={'GST Certificate'}
            ext={this.getExt(0, gstImage)}
            mime={this.getExt(1, gstImage)}
          />
        ) : null}

        {title === 'Motor Insurance' ? (
          <View>
            {/* <View style={styles.line1} /> */}
            <CommonFileUpload
              title={'RC Book *'}
              type={2}
              pickedTitle={this.findFileName(`rcbookcopy`)}
              pickedCallback={(selected, res) => {
                if (!selected) {
                  const { name } = res;
                  if (
                    name.includes('pdf') ||
                    name.includes('png') ||
                    name.includes('jpeg') ||
                    name.includes('jpg')
                  ) {
                    this.state.fileList.push({ rcbookcopy: res });
                  } else {
                    Helper.showToastMessage('Please, select Pdf or Image', 0);
                  }
                }
              }}
            />

            <CommonFileUpload
              title={'Policy *'}
              type={2}
              pickedTitle={this.findFileName(`policycopy`)}
              pickedCallback={(selected, res) => {
                if (!selected) {
                  const { name } = res;
                  if (
                    name.includes('pdf') ||
                    name.includes('png') ||
                    name.includes('jpeg') ||
                    name.includes('jpg')
                  ) {
                    this.state.fileList.push({ policycopy: res });
                  } else {
                    Helper.showToastMessage('Please, select Pdf or Image', 0);
                  }
                }
              }}
            />
            <CommonFileUpload
              title={'Old Insurance Policy'}
              type={2}
              pickedTitle={this.findFileName(`oldinsurancecopy`)}
              pickedCallback={(selected, res) => {
                if (!selected) {
                  const { name } = res;
                  if (
                    name.includes('pdf') ||
                    name.includes('png') ||
                    name.includes('jpeg') ||
                    name.includes('jpg')
                  ) {
                    this.state.fileList.push({ oldinsurancecopy: res });
                  } else {
                    Helper.showToastMessage('Please, select Pdf or Image', 0);
                  }
                }
              }}
            />

            <CommonFileUpload
              title={'PUC'}
              type={2}
              pickedTitle={this.findFileName(`puccopy`)}
              pickedCallback={(selected, res) => {
                if (!selected) {
                  const { name } = res;
                  if (
                    name.includes('pdf') ||
                    name.includes('png') ||
                    name.includes('jpeg') ||
                    name.includes('jpg')
                  ) {
                    this.state.fileList.push({ puccopy: res });
                  } else {
                    Helper.showToastMessage('Please, select Pdf or Image', 0);
                  }
                }
              }}
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
                      : title === 'Loan Against Property' || title === 'Home Loan'
                        ? `6 Months Salary Slip or 3 Years ITR`
                        : `3 Years ITR`}
                </Subtitle>
              </View>

              <CommonFileUpload
                title={`Salary Slip 1 ${title === 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan' ? ` *` : ``}`}
                type={2}
                pickedTitle={this.findFileName(`salaryslip`)}
                pickedCallback={(selected, res) => {
                  if (!selected) {
                    const { name } = res;
                    if (
                      name.includes('pdf') ||
                      name.includes('png') ||
                      name.includes('jpeg') ||
                      name.includes('jpg')
                    ) {
                      this.state.fileList.push({ salaryslip: res });
                    } else {
                      Helper.showToastMessage('Please, select Pdf or Image', 0);
                    }
                  }
                }}
              />

              <CommonFileUpload
                title={`Salary Slip 2 ${title === 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan' ? ` *` : ``}`}
                type={2}
                pickedTitle={this.findFileName(`salaryslip1`)}
                pickedCallback={(selected, res) => {
                  if (!selected) {
                    const { name } = res;
                    if (
                      name.includes('pdf') ||
                      name.includes('png') ||
                      name.includes('jpeg') ||
                      name.includes('jpg')
                    ) {
                      this.state.fileList.push({ salaryslip1: res });
                    } else {
                      Helper.showToastMessage('Please, select Pdf or Image', 0);
                    }

                  }
                }}
              />

              <CommonFileUpload
                title={`Salary Slip 3 ${title === 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan' ? ` *` : ``}`}
                type={2}
                pickedTitle={this.findFileName(`salaryslip2`)}
                pickedCallback={(selected, res) => {
                  if (!selected) {
                    const { name } = res;
                    if (
                      name.includes('pdf') ||
                      name.includes('png') ||
                      name.includes('jpeg') ||
                      name.includes('jpg')
                    ) {
                      this.state.fileList.push({ salaryslip2: res });
                    } else {
                      Helper.showToastMessage('Please, select Pdf or Image', 0);
                    }
                  }
                }}
              />

              {title === 'Loan Against Property' || title === 'Home Loan' ? (
                <View>
                  <CommonFileUpload
                    title={'Salary Slip 4'}
                    type={2}
                    pickedTitle={this.findFileName(`salaryslip3`)}
                    pickedCallback={(selected, res) => {
                      if (!selected) {
                        const { name } = res;
                        if (
                          name.includes('pdf') ||
                          name.includes('png') ||
                          name.includes('jpeg') ||
                          name.includes('jpg')
                        ) {
                          this.state.fileList.push({ salaryslip3: res });
                        } else {
                          Helper.showToastMessage('Please, select Pdf or Image', 0);
                        }
                      }
                    }}
                  />
                  <CommonFileUpload
                    title={'Salary Slip 5'}
                    type={2}
                    pickedTitle={this.findFileName(`salaryslip4`)}
                    pickedCallback={(selected, res) => {
                      if (!selected) {
                        const { name } = res;
                        if (
                          name.includes('pdf') ||
                          name.includes('png') ||
                          name.includes('jpeg') ||
                          name.includes('jpg')
                        ) {
                          this.state.fileList.push({ salaryslip4: res });
                        } else {
                          Helper.showToastMessage('Please, select Pdf or Image', 0);
                        }

                      }
                    }}
                  />
                  <CommonFileUpload
                    title={'Salary Slip 6'}
                    type={2}
                    pickedTitle={this.findFileName(`salaryslip5`)}
                    pickedCallback={(selected, res) => {
                      if (!selected) {
                        const { name } = res;
                        if (
                          name.includes('pdf') ||
                          name.includes('png') ||
                          name.includes('jpeg') ||
                          name.includes('jpg')
                        ) {
                          this.state.fileList.push({ salaryslip5: res });
                        } else {
                          Helper.showToastMessage('Please, select Pdf or Image', 0);
                        }
                      }
                    }}
                  />
                </View>
              ) : null}

              {/* <View style={styles.line1} /> */}

              <CommonFileUpload
                title={
                  title === 'Home Loan'
                    ? '1 Year Bank Statement'
                    : `3 Month Bank Statement ${title === 'Auto Loan' || title === 'Business Loan' || title === 'Personal Loan' ? ` *` : ``}`
                }
                type={2}
                pickedTitle={this.findFileName(`bankstate`)}
                pickedCallback={(selected, res) => {
                  if (!selected) {
                    const { name } = res;
                    if (
                      name.includes('pdf') ||
                      name.includes('png') ||
                      name.includes('jpeg') ||
                      name.includes('jpg')
                    ) {
                      this.state.fileList.push({ bankstate: res });
                    } else {
                      Helper.showToastMessage('Please, select Pdf or Image', 0);
                    }
                  }
                }}
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
