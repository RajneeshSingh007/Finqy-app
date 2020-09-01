import React from 'react';
import {StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {Image, Subtitle, View} from '@shoutem/ui';
import IconChooser from '../common/IconChooser';
import {Avatar} from 'react-native-paper';
import * as Pref from '../../util/Pref';

const Download = (prop) => {
  const {
    rightIconClick = () => {},
    leftIconClick = () => {},
    showLeft = false,
    style,
  } = prop;
  return (
    <View
      styleName="md-gutter"
      style={StyleSheet.flatten([
        {
          backgroundColor: '#e8e5d7',
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        style,
      ])}>
      <TouchableWithoutFeedback onPress={leftIconClick}>
        <View
          style={StyleSheet.flatten([
            styles.circle,
            {
              backgroundColor: showLeft ? '#1bd741' : '#e8e5d7',
            },
          ])}>
          {showLeft === true ? (
            <IconChooser
              name={'whatsapp'}
              size={24}
              color={'white'}
              style={styles.icon}
              iconType={2}
            />
          ) : null}
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={rightIconClick}>
        <View style={styles.circle}>
          <IconChooser
            name={'download'}
            size={24}
            color={'white'}
            style={styles.icon}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Download;

const styles = StyleSheet.create({
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
  rightcon: {
    flex: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightText: {
    color: '#bfb9b4',
    fontSize: 18,
    marginEnd: 8,
    letterSpacing: 0.5,
  },
  centerText: {
    color: '#bfb9b4',
    fontSize: 18,
    marginEnd: 8,
    letterSpacing: 0.5,
    justifyContent: 'center',
    paddingVertical: 8,
    alignSelf: 'center',
  },
  circle: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 4,
    borderRadius: 16,
    //borderColor: '#000',
    //borderStyle: 'solid',
    //borderWidth: 3,
    backgroundColor: Pref.RED,
  },
  line: {
    backgroundColor: '#eeedde',
    height: 1.8,
    marginStart: 12,
    marginEnd: 12,
    marginVertical: 8,
  },
});
