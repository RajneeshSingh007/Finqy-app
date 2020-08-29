import {Subtitle, Title, View} from '@shoutem/ui';
import React from 'react';
import {StyleSheet, BackHandler, Dimensions} from 'react-native';
import {Colors, Card} from 'react-native-paper';
import * as Helper from '../../util/Helper';
import {sizeHeight, sizeWidth} from '../../util/Size';
import NavigationActions from '../../util/NavigationActions';
import CommonScreen from '../common/CommonScreen';
import BannerCard from '../common/BannerCard';
import LeftHeaders from '../common/CommonLeftHeader';
import * as Pref from '../../util/Pref';
import {PieChart} from 'react-native-chart-kit';

import CardVertical from '../common/CardVertical';

const data = [
  {
    name: 'Link Sourcing',
    population: 10,
    color: Colors.green400,
    legendFontColor: '#7F7F7F',
    legendFontSize: 14,
  },
  {
    name: 'Self Sourcing',
    population: 20,
    color: Colors.blue400,
    legendFontColor: '#7F7F7F',
    legendFontSize: 14,
  },
];

const data1 = [
  {
    name: 'Pending Confirmation',
    population: 8,
    color: Colors.indigo400,
    legendFontColor: '#7F7F7F',
    legendFontSize: 14,
  },
  {
    name: 'Quote Sent',
    population: 10,
    color: Colors.lightGreen400,
    legendFontColor: '#7F7F7F',
    legendFontSize: 14,
  },
  {
    name: 'Payment Link Sent',
    population: 4,
    color: Colors.brown400,
    legendFontColor: '#7F7F7F',
    legendFontSize: 14,
  },
];

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, 0.5)`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: true, // optional
};

const screenWidth = Dimensions.get('window').width;

export default class HomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.backClick = this.backClick.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.crousel = React.createRef();
    this.appluclickedButton = this.appluclickedButton.bind(this);
    this.state = {
      loading: false,
      progressloader: false,
      dataList: [],
      bannerList: [],
      showRefDialog: false,
      userData: {},
      pageIndex: 0,
      showNotification: false,
      noteContent: '',
      leadcount: 0,
      token: '',
    };
    Pref.getVal(Pref.initial, (value) => {
      const check = Helper.removeQuotes(value);
      this.setState({showRefDialog: check === '' || check === null});
    });
    Pref.getVal(Pref.userData, (value) => {
      if (value !== undefined && value !== null) {
        this.setState({userData: value});
      }
    });
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backClick);
    try {
      Helper.requestPermissions();
    } catch (e) {
      // console.log(e);
    }
    const {navigation} = this.props;
    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({loading: false});
    });
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.saveToken, (value) => {
        //console.log(`value`, value)
        if (value === undefined || value === null) {
          const body = JSON.stringify({
            username: `ERBFinPro`,
            product: `FinPro App`,
          });
          Helper.networkHelper(
            Pref.GetToken,
            body,
            Pref.methodPost,
            (result) => {
              const {data, response_header} = result;
              const {res_type} = response_header;
              if (res_type === `success`) {
                this.setState({token: Helper.removeQuotes(data)});
                Pref.setVal(Pref.saveToken, Helper.removeQuotes(data));
              }
            },
            () => {
              //console.log(`error`, error)
            },
          );
        } else {
          this.setState({token: value});
        }
      });
      // const banndata = new FormData();
      // banndata.append('mode', 0);

      // Helper.networkHelperContentType(Pref.BannerUrl, banndata, Pref.methodPost, datax => {
      //     if (!datax.error) {
      //         const { data } = datax;
      //         this.setState({ bannerList: data })
      //     }
      // }, error => {
      // });
    });
    // this._notificationEvent = PushNotificationAndroid.addEventListener(
    //     "notification",
    //     details => {
    //         PushNotificationAndroid.notify(details);
    //         this.setState({ noteContent:'You got 500₹ in your wallet'})
    //     }
    // );

    // Pref.getVal(Pref.userID, userID =>{
    //     const id = Helper.removeQuotes(userID);
    //     console.log('id', id);
    //     if (id !== ''){
    //         Helper.networkHelper(Pref.FetchAccountUrl, JSON.stringify({
    //             userid: id,
    //             mode:'0'
    //         }), Pref.methodPost, value => {
    //             //console.log('value', value);
    //             if(!value.error){
    //                 Pref.setVal(Pref.userData, value);
    //                 this.setState({ userData:value});
    //             }else{
    //                 NavigationActions.navigate('Login')
    //             }
    //         }, error => {

    //         });

    //         const datess = new Date();
    //         //datess.setFullYear(2020,2,16);
    //         const date = moment(datess).format('DD/MM/YYYY');
    //         const leadData = new FormData();
    //         const oldDate = new Date();
    //         oldDate.setFullYear(2020,1,10);
    //         const oldDatex = moment(oldDate).format('DD/MM/YYYY');

    //         leadData.append('uni', id);
    //         leadData.append('date', oldDatex);
    //         leadData.append('frdate', date)

    //         Helper.networkHelperContentType(Pref.FetchLeadsUrl, leadData,Pref.methodPost, result =>{
    //             if(!result.error){
    //                 const { data, leadcount} = result;
    //                 if(data.length > 5){
    //                     data.length = 5;
    //                 }
    //                 this.setState({ dataList: data, leadcount: leadcount});
    //             }
    //         }, error =>{
    //             this.setState({ dataList: [], leadcount: 0});
    //         })
    //     }else{
    //         NavigationActions.navigate('Login')
    //     }
    // })

    // this.unsubscribe = firestore().collection('refreshApp').doc('finrefCode')
    //     .onSnapshot({
    //         error: (e) => console.error(e),
    //         next: (documentSnapshot) => {
    //             console.log('ckcck');
    //         },
    //     });
  }

  backClick = () => {
    if (this.state.showRefDialog) {
      this.setState({showRefDialog: false});
      Pref.setVal(Pref.initial, '0');
      return true;
    } else if (this.state.showNotification) {
      this.setState({showNotification: false});
      return true;
    }
    return false;
  };

  componentWillUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  /**
   *
   * @param {*} item
   * @param {*} index
   */
  renderItems(item, index) {
    const count = index + 1;
    return (
      <View
        styleName="horizontal"
        style={{
          marginVertical: sizeHeight(1),
          justifyContent: 'space-between',
          paddingVertical: sizeHeight(0.5),
          flex: 1,
          flexDirection: 'row',
        }}>
        <Title
          styleName="v-start h-start"
          style={{
            marginStart: 16,
            fontSize: 15,
            fontFamily: 'Rubik',
            color: '#292929',
            padding: 4,
            fontWeight: '700',
            flex: 0.2,
          }}>
          {count + '. '}
        </Title>
        <Subtitle
          styleName="v-start h-start"
          numberOfLines={1}
          style={{
            fontSize: 15,
            fontFamily: 'Rubik',
            color: '#292929',
            padding: 4,
            fontWeight: '400',
            flex: 0.4,
          }}>
          {item.customer_name}
        </Subtitle>
        <Subtitle
          styleName="v-start h-start"
          numberOfLines={1}
          style={{
            marginEnd: 16,
            fontSize: 15,
            fontFamily: 'Rubik',
            color: '#292929',
            padding: 4,
            fontWeight: '400',
            flex: 0.4,
          }}>
          {item.status}
        </Subtitle>
      </View>
    );
  }

  appluclickedButton = () => {};

  _renderItem = () => {
    //bannerList
    //`${Pref.FOLDERPATH}${item.url}`
    return (
      <BannerCard
        url={{
          uri: `https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTAUcHhG-sD8AZ3foP2ho4DubmgCLKT5xtu4nWXkN6thZW0OPiK&usqp=CAU`,
        }}
      />
    );
  };

  render() {
    return (
      <CommonScreen
        title={'Hello, Rajneesh'}
        loading={false}
        showAbsolute={false}
        absoluteBody={
          <>
            {/* {this.state.showRefDialog ? <RefDialog isShow={this.state.showRefDialog}  clickedcallback={() =>{
                            this.setState({showRefDialog:false});
                            Pref.setVal(Pref.initial, '0');
                        }}/> : null} */}
            {/* {this.state.showNotification ? <NotifyDialog isShow={true} clickedcallback={() => {
                            this.setState({showNotification:false})
                        }} noteContent={this.state.noteContent} /> : null} */}
          </>
        }
        body={
          <>
            <LeftHeaders
              backicon={`align-left`}
              backClicked={() => NavigationActions.openDrawer()}
              showBack
              url={require('../../res/images/logo.png')}
              showAvtar
              //showBottom
              title={`${
                this.state.userData !== undefined &&
                this.state.userData.rname !== undefined
                  ? `Hi, ${this.state.userData.rname}`
                  : 'Hi'
              }`}
              style={{marginBottom: 8}}
              // bottomClicked={() => this.setState({showNotification:true})}
            />

            <CardVertical
              url={''}
              title={''}
              subtitle={'Sourcing Chart'}
              subtitleColor={'#292929'}
              innerstyle={{paddingTop: 8}}
              bottom={
                <View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      height: 200,
                    }}>
                    <View style={{flex: 0.2}}></View>
                    <View style={{flex: 0.6}}>
                      <PieChart
                        data={data}
                        width={screenWidth}
                        height={200}
                        chartConfig={chartConfig}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="5"
                        hasLegend={false}
                        //absolute
                      />
                    </View>
                    <View style={{flex: 0.2}}></View>
                  </View>
                  <View
                    styleName="horizontal wrap"
                    style={{flex: 1, flexDirection: 'column', paddingBottom: 6,flexGrow:1}}>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center'}}>
                      <Subtitle
                        styleName="v-center h-center"
                        style={{
                          fontSize: 13,
                          fontFamily: 'Rubik',
                          letterSpacing: 1,
                          color: '#292929',
                          fontWeight: '400',
                          alignSelf: 'center',
                        }}>
                        {`Link Sourcing(${`85%`})`}
                      </Subtitle>
                      <View
                        styleName="v-center h-center"
                        style={{
                          backgroundColor: Colors.green500,
                          height: 12,
                          width: 24,
                          alignSelf: 'center',
                          marginStart: 8,
                        }}></View>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center'}}>
                      <Subtitle
                        styleName="v-center h-center"
                        style={{
                          fontSize: 13,
                          fontFamily: 'Rubik',
                          letterSpacing: 1,
                          color: '#292929',
                          fontWeight: '400',
                          alignSelf: 'center',
                        }}>
                        {`Self Sourcing(${`15%`})`}
                      </Subtitle>
                      <View
                        styleName="v-center h-center"
                        style={{
                          backgroundColor: Colors.blue500,
                          height: 12,
                          width: 24,
                          alignSelf: 'center',
                          marginStart: 8,
                        }}></View>
                    </View>
                    <View style={{flex: 0.1}}></View>
                  </View>
                </View>
              }
            />

            <CardVertical
              url={''}
              title={''}
              subtitle={'Status Chart'}
              subtitleColor={'#292929'}
              innerstyle={{paddingTop: 8}}
              bottom={
                <View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      height: 200,
                    }}>
                    <View style={{flex: 0.2}}></View>
                    <View style={{flex: 0.6}}>
                      <PieChart
                        data={data1}
                        width={screenWidth}
                        height={200}
                        chartConfig={chartConfig}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="5"
                        hasLegend={false}
                        //absolute
                      />
                    </View>
                    <View style={{flex: 0.2}}></View>
                  </View>
                  <View
                    styleName="horizontal wrap"
                    style={{flex: 1, flexDirection: 'row', paddingBottom: 6,flexGrow:1}}>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center'}}>
                      <Subtitle
                        styleName="v-center h-center"
                        style={{
                          fontSize: 13,
                          fontFamily: 'Rubik',
                          letterSpacing: 1,
                          color: '#292929',
                          fontWeight: '400',
                          alignSelf: 'center',
                        }}>
                        {`Pending Confirmation(${`55%`})`}
                      </Subtitle>
                      <View
                        styleName="v-center h-center"
                        style={{
                          backgroundColor: Colors.green500,
                          height: 12,
                          width: 24,
                          alignSelf: 'center',
                          marginStart: 8,
                        }}></View>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center',marginEnd:8}}>
                      <Subtitle
                        styleName="v-center h-center"
                        style={{
                          fontSize: 13,
                          fontFamily: 'Rubik',
                          letterSpacing: 1,
                          color: '#292929',
                          fontWeight: '400',
                          alignSelf: 'center',
                        }}>
                        {`Quote Sent(${`25%`})`}
                      </Subtitle>
                      <View
                        styleName="v-center h-center"
                        style={{
                          backgroundColor: Colors.blue500,
                          height: 12,
                          width: 24,
                          alignSelf: 'center',
                          marginStart: 8,
                        }}></View>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center'}}>
                      <Subtitle
                        styleName="v-center h-center"
                        style={{
                          fontSize: 13,
                          fontFamily: 'Rubik',
                          letterSpacing: 1,
                          color: '#292929',
                          fontWeight: '400',
                          alignSelf: 'center',
                        }}>
                        {`Payment Link Sent(${`20%`})`}
                      </Subtitle>
                      <View
                        styleName="v-center h-center"
                        style={{
                          backgroundColor: Colors.blue500,
                          height: 12,
                          width: 24,
                          alignSelf: 'center',
                          marginStart: 8,
                        }}></View>
                    </View>
                  </View>
                </View>
              }
            />

            {/* {this.state.bannerList.length > 0 ? <View>
                            <Carousel
                                ref={this.crousel}
                                data={this.state.bannerList}
                                renderItem={this._renderItem}
                                sliderWidth={sizeWidth(100)}
                                itemWidth={sizeWidth(100)}
                                autoplay
                                enableSnap
                                loop
                                inactiveSlideScale={0.95}
                                inactiveSlideOpacity={0.8}
                                scrollEnabled
                                shouldOptimizeUpdates
                                layout={'stack'}
                                onSnapToItem={(slideIndex => this.setState({ pageIndex: slideIndex }))}
                                onBeforeSnapToItem={(slideIndex => this.setState({ pageIndex: slideIndex }))}
                                containerCustomStyle={{ marginTop: sizeHeight(0.5) }}
                            />
                            <Pagination
                                carouselRef={this.crousel}
                                dotColor={Pref.PRIMARY_COLOR}
                                dotsLength={this.state.bannerList.length}
                                inactiveDotColor={Colors.grey300}
                                inactiveDotScale={1}
                                tappableDots
                                activeDotIndex={this.state.pageIndex}
                                containerStyle={{ marginTop: -16, marginBottom: -20 }}
                            />
                        </View> : null}

                                            
                        <CircularCardLeft 
                            showProgress
                            color={Pref.JET_BLACK}
                            title={`Total Lead`}
                            subtitle={`Your leads so far`}
                            progress={Number(this.state.leadcount)}
                            progressTitle={'Total'}
                            titleColor={'#292929'}
                            subtitleColor={'#292929'}
                        />

                        <CardRow
                            color={Pref.JET_BLACK}
                            clickName={'FinorbitScreen'}
                            title={'Apply for a Loan'}
                            subtitle={'Apply for a loan'}
                            url={require('../../res/images/businessloan.png')}
                            titleColor={'#292929'}
                            subtitleColor={'#292929'}
                            //titleColor={Pref.WHITE}
                            //subtitleColor={Pref.WHITE}
                        />

                        <CardRow
                            color={Pref.JET_BLACK}
                            clickName={'FinorbitScreen'}
                            title={'Apply for a Insurance'}
                            subtitle={'Apply for a insurance'}
                            url={require('../../res/images/trending.png')}
                            titleColor={'#292929'}
                            subtitleColor={'#292929'}
                            //titleColor={Pref.WHITE}
                            //subtitleColor={Pref.WHITE}
                            //item={{ title: 'Fixed Loan', url: require('../../res/images/demat.png') }}
                        /> */}

            {/* {this.state.dataList.length > 0 ? <Card style={{ flex: 1,marginTop:sizeHeight(1) }}>
                            <View style={{ marginVertical: sizeHeight(0.5), paddingVertical: sizeHeight(2), paddingHorizontal: sizeWidth(1) }}>
                                <Title style={styles.title1}> {'Recent Lead'}</Title>

                                <PlaceholderLoader
                                    visibilty={this.state.progressloader}
                                    children={
                                        <View style={{ flex: 1, marginVertical: 0 }}>
                                            <View style={{ backgroundColor: Pref.WHITE_LINEN, paddingVertical: sizeHeight(1.5), justifyContent: 'space-around', alignItems: 'center', alignContents: 'center', flexDirection: 'row', marginTop: 16,flex:1,width:sizeWidth(100)}}>
                                                <Subtitle styleName='v-start h-start' style={{
                                                    marginStart: 16,
                                                    fontSize: 15, fontFamily: 'Rubik', letterSpacing: 1, color: '#292929', fontWeight: '700', flex: 0.2
                                                }}> {'Sr No.'}</Subtitle>
                                                <Subtitle styleName='v-start h-start' style={{
                                                    fontSize: 15, fontFamily: 'Rubik', letterSpacing: 1, color: '#292929', fontWeight: '700', flex: 0.4
                                                }}> {'Name'}</Subtitle>
                                                <Subtitle styleName='v-start h-start' style={{
                                                    marginEnd: 16,
                                                    fontSize: 15, fontFamily: 'Rubik', letterSpacing: 1, color: '#292929', fontWeight: '700', flex: 0.4
                                                }}> {'Status'}</Subtitle>
                                            </View>

                                            <FlatList
                                                data={this.state.dataList}
                                                renderItem={({ item, index }) => this.renderItems(item, index)}
                                                nestedScrollEnabled={true}
                                                keyExtractor={(item, index) => index.toString()}
                                                showsVerticalScrollIndicator={true}
                                                showsHorizontalScrollIndicator={false}
                                                extraData={this.state}
                                                ItemSeparatorComponent={() => {
                                                    return <View backgroundColor={Colors.grey300} style={{ height: 0.6 }} />
                                                }}
                                            />
                                        </View>
                                    }
                                />
                            </View>
                        </Card> : null}
                         */}

            {/* <Card style={{ flex: 1, marginVertical: sizeHeight(3) }}>
                            <View style={{ paddingVertical: sizeHeight(2), paddingHorizontal: sizeWidth(1) }}>
                                <Title style={styles.title1}> {'View More'}</Title>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, paddingVertical: 8 }}>
                                <TouchableWithoutFeedback onPress={() => NavigationActions.navigate('MyOffers')}>
                                <View style={{ flex: 0.3,paddingVertical:4 }}>
                                    <View style={styles.circle}>
                                            <Icon name={"gift"} size={24} color={Colors.red400} style={{ alignSelf: 'center' }} />
                                    </View>
                                    <Subtitle style={styles.subtitle}>{`My Offers`}</Subtitle>
                                </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => NavigationActions.navigate('MyWallet')}>
                                    <View style={{ flex: 0.3, paddingVertical: 4 }}>
                                        <View style={styles.circle}>
                                            <Icons name={"wallet"} size={24} color={Colors.red400} style={{ alignSelf: 'center' }} />
                                        </View>
                                        <Subtitle style={styles.subtitle}>{`My Wallets`}</Subtitle>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => NavigationActions.navigate('ReferEarn')}>
                                    <View style={{ flex: 0.3, paddingVertical: 4 }}>
                                        <View style={styles.circle}>
                                            <Icons name={"rupee-sign"} size={24} color={Colors.red400} style={{ alignSelf: 'center' }} />
                                        </View>
                                        <Subtitle style={styles.subtitle}>{`Refer & Earn`}</Subtitle>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </Card> */}
          </>
        }
      />
    );
  }
}
