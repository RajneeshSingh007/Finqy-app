import React from 'react';
import {StyleSheet, Platform, Text} from 'react-native';
import {sizeWidth, sizeHeight} from '../../../util/Size';
import {Dimensions, TouchableWithoutFeedback, TextInput} from 'react-native';
import {View, Caption, Title} from '@shoutem/ui';
import * as Pref from '../../../util/Pref';
import IconChooser from '../../common/IconChooser';
import * as Helper from '../../../util/Helper';

export default class InputBox extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onContentSizeChange = this.onContentSizeChange.bind(this);
    this.state = {
      isFocused: false,
      height: 42,
    };
  }

  componentWillMount() {
    // this._animatedIsFocused = new Animated.Value(
    //   this.props.value === '' ? 0 : 1,
    // );
  }

  handleFocus = () => {
    // this.setState({ isFocused: true });
    // this.animate();
  };

  handleBlur = () => {
    // this.setState({ isFocused: false });
    // this.animate();
  };

  animate = () => {
    // Animated.timing(this._animatedIsFocused, {
    //   toValue: !this.state.isFocused || this.props.value !== '' ? 1 : 0,
    //   duration: 250,
    // }).start();
  };

  componentDidUpdate() {
    // if (this.state.isFocused === false) {
    //   Animated.timing(this._animatedIsFocused, {
    //     toValue: this.props.value !== '' ? 1 : 0,
    //     duration: 250,
    //   }).start();
    // }
  }

  onContentSizeChange = e => {
    const {width, height} = e.nativeEvent.contentSize;
    //console.log('he', height)
    const {multiline} = this.props;
    this.setState({
      height: Number(height) >= 42 ? height : multiline !== null && multiline !== undefined ? 42 : 42,
    });
  };

  render() {
    const {
      value = '',
      onChangeText = () => {},
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
      showPlaceholder = true,
      leftTextFlex = 0.3,
      inputHeight = 0.09,
      placecolor = '#000',
      changecolor = false,
      placefont = 13,
      boldinputText = false,
      enableWords = false,
      showStarVisible = false,
      ...prop
    } = this.props;
    return (
      <>
        <View
          styleName="sm-gutter"
          style={StyleSheet.flatten([styles.mainContainer])}>
          {showPlaceholder ? (
            <Title style={styles.placeholder}>{`${placeholder}${showStarVisible ? ' *' : ''}`}</Title>
          ) : null}
          <View style={styles.inputcontainer}>
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
              style={StyleSheet.flatten([
                styles.input,
                {
                  fontWeight: boldinputText ? '700' : '400',
                  height:this.state.height
                },
              ])}
            //   onFocus={this.handleFocus}
            //   onBlur={this.handleBlur}
              onContentSizeChange={this.onContentSizeChange}
              underlineColorAndroid={'transparent'}
            />
            {leftText === true ? (
              <TouchableWithoutFeedback onPress={leftTextClick}>
                <View style={{flex: leftTextFlex}}>
                  <Caption
                    style={leftTextStyle}>{`${leftTextContent}`}</Caption>
                </View>
              </TouchableWithoutFeedback>
            ) : (
              <View style={{flex: 0.1}}>
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
        {enableWords === true && value !== '' ? (
          <View
            style={{
              marginStart: 10,
            }}>
            <Title
              style={{
                fontSize: 12,
                color: '#000',
                fontFamily: Pref.getFontName(5),
              }}>
              {Helper.inWords(value)}
            </Title>
          </View>
        ) : null}
      </>
    );
  }
}

const styles = StyleSheet.create({
  placeholder: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    fontFamily: Pref.getFontName(5),
    lineHeight:24,
    letterSpacing:0.2
  },
  mainContainer: {
    backgroundColor: 'white',
    marginHorizontal:3,
  },
  inputcontainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    flexGrow: 1,
    borderColor: Pref.RED,
    borderWidth: 1.1,
    borderRadius: 4,
  },
  input: {
    height: 42,
    color: '#000',
    width: '100%',
    textAlign: 'left',
    padding: 6,
    ...Platform.select({
      android: {
        textAlignVertical: 'top',
      },
    }),
    fontSize: 14,
    fontFamily: Pref.getFontName(4),
    lineHeight:24,
    letterSpacing:0.2
  },
});
