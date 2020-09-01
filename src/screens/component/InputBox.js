import React from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import {View, Caption} from '@shoutem/ui';
import * as Pref from '../../util/Pref';
import {sizeWidth, sizeHeight} from '../../util/Size';
import IconChooser from '../common/IconChooser';

/**
 * InputBox
 */

const InputBox = (props) => {
  const {
    value,
    onChangeText = (v) => {},
    leftTextClick = () => {},
    placeholder,
    leftText = false,
    leftTextStyle,
    leftIconName = 'check',
    leftIconSize = 20,
    leftIconColor = 'green',
    rightIconName = 'user',
    rightIconSize = 20,
    rightIconColor = '#dedede',
    placeholderStyle,
    showRightIcon = false,
    containerstyle,
    showline = false,
    leftTextContent = '',
    showLeftIcon = false,
    borderBottomColor = '#000',
    showPlaceholder= true,
    leftTextFlex = 0.3,
    inputHeight = 0.1,
    ...prop
  } = props;

  const height = Dimensions.get('window').height;

  return (
    <View
      styleName="sm-gutter"
      style={StyleSheet.flatten([
        {backgroundColor: 'white', height: height * inputHeight},
        containerstyle,
      ])}>
      {showPlaceholder ? (
        <Caption style={placeholderStyle}>{`${placeholder}`}</Caption>
      ) : null}
      <View
        style={StyleSheet.flatten([
          styles.inputcontainer,
          {
            //marginTop: -8,
            borderBottomWidth: 1,
            borderBottomColor: showline === true ? 'green' : borderBottomColor,
          },
        ])}>
        {showLeftIcon === true ? (
          <View style={{flex: 0.1}}>
            <IconChooser
              name={rightIconName}
              size={rightIconSize}
              color={rightIconColor}
            />
          </View>
        ) : null}
        <TextInput
          {...prop}
          value={value}
          onChangeText={onChangeText}
          style={StyleSheet.flatten([styles.input, {flex: 1}])}
        />
        {leftText === true ? (
          <TouchableWithoutFeedback onPress={leftTextClick}>
            <View style={{flex: leftTextFlex}}>
              <Caption style={leftTextStyle}>{`${leftTextContent}`}</Caption>
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <View style={{flex: 0.1}}>
            {showRightIcon ? (
              <IconChooser
                name={leftIconName}
                size={leftIconSize}
                color={leftIconColor}
              />
            ) : null}
          </View>
        )}
      </View>
    </View>
  );
};

export default InputBox;

const styles = StyleSheet.create({
  inputcontainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
  },
  logotitle: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  forgot: {
    fontSize: 14,
    letterSpacing: 0.5,
    lineHeight: 24,
    color: 'black',
    marginStart: 4,
  },
  loginco: {
    flex: 0.23,
    justifyContent: 'center',
    alignItems: 'center',
    marginStart: 4,
    marginTop: 12,
  },
  inh: {marginHorizontal: sizeWidth(5), flex: 1},
  apptitle: {
    color: Pref.PRIMARY_COLOR,
    fontSize: 20,
    letterSpacing: 0.1,
    fontWeight: '700',
  },
  logintext: {letterSpacing: 0.5, fontSize: 18, color: 'white'},
  buttonlogin: {
    backgroundColor: Pref.PRIMARY_COLOR,
    height: 48,
    borderRadius: 8,
    //width: '70%',
    borderColor: 'transparent',
  },
  input: {
    height: 56,
    flex: 0.8,
    color: 'black',
  },
  input1: {
    marginTop: sizeHeight(2.5),
    marginBottom: sizeHeight(2),
    height: 54,
    backgroundColor: '#f1f3f7',
    borderColor: '#dedede',
    borderRadius: 8,
    color: 'black',
  },
  topcontainer: {flex: 0.15, backgroundColor: Pref.PRIMARY_COLOR},
  logincontainer: {flex: 0.85, backgroundColor: Pref.PRIMARY_COLOR},
  insidelogincontainer: {
    flex: 1,
    backgroundColor: Pref.WHITE_COLOR,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopColor: '#f1f3f7',
    position: 'absolute',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    borderStartWidth: 1,
    borderColor: '#f1f3f7',
  },
  container: {flex: 1},
});
