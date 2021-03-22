import React from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {View, Title, Subtitle} from '@shoutem/ui';
import * as Helper from '../../../util/Helper';
import * as Pref from '../../../util/Pref';
import {ActivityIndicator} from 'react-native-paper';
import {sizeWidth, sizeHeight} from '../../../util/Size';
import LeftHeaders from '../../common/CommonLeftHeader';
import ListError from '../../common/ListError';
import Share from 'react-native-share';
import DialerTemplate from '../../component/DialerTemplate';
import CScreen from '../../component/CScreen';
import {firebase} from '@react-native-firebase/firestore';
import Modal from '../../../util/Modal';

export default class TcTemplates extends React.PureComponent {
  constructor(props) {
    super(props);
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
      userListModal: true,
      callRecordList:[],
      userLoader:true,
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    //this.focusListener = navigation.addListener('didFocus', () => {
    Pref.getVal(Pref.saveToken, (token) => {
      this.setState({token: token});
      this.fetchData();
    });
    //});
  }

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  fetchData = () => {
    this.setState({loading: true});
    firebase
      .firestore()
      .collection(Pref.COLLECTION_TEMPLATE)
      .get()
      .then((list) => {
        const finalList = [];
        list.forEach((item) => {
          const {enabled} = item.data();
          if (enabled === 0) {
            finalList.push(item.data());
          }
        });
        this.setState({templateList: finalList, loading: false});
      })
      .catch((e) => {
        this.setState({loading: false});
      });
  };

  fetchCustomerData = () => {
    Pref.getVal(Pref.DIALER_DATA, (userdatas) => {
      const {id, tlid, pname} = userdatas[0].tc;
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
          const {data, status} = result;
          if (status) {
            if (data.length > 0) {
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
              this.setState({
                callRecordList: sorting.reverse(),
                userLoader:false
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
    });
  };

  /**
   * share whatsapp
   * @param {*} param0
   */
  shareOffer = ({title, content}) => {
    const shareOptions = {
      title: title,
      message: content,
      url: '',
      social: Share.Social.WHATSAPP,
      whatsAppNumber: '', // country code + phone number
    };
    Share.shareSingle(shareOptions);
  };

  /**
   * share mail
   * @param {*} param0
   */
  mailShareOffer = ({title, content}) => {
    const shareOptions = {
      title: title,
      message: content,
      url: '',
      social: Share.Social.EMAIL,
      subject: title,
    };
    Share.shareSingle(shareOptions);
  };

  render() {
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
                  body={<View style={{marginStart: 8, marginEnd: 8}}>
                    <FlatList
                        style={{marginHorizontal: sizeWidth(2)}}
                        data={this.state.userListModal}
                        renderItem={({item, index}) => (
                          <DialerTemplate
                            item={item}
                            sharing={() => this.shareOffer(item)}
                            mailSharing={() => {
                              this.mailShareOffer(item);
                            }}
                          />
                        )}
                        keyExtractor={(_item, index) => `${index}`}
                        showsVerticalScrollIndicator={true}
                        showsHorizontalScrollIndicator={false}
                        nestedScrollEnabled
                      />  
                  </View>}
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
                    sharing={() => this.shareOffer(item)}
                    mailSharing={() => {
                      this.mailShareOffer(item);
                    }}
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
