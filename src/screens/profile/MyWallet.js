import React from 'react';
import {
  StyleSheet,
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
  ActivityIndicator,
} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import {sizeHeight, sizeWidth} from '../../util/Size';
import LeftHeaders from '../common/CommonLeftHeader';
import ListError from '../common/ListError';
import CommonTable from '../common/CommonTable';
import CScreen from '../component/CScreen';

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
      itemSize: 6,
      disableNext: false,
      disableBack: false,
      searchQuery: '',
      cloneList: [],
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({loading: true, dataList: []});
    });
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.userData, (userData) => {
        this.setState({userData: userData});
        Pref.getVal(Pref.saveToken, (value) => {
          this.setState({token: value}, () => {
            this.fetchData();
          });
        });
      });
    });
  }

  fetchData = () => {
    this.setState({loading: true});
    const {refercode} = this.state.userData;
    const body = JSON.stringify({
      user_id: refercode,
    });
    Helper.networkHelperTokenPost(
      Pref.WalletUrl,
      body,
      Pref.methodPost,
      this.state.token,
      (result) => {
        const {data, response_header} = result;
        const {res_type} = response_header;
        if (res_type === `success`) {
          const {earning_history} = data;
          if (earning_history.length > 0) {
            const sorting = earning_history.sort((a, b) => {
              const sp = a.approve_date.split('-');
              const spz = b.approve_date.split('-');
              return sp[2] - spz[2] || sp[1] - spz[1] || sp[0] - spz[0];
            });
            const sort = sorting.reverse();
            const {itemSize} = this.state;
            this.setState({
              wallet: data.total_wallet_amount,
              cloneList: sort,
              dataList: this.returnData(sort, 0, sort.length).slice(
                0,
                itemSize,
              ),
              loading: false,
              itemSize: sort.length > 6 ? 6 : sort.length,
            });
          } else {
            this.setState({
              wallet: 0,
              dataList: [],
              loading: false,
            });
          }
        } else {
          this.setState({loading: false});
        }
      },
      () => {
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
      () => {},
    );
  };

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  /**
   *
   * @param {*} data
   */
  returnData = (sort, start = 0, end) => {
    const dataList = [];
    if (sort.length > 0) {
      if (start >= 0) {
        for (let i = start; i < end; i++) {
          const item = sort[i];
          if (item !== undefined && item !== null) {
            const rowData = [];
            rowData.push(`${i + 1}`);
            rowData.push(item.product === `Redeem Request` ? '' : item.leadno);
            rowData.push(item.customer_name);
            rowData.push(item.product);
            rowData.push(item.approve_date);
            rowData.push(item.earning);
            rowData.push(item.earn_percentage);
            rowData.push(item.amount);
            rowData.push(item.inv_no === 'null' ? '' : item.inv_no);
            dataList.push(rowData);
          }
        }
      }
    }
    return dataList;
  };

  /**
   *
   * @param {*} mode true ? next : back
   */
  pagination = (mode) => {
    const {itemSize, cloneList} = this.state;
    let clone = JSON.parse(JSON.stringify(cloneList));
    let plus = itemSize;
    let slicedArray = [];
    if (mode) {
      plus += 6;
      if (itemSize < clone.length) {
        if (plus > clone.length) {
          const rem = clone.length - itemSize;
          plus = itemSize + rem;
        }
        slicedArray = this.returnData(clone, itemSize, plus);
        this.setState({dataList: slicedArray, itemSize: plus});
      }
    } else {
      if (itemSize <= 6) {
        plus = 0;
      } else {
        plus -= 6;
      }
      if (plus >= 0 && plus < clone.length) {
        slicedArray = this.returnData(clone, plus, itemSize);
        this.setState({dataList: slicedArray, itemSize: plus});
      }
    }
  };

  claimAmt = () => {
    const {wallet, sendData} = this.state;
    if (Number(wallet) > 0) {
      NavigationActions.navigate('Redeem', {
        wallet: wallet,
        sendData: sendData,
      });
    } else {
      Helper.showToastMessage('Balance is low', 0);
    }
  };

  render() {
    return (
      <CScreen
        body={
          <>
            <LeftHeaders title={'Earning History'} showBack />
            <View styleName="horizontal md-gutter space-between v-center">
              <View styleName="horizontal">
                <TouchableWithoutFeedback
                  onPress={() => this.pagination(false)}>
                  <Title style={styles.itemtopText}>{`Back`}</Title>
                </TouchableWithoutFeedback>
                <View
                  style={{
                    height: 16,
                    marginHorizontal: 12,
                    backgroundColor: '#0270e3',
                    width: 1.5,
                  }}
                />
                <TouchableWithoutFeedback onPress={() => this.pagination(true)}>
                  <Title style={styles.itemtopText}>{`Next`}</Title>
                </TouchableWithoutFeedback>
              </View>
              <Title
                style={StyleSheet.flatten([
                  styles.itemtopText,
                  {
                    color: '#555555',
                    fontSize: 20,
                    lineHeight: 36,
                  },
                ])}>{`₹ ${this.state.wallet} /-`}</Title>
              <Button
                style={styles.loginButtonStyle}
                uppercase={false}
                onPress={this.claimAmt}>
                <Title style={styles.btnText}>{`Claim`}</Title>
              </Button>
            </View>
            {this.state.loading ? (
              <View style={styles.loader}>
                <ActivityIndicator />
              </View>
            ) : this.state.dataList.length > 0 ? (
              <CommonTable
                dataList={this.state.dataList}
                widthArr={this.state.widthArr}
                tableHead={this.state.tableHead}
              />
            ) : (
              <View style={styles.emptycont}>
                <ListError subtitle={'No transactions found...'} />
              </View>
            )}

            {this.state.dataList.length > 0 ? (
              <>
                <Title style={styles.itemtext}>{`Showing ${
                  this.state.itemSize
                }/${Number(this.state.cloneList.length)} entries`}</Title>
              </>
            ) : null}
          </>
        }
      />
      // <CommonScreen
      //   title={'My Wallet'}
      //   loading={this.state.loading}
      //   enabelWithScroll={false}
      //   header={<LeftHeaders title={'My Wallet'} showBack />}
      //   headerDis={0.15}
      //   bodyDis={0.85}
      //   body={
      //     <>
      //       {this.state.loading ? (
      //         <View
      //           style={{
      //             justifyContent: 'center',
      //             alignSelf: 'center',
      //             flex: 1,
      //           }}>
      //           <ActivityIndicator />
      //         </View>
      //       ) : (
      //         <View style={{flex: 1}}>
      //           <Card
      //             elevation={2}
      //             style={{
      //               flex: 0.3,
      //               marginVertical: sizeHeight(2),
      //               marginHorizontal: sizeWidth(4),
      //               backgroundColor: 'white',
      //               borderRadius: 8,
      //             }}>
      //             <View
      //               style={{
      //                 marginVertical: sizeHeight(0.5),
      //                 paddingVertical: sizeHeight(2),
      //                 paddingHorizontal: sizeWidth(1),
      //               }}>
      //               <Title style={styles.title1}> {'Available Balance'}</Title>
      //               <View
      //                 style={{
      //                   marginVertical: sizeHeight(3),
      //                   alignContents: 'center',
      //                   alignItems: 'center',
      //                   justifyContent: 'center',
      //                   // backgroundColor: Colors.teal200,
      //                   borderColor: 'transparent',
      //                   //borderRadius: 96 / 2, width: 96, height: 96, borderWidth: 0,
      //                   alignSelf: 'center',
      //                   flexDirection: 'row',
      //                 }}>
      //                 {/* <Icons name='wallet' size={36} color={Colors.red200} /> */}
      //                 <Subtitle
      //                   styleName="wrap"
      //                   style={{
      //                     justifyContent: 'center',
      //                     fontSize: 20,
      //                     fontFamily: 'Rubik',
      //                     letterSpacing: 1,
      //                     color: '#292929',
      //                     fontWeight: '700',
      //                   }}>{`₹${this.state.wallet}`}</Subtitle>
      //               </View>
      //               {/* {text !== '' ? (
      //                 <View style={{marginVertical: sizeHeight(1)}}>
      //                   <Caption
      //                     style={{
      //                       fontSize: 14,
      //                       color: '#757575',
      //                       marginHorizontal: sizeWidth(3),
      //                     }}>
      //                     {text}
      //                   </Caption>
      //                 </View>
      //               ) : null} */}
      //             </View>
      //             <TouchableWithoutFeedback
      //               onPress={() => {
      // const {wallet, sendData} = this.state;
      // if (Number(wallet) > 0) {
      //   NavigationActions.navigate('Redeem', {
      //     wallet: wallet,
      //     sendData: sendData,
      //   });
      // } else {
      //   Helper.showToastMessage('Balance is low', 0);
      // }
      //               }}>
      //               <View
      //                 style={{
      //                   backgroundColor: Pref.RED,
      //                   paddingVertical: 10,
      //                   borderBottomRightRadius: 8,
      //                   borderBottomLeftRadius: 8,
      //                   borderBottomEndRadius: 8,
      //                   borderBottomStartRadius: 8,
      //                 }}>
      //                 <Caption
      //                   style={{
      //                     fontSize: 16,
      //                     color: 'white',
      //                     justifyContent: 'center',
      //                     padding: 4,
      //                     alignSelf: 'center',
      //                   }}>{`Claim Now`}</Caption>
      //               </View>
      //             </TouchableWithoutFeedback>
      //           </Card>
      //           <View style={{marginTop: 36, flex: 0.7}}>
      //             <Title style={styles.title1}> {'Earning History'}</Title>
      // {this.state.dataList.length > 0 ? (
      //   <CommonTable
      //     dataList={this.state.dataList}
      //     widthArr={this.state.widthArr}
      //     tableHead={this.state.tableHead}
      //   />
      // ) : (
      //   <View
      //     style={{
      //       flex: 1,
      //       justifyContent: 'center',
      //       alignItems: 'center',
      //       alignContents: 'center',
      //       color: '#767676',
      //     }}>
      //     <ListError subtitle={'No transaction history found...'} />
      //   </View>
      // )}
      //           </View>
      //         </View>
      //       )}
      //     </>
      //   }
      // />
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
  button: {
    color: 'white',
    paddingVertical: sizeHeight(0.5),
    marginTop: 24,
    marginHorizontal: 24,
    backgroundColor: '#e21226',
    textAlign: 'center',
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 1,
  },
  emptycont: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginVertical: 48,
    paddingVertical: 56,
  },
  loader: {
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 1,
    marginVertical: 48,
    paddingVertical: 48,
  },
  itemtext: {
    letterSpacing: 0.5,
    fontWeight: '700',
    lineHeight: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#0270e3',
    fontSize: 14,
    paddingVertical: 16,
    marginTop: 4,
  },
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
  loginButtonStyle: {
    color: 'white',
    backgroundColor: '#0270e3',
    textAlign: 'center',
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 0.5,
    borderRadius: 24,
    width: '26%',
    fontWeight: '700',
  },
  btnText: {
    letterSpacing: 0.5,
    fontWeight: '400',
    lineHeight: 16,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
  },
});
