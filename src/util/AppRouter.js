import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import { createStackNavigator } from 'react-navigation-stack';

import { createDrawerNavigator } from 'react-navigation-drawer';

//intro
import IntroScreen from './../screens/intro/IntroScreen';

//auth page
import AuthPage from './../screens/auth/AuthPage';
import RegisterScreen from './../screens/auth/RegisterScreen';
import LoginScreen from './../screens/auth/LoginScreen';
import OtpScreen from './../screens/auth/OtpScreen';

//home page
import HomeScreen from './../screens/home/HomeScreen';

//finorbit
import FinorbitScreen from './../screens/finorbit/FinorbitScreen';
import FinorbitForm from './../screens/finorbit/FinorbitForm';
import Samadhan from './../screens/finorbit/Samadhan';
import NewForm from './../screens/finorbit/NewForm';
import Payment from './../screens/finorbit/Payment';
import VectorForm from './../screens/finorbit/VectorForm';
import VectorPayment from './../screens/finorbit/VectorPayment';
import GetQuotes from './../screens/finorbit/GetQuotes';
import GetQuotesView from './../screens/finorbit/GetQuotesView';

//profile
import ProfileScreen from './../screens/profile/ProfileScreen';
import MyOffers from './../screens/profile/MyOffers';
import PopularPlan from './../screens/profile/PopularPlan';
import MarketingTool from './../screens/profile/MarketingTool';
import OffersDetails from './../screens/profile/OffersDetails';
import MyWallet from './../screens/profile/MyWallet';
import Redeem from './../screens/profile/Redeem';
import ReferEarn from './../screens/profile/ReferEarn';
import Certificate from './../screens/profile/Certificate';
import ChangePass from './../screens/profile/ChangePass';
import Agreement from './../screens/profile/Agreement';
import Term from './../screens/profile/Term';

//TicketSystem
import RaiseQueryForm from './../screens/ticketsystem/RaiseQueryForm';
import TrackQuery from './../screens/ticketsystem/TrackQuery';

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
import PayoutForm from './../screens/wallets/PayoutForm';
import PayoutPolicy from './../screens/wallets/PayoutPolicy';

//blog
import Blogs from './../screens/blogs/Blogs';
import BlogDetails from './../screens/blogs/BlogDetails';

import Training from './../screens/training/Training';

import Manager from './../screens/relmanager/Manager';
import Qrc from './../screens/helpdesk/Qrc';
import TCondition from './../screens/auth/TCondition';
import WebComp from '../screens/component/WebComp';
import FinishScreen from '../screens/common/FinishScreen';

/// Dialer Screens
import DialerCalling from '../screens/dialer/calling/DialerCalling';
import DialerRecords from '../screens/dialer/leads/DialerRecords';
import AllMembers from '../screens/dialer/leader/AllMembers';
import MemberReport from '../screens/dialer/leader/MemberReport';


import {
  Dimensions, Animated,
  Easing
} from 'react-native';
import Sidebar from './Sidebar';


let SlideFromBottom = (index, position, height) => {
  const translateY = position.interpolate({
    inputRange: [index - 1, index],
    outputRange: [height, 0],
  });

  return { transform: [{ translateY }] };
};

let CollapseTransition = (index, position) => {
  const opacity = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [0, 1, 1],
  });

  const scaleY = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [0, 1, 1],
  });

  return {
    opacity,
    transform: [{ scaleY }],
  };
};

