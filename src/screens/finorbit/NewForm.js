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
import AddressForm from './AddressForm';
//import StepIndicator from 'react-native-step-indicator';
import ApptForm from './ApptForm';
import Lodash from 'lodash';
import Loader from '../../util/Loader';
import LeftHeaders from '../common/CommonLeftHeader';
import BannerCard from '../common/BannerCard';
import Carousel from 'react-native-snap-carousel';
import {Pagination} from 'react-native-snap-carousel';
import FormProgress from '../../util/FormProgress';
import CScreen from '../component/CScreen';
import StepIndicator from '../component/StepIndicator';

// const customStyles = {
//   stepIndicatorSize: 25,
//   currentStepIndicatorSize: 30,
//   separatorStrokeWidth: 2,
//   currentStepStrokeWidth: 3,
//   stepStrokeCurrentColor: Pref.RED,
//   stepStrokeWidth: 3,
//   stepStrokeFinishedColor: Pref.RED,
//   stepStrokeUnFinishedColor: Colors.grey300,
//   separatorFinishedColor: '#02c26a',
//   separatorUnFinishedColor: Colors.grey300,
//   stepIndicatorFinishedColor: Pref.RED,
//   stepIndicatorUnFinishedColor: Pref.WHITE,
//   stepIndicatorCurrentColor: Pref.WHITE,
//   stepIndicatorLabelFontSize: 13,
//   currentStepIndicatorLabelFontSize: 13,
//   stepIndicatorLabelCurrentColor: Pref.RED,
//   stepIndicatorLabelFinishedColor: Pref.WHITE,
//   stepIndicatorLabelUnFinishedColor: '#aaaaaa',
//   labelColor: '#292929',
//   labelSize: 12,
//   currentStepLabelColor: Pref.RED,
// };

