import React, { Component } from "react";
import { Colors, Modal, Portal } from "react-native-paper";
import { Spinner, Subtitle, Image } from "@shoutem/ui";
import { StyleSheet, Animated, View, BackHandler } from "react-native";
import { ACCENT_COLOR, PRIMARY_COLOR } from "./Pref";
import * as Pref from "./Pref";

export default class Loader extends React.PureComponent {
  constructor(props) {
    super(props);
    this.backClick = this.backClick.bind(this);
    this.animated = new Animated.Value(0);
    this.state = {
      value: 0,
      rotateImageStyle: {},
    };
  }

  componentDidMount() {
    this.animated.addListener(({ value }) => {
      this.setState({ value: value },() =>{
        const { isShow = false } = this.props;
        if(isShow == false){
          this.clearAnimation();
        }
      })
    });
    this.interval = setInterval(() => this.rotateAnimation(), 600);
    BackHandler.addEventListener("hardwareBackPress", this.backClick);
  }

  rotateAnimation = () => {
    const { isShow = false } = this.props;
    //if (isShow) {
      if (this.state.value >= 90) {
        Animated.spring(this.animated, {
          toValue: 0,
          tension: 10,
          friction: 8,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(this.animated, {
          toValue: 360,
          tension: 10,
          friction: 8,
          useNativeDriver: true,
        }).start();
      }
    // } else {
    //   this.clearAnimation();
    // }
  };

  clearAnimation = () => {
    this.animated.removeAllListeners();
    clearInterval(this.interval);
  };

  backClick = () => {
    const { isShow = false } = this.props;
    //console.log('isShow', isShow)
    if (isShow) {
      return true;
    } else {
      this.clearAnimation();
      return false;
    }
  };

  componentWillUnmount() {
    this.clearAnimation();
    BackHandler.removeEventListener("hardwareBackPress", this.backClick);
  }

  render() {
    const {
      isShow = false,
      title = "Please Wait...",
      bottomText = "",
    } = this.props;
    const emptyStyle = bottomText === "" ? { flex: 0.4 } : { flex: 4.5 };
    const interpolate = this.animated.interpolate({
      inputRange: [0, 180],
      outputRange: ["180deg", "360deg"],
    });

    const rotateImageStyle = {
      transform: [{ rotateY: interpolate }],
    };
    return isShow == true ? (
      <Portal>
        <View style={styles.topContainer}>
          <View style={emptyStyle}></View>
          <View
            style={StyleSheet.flatten([
              styles.container,
              {
                flex: bottomText === "" ? 0.2 : 3,
                width: bottomText === "" ? "40%" : "60%",
                alignContent: "center",
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "center",
                backgroundColor: "transparent",
              },
            ])}
          >
            <Animated.Image
              tintColor={"white"}
              styleName="v-center h-center"
              source={require("../res/images/q.png")}
              style={[styles.applogo, rotateImageStyle]}
            />
          </View>
          {/* <View
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

            <Image
              styleName="v-center h-center"
              source={require('../res/images/q.png')}
              style={styles.applogo}
            />
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
                  color: '#292929',
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
          </View> */}
          <View style={emptyStyle}></View>
        </View>
      </Portal>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0.2,
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "white",
    width: "40%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  topContainer: {
    //position: 'absolute',
    height: "100%",
    width: "100%",
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignContent: "center",
    alignSelf: "center",
    alignItems: "center",
  },
  applogo: {
    resizeMode: "contain",
    width: 42,
    height: 42,
    tintColor: Pref.DARK_RED,
  },
});
