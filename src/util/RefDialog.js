import React, { Component, useEffect,useState} from "react";
import { Colors, Modal, Portal, Button,TextInput,DefaultTheme} from "react-native-paper";
import { Spinner, Subtitle, Image, Text, Title, Tile } from "@shoutem/ui";
import { StyleSheet, View, TouchableWithoutFeedback, ScrollView, Keyboard, KeyboardEvent} from "react-native";
import { ACCENT_COLOR, PRIMARY_COLOR } from "./Pref";
import { sizeFont, sizeHeight, sizeWidth } from './Size';
import Icon from 'react-native-vector-icons/Feather';
import * as Helper from '../util/Helper';
import * as Pref from '../util/Pref';
import Loader from '../util/Loader';
import FlashMessage from "react-native-flash-message";

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

const RefDialog = props => {

    const [refcode, setrefcode] = useState('');
    const [showLoading, setshowLoading] = useState(false);

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    function onKeyboardDidShow(e) {
        setKeyboardHeight(e.endCoordinates.height);
    }

    function onKeyboardDidHide() {
        setKeyboardHeight(0);
    }
    
    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
        Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
        return () => {
            Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow);
            Keyboard.removeListener('keyboardDidHide', onKeyboardDidHide);
        };
    }, []);

    function couponapply(){
        if(refcode !== ''){
            setshowLoading(true);
            Pref.getVal(Pref.userID, value => {
                const parse = Helper.removeQuotes(value);
                //console.log('parse')
                if (parse !== null && parse !== '') {
                    const jsonbody = JSON.stringify({
                        userid: parse,
                        coupon: refcode
                    });
                    //console.log('jsonbody', jsonbody);
                    Helper.networkHelper(Pref.CouponApplyUrl, jsonbody, Pref.methodPost, result => {
                        //console.log('result', result);
                        if (!result.error) {
                            setshowLoading(false);
                            props.clickedcallback()
                            Pref.setVal(Pref.initial, '0');
                            alert('referral applied')
                        } else {
                            setshowLoading(false);
                            alert('invalid referral code')
                        }
                    }, error => {
                        //console.log('error', error);
                        setshowLoading(false);
                    });
                }
            });
        }else{
            alert('empty referral code')
        }
    }

    return (
        <Portal>
            <View style={[styles.topContainer, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                <View style={{ flex: 0.3 }}></View>
                <View
                    style={[styles.container, { paddingBottom: keyboardHeight == 0 ? 0 : '100%', }]}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <Image styleName={'large-banner'} source={require('../res/images/refer_now.png')} style={{
                            //resizeMode: 'contain',
                        }} />
                        <Tile style={{ position: 'absolute', top: 0, width: '100%', height: 56, backgroundColor: 'transparent' }}>
                            <TouchableWithoutFeedback onPress={props.clickedcallback}>
                                <Icon
                                    name={'x'}
                                    size={24}
                                    color={'#292929'}
                                    style={{ alignSelf: 'flex-end', top: 0, position: 'absolute', padding: 8 }}
                                />
                            </TouchableWithoutFeedback>
                        </Tile>
                    </View>

                    <View style={{ marginVertical: sizeHeight(3) }}>
                        <Title
                            style={{
                                fontSize: 17,
                                letterSpacing: 1,
                                fontWeight: "700",
                                color: '#292929',
                                fontFamily: 'Rubik',
                                alignSelf: 'center'
                            }}
                        >{`Do you have any referral code?`}</Title>

                        <Subtitle
                            style={{
                                marginTop: 4,
                                fontSize: 14,
                                letterSpacing: 1,
                                fontWeight: "400",
                                color: '#292929',
                                fontFamily: 'Rubik',
                                alignSelf: 'center'
                            }}
                        >{`Add referral code and start earning`}</Subtitle>
                    </View>
                    <TextInput
                        mode='flat'
                        underlineColor='transparent'
                        underlineColorAndroid='transparent'
                        style={styles.inputStyle}
                        label={'Referral Code'}
                        placeholder={'enter refer code'}
                        //maxLength={6}
                        autoFocus={false}
                        onChangeText={value => setrefcode(value)}
                        value={refcode}
                        theme={theme}
                    />
                    <Button
                        mode={"flat"}
                        uppercase={true}
                        dark={true}
                        title={'Submit'}
                        loading={false}
                        style={[styles.loginButtonStyle]}
                        onPress={() => couponapply()}
                    >
                        <Text style={{ fontSize: 16, color: 'white' }}>{'Submit'}</Text>
                    </Button>
                </View>

                <Loader isShow={showLoading} />
            </View>
        </Portal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 0.7,
        elevation:8,
        backgroundColor: "white",
        width: '100%',
        alignContent: "center",
        alignItems: "center",
    },
    inputStyle: {
        height: 48,
        backgroundColor: 'white',
        color: '#292929',
        borderBottomColor: Colors.grey400,
        alignSelf:'center',
        //marginTop:sizeHeight(2),
        //marginBottom:sizeHeight(2),
        fontSize: 16,
        width:'80%',
        borderBottomWidth: 0.6,
        fontWeight: '400',
        letterSpacing: 1
    },
    topContainer: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignContent: 'center',
        alignSelf: 'center',
        alignItems: 'center'
    }, loginButtonStyle: {
        color: "white",
        paddingVertical: sizeHeight(0.5),
        backgroundColor: '#e61e25',
        textAlign: "center",
        elevation: 0,
        borderRadius: 0,
        letterSpacing: 1,
        width:'80%',
        marginVertical:sizeHeight(8),
        alignSelf:'center',
       // position:'absolute',
       // bottom:0,
    }
})

export default RefDialog;
