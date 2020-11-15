import React from "react";
import { View, Image, TouchableOpacity, Animated, Easing, Text, StyleSheet} from "react-native";
import Pulse from "./Pulse";
//import PropTypes from "prop-types";
import { Avatar, Colors } from "react-native-paper";

export default class PulseLoader extends React.PureComponent {
    // static propTypes = {
    //     interval: PropTypes.number,
    //     size: PropTypes.number,
    //     pulseMaxSize: PropTypes.number,
    //     avatar: PropTypes.any,
    //     avatarBackgroundColor: PropTypes.string,
    //     pressInValue: PropTypes.number,
    //     pressDuration: PropTypes.number,
    //     borderColor: PropTypes.string,
    //     backgroundColor: PropTypes.string,
    //     getStyle: PropTypes.func,
    //     elevation: PropTypes.number,
    //     pressed: PropTypes.func,
    //     topText: PropTypes.string,
    //     bottomText: PropTypes.string,
    //     topTextStyle: PropTypes.any,
    //     bottomTextStyle: PropTypes.any,
    //     showText: PropTypes.bool,
    // };
    constructor(props) {
        super(props);

        this.state = {
            circles: []
        };

        this.counter = 1;
        this.setInterval = null;
        this.anim = new Animated.Value(1);
        this.anim1 = new Animated.Value(0);
    }

    componentDidMount() {
        this.setCircleInterval();
    }

    setCircleInterval() {
        this.setInterval = setInterval(
            this.addCircle.bind(this),
            this.props.interval
        );
        this.addCircle();
    }

    addCircle() {
        this.setState({ circles: [...this.state.circles, this.counter] });
        this.counter++;
        Animated.timing(this.anim1, {
            toValue: 1,
            duration: this.props.interval,
            easing: Easing.in,
            useNativeDriver: false,
        })
            .start();
    }

    onPressIn() {
        Animated.timing(this.anim, {
            toValue: this.props.pressInValue,
            duration: this.props.pressDuration,
            easing: this.props.pressInEasing,
            useNativeDriver: true
        }).start(() => clearInterval(this.setInterval));
    }

    onPressOut() {
        Animated.timing(this.anim, {
            toValue: 1,
            duration: this.props.pressDuration,
            easing: this.props.pressOutEasing,
            useNativeDriver: true
        }).start(this.setCircleInterval.bind(this));
    }

    componentWillUnmount() {
        this.anim.stopAnimation();
        this.anim1.stopAnimation();
        clearInterval(this.setInterval);
    }
    render() {
        const {
            size,
            avatar,
            avatarBackgroundColor,
            interval,
            elevation,
            pressed,
            showText,
            topText,
            topTextStyle,
            bottomText,
            bottomTextStyle
        } = this.props;
        const { pulseMaxSize, borderColor, backgroundColor, getStyle } = this.props;

        return (
            <View style={[styles.circleWrapper, {
                width: pulseMaxSize,
                height: pulseMaxSize,
            }]}>
                <Animated.View
                    style={[styles.circle, {
                        borderColor,
                        backgroundColor,
                        width: this.anim1.interpolate({
                            inputRange: [0, 1],
                            outputRange: [size, pulseMaxSize]
                        }),
                        height: this.anim1.interpolate({
                            inputRange: [0, 1],
                            outputRange: [size, pulseMaxSize]
                        }),
                        borderRadius: pulseMaxSize / 2,
                        opacity: this.anim1.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0]
                        })
                    }, getStyle && getStyle(this.anim1)]}
                />
                <View
                    style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",

                    }}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={pressed}
                        //onPressIn={this.onPressIn.bind(this)}
                        //onPressOut={this.onPressOut.bind(this)}
                        style={{
                            transform: [
                                {
                                    scale: this.anim
                                }
                            ],
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <View style={{ width: size, height: size, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                            <Text
                                style={[{ color: Colors.black, fontSize: 18, fontWeight: "bold", alignSelf: 'center', justifyContent: 'center' }, topTextStyle]}
                            >
                                {topText}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    circleWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute',
    },
    circle: {
        borderWidth: 4 * StyleSheet.hairlineWidth,
    },
});