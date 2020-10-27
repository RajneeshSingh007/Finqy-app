import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { sizeWidth, sizeHeight } from '../../util/Size';
import { Dimensions, TouchableWithoutFeedback, TextInput } from 'react-native';
import { View, Caption, Title } from '@shoutem/ui';
import * as Pref from '../../util/Pref';
import IconChooser from '../common/IconChooser';
import * as Helper from '../../util/Helper';

const height = Dimensions.get('window').height;

export default class AnimatedInputBox extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
    };
  }
  componentWillMount() {
    this._animatedIsFocused = new Animated.Value(
      this.props.value === '' ? 0 : 1,
    );
  }

  handleFocus = () => {
    this.setState({ isFocused: true });
    this.animate();
  };
  handleBlur = () => {
    this.setState({ isFocused: false });
    this.animate();
  };

  animate = () => {
    Animated.timing(this._animatedIsFocused, {
      toValue: !this.state.isFocused || this.props.value !== '' ? 1 : 0,
      duration: 400,
    }).start();
  };

  componentDidUpdate() {
    if (this.state.isFocused === false) {
      Animated.timing(this._animatedIsFocused, {
        toValue: this.props.value !== '' ? 1 : 0,
        duration: 400,
      }).start();
    }
  }

  render() {
    const {
      value = '',
      onChangeText = () => { },
      leftTextClick = () => { },
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
      showPlaceholder = true,
      leftTextFlex = 0.3,
      inputHeight = 0.09,
      placecolor = '#6d6a57',
      changecolor = false,
      placefont = 14,
      boldinputText = false,
      enableWords = false,
      ...prop
    } = this.props;
    const contentExists = String(value).trim().length > 0 ? true : false;
    const { isFocused } = this.state;
    return (
      <>
      <View
        styleName="sm-gutter"
        style={StyleSheet.flatten([
          {
            backgroundColor: 'white',
            height: height * inputHeight,
          },
          containerstyle,
        ])}>
        {showPlaceholder ? (
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              top: !isFocused ? sizeHeight(2) : 0,
              top: this._animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
              marginStart: 4,
            }}>
            <Caption
              style={StyleSheet.flatten([
                {
                  fontSize: placefont,
                  fontWeight: '700',
                  color:
                    changecolor && (isFocused || contentExists)
                      ? Pref.RED
                      : placecolor,
                  fontFamily: Pref.getFontName(4),
                },
                placeholderStyle,
              ])}>{`${placeholder}`}</Caption>
          </Animated.View>
        ) : null}
        <View
          style={StyleSheet.flatten([
            styles.inputcontainer,
            {
              //marginTop: -8,
              borderBottomWidth: 1.3,
              borderBottomColor:
                showline === true ? 'green' : !isFocused ? '#f2f1e6' : Pref.RED,
            },
          ])}>
          {showLeftIcon === true ? (
            <View style={{ flex: 0.1 }}>
              <IconChooser
                name={rightIconName}
                size={rightIconSize}
                color={rightIconColor}
              />
            </View>
          ) : null}
          <TextInput
            {...prop}
            underlineColorAndroid={'rgba(0,0,0,0)'}
            value={value}
            onChangeText={onChangeText}
            style={StyleSheet.flatten([
              styles.input,
              {
                //flex: 4,
                marginTop: !isFocused ? 10 : 24,
                marginBottom: isFocused ? 10 : 0,
                fontWeight: boldinputText ? '700' : '400',
                color: '#555555',
                fontSize: 16,
                marginStart: -4,
                fontFamily: Pref.getFontName(4),
              },
            ])}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          {leftText === true ? (
            <TouchableWithoutFeedback onPress={leftTextClick}>
              <View style={{ flex: leftTextFlex }}>
                <Caption style={leftTextStyle}>{`${leftTextContent}`}</Caption>
              </View>
            </TouchableWithoutFeedback>
          ) : (
              <View style={{ flex: 0.1 }}>
                {showRightIcon ? (
                  <TouchableWithoutFeedback onPress={leftTextClick}>
                    <View>
                      <IconChooser
                        name={leftIconName}
                        size={leftIconSize}
                        color={leftIconColor}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                ) : null}
              </View>
            )}
        </View>
      </View>
      {enableWords === true && value !== '' ? 
      <View style={{
        marginStart:16,
        marginTop:-8
      }}>
                <Title style={{
          fontSize: 13,
          color:'#555',
          //fontWeight:'700',
                            fontFamily: Pref.getFontName(5),
        }}>{Helper.inWords(value)}</Title>
      </View>
      : null}
      </>
    );
  }
}

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
  inh: { marginHorizontal: sizeWidth(5), flex: 1 },
  apptitle: {
    color: Pref.PRIMARY_COLOR,
    fontSize: 20,
    letterSpacing: 0.1,
    fontWeight: '700',
  },
  logintext: { letterSpacing: 0.5, fontSize: 18, color: 'white' },
  buttonlogin: {
    backgroundColor: Pref.PRIMARY_COLOR,
    height: 48,
    borderRadius: 8,
    //width: '70%',
    borderColor: 'transparent',
  },
  input: {
    height: 56,
    //flex: 0.8,
    color: 'black',
    letterSpacing: 0.5,
    width: '100%',
    //alignSelf : 'flex-start',
    //alignContent:'flex-start',
    //justifyContent:'flex-start',
    textAlign: 'left',
    //flexGrow:1
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
  topcontainer: { flex: 0.15, backgroundColor: Pref.PRIMARY_COLOR },
  logincontainer: { flex: 0.85, backgroundColor: Pref.PRIMARY_COLOR },
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
  container: { flex: 1 },
});
