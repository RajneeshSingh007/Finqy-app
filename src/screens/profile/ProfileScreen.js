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
  ActivityIndicator
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
    this.restoreList = [];
    this.state = {
      loading: false,
      imageUrl: require('../../res/images/account.png'),
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
      topText: 'User',
      loader: false
    };
  }

  componentDidMount() {
    this.setState({ currentposition: 0, scrollReset: false });
    BackHandler.addEventListener('hardwareBackPress', this.backClick);
    const { navigation } = this.props;
    this.willfocusListener = navigation.addListener('willFocus', () => {
      Pref.getVal(Pref.saveToken, (toke) => {
        this.setState({ token: toke, loader: true,currentposition: 0, scrollReset: false }, () => {
          Pref.getVal(Pref.userID, id => {
            Pref.getVal(Pref.USERTYPE, (v) => this.setState({ utype: v, uid: id }, () => {
              const formData = new FormData();
              formData.append('user_id', this.state.uid);
              formData.append('type', this.state.utype);
              Helper.networkHelperTokenContentType(
                Pref.AccountViewUrl,
                formData,
                Pref.methodPost,
                this.state.token,
                (result) => {
                  //console.log(`result`, result);
                  const { data, response_header } = result;
                  this.setState({ loader: false })
                  const { res_type } = response_header;
                  if (res_type === `success`) {
                    const parseda = JSON.parse(JSON.stringify(data[0]));
                    const pp = parseda.user_prof;
                    const url = pp === undefined || pp === null || pp === '' || (!pp.includes('.jpg') && !pp.includes('.jpeg') && !pp.includes('.png')) ? require('../../res/images/account.png') : {
                      uri: `${decodeURIComponent(pp)}`,
                    };
                    let fileName = '';
                    const fm = decodeURIComponent(pp);
                    if (pp !== undefined || pp !== null || pp !== '') {
                      const sp = fm.split("/");
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
                      mail_password: Helper.nullStringCheck(mail_password) === true ? '' : mail_password,
                      currentposition:0
                    });
                    this.updateData(parseda);
                  }
                },
                (e) => {
                  this.setState({ loader: false })
                },
              );
            }));
          })
        });
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
        userData.city || '',
        userData.state || ''
      );
    }
    this.restoreList[0] = userData;
    if (this.specificFormRef.current !== null) {
      let aadharno = "";
      if(Helper.nullStringCheck(userData.aadharno) === true){
        aadharno = "";
      }else if(userData.aadharno === "0"){
        aadharno = "";   
      }else {
        aadharno = userData.aadharno
      }
      this.specificFormRef.current.saveData(
        '',
        '',
        '',
        aadharno,
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
      this.restoreList[1] = userData;
    }
  };

  backClick = () => {
    this.setState({ currentposition: 0, topText: 'User',scrollReset: false,btnText:'Next' });
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
        this.restoreList[0] = commons;
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
        // delete commons.residence_address;
        // delete commons.dialerEditable;
        // delete commons.state;
        // delete commons.contactTypeCd;

        let spcommons = JSON.parse(
          JSON.stringify(this.specificFormRef.current.state),
        );
        this.restoreList[1] = spcommons;

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
          this.restoreList[2] = commons;
          this.state.dataArray[2] = commons;
          if (commons.bank_ifsc != null && commons.bank_ifsc !== '' && String(commons.bank_ifsc).match(/[A-Za-z]{4}0[A-Z0-9a-z]{6}$/) == null) {
            checkData = false;
            Helper.showToastMessage('Invalid IFSC code', 0);
            return false;
          }
        }
      } else if (currentposition === 2) {
        let fcommons = JSON.parse(
          JSON.stringify(this.FileUploadFormRef.current.state),
        );
        if (fcommons != null) {
          this.restoreList[3] = fcommons;
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
          if (this.state.currentposition === 0) {
            this.commonFormRef.current.restoreData(this.restoreList[0]);
            if (this.restoreList[1]) {
              this.specificFormRef.current.restoreData(this.restoreList[1]);
            }
          } else if (this.state.currentposition === 1) {
            if (this.restoreList[2]) {
              this.bankFormRef.current.restoreData(this.restoreList[2]);
            }
          } else if (this.state.currentposition === 2) {
            if (this.restoreList[3]) {
              this.FileUploadFormRef.current.restoreData(this.restoreList[3]);
            }
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
    //for (var key in commons) {
      //const value = commons[key];
      //if (Helper.arrayObjCheck(value, true)) {
        formData.append('name', commons.name);
        formData.append('mobile', commons.mobile);
        formData.append('email', commons.email);
        formData.append('ofc_add', commons.ofc_add);
        formData.append('pincode', commons.pincode);
        formData.append('gst_no', commons.gst_no);
      //}
    //}

    let spcommons = this.state.dataArray[1];

    // if (spcommons.pancardNo !== '') {
    //    else {
    //for (var keys in spcommons) {
      //const value = spcommons[keys];
      //if (Helper.arrayObjCheck(value, true)) {
        formData.append('pancardNo', spcommons.pancardNo);
        formData.append('aadharcardNo', spcommons.aadharcardNo);
      //}
    //}



    let bankformCommons = this.state.dataArray[2];

    //for (var keys in bankformCommons) {
      //const value = bankformCommons[keys];
      //if (Helper.arrayObjCheck(value, true)) {
        formData.append('bank', bankformCommons.bank);
        formData.append('bank_ifsc', bankformCommons.bank_ifsc);
        formData.append('account_no', bankformCommons.account_no);
        formData.append('account_branch', bankformCommons.account_branch);
        formData.append('bank_account_name', bankformCommons.bank_account_name);
        formData.append('bank_name', bankformCommons.bank_name);
        formData.append('account_type', bankformCommons.account_type);
      //}
    //}

    let fcommons = JSON.parse(
      JSON.stringify(this.FileUploadFormRef.current.state),
    );

    let filex = fcommons.fileList;
    if (filex !== undefined && filex !== null && filex.length > 0) {
      const loops = Lodash.map(filex, (ele) => {
        let parseJs = JSON.parse(JSON.stringify(ele));
        for (var key in parseJs) {
          const value = parseJs[key];
          //if (Helper.arrayObjCheck(value, true)) {
            formData.append(key, value);
          //}
        }
      });
    }

    if (res != null) {
      formData.append('user_prof', res);
    } else if (fileName !== '') {
      formData.append('user_prof', fileName);
    }

    //console.log(`formData`, formData);

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
          } else {
            Helper.showToastMessage('Failed to update profile', 0);
          }
        },
        (e) => {
          console.log(`error`, e);
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
      }, () => {
        if (this.state.currentposition === 0) {
          this.commonFormRef.current.restoreData(this.restoreList[0]);
          if (this.restoreList[1]) {
            this.specificFormRef.current.restoreData(this.restoreList[1]);
          }
        } else if (this.state.currentposition === 1) {
          if (this.restoreList[2]) {
            this.bankFormRef.current.restoreData(this.restoreList[2]);
          }
        } else if (this.state.currentposition === 2) {
          if (this.restoreList[3]) {
            this.FileUploadFormRef.current.restoreData(this.restoreList[3]);
          }
        }
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
          if (timeout) {
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
                title={Helper.getScreenName(this.props)}
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

              {this.state.loader === false ?
                <>
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
                        cancelChq={this.state.userData && this.state.userData.cancel_chq}
                        panCard={this.state.userData && this.state.userData.pan_image}
                        aadharCard={this.state.userData && this.state.userData.aadhar_image}
                        gstImage={this.state.userData && this.state.userData.gst_cert}
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
                : <View style={
                  {
                    justifyContent: 'center',
                    alignSelf: 'center',
                    flex: 1,
                    marginVertical: 48,
                    paddingVertical: 48,
                  }
                }>
                  <ActivityIndicator />
                </View>
              }
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
