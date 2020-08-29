import React from 'react';
import {
  StatusBar,
  StyleSheet,
  ScrollView,
  BackHandler,
  FlatList,
  TouchableWithoutFeedback,
  Linking,
  Alert,
  Clipboard,
} from 'react-native';
import {
  TouchableOpacity,
  Image,
  Screen,
  Subtitle,
  Title,
  View,
  Heading,
  NavigationBar,
  Text,
  Caption,
  GridView,
} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {
  Button,
  Card,
  Colors,
  Snackbar,
  TextInput,
  DataTable,
  Modal,
  Portal,
  Avatar,
  ActivityIndicator,
} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import {SafeAreaView} from 'react-navigation';
import {sizeFont, sizeHeight, sizeWidth} from '../../util/Size';
import PlaceholderLoader from '../../util/PlaceholderLoader';
import Icon from 'react-native-vector-icons/Feather';
import Icons from 'react-native-vector-icons/FontAwesome5';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Lodash from 'lodash';
import MenuProvider from '../../util/MenuProvider.js';
import CommonScreen from '../common/CommonScreen';
import CardRow from '../common/CommonCard';
import LeftHeaders from '../common/CommonLeftHeader';
import BankForm from './BankForm';
import CircularCardLeft from '../common/CommonCircularCard';
import CardVertical from '../common/CardVertical';
import ViewSlider from 'react-native-view-slider';
import Share from 'react-native-share';
import ListError from '../common/ListError';
import CommonTable from '../common/CommonTable';

