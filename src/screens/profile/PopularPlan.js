import React from 'react';
import {
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import {Title, View, Subtitle} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {ActivityIndicator} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import {sizeWidth, sizeHeight} from '../../util/Size';
import LeftHeaders from '../common/CommonLeftHeader';
import ListError from '../common/ListError';
import Share from 'react-native-share';
import Loader from '../../util/Loader';
import OfferItem from '../component/OfferItem';
import CScreen from '../component/CScreen';
import IconChooser from '../common/IconChooser';
import Lodash from 'lodash';

export default class PopularPlan extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      bannerList: [],
      cloneList: [],
      token: '',
      type: -1,
      fullLoader: false,
      utype: '',
      showFilter: false,
      height: 0,
      productList: Helper.productShareList(),
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.USERTYPE, v => {
        this.setState({utype: v});
        Pref.getVal(Pref.userData, parseda => {
          Pref.getVal(Pref.saveToken, value => {
            this.setState({
              token: value,
              userdata: parseda,
              type: 3,
            });
            if (this.state.bannerList.length === 0) {
              this.fetchData(3, parseda);
            }
          });
        });  
      });
    });
  }

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  fetchData = (type, parseda) => {
    this.setState({loading: true, showFilter: false});
    const {rname, rcontact, id, username, mobile} = parseda;
    const {utype} = this.state;
    const body = JSON.stringify({
      offer_type: `${type}`,
      rname: utype === 'team' ? `${username}` : `${rname}`,
      rcontact: utype === 'team' ? `${mobile}` : `${rcontact}`,
      id: `${id}`,
      type: utype,
    });

    //console.log('body', Pref.OffersUrl, body, this.state.token);
    Helper.networkHelperTokenPost(
      Pref.OffersUrl,
      body,
      Pref.methodPost,
      this.state.token,
      result => {
        const {data, response_header} = result;
        const {res_type} = response_header;
        if (res_type === 'success') {
          const productFilter = [];
          productFilter.push('All');
          Lodash.map(data, io => {
            const trimlowercase = String(io.product)
              .trim()
              .toLowerCase();
            if (Lodash.filter(productFilter, trimlowercase).length === 0) {
              productFilter.push(trimlowercase);
            }
          });
          //console.log(productFilter);
          this.setState({
            productFilter: Lodash.uniq(productFilter),
            loading: false,
            bannerList: data,
            cloneList: data,
            type: type,
            userData: parseda,
          });
        } else {
          this.setState({loading: false, userData: parseda});
        }
      },
      error => {
        //console.log('error', error);
        this.setState({loading: false, userData: parseda});
      },
    );
  };

  shareOffer = (id, image, index, item) => {
    this.setState({fullLoader: true});
    const {userData, productList} = this.state;
    const find = Lodash.find(
      productList,
      io =>
        String(io.value).toLowerCase() === String(item.header).toLowerCase(),
    );
    if (find) {
      const {refercode} = userData;
      const finalUrl = `${find.url}?ref=${refercode}`;
      const username =
        Helper.nullCheck(userData.rname) === false
          ? userData.rname
          : userData.username;
      const mobile =
        Helper.nullCheck(userData.rcontact) === false
          ? userData.rcontact
          : userData.mobile;
      const msg = `Greetings!!\n\nPlease find the below product you\'re looking for.\n\nLink – ${finalUrl}\n\nIn case of any query please feel free to call us at ${mobile}.\n\nYours Sincerely\n\n${username}`;
      Helper.networkHelperGet(
        `${Pref.BASEImageUrl}?url=${image}`,
        result => {
          this.setState({fullLoader: false});
          this.shareofers(id, result, msg);
        },
        () => {
          this.setState({fullLoader: false});
          this.shareofers(id, '', msg);
        },
      );
    }
  };

  mailShareOffer = (id, image, index, item) => {
    const {userData, productList} = this.state;
    const find = Lodash.find(
      productList,
      io =>
        String(io.value).toLowerCase() === String(item.header).toLowerCase(),
    );
    if (find) {
      const {refercode} = userData;
      const finalUrl = `${find.url}?ref=${refercode}`;
      const username =
        Helper.nullCheck(userData.rname) === false
          ? userData.rname
          : userData.username;
      const mobile =
        Helper.nullCheck(userData.rcontact) === false
          ? userData.rcontact
          : userData.mobile;
      const msg = `Greetings!!\n\nPlease find the below product you\'re looking for.\n\nLink – ${finalUrl}\n\nIn case of any query please feel free to call us at ${mobile}.\n\nYours Sincerely\n\n${username}`;
      this.shareofers(id, '', msg);
    }
  };

  shareofers = (id, result, message = '') => {
    const url = `${result}`;
    const title = '';
    const options = Platform.select({
      ios: {
        activityItemSources: [
          {
            placeholderItem: {type: 'url', content: url},
            item: {
              default: {type: 'url', content: url},
            },
            subject: {
              default: title,
            },
            linkMetadata: {originalUrl: url, url, title},
          },
          {
            placeholderItem: {type: 'text', content: message},
            item: {
              default: {type: 'text', content: message},
              message: null, // Specify no text to share via Messages app.
            },
          },
        ],
      },
      default: {
        title,
        subject: title,
        url: url,
        message: `${message}`,
      },
    });
    Share.open(options);
  };

  onLayout = event => {
    const {width, height} = event.nativeEvent.layout;
    this.setState({height: height});
  };

  filterSelect = title => {
    const {bannerList, cloneList} = this.state;
    if (title === 'All') {
      this.setState({bannerList: cloneList, showFilter: false});
    } else {
      const filter = Lodash.filter(
        cloneList,
        io => String(io.product).toLowerCase() === title,
      );
      this.setState({bannerList: filter, showFilter: false});
    }
  };

  renderFilterItem = title => {
    return (
      <View style={{justifyContent: 'center'}}>
        <TouchableWithoutFeedback onPress={() => this.filterSelect(title)}>
          <Title
            style={StyleSheet.flatten([
              styles.passText,
              {
                color: '#555',
                fontSize: 14,
                paddingVertical: 0,
                alignSelf: 'center',
                fontWeight: '400',
                lineHeight: 20,
              },
            ])}>
            {Helper.replacetext(title)}
          </Title>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  render() {
    const {showFilter} = this.state;
    return (
      <CScreen
        refresh={() => this.fetchData(3, this.state.userData)}
        absolute={<Loader isShow={this.state.fullLoader} />}
        body={
          <>
            <LeftHeaders
              showBack
              title={'Popular Plan'}
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

            <View styleName="horizontal v-end h-end md-gutter">
              <TouchableWithoutFeedback
                onPress={() => this.setState({showFilter: !showFilter})}
                onLayout={this.onLayout}>
                <Title
                  style={StyleSheet.flatten([
                    styles.passText,
                    {
                      color: '#82b9f4',
                      fontSize: 16,
                      lineHeight: 20,
                      paddingVertical: 0,
                    },
                  ])}>
                  {`Filter by `}
                  <IconChooser
                    name={showFilter ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={'#82b9f4'}
                    style={{
                      alignSelf: 'center',
                      justifyContent: 'center',
                    }}
                  />
                </Title>
              </TouchableWithoutFeedback>
            </View>

            {showFilter ? (
              <View
                styleName="vertical md-gutter"
                style={StyleSheet.flatten([
                  styles.filtercont,
                  {
                    top: sizeHeight(14) + this.state.height,
                  },
                ])}>
                <FlatList
                  data={this.state.productFilter}
                  renderItem={({item, index}) => this.renderFilterItem(item)}
                  keyExtractor={(_item, index) => `${index}`}
                  showsVerticalScrollIndicator={true}
                  showsHorizontalScrollIndicator={false}
                  extraData={this.state}
                  style={{maxHeight: 200}}
                  nestedScrollEnabled
                  ItemSeparatorComponent={() => (
                    <View
                      style={{
                        marginVertical: 6,
                        height: 1,
                        width: '100%',
                        backgroundColor: '#e4cbcb',
                      }}></View>
                  )}
                />
              </View>
            ) : null}

            {this.state.loading ? (
              <View style={styles.loader}>
                <ActivityIndicator />
              </View>
            ) : this.state.bannerList.length > 0 ? (
              <FlatList
                style={{marginHorizontal: sizeWidth(2)}}
                data={this.state.bannerList}
                renderItem={({item, index}) => (
                  <OfferItem
                    item={item}
                    navigate={() => {
                      //                       NavigationActions.navigate('OffersDetails', {
                      //   item: item,
                      //   type: this.state.type,
                      // })
                    }}
                    sharing={() =>
                      this.shareOffer(
                        item.user_id,
                        `${item.image}`,
                        index,
                        item,
                      )
                    }
                    download={() =>
                      Helper.downloadFile(`${item.image}`, item.header)
                    }
                    mailSharing={() => {
                      this.mailShareOffer(
                        item.user_id,
                        `${item.image}`,
                        index,
                        item,
                      );
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
                <ListError subtitle={'No popular plan found...'} url={''} />
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
