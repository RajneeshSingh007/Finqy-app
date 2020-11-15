import React from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');
//import PropTypes from 'prop-types';

export default class Pulse extends React.PureComponent {

    // static propTypes = {
    //     size: PropTypes.number,
    //     pulseMaxSize: PropTypes.number,
    //     borderColor: PropTypes.string,
    //     backgroundColor: PropTypes.string,
    //     getStyle: PropTypes.func,
    //     interval: PropTypes.number,
    // };

    constructor(props) {
        super(props);
        this.anim = new Animated.Value(0);
    }

    componentDidMount() {
        Animated.timing(this.anim, {
            toValue: 1,
            duration: this.props.interval,
            easing: Easing.in,
            useNativeDriver: false,
        })
            .start();
    }

    componentWillUnmount() {
        this.anim.stopAnimation();
    }

    render() {
        const { size, pulseMaxSize, borderColor, backgroundColor, getStyle } = this.props;

        return (
            <View style={[styles.circleWrapper, {
                width: pulseMaxSize,
                height: pulseMaxSize,
            }]}>
                <Animated.View
                    style={[styles.circle, {
                        borderColor,
                        backgroundColor,
                        width: this.anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [size, pulseMaxSize]
                        }),
                        height: this.anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [size, pulseMaxSize]
                        }),
                        borderRadius: pulseMaxSize / 2,
                        opacity: this.anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0]
                        })
                    }, getStyle && getStyle(this.anim)]}
                />
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