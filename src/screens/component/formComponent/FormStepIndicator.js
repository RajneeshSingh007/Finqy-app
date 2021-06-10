import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, ScrollView} from 'react-native';
import {Image, Subtitle, View, Title} from '@shoutem/ui';
import IconChooser from '../../common/IconChooser';
import * as Pref from '../../../util/Pref';

const FormStepIndicator = (prop) => {
  const {
    stepCount = 2,
    activeCounter = 0,
    positionClicked = (pos) => {},
  } = prop;
  const fillArray = Array(stepCount).fill(0);
  return (
    <ScrollView
      horizontal
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        styleName="md-gutter"
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {fillArray.map((io, index) => {
          const incr = index + 1;
          return (
            <>
              <TouchableWithoutFeedback onPress={() => positionClicked(index)}>
                <View
                  style={StyleSheet.flatten([
                    styles.circle,
                    {
                      borderColor:
                        index < activeCounter ? 'transparent' : '#e02d2d8c',
                      borderWidth: index < activeCounter ? 0 : 1.5,
                      backgroundColor:
                        index < activeCounter ? Pref.RED : 'white',
                    },
                  ])}>
                  {index < activeCounter ? (
                    <IconChooser
                      name="check"
                      size={18}
                      color={'white'}
                      style={{
                        alignSelf: 'center',
                      }}
                    />
                  ) : (
                    <Title style={styles.rightText}>{`${incr}`}</Title>
                  )}
                </View>
              </TouchableWithoutFeedback>
              {index === stepCount - 1 ? null : (
                <Title style={styles.line}>{`----`}</Title>
              )}
            </>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default FormStepIndicator;

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
    color: '#000',
    fontSize: 14,
    fontFamily: Pref.getFontName(3),
    lineHeight: 24,
    letterSpacing: 0.2,
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 4,
    borderRadius: 30 / 2,
  },
  line: {
    color: 'rgba(0,0,0,0.6)',
    fontSize: 24,
    letterSpacing: 4,
    fontFamily: Pref.getFontName(4),
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
