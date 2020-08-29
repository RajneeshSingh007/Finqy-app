
import React from "react";
import { Linking, StatusBar, StyleSheet, TouchableOpacity, ScrollView, BackHandler, FlatList, TouchableWithoutFeedback, Dimensions, Platform, View } from "react-native";
import * as Pref from '../../util/Pref';
import { Avatar, List, Checkbox, Chip, Button, Card, Colors, Snackbar, TextInput, DataTable, Modal, Portal, DefaultTheme } from "react-native-paper";
import NavigationActions from '../../util/NavigationActions';
import { sizeFont, sizeHeight, sizeWidth } from '../../util/Size';
import Icon from 'react-native-vector-icons/Feather';
import Icons from 'react-native-vector-icons/FontAwesome5';
import { Heading } from '@shoutem/ui';

const Headers = props =>{
   
    const { title, url = { uri: Pref.profileDefaultPic },style, showAvtar = false} = props;

    return(
        <View style={[styles.container, style]}>
            {showAvtar ? <View style={styles.outerCircle}>
                <View style={styles.innerCircle}>
                    <Avatar.Image source={url} style={styles.avatar} size={84} backgroundColor={'transparent'} />
                </View>
            </View> : null}
            <Heading style={styles.heading}> {title}</Heading>
        </View>
    )
}

const styles = StyleSheet.create({
    avatar:{
        alignSelf: 'center' 
    },
    container: {
        backgroundColor: Pref.PRIMARY_COLOR, alignContent: 'center', justifyContent: 'center', elevation: 4,borderBottomLeftRadius:64,
        paddingVertical:sizeHeight(3)
    },
    outerCircle:{
        width: 100, height: 100, borderRadius: 100 / 2, borderColor: '#dedede', alignContent: 'center', alignSelf: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.2)' 
    },
    innerCircle: {
        width: 92, height: 92, borderRadius: 92 / 2, borderColor: '#dedede', alignContent: 'center', alignSelf: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.2)' 
        },
    subtitle: {
        fontSize: 14, fontFamily: 'Rubik', fontFamily: 'bold', letterSpacing: 1, color: '#292929', alignSelf: 'center'
    },
    title: {
        fontSize: 16, fontFamily: 'Rubik', fontFamily: 'bold', letterSpacing: 1, color: '#292929', alignSelf: 'flex-start', fontWeight: 'bold'
    },
     heading: {
        fontSize: 18, fontFamily: 'Rubik', fontFamily: 'bold', letterSpacing: 1, color: 'white', fontWeight: 'bold', paddingVertical: sizeWidth(1.5), alignSelf: 'center',
        flexWrap:'wrap'
    },
})


export default Headers;