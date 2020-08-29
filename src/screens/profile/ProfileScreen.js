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
import {SafeAreaView} from 'react-navigation';
import {sizeFont, sizeHeight, sizeWidth} from '../../util/Size';
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
      res: {},
      utype: '',
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.willfocusListener = navigation.addListener('willFocus', () => {
      Pref.getVal(Pref.saveToken, (toke) => {
        this.setState({token: toke}, () => {
          Pref.getVal(Pref.userData, (parseda) => {
            const pp = parseda.user_prof;
            const url = {
              uri: pp === '' ? Pref.profileDefaultPic : `${pp}`,
            };

            this.setState({
              userData: parseda,
              imageUrl: url,
            });
            this.updateData(parseda);
          });
        });
        Pref.getVal(Pref.USERTYPE, (v) => this.setState({utype: v}));
      });
    });
  }

  updateData = (userData) => {
    this.bankFormRef.current.saveData(
      '',
      userData.bank_ifsc,
      userData.account_no,
      userData.bank_account_name,
      userData.account_branch,
      userData.account_type,
    );
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
  };

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  submitt = () => {
    const {token, res, userData, utype} = this.state;
    let checkData = true;
    console.log(`utype`, utype);

    let formData = new FormData();
    formData.append('user_id', userData.id);
    formData.append('type', utype);

    let commons = JSON.parse(JSON.stringify(this.commonFormRef.current.state));
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

    for (var key in commons) {
      const value = commons[key];
      if (value !== undefined) {
        formData.append(key, commons[key]);
      }
    }

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

    let bankformCommons = JSON.parse(
      JSON.stringify(this.bankFormRef.current.state),
    );
    for (var keys in bankformCommons) {
      const value = bankformCommons[keys];
      if (value !== undefined) {
        formData.append(keys, bankformCommons[keys]);
      }
    }

    if (res.length !== 0) {
      formData.append('user_prof', res);
    }

    //console.log(`formData`, formData, token);

    if (checkData) {
      this.setState({loading: true});
      Helper.networkHelperTokenContentType(
        Pref.UpdateAccountUrl,
        formData,
        Pref.methodPost,
        token,
        (result) => {
          //console.log(`result`, result);
          const {data, response_header} = result;
          const {res_type, message} = response_header;
          this.setState({loading: false});
          if (res_type === `success`) {
            Helper.showToastMessage('Profile updated successfully', 1);
            const {id} = data[0];
            Pref.setVal(Pref.userID, id);
            Pref.setVal(Pref.userData, data[0]);
            this.setState({userData: data[0]});
            this.updateData(data[0]);
          } else {
            Helper.showToastMessage('Failed to update profile', 0);
          }
        },
        (error) => {
          //console.log(`error`, error);
          this.setState({loading: false});
        },
      );
    }
  };

  filePicker = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: DocumentPicker.types.images,
      });
      this.setState({imageUrl: {uri: res.uri}, res: res});
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        //
      }
    }
  };

  render() {
    return (
      <CommonScreen
        title={''}
        loading={this.state.loading}
        absoluteBody={<Loader isShow={this.state.loading} />}
        body={
          <>
            <LeftHeaders
              //showAvtar
              //rightImage={false}
              //url={require('../../res/images/moneywallets.png')}
              title={'My Profile'}
              showBack
            />

            <Card
              style={{
                marginHorizontal: sizeWidth(4),
                marginVertical: sizeHeight(2),
                paddingHorizontal: sizeWidth(0),
              }}>
              <TouchableWithoutFeedback onPress={() => this.filePicker()}>
                <View
                  style={{
                    marginVertical: sizeHeight(2),
                    alignSelf: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                  }}>
                  <Avatar.Image
                    source={this.state.imageUrl}
                    style={{backgroundColor: Colors.grey300}}
                    size={96}
                    backgroundColor={'transparent'}
                  />
                </View>
              </TouchableWithoutFeedback>

              <CommonForm title="Profile" ref={this.commonFormRef} />

              <SpecificForm
                title="Demat"
                heading={`Other Information`}
                ref={this.specificFormRef}
              />

              <BankForm ref={this.bankFormRef} />

              <FileUploadForm
                title="Profile"
                ref={this.FileUploadFormRef}
                heading={`File Upload`}
              />

              {/* <View style={{marginVertical:sizeHeight(1),justifyContent:'center',alignContents:'center',alignItems:'center'}}>
                            {this.state.pancardupload !== '' ? <Image styleName='medium' source={{ uri: `${Pref.FOLDERPATH}${this.state.pancardupload}` }} style={{margin:16}} /> : null}
                            {this.state.aadharcardupload !== '' ? <Image styleName='medium' source={{ uri: `${Pref.FOLDERPATH}${this.state.aadharcardupload}` }} /> : null}
                            {this.state.addressupload !== '' ? <Icon name='pdf' size={56} source={{ uri: `${Pref.FOLDERPATH}${this.state.addressupload}` }} /> : null}
                        </View> */}

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
                  {'Save Profile'}
                </Text>
              </Button>
            </Card>
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
    backgroundColor: Pref.RED,
    textAlign: 'center',
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 1,
  },
});
