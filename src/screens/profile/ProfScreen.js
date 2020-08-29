import React from "react";
import { Linking, StatusBar, StyleSheet, TouchableOpacity, ScrollView, BackHandler, FlatList, TouchableWithoutFeedback, Dimensions, Platform, View,Alert } from "react-native";
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import { Avatar, List, Checkbox, Chip, Button, Card, Colors, Snackbar, TextInput, DataTable, Modal, Portal, DefaultTheme } from "react-native-paper";
import NavigationActions from '../../util/NavigationActions';
import { SafeAreaView } from 'react-navigation';
import { sizeFont, sizeHeight, sizeWidth } from '../../util/Size';
import PlaceholderLoader from '../../util/PlaceholderLoader';
import Icon from 'react-native-vector-icons/Feather';
import Icons from 'react-native-vector-icons/FontAwesome5';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import moment from 'moment';
import Lodash from 'lodash';
import ImagePicker from 'react-native-image-picker';
import { Loader } from '../../util/Loader';
import MenuProvider from '../../util/MenuProvider.js';
import CommonScreen from '../common/CommonScreen';
import CardRow from '../common/CommonCard';
import Row from '../common/CommonRow';
import Headers from '../common/CommonHeader';
import { Heading } from '@shoutem/ui';

export default class ProfScreen extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            userData: {},
            pic:''
        }
    }

    componentDidMount(){
        const { navigation } = this.props;
        this.willfocusListener = navigation.addListener("willFocus", () => {
            this.setState({ loading: false, });
        });
        this.focusListener = navigation.addListener("didFocus", () => {
            Pref.getVal(Pref.userData, value => {
                const parse = JSON.parse(value);
                const pp = parse.profile_pic;
                const url = {uri: pp === '' ? Pref.profileDefaultPic : `${Pref.FOLDERPATH}${pp}`};
                this.setState({ userData: parse, pic: url })
            })
        });
    }

    componentWillUnMount() {
        if (this.focusListener !== undefined)
            this.focusListener.remove();
        if (this.willfocusListener !== undefined)
            this.willfocusListener.remove();
    }


    render() {
        return (
            <CommonScreen
                enabelWithScroll={false}
                header={
                    <Headers
                        style={{paddingVertical:36}}
                        title={`${this.state.userData === undefined ? `` : this.state.userData.first_name}`}
                        showAvtar
                        url={this.state.pic}
                    />
                }
                loading={this.state.loading}
                body={
                    <>

                        <View style={{backgroundColor:'white',height:'100%',marginTop:sizeHeight(8)}}>

                            <Card elevation={0}>
                                <Row
                                    title={'My Profile'}
                                    subtitle={'Manage your profile'}
                                    iconName={'user'}
                                    screenName={'ProfileScreen'}
                                    data={''}
                                />
                                <View style={styles.line} />
                                <Row
                                    title={'My Offers'}
                                    subtitle={'Manage your offers'}
                                    iconName={'gift'}
                                    screenName={'MyOffers'}
                                    data={''}
                                />
                                <View style={styles.line} />
                                <Row
                                    title={'My Wallet'}
                                    subtitle={'Manage your wallets'}
                                    iconName={'wallet'}
                                    iconType={1}
                                    screenName={'MyWallet'}
                                    data={''}
                                />
                                <View style={styles.line} />
                                <Row
                                    title={'Refer&Earn'}
                                    subtitle={'Refer app and earn'}
                                    iconName={'rupee-sign'}
                                    iconType={1}
                                    screenName={'ReferEarn'}
                                    data={''}
                                />
                                <View style={styles.line} />
                                <Row
                                    title={'Help&Support'}
                                    subtitle={'Got some problems?'}
                                    iconName={'info'}
                                    screenName={''}
                                    data={''}
                                />
                            </Card>
                        </View>
                    </>
                }
            />
        );
    }
}


const styles = StyleSheet.create({
    number: {
        fontSize: 24,
        fontFamily: 'Rubik',
        fontWeight: '400',
        color: 'white',
        justifyContent: 'center',
        alignSelf: 'center',
        lineHeight: 25,
    },
    line: {
        backgroundColor: '#dedede', height: 0.7,
        marginHorizontal: sizeWidth(3.5),
    },
    subtitle: {
        fontSize: 14, fontFamily: 'Rubik', fontFamily: 'bold', letterSpacing: 1, color: '#292929', alignSelf: 'center'
    },
    title: {
        fontSize: 16, fontFamily: 'Rubik', fontFamily: 'bold', letterSpacing: 1, color: '#292929', alignSelf: 'flex-start', fontWeight: 'bold'
    },
    loginButtonStyle: {
        color: "white",
        paddingVertical: sizeHeight(0.5),
        marginHorizontal: sizeWidth(3),
        marginVertical: sizeHeight(4),
        backgroundColor: Pref.RED,
        textAlign: "center",
        elevation: 0,
        borderRadius: 2,
        letterSpacing: 1,
        bottom: 0,
    },
    cardStyle: {
        borderRadius: 4,
        marginVertical: sizeHeight(3),
        marginHorizontal: sizeWidth(3.5),
        backgroundColor: '#ebeceb',
        paddingVertical: sizeHeight(2.8),
        paddingHorizontal: sizeWidth(4),
        //borderColor:'#dedede',
        //borderWidth:0.2
    }, inputStyle: {
        height: 56,
        backgroundColor: 'white',
        color: '#292929',
        borderBottomColor: '#dedede',
        fontFamily: 'Rubik',
        fontSize: 16,
        borderBottomWidth: 1,
        fontWeight: '400',
        marginHorizontal: sizeWidth(3),
        letterSpacing: 1
    }, heading: {
        fontSize: 18, fontFamily: 'Rubik', fontFamily: 'bold', letterSpacing: 1, color: 'white', fontWeight: 'bold', paddingVertical: sizeWidth(4), alignSelf: 'center'
    },
})
