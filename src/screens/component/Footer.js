import React from 'react';
import {StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {Image, Subtitle, View} from '@shoutem/ui';
import IconChooser from '../common/IconChooser';
import {Avatar} from 'react-native-paper';

const Footer = (prop) => {
  const {flex = 0.13, iconClick = () => {}} = prop;
  return (
    <View
      styleName="md-gutter"
      style={{
        flex: flex,
        backgroundColor: '#f9f8f1',
      }}>
      <View
        style={{
          paddingVertical: 16,
        }}>
        <TouchableWithoutFeedback>
          <Subtitle style={styles.centerText}>{`2020`}</Subtitle>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback>
          <Subtitle style={styles.centerText}>{`About FinPro`}</Subtitle>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback>
          <Subtitle style={styles.centerText}>{`Read Term of use`}</Subtitle>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.line} />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'center',
          paddingVertical: 16,
        }}>
        <Subtitle style={styles.rightText}>{`Powered By`}</Subtitle>
        <Avatar.Image
          size={42}
          source={require('../../res/images/logo.png')}
          style={{
            backgroundColor: 'transparent',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
          }}
        />
      </View>
    </View>
  );
};

export default Footer;

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
    justifyContent:'center',
    paddingVertical:8,
    alignSelf:'center'
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
    backgroundColor: '#eeedde',
    height: 1.8,
    marginStart: 12,
    marginEnd: 12,
    marginVertical:8
  },
});
