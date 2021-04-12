import React from 'react';
import {StyleSheet, FlatList, TouchableWithoutFeedback} from 'react-native';
import {View, Title, Subtitle} from '@shoutem/ui';
import * as Helper from '../../../util/Helper';
import * as Pref from '../../../util/Pref';
import {ActivityIndicator, Searchbar} from 'react-native-paper';
import {sizeWidth, sizeHeight} from '../../../util/Size';
import LeftHeaders from '../../common/CommonLeftHeader';
import ListError from '../../common/ListError';
import Share from 'react-native-share';
import DialerTemplate from '../../component/DialerTemplate';
import CScreen from '../../component/CScreen';
import {firebase} from '@react-native-firebase/firestore';
import Modal from '../../../util/Modal';
import IconChooser from '../../common/IconChooser';
import PaginationNumbers from './../../component/PaginationNumbers';
import CommonTable from '../../common/CommonTable';
import {disableOffline} from '../../../util/DialerFeature';

const ITEM_LIMIT = 10;

export default class TcTemplates extends React.PureComponent {
  constructor(props) {
    super(props);
    this.rendeCustomerInfo = this.rendeCustomerInfo.bind(this);
    this.state = {
      loading: true,
      templateList: [],
      cloneList: [],
      token: '',
      type: -1,
      fullLoader: false,
      utype: '',
      showFilter: false,
      height: 0,
      productList: Helper.productShareList(),
      userListModal: false,
      dataList: [],
      userLoader: true,
      shareData: {},
      itemSize: ITEM_LIMIT,
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.DIALER_DATA, (userdatas) => {
        const {id, tlid, pname} = userdatas[0].tc;
        Pref.getVal(Pref.saveToken, (token) => {
          this.setState({token: token, id: id, tlid: tlid, pname: pname});
          this.fetchData();
        });
      });
    });
  }

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
    if (this.firebaseListerner !== undefined) this.firebaseListerner.remove();
  }

  fetchData = () => {
    const pName = this.state.pname;
    const split = pName.split(/&/g);
    const userTeam = split[1];
    this.setState({loading: true});
    disableOffline();
    this.firebaseListerner = firebase
      .firestore()
      .collection(Pref.COLLECTION_TEMPLATE)
      .onSnapshot((list) => {
        const finalList = [];
        list.forEach((item) => {
          const {enabled, global, teamName} = item.data();
          if (global === 0 && enabled === 0) {
            finalList.push(item.data());
          } else if (
            global === -1 &&
            enabled === 0 &&
            Helper.nullStringCheck(teamName) == false
          ) {
            const split = teamName.split(/\(/g);
            if (userTeam === split[1].replace(/\)/g, '')) {
              finalList.push(item.data());
            }
          }
        });
        this.setState({
          templateList: finalList,
          loading: false,
          fullLoader: false,
          userListModal: false,
        });
        this.fetchCustomerData();
      })
      .catch((e) => {
        this.setState({loading: false});
      });
  };

  fetchCustomerData = () => {
    const {id, tlid, pname} = this.state;
    const body = JSON.stringify({
      teamid: tlid,
      userid: id,
      active: 1,
      tname: pname,
    });
    Helper.networkHelperTokenPost(
      Pref.DIALER_LEAD_RECORD,
      body,
      Pref.methodPost,
      this.state.token,
      (result) => {
        //console.log('result',result);
        const {data, status} = result;
        if (status) {
          if (data && data.length > 0) {
            const sorting = data.sort((a, b) => {
              const splita = a.updated_at.split(/\s/g);
              const splitb = b.updated_at.split(/\s/g);
              const sp = splita[0].split('-');
              const spz = splitb[0].split('-');
              return (
                Number(sp[2]) - Number(spz[2]) ||
                Number(sp[1]) - Number(spz[1]) ||
                Number(sp[0]) - Number(spz[0])
              );
            });
            const tableHead = [
              'Sr. No.',
              'Share',
              'Status',
              'Name',
              'Number',
              'Product',
            ];
            const {itemSize} = this.state;
            const widthArr = [60, 60, 120, 120, 110, 110];
            const sort = sorting.reverse();
            this.setState({
              cloneList: sort,
              userLoader: false,
              tableHead: tableHead,
              widthArr: widthArr,
              dataList: this.returnData(sort, 0, sort.length).slice(
                0,
                itemSize,
              ),
              itemSize: sort.length <= ITEM_LIMIT ? sort.length : ITEM_LIMIT,
            });
          } else {
            this.setState({
              userLoader: false,
            });
          }
        } else {
          this.setState({userLoader: false});
        }
      },
      (e) => {
        this.setState({userLoader: false});
      },
    );
  };

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
          if (Helper.nullCheck(item) === false) {
            const rowData = [];
            rowData.push(`${Number(i + 1)}`);
            const shareView = (value) => (
              <TouchableWithoutFeedback onPress={() => this.shareItem(value)}>
                <View>
                  <IconChooser
                    name={`share-2`}
                    size={20}
                    color={`#9f9880`}
                    style={{alignSelf: 'center'}}
                  />
                </View>
              </TouchableWithoutFeedback>
            );
            rowData.push(shareView(item));
            rowData.push(
              Number(item.tracking_type) === 0
                ? `Contactable\n${item.tracking_type_detail}`
                : `Non-Contactable\n${item.tracking_type_detail}`,
            );
            rowData.push(item.name);
            rowData.push(item.mobile);
            rowData.push(item.product);
            dataList.push(rowData);
          }
        }
      }
    }
    return dataList;
  };

  pageNumberClicked = (start, end) => {
    const {cloneList} = this.state;
    const clone = JSON.parse(JSON.stringify(cloneList));
    const data = this.returnData(clone, start, end);
    this.setState({
      dataList: data,
      itemSize: end,
    });
  };

  onChangeSearch = (query) => {
    this.setState({searchQuery: query});
    const {cloneList, itemSize} = this.state;
    if (cloneList.length > 0) {
      const trimquery = String(query).trim().toLowerCase();
      const clone = JSON.parse(JSON.stringify(cloneList));
      const result = Lodash.filter(clone, (it) => {
        const {name, mobile, product} = it;
        return (
          (name && name.trim().toLowerCase().includes(trimquery)) ||
          (mobile && mobile.trim().toLowerCase().includes(trimquery)) ||
          (product && product.trim().toLowerCase().includes(trimquery))
        );
      });
      const data =
        result.length > 0 ? this.returnData(result, 0, result.length) : [];
      const count = result.length > 0 ? result.length : itemSize;
      this.setState({dataList: data, itemSize: count});
    }
  };

  revertBack = () => {
    const {enableSearch} = this.state;
    const {cloneList} = this.state;
    if (enableSearch === true && cloneList.length > 0) {
      const clone = JSON.parse(JSON.stringify(cloneList));
      const data = this.returnData(clone, 0, ITEM_LIMIT);
      this.setState({dataList: data});
    }
    this.setState({
      searchQuery: '',
      enableSearch: !enableSearch,
      itemSize: ITEM_LIMIT,
    });
  };

  /**
   * on share clicked item
   * @param {*} item
   * @param {*} type
   */
  sharedClicked = (item, type) => {
    item.type = type;
    this.setState({shareData: item, userListModal: true});
  };

  /**
   * share template to selected customer where type = 0 then whatsapp else mail
   * @param {*} value
   */
  shareItem = (value) => {
    const {shareData} = this.state;
    const {type, title, content} = shareData;
    const {email, mobile} = value;
    if (type === 0) {
      this.shareOffer(
        title,
        content,
        Helper.nullStringCheck(email) === false ? mobile : '',
      );
    } else {
      this.mailShareOffer(
        title,
        content,
        Helper.nullStringCheck(email) === false ? email : '',
      );
    }
  };

  /**
   * share whatsapp
   * @param {*} param0
   */
  shareOffer = (title, content, mobileNo) => {
    const shareOptions = {
      title: title,
      message: content,
      url: '',
      social: Share.Social.WHATSAPP,
      whatsAppNumber: `+91${mobileNo}`,
    };
    Share.shareSingle(shareOptions);
  };

  /**
   * share mail
   * @param {*} param0
   */
  mailShareOffer = (title, content, email) => {
    const shareOptions = {
      title: title,
      message: content,
      url: '',
      social: Share.Social.EMAIL,
      subject: title,
      email: email,
    };
    Share.shareSingle(shareOptions);
  };

  rendeCustomerInfo = (item) => {
    return (
      <View styleName="horizontal space-between" style={styles.itemContainer}>
        <Title style={styles.title}>{item.name}</Title>
        <Subtitle style={styles.subtitle}>{item.mobile}</Subtitle>
        <TouchableWithoutFeedback>
          <View>
            <IconChooser name={'share'} size={20} color={'green'} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  render() {
    const {enableSearch} = this.state;
    return (
      <CScreen
        refresh={() => this.fetchData()}
        absolute={
          <>
            <Modal
              visible={this.state.userListModal}
              setModalVisible={() => this.setState({userListModal: false})}
              ratioHeight={0.8}
              backgroundColor={`white`}
              centerFlex={0.8}
              topCenterElement={
                <Subtitle
                  style={{
                    color: '#292929',
                    fontSize: 17,
                    fontWeight: '700',
                    letterSpacing: 1,
                  }}>
                  {`Select Customer`}
                </Subtitle>
              }
              children={
                <CScreen
                  showfooter={false}
                  body={
                    <View style={{marginStart: 8, marginEnd: 8}}>
                      {this.state.userLoader ? (
                        <View style={styles.loader}>
                          <ActivityIndicator />
                        </View>
                      ) : (
                        <>
                          <View styleName="horizontal md-gutter space-between">
                            <PaginationNumbers
                              dataSize={this.state.cloneList.length}
                              itemSize={this.state.itemSize}
                              itemLimit={ITEM_LIMIT}
                              pageNumberClicked={this.pageNumberClicked}
                            />

                            <TouchableWithoutFeedback onPress={this.revertBack}>
                              <View styleName="horizontal v-center h-center">
                                <IconChooser
                                  name={enableSearch ? 'x' : 'search'}
                                  size={24}
                                  color={'#555555'}
                                />
                              </View>
                            </TouchableWithoutFeedback>
                          </View>

                          {enableSearch === true ? (
                            <View styleName="md-gutter">
                              <Searchbar
                                placeholder="Search"
                                onChangeText={this.onChangeSearch}
                                value={searchQuery}
                                style={{
                                  elevation: 0,
                                  borderColor: '#dbd9cc',
                                  borderWidth: 0.5,
                                  borderRadius: 8,
                                }}
                                clearIcon={() => null}
                              />
                            </View>
                          ) : null}
                          {this.state.userLoader ? (
                            <View style={styles.loader}>
                              <ActivityIndicator />
                            </View>
                          ) : this.state.dataList.length > 0 ? (
                            <CommonTable
                              enableHeight={false}
                              dataList={this.state.dataList}
                              widthArr={this.state.widthArr}
                              tableHead={this.state.tableHead}
                            />
                          ) : (
                            <View style={styles.emptycont}>
                              <ListError subtitle={'No Records Found...'} />
                            </View>
                          )}
                        </>
                      )}
                    </View>
                  }
                />
              }
            />
          </>
        }
        body={
          <>
            <LeftHeaders
              showBack
              title={'Templates'}
              // bottomtext={
              //   <>
              //     {`FinAds `}
              //     <Title style={styles.passText}>{`Marketing`}</Title>
              //   </>
              // }
              bottomtextStyle={{
                color: '#555555',
                fontSize: 20,
              }}
            />

            {this.state.loading ? (
              <View style={styles.loader}>
                <ActivityIndicator />
              </View>
            ) : this.state.templateList.length > 0 ? (
              <FlatList
                style={{marginHorizontal: sizeWidth(2)}}
                data={this.state.templateList}
                renderItem={({item, index}) => (
                  <DialerTemplate
                    item={item}
                    sharing={() => this.sharedClicked(item, 0)}
                    mailSharing={() => this.sharedClicked(item, 1)}
                  />
                )}
                keyExtractor={(_item, index) => `${index}`}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={false}
                extraData={this.state}
              />
            ) : (
              <View style={styles.emptycont}>
                <ListError subtitle={'No templates found...'} url={''} />
              </View>
            )}
          </>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  footerCon: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  icon: {
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
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
  itemtext: {
    letterSpacing: 0.5,
    fontWeight: '700',
    lineHeight: 20,
    // alignSelf: 'center',
    // justifyContent: 'center',
    // textAlign: 'center',
    color: '#686868',
    fontSize: 16,
    marginStart: 16,
    marginEnd: 16,
    marginTop: 12,
    marginBottom: 8,
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
  itemContainer: {
    marginVertical: 10,
    borderColor: '#bcbaa1',
    borderWidth: 0.8,
    borderRadius: 16,
    marginHorizontal: 16,
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
    marginBottom: 12,
  },
  circle: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 4,
    borderRadius: 16,
    //borderColor: '#000',
    //borderStyle: 'solid',
    //borderWidth: 3,
    backgroundColor: '#1bd741',
  },
  topfilterIcon: {
    position: 'absolute',
    top: 0,
    zIndex: 99,
    right: sizeWidth(13),
    top: sizeHeight(30.2),
    backgroundColor: 'white',
  },
  filtercont: {
    position: 'absolute',
    zIndex: 99,
    borderColor: '#dbdacd',
    borderWidth: 0.8,
    backgroundColor: Pref.WHITE,
    width: '36%',
    //top:56,
    right: sizeWidth(4),
    borderRadius: 8,
    //top: sizeHeight(17),
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    }),
  },
});
