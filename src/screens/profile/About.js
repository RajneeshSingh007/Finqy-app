import React from "react";
import { StatusBar, StyleSheet, ScrollView, BackHandler, FlatList, TouchableWithoutFeedback, Linking } from "react-native";
import { TouchableOpacity, Image, Screen, Subtitle, Title, View, Heading, NavigationBar, Text, Caption, GridView } from "@shoutem/ui";
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import { Button, Card, Colors, Snackbar, TextInput, DataTable, Modal, Portal, Avatar } from "react-native-paper";
import NavigationActions from '../../util/NavigationActions';
import { SafeAreaView } from 'react-navigation';
import { sizeFont, sizeHeight, sizeWidth } from '../../util/Size';
import PlaceholderLoader from '../../util/PlaceholderLoader';
import Icon from 'react-native-vector-icons/Feather';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Lodash from 'lodash';
import MenuProvider from '../../util/MenuProvider.js';
import CommonScreen from '../common/CommonScreen';
import CardRow from '../common/CommonCard';
import LeftHeaders from '../common/CommonLeftHeader';

export default class About extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.willfocusListener = navigation.addListener("willFocus", () => {
            this.setState({ loading: true, });
        });
        this.focusListener = navigation.addListener("didFocus", () => {
            this.setState({ loading: false });
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
                title={'About'}
                loading={this.state.loading}
                body={
                    <>
                        <LeftHeaders
                            title={'About'}
                            showBack
                            // bottomBody={
                            //     <View style={{ marginStart: 64, flexDirection: 'row', justifyContent: 'space-between', alignContents: 'center', alignItems: 'center' }}>
                            //         <Title style={{
                            //             fontSize: 17, fontFamily: 'Rubik', letterSpacing: 1, color: 'white', alignSelf: 'flex-start', fontWeight: '400', paddingVertical: sizeHeight(0.5),
                            //         }}> {'About ERB'}</Title>
                            //     </View>
                            // }
                        />

                            <Card style={{ flexDirection: 'column', flex: 1, marginVertical: sizeHeight(2),borderRadius:0}}>
                                <View style={{ flexDirection: 'column', flex: 1, marginVertical: sizeHeight(2) }}>
                                    <Avatar.Image source={require('../../res/images/logo.png')} size={96} style={{
                                        backgroundColor: 'transparent',
                                        justifyContent: 'center',
                                        alignSelf: 'center'
                                    }} />
                                </View>
                            </Card>

                    </>
                }
            />
        );
    }
}


const styles = StyleSheet.create({
    subtitle: {
        fontSize: 14, fontFamily: 'Rubik', letterSpacing: 1, color: '#292929', alignSelf: 'center',
        fontWeight: '400',
    },
    title: {
        fontSize: 18, fontFamily: 'Rubik', letterSpacing: 1, color: '#292929', alignSelf: 'flex-start', fontWeight: '700',
    }
})
