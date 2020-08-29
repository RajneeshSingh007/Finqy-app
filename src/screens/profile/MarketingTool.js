import React from 'react';
import {StyleSheet, FlatList, TouchableWithoutFeedback} from 'react-native';
import {Image, Subtitle, Title, View} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {Card, Colors, ActivityIndicator} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import {sizeHeight, sizeWidth} from '../../util/Size';
import Lodash from 'lodash';
import CommonScreen from '../common/CommonScreen';
import LeftHeaders from '../common/CommonLeftHeader';
import ListError from '../common/ListError';
import IconChooser from '../common/IconChooser';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import Loader from '../../util/Loader';

export default class MarketingTool extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderItems = this.renderItems.bind(this);
    this.state = {
      loading: false,
      bannerList: [],
      token: '',
      type: -1,
      fullLoader: false,
      utype: '',
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      console.log('Marketing');
      Pref.getVal(Pref.userData, (parseda) => {
        Pref.getVal(Pref.saveToken, (value) => {
          this.setState({
            token: value,
            userdata: parseda,
            type: 1,
          });
          if (this.state.bannerList.length === 0) {
            this.fetchData(1, parseda);
          }
        });
      });
      Pref.getVal(Pref.USERTYPE, (v) => {
        this.setState({utype: v});
      });
    });
  }

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  fetchData = (type, parseda) => {
    this.setState({loading: true});
    const {rname, rcontact, id} = parseda;
    const body = JSON.stringify({
      offer_type: `${type}`,
      rname: `${rname}`,
      rcontact: `${rcontact}`,
      id: `${id}`,
    });

    Helper.networkHelperTokenPost(
      Pref.OffersUrl,
      body,
      Pref.methodPost,
      this.state.token,
      (result) => {
        const {data, response_header} = result;
        const {res_type} = response_header;
        if (res_type === 'success') {
          this.setState({
            loading: false,
            bannerList: data,
            type: type,
          });
        } else {
          this.setState({loading: false});
        }
      },
      (error) => {
        console.log('error', error);
        this.setState({loading: false});
      },
    );
  };

  shareOffer = (id, image, index) => {
    this.setState({fullLoader: true});
    Helper.networkHelperGet(
      `https://erb.ai/corporate_tool/Apis/getbase64.php?url=${image}`,
      (result) => {
        this.setState({fullLoader: false});
        this.shareofers(id, result);
      },
      (error) => {
        this.setState({fullLoader: false});
        this.shareofers(id, '');
      },
    );
  };

  shareofers = (id, result) => {
    const url = `${result}`;
    const title = '';
    //const message = `https://erb.ai/corporate_tool/refer_offer.php?offer_id=${id}`;
    const message = ``;
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

  renderItems(item, index) {
    //console.log(item.image);
    return (
      <Card
        elevation={2}
        style={{
          flex: this.state.bannerList.length % 2 > 0 ? 0.5 : 1,
          backgroundColor: 'white',
          marginVertical: sizeHeight(1.5),
          marginStart: 4,
          marginEnd: 4,
          paddingBottom: sizeHeight(1),
        }}>
        <TouchableWithoutFeedback
          onPress={() =>
            NavigationActions.navigate('OffersDetails', {
              item: item,
              type: this.state.type,
            })
          }>
          <View style={{width: '100%', height: 200}}>
            <Image
              styleName="fill-parent"
              source={{
                uri: `${item.image}`,
              }}
            />
          </View>
        </TouchableWithoutFeedback>
        <Title
          styleName="wrap"
          style={{
            marginTop: 8,
            fontSize: 15,
            fontFamily: 'Rubik',
            letterSpacing: 1,
            color: 'black',
            alignSelf: 'flex-start',
            fontWeight: 'bold',
            marginStart: 16,
          }}>
          {Lodash.truncate(`${item.header}`, {
            length: 16,
            separator: '...',
          })}
        </Title>
        <Subtitle
          style={{
            fontSize: 14,
            fontFamily: 'Rubik',
            color: '#292929',
            alignSelf: 'flex-start',
            marginStart: 16,
            letterSpacing: 0.5,
          }}>{`Validity ${item.valid_date}`}</Subtitle>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginStart: 16,
            paddingVertical: 8,
          }}>
          <TouchableWithoutFeedback
            onPress={() => Helper.downloadFile(`${item.image}`, item.header)}>
            <View>
              <IconChooser
                name="download"
                size={24}
                color={Colors.lightBlue500}
                iconType={1}
              />
            </View>
          </TouchableWithoutFeedback>
          <View style={{marginHorizontal: 8}}></View>
          <TouchableWithoutFeedback
            onPress={() =>
              this.shareOffer(item.user_id, `${item.image}`, index)
            }>
            <View>
              <IconChooser
                name="whatsapp"
                size={24}
                color={Colors.green400}
                iconType={2}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Card>
    );
  }

  render() {
    const {type} = this.state;
    return (
      <CommonScreen
        title={'My Offers'}
        loading={this.state.loading}
        enabelWithScroll={false}
        header={
          <LeftHeaders
            title={
              type === 1
                ? 'My Marketing Tool'
                : type === 3
                ? `Erb Popular Plan`
                : `My Offers`
            }
            showBack
          />
        }
        headerDis={0.13}
        bodyDis={0.87}
        showAbsolute={this.state.fullLoader}
        absoluteBody={
          <>
            <Loader isShow={this.state.fullLoader} />
          </>
        }
        body={
          <>
            <View
              style={{
                marginVertical: sizeHeight(1),
                flex: 1,
                height: '100%',
              }}>
              {this.state.loading ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignSelf: 'center',
                    flex: 1,
                  }}>
                  <ActivityIndicator />
                </View>
              ) : this.state.bannerList.length > 0 ? (
                <FlatList
                  style={{marginHorizontal: sizeWidth(2)}}
                  numColumns={2}
                  data={this.state.bannerList}
                  renderItem={({item, index}) => this.renderItems(item, index)}
                  keyExtractor={(item, index) => `${index}`}
                  showsVerticalScrollIndicator={true}
                  showsHorizontalScrollIndicator={false}
                  extraData={this.state}
                />
              ) : (
                <ListError subtitle={'No offers found...'} url={''} />
              )}
            </View>
          </>
        }
      />
    );
  }
}
