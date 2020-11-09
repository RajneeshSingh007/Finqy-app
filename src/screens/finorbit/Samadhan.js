import React from 'react';
import {
  StyleSheet,
  Linking,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Title,
  View,
} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {
  Button,
  Colors,
  RadioButton,
  Checkbox,
} from 'react-native-paper';
import { sizeHeight, sizeWidth } from '../../util/Size';
import CustomForm from '../finorbit/CustomForm';
import LeftHeaders from '../common/CommonLeftHeader';
import Loader from '../../util/Loader';
import CScreen from '../component/CScreen';
import NewDropDown from '../component/NewDropDown';
import NavigationActions from "../../util/NavigationActions";


const policyList = [{
  value: 'Health Insurance'
}, {
  value: 'General Insurance'
}, {
  value: 'Life Insurance'
}]

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
      ],
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.userData, (value) =>
        this.setState({
          ref: value.refercode, 
          name: '',
          mobile: '',
          email: '',
          aadharcard: '',
          refercode: '',
          pancard: '',
          showCompType: false,
          policy_type: '',
          complaint_type: '',
        }, () => {
          Pref.getVal(Pref.saveToken, (tt) => this.setState({ token: tt }));
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
    //const { userData } = body;
    //console.log('userData', body)
    //const { refercode } = userData;

    //body.ref = refercode;

    if (body.name === '') {
      Helper.showToastMessage('Name empty', 0);
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

    if (body.email === '') {
      Helper.showToastMessage('Email empty', 0);
      return false;
    }

    if (Helper.emailCheck(body.email) === false) {
      Helper.showToastMessage('Invalid Email', 0);
      return false;
    }

    if (body.policy_type === '') {
      Helper.showToastMessage('Please, Select Policy Type', 0);
      return false;
    }

    if (body.complaint_type === '') {
      Helper.showToastMessage('Please, Select Complain Type', 0);
      return false;
    }

    if (!this.state.isTermSelected) {
      Helper.showToastMessage('Please, Select Term & Condition', 0);
      return false;
    }


    if (checkData && this.state.isTermSelected) {
      this.setState({ loading: true });
      Helper.networkHelperTokenContentType(
        `${Pref.FinOrbitFormUrl}insurance_samadhan.php`,
        JSON.stringify(body),
        Pref.methodPost,
        this.state.token,
        (result) => {
          const { response_header } = result;
          const { res_type } = response_header;
          this.setState({ loading: false });
          if (res_type === `error`) {
            Helper.showToastMessage(`Failed to submit`, 0);
          } else {
            Helper.showToastMessage(`Submitted successfully`, 1);
            NavigationActions.navigate("Finish", {
              //top: "Add New Lead",
              top: 'Insurance Samadhan',
              red: "Success",
              grey: "Details uploaded",
              blue: "Add another lead?",
              back: "FinorbitScreen",
            });
          }
        },
        (e) => {
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
              title={`Insurance Samadhan`}
              // bottomtext={
              //   <>
              //     {`Insurance `}
              //     {<Title style={styles.passText}>{`Samadhan`}</Title>}
              //   </>
              // }
              bottomtextStyle={{
                color: '#555555',
                fontSize: 20,
              }}
              showBack
            />

            <View styleName="md-gutter">
              <CustomForm
                value={this.state.name}
                onChange={(v) => this.setState({ name: v })}
                label={`Full Name *`}
                placeholder={`Enter full name`}
              />

              <CustomForm
                value={this.state.mobile}
                label={`Mobile Number *`}
                placeholder={`Enter mobile number`}
                keyboardType={'numeric'}
                maxLength={10}
                onChange={(value) => {
                  if (String(value).match(/^[0-9]*$/g) !== null) {
                    this.setState({ mobile: value });
                  }
                }}
              />

              <CustomForm
                value={this.state.email}
                onChange={(v) => this.setState({ email: v })}
                label={`Email *`}
                placeholder={`Enter email`}
                keyboardType={'email-address'}
              />

              {/* <View style={styles.radiocont}>
                <Title style={styles.bbstyle}>{`Policy Type *`}</Title>

                <RadioButton.Group
                  onValueChange={(value) => {
                    let clist = [];
                    if (value === `Health Insurance`) {
                      clist = [
                        { value: `Claim is rejected` },
                        { value: `Claim is delayed` },
                        { value: `Policy is cancelled` },
                        { value: `No response on the claim status` },
                        { value: `Group insurance claim` },
                        { value: `Other` },
                      ];
                    } else if (value === `Life Insurance`) {
                      clist = [
                        { value: `Death claim rejected` },
                        { value: `Death claim delayed` },
                        { value: `Maturity claim not paid` },
                        { value: `Moneyback not paid` },
                        { value: `Misselling and Fraud sales` },
                        { value: `Policy Bond not received` },
                        { value: `Free Look claim not received` },
                        { value: `Other` },
                      ];
                    } else if (value === `General Insurance`) {
                      clist = [
                        { value: `Motor Insurance claim` },
                        { value: `Travel Insurance claim` },
                        { value: `Fidelity claim` },
                        { value: `Commercial claim` },
                        { value: `Property claim` },
                        { value: `Other` },
                      ];
                    }
                    this.setState({
                      policy_type: value,
                      showCompType: true,
                      compTypeList: clist,
                    });
                  }}
                  value={this.state.policy_type}>
                  <View styleName="vertical" style={{ marginBottom: 8 }}>
                    <View styleName="horizontal">
                      <RadioButton
                        value="Life Insurance"
                        style={{ alignSelf: 'center', justifyContent: 'center' }}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={{
                          alignSelf: 'center',
                          justifyContent: 'center',
                        }}
                        style={styles.textopen}>{`Life Insurance`}</Title>
                    </View>
                    <View styleName="horizontal">
                      <RadioButton
                        value="Health Insurance"
                        style={{ alignSelf: 'center', justifyContent: 'center' }}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Health Insurance`}</Title>
                    </View>
                    <View styleName="horizontal">
                      <RadioButton
                        value="General Insurance"
                        style={{ alignSelf: 'center', justifyContent: 'center' }}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`General Insurance`}</Title>
                    </View>
                  </View>
                </RadioButton.Group>
              </View> */}

              <NewDropDown
                list={policyList}
                placeholder={'Policy Type *'}
                selectedItem={value => {
                  let clist = [];
                  if (value === `Health Insurance`) {
                    clist = [
                      { value: `Claim is rejected` },
                      { value: `Claim is delayed` },
                      { value: `Policy is cancelled` },
                      { value: `No response on the claim status` },
                      { value: `Group insurance claim` },
                      { value: `Other` },
                    ];
                  } else if (value === `Life Insurance`) {
                    clist = [
                      { value: `Death claim rejected` },
                      { value: `Death claim delayed` },
                      { value: `Maturity claim not paid` },
                      { value: `Moneyback not paid` },
                      { value: `Misselling and Fraud sales` },
                      { value: `Policy Bond not received` },
                      { value: `Free Look claim not received` },
                      { value: `Other` },
                    ];
                  } else if (value === `General Insurance`) {
                    clist = [
                      { value: `Motor Insurance claim` },
                      { value: `Travel Insurance claim` },
                      { value: `Fidelity claim` },
                      { value: `Commercial claim` },
                      { value: `Property claim` },
                      { value: `Other` },
                    ];
                  }
                  this.setState({
                    policy_type: value,
                    showCompType: true,
                    compTypeList: clist,
                  });
                }}
                value={this.state.policy_type}
                style={{
                  borderRadius: 0,
                  borderBottomColor: '#f2f1e6',
                  borderBottomWidth: 1.3,
                  borderWidth: 0,
                  marginStart: 10,
                  marginEnd: 10,
                  paddingVertical: 10,
                }}
                textStyle={styles.bbstyle}
              />

              <NewDropDown
                list={this.state.compTypeList}
                placeholder={'Complain Type *'}
                value={this.state.complaint_type}
                selectedItem={value => this.setState({ complaint_type: value })}
                style={{
                  borderRadius: 0,
                  borderBottomColor: '#f2f1e6',
                  borderBottomWidth: 1.3,
                  borderWidth: 0,
                  marginStart: 10,
                  marginEnd: 10,
                  paddingVertical: 10,
                }}
                textStyle={styles.bbstyle}
              />

              {/* {this.state.showCompType ? (
                <View style={styles.radiocont}>
                  <Title style={styles.bbstyle}>{`Complaint Type *`}</Title>

                  <RadioButton.Group
                    onValueChange={(value) =>
                      this.setState({ complaint_type: value })
                    }
                    value={this.state.complaint_type}>
                    <View styleName="vertical" style={{ marginBottom: 8 }}>
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
                            <Title
                              styleName="v-center h-center"
                              style={styles.textopen}>{`${e.value}`}</Title>
                          </View>
                        );
                      })}
                    </View>
                  </RadioButton.Group>
                </View>
              ) : null} */}

              <View styleName="horizontal" style={styles.copy}>
                <Checkbox.Android
                  status={this.state.isTermSelected ? 'checked' : 'unchecked'}
                  selectedColor={Pref.PRIMARY_COLOR}
                  onPress={() =>
                    this.setState({ isTermSelected: !this.state.isTermSelected })
                  }
                />
                <TouchableWithoutFeedback
                  onPress={() => Linking.openURL(Pref.TCondition)}>
                  <Title style={styles.textopen}>
                    {`I Accept `}
                    <Title
                      style={StyleSheet.flatten([
                        styles.textopen,
                        {
                          color: Pref.CARROT_ORANGE,
                          alignSelf: 'center',
                        },
                      ])}>{`Terms & Conditions`}</Title>
                  </Title>
                </TouchableWithoutFeedback>
              </View>
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
                <Title style={styles.btntext}>{`Submit`}</Title>
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
      // <LeftHeaders
      //   title={'Insurance Samadhan'}
      //   showBack
      //   url={require('../../res/images/samadhan.png')}
      //   showAvtar
      // />

      //       <Card
      //         style={{
      //           marginHorizontal: sizeWidth(4),
      //           marginVertical: sizeHeight(2),
      //           paddingHorizontal: sizeWidth(0),
      //         }}>
      // <CustomForm
      //   value={this.state.name}
      //   onChange={(v) => this.setState({name: v})}
      //   label={`Full Name *`}
      //   placeholder={`Enter full name`}
      // />

      // <CustomForm
      //   value={this.state.mobile}
      //   onChange={(v) => this.setState({mobile: v})}
      //   label={`Mobile Number *`}
      //   placeholder={`Enter mobile number`}
      //   keyboardType={'numeric'}
      //   maxLength={10}
      // />

      // <CustomForm
      //   value={this.state.email}
      //   onChange={(v) => this.setState({email: v})}
      //   label={`Email`}
      //   placeholder={`Enter email`}
      //   keyboardType={'email-address'}
      // />

      // <View
      //   style={{
      //     marginTop: 8,
      //     marginBottom: 8,
      //     marginStart: 8,
      //     borderBottomColor: Colors.grey300,
      //     borderRadius: 2,
      //     borderBottomWidth: 0.6,
      //     alignContents: 'center',
      //   }}>
      //   <Title style={styles.bbstyle}>{`Policy Type *`}</Title>

      //   <RadioButton.Group
      //     onValueChange={(value) => {
      //       let clist = [];
      //       if (value === `Health Insurance`) {
      //         clist = [
      //           {value: `Claim is rejected`},
      //           {value: `Claim is delayed`},
      //           {value: `Policy is cancelled`},
      //           {value: `No response on the claim status`},
      //           {value: `Group insurance claim`},
      //           {value: `Other`},
      //         ];
      //       } else if (value === `Life Insurance`) {
      //         clist = [
      //           {value: `Death claim rejected`},
      //           {value: `Death claim delayed`},
      //           {value: `Maturity claim not paid`},
      //           {value: `Moneyback not paid`},
      //           {value: `Misselling and Fraud sales`},
      //           {value: `Policy Bond not received`},
      //           {value: `Free Look claim not received`},
      //           {value: `Other`},
      //         ];
      //       } else if (value === `General Insurance`) {
      //         clist = [
      //           {value: `Motor Insurance claim`},
      //           {value: `Travel Insurance claim`},
      //           {value: `Fidelity claim`},
      //           {value: `Commercial claim`},
      //           {value: `Property claim`},
      //           {value: `Other`},
      //         ];
      //       }
      //       this.setState({
      //         policy_type: value,
      //         showCompType: true,
      //         compTypeList: clist,
      //       });
      //     }}
      //     value={this.state.policy_type}>
      //     <View styleName="vertical" style={{marginBottom: 8}}>
      //       <View styleName="horizontal">
      //         <RadioButton
      //           value="Life Insurance"
      //           style={{alignSelf: 'center', justifyContent: 'center'}}
      //         />
      //         <Title
      //           styleName="v-center h-center"
      //           style={{
      //             alignSelf: 'center',
      //             justifyContent: 'center',
      //           }}>{`Life Insurance`}</Title>
      //       </View>
      //       <View styleName="horizontal">
      //         <RadioButton
      //           value="Health Insurance"
      //           style={{alignSelf: 'center', justifyContent: 'center'}}
      //         />
      //         <Title
      //           styleName="v-center h-center"
      //           style={{
      //             alignSelf: 'center',
      //             justifyContent: 'center',
      //           }}>{`Health Insurance`}</Title>
      //       </View>
      //       <View styleName="horizontal">
      //         <RadioButton
      //           value="General Insurance"
      //           style={{alignSelf: 'center', justifyContent: 'center'}}
      //         />
      //         <Title
      //           styleName="v-center h-center"
      //           style={{
      //             alignSelf: 'center',
      //             justifyContent: 'center',
      //           }}>{`General Insurance`}</Title>
      //       </View>
      //     </View>
      //   </RadioButton.Group>
      // </View>

      // {this.state.showCompType ? (
      //   <View
      //     style={{
      //       marginTop: 8,
      //       marginBottom: 8,
      //       marginStart: 8,
      //       borderBottomColor: Colors.grey300,
      //       borderRadius: 2,
      //       borderBottomWidth: 0.6,
      //       alignContents: 'center',
      //     }}>
      //     <Title style={styles.bbstyle}>
      //       {`Complaint Type *`}
      //     </Title>

      //     <RadioButton.Group
      //       onValueChange={(value) =>
      //         this.setState({complaint_type: value})
      //       }
      //       value={this.state.complaint_type}>
      //       <View styleName="vertical" style={{marginBottom: 8}}>
      //         {this.state.compTypeList.map((e) => {
      //           return (
      //             <View styleName="horizontal">
      //               <RadioButton
      //                 value={`${e.value}`}
      //                 style={{
      //                   alignSelf: 'center',
      //                   justifyContent: 'center',
      //                 }}
      //               />
      //               <Title
      //                 styleName="v-center h-center"
      //                 style={{
      //                   alignSelf: 'center',
      //                   justifyContent: 'center',
      //                 }}>{`${e.value}`}</Title>
      //             </View>
      //           );
      //         })}
      //       </View>
      //     </RadioButton.Group>
      //   </View>
      // ) : null}

      // <View
      //   styleName="horizontal"
      //   style={{
      //     marginHorizontal: sizeWidth(2),
      //     alignContent: 'center',
      //   }}>
      //   <Checkbox.Android
      //     status={this.state.isTermSelected ? 'checked' : 'unchecked'}
      //     selectedColor={Pref.PRIMARY_COLOR}
      //     onPress={() =>
      //       this.setState({isTermSelected: !this.state.isTermSelected})
      //     }
      //   />
      //   <TouchableWithoutFeedback
      //     onPress={() => Linking.openURL(Pref.TCondition)}>
      //     <Title
      //       style={{
      //         fontSize: 16,
      //         color: '#292929',
      //         alignSelf: 'center',
      //       }}>
      //       {`I Accept `}
      //       <Title
      //         style={{
      //           fontSize: 16,
      //           color: Pref.CARROT_ORANGE,
      //           alignSelf: 'center',
      //         }}>{`Terms & Conditions`}</Title>
      //     </Title>
      //   </TouchableWithoutFeedback>
      // </View>

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
      //             {'SUBMIT'}
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
    fontSize: 14,
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
    paddingVertical: 10,
  },
  copy: {
    marginStart: 10,
    marginEnd: 10,
    alignContent: 'center',
    paddingVertical: 10,
  },
});
