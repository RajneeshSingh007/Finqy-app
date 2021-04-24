import React from 'react';
import {StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {Image, Subtitle, Title, View} from '@shoutem/ui';
import IconChooser from '../common/IconChooser';
import * as Pref from '../../util/Pref';

const IntroHeader = (prop) => {
  const {flex = 0.13, iconClick = () => {}, showRight = false} = prop;
  return (
    <View
      styleName="md-gutter"
      style={{
        flex: flex,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          flex: 1,
        }}>
        <View style={styles.leftcon}>
          <View
            style={{
              flex: 0.5,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            <Image
              source={require('../../res/images/squarelogo.png')}
              styleName="medium-wide"
              style={{
                marginStart: 16,
                resizeMode: 'contain',
              }}
            />
          </View>
          <View style={styles.rightcon}>
            {showRight === false ? (
              <>
                <TouchableWithoutFeedback onPress={iconClick}>
                  <View>
                    <Title style={styles.rightText}>
                      {`Login `}
                      <IconChooser
                        name={'arrow-right'}
                        size={20}
                        color={'#bbb8ac'}
                      />
                    </Title>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={iconClick}>
                  <View style={styles.circle}>
                    <IconChooser
                      name={'user'}
                      size={18}
                      color={'red'}
                      style={styles.icon}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </>
            ) : null}
          </View>
        </View>
      </View>
      <View style={styles.line} />
    </View>
  );
};

export default IntroHeader;

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
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  rightText: {
    color: '#bbb8ac',
    fontSize: 18,
    marginEnd: 8,
    letterSpacing: 0.5,
    fontFamily: Pref.getFontName(4),
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
