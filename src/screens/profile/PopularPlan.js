import React from 'react';
import { StyleSheet, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Image, Title, View } from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import { ActivityIndicator } from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import { sizeWidth } from '../../util/Size';
import Lodash from 'lodash';
import LeftHeaders from '../common/CommonLeftHeader';
import ListError from '../common/ListError';
import moment from 'moment';
import IconChooser from '../common/IconChooser';
import Share from 'react-native-share';
import Loader from '../../util/Loader';
import CScreen from '../component/CScreen';
import OfferItem from '../component/OfferItem';

export default class PopularPlan extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      bannerList: [],
      token: '',
      type: -1,
      fullLoader: false,
      utype: '',
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.userData, (parseda) => {
        Pref.getVal(Pref.saveToken, (value) => {
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
      Pref.getVal(Pref.USERTYPE, (v) => {
        this.setState({ utype: v });
      });
    });
  }

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  fetchData = (type, parseda) => {
    this.setState({ loading: true });
    const { rname, rcontact, id, username, mobile } = parseda;
    const { utype } = this.state;
    const body = JSON.stringify({
      offer_type: `${type}`,
      rname: utype === 'team' ? `${username}` : `${rname}`,
      rcontact: utype === 'team' ? `${mobile}` : `${rcontact}`,
      id: `${id}`,
      type: utype
    });

    Helper.networkHelperTokenPost(
      Pref.OffersUrl,
      body,
      Pref.methodPost,
      this.state.token,
      (result) => {
        const { data, response_header } = result;
        const { res_type } = response_header;
        if (res_type === 'success') {
          this.setState({
            loading: false,
            bannerList: data,
            type: type,
          });
        } else {
          this.setState({ loading: false });
        }
      },
      () => {
        this.setState({ loading: false });
      },
    );
  };

  shareOffer = (id, image) => {
    this.setState({ fullLoader: true });
    Helper.networkHelperGet(
      `${Pref.BASEImageUrl}?url=${image}`,
      (result) => {
        this.setState({ fullLoader: false });
        this.shareofers(id, result);
      },
      () => {
        this.setState({ fullLoader: false });
        this.shareofers(id, '');
      },
    );
  };

  shareofers = (_id, result) => {
    const url = `${result}`;
    const title = '';
    //const message = `https://erb.ai/corporate_tool/refer_offer.php?offer_id=${id}`;
    const message = ``;
    const options = Platform.select({
      ios: {
        activityItemSources: [
          {
            placeholderItem: { type: 'url', content: url },
            item: {
              default: { type: 'url', content: url },
            },
            subject: {
              default: title,
            },
            linkMetadata: { originalUrl: url, url, title },
          },
          {
            placeholderItem: { type: 'text', content: message },
            item: {
              default: { type: 'text', content: message },
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

  render() {
    return (
      <CScreen
        absolute={<Loader isShow={this.state.fullLoader} />}
        body={
          <>
            <LeftHeaders
              showBack
              title={'Popular Plan'}
              // bottomtext={
              //   <>
              //     {`Popular `}
              //     <Title style={styles.passText}>{`Plan`}</Title>
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
            ) : this.state.bannerList.length > 0 ? (
              <FlatList
                style={{ marginHorizontal: sizeWidth(2) }}
                data={this.state.bannerList}
                renderItem={({ item, index }) => (
                  <OfferItem
                    item={item}
                    navigate={() =>
                      NavigationActions.navigate('OffersDetails', {
                        item: item,
                        type: this.state.type,
                      })
                    }
                    sharing={() =>
                      this.shareOffer(item.user_id, `${item.image}`, index)
                    }
                    download={() =>
                      Helper.downloadFile(`${item.image}`, item.header)
                    }
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
});
