import React, { useState, useEffect } from "react";
import { Animated, StyleSheet, Easing, Platform } from "react-native";

const Fade = props => {
    const [fadeAnim] = useState(new Animated.Value(0));

    const { body } = props;


    React.useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                easing: Easing.back(),
                duration: 800,
                useNativeDriver: Platform.OS === 'android'
            }
        ).start();
    }, [])

    return (
        <Animated.View
            style={{
                ...props.style,
                opacity: fadeAnim,
            }}
        >
            {body}
        </Animated.View>
    )
}


export default Fade;