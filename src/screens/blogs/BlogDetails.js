import React from "react";
import { StatusBar, StyleSheet, ScrollView, BackHandler, FlatList, TouchableWithoutFeedback, Linking } from "react-native";
import { TouchableOpacity, Image, Screen, Subtitle, Title, View, Heading, NavigationBar, Text, Caption, GridView, Video, Html } from "@shoutem/ui";
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import { Button, Card, Colors, Snackbar, TextInput, DataTable, Modal, Portal, Avatar, ActivityIndicator, Chip } from "react-native-paper";
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
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";
import ListError from '../common/ListError';
import IconChooser from "../common/IconChooser";

export default class BlogDetails extends React.Component {
    constructor(props) {
        super(props);
        this.back = this.back.bind(this);
        this.state = {
            loading: false,
            item:null
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.back);
        const { navigation } = this.props;
        const item = navigation.getParam('item', null);
        this.setState({ item: item, loading: false })
        // this.focusListener = navigation.addListener("didFocus", () => {
        //     const item = navigation.getParam('item', null);
        //     this.setState({ item: item, loading: false })
        // });
    }

    componentDidUpdate(preProp, nextState){
        if(preProp.navigation !== undefined){
            const { navigation } = this.props;
            const olditem = preProp.navigation.getParam('item', null);
            const item = navigation.getParam('item', null);
            if (olditem !== item){
                this.setState({ item: item, loading: false })
            }
        }
    }


    back = () =>{
        NavigationActions.navigate(`Blogs`);
        return true;
    }
    componentWillUnMount() {
        BackHandler.removeEventListener('hardwareBackPress', this.back);
        if (this.focusListener !== undefined)
            this.focusListener.remove();
        if (this.willfocusListener !== undefined)
            this.willfocusListener.remove();
    }

    /**
         * 
         * @param {*} item 
         * @param {*} index 
         */
    renderItems(item, index) {
        const url = item.category === `newspaper` ? `https://erb.ai/erevbay_admin/blogs/newspaper/${item.img}` : `https://erb.ai/erevbay_admin/${item.img}`;
        const cat = item.category.replace('_', ' ');
        const sp = item.date.split(' ');
        const d = new Date();
        const dx = sp[0].split('-');
        const time = sp[1].split(':');
        d.setFullYear(dx[0], dx[1], dx[2]);
        d.setHours(time[0], time[1], time[2]);
        const date = moment(d).format('DD-MM-YYYY hh:mm A');
        return (<View styleName='vertical' style={{flex:1}}>
            <ScrollView showsVerticalScrollIndicator={true}>
                <View style={{ width: '100%', height: 172,}}>

                    <Image
                        styleName='fill-parent'
                        source={{ uri: `${url}` }}
                        style={{ borderRadius: 12, marginHorizontal: 8, elevation: 4 }} />
                </View>
                <View style={{
                    marginHorizontal: 14,
                    marginTop:16
                }}>

                    <Title styleName='v-start h-start' style={{
                        fontSize: 17, fontFamily: 'Rubik', letterSpacing: 1, color: '#292929', fontWeight: '700',
                        marginBottom: 4,
                    }}>{`${item.title}`}</Title>
                    <View styleName='horizontal'>
                        <Caption styleName='v-center h-center'>{`${Lodash.capitalize(cat)}`}</Caption>
                        <View style={{backgroundColor:Colors.grey200, borderRadius:8, width:8, height:8,alignSelf:'center',marginHorizontal:8}}></View>
                        <Caption styleName='v-center h-center'>{`${date}`}</Caption>
                    </View>
                    <View style={{
                        marginTop:8, height: 0.7, backgroundColor: Colors.grey200,
                    }} />
                </View>
                <Html
                    body={`<p><span class=\"ql-font-serif\">${item.desc}</span></p><p>${item.post}`}
                />
            </ScrollView>
        </View>)
    }

    render() {
        return (
            <CommonScreen
                title={'Finorbit'}
                loading={this.state.loading}
                backgroundColor={`white`}
                enabelWithScroll={false}
                header={
                    <LeftHeaders
                        title={''}
                        showBack
                        backClicked={() => NavigationActions.navigate('Blogs')}
                        style={{ marginBottom: 8 }}
                    />
                }
                headerDis={0.15}
                bodyDis={0.85}
                body={
                    <>
                        {this.state.loading ? <View style={{ justifyContent: 'center', alignSelf: 'center', flex: 1 }}><ActivityIndicator /></View> : this.state.item !== null ?
                             this.renderItems(this.state.item, 0) 
                            : <View style={{
                                flex: 0.7, justifyContent: 'center',
                                alignItems: 'center', alignContents: 'center'
                            }}>
                                <ListError subtitle={'Failed to load data...'} />
                            </View>}
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
