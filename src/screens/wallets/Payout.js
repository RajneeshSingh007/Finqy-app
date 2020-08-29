import React from 'react';
import {
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  Image,
  Subtitle,
  Title,
  View,
} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {
  Card,
  ActivityIndicator,
} from 'react-native-paper';
import {sizeHeight, sizeWidth} from '../../util/Size';
import CommonScreen from '../common/CommonScreen';
import LeftHeaders from '../common/CommonLeftHeader';
import ListError from '../common/ListError';

export default class Payout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderItems = this.renderItems.bind(this);
    this.state = {
      dataList: [],
      loading: false,
      showCalendar: false,
      dates: '',
      token: '',
      userData: '',
      categoryList: [],
      cloneList: [],
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({loading: true});
    });
    this.focusListener = navigation.addListener("didFocus", () => {
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

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  fetchData = () => {
    this.setState({loading: true});
    const {userData} = this.state;
    const {id} = userData;
    const body = JSON.stringify({refercode: id});
    Helper.networkHelperTokenPost(
      Pref.PayoutUrl,
      body,
      Pref.methodPost,
      this.state.token,
      (result) => {
        console.log(`result`, result);
        const {data, response_header} = result;
        const {res_type} = response_header;
        if (res_type === `success`) {
          const {
            hl,
            lap,
            pl,
            bl,
            al,
            cc,
            fd,
            hi,
            is,
            ic,
            lcip,
            mi,
            mf,
            ti,
            vp,
          } = data;
          const finalData = [];
          finalData.push({data: hl,name:'Home Insurance'});
          finalData.push({data: lap, name: 'Loan Against Property'});
          finalData.push({data: pl,name:'Personal Insurance'});
          finalData.push({data: bl,name:'Business Insurance'});
          finalData.push({data: al,name:'Health Insurance'});
          finalData.push({data: cc,name:'Credit Card'});
          finalData.push({data: fd,name:'Fixed Deposit'});
          finalData.push({data: hi,name:'Health Insurance'});
          finalData.push({data: is,name:'Insurance Samadhan'});
          finalData.push({data: ic,name:'Insure Check'});
          finalData.push({data: lcip,name:'Life Cum Invt. Plan'});
          finalData.push({data: mi,name:'Motor Insurance'});
          finalData.push({data: mf,name:'Mutual Fund'});
          finalData.push({data: ti,name:'Term Insurance'});
          finalData.push({data: vp,name:'Vector Plus'});

          this.setState({
            cloneList: data,
            dataList: finalData,
            loading: false,
          });
        } else {
          this.setState({loading: false});
        }
      },
      () => {
        this.setState({loading: false});
      },
    );
  };

  /**
   *
   * @param {*} item
   * @param {*} index
   */
  renderItems(item) {
    const arraydata = item.data;
    if(arraydata == undefined || arraydata.length === 0){
      return null
    }
    const size = arraydata.length;
    return (
      <Card
        elevation={2}
        style={{
          borderRadius: 8,
          marginVertical: sizeHeight(1.3),
          marginHorizontal: sizeWidth(3),
        }}>
        <View styleName="horizontal">
          <View style={{width: '42%', height: '100%'}}>
            <Image
              styleName="fill-parent"
              source={{uri: `${arraydata[size - 1]}`}}
              style={{height: '100%', resizeMode: 'stretch'}}
            />
          </View>
          {size === 4 ? (
            <View
              styleName="sm-gutter"
              style={{
                marginVertical: 16,
                marginHorizontal: 12,
              }}>
              <Title
                styleName="v-start h-start"
                numberOfLines={1}
                style={{
                  fontSize: 15,
                  fontFamily: 'Rubik',
                  letterSpacing: 1,
                  color: Pref.RED,
                  fontWeight: '700',
                }}>{`${item.name}`}</Title>
              <Subtitle
                styleName="v-start h-start"
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  fontFamily: 'Rubik',
                  color: '#292929',
                  fontWeight: '400',
                }}>{`Slab (0-10 Lakh) - ${
                arraydata[0].split('_')[1]
              }%`}</Subtitle>
              <Subtitle
                styleName="v-start h-start"
                numberOfLines={3}
                style={{
                  fontSize: 14,
                  fontFamily: 'Rubik',
                  color: '#292929',
                  fontWeight: '400',
                }}>{`Slab (10-20 Lakh) - ${
                arraydata[1].split('_')[1]
              }%`}</Subtitle>
              <Subtitle
                styleName="v-start h-start"
                numberOfLines={3}
                style={{
                  fontSize: 14,
                  fontFamily: 'Rubik',
                  color: '#292929',
                  fontWeight: '400',
                }}>{`Slab (20+ Lakh) - ${
                arraydata[2].split('_')[1]
              }%`}</Subtitle>
            </View>
          ) : null}
          {size === 2 ? (
            <View
              styleName="sm-gutter"
              style={{
                marginVertical: 16,
                marginHorizontal: 12,
              }}>
              <Title
                styleName="v-start h-start"
                numberOfLines={1}
                style={{
                  fontSize: 15,
                  fontFamily: 'Rubik',
                  letterSpacing: 1,
                  color: Pref.RED,
                  fontWeight: '700',
                }}>{`${item.name}`}</Title>

              <Subtitle
                styleName="v-start h-start"
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  fontFamily: 'Rubik',
                  color: '#292929',
                  fontWeight: '400',
                }}>{`Commission - ${arraydata[0]}%`}</Subtitle>
              <Subtitle
                styleName="v-start h-start"
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  fontFamily: 'Rubik',
                  letterSpacing: 1,
                  color: '#292929',
                  fontWeight: '700',
                }}>{``}</Subtitle>
              <Subtitle
                styleName="v-start h-start"
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  fontFamily: 'Rubik',
                  letterSpacing: 1,
                  color: '#292929',
                  fontWeight: '700',
                }}>{``}</Subtitle>
            </View>
          ) : null}
          {size === 3 ? (
            <View
              styleName="sm-gutter"
              style={{
                marginVertical: 16,
                marginHorizontal: 12,
              }}>
              <Title
                styleName="v-start h-start"
                numberOfLines={1}
                style={{
                  fontSize: 15,
                  fontFamily: 'Rubik',
                  letterSpacing: 1,
                  color: Pref.RED,
                  fontWeight: '700',
                }}>{`${item.name}`}</Title>

              <Subtitle
                styleName="v-start h-start"
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  fontFamily: 'Rubik',
                  color: '#292929',
                  fontWeight: '400',
                }}>{`${
                item.name.includes('Motor')
                  ? `Comprehensive`
                  : `Commission Senior`
              } - ${arraydata[0]
                .replace('c', '')
                .replace('a', '')
                .replace('ua', '')}%`}</Subtitle>
              <Subtitle
                styleName="v-start h-start"
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  fontFamily: 'Rubik',
                  color: '#292929',
                  fontWeight: '400',
                }}>{`${
                item.name.includes('Motor')
                  ? `Third Party`
                  : `Commission Non Senior`
              } - ${arraydata[1]
                .replace('c', '')
                .replace('tp', '')
                .replace('ua', '')}%`}</Subtitle>
              <Subtitle
                styleName="v-start h-start"
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  fontFamily: 'Rubik',
                  letterSpacing: 1,
                  color: '#292929',
                  fontWeight: '700',
                }}>{``}</Subtitle>
            </View>
          ) : null}
        </View>
      </Card>
    );
  }

  render() {
    return (
      <CommonScreen
        title={'Finorbit'}
        loading={this.state.loading}
        enabelWithScroll={false}
        header={
          <LeftHeaders
            title={'My Payout Structure'}
            showBack
            style={{marginBottom: 8}}
          />
        }
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
            ) : this.state.dataList.length > 0 ? (
              <FlatList
                data={this.state.dataList}
                renderItem={({item, index}) => this.renderItems(item)}
                nestedScrollEnabled={true}
                keyExtractor={(item, index) => `${index}`}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={false}
                extraData={this.state}
              />
            ) : (
              <View
                style={{
                  flex: 0.7,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContents: 'center',
                }}>
                <ListError subtitle={'No payout structure found...'} />
              </View>
            )}
          </>
        }
      />
    );
  }
}


