import React, { Component, useEffect, useState } from "react";
import { Colors, Modal, Portal, Button, TextInput, DefaultTheme,Card } from "react-native-paper";
import { Spinner, Subtitle, Image, Text, Title, Tile, Overlay, ImageBackground } from "@shoutem/ui";
import { StyleSheet, View, TouchableWithoutFeedback, ScrollView, Keyboard, KeyboardEvent, FlatList, BackHandler } from "react-native";
import { ACCENT_COLOR, PRIMARY_COLOR } from "./Pref";
import { sizeFont, sizeHeight, sizeWidth } from './Size';
import Icon from 'react-native-vector-icons/Feather';
import * as Helper from '../util/Helper';
import * as Pref from '../util/Pref';
import Loader from '../util/Loader';
import FlashMessage from "react-native-flash-message";
import PlaceholderLoader from './PlaceholderLoader';
import ListError from '../screens/common/ListError';

const FormProgress = props => {

    const { isShow = false, clickedButton, } = props;
    const [showBottom, setshowBottom] = useState(false);

    useEffect(() => {
        setshowBottom(isShow)
        return () => {
            props.clickedcallback()
        };
    }, []);

    return (
        <Portal>
            <View style={[styles.topContainer, { backgroundColor: 'rgba(0,0,0,0.6)', }]}>

                <View style={{ flex: 0.3, width: '100%' }}></View>
                <View
                    style={[styles.container]}
                >
                    <Card elevation={2}>
                        <Image styleName={'medium-wide'} source={require('../res/images/celeb.png')} style={{
                            
                        }}>
                        </Image>
                        <Title
                            style={{
                                fontSize: 17,
                                letterSpacing: 1,
                                fontWeight: "700",
                                color: '#292929',
                                fontFamily: 'Rubik',
                                alignSelf: 'flex-start',
                                marginHorizontal: 16
                            }}
                        >{`All Notification`}</Title>

                    </Card>
                   
                </View>
                <View style={{ flex: 0.3, width: '100%' }}></View>
            </View>
        </Portal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 0.4,
        backgroundColor: "white",
        marginHorizontal:sizeWidth(2),
        width:'75%',
    },
    inputStyle: {
        height: 48,
        backgroundColor: 'white',
        color: '#292929',
        borderBottomColor: Colors.grey400,
        alignSelf: 'center',
        //marginTop:sizeHeight(2),
        //marginBottom:sizeHeight(2),
        fontSize: 16,
        width: '80%',
        borderBottomWidth: 0.6,
        fontWeight: '400',
        letterSpacing: 1
    },
    topContainer: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        flex: 1,
        alignContent: 'center',
        alignItems: 'center'
    }, loginButtonStyle: {
        color: "white",
        paddingVertical: sizeHeight(0.5),
        backgroundColor: '#e61e25',
        textAlign: "center",
        elevation: 0,
        borderRadius: 0,
        letterSpacing: 1,
        width: '80%',
        marginVertical: sizeHeight(8),
        alignSelf: 'center',
        // position:'absolute',
        // bottom:0,
    }
})

export default FormProgress;
