import React from 'react';
import {
  StatusBar,
  StyleSheet,
  ScrollView,
  BackHandler,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Image,
  Screen,
  Subtitle,
  Title,
  Text,
  Caption,
  View,
  Heading,
  TouchableOpacity,
  DropDownMenu,
  DropDownModal,
} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {
  Button,
  Card,
  Colors,
  Snackbar,
  TextInput,
  DefaultTheme,
  FAB,
} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import {SafeAreaView} from 'react-navigation';
import {sizeFont, sizeHeight, sizeWidth} from '../../util/Size';
import Icon from 'react-native-vector-icons/Feather';
import Icons from 'react-native-vector-icons/FontAwesome5';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import DropDown from '../common/CommonDropDown';
import Lodash from 'lodash';
import CommonFileUpload from '../common/CommonFileUpload';
import {showMessage} from 'react-native-flash-message';

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

  onChange = (event, selectDate) => {
    const fullDate = moment(selectDate).format('DD-MM-YYYY');
    this.setState({showCalendar: false, currentDate: selectDate});
  };

  render() {
    const {title, heading = `File Upload`} = this.props;
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

        <CommonFileUpload
          title={'Pan Card'}
          type={2}
          pickedCallback={(selected, res) => {
            if (!selected) {
              const {name} = res;
              if (
                name.includes('pdf') ||
                name.includes('png') ||
                name.includes('jpeg') ||
                name.includes('jpg')
              ) {
                console.log(`res`, res);
                this.state.fileList.push({pancard: res});
              } else {
                Helper.showToastMessage('Please, select Pdf or Image', 0);
              }
            }
          }}
        />

        <CommonFileUpload
          title={'Aadhar Card'}
          type={2}
          pickedCallback={(selected, res) => {
            if (!selected) {
              const {name} = res;
              if (
                name.includes('pdf') ||
                name.includes('png') ||
                name.includes('jpeg') ||
                name.includes('jpg')
              ) {
                console.log(`res`, res);
                if (title === 'Demat') {
                  this.state.fileList.push({addressproof: res});
                } else {
                  this.state.fileList.push({aadharcard: res});
                }
              } else {
                Helper.showToastMessage('Please, select Pdf or Image', 0);
              }
            }
          }}
        />

        {title === 'Profile' ? (
          <CommonFileUpload
            title={'Cancelled Cheque'}
            type={1}
            pickedCallback={(selected, res) => {
              if (!selected) {
                this.state.fileList.push({cancel_chq: res});
              }
            }}
          />
        ) : null}

        {title === 'Profile' ? (
          <CommonFileUpload
            title={'GST Certificate'}
            type={1}
            pickedCallback={(selected, res) => {
              if (!selected) {
                this.state.fileList.push({gst_cert: res});
              }
            }}
          />
        ) : null}

        {title === 'Motor Insurance' ? (
          <View>
            <View style={styles.line1} />

            <CommonFileUpload
              title={'RC Copy *'}
              type={2}
              pickedCallback={(selected, res) => {
                if (!selected) {
                  const {name} = res;
                  if (
                    name.includes('pdf') ||
                    name.includes('png') ||
                    name.includes('jpeg') ||
                    name.includes('jpg')
                  ) {
                    this.state.fileList.push({rcbookcopy: res});
                  } else {
                    Helper.showToastMessage('Please, select Pdf or Image', 0);
                  }
                }
              }}
            />
            <CommonFileUpload
              title={'Old Insurance Copy'}
              type={2}
              pickedCallback={(selected, res) => {
                if (!selected) {
                  const {name} = res;
                  if (
                    name.includes('pdf') ||
                    name.includes('png') ||
                    name.includes('jpeg') ||
                    name.includes('jpg')
                  ) {
                    this.state.fileList.push({oldinsurancecopy: res});
                  } else {
                    Helper.showToastMessage('Please, select Pdf or Image', 0);
                  }
                }
              }}
            />

            <CommonFileUpload
              title={'PUC Copy'}
              type={2}
              pickedCallback={(selected, res) => {
                if (!selected) {
                  const {name} = res;
                  if (
                    name.includes('pdf') ||
                    name.includes('png') ||
                    name.includes('jpeg') ||
                    name.includes('jpg')
                  ) {
                    this.state.fileList.push({puccopy: res});
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
            pickedCallback={(selected, res) => {
              if (!selected) {
                this.state.fileList.push({cancelcheque: res});
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
            <View style={styles.line1} />

            <View
              styleName="vertical"
              style={{marginStart: sizeWidth(2), marginTop: 6}}>
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
              title={''}
              type={1}
              pickedCallback={(selected, res) => {
                if (!selected) {
                  this.state.fileList.push({salaryslip: res});
                }
              }}
            />

            <CommonFileUpload
              title={''}
              type={1}
              pickedCallback={(selected, res) => {
                if (!selected) {
                  this.state.fileList.push({salaryslip1: res});
                }
              }}
            />

            <CommonFileUpload
              title={''}
              type={1}
              pickedCallback={(selected, res) => {
                if (!selected) {
                  this.state.fileList.push({salaryslip2: res});
                }
              }}
            />

            {title === 'Loan Against Property' || title === 'Home Loan' ? (
              <View>
                <CommonFileUpload
                  title={''}
                  type={1}
                  pickedCallback={(selected, res) => {
                    if (!selected) {
                      this.state.fileList.push({salaryslip3: res});
                    }
                  }}
                />
                <CommonFileUpload
                  title={''}
                  type={1}
                  pickedCallback={(selected, res) => {
                    if (!selected) {
                      this.state.fileList.push({salaryslip4: res});
                    }
                  }}
                />
                <CommonFileUpload
                  title={''}
                  type={1}
                  pickedCallback={(selected, res) => {
                    if (!selected) {
                      this.state.fileList.push({salaryslip5: res});
                    }
                  }}
                />
              </View>
            ) : null}

            <View style={styles.line1} />

            <CommonFileUpload
              title={
                title === 'Home Loan'
                  ? '1 Year Bank Statement'
                  : '3 Month Bank Statement'
              }
              type={1}
              pickedCallback={(selected, res) => {
                if (!selected) {
                  this.state.fileList.push({bankstate: res});
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
    fontSize: 16,
    fontFamily: 'Rubik',
    fontFamily: '400',
    letterSpacing: 1,
    color: '#242424',
    alignSelf: 'flex-start',
  },
});
