import React, { useState, useEffect} from "react";
import { Animated, StyleSheet, Easing, Platform} from "react-native";
import { TouchableOpacity, Image, Screen, Subtitle, Title, View,} from "@shoutem/ui";
import { Button, Card, Colors, Snackbar, TextInput, DataTable, Modal, Portal, Avatar } from "react-native-paper";
import NavigationActions from '../../util/NavigationActions';
import { sizeFont, sizeHeight, sizeWidth } from '../../util/Size';

const CardRow = props =>{
    const [fadeAnim] = useState(new Animated.Value(0));

    const {cardStyle, color, clickName, title, subtitle, url, item = {},showImage = true,absoluteBody,titleColor='#292929',subtitleColor='#292929'} = props;


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

    return(
        <Card elevation={2} style={[styles.card, { backgroundColor: color }, cardStyle]} onPress={() => NavigationActions.navigate(clickName, item)}>
            <Animated.View
                style={{
                    ...props.style,
                    opacity: fadeAnim,
                }}
            >
                <View style={styles.cardContainer}>
                    <View style={{ alignSelf: 'center', justifyContent: 'center', flex: showImage ? 0.7 : 1, flexWrap: showImage ? 'wrap' : 'nowrap', paddingVertical: !showImage ? 12 : 0 }}>
                        <Title style={{
                            fontSize: 17, fontFamily: 'Rubik', letterSpacing: 1, color: titleColor, alignSelf: 'flex-start', fontWeight: '700',}}> {title}</Title>
                        <Subtitle styleName='wrap' style={{
                            fontSize: 15, fontFamily: 'Rubik', letterSpacing: 1, color: subtitleColor,
                            fontWeight: '400',}}> {subtitle}</Subtitle>
                    </View>
                    {showImage ? <Image styleName='medium' source={url} style={styles.cardRight} /> : null}
                </View>
                {absoluteBody}
            </Animated.View>
        </Card>
    )
}

const styles = StyleSheet.create({
    card:{
        marginHorizontal: sizeWidth(4), marginVertical: sizeHeight(2),
         paddingVertical: sizeHeight(2), 
         paddingHorizontal: sizeWidth(1) 
    },
    cardLeft:{
        alignSelf: 'center', justifyContent: 'center', flex: 0.7, 
    },
    cardRight:{
        alignSelf: 'center', justifyContent: 'center', flex: 0.3, marginStart: 4 ,
        resizeMode:'contain',
    },
    cardContainer:{
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
        marginHorizontal: sizeWidth(2.5),
         flex: 1, flexBasis: 1
    },
    subtitle: {
        fontSize: 14, fontFamily: 'Rubik', letterSpacing: 1, color: '#292929', alignSelf: 'center',
        fontWeight: '400',
    },
    title: {
        fontSize: 18, fontFamily: 'Rubik', letterSpacing: 1, color: '#292929', alignSelf: 'flex-start', fontWeight: '700',
    }
})

export default CardRow;