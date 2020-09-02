import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';

import {createStackNavigator} from 'react-navigation-stack';

import {createDrawerNavigator} from 'react-navigation-drawer';

//intro
import IntroScreen from './../screens/intro/IntroScreen';

//auth page
import AuthPage from './../screens/auth/AuthPage';
import RegisterScreen from './../screens/auth/RegisterScreen';
import LoginScreen from './../screens/auth/LoginScreen';
import OtpScreen from './../screens/auth/OtpScreen';

//home page
import HomeScreen from './../screens/home/HomeScreen';
import FinorbitScreen from './../screens/finorbit/FinorbitScreen';
import FinorbitForm from './../screens/finorbit/FinorbitForm';
import Samadhan from './../screens/finorbit/Samadhan';
import NewForm from './../screens/finorbit/NewForm';
import Payment from './../screens/finorbit/Payment';
import VectorForm from './../screens/finorbit/VectorForm';
import VectorPayment from './../screens/finorbit/VectorPayment';

//profile
import ProfileScreen from './../screens/profile/ProfileScreen';
import ProfScreen from './../screens/profile/ProfScreen';
import MyOffers from './../screens/profile/MyOffers';
import PopularPlan from './../screens/profile/PopularPlan';
import MarketingTool from './../screens/profile/MarketingTool';
import OffersDetails from './../screens/profile/OffersDetails';
import MyWallet from './../screens/profile/MyWallet';
import About from './../screens/profile/About';
import ChatScreen from './../screens/profile/ChatScreen';
import Redeem from './../screens/profile/Redeem';
import ReferEarn from './../screens/profile/ReferEarn';
import Certificate from './../screens/profile/Certificate';
import ChangePass from './../screens/profile/ChangePass';
import Agreement from './../screens/profile/Agreement';

//LeadList
import LeadList from './../screens/leads/LeadList';
import LinkSharingOption from './../screens/leads/LinkSharingOption';

//AddTeam
import AddTeam from './../screens/myteam/AddTeam';
import ViewTeam from './../screens/myteam/ViewTeam';

//connectors
import ViewConnector from './../screens/connectors/ViewConnector';
import AddConnector from './../screens/connectors/AddConnector';

//wallet
import Invoice from './../screens/wallets/Invoice';
import As26 from './../screens/wallets/As26';
import Payout from './../screens/wallets/Payout';

//blog
import Blogs from './../screens/blogs/Blogs';
import BlogDetails from './../screens/blogs/BlogDetails';

import Training from './../screens/training/Training';

import Manager from './../screens/relmanager/Manager';
import Qrc from './../screens/helpdesk/Qrc';
import TCondition from './../screens/auth/TCondition';

import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {Colors, IconButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import {BACKGROUND_COLOR} from './Pref';
import {Platform, Dimensions, I18nManager} from 'react-native';
import Sidebar from './Sidebar';

const {width} = Dimensions.get('window');

const WIDTH_DRAWER = width * 0.78;

const HomeNav = createStackNavigator(
  {
    HomeScreen: {screen: HomeScreen},
  },
  {
    headerMode: 'none',
    initialRouteName: 'HomeScreen',
  },
);

const FinNav = createStackNavigator(
  {
    FinorbitScreen: {screen: FinorbitScreen},
  },
  {
    headerMode: 'none',
    initialRouteName: 'FinorbitScreen',
  },
);

const ProNav = createStackNavigator(
  {
    ProfScreen: {screen: ProfScreen},
  },
  {
    headerMode: 'none',
    initialRouteName: 'ProfScreen',
  },
);

const LeadNav = createStackNavigator(
  {
    LeadList: {screen: LeadList},
  },
  {
    headerMode: 'none',
    initialRouteName: 'LeadList',
  },
);

//whole app nav
const AppNav = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: HomeNav,
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <Icon
            name={'home'}
            size={20}
            color={focused ? '#e61e25' : '#292929'}
          />
        ),
        tabBarOnPress: ({navigation, defaultHandler}) => {
          defaultHandler();
        },
        title: 'Home',
      },
    },
    LeadNav: {
      screen: LeadNav,
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <Icon
            name={'grid'}
            size={20}
            color={focused ? '#e61e25' : '#292929'}
          />
        ),
        tabBarOnPress: ({navigation, defaultHandler}) => {
          defaultHandler();
        },
        title: 'Leads',
      },
    },
    Fin: {
      screen: FinNav,
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <Icon
            name={'server'}
            size={20}
            color={focused ? '#e61e25' : '#292929'}
          />
        ),
        tabBarOnPress: ({navigation, defaultHandler}) => {
          defaultHandler();
        },
        title: 'Finorbit',
      },
    },
    Profile: {
      screen: ProNav,
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <Icon
            name={'user'}
            size={20}
            color={focused ? '#e61e25' : '#292929'}
          />
        ),
        tabBarOnPress: ({navigation, defaultHandler}) => {
          defaultHandler();
        },
        title: 'Profile',
      },
    },
  },
  {
    initialRouteName: 'Home',
    shifting: false,
    labeled: true,
    activeTintColor: '#e61e25',
    inactiveTintColor: Colors.grey300,
    backBehavior: 'none',
    sceneAnimationEnabled: true,
    barStyle: {backgroundColor: Colors.white},
    resetOnBlur: true,
  },
);

