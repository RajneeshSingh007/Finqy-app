import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, ScrollView} from 'react-native';
import {Image, Subtitle, View, Title} from '@shoutem/ui';
import IconChooser from '../common/IconChooser';

const StepIndicator = prop => {
  const {stepCount = 2, activeCounter = 0, positionClicked = pos => {}} = prop;
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
                        activeCounter === index ? 'transparent' : '#707070',
                      borderWidth: activeCounter === index ? 0 : 2,
                      backgroundColor:
                        activeCounter === index ? '#0270e3' : 'white',
                    },
                  ])}>
                  <Title
                    style={StyleSheet.flatten([
                      styles.rightText,
                      {
                        color: activeCounter === index ? 'white' : '#707070',
                      },
                    ])}>{`${incr}`}</Title>
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

export default StepIndicator;

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
    color: 'white',
    fontSize: 16,
    letterSpacing: 0.5,
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 4,
    borderRadius: 36 / 2,
  },
  line: {
    color: '#707070',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 4,
  },
});
