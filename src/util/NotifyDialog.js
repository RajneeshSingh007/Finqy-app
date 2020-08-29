import React, { Component, useEffect, useState } from "react";
import { Colors, Modal, Portal, Button, TextInput, DefaultTheme } from "react-native-paper";
import { Spinner, Subtitle, Image, Text, Title, Tile,Overlay,ImageBackground } from "@shoutem/ui";
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

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'transparent',
        accent: 'transparent',
        backgroundColor: Colors.white,
        surface: Colors.white
    }
};

const NotifyDialog = props => {

    const { isShow = false, clickedButton,noteContent = 'No notification found...'} = props;
    const [showBottom, setshowBottom] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [progressloader, setprogressloader] = useState(false);

    useEffect(() => {
        setshowBottom(isShow)
        setDataList([{
            name: 'manish',
            number: '1234567890',
            status: 'Pending'
        }, {
            name: 'Rajneesh',
            number: '1234567890',
            status: 'Confirm'
        }, {
            name: 'Coolalien',
            number: '1234567890',
            status: 'Confirm'
            }, {
                name: 'Coolalien',
                number: '1234567890',
                status: 'Confirm'
            }, {
                name: 'Coolalien',
                number: '1234567890',
                status: 'Confirm'
            }, {
                name: 'Coolalien',
                number: '1234567890',
                status: 'Confirm'
            }, {
                name: 'Coolalien',
                number: '1234567890',
                status: 'Confirm'
            }, {
                name: 'Coolalien',
                number: '1234567890',
                status: 'Confirm'
            }, {
                name: 'Coolalien',
                number: '1234567890',
                status: 'Confirm'
            }])
        return () => {
            props.clickedcallback()
        };
    }, []);

    function renderItems(item, index) {
        return (<View style={{
            flexDirection: 'row',
            marginHorizontal: 16,
            paddingVertical: 8
        }}>
            <Icon name={'bell'} size={16} style={{alignSelf:'center',marginEnd:8}}/>

            <Subtitle style={{
                fontSize: 16,
                fontFamily: 'Rubik',
                color: '#292929',
                padding: 4,
                fontWeight: '400',
            }}>{item.name}</Subtitle>
        </View>)
    }
    return (
        <Portal>
            <View style={[styles.topContainer, { backgroundColor: 'rgba(0,0,0,0.6)',}]}>

                <View style={{ flex: 0.2, width: '100%' }}></View>
                <View
                    style={[styles.container]}
                >
                    <View style={{flexDirection:'row'}}>
                        <Image styleName={'large-banner'} source={require('../res/images/notify.jpg')}>
                        </Image>
                        <Tile style={{position:'absolute',top:0,width:'100%',height:56,backgroundColor:'transparent'}}>
                            <TouchableWithoutFeedback onPress={() => {
                                props.clickedcallback()
                            }}>
                                <Icon
                                    name={'x'}
                                    size={24}
                                    color={'#292929'}
                                    style={{ alignSelf: 'flex-end', top: 0, position: 'absolute', padding: 8 }}
                                />
                            </TouchableWithoutFeedback>
                        </Tile>
                    </View>
                    <View style={{ marginVertical: sizeHeight(1.5) }}>
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
                        >{`Notification`}</Title>

                    </View>
                    <ListError subtitle={noteContent === '' ? 'No notification found...' : noteContent} />
                </View>
            </View>
        </Portal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 0.8,
        elevation: 8,
        backgroundColor: "white",
        width: '100%',
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

export default NotifyDialog;
