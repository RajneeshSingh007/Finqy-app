import React from 'react';
import {
  StyleSheet,
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
  DefaultTheme,
} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import {sizeHeight, sizeWidth} from '../../util/Size';
import LeftHeaders from '../common/CommonLeftHeader';
import BankForm from './BankForm';
import OnlineRedeem from '../../util/OnlineRedeem';
import Loader from '../../util/Loader';
import CScreen from '../component/CScreen';


export default class Redeem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.bankFormRef = React.createRef();
    this.submitt = this.submitt.bind(this);
    this.state = {
      loading: false,
      showRedeem: false,
      url: require('../../res/images/gpay.png'),
      mode: 0,
      wallet: 0,
      walletc: 0,
      amount: '0',
      showLoading: false,
      sendData: null,
      mobile: '',
      userData: null,
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    const wallet = navigation.getParam('wallet', 0);
    const sendData = navigation.getParam('sendData', null);
    this.setState({
      sendData: sendData,
      wallet: wallet,
      amount: wallet.toString(),
      walletc: wallet,
      mobile: sendData !== null ? sendData.mobile_no : '',
    });
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.saveToken, (toke) => {
        this.setState({token: toke}, () => {
          Pref.getVal(Pref.userData, (parseda) => {
            this.setState({userData: parseda});
            this.updateData(parseda);
          });
        });
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
  };

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  submitt = () => {
    let commons = JSON.parse(JSON.stringify(this.bankFormRef.current.state));
    let check = true;
    if (commons !== undefined && commons !== null) {
      if (commons.bank_account_name === '') {
        check = false;
        Helper.showToastMessage('Account name empty');
      } else if (commons.account_no === '') {
        check = false;
        Helper.showToastMessage('Account number empty');
      } else if (commons.account_branch === '') {
        check = false;
        Helper.showToastMessage('Branch name empty');
      } else if (commons.bank_ifsc === '') {
        check = false;
        Helper.showToastMessage('IFSC code empty');
      } else if (commons.account_type === '') {
        check = false;
        Helper.showToastMessage('Account type not selected');
      }
    }
    const {token, userData, amount, sendData, mobile} = this.state;
    const {refercode} = userData;
    const {inv_no, days} = sendData;
    commons.refer = refercode;
    commons.amount = Number(amount);
    commons.inv_no = inv_no;
    commons.mobile = mobile;
    commons.days = days;
    const jsonbody = JSON.stringify(commons);

    if (check) {
      this.setState({showLoading: true});
      Helper.networkHelperTokenPost(
        Pref.WalletRedeemUrl,
        jsonbody,
        Pref.methodPost,
        token,
        (result) => {
          //console.log(result);
          const {response_header} = result;
          const {res_type, message} = response_header;
          this.setState({showLoading: false});
          if (res_type === 'success') {
            Helper.showToastMessage(message, 1);
            NavigationActions.navigate('MyWallet');
          } else {
            Helper.showToastMessage('Failed to send request');
          }
        },
        () => {
          //console.log(error);
          this.setState({showLoading: false});
        },
      );
    }
  };

  render() {
    return (
      <CScreen
        absolute={
          <>
            {this.state.showRedeem ? (
              <OnlineRedeem
                isShow={this.state.showRedeem}
                clickedcallback={() => {
                  this.setState({showRedeem: false});
                }}
                url={this.state.url}
                mode={this.state.mode}
                amount={this.state.amount}
              />
            ) : null}
            <Loader isShow={this.state.showLoading} />
          </>
        }
        body={
          <>
            <LeftHeaders
              title={`Redeem`}
              bottomtext={`Redeem`}
              bottomtextStyle={{
                color: '#555555',
                fontSize: 20,
              }}
              showBack
            />

            <View styleName="horizontal h-center v-center">
              <Title
                style={StyleSheet.flatten([
                  styles.itemtopText,
                  {
                    color: '#0270e3',
                    fontSize: 20,
                    lineHeight: 20,
                  },
                ])}>{`₹ ${this.state.walletc} /-`}</Title>
            </View>

            <View styleName="md-gutter">
              {/* <CustomForm
                value={this.state.mobile}
                onChange={(v) => this.setState({mobile: v})}
                label={`UPI ID `}
              /> */}

              <BankForm ref={this.bankFormRef} />
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
      //         title={'Redeem'}
      //         loading={this.state.loading}
      //         absoluteBody={
      //           <>
      //             {this.state.showRedeem ? (
      //               <OnlineRedeem
      //                 isShow={this.state.showRedeem}
      //                 clickedcallback={() => {
      //                   this.setState({showRedeem: false});
      //                 }}
      //                 url={this.state.url}
      //                 mode={this.state.mode}
      //                 amount={this.state.amount}
      //               />
      //             ) : null}
      //             <Loader isShow={this.state.showLoading} />
      //           </>
      //         }
      //         body={
      //           <>
      //             <LeftHeaders
      //               title={'Redeem'}
      //               showBack
      //               // bottomBody={
      //               //     <View style={{ marginStart: 64, flexDirection: 'row', justifyContent: 'space-between', alignContents: 'center', alignItems: 'center' }}>
      //               //         <Title style={{
      //               //             fontSize: 17, fontFamily: 'Rubik', letterSpacing: 1, color: 'white', alignSelf: 'flex-start', fontWeight: '400',
      //               //         }}> {'We help'}</Title>
      //               //     </View>
      //               // }
      //             />

      //             <Card
      //               style={{
      //                 marginHorizontal: sizeWidth(4),
      //                 marginVertical: sizeHeight(2),
      //                 paddingHorizontal: sizeWidth(0),
      //               }}>
      //               <View style={{marginVertical: sizeHeight(1.5)}}></View>

      //               <View>
      //                 <Title
      //                   style={
      //                     styles.title1
      //                   }>{`Available Wallet Amount: ₹${this.state.walletc}`}</Title>
      //                 {this.state.sendData !== null ? (
      //                   <>
      //                     <Title
      //                       style={
      //                         styles.subss
      //                       }>{`GST Number: ${this.state.sendData.gst_no}`}</Title>
      //                     <Title
      //                       style={
      //                         styles.subss
      //                       }>{`Invoice No: ${this.state.sendData.inv_no}`}</Title>
      //                   </>
      //                 ) : null}
      //               </View>

      //               <CustomForm
      //                 showheader
      //                 heading={`UPI Information`}
      //                 value={this.state.mobile}
      //                 onChange={(v) => this.setState({mobile: v})}
      //                 label={`UPI ID `}
      //               />

      //               {/* <Subtitle style={styles.subtitle}> {'Enter Withdraw Amount'}</Subtitle>

      //                       <TextInput
      //                           mode="flat"
      //                           underlineColor="transparent"
      //                           underlineColorAndroid="transparent"
      //                           style={[
      //                               styles.inputStyle,
      //                               { marginVertical: sizeHeight(1) },
      //                           ]}
      //                           label={"Amount"}
      //                           placeholder={"Enter amount"}
      //                           placeholderTextColor={"#DEDEDE"}
      //                           onChangeText={(value) =>{
      //                               const { walletc, wallet } = this.state;
      //                               if(value !== ''){
      //                                   const valx = Number(value);
      //                                   //console.log('valx', valx);
      //                                   if (valx > 0  && valx <= wallet) {
      //                                       const minamt = wallet - valx;
      //                                       this.setState({ amount: value, walletc: minamt })
      //                                   } else if (valx > 0 && valx > wallet) {
      //                                       this.setState({ walletc: wallet })
      //                                       Helper.showToastMessage('Amount is greater than wallet amount')
      //                                   } else if(valx == 0){
      //                                       this.setState({ amount: '', walletc: wallet })
      //                                   } else {
      //                                       this.setState({ walletc: wallet })
      //                                       Helper.showToastMessage('You can redeem above ₹2500')
      //                                   }
      //                               }else{
      //                                   this.setState({ amount: value, walletc: wallet })
      //                               }
      //                           }}
      //                           keyboardType={'number-pad'}
      //                           value={this.state.amount}
      //                           theme={theme}
      //                           returnKeyType={"next"}
      //                       />

      //                       <View style={{ paddingVertical: sizeHeight(2), paddingHorizontal: sizeWidth(0),marginVertical:sizeHeight(1) }}>
      //                           <Title style={styles.title1}> {'Select your payment mode'}</Title>
      //                       </View>

      //                       <View style={{ flexDirection: 'row', flex: 1, paddingVertical: 8, marginVertical: sizeHeight(1), }}>
      //                           <View style={{ flex: 0.1 }} />
      //                           <TouchableWithoutFeedback onPress={() => this.setState({ showRedeem: true, url: require('../../res/images/gpay.png'), mode:0 })}>
      //                               <View style={{ flex: 0.3, }}>
      //                                   <Image styleName={'small'} source={require('../../res/images/gpay.png')} style={{ backgroundColor: 'transparent', resizeMode: 'contain' }} />
      //                               </View>
      //                           </TouchableWithoutFeedback>
      //                           <TouchableWithoutFeedback onPress={() => this.setState({ showRedeem: true, url: require('../../res/images/paytm.png'), mode:1 })}>
      //                               <View style={{ flex: 0.3, }}>
      //                                   <Image styleName={'small'} source={require('../../res/images/paytm.png')} style={{ backgroundColor: 'transparent', resizeMode: 'contain' }} />
      //                               </View>
      //                           </TouchableWithoutFeedback>
      //                           <View style={{ flex: 0.3 }} />
      //                       </View>

      //                       <View style={{
      //                           flexDirection: 'row', flex: 1, marginVertical: sizeHeight(1), alignContents: 'center',
      //                           alignItems: 'center',
      //                           justifyContent: 'space-between'
      //                       }}>
      //                           <View style={{
      //                               flex: 0.5, backgroundColor: '#dedede', height: 1, alignSelf: 'center',
      //                               justifyContent: 'center',
      //                               marginHorizontal: 10
      //                           }} />
      //                           <Title
      //                               style={{
      //                                   color: "#292929",
      //                                   fontSize: 16,
      //                                   letterSpacing: 1,
      //                                   fontFamily: 'Rubik',
      //                                   alignSelf: 'center',
      //                                   justifyContent: 'center'
      //                               }}
      //                           >

      //                               {`OR`}
      //                           </Title>
      //                           <View style={{
      //                               flex: 0.5, backgroundColor: '#dedede', height: 1, alignSelf: 'center',
      //                               justifyContent: 'center',
      //                               marginHorizontal: 10
      //                           }} />
      //                       </View> */}

      //               <BankForm ref={this.bankFormRef} />

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
      //                   {'Submit'}
      //                 </Text>
      //               </Button>
      //             </Card>
      //           </>
      //         }
      //       />
    );
  }
}

const styles = StyleSheet.create({
  itemtopText: {
    letterSpacing: 0.5,
    fontWeight: '700',
    lineHeight: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#0270e3',
    fontSize: 16,
  },
  inputStyle: {
    height: 56,
    backgroundColor: 'white',
    color: '#292929',
    borderBottomColor: Colors.grey300,
    fontFamily: 'Rubik',
    fontSize: 16,
    borderBottomWidth: 0.6,
    fontWeight: '400',
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: '#292929',
    fontWeight: '400',
    marginHorizontal: sizeWidth(4),
    paddingVertical: 4,
    marginVertical: sizeHeight(0.5),
  },
  title: {
    fontSize: 18,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'flex-start',
    fontWeight: '700',
  },
  line: {
    backgroundColor: '#dedede',
    height: 0.7,
    marginHorizontal: sizeWidth(3.5),
  },
  title1: {
    fontSize: 16,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'flex-start',
    fontWeight: '700',
    marginHorizontal: sizeWidth(4),
  },
  subss: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Rubik',
    letterSpacing: 0.5,
    color: '#767676',
    alignSelf: 'flex-start',
    fontWeight: '400',
    marginHorizontal: sizeWidth(4),
  },
  circle: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 4,
    borderRadius: 48 / 2,
    borderColor: 'rgba(0,0,0,0.1)',
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: Pref.JET_BLACK,
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
