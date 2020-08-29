import React from 'react';
import {
  StatusBar,
  StyleSheet,
  ScrollView,
  BackHandler,
  Platform,
  Linking,
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
  RadioButton,
  Checkbox,
} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import {SafeAreaView} from 'react-navigation';
import {sizeFont, sizeHeight, sizeWidth} from '../../util/Size';
import CommonScreen from '../common/CommonScreen';
import CustomForm from '../finorbit/CustomForm';
import FileUploadForm from '../finorbit/FileUploadForm';
import DocumentPicker from 'react-native-document-picker';
import LeftHeaders from '../common/CommonLeftHeader';
import SpecificForm from '../finorbit/SpecificForm';
import Lodash from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../../util/Loader';
import DropDown from '../common/CommonDropDown';

export default class Samadhan extends React.Component {
  constructor(props) {
    super(props);
    this.submitt = this.submitt.bind(this);
    this.specificFormRef = React.createRef();
    this.state = {
      name: '',
      mobile: '',
      email: '',
      refercode: '',
      token: '',
      userData: null,
      complaint_type: '',
      policy_type: '',
      baa: '',
      ref: '',
      loading: false,
      isTermSelected: false,
      showCompType: false,
      compTypeList: [
        {value: `Claim is rejected`},
        {value: `Claim is delayed`},
        {value: `Policy is cancelled`},
        {value: `No response on the claim status`},
        {value: `Group insurance claim`},
        {value: `Other`},
      ],
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.userData, (value) =>
        this.setState({userData: value, ref: value.refercode}, () => {
          Pref.getVal(Pref.saveToken, (tt) => this.setState({token: tt}));
        }),
      );
    });
  }

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
  }

  submitt = () => {
    let checkData = true;
    const body = JSON.parse(JSON.stringify(this.state));
    const {userData} = body;
    const {refercode} = userData;

    body.ref = refercode;

    if (body.name === '') {
      Helper.showToastMessage('Name empty', 0);
      return false;
    }

    if (body.email === '') {
      Helper.showToastMessage('Email empty', 0);
      return false;
    }

    if (body.mobile === '') {
      Helper.showToastMessage('Mobile Number empty', 0);
      return false;
    } else if (
      body.mobile === '9876543210' ||
      Number(body.mobile.length) < 10
    ) {
      Helper.showToastMessage('Invalid Mobile Number', 0);
      return false;
    }

    if (!this.state.isTermSelected) {
      Helper.showToastMessage('Please, Select Term & Condition', 0);
      return false;
    }

    if (checkData && this.state.isTermSelected) {
      console.log(`result`, this.state.token);

      this.setState({loading: true});
      Helper.networkHelperTokenContentType(
        `${Pref.FinOrbitFormUrl}insurance_samadhan.php`,
        JSON.stringify(body),
        Pref.methodPost,
        this.state.token,
        (result) => {
          console.log(`result`, result);
          const {response_header} = result;
          const {res_type} = response_header;
          this.setState({loading: false});
          if (res_type === `error`) {
            Helper.showToastMessage(`Failed to submit`, 0);
          } else {
            this.setState({
              name: '',
              mobile: '',
              email: '',
              aadharcard: '',
              refercode: '',
              pancard: '',
              showCompType: false,
              policy_type: '',
              complaint_type: '',
            });
            Helper.showToastMessage(`Form submitted successfully`, 1);
          }
        },
        (error) => {
          this.setState({loading: false});
        },
      );
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
              title={'Insurance Samadhan'}
              showBack
              url={require('../../res/images/samadhan.png')}
              showAvtar
            />

            <Card
              style={{
                marginHorizontal: sizeWidth(4),
                marginVertical: sizeHeight(2),
                paddingHorizontal: sizeWidth(0),
              }}>
              <CustomForm
                value={this.state.name}
                onChange={(v) => this.setState({name: v})}
                label={`Full Name *`}
                placeholder={`Enter full name`}
              />

              <CustomForm
                value={this.state.mobile}
                onChange={(v) => this.setState({mobile: v})}
                label={`Mobile Number *`}
                placeholder={`Enter mobile number`}
                keyboardType={'numeric'}
                maxLength={10}
              />

              <CustomForm
                value={this.state.email}
                onChange={(v) => this.setState({email: v})}
                label={`Email`}
                placeholder={`Enter email`}
                keyboardType={'email-address'}
              />

              <View
                style={{
                  marginTop: 8,
                  marginBottom: 8,
                  marginStart: 8,
                  borderBottomColor: Colors.grey300,
                  borderRadius: 2,
                  borderBottomWidth: 0.6,
                  alignContents: 'center',
                }}>
                <Subtitle style={styles.bbstyle}>{`Policy Type *`}</Subtitle>

                <RadioButton.Group
                  onValueChange={(value) => {
                    let clist = [];
                    if (value === `Health Insurance`) {
                      clist = [
                        {value: `Claim is rejected`},
                        {value: `Claim is delayed`},
                        {value: `Policy is cancelled`},
                        {value: `No response on the claim status`},
                        {value: `Group insurance claim`},
                        {value: `Other`},
                      ];
                    } else if (value === `Life Insurance`) {
                      clist = [
                        {value: `Death claim rejected`},
                        {value: `Death claim delayed`},
                        {value: `Maturity claim not paid`},
                        {value: `Moneyback not paid`},
                        {value: `Misselling and Fraud sales`},
                        {value: `Policy Bond not received`},
                        {value: `Free Look claim not received`},
                        {value: `Other`},
                      ];
                    } else if (value === `General Insurance`) {
                      clist = [
                        {value: `Motor Insurance claim`},
                        {value: `Travel Insurance claim`},
                        {value: `Fidelity claim`},
                        {value: `Commercial claim`},
                        {value: `Property claim`},
                        {value: `Other`},
                      ];
                    }
                    this.setState({
                      policy_type: value,
                      showCompType: true,
                      compTypeList: clist,
                    });
                  }}
                  value={this.state.policy_type}>
                  <View styleName="vertical" style={{marginBottom: 8}}>
                    <View styleName="horizontal">
                      <RadioButton
                        value="Life Insurance"
                        style={{alignSelf: 'center', justifyContent: 'center'}}
                      />
                      <Subtitle
                        styleName="v-center h-center"
                        style={{
                          alignSelf: 'center',
                          justifyContent: 'center',
                        }}>{`Life Insurance`}</Subtitle>
                    </View>
                    <View styleName="horizontal">
                      <RadioButton
                        value="Health Insurance"
                        style={{alignSelf: 'center', justifyContent: 'center'}}
                      />
                      <Subtitle
                        styleName="v-center h-center"
                        style={{
                          alignSelf: 'center',
                          justifyContent: 'center',
                        }}>{`Health Insurance`}</Subtitle>
                    </View>
                    <View styleName="horizontal">
                      <RadioButton
                        value="General Insurance"
                        style={{alignSelf: 'center', justifyContent: 'center'}}
                      />
                      <Subtitle
                        styleName="v-center h-center"
                        style={{
                          alignSelf: 'center',
                          justifyContent: 'center',
                        }}>{`General Insurance`}</Subtitle>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              {this.state.showCompType ? (
                <View
                  style={{
                    marginTop: 8,
                    marginBottom: 8,
                    marginStart: 8,
                    borderBottomColor: Colors.grey300,
                    borderRadius: 2,
                    borderBottomWidth: 0.6,
                    alignContents: 'center',
                  }}>
                  <Subtitle style={styles.bbstyle}>
                    {`Complaint Type *`}
                  </Subtitle>

                  <RadioButton.Group
                    onValueChange={(value) =>
                      this.setState({complaint_type: value})
                    }
                    value={this.state.complaint_type}>
                    <View styleName="vertical" style={{marginBottom: 8}}>
                      {this.state.compTypeList.map((e) => {
                        return (
                          <View styleName="horizontal">
                            <RadioButton
                              value={`${e.value}`}
                              style={{
                                alignSelf: 'center',
                                justifyContent: 'center',
                              }}
                            />
                            <Subtitle
                              styleName="v-center h-center"
                              style={{
                                alignSelf: 'center',
                                justifyContent: 'center',
                              }}>{`${e.value}`}</Subtitle>
                          </View>
                        );
                      })}
                    </View>
                  </RadioButton.Group>
                </View>
              ) : null}

              <View
                styleName="horizontal"
                style={{
                  marginHorizontal: sizeWidth(2),
                  alignContent: 'center',
                }}>
                <Checkbox.Android
                  status={this.state.isTermSelected ? 'checked' : 'unchecked'}
                  selectedColor={Pref.PRIMARY_COLOR}
                  onPress={() =>
                    this.setState({isTermSelected: !this.state.isTermSelected})
                  }
                />
                <TouchableWithoutFeedback
                  onPress={() => Linking.openURL(Pref.TCondition)}>
                  <Subtitle
                    style={{
                      fontSize: 16,
                      color: '#292929',
                      alignSelf: 'center',
                    }}>
                    {`I Accept `}
                    <Subtitle
                      style={{
                        fontSize: 16,
                        color: Pref.CARROT_ORANGE,
                        alignSelf: 'center',
                      }}>{`Terms & Conditions`}</Subtitle>
                  </Subtitle>
                </TouchableWithoutFeedback>
              </View>

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
                  {'SUBMIT'}
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
    paddingVertical: sizeHeight(0.5),
    marginHorizontal: sizeWidth(3),
    marginVertical: sizeHeight(3.5),
    backgroundColor: Pref.RED,
    textAlign: 'center',
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 1,
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
    fontFamily: 'Rubik',
    fontWeight: '400',
    color: '#767676',
    lineHeight: 25,
    padding: 4,
    marginHorizontal: 8,
  },
});
