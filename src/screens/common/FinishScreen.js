import React from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Title, View } from '@shoutem/ui';
import LeftHeader from './CommonLeftHeader';
import CScreen from '../component/CScreen';
import * as Pref from '../../util/Pref';
import NavigationActions from '../../util/NavigationActions';
import Codepush from 'react-native-code-push';

const FinishScreen = (prop) => {
  const { navigation } = prop;
  const topTitle = navigation.getParam('top', '');
  const redText = navigation.getParam('red', '');
  const greyText = navigation.getParam('grey', '');
  const blueText = navigation.getParam('blue', 'Back to main menu');
  const back = navigation.getParam('back', null);
  const profilerefresh = navigation.getParam('profilerefresh', -1);
  const options = navigation.getParam('options', {});

  const clicked = () => {
    if (profilerefresh === 1) {
      Codepush.restartApp();
      //NavigationActions.navigate('Home');
    } else {
      if (back === undefined || back === null) {
        NavigationActions.navigate('Home');
      } else if (back !== '' && back === 'back') {
        NavigationActions.goBack();
      } else if (back !== '' && back !== 'back') {
        NavigationActions.navigate(back,options);
      } else {
        NavigationActions.goBack();
      }
    }
  };

  return (
    <CScreen
      scrollEnable={false}
      body={
        <>
          <LeftHeader showBack title={`${topTitle}`} backClicked={clicked} />
          <View styleName="v-center h-center" style={styles.contain}>
            <Title style={styles.passText}>{`${redText}`}</Title>
            <Title
              style={StyleSheet.flatten([
                styles.passText,
                {
                  color: '#555555',
                  fontSize: 24,
                },
              ])}>{`${greyText}`}</Title>
            <TouchableWithoutFeedback onPress={clicked}>
              <Title
                style={StyleSheet.flatten([
                  styles.passText,
                  {
                    color: '#0270e3',
                    fontSize: 18,
                    fontWeight: '700',
                    marginTop: 8,
                    textDecorationColor: '#0270e3',
                    textDecorationStyle: 'solid',
                    textDecorationLine: 'underline',
                  },
                ])}>{`${blueText}`}</Title>
            </TouchableWithoutFeedback>
          </View>
          <View style={{ flex: 0.1, backgroundColor: '#f9f8f1' }}></View>
        </>
      }
    />
  );
};

export default FinishScreen;

const styles = StyleSheet.create({
  contain: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f8f1',
  },
  icon: {
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  leftcon: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passText: {
    fontSize: 24,
    letterSpacing: 0.5,
    color: Pref.RED,
    fontWeight: '700',
    lineHeight: 28,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  rightcon: {
    flex: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightText: {
    color: '#bbb8ac',
    fontSize: 18,
    marginEnd: 8,
    letterSpacing: 0.5,
  },
  circle: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 4,
    borderRadius: 48 / 2,
    borderColor: '#000',
    borderStyle: 'solid',
    borderWidth: 3,
  },
  line: {
    backgroundColor: '#f2f1e6',
    height: 1.2,
    marginStart: 12,
    marginEnd: 12,
    marginTop: 10,
  },
});
