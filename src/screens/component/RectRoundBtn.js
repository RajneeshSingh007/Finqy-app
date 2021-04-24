import React from 'react';
import {View} from '@shoutem/ui';
import {StyleSheet, Pressable} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const RectRoundBtn = (props) => {
  const {
    onPress = () => {},
    child,
    height = 48,
    width = 48,
    style,
    styleName = 'vertical v-center h-center',
    bottomChild,
  } = props;
  return (
    <LinearGradient
      colors={['#eeeeee', '#eeeeee', '#f5f5f5']}
      style={{
        width: width,
        height: height,
        marginEnd: 6,
        marginStart: 6,
        borderRadius: 12,
        elevation: 4,
      }}>
      <View
        styleName={styleName} style={{
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center',
          width: '100%',
          height: '100%',
        }}>
        <Pressable
          onPress={() => {
            onPress();
          }}>
          {child}
        </Pressable>
        {bottomChild}
      </View>
    </LinearGradient>
  );
};

export default RectRoundBtn;

const styles = StyleSheet.create({
  roundbutton: {
    backgroundColor: 'white',
    width: 42,
    height: 42,
    elevation: 8,
    borderRadius: 42 / 4,
  },
});
