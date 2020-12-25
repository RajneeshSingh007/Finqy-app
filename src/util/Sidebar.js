import React from 'react';
import {
  StatusBar,
  StyleSheet,
  ScrollView,
  BackHandler,
  FlatList,
  TouchableWithoutFeedback,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import {
  TouchableOpacity,
  Image,
  Screen,
  Subtitle,
  Title,
  View,
  Heading,
  NavigationBar,
  Text,
  Caption,
  GridView,
} from '@shoutem/ui';
import {
  Button,
  Card,
  Colors,
  Snackbar,
  TextInput,
  DataTable,
  Modal,
  Portal,
  Avatar,
  Divider,
} from 'react-native-paper';
import NavigationActions from './NavigationActions';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Feather';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Lodash from 'lodash';
import CommonScreen from '../screens/common/CommonScreen';
import * as Pref from './Pref';
import * as Helper from './Helper';
import IconChooser from '../screens/common/IconChooser';
import DrawerTop from '../screens/component/DrawerTop';
import analytics from '@react-native-firebase/analytics';

const COLOR = '#f9f8f1';

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    changeNavigationBarColor(COLOR, true, true);
    StatusBar.setBackgroundColor(COLOR, false);
    StatusBar.setBarStyle('dark-content');

    this.menuheaderClick = this.menuheaderClick.bind(this);
    this.menuSubHeaderClick = this.menuSubHeaderClick.bind(this);
    this.state = {
      userData: null,
      pic: '',
      name: ``,
      type: '',
      menuList: [
        {
          name: `My Profile`,
          expand: false,
          heading: true,
          iconname: require('../res/images/menuicon1.png'),
          icontype: 0,
          sub: [
            {
              name: `Edit Profile`,
              expand: false,
              click: 'ProfileScreen',
              options: {},
            },
            {
              name: `My Agreement`,
              click: 'Agreement',
              expand: false,
              options: {},
            },
            {
              name: `My Certificate`,
              expand: false,
              click: 'Certificate',
              options: {},
            },
            {
              name: `Change Password`,
              expand: false,
              click: 'ChangePass',
              options: {},
            },
          ],
          click: '',
        },
        {
          name: `My FinPro`,
          expand: false,
          heading: true,
          iconname: require('../res/images/menuicon2.png'),
          icontype: 2,
          sub: [
            // {
            //     name: `Dashboard`,
            //     expand: false,
            //     click: ''
            // },
            {
              name: `My New Lead`,
              expand: false,
              click: '',
              heading: true,
              sub: [
                {
                  name: `Add Single Lead`,
                  expand: false,
                  click: `FinorbitScreen`,
                  options: {},
                },
                {
                  name: `Link Sharing Option`,
                  expand: false,
                  click: `LinkSharingOption`,
                  options: {},
                },
              ],
            },
            {
              name: `My Lead Record`,
              expand: false,
              click: 'LeadList',
              options: {},
            },
          ],
          click: '',
        },{
          name: `My Marketing Tool`,
          expand: false,
          click: 'MarketingTool',
          options: {},
          iconname: require('../res/images/menuicon7.png'),
          icontype: 2,
        },
                {
          name: `FinTrain Learning`,
          expand: false,
          click: 'Training',
          options: {},
          iconname: require('../res/images/menuicon8.png'),
          icontype: 2,
        },{
          name: `ERB Popular Plan`,
          expand: false,
          click: 'PopularPlan',
          options: {},
          iconname: require('../res/images/menuicon6.png'),
          icontype: 2,
        },
        {
          name: `My Offers`,
          expand: false,
          click: `MyOffers`,
          options: {},
          iconname: require('../res/images/menuicon5.png'),
          icontype: 2,
        },
        {
          name: `My Wallet`,
          expand: false,
          heading: true,
          iconname: require('../res/images/menuicon4.png'),
          icontype: 2,
          sub: [
            {
              name: `My Payout Structure`,
              expand: false,
              click: 'Payout',
              options: {},
            },
            {
              name: `Earning History`,
              expand: false,
              click: 'MyWallet',
              options: {},
            },
            {
              name: `My Invoice`,
              expand: false,
              click: 'Invoice',
              options: {},
            },
            {
              name: `My 26AS`,
              expand: false,
              click: 'As26',
              options: {},
            },
                          {
                name:`Payout Policy`,
                expand:false,
                click:'PayoutPolicy',
                options:{}
              },
          ],
          click: '',
        },
        {
          name: `FinTeam Manager`,
          expand: false,
          heading: true,
          iconname: require('../res/images/menuicon3.png'),
          icontype: 2,
          sub: [
            {
              name: `My Connector`,
              expand: false,
              click: '',
              heading: true,
              sub: [
                {
                  name: `Add Connector`,
                  expand: false,
                  click: `AddConnector`,
                  options: {},
                },
                {
                  name: `View Connector`,
                  expand: false,
                  click: `ViewConnector`,
                  options: {},
                },
              ],
            },
            {
              name: `My Team`,
              expand: false,
              click: '',
              heading: true,
              sub: [
                {
                  name: `Add Team`,
                  expand: false,
                  click: `AddTeam`,
                  options: {},
                },
                {
                  name: `View Team`,
                  expand: false,
                  click: `ViewTeam`,
                  options: {},
                },
              ],
            },
          ],
          click: '',
        },
      
        {
          name: `FinNews`,
          expand: false,
          click: 'Blogs',
          options: {},
          iconname: require('../res/images/menuicon9.png'),
          icontype: 2,
        },
        {
          name: `Helpdesk`,
          expand: false,
          heading: true,
          iconname: require('../res/images/menuicon10.png'),
          icontype: 2,

          sub: [
            {
              name: `Relation Manager`,
              expand: false,
              click: 'Manager',
              options: {},
            },
            // {
            //   name: `Raise QRC`,
            //   expand: false,
            //   click: 'Qrc',
            //   options: {},
            // },
          ],
          click: '',
        },
        // {
        //   name: `Logout`,
        //   expand: false,
        //   click: 'Login',
        //   iconname: 'power-off',
        //   icontype: 3,
        //   options: {},
        // },
        {
          name: `Raise a Ticket`,
          expand: false,
          heading: true,
          iconname: require('../res/images/menuicon10.png'),
          icontype: 2,
          sub: [
            {
              name: `Raise a query`,
              expand: false,
              click: 'RaiseQueryForm',
              options: {},
            },
            {
              name: `Track my query`,
              expand: false,
              click: 'TrackQuery',
              options: {},
            },
          ],
          click: '',
        },
      ],
    };
  }

  componentDidMount() {
    Pref.getVal(Pref.userData, (parse) => {
      const pp = parse.user_prof;
      const url = {
        uri:
          pp === ''
            ? Pref.profileDefaultPic
            : pp === undefined
              ? Pref.profileDefaultPic
              : pp,
      };
      //console.log(`url`, url);
      this.setState({
        userData: parse,
        pic: url,
        name: parse.rname === undefined ? parse.username : parse.rname,
      });
    });
    Pref.getVal(Pref.USERTYPE, (v) => {
      //console.log(v);
      this.setState({ type: v });
      if (v === `connector`) {
        const filter = [
          {
            name: `My Profile`,
            expand: false,
            heading: true,
            iconname: require('../res/images/menuicon1.png'),
            icontype: 0,
            sub: [
              {
                name: `Edit Profile`,
                expand: false,
                click: 'ProfileScreen',
                options: {},
              },
              {
                name: `My Agreement`,
                click: 'Agreement',
                expand: false,
                options: {},
              },
              {
                name: `My Certificate`,
                expand: false,
                click: 'Certificate',
                options: {},
              },
              {
                name: `Change Password`,
                expand: false,
                click: 'ChangePass',
                options: {},
              },
            ],
            click: '',
          },
          {
            name: `My FinPro`,
            expand: false,
            heading: true,
            iconname: require('../res/images/menuicon2.png'),
            icontype: 2,
            sub: [
              // {
              //     name: `Dashboard`,
              //     expand: false,
              //     click: ''
              // },
              {
                name: `My New Lead`,
                expand: false,
                click: '',
                heading: true,
                sub: [
                  {
                    name: `Add Single Lead`,
                    expand: false,
                    click: `FinorbitScreen`,
                    options: {},
                  },
                  {
                    name: `Link Sharing Option`,
                    expand: false,
                    click: `LinkSharingOption`,
                    options: {},
                  },
                ],
              },
              {
                name: `My Lead Record`,
                expand: false,
                click: 'LeadList',
                options: {},
              },
            ],
            click: '',
          },
          {
            name: `My Wallet`,
            expand: false,
            heading: true,
            iconname: require('../res/images/menuicon4.png'),
            icontype: 2,
            sub: [
              {
                name: `My Payout Structure`,
                expand: false,
                click: 'Payout',
                options: {},
              },
              {
                name: `Earning History`,
                expand: false,
                click: 'MyWallet',
                options: {},
              },
              {
                name: `My Invoice`,
                expand: false,
                click: 'Invoice',
                options: {},
              },
              {
                name: `My 26AS`,
                expand: false,
                click: 'As26',
                options: {},
              },
              {
                name:`Payout Policy`,
                expand:false,
                click:'PayoutPolicy',
                options:{}
              },
            ],
            click: '',
          },
          {
            name: `My Offers`,
            expand: false,
            click: `MyOffers`,
            options: {},
            iconname: require('../res/images/menuicon5.png'),
            icontype: 2,
          },
          {
            name: `ERB Popular Plan`,
            expand: false,
            click: 'PopularPlan',
            options: {},
            iconname: require('../res/images/menuicon6.png'),
            icontype: 2,
          },
          {
            name: `My Marketing Tool`,
            expand: false,
            click: 'MarketingTool',
            options: {},
            iconname: require('../res/images/menuicon7.png'),
            icontype: 2,
          },
          {
            name: `FinTrain Learning`,
            expand: false,
            click: 'Training',
            options: {},
            iconname: require('../res/images/menuicon8.png'),
            icontype: 2,
          },
          {
            name: `FinNews`,
            expand: false,
            click: 'Blogs',
            options: {},
            iconname: require('../res/images/menuicon9.png'),
            icontype: 2,
          },
                    {
            name: `Helpdesk`,
            expand: false,
            heading: true,
            iconname: require('../res/images/menuicon10.png'),
            icontype: 2,

            sub: [
              {
                name: `Relation Manager`,
                expand: false,
                click: 'Manager',
                options: {},
              },
              // {
              //   name: `Raise QRC`,
              //   expand: false,
              //   click: 'Qrc',
              //   options: {},
              // },
            ],
            click: '',
          },
          // {
          //   name: `Logout`,
          //   expand: false,
          //   click: 'Login',
          //   iconname: 'power-off',
          //   icontype: 3,
          //   options: {},
          // },
          {
            name: `Raise a Ticket`,
            expand: false,
            heading: true,
            iconname: require('../res/images/menuicon10.png'),
            icontype: 2,
            sub: [
              {
                name: `Raise a query`,
                expand: false,
                click: 'RaiseQueryForm',
                options: {},
              },
              {
                name: `Track my query`,
                expand: false,
                click: 'TrackQuery',
                options: {},
              },
            ],
            click: '',
          },
        ];
        this.setState({ menuList: filter });
      } else if (v === 'team') {
        const filter = [
          {
            name: `My FinPro`,
            expand: false,
            heading: true,
            iconname: require('../res/images/menuicon2.png'),
            icontype: 2,
            sub: [
              // {
              //     name: `Dashboard`,
              //     expand: false,
              //     click: ''
              // },
              {
                name: `My New Lead`,
                expand: false,
                click: '',
                heading: true,
                sub: [
                  {
                    name: `Add Single Lead`,
                    expand: false,
                    click: `FinorbitScreen`,
                    options: {},
                  },
                  {
                    name: `Link Sharing Option`,
                    expand: false,
                    click: `LinkSharingOption`,
                    options: {},
                  },
                ],
              },
              {
                name: `My Lead Record`,
                expand: false,
                click: 'LeadList',
                options: {},
              },
            ],
            click: '',
          },
          // {
          //   name: `My Offers`,
          //   expand: false,
          //   click: `MyOffers`,
          //   options: {},
          //   iconname: require('../res/images/menuicon5.png'),
          //   icontype: 2,
          // },
          {
            name: `ERB Popular Plan`,
            expand: false,
            click: 'PopularPlan',
            options: {},
            iconname: require('../res/images/menuicon6.png'),
            icontype: 2,
          },
          {
            name: `My Marketing Tool`,
            expand: false,
            click: 'MarketingTool',
            options: {},
            iconname: require('../res/images/menuicon7.png'),
            icontype: 2,
          },
          {
            name: `FinTrain Learning`,
            expand: false,
            click: 'Training',
            options: {},
            iconname: require('../res/images/menuicon8.png'),
            icontype: 2,
          },
                    {
            name: `FinNews`,
            expand: false,
            click: 'Blogs',
            options: {},
            iconname: require('../res/images/menuicon9.png'),
            icontype: 2,
          },

          {
            name: `Helpdesk`,
            expand: false,
            heading: true,
            iconname: require('../res/images/menuicon10.png'),
            icontype: 2,

            sub: [
              {
                name: `Relation Manager`,
                expand: false,
                click: 'Manager',
                options: {},
              },
              // {
              //   name: `Raise QRC`,
              //   expand: false,
              //   click: 'Qrc',
              //   options: {},
              // },
            ],
            click: '',
          },
          // {
          //   name: `Logout`,
          //   expand: false,
          //   click: 'Login',
          //   iconname: 'power-off',
          //   icontype: 3,
          //   options: {},
          // },
          {
            name: `Raise a Ticket`,
            expand: false,
            heading: true,
            iconname: require('../res/images/menuicon10.png'),
            icontype: 2,
            sub: [
              {
                name: `Raise a query`,
                expand: false,
                click: 'RaiseQueryForm',
                options: {},
              },
              {
                name: `Track my query`,
                expand: false,
                click: 'TrackQuery',
                options: {},
              },
            ],
            click: '',
          },
        ];
        this.setState({ menuList: filter });
      }
    });
  }

  menuheaderClick = (item, index) => {
    const menuList = this.state.menuList;
    const fill = Lodash.map(menuList, (ele) => {
      const oldexp = item.expand;
      if (ele.name === item.name) {
        ele.expand = !oldexp;
      } else {
        ele.expand = false;
      }
      const sub = item.sub;
      const meh = sub.map((io) => {
        if (io.expand) {
          io.expand = false;
        }
        return io;
      });
      item.sub = meh;
      return ele;
    });
    this.setState({ menuList: fill });
  };

  menuSubHeaderClick = (item, index, sub, i) => {
    const menuList = this.state.menuList;
    const menusub = item.sub;
    const expand = sub.expand;
    sub.expand = !expand;
    menusub[i] = sub;
    item.sub = menusub;
    menuList[index] = item;
    this.setState({ menuList: menuList });
  };

  headingclick = (item, index) => {
    if (item.heading) {
      this.menuheaderClick(item, index);
    } else {
      if (item.name === `Logout`) {
        Alert.alert('Logout', 'Are you sure want to Logout?', [
          {
            text: 'Cancel',
          },
          {
            text: 'Ok',
            onPress: () => {
              Pref.setVal(Pref.saveToken, null);
              Pref.setVal(Pref.userData, null);
              Pref.setVal(Pref.userID, null);
              Pref.setVal(Pref.loggedStatus, false);
              NavigationActions.navigate('Login');
            },
          },
        ]);
      } else {
        NavigationActions.navigate(item.click, item.options);
        NavigationActions.closeDrawer();
      }
    }
  };

  subClick = (item, s, index, i) => {
    if (s.heading) {
      this.menuSubHeaderClick(item, index, s, i);
    } else {
      // if (s.click === `ChatScreen`) {
      //   var freshchatUser = new FreshchatUser();
      //   freshchatUser.firstName = userData.rname;
      //   freshchatUser.lastName = '';
      //   freshchatUser.email = userData.email;
      //   freshchatUser.phoneCountryCode = '+91';
      //   freshchatUser.phone = userData.rcontact;
      //   Freshchat.setUser(freshchatUser, (error) => {
      //     //console.log(error);
      //   });
      //   Freshchat.showConversations();
      // } else {
      if (s.click === `Certificate`) {
        const { refercode } = this.state.userData;
        NavigationActions.navigate(s.click, {
          item: refercode,
        });
      } else {
        NavigationActions.navigate(s.click, s.options);
      }
      // }
      NavigationActions.closeDrawer();
    }
  };

  render() {
    const { menuList, userData } = this.state;
    return (
      <SafeAreaView style={styles.mainContainer} forceInset={{ top: 'never' }}>
        <View style={styles.mainContainer}>
          <DrawerTop />
          <View style={{ flex: 0.87, marginStart: 12, marginEnd: 12 }}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              {menuList.map((item, index) => {
                return (
                  <View styleName="v-center h-center sm-gutter">
                    <TouchableWithoutFeedback
                      onPress={() => this.headingclick(item, index)}>
                      <View
                        styleName="horizontal v-center md-gutter space-between"
                        style={{
                          backgroundColor: !item.expand
                            ? 'transparent'
                            : '#f2f0e4',
                        }}>
                        <View styleName="horizontal v-center h-center" style={{
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Image
                            source={item.iconname}
                            style={
                              {
                                width: 24,
                                height: 24,
                                tintColor: '#626161',
                                resizeMode: 'contain'
                              }
                            }
                          />

                          {/* <IconChooser
                            name={item.iconname}
                            size={22}
                            color={'#626161'}
                            iconType={item.icontype}
                          /> */}
                          <Title
                            styleName="wrap"
                            style={{
                              fontSize: 14,
                              letterSpacing: 0.5,
                              color: !item.expand
                                ? '#97948c'
                                : Pref.PRIMARY_COLOR,
                              alignSelf: 'center',
                              fontWeight: 'bold',
                              justifyContent: 'center',
                              marginStart: 16
                            }}>{`${item.name}`}</Title>
                        </View>
                        {item.heading ? (
                          <Icon
                            name={`chevron-down`}
                            size={22}
                            color={'#97948c'}
                          />
                        ) : null}
                      </View>
                    </TouchableWithoutFeedback>
                    {item.expand
                      ? item.sub.map((s, i) => {
                        return (
                          <View
                            style={{
                              backgroundColor: s.expand
                                ? '#e8e5d7'
                                : 'transparent',
                              marginStart: s.expand ? 0 : 16,
                              paddingStart: s.expand ? 16 : 0,
                            }}>
                            <TouchableWithoutFeedback
                              onPress={() =>
                                this.subClick(item, s, index, i)
                              }>
                              <View
                                styleName="horizontal v-center space-between"
                                style={{
                                  marginHorizontal: 16,
                                  marginVertical: 8,
                                  paddingVertical: 10,
                                }}>
                                <Title
                                  styleName="wrap"
                                  style={{
                                    fontSize: 14,

                                    letterSpacing: 0.5,
                                    color: !s.expand
                                      ? '#97948c'
                                      : Pref.PRIMARY_COLOR,
                                    alignSelf: 'flex-start',
                                  }}>{`${s.name}`}</Title>
                                {s.heading ? (
                                  <Icon
                                    name={`chevron-down`}
                                    size={22}
                                    color={'#97948c'}
                                  />
                                ) : null}
                              </View>
                            </TouchableWithoutFeedback>
                            {s.expand
                              ? s.sub.map((s, i) => {
                                return (
                                  <View
                                    style={{
                                      marginStart: s.expand ? 0 : 16,
                                      paddingStart: s.expand ? 16 : 0,
                                      paddingVertical: 6,
                                    }}>
                                    <Divider
                                      styleName="light"
                                      style={styles.line}
                                    />
                                    <TouchableWithoutFeedback
                                      onPress={() =>
                                        NavigationActions.navigate(s.click)
                                      }>
                                      <View
                                        styleName="horizontal v-center space-between"
                                        style={{
                                          marginHorizontal: 16,
                                          marginVertical: 8,
                                        }}>
                                        <Title
                                          styleName="wrap"
                                          style={
                                            styles.menusubtitle
                                          }>{`${s.name}`}</Title>
                                        {s.heading ? (
                                          <Icon
                                            name={`chevron-right`}
                                            size={22}
                                            color={'#97948c'}
                                          />
                                        ) : null}
                                      </View>
                                    </TouchableWithoutFeedback>
                                  </View>
                                );
                              })
                              : null}
                            {s.sub !== undefined ? (
                              i === s.sub.length - 1 ? null : (
                                <Divider
                                  styleName="light"
                                  style={styles.line}
                                />
                              )
                            ) : null}
                          </View>
                        );
                      })
                      : null}
                    {index === this.state.menuList.length - 1 ? null : (
                      <Divider styleName="light" style={styles.line} />
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  line: {
    marginTop: 8,
    backgroundColor: '#d9d8d3',
    height: 1.2,
    marginStart: 16,
    marginEnd: 16,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: COLOR,
  },
  subMargin: { marginStart: 16 },
  subtitle: {
    fontSize: 14,

    letterSpacing: 0.5,
    color: '#97948c',
    alignSelf: 'flex-start',
    marginStart: 16,
  },
  title: {
    fontSize: 17,

    letterSpacing: 0.5,
    color: 'black',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    marginStart: 16,
  },
  image: {
    backgroundColor: Colors.grey200,
    resizeMode: 'contain',
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menutitle: {
    fontSize: 13,

    letterSpacing: 0.5,
    color: '#97948c',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
  },
  menusubtitle: {
    fontSize: 13,

    letterSpacing: 0.5,
    color: '#97948c',
    alignSelf: 'flex-start',
  },
});
