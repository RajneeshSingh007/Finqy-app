import React, { Component, useEffect, useState } from "react";
import { Colors, Modal, Portal, Button, TextInput, DefaultTheme } from "react-native-paper";
import { Spinner, Subtitle, Image, Text, Title, Tile } from "@shoutem/ui";
import { StyleSheet, View, TouchableWithoutFeedback, ScrollView, Keyboard, KeyboardEvent, KeyboardAvoidingView } from "react-native";
import { ACCENT_COLOR, PRIMARY_COLOR } from "./Pref";
import { sizeFont, sizeHeight, sizeWidth } from './Size';
import Icon from 'react-native-vector-icons/Feather';
import * as Helper from '../util/Helper';
import * as Pref from '../util/Pref';
import Loader from '../util/Loader';
import FlashMessage from "react-native-flash-message";
import NavigationActions from '../util/NavigationActions';

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

const OnlineRedeem = props => {

    const [showLoading, setshowLoading] = useState(false);
    const [mobileNumber, setmobileNumber] = useState('');

    useEffect(() => {
        return () => {
        };
    }, []);

    function couponapply() {
        if(mobileNumber !== ''){
            if (props.amount > 0) {
                if (props.amount >= 2500){
                    alert('You can redeem above ₹2500')
                }else{
                    setshowLoading(true);
                    Pref.getVal(Pref.userID, value => {
                        const parse = Helper.removeQuotes(value);
                        //console.log('parse')
                        if (parse !== null && parse !== '') {
                            const jsonbody = JSON.stringify({
                                userid: parse,
                                bank: '',
                                ifscCode: '',
                                accountNumber: '',
                                accountName: '',
                                branchName: '',
                                accountType: '',
                                amount: props.amount,
                                mobileNumber: mobileNumber,
                                type: props.mode === 0 ? 'Gpay' : 'Paytm'
                            });
                            //console.log('jsonbody', jsonbody);
                            Helper.networkHelper(Pref.RequestWallet, jsonbody, Pref.methodPost, result => {
                                setshowLoading(false);
                                if (!result.error) {
                                    alert('Request sent, Amount will be credited in 3-4 days');
                                    NavigationActions.navigate('MyWallet');
                                } else {
                                    alert('Failed to send request');
                                }
                            }, error => {
                                setshowLoading(false);
                            });
                        }
                    });
                }
            } else {
                alert('empty amount number')
            }
        }else{
            alert('Empty mobile number')
        }
    }

    return (
        <Portal>
            <View style={[styles.topContainer, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                <View style={{ flex: 0.4 }}></View>
                <View
                    style={[styles.container,]}
                >
                    <View style={{ flexDirection: 'row', }}>
                        <Image styleName={'large-ultra-wide'} source={props.url} style={{
                            resizeMode: 'contain',
                            marginTop:10,
                            marginBottom:10
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
                    <View style={{ marginVertical: sizeHeight(2) }}>
                        <Title
                            style={{
                                fontSize: 17,
                                letterSpacing: 1,
                                fontWeight: "700",
                                color: '#292929',
                                fontFamily: 'Rubik',
                                alignSelf: 'center'
                            }}
                        >{`Enter your ${props.mode === 0 ? 'GPay Number' : 'Paytm Number'}`}</Title>


                    </View>
                    <TextInput
                        mode='flat'
                        underlineColor='transparent'
                        underlineColorAndroid='transparent'
                        style={styles.inputStyle}
                        label={`Mobile Number`}
                        placeholder={'enter mobile number'}
                        maxLength={10}
                        keyboardType={'number-pad'}
                        autoFocus={false}
                        onChangeText={value => setmobileNumber(value)}
                        value={mobileNumber}
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
        flex: 0.6,
        elevation: 8,
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
        width: '80%',
        marginVertical: sizeHeight(8),
        alignSelf: 'center',
        // position:'absolute',
        // bottom:0,
    }
})

export default OnlineRedeem;
