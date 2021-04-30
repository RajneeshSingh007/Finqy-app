import {Title, View, Image} from '@shoutem/ui';
import React from 'react';
import {
  StyleSheet,
  Platform,
  Pressable,
} from 'react-native';
import * as Helper from '../../util/Helper';
import {sizeWidth, sizeHeight} from '../../util/Size';
import NavigationActions from '../../util/NavigationActions';
import * as Pref from '../../util/Pref';
import CScreen from '../component/CScreen';
import Lodash from 'lodash';
import IconChooser from '../common/IconChooser';
import RectRoundBtn from '../component/RectRoundBtn';
import LinearGradient from 'react-native-linear-gradient';
import YoutubePlayer from 'react-native-youtube-iframe';
import {ActivityIndicator} from 'react-native-paper';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import HomeTopBar from '../common/HomeTopBar';
import {firebase} from '@react-native-firebase/firestore';
import {disableOffline} from '../../util/DialerFeature';

export default class NewHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.navigateToPage = this.navigateToPage.bind(this);
    this.state = {
      loading: false,
      userData: null,
      token: '',
      type: '',
      videoData: [],
      bannerData: [],
      testimonialData: [],
      marketingImagesData: [],
      currentTestimonialIndex: 0,
      videoActiveIndex: 0,
      bannerActiveIndex: 0,
      alertMessage: '',
      alertType: -1,
      dialerActive: false,
    };

    Pref.getVal(Pref.userData, (value) => {
      if (value !== undefined && value !== null) {
        this.setState({userData: value});
      }
    });
    Pref.getVal(Pref.USERTYPE, (v) => {
      this.setState({type: v});
    });
  }

  componentDidMount() {
    try {
      Helper.requestPermissions();
    } catch (e) {
      // //console.log(e);
    }
    const {navigation} = this.props;
    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({loading: false});
    });
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.saveToken, (value) => {
        if (Helper.nullStringCheck(value) === true) {
          Helper.networkHelper(
            Pref.GetToken,
            Pref.API_TOKEN_POST_DATA,
            Pref.methodPost,
            (result) => {
              const {data, response_header} = result;
              const {res_type} = response_header;
              if (res_type === `success`) {
                const parseToken = Helper.removeQuotes(data);
                Pref.setVal(Pref.saveToken, parseToken);
                this.setState({token: parseToken});
                this.fetchAll(parseToken);
              }
            },
            (error) => {
              //console.log(`error`, error)
            },
          );
        } else {
          this.setState({token: value});
          this.fetchAll(value);
        }
      });
    });
  }

  componentWillUnmount() {
    if (
      this.firebaseListerner !== undefined &&
      this.firebaseListerner != null &&
      this.firebaseListerner.remove
    ) {
      this.firebaseListerner.remove();
    }
  }

  fetchAll = (value) => {
    this.fetchDashboard(value, '');
    this.fetchMarketingImages(value);
    this.fetchBannerVideoTestiData(value);
    const {type} = this.state;

    if (Helper.nullStringCheck(type) === false && type === 'team') {
      this.checkDialerFeatures();
    }
  };

  checkDialerFeatures = () => {
    const {userData} = this.state;
    const {leader} = userData;
    const leaderData = leader[0];
    const {id} = leaderData;
    const loggedMemberId = userData.id;
    disableOffline();
    this.firebaseListerner = firebase
      .firestore()
      .collection(Pref.COLLECTION_PARENT)
      .doc(id)
      .onSnapshot((documentSnapshot) => {
        if (documentSnapshot.exists) {
          const {role, teamlist} = documentSnapshot.data();
          if (role === 0) {
            let existence = false;
            const dialerData = [];
            for (let j = 0; j < teamlist.length; j++) {
              const {memberlist, tllist, name} = teamlist[j];

              let membererlist = '';

              let find = undefined;

              if (memberlist) {
                Lodash.map(memberlist, (io) => {
                  if (io.enabled === 0 && io.id === Number(loggedMemberId)) {
                    find = io;
                    membererlist += `${io.id},`;
                  } else if (io.enabled === 0) {
                    membererlist += `${io.id},`;
                  }
                });
              }

              if (membererlist !== '') {
                const lastpos = membererlist[membererlist.length - 1];

                if (lastpos === ',') {
                  membererlist = membererlist.substr(
                    0,
                    membererlist.length - 1,
                  );
                }
              }

              const tlfind = tllist
                ? Lodash.find(
                    tllist,
                    (io) =>
                      io.enabled === 0 && io.id === Number(loggedMemberId),
                  )
                : undefined;

              if (find || tlfind) {
                existence = true;
                if (Helper.nullCheck(find) === false && tllist) {
                  let tLfind = Lodash.find(tllist, (io) => io.enabled === 0);
                  find.tlid = tllist.length > 0 ? tLfind.id : {};
                  find.pname =
                    tllist.length > 0
                      ? `${tLfind.id}&${name}&${membererlist}`
                      : '';
                }
                dialerData.push({
                  tl: tlfind,
                  tc: find,
                });
              }
            }
            if (existence) {
              Pref.setVal(Pref.DIALER_DATA, dialerData);
              this.setState({dialerActive: true});
            }
          }
        }
      });
  };

  fetchDashboard = (token, filterdates = '') => {
    const {refercode, id} = this.state.userData;
    const body = JSON.stringify({
      user_id: refercode,
      flag: this.state.type === 'referral' ? 2 : 1,
      date_range: filterdates,
    });
    //fetch dashboard data
    Helper.networkHelperTokenPost(
      Pref.NewDashBoardUrl,
      body,
      Pref.methodPost,
      token,
      (result) => {},
      (error) => {
        //console.log(error);
      },
    );
  };

  fetchMarketingImages = (parseToken) => {
    const {type, userData} = this.state;
    const {rname, rcontact, id, username, mobile} = userData;
    const body = JSON.stringify({
      offer_type: '1',
      rname: type === 'team' ? `${username}` : `${rname}`,
      rcontact: type === 'team' ? `${mobile}` : `${rcontact}`,
      id: `${id}`,
      type: type,
    });
    Helper.networkHelperTokenPost(
      Pref.OffersUrl,
      body,
      Pref.methodPost,
      parseToken,
      (result) => {
        const {data, response_header} = result;
        const {res_type} = response_header;
        if (res_type === 'success') {
          if (data.length > 0) {
            this.setState({marketingImagesData: data});
          }
        }
      },
      (error) => {
        //console.log('error', error);
        this.setState({loading: false});
      },
    );
  };

  fetchBannerVideoTestiData = (parseToken) => {
    Helper.networkHelperToken(
      Pref.HomeUrl,
      Pref.methodGet,
      parseToken,
      (result) => {
        const {status, data} = result;
        if (status) {
          const {banner, testi, video} = data;
          this.setState({
            bannerData: banner,
            testimonialData: testi,
            videoData: video,
          });
        }
      },
      (error) => {
        this.setState({loading: false});
      },
    );
  };

  renderTopbar = () => {
    return <HomeTopBar />;

    return (
      <View
        styleName="horizontal space-between wrap md-gutter"
        style={styles.toolbarheight}>
        <View styleName="horizontal v-center" style={{flex: 0.5}}>
          <Pressable onPress={() => NavigationActions.openDrawer()}>
            <IconChooser name={'menu'} color={'#292929'} size={38} />
          </Pressable>
          <Image
            styleName="v-center h-center"
            source={require('../../res/images/q.png')}
            style={styles.applogo}
          />
        </View>
        <View
          styleName="horizontal v-center"
          style={{flex: 0.5, justifyContent: 'flex-end'}}>
          <RectRoundBtn
            child={<IconChooser name={'user'} color={'#292929'} size={20} />}
            onPress={() => {
              console.log('clicked');
            }}
          />

          <RectRoundBtn
            styleName={'horizontal v-center h-center'}
            child={<IconChooser name={'bell'} color={'#292929'} size={20} />}
            onPress={() => {
              console.log('bell');
            }}
            bottomChild={
              <View
                style={styles.counter}
                styleName="vertical v-center h-center">
                <Title
                  style={{
                    color: 'white',
                    fontSize: 12,
                    fontFamily: Pref.getFontName(3),
                  }}>
                  {'1'}
                </Title>
              </View>
            }
            style={{
              marginEnd: 4,
            }}
          />
        </View>
      </View>
    );
  };

  renderBanner = () => {
    const {bannerData, bannerActiveIndex} = this.state;
    return (
      <>
        <Carousel
          ref={(c) => {
            this._carousel1 = c;
          }}
          data={bannerData}
          renderItem={({item, index}) => {
            return (
              <View styleName="md-gutter" style={styles.bannerView}>
                <Image
                  source={{
                    uri: item.banner,
                  }}
                  style={styles.bannerImg}
                />
              </View>
            );
          }}
          sliderWidth={sizeWidth(100)}
          itemWidth={sizeWidth(96)}
          autoplay
          loop
          autoplayInterval={2000}
          onSnapToItem={(val) => this.setState({bannerActiveIndex: val})}
        />
        <Pagination
          carouselRef={this._carousel1}
          dotsLength={bannerData.length}
          activeDotIndex={bannerActiveIndex}
          dotStyle={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#0270e3',
          }}
          inactiveDotStyle={{
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
          inactiveDotOpacity={0.5}
          inactiveDotScale={0.7}
          tappableDots={false}
          containerStyle={{
            marginTop: -sizeHeight(8),
          }}
        />
      </>
    );
  };

  /**
   * render manage item
   * @param {*} onPress
   * @param {*} centerImage
   * @param {*} title
   * @returns
   */
  renderManageItem = (onPress, centerImage, title) => {
    return (
      <Pressable
        onPress={() => {
          onPress();
        }}>
        <LinearGradient
          colors={['#fafafa', '#fafafa', '#fafafa']}
          style={styles.manageitemcontainer}>
          <View style={styles.manageimage} styleName="v-center h-center">
            <Image
              source={centerImage}
              style={{
                width: 30,
                height: 30,
                alignSelf: 'center',
                resizeMode: 'contain',
              }}
            />
            <Title style={styles.managetitle}>{title}</Title>
          </View>
        </LinearGradient>
      </Pressable>
    );
  };

  renderManage = () => {
    return (
      <View>
        <Title style={styles.headings}>{'Manage'}</Title>
        <View styleName="horizontal" style={styles.manage}>
          {this.renderManageItem(
            () => this.navigateToPage('FinorbitScreen'),
            require('../../res/images/home/newlead.png'),
            'New Lead',
          )}
          {this.renderManageItem(
            () => this.navigateToPage('LeadList', {name: 'Q-Leads'}),
            require('../../res/images/home/mylead.png'),
            'Q-Leads',
          )}
          {this.renderManageItem(
            () => this.navigateToPage('MyWallet'),
            require('../../res/images/home/qwallet.png'),
            'Q-Wallet',
          )}
          {this.renderManageItem(
            () => this.navigateToPage('ViewTeam', {name: 'View Team'}),
            require('../../res/images/home/myteam.png'),
            'My Team',
          )}
        </View>
      </View>
    );
  };

  renderVideos = () => {
    const {videoData, videoActiveIndex} = this.state;
    return (
      <>
        <Carousel
          ref={(c) => {
            this._carousel = c;
          }}
          data={videoData}
          renderItem={({item, index}) => {
            return (
              <LinearGradient
                colors={['#eeeeee', '#eeeeee', '#f5f5f5']}
                style={styles.videoscontainer}>
                <YoutubePlayer
                  height={200}
                  width={sizeWidth(94)}
                  videoId={item.id}
                  allowWebViewZoom={false}
                />
              </LinearGradient>
            );
          }}
          sliderWidth={sizeWidth(96)}
          itemWidth={sizeWidth(94)}
          autoplay
          loop
          onSnapToItem={(val) => this.setState({videoActiveIndex: val})}
        />
        <Pagination
          carouselRef={this._carousel}
          dotsLength={videoData.length}
          activeDotIndex={videoActiveIndex}
          dotStyle={styles.dotsyle}
          inactiveDotStyle={styles.inactivedot}
          inactiveDotOpacity={0.5}
          inactiveDotScale={0.7}
          tappableDots={false}
          containerStyle={{
            marginTop: -sizeHeight(5.5),
          }}
        />
      </>
    );
  };

  /**
   * render product item
   * @param {*} onPress
   * @param {*} centerImage
   * @param {*} title
   * @returns
   */
  renderProductItem = (onPress, centerImage, title, color = Pref.RED) => {
    return (
      <Pressable
        onPress={() => {
          onPress();
        }}>
        <LinearGradient colors={[color, color, color]} style={styles.products}>
          <View
            style={styles.productscontain}
            styleName="v-center h-center space-between">
            <View></View>
            <View></View>
            <Image source={centerImage} style={styles.productimage} />
            <Title style={styles.producttitle}>{title}</Title>
            <View></View>
          </View>
        </LinearGradient>
      </Pressable>
    );
  };

  renderProduct = () => {
    return (
      <View
        styleName="horizontal space-between"
        style={styles.productcontainer}>
        {this.renderProductItem(
          () => this.showAlert('Coming Soon!', 0),
          require('../../res/images/home/tmp.png'),
          'Test My Policy',
          '#eb1d27',
        )}
        {this.renderProductItem(
          () => this.showAlert('Coming Soon!', 0),
          require('../../res/images/home/tml.png'),
          'Test My Loan',
          '#292929',
        )}
        {this.renderProductItem(
          () => this.showAlert('Coming Soon!', 0),
          require('../../res/images/home/policysave.png'),
          'Policy Safe',
          '#eb1d27',
        )}
      </View>
    );
  };

  /**
   * render quick item
   * @param {*} onPress
   * @param {*} centerImage
   * @param {*} title
   * @returns
   */
  renderQuickItem = (onPress, centerImage, title) => {
    return (
      <Pressable
        onPress={() => {
          onPress();
        }}>
        <View styleName="v-center h-center" style={styles.quickitemcontainers}>
          <LinearGradient
            colors={['#fafafa', '#fafafa', '#fafafa']}
            style={styles.quickitem}>
            <View style={styles.quickitemimag} styleName="v-center h-center">
              <Image source={centerImage} style={styles.quickitemimages} />
            </View>
          </LinearGradient>
          <Title style={styles.quickitemtitle}>{title}</Title>
        </View>
      </Pressable>
    );
  };

  navigateToPage = (title, options = {}) => {
    NavigationActions.navigate(title, options);
  };

  dialerClick = () => {
    const {dialerActive} = this.state;
    if (dialerActive) {
      this.navigateToPage('SwitchUser');
    } else {
      this.showAlert(
        'You do not have permission, Please contact administrator',
        1,
      );
    }
  };

  renderQuickLinks = () => {
    return (
      <View
        style={{
          marginVertical: 12,
        }}>
        <Title
          style={{
            color: '#292929',
            fontSize: 16,
            fontFamily: Pref.getFontName(4),
            letterSpacing: 0.5,
            marginTop: 16,
            marginStart: 16,
            marginBottom: 0,
          }}>
          {'Quick Links'}
        </Title>
        <View
          styleName="horizontal space-between"
          style={{flex: 12, marginStart: 4, marginEnd: 4, marginTop: 16}}>
          {this.renderQuickItem(
            () => this.dialerClick(),
            require('../../res/images/home/dialer.png'),
            'Dialer',
          )}
          {this.renderQuickItem(
            () => this.navigateToPage('MarketingTool', {name: 'Q-Marketing'}),
            require('../../res/images/home/mark.png'),
            'Q-Marketing',
          )}
          {this.renderQuickItem(
            () =>
              this.navigateToPage('LinkSharingOption', {name: 'Link Sharing'}),
            require('../../res/images/home/qlinks.png'),
            'Link-Share',
          )}
          {this.renderQuickItem(
            () => this.navigateToPage('Blogs', {name: 'Q-News'}),
            require('../../res/images/home/qnews.png'),
            'Q-News',
          )}
        </View>
        <View
          styleName="horizontal space-between"
          style={{flex: 12, marginStart: 4, marginEnd: 4, marginTop: 24}}>
          {this.renderQuickItem(
            () => this.navigateToPage('Dashboard'),
            require('../../res/images/home/dashboard.png'),
            'Dashboard',
          )}
          {this.renderQuickItem(
            () => this.showAlert('Coming Soon!', 1),
            require('../../res/images/home/calculator.png'),
            'Calculator',
          )}
          {this.renderQuickItem(
            () => this.navigateToPage('MyOffers', {name: 'Q-Offers'}),
            require('../../res/images/home/offers.png'),
            'Q-Offers',
          )}
          {this.renderQuickItem(
            () => this.navigateToPage('Payout', {name: 'Payout Structure'}),
            require('../../res/images/home/pay.png'),
            'Payout Structure',
          )}
        </View>
      </View>
    );
  };

  /**
   * render Testimonials item
   * @param {*} onPress
   * @param {*} centerImage
   * @param {*} title
   * @returns
   */
  renderTestimonialsItem = (title, name) => {
    return (
      <LinearGradient
        colors={['#eeeeee', '#ffffff', '#ffffff']}
        style={styles.testiContainers}
        useAngle
        angle={45}>
        <View
          style={styles.testiinsidecontainer}
          styleName="space-between v-center h-center wrap">
          <Title numberOfLines={5} style={styles.testitext}>
            {title}
          </Title>
        </View>

        <View
          style={styles.testitextcontainer}
          styleName="space-between v-center h-center">
          <Title numberOfLines={1} style={styles.testitextauthor}>
            {name}
          </Title>
        </View>
      </LinearGradient>
    );
  };

  testimonialnavigate = (isNext, isPrev) => {
    const {currentTestimonialIndex, testimonialData} = this.state;
    let parseIndex = isNext
      ? currentTestimonialIndex + 1
      : currentTestimonialIndex - 1;
    const isCheck = parseIndex >= 0 && parseIndex < testimonialData.length;
    if (isNext && isCheck) {
      this.setState({currentTestimonialIndex: parseIndex});
    } else if (isPrev && isCheck) {
      this.setState({currentTestimonialIndex: parseIndex});
    }
  };

  renderTestimonialsFlatItem = () => {
    const {testimonialData, currentTestimonialIndex} = this.state;
    return (
      <View>
        <View
          styleName="horizontal space-between v-center h-center"
          style={{marginStart: 10, marginEnd: 10, marginTop: 16}}>
          <Pressable onPress={() => this.testimonialnavigate(false, true)}>
            <IconChooser name={'chevron-left'} size={24} color={'#292929'} />
          </Pressable>
          {this.renderTestimonialsItem(
            testimonialData[currentTestimonialIndex].title,
            testimonialData[currentTestimonialIndex].name,
          )}
          <Pressable onPress={() => this.testimonialnavigate(true, false)}>
            <IconChooser name={'chevron-right'} size={24} color={'#292929'} />
          </Pressable>
        </View>
      </View>
    );
  };

  renderTestimonials = () => {
    return (
      <View>
        <Title
          style={{
            color: '#292929',
            fontSize: 16,
            fontFamily: Pref.getFontName(4),
            letterSpacing: 0.5,
            marginTop: 16,
            marginStart: 16,
            marginBottom: 0,
          }}>
          {'Testimonials'}
        </Title>
        {this.renderTestimonialsFlatItem()}
      </View>
    );
  };

  renderMarketingImages = () => {
    const {marketingImagesData} = this.state;
    return (
      <View
        styleName="md-gutter horizontal"
        style={{
          marginVertical: 4,
        }}>
        <Carousel
          ref={(c) => {
            this._carousel2 = c;
          }}
          data={marketingImagesData}
          renderItem={({item, index}) => {
            return (
              <Pressable>
                <Image
                  source={{uri: item.image}}
                  style={styles.marketingimages}
                />
              </Pressable>
            );
          }}
          sliderWidth={sizeWidth(96)}
          itemWidth={sizeWidth(68)}
        />
      </View>
    );
  };

  renderMarginPadding = () => {
    return (
      <View
        style={{
          marginVertical: 12,
        }}></View>
    );
  };

  showAlert = (message, type) => {
    this.setState({alertMessage: message, alertType: type});
    this.clearAlert = setTimeout(() => {
      this.setState({alertMessage: '', alertType: -1});
      clearTimeout(this.clearAlert);
    }, 1000);
  };

  renderBottomItem = (onPress, centerImage, title = 'home') => {
    return (
      <Pressable
        onPress={() => {
          onPress();
        }}>
        <View styleName="v-center h-center" style={styles.bottomcontainer}>
          <Image source={centerImage} style={styles.bottomimage} />
          <Title style={styles.bottomtitles}>{title}</Title>
        </View>
      </Pressable>
    );
  };

  renderBottom = () => {
    return (
      <LinearGradient
        colors={['#fafafa', '#fafafa', '#fafafa']}
        style={styles.bottomtab}>
        <View
          styleName="horizontal v-center h-center space-between md-gutter"
          style={{flex: 15}}>
          {this.renderBottomItem(
            () => this.navigateToPage('Home'),
            require('../../res/images/home/home.png'),
            'Home\n',
          )}
          <View style={styles.linedividers} />
          {this.renderBottomItem(
            () => this.navigateToPage('ProfileScreen', {name: 'Profile'}),
            require('../../res/images/home/profile.png'),
            'My Profile\n',
          )}
          <View style={styles.linedividers} />

          {this.renderBottomItem(
            () => this.navigateToPage('TrackQuery', {name: 'Track My Query'}),
            require('../../res/images/home/query.png'),
            'Query\n/Issues',
          )}
          <View style={styles.linedividers} />
          {this.renderBottomItem(
            () => this.navigateToPage('Training', {name: 'Q-Learning'}),
            require('../../res/images/home/knowledge.png'),
            'Q Learning',
          )}
        </View>
      </LinearGradient>
    );
  };

  renderLoader = () => {
    return (
      <View styleName="xl-gutter">
        <ActivityIndicator />
      </View>
    );
  };

  renderAlertMessage = (type = 0, alertMessage = '') => {
    return (
      <View
        styleName="v-center horizontal md-gutter"
        style={{
          height: 48,
          marginEnd: 16,
          marginStart: 16,
          backgroundColor: type === 0 ? '#d9534f' : '#5cb85c',
          borderRadius: 12,
          elevation: 1,
          alignItems: 'center',
          marginTop: 12,
          marginBottom: 8,
        }}>
        <View style={styles.alertcirclecontainer}>
          <IconChooser
            name={type === 0 ? 'x' : 'check'}
            size={18}
            color={'#666666'}
            style={{
              alignSelf: 'center',
            }}
          />
        </View>
        <Title style={styles.alerttext}>{alertMessage}</Title>
      </View>
    );
  };

  render() {
    const {
      testimonialData,
      bannerData,
      videoData,
      marketingImagesData,
      alertMessage,
      alertType,
    } = this.state;
    return (
      <CScreen
        showScrollToTop={false}
        showfooter={false}
        refresh={() => this.fetchAll(this.state.token)}
        bgColor={Pref.WHITE}
        body={
          <View styleName="vertical">
            {this.renderTopbar()}
            {bannerData.length > 0 ? this.renderBanner() : this.renderLoader()}
            {this.renderManage()}
            {videoData.length > 0 ? this.renderVideos() : this.renderLoader()}
            {alertType === 0 ? this.renderAlertMessage(0, alertMessage) : null}
            {this.renderProduct()}
            {alertType === 1 ? this.renderAlertMessage(0, alertMessage) : null}
            {this.renderQuickLinks()}
            {marketingImagesData.length > 0
              ? this.renderMarketingImages()
              : this.renderLoader()}
            {testimonialData.length > 0
              ? this.renderTestimonials()
              : this.renderLoader()}
            {this.renderMarginPadding()}
            {this.renderBottom()}
          </View>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  alerttext: {
    color: 'white',
    fontSize: 14,
    fontFamily: Pref.getFontName(1),
    //letterSpacing: 0.5,
    lineHeight: 24,
    marginStart: 16,
    padding: 4,
  },
  alertcirclecontainer: {
    width: 24,
    height: 24,
    borderRadius: 24 / 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomtitles: {
    color: '#292929',
    fontSize: 13,
    fontFamily: Pref.getFontName(1),
    //letterSpacing: 0.5,
    marginTop: 10,
    alignSelf: 'center',
    lineHeight: 18,
    justifyContent: 'center',
  },
  bottomimage: {
    width: 24,
    height: 24,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  bottomcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flex: 4,
  },
  bottomtab: {
    height: sizeHeight(13.5),
    marginEnd: 6,
    marginStart: 6,
    elevation: 4,
    alignContent: 'center',
    justifyContent: 'center',
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 4,
  },
  testitextauthor: {
    color: Pref.DARK_RED,
    fontSize: 14,
    fontFamily: Pref.getFontName(3),
    //letterSpacing: 0.5,
    alignSelf: 'center',
    lineHeight: 20,
  },
  testitextcontainer: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    paddingBottom: 12,
    marginTop: 4,
  },
  testitext: {
    color: '#555555',
    fontSize: 13,
    fontFamily: Pref.getFontName(1),
    //letterSpacing: 0.5,
    paddingHorizontal: 6,
    marginHorizontal: 4,
    lineHeight: 20,
  },
  testiinsidecontainer: {
    flex: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: '100%',
    paddingVertical: 10,
  },
  testiContainers: {
    width: '86%',
    //height: 124,
    marginEnd: 6,
    marginStart: 6,
    borderRadius: 12,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginBottom: 4,
  },
  inactivedot: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dotsyle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
    backgroundColor: '#0270e3',
  },
  marketingimages: {
    width: 250,
    height: 164,
    resizeMode: 'cover',
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomEndRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomStartRadius: 12,
    marginEnd: 12,
  },
  quickitemtitle: {
    color: '#292929',
    fontSize: 12,
    fontFamily: Pref.getFontName(1),
    letterSpacing: 0.5,
    marginTop: 6,
    alignSelf: 'center',
  },
  quickitemimages: {
    width: 24,
    height: 24,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  quickitemimag: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: '100%',
    height: '100%',
  },
  quickitemcontainers: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  quickitem: {
    width: 64,
    height: 64,
    marginEnd: 6,
    marginStart: 6,
    borderRadius: 64 / 2,
    elevation: 4,
    alignContent: 'center',
    justifyContent: 'center',
  },
  productcontainer: {flex: 12, marginStart: 4, marginEnd: 4, marginTop: 24},
  producttitle: {
    color: 'white',
    fontSize: 13,
    fontFamily: Pref.getFontName(1),
    //letterSpacing: 0.5,
    marginTop: 6,
    alignSelf: 'center',
    lineHeight: 20,
  },
  productimage: {
    width: 34,
    height: 34,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  productscontain: {
    // justifyContent: 'center',
    // alignItems: 'center',
    // alignContent: 'center',
    width: '100%',
    height: '100%',
  },
  products: {
    width: sizeWidth(30),
    height: sizeHeight(16),
    marginEnd: 6,
    marginStart: 6,
    borderRadius: 12,
    elevation: 4,
  },
  videoscontainer: {
    width: '94%',
    height: 200,
    marginEnd: 10,
    marginStart: 10,
    borderRadius: 12,
    elevation: 2,
    marginTop: 24,
  },
  managetitle: {
    color: '#292929',
    fontSize: 13,
    fontFamily: Pref.getFontName(1),
    //letterSpacing: 0.5,
    marginTop: 6,
    alignSelf: 'center',
    lineHeight: 20,
  },
  manageimage: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: '100%',
    height: '100%',
  },
  manageitemcontainer: {
    width: sizeWidth(21.5),
    height: sizeHeight(11.5),
    marginEnd: 6,
    marginStart: 6,
    borderRadius: 12,
    elevation: 4,
  },
  manage: {flex: 12, marginStart: 4, marginEnd: 4, marginTop: 16},
  headings: {
    color: '#292929',
    fontSize: 16,
    fontFamily: Pref.getFontName(4),
    letterSpacing: 0.5,
    marginTop: 16,
    marginStart: 16,
    marginBottom: 0,
  },
  linedividers: {height: '100%', backgroundColor: '#eeeeee', width: 1},
  bannerImg: {
    height: 200,
    width: '100%',
    resizeMode: 'cover',
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomEndRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomStartRadius: 12,
  },
  counter: {
    backgroundColor: Pref.DARK_RED,
    width: 18,
    height: 18,
    borderRadius: 18 / 2,
    position: 'absolute',
    top: 0,
    right: 0,
    elevation: 4,
    marginTop: -4,
    marginRight: -4,
  },
  toolbarheight: {flexDirection: 'row'},
  bannerView: {},
  applogo: {
    resizeMode: 'contain',
    width: 42,
    height: 42,
    marginStart: 16,
    tintColor: Pref.DARK_RED,
  },
  notification: {
    marginEnd: 20,
  },
  roundbutton: {
    backgroundColor: 'white',
    width: 42,
    height: 42,
    elevation: 8,
    borderRadius: 42 / 4,
  },
  submitbuttonpicker: {
    backgroundColor: Pref.RED,
    borderColor: 'transparent',
    borderWidth: 0,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    width: '100%',
    borderRadius: 0,
    marginEnd: 10,
    marginBottom: -2,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  iconcenter: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignSelf: 'flex-end',
    borderRadius: 42 / 2,
    backgroundColor: '#0270e3',
    marginEnd: 16,
    marginBottom: 8,
  },
  circle1: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 16 / 2,
    backgroundColor: '#0270e3',
  },
  leadercont: {
    alignItems: 'center',
    alignContent: 'center',
  },
  leadcircle: {
    borderColor: '#dbd9cc',
    width: sizeWidth(56),
    height: sizeWidth(56),
    borderRadius: sizeWidth(56) / 2.0,
    borderWidth: 1.5,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  tri: {
    //position: 'absolute',
    backgroundColor: 'transparent',
    borderTopWidth: 36 / 2.0,
    borderRightWidth: 0,
    borderBottomWidth: 36 / 2.0,
    borderLeftWidth: 24,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'white',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    right: -28,
  },
  pfiltercont: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
    borderColor: '#dbdacd',
    borderWidth: 0.8,
    backgroundColor: Pref.WHITE,
    borderRadius: 8,
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
  filtercont: {
    flex: 0.6,
    //position: 'absolute',
    //zIndex: 99,
    borderColor: '#dbdacd',
    borderWidth: 0.8,
    backgroundColor: Pref.WHITE,
    alignSelf: 'flex-end',
    borderRadius: 8,
    //top: 24,
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
  passText: {
    fontSize: 20,
    letterSpacing: 0.5,
    color: '#555555',
    fontWeight: '700',
    lineHeight: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  line: {
    backgroundColor: '#f2f1e6',
    height: 1.2,
    marginStart: 12,
    marginEnd: 12,
    marginTop: 8,
  },
});
