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
  Avatar,
} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import { SafeAreaView } from 'react-navigation';
import { sizeFont, sizeHeight, sizeWidth } from '../../util/Size';
import CommonScreen from '../common/CommonScreen';
import CommonForm from '../finorbit/CommonForm';
import FileUploadForm from '../finorbit/FileUploadForm';
import DocumentPicker from 'react-native-document-picker';
import BankForm from './BankForm';
import LeftHeaders from '../common/CommonLeftHeader';
import SpecificForm from '../finorbit/SpecificForm';
import Lodash from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../../util/Loader';
import CScreen from '../component/CScreen';
import StepIndicator from '../component/StepIndicator';
import AnimatedInputBox from '../component/AnimatedInputBox';

export default class ProfileScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.submitt = this.submitt.bind(this);
    this.commonFormRef = React.createRef();
    this.filePicker = this.filePicker.bind(this);
    this.FileUploadFormRef = React.createRef();
    this.specificFormRef = React.createRef();
    this.bankFormRef = React.createRef();
    this.state = {
      loading: false,
      imageUrl: '',
      message: '',
      userData: {},
      editable: false,
      disabled: false,
      userID: '',
      pancardupload: '',
      addressupload: '',
      aadharcardupload: '',
      res: null,
      utype: '',
      currentposition: 0,
      btnText: 'Next',
      dataArray: [],
      fileName: '',
      mail_host: '',
      mail_port: '',
      mail_username: '',
      mail_password: ''
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.willfocusListener = navigation.addListener('willFocus', () => {
      Pref.getVal(Pref.saveToken, (toke) => {
        this.setState({ token: toke }, () => {
          Pref.getVal(Pref.userData, (parseda) => {
            const pp = parseda.user_prof;
            const url = pp === undefined || pp === null || pp === '' ? require('../../res/images/account.png') : {
              uri: `${pp}`,
            };
            let fileName = '';
            if (pp !== '') {
              const sp = pp.split('/');
              fileName = sp[sp.length - 1];
            }
            const { mail_host, mail_password, mail_port, mail_username } = parseda;
            this.setState({
              userData: parseda,
              imageUrl: url,
              fileName: fileName,
              mail_host: Helper.nullStringCheck(mail_host) === true ? '' : mail_host,
              mail_port: Helper.nullStringCheck(mail_port) === true ? '' : mail_port,
              mail_username: Helper.nullStringCheck(mail_username) === true ? '' : mail_username,
              mail_password: Helper.nullStringCheck(mail_password) === true ? '' : mail_password
            });
            this.updateData(parseda);
          });
        });
        Pref.getVal(Pref.USERTYPE, (v) => this.setState({ utype: v }));
      });
    });
  }

  updateData = (userData) => {
    if (this.commonFormRef.current !== null) {
      this.commonFormRef.current.saveData(
        userData.rname,
        userData.pincode,
        userData.location,
        userData.email,
        userData.rcontact,
        '',
        '',
        '',
        userData.office_add,
        '',
        userData.gst_no,
      );
    }
    if (this.specificFormRef.current !== null) {
      this.specificFormRef.current.saveData(
        '',
        '',
        '',
        userData.aadharno,
        userData.panno,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      );
    }
  };

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  submitt = () => {
    const { token, res, userData, utype, currentposition, fileName } = this.state;
    if (currentposition < 2) {
      if (currentposition === 0) {
        let commons = JSON.parse(
          JSON.stringify(this.commonFormRef.current.state),
        );
        delete commons.genderList;
        delete commons.employList;
        delete commons.cityList;
        delete commons.showCityList;
        delete commons.showGenderList;
        delete commons.showCalendar;
        delete commons.showEmployList;
        delete commons.currentDate;
        delete commons.maxDate;
        delete commons.gender;
        delete commons.dob;
        delete commons.employ;

        let spcommons = JSON.parse(
          JSON.stringify(this.specificFormRef.current.state),
        );
        delete spcommons.cityList;
        delete spcommons.showCarList;
        delete spcommons.showExisitingList;
        delete spcommons.showCalendar;
        delete spcommons.showLoanCityList;
        delete spcommons.motorInsList;
        delete spcommons.exisitingList;
        delete spcommons.employList;
        delete spcommons.carList;
        delete spcommons.termInsList;
        delete spcommons.showmotorInsList;
        delete spcommons.showtermInsList;
        delete spcommons.healthFList;
        delete spcommons.showHealthFlist;
        delete spcommons.maritalList;
        delete spcommons.showmaritalList;
        delete spcommons.showCompanyCityList;
        delete spcommons.currentDate;
        delete spcommons.maxDate;
        delete spcommons.vectorInsuList;
        delete spcommons.showvectorCoverList;
        delete spcommons.showvectorInsuList;
        delete spcommons.vectorCoverList;
        delete spcommons.vectorTypeIns;
        delete spcommons.vectorCover;
        delete spcommons.qualification;
        delete spcommons.company;
        delete spcommons.amount;
        delete spcommons.companylocation;
        delete spcommons.turnover;
        delete spcommons.nooldcard;
        delete spcommons.existingcard;
        delete spcommons.loan_property_city;
        delete spcommons.rcbook;
        delete spcommons.model;
        delete spcommons.car_brand;
        delete spcommons.car_value;
        delete spcommons.floaterItemList;

        if (commons != null) {
          this.state.dataArray[0] = commons;
        }
        if (spcommons != null) {
          this.state.dataArray[1] = spcommons;
        }
      } else if (currentposition === 1) {
        let commons = JSON.parse(
          JSON.stringify(this.bankFormRef.current.state),
        );
        if (commons != null) {
          this.state.dataArray[2] = commons;
        }
      }
      this.setState(
        (prevProp) => {
          return {
            currentposition: prevProp.currentposition + 1,
            btnText: currentposition === 1 ? 'Submit' : 'Next',
          };
        },
        () => {
          if (this.state.currentposition === 1) {
            this.bankFormRef.current.saveData(
              '',
              userData.bank_ifsc,
              userData.account_no,
              userData.bank_account_name,
              userData.account_branch,
              userData.account_type,
            );
          }
        },
      );
      return false;
    }
    let checkData = true;

    let formData = new FormData();
    formData.append('user_id', userData.id);
    formData.append('type', utype);
    formData.append('mail_host', this.state.mail_host);
    formData.append('mail_port', this.state.mail_port);
    formData.append('mail_username', this.state.mail_username);
    formData.append('mail_password', this.state.mail_password);

    let commons = this.state.dataArray[0];
    //JSON.parse(JSON.stringify(this.commonFormRef.current.state));
    // delete commons.genderList;
    // delete commons.employList;
    // delete commons.cityList;
    // delete commons.showCityList;
    // delete commons.showGenderList;
    // delete commons.showCalendar;
    // delete commons.showEmployList;
    // delete commons.currentDate;
    // delete commons.maxDate;
    // delete commons.gender;
    // delete commons.dob;
    // delete commons.employ;

    for (var key in commons) {
      const value = commons[key];
      if (value !== undefined) {
        formData.append(key, commons[key]);
      }
    }

    let spcommons = this.state.dataArray[1];

    //JSON.parse(JSON.stringify(this.specificFormRef.current.state));
    // delete spcommons.cityList;
    // delete spcommons.showCarList;
    // delete spcommons.showExisitingList;
    // delete spcommons.showCalendar;
    // delete spcommons.showLoanCityList;
    // delete spcommons.motorInsList;
    // delete spcommons.exisitingList;
    // delete spcommons.employList;
    // delete spcommons.carList;
    // delete spcommons.termInsList;
    // delete spcommons.showmotorInsList;
    // delete spcommons.showtermInsList;
    // delete spcommons.healthFList;
    // delete spcommons.showHealthFlist;
    // delete spcommons.maritalList;
    // delete spcommons.showmaritalList;
    // delete spcommons.showCompanyCityList;
    // delete spcommons.currentDate;
    // delete spcommons.maxDate;
    // delete spcommons.vectorInsuList;
    // delete spcommons.showvectorCoverList;
    // delete spcommons.showvectorInsuList;
    // delete spcommons.vectorCoverList;
    // delete spcommons.vectorTypeIns;
    // delete spcommons.vectorCover;
    // delete spcommons.qualification;
    // delete spcommons.company;
    // delete spcommons.amount;
    // delete spcommons.companylocation;
    // delete spcommons.turnover;
    // delete spcommons.nooldcard;
    // delete spcommons.existingcard;
    // delete spcommons.loan_property_city;
    // delete spcommons.rcbook;
    // delete spcommons.model;
    // delete spcommons.car_brand;
    // delete spcommons.car_value;
    // delete spcommons.floaterItemList;

    if (spcommons.pancardNo !== '') {
      if (!Helper.checkPanCard(spcommons.pancardNo)) {
        checkData = false;
        Helper.showToastMessage('Invalid pan card number', 0);
      } else {
        for (var keys in spcommons) {
          const value = spcommons[keys];
          if (value !== undefined) {
            formData.append(keys, spcommons[keys]);
          }
        }
      }
    }

    let bankformCommons = this.state.dataArray[2];

    for (var keys in bankformCommons) {
      const value = bankformCommons[keys];
      if (value !== undefined) {
        formData.append(keys, bankformCommons[keys]);
      }
    }

    let fcommons = JSON.parse(
      JSON.stringify(this.FileUploadFormRef.current.state),
    );
    let filex = fcommons.fileList;
    if (filex !== undefined && filex !== null && filex.length > 0) {
      const loops = Lodash.map(filex, (ele) => {
        let parseJs = JSON.parse(JSON.stringify(ele));
        for (var key in parseJs) {
          const value = parseJs[key];
          if (value !== undefined) {
            formData.append(key, parseJs[key]);
          }
        }
      });
    }

    if (res != null) {
      formData.append('user_prof', res);
    } else if (fileName !== '') {
      formData.append('user_prof', fileName);
    }
    //console.log(`formData`, formData, token);

    if (checkData) {
      this.setState({ loading: true });
      Helper.networkHelperTokenContentType(
        Pref.UpdateAccountUrl,
        formData,
        Pref.methodPost,
        token,
        (result) => {
          //console.log(`result`, result);
          const { data, response_header } = result;
          const { res_type, message } = response_header;
          this.setState({ loading: false });
          if (res_type === `success`) {
            //Helper.showToastMessage('Profile updated successfully', 1);
            const { id } = data[0];
            Pref.setVal(Pref.userID, id);
            Pref.setVal(Pref.userData, data[0]);
            this.setState({ userData: data[0] });
            NavigationActions.navigate('Finish', {
              top: 'Edit Profile',
              red: 'Success',
              grey: 'Details updated',
              blue: 'Back to main menu',
            });
            //this.updateData(data[0]);
          } else {
            Helper.showToastMessage('Failed to update profile', 0);
          }
        },
        (error) => {
          //console.log(`error`, error);
          this.setState({ loading: false });
        },
      );
    }
  };

  filePicker = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: DocumentPicker.types.images,
      });
      this.setState({ imageUrl: { uri: res.uri }, res: res });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        //
      }
    }
  };

  backNav = () => {
    const { currentposition } = this.state;
    if (currentposition > 0) {
      this.setState((prev) => {
        return {
          currentposition: prev.currentposition - 1,
          btnText: 'Next',
        };
      });
    }
  };

  render() {
    return (
      <CScreen
        absolute={<Loader isShow={this.state.loading} />}
        body={
          <>
            <LeftHeaders
              title={`Edit My Profile`}
              bottomtext={
                <>
                  {`User `}
                  {<Title style={styles.passText}>{`Details`}</Title>}
                </>
              }
              bottomtextStyle={{
                color: '#555555',
                fontSize: 20,
              }}
              showBack
            />

            <TouchableWithoutFeedback onPress={() => this.filePicker()}>
              <View
                style={{
                  marginVertical: sizeHeight(1),
                  alignSelf: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                }}>
                <Avatar.Image
                  source={this.state.imageUrl}
                  style={{ backgroundColor: 'transparent' }}
                  size={124}
                />
              </View>
            </TouchableWithoutFeedback>

            <StepIndicator
              stepCount={3}
              activeCounter={this.state.currentposition}
            />

            <View styleName="md-gutter">
              {this.state.currentposition === 0 ? (
                <>
                  <CommonForm
                    title="Profile"
                    ref={this.commonFormRef}
                    saveData={this.state.dataArray[0]}
                  />

                  <SpecificForm
                    title="Demat"
                    heading={`Other Information`}
                    ref={this.specificFormRef}
                    saveData={this.state.dataArray[1]}
                  />
                  <View>
                    <AnimatedInputBox
                      placeholder={'Mail Host'}
                      onChangeText={(value) =>
                        this.setState({ mail_host: value })
                      }
                      value={this.state.mail_host}
                      changecolor
                      containerstyle={styles.animatedInputCont}
                      returnKeyType={'next'}
                    />

                    <AnimatedInputBox
                      placeholder={'Mail Port'}
                      onChangeText={(value) => {
                        if (String(value).match(/^[0-9]*$/g) !== null) {
                          this.setState({ mail_port: value })
                        }
                      }}
                      value={this.state.mail_port}
                      changecolor
                      keyboardType={'numeric'}
                      containerstyle={styles.animatedInputCont}
                      returnKeyType={'next'}
                    />


                    <AnimatedInputBox
                      placeholder={'Mail Username'}
                      onChangeText={(value) =>
                        this.setState({ mail_username: value })
                      }
                      value={this.state.mail_username}
                      changecolor
                      containerstyle={styles.animatedInputCont}
                      returnKeyType={'next'}
                    />


                    <AnimatedInputBox
                      placeholder={'Mail Password'}
                      onChangeText={(value) =>
                        this.setState({ mail_password: value })
                      }
                      value={this.state.mail_password}
                      changecolor
                      containerstyle={styles.animatedInputCont}
                      returnKeyType={'next'}
                    />

                  </View>
                </>
              ) : this.state.currentposition === 1 ? (
                <BankForm
                  ref={this.bankFormRef}
                  saveData={this.state.dataArray[2]}
                />
              ) : this.state.currentposition === 2 ? (
                <FileUploadForm
                  title="Profile"
                  ref={this.FileUploadFormRef}
                  heading={`File Upload`}
                />
              ) : null}
            </View>

            <View
              styleName={`horizontal space-between md-gutter ${this.state.currentposition === 0 ? `v-end h-end` : ``
                }`}>
              {this.state.currentposition === 1 ||
                this.state.currentposition === 2 ? (
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
                onPress={this.submitt}>
                <Title style={styles.btntext}>{this.state.btnText}</Title>
              </Button>
            </View>
          </>
        }
      />
      // <CommonScreen
      //   title={''}
      //   loading={this.state.loading}
      //   absoluteBody={<Loader isShow={this.state.loading} />}
      //   body={
      //     <>
      //       <LeftHeaders
      //         //showAvtar
      //         //rightImage={false}
      //         //url={require('../../res/images/moneywallets.png')}
      //         title={'My Profile'}
      //         showBack
      //       />

      //       <Card
      //         style={{
      //           marginHorizontal: sizeWidth(4),
      //           marginVertical: sizeHeight(2),
      //           paddingHorizontal: sizeWidth(0),
      //         }}>
      // <TouchableWithoutFeedback onPress={() => this.filePicker()}>
      //   <View
      //     style={{
      //       marginVertical: sizeHeight(2),
      //       alignSelf: 'center',
      //       justifyContent: 'center',
      //       backgroundColor: 'transparent',
      //     }}>
      //     <Avatar.Image
      //       source={this.state.imageUrl}
      //       style={{backgroundColor: Colors.grey300}}
      //       size={96}
      //       backgroundColor={'transparent'}
      //     />
      //   </View>
      // </TouchableWithoutFeedback>

      //         <CommonForm title="Profile" ref={this.commonFormRef} />

      // <SpecificForm
      //   title="Demat"
      //   heading={`Other Information`}
      //   ref={this.specificFormRef}
      // />

      //         <BankForm ref={this.bankFormRef} />

      // <FileUploadForm
      //   title="Profile"
      //   ref={this.FileUploadFormRef}
      //   heading={`File Upload`}
      // />

      //         {/* <View style={{marginVertical:sizeHeight(1),justifyContent:'center',alignContents:'center',alignItems:'center'}}>
      //                       {this.state.pancardupload !== '' ? <Image styleName='medium' source={{ uri: `${Pref.FOLDERPATH}${this.state.pancardupload}` }} style={{margin:16}} /> : null}
      //                       {this.state.aadharcardupload !== '' ? <Image styleName='medium' source={{ uri: `${Pref.FOLDERPATH}${this.state.aadharcardupload}` }} /> : null}
      //                       {this.state.addressupload !== '' ? <Icon name='pdf' size={56} source={{ uri: `${Pref.FOLDERPATH}${this.state.addressupload}` }} /> : null}
      //                   </View> */}

      //         <Button
      //           mode={'flat'}
      //           uppercase={true}
      //           dark={true}
      //           loading={false}
      //           style={[styles.loginButtonStyle]}
      //           onPress={this.submitt}>
      //           <Text
      //             style={{
      //               color: 'white',
      //               fontSize: 16,
      //               letterSpacing: 1,
      //             }}>
      //             {'Save Profile'}
      //           </Text>
      //         </Button>
      //       </Card>
      //     </>
      //   }
      // />
    );
  }
}

/**
 * styles
 */
const styles = StyleSheet.create({
  dropdownbox: {
    flexDirection: 'row',
    height: 56,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  radiodownbox: {
    flexDirection: 'column',
    height: 56,
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 16,
  },
  textopen: {
    fontSize: 14,
    fontWeight: '700',
    color: '#555555',
    lineHeight: 20,
    alignSelf: 'center',
    marginStart: 4,
    letterSpacing: 0.5,
  },
  btntext: {
    color: 'white',
    fontSize: 16,
    letterSpacing: 0.5,
    fontWeight: '700',
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
  boxstyle: {
    flexDirection: 'row',
    height: 48,
    borderBottomColor: Colors.grey300,
    borderRadius: 2,
    borderBottomWidth: 0.6,
    marginVertical: sizeHeight(1),
    justifyContent: 'space-between',
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
  boxsubtitle: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    alignSelf: 'center',
    marginStart: 4,
  },
  bbstyle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6d6a57',
    lineHeight: 20,
    marginStart: 4,
    letterSpacing: 0.5,
    paddingVertical: 10,
  },
  radiocont: {
    marginStart: 10,
    marginEnd: 10,
    borderBottomWidth: 1.3,
    borderBottomColor: '#f2f1e6',
    alignContent: 'center',
  },
  copy: {
    marginStart: 10,
    marginEnd: 10,
    alignContent: 'center',
    paddingVertical: 10,
  },
  animatedInputCont: {
    marginStart: 10,
    marginEnd: 10,
    paddingVertical: 10,
  },
});