const WalletNav = createStackNavigator(
  {
    MyWallet: {screen: MyWallet},
    Redeem: {screen: Redeem},
  },
  {
    headerMode: 'none',
    initialRouteName: 'MyWallet',
  },
);

const FinOrbitNav = createStackNavigator(
  {
    FinorbitScreen: {screen: FinorbitScreen},
    FinorbitForm: {screen: FinorbitForm},
    NewForm: {screen: NewForm},
    Payment: {screen: Payment},
    VectorForm: {screen: VectorForm},
    VectorPayment: {screen: VectorPayment},
  },
  {
    headerMode: 'none',
    initialRouteName: 'FinorbitScreen',
  },
);

const BlogNav = createStackNavigator(
  {
    Blogs: {screen: Blogs},
    BlogDetails: {screen: BlogDetails},
  },
  {
    headerMode: 'none',
    initialRouteName: 'Blogs',
  },
);

const OfferNav = createStackNavigator(
  {
    MyOffers: {screen: MyOffers},
    OffersDetails: {screen: OffersDetails},
  },
  {
    headerMode: 'none',
  },
);


const OfferNav1 = createStackNavigator(
  {
    PopularPlan: {screen: PopularPlan},
    OffersDetails: {screen: OffersDetails},
  },
  {
    headerMode: 'none',
  },
);

const OfferNav2 = createStackNavigator(
  {
    MarketingTool: {screen: MarketingTool},
    OffersDetails: {screen: OffersDetails},
  },
  {
    headerMode: 'none',
  },
);

const SwitchTranNav = createSwitchNavigator(
  {
    Training: {screen: Training},
    Blogs: BlogNav,
  },
  {
    headerMode: 'none',
  },
);


const OtherNav = createDrawerNavigator(
  {
    Home: {screen: HomeScreen},
    FinorbitScreen: FinOrbitNav,
    ProfileScreen: {screen: ProfileScreen},
    MyWallet: WalletNav,
    OfferNav: OfferNav,
    OfferNav1:OfferNav1,
    OfferNav2:OfferNav2,
    ReferEarn: {screen: ReferEarn},
    AddTeam: {screen: AddTeam},
    ViewTeam: {screen: ViewTeam},
    SwitchTranNav:{screen:SwitchTranNav},
    Manager: {screen: Manager},
    LinkSharingOption: {screen: LinkSharingOption},
    Samadhan: {screen: Samadhan},
    Qrc: {screen: Qrc},
    Invoice: {screen: Invoice},
    As26: {screen: As26},
    Certificate: {screen: Certificate},
    ChangePass: {screen: ChangePass},
    Agreement: {screen: Agreement},
    LeadList: {screen: LeadList},
    ViewConnector: {screen: ViewConnector},
    TCondition: {screen: TCondition},
    Payout: {screen: Payout},
    AddConnector: {screen: AddConnector},
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
    drawerPosition: 'left',
    drawerType: 'front',
    statusBarAnimation: 'fade',
    resetOnBlur: true,
    // defaultNavigationOptions: {
    // 	drawerLockMode: 'unlocked',
    // },
    // edgeWidth: 0,
    minSwipeDistance: width,
    drawerWidth: WIDTH_DRAWER,
    contentComponent: (props) => <Sidebar {...props} />,
  },
);

const AuthRouter = createStackNavigator(
  {
    IntroScreen: IntroScreen,
    Login: LoginScreen,
    Register: RegisterScreen,
    OtpScreen: OtpScreen,
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none',
  },
);

/**
 * Navigation
 */
const Navigation = createSwitchNavigator(
  {
    AuthPage: AuthPage,
    Login: AuthRouter,
    OtherNav: OtherNav,
  },
  {
    initialRouteName: 'AuthPage',
    headerMode: 'none',
  },
);

export const AppContainer = createAppContainer(Navigation);
