import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Pressable,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import * as Pref from '../../util/Pref';
import {Avatar, Portal} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import {sizeHeight, sizeWidth} from '../../util/Size';
import {Image, View, Title, Subtitle} from '@shoutem/ui';
import Lodash from 'lodash';
import IconChooser from '../common/IconChooser';
import * as Helper from '../../util/Helper';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {stopService, stopIdleService} from '../../util/DialerFeature';
import Loader from '../../util/Loader';
import RectRoundBtn from '../component/RectRoundBtn';

const HomeTopBar = (props) => {
  const {
    title,
    bottomBody,
    showBack = false,
    backClicked = () => {
      NavigationActions.goBack();
    },
    bottomtext = '',
    bottomtextStyle,
    profile = () => {},
    //name = '',
    //type = '',
  } = props;

  const [pic, setPic] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setuserData] = useState(null);
  const [type, settype] = useState(null);
  const [leaderData, setleaderData] = useState(null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    changeNavigationBarColor('white', true, true);
    StatusBar.setBackgroundColor('white', false);
    StatusBar.setBarStyle('dark-content');
    return () => {};
  }, []);

  useEffect(() => {
    Pref.getVal(Pref.userData, (value) => {
      if (value !== undefined && value !== null) {
        const pp = value.user_prof;
        let profilePic =
          pp === undefined ||
          pp === null ||
          pp === '' ||
          (!pp.includes('.jpg') &&
            !pp.includes('.jpeg') &&
            !pp.includes('.png'))
            ? null
            : {uri: decodeURIComponent(pp)};
        // console.log('profilePic', profilePic)
        setPic(profilePic);
        setuserData(value);
        setleaderData(
          Helper.nullCheck(value.leader) === false ? value.leader[0] : null,
        );
      }
    });

    Pref.getVal(Pref.USERTYPE, (type) => {
      settype(type);
    });

    return () => {};
  }, []);

  const dismisssProfile = () => setShowProfile(false);

  const visProfile = () => setShowProfile(true);

  const logout = () => {
    Alert.alert('Logout', 'Are you sure want to Logout?', [
      {
        text: 'Cancel',
      },
      {
        text: 'Ok',
        onPress: () => {
          //value
          setLoader(true);
          const body = JSON.stringify({
            id: `${userData.id}`,
            type: `${type}`,
          });
          Pref.getVal(Pref.saveToken, (token) => {
            Helper.networkHelperTokenPost(
              Pref.LogoutUrl,
              body,
              Pref.methodPost,
              token,
              (result) => {
                cleanup();
              },
              (error) => {
                cleanup();
              },
            );
          });
        },
      },
    ]);
  };

  const cleanup = () => {
    stopService();
    stopIdleService();
    Pref.setVal(Pref.MENU_LIST, null);
    Pref.setVal(Pref.DIALER_TEAM_LEADER, null);
    Pref.setVal(Pref.DIALER_DATA, null);
    Pref.setVal(Pref.DIALER_SERVICE_ENABLED, false);
    Pref.setVal(Pref.salespayoutUpdate, null);
    Pref.setVal(Pref.saveToken, null);
    Pref.setVal(Pref.userData, null);
    Pref.setVal(Pref.userID, null);
    Pref.setVal(Pref.USERTYPE, '');
    Pref.setVal(Pref.loggedStatus, false);
    NavigationActions.navigate('IntroScreen');
  };

  return (
    <>
      {showProfile === true ? (
        <Portal>
          <TouchableWithoutFeedback onPress={dismisssProfile}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                backgroundColor: 'rgba(0,0,0,0)',
              }}
              onPress={dismisssProfile}>
              <View style={{flex: 0.15}} />
              <View style={{flex: 0.1}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={{flex: 0.1}} />
                  <View
                    styleName="vertical md-gutter"
                    style={styles.filtercont}>
                    {/* <View style={styles.tri}></View> */}
                    <Title
                      style={StyleSheet.flatten([
                        styles.passText,
                        {
                          fontSize: 16,
                        },
                      ])}>
                      {userData !== null &&
                      Helper.nullStringCheck(userData.rname) === false
                        ? userData.rname
                        : userData !== null &&
                          Helper.nullStringCheck(userData.username) === false
                        ? userData.username
                        : ''}
                    </Title>

                    <Subtitle
                      style={StyleSheet.flatten([
                        styles.passText,
                        {
                          color: '#666666',
                          fontSize: 13,
                          paddingVertical: 0,
                          marginTop: 4,
                        },
                      ])}>
                      {userData != null &&
                      Helper.nullStringCheck(userData.rcontact) === false
                        ? `${userData.rcontact}${
                            type === 'referral' ? '' : '(Connector)'
                          }`
                        : userData != null &&
                          Helper.nullStringCheck(userData.mobile) === false
                        ? `${userData.mobile}(Team)`
                        : ''}
                    </Subtitle>

                    <Title
                      style={StyleSheet.flatten([
                        styles.passText,
                        {
                          color: Pref.RED,
                          fontSize: 14,
                          paddingVertical: 0,
                          marginBottom: 2,
                          paddingBottom: 2,
                          marginTop: 1,
                        },
                      ])}>
                      {`${
                        type === `referral`
                          ? 'Partner'
                          : leaderData != null &&
                            Helper.nullCheck(leaderData.rname) === false
                          ? `${leaderData.rname}(Partner)`
                          : ''
                      }`}
                    </Title>

                    <View style={styles.line}></View>

                    <TouchableWithoutFeedback onPress={logout}>
                      <Title
                        style={StyleSheet.flatten([
                          styles.passText,
                          {
                            marginTop: 8,
                            color: '#0270e3',
                            fontSize: 14,
                            lineHeight: 20,
                            paddingVertical: 0,
                            textDecorationColor: '#0270e3',
                            textDecorationStyle: 'solid',
                            textDecorationLine: 'underline',
                          },
                        ])}>
                        {`Logout`}
                      </Title>
                    </TouchableWithoutFeedback>
                  </View>
                  <View style={{flex: 0.2}} />
                </View>
              </View>
              <View style={{flex: 0.75}} />
            </View>
          </TouchableWithoutFeedback>
        </Portal>
      ) : null}

      {loader === true ? (
        <Portal>
          <Loader isShow={loader} />
        </Portal>
      ) : null}

      <View
        style={{
          flex: 0.13,
          backgroundColor: 'white',
        }}>
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
              onPress={visProfile}
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
        {/* <View styleName="sm-gutter" style={styles.cont}>
          <View style={styles.con}>
            <View style={styles.leftcon}>
              <TouchableWithoutFeedback onPress={backClicked}>
                <View style={styles.circle}>
                  <IconChooser
                    name={showBack === true ? 'chevron-left' : 'menu'}
                    size={18}
                    color={Pref.RED}
                    style={styles.icon}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={{flex: 0.6}}>
              {showBack === true ? (
                title === 'Finqy' ? (
                  <Image
                    source={require('../../res/images/squarelogo.png')}
                    styleName="medium-wide"
                    style={{
                      alignSelf: 'center',
                      justifyContent: 'center',
                      resizeMode:'contain',
                      marginBottom:8
                      }}
                  />
                ) : (
                  <Title style={styles.centertext}>
                    {Lodash.truncate(title)}
                  </Title>
                )
              ) : (
                <Image
                  source={require('../../res/images/squarelogo.png')}
                  styleName="medium-wide"
                  style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    resizeMode:'contain',
                    marginBottom:8
                  }}
                />
              )}
            </View>
            <View style={styles.rightcon}>
              <TouchableWithoutFeedback
                onPress={visProfile}
                // onPress={() => {
                //   //console.log('title', title);
                //   //if (title === 'Hi,') {
                //   profile();
                //   //} else {
                //   //NavigationActions.openDrawer();
                //   //}
                // }}
              >
                <View>
                  <Avatar.Image
                    source={
                      Helper.nullStringCheck(pic) === true
                        ? require('../../res/images/account.png')
                        : pic
                    }
                    size={44}
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: 'transparent',
                    }}
                  />
                </View>
                {/* //   <Title
              //     style={StyleSheet.flatten([
              //       styles.belowtext,
              //       {
              //         color: Pref.WHITE,
              //       },
              //     ])}>
              //     {Lodash.capitalize(name.slice(0, 1))}
              //   </Title>
              // ) : (
              //     <View
              //       style={StyleSheet.flatten([
              //         styles.circle,
              //         {
              //           backgroundColor: title === 'Hi,' ? Pref.RED : Pref.WHITE,
              //           borderColor: title === 'Hi,' ? Pref.RED : '#4a4949',
              //           borderStyle: 'solid',
              //           borderWidth: title === 'Hi,' ? 0 : 3,
              //         },
              //       ])}>
              //       <IconChooser
              //         name={'menu'}
              //         size={18}
              //         color={'red'}
              //         style={styles.icon}
              //       />
              //     </View>
              //   )} 
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
        <View style={styles.line} />
        {bottomtext !== '' ? (
          <Title
            style={StyleSheet.flatten([styles.belowtext, bottomtextStyle])}>
            {bottomtext}
          </Title>
        ) : null}
        {bottomBody} */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  filtercont: {
    flex: 0.7,
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
  cont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centertext: {
    fontSize: 19,
    letterSpacing: 0.5,
    color: '#555555',
    lineHeight: 36,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingVertical: 16,
    //fontFamily:Pref.getFontName(4)
  },
  belowtext: {
    fontSize: 18,
    letterSpacing: 0.5,
    color: '#555555',
    fontWeight: '700',
    lineHeight: 36,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingVertical: 8,
  },
  insideview: {
    height: sizeHeight(5),
    alignContent: 'center',
    borderRadius: 16,
    width: '40%',
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    marginStart: sizeWidth(10),
  },
  container: {
    //flex:1,
    paddingVertical: sizeHeight(3.2),
    backgroundColor: 'white',
    elevation: 4,
    borderBottomLeftRadius: 64,
  },
  avatar: {
    marginEnd: sizeWidth(3),
    backgroundColor: 'transparent',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: 'white',
    marginStart: sizeWidth(3),
    alignSelf: 'center',
    marginStart: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
  },
  icon: {
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  con: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftcon: {
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: 8,
  },
  rightcon: {
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    //marginEnd:4
  },
  rightText: {
    color: '#bbb8ac',
    fontSize: 18,
    marginEnd: 8,
    letterSpacing: 0.5,
  },
  circle: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 4,
    borderRadius: 42 / 2,
    borderColor: '#4a4949',
    borderStyle: 'solid',
    borderWidth: 3,
  },
  line: {
    backgroundColor: '#f2f1e6',
    height: 1.2,
    marginStart: 12,
    marginEnd: 12,
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
});

export default HomeTopBar;
