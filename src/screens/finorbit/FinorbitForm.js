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
  HelperText,
  FAB,
} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import {SafeAreaView} from 'react-navigation';
import {sizeFont, sizeHeight, sizeWidth} from '../../util/Size';
import CommonForm from './CommonForm';
import SpecificForm from './SpecificForm';
import CommonScreen from '../common/CommonScreen';
import CardRow from '../common/CommonCard';
import FileUploadForm from './FileUploadForm';
import StepIndicator from 'react-native-step-indicator';
import ApptForm from './ApptForm';
import Lodash from 'lodash';
import Loader from '../../util/Loader';
import LeftHeaders from '../common/CommonLeftHeader';
import BannerCard from '../common/BannerCard';
import Carousel from 'react-native-snap-carousel';
import {Pagination} from 'react-native-snap-carousel';
import FormProgress from '../../util/FormProgress';

const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: Pref.RED,
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: Pref.RED,
  stepStrokeUnFinishedColor: Colors.grey300,
  separatorFinishedColor: '#02c26a',
  separatorUnFinishedColor: Colors.grey300,
  stepIndicatorFinishedColor: Pref.RED,
  stepIndicatorUnFinishedColor: Pref.WHITE,
  stepIndicatorCurrentColor: Pref.WHITE,
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: Pref.RED,
  stepIndicatorLabelFinishedColor: Pref.WHITE,
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#292929',
  labelSize: 12,
  currentStepLabelColor: Pref.RED,
};