export default class MyWallet extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      coupon: '',
      wallet: '0',
      userData: {},
      progressloader: false,
      dataList: [],
      tableHead: [
        'Sr. No.',
        'Lead No',
        'Customer Name',
        'Product',
        'Issue Date',
        'Premium Amount',
        'Payout %',
        'Payout Amount',
        'Invoice Number',
      ],
      widthArr: [60, 100, 140, 140, 100, 140, 100, 100, 100],
      sendData: null,
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({loading: true, dataList: []});
    });
    //this.focusListener = navigation.addListener('didFocus', () => {
    Pref.getVal(Pref.userData, (userData) => {
      this.setState({userData: userData});
      Pref.getVal(Pref.saveToken, (value) => {
        this.setState({token: value}, () => {
          this.fetchData();
        });
      });
    });
    //});
  }

  fetchData = () => {
    this.setState({loading: true});
    const {refercode, id} = this.state.userData;
    const body = JSON.stringify({
      user_id: refercode,
    });
    Helper.networkHelperTokenPost(
      Pref.WalletUrl,
      body,
      Pref.methodPost,
      this.state.token,
      (result) => {
        console.log('result', result);
        const {data, response_header} = result;
        const {res_type, message} = response_header;
        if (res_type === `success`) {
          const {earning_history} = data;

          if (earning_history.length > 0) {
            const {dataList} = this.state;
            const sorting = earning_history.sort((a, b) => {
              const sp = a.approve_date.split('-');
              const spz = b.approve_date.split('-');
              return sp[2] - spz[2] || sp[1] - spz[1] || sp[0] - spz[0];
            });
            const sort = sorting.reverse();
            Lodash.map(sort, (item, i) => {
              const rowData = [];
              rowData.push(`${i + 1}`);
              rowData.push(
                item.product === `Redeem Request` ? '' : item.leadno,
              );
              rowData.push(item.customer_name);
              rowData.push(item.product);
              rowData.push(item.approve_date);
              rowData.push(item.earning);
              rowData.push(item.earn_percentage);
              rowData.push(item.amount);
              rowData.push(item.inv_no === 'null' ? '' : item.inv_no);
              dataList.push(rowData);
            });
            this.setState({
              wallet: data.total_wallet_amount,
              earning_history: data,
              dataList: dataList,
              loading: false,
            });
          } else {
            this.setState({
              wallet: 0,
              earning_history: [],
              dataList: [],
              loading: false,
            });
          }
        } else {
          this.setState({loading: false});
        }
      },
      (error) => {
        this.setState({loading: false});
      },
    );
    Helper.networkHelperTokenPost(
      Pref.AjaxUrl,
      body,
      Pref.methodPost,
      this.state.token,
      (result) => {
        const {response} = result;
        if (response === 1) {
          this.setState({sendData: result});
        }
      },
      (error) => {},
    );
  };

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  render() {
    // let amountLeft = 0;
    // let text = ``;
    // if (this.state.wallet > 0 && this.state.wallet < 500) {
    //   amountLeft = this.state.wallet - 500;
    //   text += `${amountLeft} left to redeem your wallet, fill fast to redeem`;
    //   text = text.replace('-', '');
    // } else if (this.state.wallet > 0 && this.state.wallet >= 500) {
    //   //  text = `You could redeem your wallet`
    // }
    return (
      <CommonScreen
        title={'My Wallet'}
        loading={this.state.loading}
        enabelWithScroll={false}
        header={<LeftHeaders title={'My Wallet'} showBack />}
        headerDis={0.15}
        bodyDis={0.85}
        body={
          <>
            {this.state.loading ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  flex: 1,
                }}>
                <ActivityIndicator />
              </View>
            ) : (
              <View style={{flex: 1}}>
                <Card
                  elevation={2}
                  style={{
                    flex: 0.3,
                    marginVertical: sizeHeight(2),
                    marginHorizontal: sizeWidth(4),
                    backgroundColor: 'white',
                    borderRadius: 8,
                  }}>
                  <View
                    style={{
                      marginVertical: sizeHeight(0.5),
                      paddingVertical: sizeHeight(2),
                      paddingHorizontal: sizeWidth(1),
                    }}>
                    <Title style={styles.title1}> {'Available Balance'}</Title>
                    <View
                      style={{
                        marginVertical: sizeHeight(3),
                        alignContents: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // backgroundColor: Colors.teal200,
                        borderColor: 'transparent',
                        //borderRadius: 96 / 2, width: 96, height: 96, borderWidth: 0,
                        alignSelf: 'center',
                        flexDirection: 'row',
                      }}>
                      {/* <Icons name='wallet' size={36} color={Colors.red200} /> */}
                      <Subtitle
                        styleName="wrap"
                        style={{
                          justifyContent: 'center',
                          fontSize: 20,
                          fontFamily: 'Rubik',
                          letterSpacing: 1,
                          color: '#292929',
                          fontWeight: '700',
                        }}>{`₹${this.state.wallet}`}</Subtitle>
                    </View>
                    {/* {text !== '' ? (
                      <View style={{marginVertical: sizeHeight(1)}}>
                        <Caption
                          style={{
                            fontSize: 14,
                            color: '#757575',
                            marginHorizontal: sizeWidth(3),
                          }}>
                          {text}
                        </Caption>
                      </View>
                    ) : null} */}
                  </View>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      const {wallet, sendData} = this.state;
                      if (Number(wallet) > 0) {
                        NavigationActions.navigate('Redeem', {
                          wallet: wallet,
                          sendData: sendData,
                        });
                      } else {
                        Helper.showToastMessage('Balance is low', 0);
                      }
                    }}>
                    <View
                      style={{
                        backgroundColor: Pref.RED,
                        paddingVertical: 10,
                        borderBottomRightRadius: 8,
                        borderBottomLeftRadius: 8,
                        borderBottomEndRadius: 8,
                        borderBottomStartRadius: 8,
                      }}>
                      <Caption
                        style={{
                          fontSize: 16,
                          color: 'white',
                          justifyContent: 'center',
                          padding: 4,
                          alignSelf: 'center',
                        }}>{`Claim Now`}</Caption>
                    </View>
                  </TouchableWithoutFeedback>
                </Card>
                <View style={{marginTop: 36, flex: 0.7}}>
                  <Title style={styles.title1}> {'Earning History'}</Title>
                  {this.state.dataList.length > 0 ? (
                    <CommonTable
                      dataList={this.state.dataList}
                      widthArr={this.state.widthArr}
                      tableHead={this.state.tableHead}
                    />
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignContents: 'center',
                        color: '#767676',
                      }}>
                      <ListError subtitle={'No transaction history found...'} />
                    </View>
                  )}
                </View>
              </View>
            )}
          </>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 14,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'center',
    fontWeight: '400',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'flex-start',
    fontWeight: '700',
  },
  viewBox: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    width: '100%',
    padding: 10,
    alignItems: 'center',
    height: 150,
  },
  slider: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink',
  },
  dotContainer: {
    backgroundColor: 'transparent',
  },
  title1: {
    fontSize: 16,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'flex-start',
    fontWeight: '700',
    marginHorizontal: sizeWidth(3),
  },
});
