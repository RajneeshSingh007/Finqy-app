import React from "react";
import { Linking, StatusBar, StyleSheet, TouchableOpacity, ScrollView, BackHandler, FlatList, TouchableWithoutFeedback, Dimensions, Platform } from "react-native";
import { Image, Screen, Subtitle, Title, View, Heading, NavigationBar, Text, Caption } from "@shoutem/ui";
import { sizeFont, sizeHeight, sizeWidth } from '../../util/Size';
import Icon from 'react-native-vector-icons/Feather';
import Icons from 'react-native-vector-icons/FontAwesome5';
import NavigationActions from "../../util/NavigationActions";
import { Colors } from 'react-native-paper';

const Row = props =>{

    const {iconName, title, subtitle, iconType = 0, screenName, data = {}, enableNav = true, onPressed} = props;

    return (
        <TouchableWithoutFeedback onPress={enableNav ? () => NavigationActions.navigate(screenName, data) : onPressed}>
            <View style={styles.container} styleName='horizontal'>
                {iconType === 0 ? <Icon name={iconName} size={24} style={styles.icon} /> : <Icons name={iconName} size={24} style={styles.icon} />}
                <View styleName='vertical' style={styles.insideContainer}>
                    <Title style={styles.title}> {title}</Title>
                    <Subtitle style={styles.subtitle}> {subtitle}</Subtitle>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: sizeWidth(3.5),
    },
    //#e21226
    icon: { color: '#181818', padding: 4, alignSelf: 'center', marginStart: sizeWidth(1) },
    subtitle: {
        fontSize: 15, fontFamily: 'Rubik', letterSpacing: 0.5, color: '#292929', alignSelf: 'center'
    },
    title: {
        fontSize: 16, fontFamily: 'Rubik', letterSpacing: 1, color: '#292929', alignSelf: 'flex-start', fontWeight: 'bold'
    },
    insideContainer: {
        paddingVertical: sizeHeight(2), marginStart: sizeWidth(2) 
    },
})

export default Row