export default class NewForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.submitt = this.submitt.bind(this);
    this.commonFormRef = React.createRef();
    this.addressFormRef = React.createRef();
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
      bottontext: position === 1 ? 'Submit' : 'Next',
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
      commons = JSON.parse(JSON.stringify(this.addressFormRef.current.state));
    }
    let result = false;
    if (commons !== null) {
      this.state.dataArray[currentPosition] = commons;
      result = true;
    }

    if (mode && result) {
      const commonForms = this.state.dataArray[0];
      const specificForms = this.state.dataArray[1];
      let checkData = true;
      let formData = new FormData();
      formData.append('formmain', 'formmain');
      if (commonForms !== undefined) {
        if (commonForms.name === '') {
          checkData = false;
          Helper.showToastMessage('First Name empty', 0);
        } else if (commonForms.lastname === '') {
          checkData = false;
          Helper.showToastMessage('Last Name empty', 0);
        } else if (commonForms.mobile === '') {
          checkData = false;
          Helper.showToastMessage('Mobile Number empty', 0);
        } else if (commonForms.email === '') {
          checkData = false;
          Helper.showToastMessage('Email empty', 0);
        } else if (commonForms.nomineename === '') {
          checkData = false;
          Helper.showToastMessage('Nominee Name empty', 0);
        } else if (
          commonForms.dob === '' ||
          commonForms.dob === `Date of Birth *`
        ) {
          checkData = false;
          Helper.showToastMessage('Date of Birth empty', 0);
        } else if (commonForms.gender === '') {
          checkData = false;
          Helper.showToastMessage('Please, Select Gender', 0);
        } else if (commonForms.nrelation === '') {
          checkData = false;
          Helper.showToastMessage('Please, Select Nominee Relation', 0);
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
        } else {
          let parseJs = JSON.parse(JSON.stringify(commonForms));
          formData.append('firstName', parseJs['name']);
          formData.append('lastName', parseJs['lastName']);
          formData.append('nrelation', parseJs['nrelation']);
          formData.append('nomineename', parseJs['nomineename']);
          formData.append('birthDt', parseJs['dob']);
          formData.append('genderCd', parseJs['gender']);
          formData.append('contactNum', parseJs['mobile']);
          formData.append('emailAddress', parseJs['email']);
          formData.append(
            'titleCd',
            parseJs['gender'] === 'Male' ? 'MALE' : 'Female',
          );
          formData.append('roleCd', '');
          formData.append('emailTypeCd', '');
          formData.append('contactTypeCd', '');
          formData.append('stdCode', '');
          formData.append('field12', '');
          formData.append('isPremiumCalculation', '');
        }
      }

      if (specificForms !== undefined) {
        if (specificForms.addressLine1Lang1p === '') {
          checkData = false;
          Helper.showToastMessage('Address Line 1 empty', 0);
        } else if (specificForms.addressLine2Lang1p === '') {
          checkData = false;
          Helper.showToastMessage('Address Line 2 empty', 0);
        } else if (specificForms.pinCodep === '') {
          checkData = false;
          Helper.showToastMessage('Pincode empty', 0);
        } else if (specificForms.pinCodep.length < 6) {
          checkData = false;
          Helper.showToastMessage('Invalid pincode', 0);
        } else if (
          specificForms.cityCdp === '' ||
          specificForms.stateCdp === ''
        ) {
          checkData = false;
          Helper.showToastMessage('Please, Enter correct pincode', 0);
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
      let suminsured = '';
      if (title.includes('Hello')) {
        suminsured = '001';
      } else if (title.includes('Asaan')) {
        suminsured = '002';
      } else if (title.includes('Sabse')) {
        suminsured = '003';
      }
      formData.append('sumInsured', suminsured);

      if (checkData) {
        if (currentPosition === 0) {
          this.setState((prevState) => {
            return {
              currentPosition: prevState.currentPosition + 1,
              bottontext: prevState.currentPosition === 1 ? 'Submit' : 'Next',
            };
          });
        } else {
          this.setState({progressLoader: true});
          formData.append('areaCdp', 'areaCdp');
          formData.append('reg_form', 'reg_form');
          //console.log('form', formData);
          const formUrls = `${Pref.NewFormUrl}`;
          //console.log(`formUrls`, formUrls);
          Helper.networkHelperContentType(
            formUrls,
            formData,
            Pref.methodPost,
            (result) => {
              //console.log(`result`, result);
              this.setState({progressLoader: false});
              const {status} = result;
              if (status === 'success') {
                NavigationActions.navigate('Payment', {
                  suminsured: suminsured,
                  result: result,
                });
              } else {
                Helper.showToastMessage('something wents wrong...', 0);
              }
            },
            (error) => {
              console.log('erorr', error);
              this.setState({progressLoader: false});
              Helper.showToastMessage('something wents wrong...', 0);
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
    return search === undefined
      ? require('../../res/images/logo.png')
      : search.url;
  }

  render() {
    const newform =
      this.state.title &&
      (this.state.title.includes('Hello') ||
        this.state.title.includes('Sabse') ||
        this.state.title.includes('Asaan'))
        ? true
        : false;
    const {title} = this.state;
    const split =
      title && title !== null && title !== ''
        ? title.includes(' ')
          ? title.split(' ')
          : [title]
        : [''];
    return (
      <CScreen
        absolute={
          <>
            <Loader isShow={this.state.progressLoader} />
          </>
        }
        body={
          <>
            <LeftHeaders
              showBack
              title={
                split.length === 2
                  ? `${split[0]} ${split[1]}`
                  : split.length === 3
                  ? `${split[0]} ${split[1]} ${split[2]}`
                  : split.length === 4
                  ? `${split[0]} ${split[1]} ${split[2]} ${split[3]}`
                  : split[0]
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
              stepCount={2}
            />

            <View styleName="md-gutter">
              {this.state.currentPosition === 0 ? (
                <CommonForm
                  ref={this.commonFormRef}
                  showemploy={
                    !newform &&
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
                <AddressForm
                  ref={this.addressFormRef}
                  title={this.state.title}
                />
              ) : null}
            </View>
            <View styleName="horizontal space-between md-gutter v-end h-end">
              {/* <Button
                mode={'flat'}
                uppercase={true}
                dark={true}
                loading={false}
                style={styles.loginButtonStyle}
                onPress={this.login}>
                <Title style={styles.btntext}>{'Sign In'}</Title>
              </Button> */}
              <Button
                mode={'flat'}
                uppercase={false}
                dark={true}
                loading={false}
                style={styles.loginButtonStyle}
                onPress={this.submitt}>
                <Title style={styles.btntext}>{this.state.bottontext}</Title>
              </Button>
            </View>
          </>
        }
      />
      // <CommonScreen
      //   // showTopBar
      //   // showRightIcon={true}
      //   showProfile={false}
      //   title={''}
      //   loading={this.state.loading}
      //   absoluteBody={
      //     <>
      //       <Loader isShow={this.state.progressLoader} />
      //     </>
      //   }
      //   body={
      //     <>
      //       <LeftHeaders
      //         showAvtar
      //         showBack
      //         rightImage
      //         title={this.state.title}
      //         rightUrl={this.findImage()}
      //         style={{marginBottom: 8}}
      //         // bottomBody={
      //         //     <View style={{marginStart:sizeWidth(10)}}>
      //         //         <Title style={{
      //         //             fontSize: 17, fontFamily: 'Rubik', letterSpacing: 1, color: 'white', alignSelf: 'flex-start', fontWeight: '400', paddingVertical: sizeHeight(0.5),
      //         //         }}> {'Apply for a loan'}</Title>
      //         //     </View>
      //         // }
      //       />
      //       <View style={{flex: 1}}>
      //         {this.state.bannerList.length > 0 ? (
      //           <View style={{flex: 0.2}}>
      //             <Carousel
      //               ref={this.crousel}
      //               data={this.state.bannerList}
      //               renderItem={this._renderItem}
      //               sliderWidth={sizeWidth(100)}
      //               itemWidth={sizeWidth(100)}
      //               autoplay
      //               enableSnap
      //               loop
      //               inactiveSlideScale={0.95}
      //               inactiveSlideOpacity={0.8}
      //               scrollEnabled
      //               shouldOptimizeUpdates
      //               onSnapToItem={(slideIndex) =>
      //                 this.setState({pageIndex: slideIndex})
      //               }
      //               onBeforeSnapToItem={(slideIndex) =>
      //                 this.setState({pageIndex: slideIndex})
      //               }
      //               containerCustomStyle={{marginTop: sizeHeight(0.5)}}
      //             />
      //             <Pagination
      //               carouselRef={this.crousel}
      //               dotColor={Pref.PRIMARY_COLOR}
      //               dotsLength={this.state.bannerList.length}
      //               inactiveDotColor={Colors.grey300}
      //               inactiveDotScale={1}
      //               tappableDots
      //               activeDotIndex={this.state.pageIndex}
      //               containerStyle={{marginTop: -16, marginBottom: -20}}
      //             />
      //           </View>
      //         ) : null}

      //         <View style={{flex: 0.8}}>
      //           {/* <View
      //             style={{
      //               marginHorizontal: sizeWidth(2),
      //               marginBottom: sizeHeight(1),
      //               marginTop: sizeHeight(2),
      //             }}>
      //             <StepIndicator
      //               customStyles={customStyles}
      //               labels={['Personal', 'Submit']}
      //               currentPosition={this.state.currentPosition}
      //               //onPress={(pos) => this.onPageChange(pos)}
      //               stepCount={2}
      //             />
      //           </View> */}

      //           <Card
      //             style={{
      //               marginHorizontal: sizeWidth(2),
      //               marginVertical: sizeHeight(1),
      //               paddingHorizontal: sizeWidth(1),
      //             }}>
      //             <ScrollView
      //               showsVerticalScrollIndicator={true}
      //               style={{flex: 1}}>
      // {this.state.currentPosition === 0 ? (
      //   <CommonForm
      //     ref={this.commonFormRef}
      //     showemploy={
      //       !newform &&
      //       this.state.title !== 'Fixed Deposit' &&
      //       this.state.title !== 'Vector Plus' &&
      //       this.state.title !== 'Business Loan' &&
      //       this.state.title !== 'Mutual Fund' &&
      //       this.state.title !== 'Motor Insurance'
      //     }
      //     saveData={this.state.dataArray[0]}
      //     title={this.state.title}
      //   />
      // ) : this.state.currentPosition === 1 ? (
      //   <AddressForm
      //     ref={this.addressFormRef}
      //     title={this.state.title}
      //   />
      // ) : null}

      //               <Button
      //                 mode={'flat'}
      //                 uppercase={true}
      //                 dark={true}
      //                 loading={false}
      //                 style={[styles.loginButtonStyle]}
      //                 onPress={this.submitt}>
      //                 <Text
      //                   style={{
      //                     color: 'white',
      //                     fontSize: 16,
      //                     letterSpacing: 1,
      //                   }}>
      //                   {this.state.bottontext}
      //                 </Text>
      //               </Button>
      //             </ScrollView>
      //           </Card>
      //         </View>
      //       </View>
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
