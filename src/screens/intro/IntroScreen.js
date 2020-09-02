import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {StyleSheet, Text, StatusBar} from 'react-native';
import {Colors} from 'react-native-paper';
import {Heading, Image, Screen, View, Subtitle, Title} from '@shoutem/ui';
import AppIntroSlider from 'react-native-app-intro-slider';
import NavigationActions from '../../util/NavigationActions';
import * as Pref from '../../util/Pref';
import {sizeHeight, sizeWidth} from '../../util/Size';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import IntroHeader from './IntroHeader';

const slides = [
  {
    key: 1,
    title: 'One stop\nshop for all',
    text: 'Financial Needs!',
    sub: `Cards, loans, insurance &\ninvestment,`,
    colorsub: `all in one place`,
    image: require('../../res/images/squarelogo.png'),
    backgroundColor: 'white',
  },
  {
    key: 2,
    title: 'Manage\nyour business',
    text: 'Anywhere anytime',
    sub: ` from lead\n management to final payouts`,
    colorsub: `100% online process`,
    image: {uri: `https://erb.ai/images/about/about.jpg`},
    backgroundColor: 'white',
  },
  {
    key: 3,
    title: 'Earn more\nincentives',
    text: 'get better rewards',
    sub: `Industry's best payouts and\n`,
    colorsub: `transparent incentive system`,
    image: {uri: `https://erb.ai/images/about/about.jpg`},
    backgroundColor: 'white',
  },
];

export default class IntroScreen extends React.PureComponent {
  componentDidMount() {
    changeNavigationBarColor('white', true, true);
    StatusBar.setBackgroundColor('white', false);
    StatusBar.setBarStyle('dark-content')
  }

  _renderItem = ({item, index}) => {
    return (
      <View style={styles.slide}>
        <View
          style={{
            flex: 1,
          }}>
          <View
            styleName="v-center h-center"
            style={{
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 0.4,
            }}>
            <Title style={styles.title}>{item.title}</Title>
            <Title style={styles.title1}>{item.text}</Title>
            <Subtitle
              style={StyleSheet.flatten([
                styles.subtitle,
                {
                  color: index === 1 ? '#0276ec' : '#bbb8ad',
                },
              ])}>
              {`${index === 1 ? item.colorsub : item.sub} `}
              <Subtitle
                style={StyleSheet.flatten([
                  styles.subtitle1,
                  {
                    color: index === 1 ? '#bbb8ad' : '#0276ec',
                  },
                ])}>
                {index === 1 ? item.sub : item.colorsub}
              </Subtitle>
            </Subtitle>
          </View>
          <Image
            source={item.image}
            styleName="medium"
            style={{
              flex: 0.5,
              resizeMode: 'contain',
              justifyContent:'center',
              alignSelf:'center'
            }}
          />
          <View style={{flex: 0.1}}></View>
        </View>
      </View>
    );
  };

  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="md-arrow-round-forward"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    );
  };
  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon name="md-checkmark" color="rgba(255, 255, 255, .9)" size={24} />
      </View>
    );
  };

  _onDone = () => {
    NavigationActions.navigate('Login');
  };

  render() {
    return (
      <Screen style={styles.mainContainer}>
        <IntroHeader iconClick={() => NavigationActions.navigate('Login')} />
        <View style={{flex: 0.87}}>
          <AppIntroSlider
            data={slides}
            renderItem={this._renderItem}
            renderDoneButton={this._renderDoneButton}
            renderNextButton={this._renderNextButton}
            onDone={this._onDone}
            showSkipButton={false}
            showPrevButton={false}
            showNextButton={false}
            showDoneButton={false}
            activeDotStyle={{
              backgroundColor: '#fa513c',
            }}
            dotStyle={{
              backgroundColor: '#e8e6df',
            }}
          />
        </View>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
  },
  circle: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 4,
    borderRadius: 48 / 2,
    borderColor: 'rgba(0,0,0,0.1)',
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: Pref.JET_BLACK,
  },
  line: {
    backgroundColor: '#dedede',
    height: 0.7,
    marginHorizontal: sizeWidth(3.5),
  },
  subtitle: {
    fontSize: 18,
    letterSpacing: 0.5,
    color: '#bbb8ad',
    alignSelf: 'center',
    fontWeight: '400',
    lineHeight: 24,
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: 12,
  },
  subtitle1: {
    fontSize: 18,
    letterSpacing: 0.5,
    color: '#0276ec',
    alignSelf: 'center',
    fontWeight: '400',
    lineHeight: 24,
    justifyContent: 'center',
    textAlign: 'center',
  },
  title: {
    fontSize: 30,
    letterSpacing: 0.5,
    color: '#555555',
    fontWeight: '700',
    lineHeight: 36,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  title1: {
    fontSize: 32,
    letterSpacing: 0.5,
    color: '#ea343c',
    fontWeight: '700',
    lineHeight: 36,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
  },
});
