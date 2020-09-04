import React from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {Image, Subtitle, Title, View} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {Card, ActivityIndicator} from 'react-native-paper';
import {sizeHeight, sizeWidth} from '../../util/Size';
import CommonScreen from '../common/CommonScreen';
import LeftHeaders from '../common/CommonLeftHeader';
import ListError from '../common/ListError';
import CScreen from '../component/CScreen';
import Lodash from 'lodash';

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
          finalData.push({data: hl, name: 'Home Insurance'});
          finalData.push({data: lap, name: 'Loan Against Property'});
          finalData.push({data: pl, name: 'Personal Insurance'});
          finalData.push({data: bl, name: 'Business Insurance'});
          finalData.push({data: al, name: 'Health Insurance'});
          finalData.push({data: cc, name: 'Credit Card'});
          finalData.push({data: fd, name: 'Fixed Deposit'});
          finalData.push({data: hi, name: 'Health Insurance'});
          finalData.push({data: is, name: 'Insurance Samadhan'});
          finalData.push({data: ic, name: 'Insure Check'});
          finalData.push({data: lcip, name: 'Life Cum Invt. Plan'});
          finalData.push({data: mi, name: 'Motor Insurance'});
          finalData.push({data: mf, name: 'Mutual Fund'});
          finalData.push({data: ti, name: 'Term Insurance'});
          finalData.push({data: vp, name: 'Vector Plus'});

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
    if (arraydata == undefined || arraydata.length === 0) {
      return null;
    }
    const size = arraydata.length;
    return (
      <View styleName="sm-gutter">
        <View styleName="vertical" style={styles.itemContainer}>
          <Image
            source={{uri: `${arraydata[size - 1]}`}}
            styleName="large"
            style={styles.image}
          />
          <Title
            styleName="v-start h-start"
            numberOfLines={1}
            style={StyleSheet.flatten([
              styles.itemtext,
              {
                marginStart: 16,
                marginEnd: 16,
                paddingVertical: 16,
              },
            ])}>
            {`${item.name}`}
          </Title>

          {size === 4 ? (
            <View
              styleName="sm-gutter"
              style={{
                paddingVertical: 24,
                marginStart: 12,
                marginEnd: 12,
              }}>
              <Title
                styleName="v-start h-start"
                numberOfLines={1}
                style={StyleSheet.flatten([
                  styles.itemtext,
                  {
                    fontSize: 14,
                    color: '#9a937a',
                    fontWeight: '400',
                  },
                ])}>
                {`Slab (0-10 Lakh) - `}
                <Title
                  styleName="v-start h-start"
                  numberOfLines={1}
                  style={StyleSheet.flatten([
                    styles.itemtext,
                    {
                      fontSize: 14,
                      color: '#0270e3',
                      fontWeight: '400',
                    },
                  ])}>{`${arraydata[0].split('_')[1]}%`}</Title>
              </Title>
              <View style={styles.line} />
              <Title
                styleName="v-start h-start"
                numberOfLines={3}
                style={StyleSheet.flatten([
                  styles.itemtext,
                  {
                    fontSize: 14,
                    color: '#9a937a',
                    fontWeight: '400',
                  },
                ])}>
                {`Slab (10-20 Lakh) - `}
                <Title
                  styleName="v-start h-start"
                  numberOfLines={1}
                  style={StyleSheet.flatten([
                    styles.itemtext,
                    {
                      fontSize: 14,
                      color: '#0270e3',
                      fontWeight: '400',
                    },
                  ])}>{`${arraydata[1].split('_')[1]}%`}</Title>
              </Title>
              <View style={styles.line} />
              <Title
                styleName="v-start h-start"
                numberOfLines={3}
                style={StyleSheet.flatten([
                  styles.itemtext,
                  {
                    fontSize: 14,
                    color: '#9a937a',
                    fontWeight: '400',
                  },
                ])}>
                {`Slab (20+ Lakh) - `}
                <Title
                  styleName="v-start h-start"
                  numberOfLines={1}
                  style={StyleSheet.flatten([
                    styles.itemtext,
                    {
                      fontSize: 14,
                      color: '#0270e3',
                      fontWeight: '400',
                    },
                  ])}>{`${arraydata[1].split('_')[1]}%`}</Title>
              </Title>
            </View>
          ) : null}
          {size === 2 ? (
            <View
              styleName="sm-gutter"
              style={{
                paddingVertical: 24,
                marginStart: 12,
                marginEnd: 12,
              }}>
              <Title
                styleName="v-start h-start"
                style={StyleSheet.flatten([
                  styles.itemtext,
                  {
                    fontSize: 14,
                    color: '#9a937a',
                    fontWeight: '400',
                  },
                ])}>
                {`Commission - `}
                <Title
                  styleName="v-start h-start"
                  style={StyleSheet.flatten([
                    styles.itemtext,
                    {
                      fontSize: 14,
                      color: '#0270e3',
                      fontWeight: '400',
                    },
                  ])}>{`${arraydata[0]}%`}</Title>
              </Title>
            </View>
          ) : null}
          {size === 3 ? (
            <View
              styleName="sm-gutter"
              style={{
                paddingVertical: 24,
                marginStart: 12,
                marginEnd: 12,
              }}>
              <Title
                styleName="v-start h-start"
                style={StyleSheet.flatten([
                  styles.itemtext,
                  {
                    fontSize: 14,
                    color: '#9a937a',
                    fontWeight: '400',
                  },
                ])}>
                {`${
                  item.name.includes('Motor')
                    ? `Comprehensive`
                    : `Commission Senior`
                } - `}
                <Title
                  styleName="v-start h-start"
                  style={StyleSheet.flatten([
                    styles.itemtext,
                    {
                      fontSize: 14,
                      color: '#0270e3',
                      fontWeight: '400',
                    },
                  ])}>{`${arraydata[0]
                  .replace('c', '')
                  .replace('a', '')
                  .replace('ua', '')}%`}</Title>
              </Title>
              <View style={styles.line} />
              <Title
                styleName="v-start h-start"
                style={StyleSheet.flatten([
                  styles.itemtext,
                  {
                    fontSize: 14,
                    color: '#9a937a',
                    fontWeight: '400',
                  },
                ])}>
                {`${
                  item.name.includes('Motor')
                    ? `Third Party`
                    : `Commission Non Senior`
                } - `}
                <Title
                  styleName="v-start h-start"
                  style={StyleSheet.flatten([
                    styles.itemtext,
                    {
                      fontSize: 14,
                      color: '#0270e3',
                      fontWeight: '400',
                    },
                  ])}>{`${arraydata[1]
                  .replace('c', '')
                  .replace('tp', '')
                  .replace('ua', '')}%`}</Title>
              </Title>
            </View>
          ) : null}
        </View>
      </View>
      // <Card
      //   elevation={2}
      //   style={{
      //     borderRadius: 8,
      //     marginVertical: sizeHeight(1.3),
      //     marginHorizontal: sizeWidth(3),
      //   }}>
      //   <View styleName="horizontal">
      //     <View style={{width: '42%', height: '100%'}}>
      //       <Image
      //         styleName="fill-parent"
      //         source={{uri: `${arraydata[size - 1]}`}}
      //         style={{height: '100%', resizeMode: 'stretch'}}
      //       />
      //     </View>
      // {size === 4 ? (
      //   <View
      //     styleName="sm-gutter"
      //     style={{
      //       marginVertical: 16,
      //       marginHorizontal: 12,
      //     }}>
      //     <Title
      //       styleName="v-start h-start"
      //       numberOfLines={1}
      //       style={{
      //         fontSize: 15,
      //         fontFamily: 'Rubik',
      //         letterSpacing: 1,
      //         color: Pref.RED,
      //         fontWeight: '700',
      //       }}>{`${item.name}`}</Title>
      //     <Subtitle
      //       styleName="v-start h-start"
      //       numberOfLines={1}
      //       style={{
      //         fontSize: 14,
      //         fontFamily: 'Rubik',
      //         color: '#292929',
      //         fontWeight: '400',
      //       }}>{`Slab (0-10 Lakh) - ${
      //       arraydata[0].split('_')[1]
      //     }%`}</Subtitle>
      //     <Subtitle
      //       styleName="v-start h-start"
      //       numberOfLines={3}
      //       style={{
      //         fontSize: 14,
      //         fontFamily: 'Rubik',
      //         color: '#292929',
      //         fontWeight: '400',
      //       }}>{`Slab (10-20 Lakh) - ${
      //       arraydata[1].split('_')[1]
      //     }%`}</Subtitle>
      //     <Subtitle
      //       styleName="v-start h-start"
      //       numberOfLines={3}
      //       style={{
      //         fontSize: 14,
      //         fontFamily: 'Rubik',
      //         color: '#292929',
      //         fontWeight: '400',
      //       }}>{`Slab (20+ Lakh) - ${
      //       arraydata[2].split('_')[1]
      //     }%`}</Subtitle>
      //   </View>
      // ) : null}
      // {size === 2 ? (
      //   <View
      //     styleName="sm-gutter"
      //     style={{
      //       marginVertical: 16,
      //       marginHorizontal: 12,
      //     }}>
      //     <Title
      //       styleName="v-start h-start"
      //       numberOfLines={1}
      //       style={{
      //         fontSize: 15,
      //         fontFamily: 'Rubik',
      //         letterSpacing: 1,
      //         color: Pref.RED,
      //         fontWeight: '700',
      //       }}>{`${item.name}`}</Title>

      //     <Subtitle
      //       styleName="v-start h-start"
      //       numberOfLines={1}
      //       style={{
      //         fontSize: 14,
      //         fontFamily: 'Rubik',
      //         color: '#292929',
      //         fontWeight: '400',
      //       }}>{`Commission - ${arraydata[0]}%`}</Subtitle>
      //     <Subtitle
      //       styleName="v-start h-start"
      //       numberOfLines={1}
      //       style={{
      //         fontSize: 14,
      //         fontFamily: 'Rubik',
      //         letterSpacing: 1,
      //         color: '#292929',
      //         fontWeight: '700',
      //       }}>{``}</Subtitle>
      //     <Subtitle
      //       styleName="v-start h-start"
      //       numberOfLines={1}
      //       style={{
      //         fontSize: 14,
      //         fontFamily: 'Rubik',
      //         letterSpacing: 1,
      //         color: '#292929',
      //         fontWeight: '700',
      //       }}>{``}</Subtitle>
      //   </View>
      // ) : null}
      // {size === 3 ? (
      //   <View
      //     styleName="sm-gutter"
      //     style={{
      //       marginVertical: 16,
      //       marginHorizontal: 12,
      //     }}>
      //     <Title
      //       styleName="v-start h-start"
      //       numberOfLines={1}
      //       style={{
      //         fontSize: 15,
      //         fontFamily: 'Rubik',
      //         letterSpacing: 1,
      //         color: Pref.RED,
      //         fontWeight: '700',
      //       }}>{`${item.name}`}</Title>

      //     <Subtitle
      //       styleName="v-start h-start"
      //       numberOfLines={1}
      //       style={{
      //         fontSize: 14,
      //         fontFamily: 'Rubik',
      //         color: '#292929',
      //         fontWeight: '400',
      //       }}>{`${
      //       item.name.includes('Motor')
      //         ? `Comprehensive`
      //         : `Commission Senior`
      //     } - ${arraydata[0]
      //       .replace('c', '')
      //       .replace('a', '')
      //       .replace('ua', '')}%`}</Subtitle>
      //     <Subtitle
      //       styleName="v-start h-start"
      //       numberOfLines={1}
      //       style={{
      //         fontSize: 14,
      //         fontFamily: 'Rubik',
      //         color: '#292929',
      //         fontWeight: '400',
      //       }}>{`${
      //       item.name.includes('Motor')
      //         ? `Third Party`
      //         : `Commission Non Senior`
      //     } - ${arraydata[1]
      //       .replace('c', '')
      //       .replace('tp', '')
      //       .replace('ua', '')}%`}</Subtitle>
      //     <Subtitle
      //       styleName="v-start h-start"
      //       numberOfLines={1}
      //       style={{
      //         fontSize: 14,
      //         fontFamily: 'Rubik',
      //         letterSpacing: 1,
      //         color: '#292929',
      //         fontWeight: '700',
      //       }}>{``}</Subtitle>
      //   </View>
      // ) : null}
      //   </View>
      // </Card>
    );
  }

  render() {
    return (
      <CScreen
        body={
          <>
            <LeftHeaders
              showBack
              title={'Payout Structure'}
              bottomtext={
                <>
                  {`Payout `}
                  <Title style={styles.passText}>{`Structure`}</Title>
                </>
              }
              bottomtextStyle={{
                color: '#555555',
                fontSize: 20,
              }}
            />
            {this.state.loading ? (
              <View style={styles.loader}>
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
              <View style={styles.emptycont}>
                <ListError subtitle={'No payout structure found...'} />
              </View>
            )}
          </>
        }
      />
      // <CommonScreen
      //   title={'Finorbit'}
      //   loading={this.state.loading}
      //   enabelWithScroll={false}
      //   header={
      //     <LeftHeaders
      //       title={'My Payout Structure'}
      //       showBack
      //       style={{marginBottom: 8}}
      //     />
      //   }
      //   headerDis={0.15}
      //   bodyDis={0.85}
      //   body={
      //     <>
      // {this.state.loading ? (
      //   <View
      //     style={{
      //       justifyContent: 'center',
      //       alignSelf: 'center',
      //       flex: 1,
      //     }}>
      //     <ActivityIndicator />
      //   </View>
      // ) : this.state.dataList.length > 0 ? (
      //   <FlatList
      //     data={this.state.dataList}
      //     renderItem={({item, index}) => this.renderItems(item)}
      //     nestedScrollEnabled={true}
      //     keyExtractor={(item, index) => `${index}`}
      //     showsVerticalScrollIndicator={true}
      //     showsHorizontalScrollIndicator={false}
      //     extraData={this.state}
      //   />
      // ) : (
      //   <View
      //     style={{
      //       flex: 0.7,
      //       justifyContent: 'center',
      //       alignItems: 'center',
      //       alignContents: 'center',
      //     }}>
      //     <ListError subtitle={'No payout structure found...'} />
      //   </View>
      // )}
      //     </>
      //   }
      // />
    );
  }
}

const styles = StyleSheet.create({
  line: {
    backgroundColor: '#dad9d3',
    height: 1,
    width: '90%',
    marginVertical:12
  },
  gap: {
    marginHorizontal: 8,
  },
  image: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 8,
    width: '90%',
    height: 156,
    resizeMode: 'stretch',
  },
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
