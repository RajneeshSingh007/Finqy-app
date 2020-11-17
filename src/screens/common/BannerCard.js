import React, { useState } from "react";
import { Animated, StyleSheet, Easing, Platform } from "react-native";
import { Image, } from "@shoutem/ui";
import { Card } from "react-native-paper";
import { sizeHeight, sizeWidth } from '../../util/Size';

const BannerCard = props => {
    const [fadeAnim] = useState(new Animated.Value(0));

    const { cardStyle, url = require('../../res/images/notify.jpg')} = props;


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
        <Card elevation={4} style={[styles.card, cardStyle]}>
            <Animated.View
                style={{
                    ...props.style,
                    opacity: fadeAnim,
                }}
            >
                <Image styleName='large-ultra-wide' source={url} style={styles.images} />
            </Animated.View>
        </Card>
    )
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: sizeWidth(4), 
        marginVertical: sizeHeight(2),
        borderRadius:4,
        //paddingVertical: sizeHeight(2),
        //paddingHorizontal: sizeWidth(1)
    },
    images:{
        flex:1,
        width:'100%',
        borderRadius: 4,
    }
})

export default BannerCard;