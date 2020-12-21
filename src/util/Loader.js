import React, {Component} from 'react';
import {Colors, Modal, Portal} from 'react-native-paper';
import {Spinner, Subtitle, Image} from '@shoutem/ui';
import {StyleSheet, View, BackHandler} from 'react-native';
import {ACCENT_COLOR, PRIMARY_COLOR} from './Pref';
import * as Pref from './Pref';

export default class Loader extends React.Component {
  constructor(props) {
    super(props);
    this.backClick = this.backClick.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backClick);
  }

  backClick = () => {
    const {isShow = false} = this.props;
    //console.log('isShow', isShow)
    if (isShow) {
      return true;
    } else {
      return false;
    }
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
  }

  render() {
    const {
      isShow = false,
      title = 'Please Wait...',
      bottomText = '',
    } = this.props;
    const emptyStyle = bottomText === '' ? {flex: 0.4} : {flex: 4.5 };
    return isShow === true ? (
      <Portal>
        <View style={styles.topContainer}>
          <View style={emptyStyle}></View>
          <View
            style={StyleSheet.flatten([
              styles.container,
              {
                flex: bottomText === '' ? 0.2 : 3,
                width: bottomText === '' ? '40%':'60%',
                alignContent: 'center',
                flexDirection: 'column',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              },
            ])}>
            <Spinner
              size="large"
              style={{
                color: PRIMARY_COLOR,
              }}
            />
            <View
              style={{
                alignContent: 'center',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Subtitle
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#555555',
                  letterSpacing: 0.5,
                  alignContent: 'center',
                  justifyContent: 'center',
                  fontFamily: Pref.getFontName(3),
                }}>
                {title}
              </Subtitle>

              {bottomText != '' ? (
                <Subtitle
                  style={{
                    marginTop:16,
                    color: Colors.red500,
                    fontSize: 13,
                    fontWeight: '600',
                    paddingHorizontal: 14,
                    fontFamily: Pref.getFontName(1),
                  }}>
                  {bottomText}
                </Subtitle>
              ) : null}
            </View>
          </View>
          <View style={emptyStyle}></View>
        </View>
      </Portal>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0.2,
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'white',
    width: '40%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topContainer: {
    //position: 'absolute',
    height: '100%',
    width: '100%',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
});

//export default Loader;