const handleCustomTransition = () => {
  return {
    transitionSpec: {
      duration: 750,
      easing: Easing.out(Easing.poly(10)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: (sceneProps) => {
      const { layout, position, scene } = sceneProps;
      const width = layout.initWidth;
      const height = layout.initHeight;
      const { index, route } = scene;
      const params = route.params || {}; // <- That's new
      const transition = params.transition || 'default'; // <- That's new
      return {
        default: CollapseTransition(index, position, width),
        bottomTransition: SlideFromBottom(index, position, height),
        collapseTransition: CollapseTransition(index, position),
      }[transition];
    },
  };
};

const { width } = Dimensions.get('window');

const WIDTH_DRAWER = width * 0.8;

const WalletNav = createStackNavigator(
  {
    MyWallet: { screen: MyWallet },
    Redeem: { screen: Redeem },
  },
  {
    headerMode: 'none',
    initialRouteName: 'MyWallet',
    transitionConfig: (nav) => handleCustomTransition(nav),
  },
);

const FinOrbitNav = createStackNavigator(
  {
    FinorbitScreen: { screen: FinorbitScreen },
    FinorbitForm: { screen: FinorbitForm },
    NewForm: { screen: NewForm },
    Payment: { screen: Payment },
    VectorForm: { screen: VectorForm },
    VectorPayment: { screen: VectorPayment },
    GetQuotes: { screen: GetQuotes },
    GetQuotesView: { screen: GetQuotesView },
    Samadhan: { screen: Samadhan },
    transitionConfig: (nav) => handleCustomTransition(nav),
  },
  {
    headerMode: 'none',
    initialRouteName: 'FinorbitScreen',
  },
);

const BlogNav = createStackNavigator(
  {
    Blogs: { screen: Blogs },
    BlogDetails: { screen: BlogDetails },
    transitionConfig: (nav) => handleCustomTransition(nav),
  },
  {
    headerMode: 'none',
    initialRouteName: 'Blogs',
  },
);

const OfferNav = createStackNavigator(
  {
    MyOffers: { screen: MyOffers },
    OffersDetails: { screen: OffersDetails },
    transitionConfig: (nav) => handleCustomTransition(nav),
  },
  {
    headerMode: 'none',
  },
);


const OfferNav1 = createStackNavigator(
  {
    PopularPlan: { screen: PopularPlan },
    OffersDetails: { screen: OffersDetails },
    transitionConfig: (nav) => handleCustomTransition(nav),
  },
  {
    headerMode: 'none',
  },
);

const OfferNav2 = createStackNavigator(
  {
    MarketingTool: { screen: MarketingTool },
    OffersDetails: { screen: OffersDetails },
    transitionConfig: (nav) => handleCustomTransition(nav),
  },
  {
    headerMode: 'none',
  },
);

const SwitchTranNav = createSwitchNavigator(
  {
    Training: { screen: Training },
    Blogs: BlogNav,
  },
  {
    headerMode: 'none',
    transitionConfig: (nav) => handleCustomTransition(nav),
  },
);

const payoutNav = createStackNavigator({
  Payout: { screen: Payout },
  PayoutForm: {screen: PayoutForm}
}, {
  headerMode: 'none',
  transitionConfig: (nav) => handleCustomTransition(nav),
})


const TicketNav = createSwitchNavigator(
  {
    RaiseQueryForm: { screen: RaiseQueryForm },
    TrackQuery:{screen:TrackQuery}
  },
  {
    headerMode: 'none',
    resetOnBlur:true,
    transitionConfig: (nav) => handleCustomTransition(nav),
  },
);

const OtherNav = createDrawerNavigator(
  {
    Home: { screen: HomeScreen },
    FinorbitScreen: FinOrbitNav,
    ProfileScreen: { screen: ProfileScreen },
    MyWallet: WalletNav,
    OfferNav: OfferNav,
    OfferNav1: OfferNav1,
    OfferNav2: OfferNav2,
    ReferEarn: { screen: ReferEarn },
    AddTeam: { screen: AddTeam },
    ViewTeam: { screen: ViewTeam },
    Manager: { screen: Manager },
    LinkSharingOption: { screen: LinkSharingOption },
    Qrc: { screen: Qrc },
    Invoice: { screen: Invoice },
    SwitchTranNav: SwitchTranNav,
    As26: { screen: As26 },
    Certificate: { screen: Certificate },
    ChangePass: { screen: ChangePass },
    Agreement: { screen: Agreement },
    LeadList: { screen: LeadList },
    ViewConnector: { screen: ViewConnector },
    TCondition: { screen: TCondition },
    AddConnector: { screen: AddConnector },
    Finish: { screen: FinishScreen },
    Term: { screen: Term },
    WebComp: { screen: WebComp },
    Payout: { screen: payoutNav },
    PayoutPolicy:{screen:PayoutPolicy},
    
    TicketNav:{screen:TicketNav},
    DialerCalling:{screen:DialerCalling},
    DialerRecords:{screen:DialerRecords},
    AllMembers:{screen:AllMembers},
    MemberReport:{screen:MemberReport}  
 
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
    transitionConfig: (nav) => handleCustomTransition(nav),
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
    initialRouteName: 'IntroScreen',
    headerMode: 'none',
    transitionConfig: (nav) => handleCustomTransition(nav),
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
    transitionConfig: (nav) => handleCustomTransition(nav),
  },
);

export const AppContainer = createAppContainer(Navigation);
