import React from 'react';
import {
  StyleSheet,
  BackHandler,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import {
  Title,
  View,
  Screen
} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {
  Button,
  Colors,
  Avatar,
} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import { sizeHeight, sizeWidth } from '../../util/Size';
import CommonForm from '../finorbit/CommonForm';
import FileUploadForm from '../finorbit/FileUploadForm';
import DocumentPicker from 'react-native-document-picker';
import BankForm from './BankForm';
import LeftHeaders from '../common/CommonLeftHeader';
import SpecificForm from '../finorbit/SpecificForm';
import Loader from '../../util/Loader';
import CScreen from '../component/CScreen';
import StepIndicator from '../component/StepIndicator';
import AnimatedInputBox from '../component/AnimatedInputBox';
import Lodash from 'lodash';
import { SafeAreaView } from 'react-navigation';
import Footer from '../component/Footer';
import ScrollTop from '../common/ScrollTop';

export default class ProfileScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.submitt = this.submitt.bind(this);
    this.commonFormRef = React.createRef();
    this.filePicker = this.filePicker.bind(this);
    this.FileUploadFormRef = React.createRef();
    this.specificFormRef = React.createRef();
    this.bankFormRef = React.createRef();
    this.backClick = this.backClick.bind(this);
    this.scrollViewRef = React.createRef();
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
      mail_password: '',
      scrollReset: false,
      topText: 'User'
    };
  }

  componentDidMount() {
    this.setState({ currentposition: 0, scrollReset: false });
    //this.props.scrollToTop();
    BackHandler.addEventListener('hardwareBackPress', this.backClick);
    const { navigation } = this.props;
    this.willfocusListener = navigation.addListener('willFocus', () => {
      Pref.getVal(Pref.saveToken, (toke) => {
        this.setState({ token: toke }, () => {
          Pref.getVal(Pref.userData, (parseda) => {
            //console.log('parseda', parseda)
            const pp = parseda.user_prof;
            const url = pp === undefined || pp === null || pp === '' || (!pp.includes('.jpg') && !pp.includes('.jpeg') && !pp.includes('.png')) ? require('../../res/images/account.png') : {
              uri: `${decodeURIComponent(pp)}`,
            };
            let fileName = '';
            const fm = decodeURIComponent(pp);
            if (pp !== undefined || pp !== null || pp !== '') {
              const sp = fm.split("/");
              fileName = sp[sp.length - 1];
              //console.log('sp',sp)
            }
            //console.log('url', url)
            const { mail_host, mail_password, mail_port, mail_username } = parseda;
            this.setState({
              userData: parseda,
              imageUrl: url,
              fileName: fileName,
              mail_host: Helper.nullStringCheck(mail_host) === true ? '' : mail_host,
              mail_port: Helper.nullStringCheck(mail_port) === true ? '' : mail_port,
              mail_username: Helper.nullStringCheck(mail_username) === true ? '' : mail_username,
              mail_password: Helper.nullStringCheck(mail_password) === true ? '' : mail_password,
            });
            this.updateData(parseda);
          });
        });
        Pref.getVal(Pref.USERTYPE, (v) => this.setState({ utype: v }));
      });
    });
  }

  // componentDidUpdate(){
  //   if(this.state.currentposition > 0){
  //     this.setState({currentposition:0})
  //   }
  // }

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

  backClick = () => {
    this.setState({ currentposition: 0, topText: 'User' });
    return false;
  }

  componentWillUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
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
          if (spcommons.pancardNo !== '' && !Helper.checkPanCard(spcommons.pancardNo)) {
            checkData = false;
            Helper.showToastMessage('Invalid pan card number', 0);
            return false;
          } else if (spcommons.aadharcardNo !== '' && spcommons.aadharcardNo.length < 12) {
            checkData = false;
            Helper.showToastMessage('Invalid Aadhar card', 0);
            return false;
          }
        }
      } else if (currentposition === 1) {
        let commons = JSON.parse(
          JSON.stringify(this.bankFormRef.current.state),
        );
        if (commons != null) {
          this.state.dataArray[2] = commons;
          if (commons.bank_ifsc != null && String(commons.bank_ifsc).match(/[A-Za-z]{4}0[A-Z0-9a-z]{6}$/) == null) {
            checkData = false;
            Helper.showToastMessage('Invalid IFSC code', 0);
            return false;
          }
        }
      }
      this.setState(
        (prevProp) => {
          return {
            currentposition: prevProp.currentposition + 1,
            btnText: currentposition === 1 ? 'Submit' : 'Next',
            scrollReset: true,
            topText: prevProp.currentposition + 1 === 1 ? 'Bank' : 'File'
          };
        },
        () => {
          this.scrollToTop();
          if (this.state.currentposition === 1) {
            this.bankFormRef.current.saveData(
              '',
              userData.bank_ifsc,
              userData.account_no,
              userData.bank_account_name,
              userData.account_branch,
              userData.account_type,
              userData.bank_name
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

    // if (spcommons.pancardNo !== '') {
    //    else {
    for (var keys in spcommons) {
      const value = spcommons[keys];
      if (value !== undefined) {
        formData.append(keys, spcommons[keys]);
      }
    }



    let bankformCommons = this.state.dataArray[2];

    console.log('bankformCommons', bankformCommons)

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
            if (Array.isArray(value) === false) {
              formData.append(key, parseJs[key]);
            }
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
          console.log(`result`, result);
          const { data, response_header } = result;
          const { res_type } = response_header;
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
              profilerefresh: 1
            });
            //this.updateData(data[0]);
          } else {
            Helper.showToastMessage('Failed to update profile', 0);
          }
        },
        () => {
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
      this.scrollToTop();
      this.setState((prev) => {
        return {
          currentposition: prev.currentposition - 1,
          btnText: 'Next',
          scrollReset: true,
          topText: prev.currentposition - 1 === 1 ? "Bank" : 'User'
        };
      });
    }
  };

  scrollToTop = () => {
    if (this.scrollViewRef && this.scrollViewRef.current) {
      const ref = this.scrollViewRef.current;
      //console.log('ref',ref)
      if (ref && ref.scrollTo) {
        const timeout = setTimeout(() => {
          ref.scrollTo({ x: 0, y: 0, animated: false });
          if(timeout){
            clearTimeout(timeout);
          }
        }, 100);
      }
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.mainContainer} forceInset={{ top: 'never' }}>
        <Screen style={styles.mainContainer}>
          <ScrollView
            ref={this.scrollViewRef}
            style={styles.scroller}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps={'handled'}>


              <View>
                <LeftHeaders
                  title={`Edit My Profile`}
                  bottomtext={
                    <>
                      {`${this.state.topText} `}
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
                      //marginVertical: sizeHeight(1),
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
                      {/* <View>
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

                  </View> */}
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
             
              <ScrollTop onPress={this.scrollToTop} />
              
              <Footer />
            </View>
          </ScrollView>
          <Loader isShow={this.state.loading} />
        </Screen>
      </SafeAreaView>
    );
  }
}

/**
 * styles
 */
const styles = StyleSheet.create({
  scroller: { flex: 1 },
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
  mainContainer: {
    flex: 1,
    backgroundColor: Pref.WHITE,
  },

});
