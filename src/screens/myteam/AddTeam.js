import React from 'react';
import {
  StyleSheet,
  BackHandler,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Subtitle,
  Title,
  View,
} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {
  Button,
  Colors,
} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import { sizeHeight, sizeWidth } from '../../util/Size';
import CustomForm from '../finorbit/CustomForm';
import LeftHeaders from '../common/CommonLeftHeader';
import SpecificForm from '../finorbit/SpecificForm';
import Lodash from 'lodash';
import Icon from 'react-native-vector-icons/Feather';
import Loader from '../../util/Loader';
import DropDown from '../common/CommonDropDown';
import CScreen from '../component/CScreen';

export default class AddTeam extends React.Component {
  constructor(props) {
    super(props);
    this.submitt = this.submitt.bind(this);
    this.backClick = this.backClick.bind(this);
    this.specificFormRef = React.createRef();
    const filter = Lodash.orderBy(Pref.cityList, ['value'], ['asc']);
    this.state = {
      loading: false,
      name: '',
      mobile_no: '',
      address: '',
      email: '',
      aadharcard: '',
      refercode: '',
      pancard: '',
      token: '',
      userData: '',
      showCityList: false,
      cityList: filter,
    };
    Pref.getVal(Pref.userData, (value) => this.setState({ userData: value }));
    Pref.getVal(Pref.saveToken, (value) => this.setState({ token: value }));
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backClick);
    this.setState({
      name: '',
      mobile_no: '',
      address: '',
      email: '',
      aadharcard: '',
      refercode: '',
      pancard: '',
    });

    if (this.specificFormRef && this.specificFormRef.current) {
      this.specificFormRef.current.restoreData({ pancardNo: '' })
    }
  }



  backClick = () => {
    this.setState({
      name: '',
      mobile_no: '',
      address: '',
      email: '',
      aadharcard: '',
      refercode: '',
      pancard: '',
    });
    if (this.specificFormRef && this.specificFormRef.current) {
      this.specificFormRef.current.restoreData({ pancardNo: '', aadharcardNo: '' })
    }

    return false;
  }

  componentWillUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
  }

  submitt = () => {
    const { refercode } = this.state.userData;
    let checkData = true;
    const body = JSON.parse(JSON.stringify(this.state));
    delete body.userData;
    delete body.token;

    if (body.name === '') {
      Helper.showToastMessage('Name empty', 0);
      return false;
    }


    if (body.mobile_no === '') {
      Helper.showToastMessage('Mobile Number empty', 0);
      return false;
    } else if (body.mobile_no === '9876543210' || body.mobile_no.length < 10) {
      Helper.showToastMessage('Invalid Mobile Number', 0);
      return false;
    }

    if (body.email === '') {
      Helper.showToastMessage('Email empty', 0);
      return false;
    } else if (Helper.emailCheck(body.email) === false) {
      Helper.showToastMessage('Invalid Email', 0);
      return false;
    }

    const panCards = body.pancard;
    if (panCards === '') {
      Helper.showToastMessage('Pancard number empty', 0);
      return false;
    } else if (panCards !== '' && !Helper.checkPanCard(panCards)) {
      Helper.showToastMessage('Invalid Pancard number', 0);
      return false;
    }

    if (body.aadharcard !== '' && body.aadharcard.length < 12) {
      Helper.showToastMessage('Invalid aadhar card number', 0);
      return false;
    }

    if (body.address === '') {
      Helper.showToastMessage('Please, Select location', 0);
      return false;
    }
    
    body.refercode = refercode;

    if (checkData) {
      this.setState({ loading: true });
      Helper.networkHelperTokenPost(
        Pref.AddTeam,
        JSON.stringify(body),
        Pref.methodPost,
        this.state.token,
        (result) => {
          //console.log('result', result);
          const { response_header } = result;
          const { res_type, message } = response_header;
          this.setState({ loading: false });
          if (res_type === `error`) {
            Helper.showToastMessage(message, 0);
          } else {
            Helper.showToastMessage(`Added successfully`, 1);
            NavigationActions.navigate('ViewTeam');
          }
        },
        () => {
          this.setState({ loading: false });
        },
      );
    }
  };

  render() {
    return (
      <CScreen
        absolute={<Loader isShow={this.state.loading} />}
        body={
          <>
            <LeftHeaders
              title={`Add Team`}
              bottomtextStyle={{
                color: '#555555',
                fontSize: 20,
              }}
              showBack
            />

            <View styleName="md-gutter">
              <CustomForm
                value={this.state.name}
                onChange={(value) => {
                  if (String(value).match(/^[a-z, A-Z]*$/g) !== null) {
                    this.setState({ name: value })
                  }
                }}
                label={`Name *`}
                placeholder={`Enter name`}
              />

              <CustomForm
                value={this.state.mobile_no}
                onChange={(v) => {
                  if (String(v).match(/^[0-9]*$/g) !== null) {
                    this.setState({ mobile_no: v });
                  }
                }}
                label={`Mobile Number *`}
                placeholder={`Enter mobile number`}
                keyboardType={'numeric'}
                maxLength={10}
                style={{
                  marginBottom: 2,
                }}
              />

              <CustomForm
                value={this.state.email}
                onChange={(v) => this.setState({ email: v })}
                label={`Email *`}
                placeholder={`Enter email`}
                keyboardType={'email-address'}
              />

              <CustomForm
                value={this.state.pancard}
                onChange={(v) => this.setState({ pancard: v })}
                label={`PAN Card Number *`}
                placeholder={`Enter pan card number`}
                keyboardType={'text'}
                maxLength={10}
              />


              <CustomForm
                value={this.state.aadharcard}
                onChange={(v) => this.setState({ aadharcard: v })}
                label={`Aadhar Card Number`}
                placeholder={`Enter aadhar card number`}
                keyboardType={'text'}
                maxLength={12}
                keyboardType={'numeric'}
              />

              <View style={styles.radiocont}>
                <TouchableWithoutFeedback
                  onPress={() =>
                    this.setState({
                      showCityList: !this.state.showCityList,
                    })
                  }>
                  <View style={styles.dropdownbox}>
                    <Subtitle
                      style={{
                        fontSize: 15,
                        fontWeight: '700',
                        lineHeight: 20,
                        alignSelf: 'center',
                        marginStart: 4,
                        color:
                          this.state.address === '' ? `#6d6a57` : `#555555`,
                      }}>
                      {this.state.address === ''
                        ? `Select Location *`
                        : this.state.address}
                    </Subtitle>
                    <Icon
                      name={'chevron-down'}
                      size={24}
                      color={'#6d6a57'}
                      style={{
                        alignSelf: 'center',
                      }}
                    />
                  </View>
                </TouchableWithoutFeedback>
                {this.state.showCityList ? (
                  <DropDown
                    itemCallback={(value) =>
                      this.setState({ showCityList: false, address: value })
                    }
                    list={this.state.cityList}
                    isCityList
                    enableSearch
                    autoFocus
                  />
                ) : null}
              </View>

              <View styleName="horizontal space-between md-gutter v-center h-center">
                <Button
                  mode={'flat'}
                  uppercase={false}
                  dark={true}
                  loading={false}
                  style={styles.loginButtonStyle}
                  onPress={this.submitt}>
                  <Title style={styles.btntext}>{`Submit`}</Title>
                </Button>
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
    marginTop:12
  },
  boxsubtitle: {
    fontSize: 16,
    fontFamily: 'Rubik',
    fontWeight: '400',
    color: '#292929',
    lineHeight: 25,
    alignSelf: 'center',
    padding: 4,
    alignSelf: 'center',
    marginHorizontal: 8,
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
});