export default class FinorbitForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.submitt = this.submitt.bind(this);
    this.commonFormRef = React.createRef();
    this.specificFormRef = React.createRef();
    this.FileUploadFormRef = React.createRef();
    this.ApptFormRef = React.createRef();
    this.backClick = this.backClick.bind(this);
    this.state = {
      loading: false,
      progressLoader: false,
      currentPosition: 0,
      bottontext: 'Next',
      dataArray: [],
      userData: {},
      appliedref: '',
      refcode: '',
      bannerList: [],
      token: '',
      userData: '',
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backClick);
    const {navigation} = this.props;
    const url = navigation.getParam('url', '');
    const title = navigation.getParam('title', '');
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.saveToken, (value) => {
        this.setState({token: value}, () => {
          Pref.getVal(Pref.userData, (userData) => {
            this.setState({
              userData: userData,
              imageUrl: url,
              title: title,
              isMounted: true,
              currentPosition: 0,
            });
          });
        });
      });
    });
  }

  backClick = () => {
    NavigationActions.navigate('FinorbitScreen');
    return true;
  };

  componentWillUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    if (this.focusListener !== undefined) this.focusListener.remove();
  }

  _renderItem = ({item, index}) => {
    // if(item.url === 'abc'){
    //     return (<CardRow
    //         color={Colors.grey300}
    //         clickName={''}
    //         title={this.state.title}
    //         subtitle={'Get your dream home'}
    //         url={this.state.imageUrl}
    //     />)
    // }
    return <BannerCard url={{uri: `${Pref.FOLDERPATH}${item.url}`}} />;
  };

  onPageChange(position) {
    this.setState({
      currentPosition: position,
      bottontext: position > 2 ? 'Submit' : 'Next',
    });
    this.insertData(this.state.currentPosition, false);
  }

  submitt = () => {
    const {currentPosition, title} = this.state;
    this.insertData(currentPosition, true);
  };

  insertData(currentPosition, mode) {
    const {title} = this.state;
    let commons = null;
    if (currentPosition === 0) {
      commons = JSON.parse(JSON.stringify(this.commonFormRef.current.state));
      delete commons.genderList;
      delete commons.employList;
      delete commons.cityList;
      delete commons.showCityList;
      delete commons.showGenderList;
      delete commons.showCalendar;
      delete commons.showEmployList;
      delete commons.currentDate;
      delete commons.maxDate;
    } else if (currentPosition === 1) {
      commons = JSON.parse(JSON.stringify(this.specificFormRef.current.state));
      delete commons.cityList;
      delete commons.showCarList;
      delete commons.showExisitingList;
      delete commons.showCalendar;
      delete commons.showLoanCityList;
      delete commons.motorInsList;
      delete commons.exisitingList;
      delete commons.employList;
      delete commons.carList;
      delete commons.termInsList;
      delete commons.showmotorInsList;
      delete commons.showtermInsList;
      delete commons.healthFList;
      delete commons.showHealthFlist;
      delete commons.maritalList;
      delete commons.showmaritalList;
      delete commons.showCompanyCityList;
      delete commons.currentDate;
      delete commons.maxDate;
      delete commons.vectorInsuList;
      delete commons.showvectorInsuList;
      delete commons.vectorCoverList;
      delete commons.showvectorCoverList;
    } else if (currentPosition === 2) {
      commons = JSON.parse(
        JSON.stringify(this.FileUploadFormRef.current.state),
      );
    } else if (currentPosition === 3) {
      commons = JSON.parse(JSON.stringify(this.ApptFormRef.current.state));
      delete commons.showCalendar;
      delete commons.showdatesx;
      delete commons.mode;
      delete commons.currentTime;
      delete commons.currentDate;
      delete commons.intervaltime;
      console.log('commons', commons);
    }
    let result = false;
    if (commons !== null) {
      this.state.dataArray[currentPosition] = commons;
      result = true;
    }

    if (mode && result) {
      const commonForms = this.state.dataArray[0];
      const specificForms = this.state.dataArray[1];
      const fileListForms = this.state.dataArray[2];
      const dateForm = this.state.dataArray[3];

      let checkData = true;
      let formData = new FormData();
      let uniq = '';
      if (title.includes(' ')) {
        uniq = title.trim().toLowerCase().replace(' ', '_');
      }
      if (title === `Life Cum Invt. Plan`) {
        uniq = 'life_cum_investment';
      }
      //console.log(`uniq`, uniq, title);
      formData.append(uniq, uniq);

      if (commonForms !== undefined) {
        if (commonForms.name === '') {
          checkData = false;
          Helper.showToastMessage('Full Name empty', 0);
        } else if (commonForms.mobile === '') {
          checkData = false;
          Helper.showToastMessage('Mobile Number empty', 0);
        } else if (commonForms.mobile.match(/^[0-9]*$/g) === null) {
          checkData = false;
          Helper.showToastMessage('Invalid mobile number', 0);
        } else if (
          title !== 'Health Insurance' &&
          title !== 'Fixed Deposit' &&
          title !== `Life Cum Invt. Plan` &&
          title !== `Motor Insurance` &&
          title !== `Mutual Fund` &&
          title !== `Vector Plus` &&
          title !== `Home Loan` &&
          title !== `Loan Against Property` &&
          title !== `Personal Loan` &&
          title !== `Business Loan` &&
          title !== `Auto Loan` &&
          commonForms.email === ''
        ) {
          checkData = false;
          Helper.showToastMessage('Email empty', 0);
        } else if (
          title === 'Health Insurance' &&
          commonForms.qualification === ''
        ) {
          checkData = false;
          Helper.showToastMessage('Qualification empty', 0);
        } else if (
          title !== 'Fixed Deposit' &&
          title !== `Mutual Fund` &&
          title !== `Home Loan` &&
          title !== `Loan Against Property` &&
          title !== `Personal Loan` &&
          title !== `Business Loan` &&
          title !== `Auto Loan` &&
          (commonForms.dob === '' || commonForms.dob === `Date of Birth *`)
        ) {
          checkData = false;
          Helper.showToastMessage('Date of Birth empty', 0);
        } else if (
          title !== `Personal Loan` &&
          title !== `Loan Against Property` &&
          title !== `Home Loan` &&
          title !== `Business Loan` &&
          title !== `Auto Loan` &&
          commonForms.gender === ''
        ) {
          checkData = false;
          Helper.showToastMessage('Please, Select Gender', 0);
        } else if (
          title !== `Personal Loan` &&
          title !== 'Fixed Deposit' &&
          title !== 'Business Loan' &&
          title !== `Motor Insurance` &&
          title !== `Mutual Fund` &&
          title !== `Vector Plus` &&
          title !== `Home Loan` &&
          title !== `Loan Against Property` &&
          title !== `Auto Loan` &&
          commonForms.employ === ''
        ) {
          checkData = false;
          Helper.showToastMessage('Please, Select Employment Type', 0);
        } else if (
          title !== `Personal Loan` &&
          title !== `Home Loan` &&
          title !== `Loan Against Property` &&
          title !== `Business Loan` &&
          title !== `Auto Loan` &&
          commonForms.currentlocation === 'Select Current Location *'
        ) {
          checkData = false;
          Helper.showToastMessage('Please, Select Current Location', 0);
        } else if (
          Number(commonForms.mobile.length) < 10 ||
          commonForms.mobile === '9876543210' ||
          commons.mobile === '1234567890'
        ) {
          checkData = false;
          Helper.showToastMessage('Invalid mobile number', 0);
        } else if (
          commonForms.email !== '' &&
          !commonForms.email.includes('@')
        ) {
          checkData = false;
          Helper.showToastMessage('Invalid Email', 0);
        } else if (commonForms.pincode !== '' && commonForms.pincode < 6) {
          checkData = false;
          Helper.showToastMessage('Invalid Pincode', 0);
        } else {
          let parseJs = JSON.parse(JSON.stringify(commonForms));
          if (parseJs.currentlocation === 'Select Current Location *') {
            parseJs.currentlocation === '';
          }
          for (var key in parseJs) {
            const value = parseJs[key];
            if (value !== undefined) {
              formData.append(key, parseJs[key]);
            }
          }
        }
      }

      if (specificForms !== undefined) {
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
          specificForms.amount === ``
        ) {
          checkData = false;
          Helper.showToastMessage(
            title === 'Term Insurance'
              ? 'Required Cover *'
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
          specificForms.existingcard === ``
        ) {
          checkData = false;
          Helper.showToastMessage('Select Existing Card/Loan', 0);
        } else {
          if (title === 'Life Cum Invt. Plan') {
            if (specificForms.investment_amount === '') {
              checkData = false;
              Helper.showToastMessage('Investment Amount empty', 0);
            } else {
              if (
                specificForms.pancardNo !== '' &&
                !Helper.checkPanCard(specificForms.pancardNo)
              ) {
                checkData = false;
                Helper.showToastMessage('Invalid pan card number', 0);
              } else {
                let parseJs = JSON.parse(JSON.stringify(specificForms));
                for (var key in parseJs) {
                  const value = parseJs[key];
                  if (value !== undefined) {
                    formData.append(key, parseJs[key]);
                  }
                }
              }
            }
          } else if (title === 'Motor Insurance') {
            if (specificForms.insurance === '') {
              checkData = false;
              Helper.showToastMessage('Select Any Claim Last Year', 0);
            } else if (
              specificForms.claim_type === `` ||
              specificForms.claim_type === `Select Insurance Type *`
            ) {
              checkData = false;
              Helper.showToastMessage('Select Insurance Type', 0);
            } else {
              if (
                specificForms.pancardNo !== '' &&
                !Helper.checkPanCard(specificForms.pancardNo)
              ) {
                checkData = false;
                Helper.showToastMessage('Invalid pan card number', 0);
              } else {
                let parseJs = JSON.parse(JSON.stringify(specificForms));
                for (var key in parseJs) {
                  const value = parseJs[key];
                  if (value !== undefined) {
                    formData.append(key, parseJs[key]);
                  }
                }
              }
            }
          } else if (title === 'Vector Plus') {
            //required_cover
            if (
              specificForms.claim_type === `` ||
              specificForms.claim_type === `Select Insurance Type *`
            ) {
              checkData = false;
              Helper.showToastMessage('Select Insurance Type', 0);
            } else if (specificForms.required_cover === '') {
              checkData = false;
              Helper.showToastMessage('Select Required Cover', 0);
            } else {
              if (
                specificForms.pancardNo !== '' &&
                !Helper.checkPanCard(specificForms.pancardNo)
              ) {
                checkData = false;
                Helper.showToastMessage('Invalid pan card number', 0);
              } else {
                let parseJs = JSON.parse(JSON.stringify(specificForms));
                for (var key in parseJs) {
                  const value = parseJs[key];
                  if (value !== undefined) {
                    formData.append(key, parseJs[key]);
                  }
                }
              }
            }
          } else if (title === 'Auto Loan') {
            if (title !== `Auto Loan` && specificForms.nooldcard === '') {
              checkData = false;
              Helper.showToastMessage('Select Type Of Car', 0);
            } else {
              if (
                specificForms.pancardNo !== '' &&
                !Helper.checkPanCard(specificForms.pancardNo)
              ) {
                checkData = false;
                Helper.showToastMessage('Invalid pan card number', 0);
              } else {
                let parseJs = JSON.parse(JSON.stringify(specificForms));
                for (var key in parseJs) {
                  const value = parseJs[key];
                  if (value !== undefined) {
                    formData.append(key, parseJs[key]);
                  }
                }
              }
            }
          } else if (
            title === 'Term Insurance' ||
            title === `Health Insurance`
          ) {
            if (specificForms.turnover === '') {
              checkData = false;
              Helper.showToastMessage('Annual TurnOver Empty', 0);
            } else if (
              title === `Health Insurance` &&
              specificForms.required_cover === ''
            ) {
              checkData = false;
              Helper.showToastMessage('Required Cover Empty', 0);
            } else if (
              title === `Term Insurance` &&
              specificForms.amount === ''
            ) {
              checkData = false;
              Helper.showToastMessage('Required Cover Empty', 0);
            } else if (specificForms.lifestyle === '') {
              checkData = false;
              Helper.showToastMessage('Select Lifestyle', 0);
            } else if (specificForms.lifestyle2 === '') {
              checkData = false;
              Helper.showToastMessage('Select Lifestyle', 0);
            } else if (specificForms.existing_diseases === '') {
              checkData = false;
              Helper.showToastMessage('Select Existing Disease', 0);
            } else if (
              title === `Health Insurance` &&
              specificForms.claim_type === ''
            ) {
              checkData = false;
              Helper.showToastMessage('Please, Select Type Of Insurance', 0);
            } else if (
              title === `Health Insurance` &&
              specificForms.claim_type === 'Family Floater'
            ) {
              if (specificForms.family_floater === '') {
                checkData = false;
                Helper.showToastMessage('Please, Select Family Floater', 0);
              } else {
                const floaterItemList = JSON.parse(
                  JSON.stringify(specificForms.floaterItemList),
                );
                if (floaterItemList.length > 0) {
                  let checker = false;
                  for (let index = 0; index < floaterItemList.length; index++) {
                    const element = floaterItemList[index];
                    const {name, gender, dob, relation} = element;
                    if (
                      name === '' ||
                      gender === '' ||
                      dob === '' ||
                      relation === ''
                    ) {
                      checker = true;
                    }
                  }
                  if (checker) {
                    checkData = false;
                    Helper.showToastMessage(
                      'Please, Fill all member details',
                      0,
                    );
                  } else {
                    if (
                      specificForms.pancardNo !== '' &&
                      !Helper.checkPanCard(specificForms.pancardNo)
                    ) {
                      checkData = false;
                      Helper.showToastMessage('Invalid pan card number', 0);
                    } else {
                      let keypos = 1;
                      const loops = Lodash.map(floaterItemList, (ele) => {
                        let parseJs = JSON.parse(JSON.stringify(ele));
                        for (var key in parseJs) {
                          const value = parseJs[key];
                          if (value !== undefined) {
                            formData.append(
                              keypos === 1
                                ? `floater_${key}`
                                : `floater_${key}${keypos}`,
                              parseJs[key],
                            );
                          }
                        }
                        keypos += 1;
                      });
                      let parseJs = JSON.parse(JSON.stringify(specificForms));
                      for (var key in parseJs) {
                        if (key !== `floaterItemList`) {
                          const value = parseJs[key];
                          if (value !== undefined) {
                            formData.append(key, parseJs[key]);
                          }
                        }
                      }
                    }
                  }
                }
              }
            } else {
              if (
                specificForms.pancardNo !== '' &&
                !Helper.checkPanCard(specificForms.pancardNo)
              ) {
                checkData = false;
                Helper.showToastMessage('Invalid pan card number', 0);
              } else {
                let parseJs = JSON.parse(JSON.stringify(specificForms));
                for (var key in parseJs) {
                  const value = parseJs[key];
                  if (value !== undefined) {
                    formData.append(key, parseJs[key]);
                  }
                }
              }
            }
          } else if (title === `Auto Loan`) {
            if (specificForms.turnover === '') {
              checkData = false;
              Helper.showToastMessage('Annual Turnover empty', 0);
            } else if (
              title !== `Business Loan` &&
              title !== `Personal Loan` &&
              (specificForms.loan_property_city === '' ||
                specificForms.loan_property_city ===
                  `Select Loan Property City *`)
            ) {
              checkData = false;
              Helper.showToastMessage('Select Loan Property city', 0);
            } else if (
              (title === `Personal Loan` || title === `Business Loan`) &&
              specificForms.type_loan === ``
            ) {
              checkData = false;
              Helper.showToastMessage('Select Type of Loan', 0);
            } else {
              if (
                specificForms.pancardNo !== '' &&
                !Helper.checkPanCard(specificForms.pancardNo)
              ) {
                checkData = false;
                Helper.showToastMessage('Invalid pan card number', 0);
              } else {
                let parseJs = JSON.parse(JSON.stringify(specificForms));
                for (var key in parseJs) {
                  const value = parseJs[key];
                  if (value !== undefined) {
                    formData.append(key, parseJs[key]);
                  }
                }
              }
            }
          } else if (
            specificForms.pancardNo !== '' &&
            !Helper.checkPanCard(specificForms.pancardNo)
          ) {
            checkData = false;
            Helper.showToastMessage('Invalid pan card number', 0);
          } else {
            let parseJs = JSON.parse(JSON.stringify(specificForms));
            for (var key in parseJs) {
              const value = parseJs[key];
              if (value !== undefined) {
                formData.append(key, parseJs[key]);
              }
            }
          }
        }
      }

      if (fileListForms !== undefined) {
        const allfileslist = fileListForms.fileList;
        if (allfileslist !== undefined && allfileslist.length > 0) {
          let existence = false;
          const loops = Lodash.map(allfileslist, (ele) => {
            let parseJs = JSON.parse(JSON.stringify(ele));
            for (var key in parseJs) {
              const value = parseJs[key];
              if (value !== undefined) {
                if (key === `rcbookcopy`) {
                  existence = true;
                }
                formData.append(key, parseJs[key]);
              }
            }
          });

          if (title === `Motor Insurance`) {
            if (!existence) {
              checkData = false;
              Helper.showToastMessage('Please, Select RC Copy', 0);
            }
          }
        }
      }

      if (dateForm !== undefined) {
        if (dateForm.baa === '') {
          checkData = false;
          Helper.showToastMessage('Please, Select Appointment Date', 0);
        } else {
          let parseJs = JSON.parse(JSON.stringify(dateForm));
          for (var key in parseJs) {
            const value = parseJs[key];
            if (value !== undefined) {
              formData.append(key, parseJs[key]);
            }
          }
        }
      }

      if (checkData) {
        if (currentPosition < 3) {
          this.setState((prevState) => {
            return {
              currentPosition: prevState.currentPosition + 1,
              bottontext: prevState.currentPosition + 1 > 2 ? 'Submit' : 'Next',
            };
          });
        } else {
          this.setState({progressLoader: true});
          const {refercode} = this.state.userData;
          formData.append('ref', refercode);

          const formUrls = `${Pref.FinOrbitFormUrl}${uniq}.php`;

          Helper.networkHelperTokenContentType(
            formUrls,
            formData,
            Pref.methodPost,
            this.state.token,
            (result) => {
              const {response_header} = result;
              const {res_type} = response_header;
              this.setState({progressLoader: false});
              if (res_type === 'success') {
                Helper.showToastMessage('Form submitted successfully', 1);
                NavigationActions.navigate('FinorbitScreen');
              } else {
                Helper.showToastMessage('failed to submit form', 0);
              }
            },
            (error) => {
              this.setState({progressLoader: false});
              Helper.showToastMessage('Form submitted successfully', 1);
              NavigationActions.navigate('FinorbitScreen');
              // Helper.showToastMessage('form submitted successfully', 1);
              //Helper.showToastMessage('something wents wrong...', 0);
            },
          );
        }
      }
    }
  }

  findImage() {
    const {title} = this.props;
    const productList = JSON.parse(JSON.stringify(Pref.productList));
    const search = Lodash.find(productList, (io) => io.name === title);
    console.log(title, search);
    return search === undefined
      ? require('../../res/images/logo.png')
      : search.url;
  }

  render() {
    return (
      <CommonScreen
        // showTopBar
        // showRightIcon={true}
        showProfile={false}
        title={''}
        loading={this.state.loading}
        absoluteBody={
          <>
            <Loader isShow={this.state.progressLoader} />

            {/* <FormProgress isShow={true} clickedcallback={()=>{

                        }} />
 */}
          </>
        }
        body={
          <>
            <LeftHeaders
              showAvtar
              showBack
              rightImage
              title={this.state.title}
              rightUrl={this.findImage()}
              style={{marginBottom: 8}}
              // bottomBody={
              //     <View style={{marginStart:sizeWidth(10)}}>
              //         <Title style={{
              //             fontSize: 17, fontFamily: 'Rubik', letterSpacing: 1, color: 'white', alignSelf: 'flex-start', fontWeight: '400', paddingVertical: sizeHeight(0.5),
              //         }}> {'Apply for a loan'}</Title>
              //     </View>
              // }
            />
            <View style={{flex: 1}}>
              {this.state.bannerList.length > 0 ? (
                <View style={{flex: 0.2}}>
                  <Carousel
                    ref={this.crousel}
                    data={this.state.bannerList}
                    renderItem={this._renderItem}
                    sliderWidth={sizeWidth(100)}
                    itemWidth={sizeWidth(100)}
                    autoplay
                    enableSnap
                    loop
                    inactiveSlideScale={0.95}
                    inactiveSlideOpacity={0.8}
                    scrollEnabled
                    shouldOptimizeUpdates
                    onSnapToItem={(slideIndex) =>
                      this.setState({pageIndex: slideIndex})
                    }
                    onBeforeSnapToItem={(slideIndex) =>
                      this.setState({pageIndex: slideIndex})
                    }
                    containerCustomStyle={{marginTop: sizeHeight(0.5)}}
                  />
                  <Pagination
                    carouselRef={this.crousel}
                    dotColor={Pref.PRIMARY_COLOR}
                    dotsLength={this.state.bannerList.length}
                    inactiveDotColor={Colors.grey300}
                    inactiveDotScale={1}
                    tappableDots
                    activeDotIndex={this.state.pageIndex}
                    containerStyle={{marginTop: -16, marginBottom: -20}}
                  />
                </View>
              ) : null}

              <View style={{flex: 0.8}}>
                <View
                  style={{
                    marginHorizontal: sizeWidth(2),
                    marginBottom: sizeHeight(1),
                    marginTop: sizeHeight(2),
                  }}>
                  <StepIndicator
                    customStyles={customStyles}
                    labels={['Personal', 'Corporate', 'Upload', 'Submit']}
                    currentPosition={this.state.currentPosition}
                    //onPress={(pos) => this.onPageChange(pos)}
                    stepCount={4}
                  />
                </View>

                <Card
                  style={{
                    marginHorizontal: sizeWidth(2),
                    marginVertical: sizeHeight(1),
                    paddingHorizontal: sizeWidth(1),
                  }}>
                  <ScrollView
                    showsVerticalScrollIndicator={true}
                    style={{flex: 1}}>
                    {this.state.currentPosition === 0 ? (
                      <CommonForm
                        ref={this.commonFormRef}
                        showemploy={
                          this.state.title !== 'Fixed Deposit' &&
                          this.state.title !== 'Vector Plus' &&
                          this.state.title !== 'Business Loan' &&
                          this.state.title !== 'Mutual Fund' &&
                          this.state.title !== 'Motor Insurance'
                        }
                        saveData={this.state.dataArray[0]}
                        title={this.state.title}
                      />
                    ) : this.state.currentPosition === 1 ? (
                      <SpecificForm
                        ref={this.specificFormRef}
                        saveData={this.state.dataArray[1]}
                        title={this.state.title}
                      />
                    ) : this.state.currentPosition === 2 ? (
                      <FileUploadForm
                        ref={this.FileUploadFormRef}
                        title={this.state.title}
                        saveData={this.state.dataArray[2]}
                      />
                    ) : this.state.currentPosition === 3 ? (
                      <ApptForm
                        ref={this.ApptFormRef}
                        title={this.state.title}
                        saveData={this.state.dataArray[3]}
                      />
                    ) : null}

                    <Button
                      mode={'flat'}
                      uppercase={true}
                      dark={true}
                      loading={false}
                      style={[styles.loginButtonStyle]}
                      onPress={this.submitt}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 16,
                          letterSpacing: 1,
                        }}>
                        {this.state.bottontext}
                      </Text>
                    </Button>
                  </ScrollView>
                </Card>
              </View>
            </View>
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
    paddingVertical: sizeHeight(0.5),
    marginHorizontal: sizeWidth(3),
    marginVertical: sizeHeight(3.5),
    backgroundColor: '#e21226',
    textAlign: 'center',
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 1,
  },
});
