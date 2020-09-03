import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Subtitle} from '@shoutem/ui';
import * as Pref from '../../util/Pref';
import {Colors, TextInput, DefaultTheme} from 'react-native-paper';
import {sizeHeight, sizeWidth} from '../../util/Size';
import AnimatedInputBox from '../component/AnimatedInputBox';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'transparent',
    accent: 'transparent',
    backgroundColor: Colors.white,
    surface: Colors.white,
  },
};

const themeold = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#767676',
    accent: '#767676',
  },
};

const CustomForm = (props) => {
  const {
    editable = true,
    disabled = false,
    heading = `Personal Details`,
    showheader = false,
    style,
    value = '',
    label = '',
    placeholder = '',
    onChange = () => {},
    showTopText = false,
  } = props;

  return (
    <View style={style}>
      {showheader ? (
        <View>
          <View
            style={{
              marginTop: sizeHeight(2),
              marginBottom: sizeHeight(1),
            }}
            styleName="horizontal">
            <View styleName="vertical" style={{marginStart: sizeWidth(2)}}>
              <Subtitle style={styles.title}> {heading}</Subtitle>
            </View>
          </View>
          <View style={styles.line} />
        </View>
      ) : null}
      <AnimatedInputBox
        {...props}
        placeholder={label || ``}
        onChangeText={onChange}
        value={value}
        editable={editable}
        disabled={disabled}
        returnKeyType={'next'}
        changecolor
        containerstyle={StyleSheet.flatten([styles.animatedInputCont, style])}
      />
      {/* <TextInput
          {...props}
          mode="flat"
          underlineColor="transparent"
          underlineColorAndroid="transparent"
          style={[
            styles.inputStyle,
            // { marginVertical: sizeHeight(0.5) },
            style,
          ]}
          label={label || ``}
          placeholder={placeholder || ``}
          placeholderTextColor={'#DEDEDE'}
          onChangeText={onChange}
          value={value}
          //theme={showTopText ? themeold : theme}
          theme={theme}
          editable={editable}
          disabled={disabled}
          returnKeyType={'next'}
        /> */}
    </View>
  );
};

export default CustomForm;

/**
 * styles
 */
const styles = StyleSheet.create({
  animatedInputCont: {
    marginStart: 10,
    marginEnd: 10,
    paddingVertical: 10,
  },
  line: {
    backgroundColor: Pref.RED,
    height: 1.2,
    marginHorizontal: sizeWidth(3),
    marginTop: 4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Rubik',
    fontFamily: 'bold',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Rubik',
    fontFamily: 'bold',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
  },
  inputStyle: {
    backgroundColor: 'white',
    color: '#292929',
    borderBottomColor: '#dedede',
    fontFamily: 'Rubik',
    fontSize: 16,
    borderBottomWidth: 0.5,
    fontWeight: '400',
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
    height: 48,
  },
});
