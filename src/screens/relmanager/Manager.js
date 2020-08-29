import React from "react";
import { StatusBar, StyleSheet, ScrollView, BackHandler, FlatList, TouchableWithoutFeedback, Linking } from "react-native";
import { TouchableOpacity, Image, Screen, Subtitle, Title, View, Heading, NavigationBar, Text, Caption, GridView, Video } from "@shoutem/ui";
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

export default class Manager extends React.PureComponent {
    constructor(props) {
        super(props);
        this.renderItems = this.renderItems.bind(this);
        this.state = {
            dataList: [],
            loading: false,
            showCalendar: false,
            dates: '',
            token: '',
            userData: '',
            categoryList: [],
            cloneList: []
        }
    }

    componentDidMount() {
        Pref.getVal(Pref.userData, userData => {
            this.setState({ userData: userData })
            Pref.getVal(Pref.saveToken, value => {
                this.setState({ token: value }, () => {
                    this.fetchData();
                })
            })
        })
    }

    fetchData = () => {
        this.setState({ loading: true, });
        const { refercode } = this.state.userData;
        const body = JSON.stringify({
            user_refercode: refercode
        })
        Helper.networkHelperTokenPost(Pref.RelationManagerUrl, body, Pref.methodPost, this.state.token, result => {
            const { data, response_header } = result;
            const { res_type, message } = response_header;
            if (res_type === `success`) {
                this.setState({ dataList: data, loading: false });
            } else {
                this.setState({ loading: false });
            }
        }, error => {
                console.log(`error`, error)
            this.setState({ loading: false });
        })

    }

    /**
         * 
         * @param {*} item 
         * @param {*} index 
         */
    renderItems(item, index) {
        return (<View styleName='vertical' style={{
            marginVertical: sizeHeight(1),
        }}>
            <Card elevation={2} style={{ borderRadius: 8, marginHorizontal: sizeWidth(5) }}>
                <Card.Cover
                    source={{ uri:`https://image.freepik.com/free-vector/online-courses-concept_23-2148524391.jpg`}}
                />
                <View style={{
                    paddingBottom: 8, marginStart: 16,marginEnd:16}}>
                    <Subtitle styleName='v-start h-start' numberOfLines={1} style={{
                        fontSize: 15, fontFamily: 'Rubik', letterSpacing: 1, color: '#292929', fontWeight: '700',
                        marginVertical: 2
                    }}>{`${Lodash.capitalize(item.username)}`}</Subtitle>
                    <Subtitle styleName='v-start h-start' numberOfLines={1} style={{
                        fontSize: 14, fontFamily: 'Rubik', letterSpacing: 1, color: '#292929', fontWeight: '400',
                    }}>{`Email: ${item.email}`}</Subtitle>
                    <Subtitle styleName='v-start h-start' numberOfLines={1} style={{
                        fontSize: 14, fontFamily: 'Rubik', letterSpacing: 1, color: '#292929', fontWeight: '400',
                    }}>{`Mobile: ${item.mobile}`}</Subtitle>
                    <Subtitle styleName='v-start h-start' numberOfLines={1} style={{
                        fontSize: 14, fontFamily: 'Rubik', letterSpacing: 1, color: '#292929', fontWeight: '400',
                    }}>{`Status: ${Lodash.capitalize(item.status)}`}</Subtitle>
                </View>
            </Card>
        </View>)
    }

    render() {
        return (
            <CommonScreen
                title={'Finorbit'}
                loading={this.state.loading}
                enabelWithScroll={false}
                header={
                    <LeftHeaders
                        title={'Manager'}
                        showBack
                    />
                }
                headerDis={0.15}
                bodyDis={0.85}
                body={
                    <>
                        {this.state.loading ? <View style={{ justifyContent: 'center', alignSelf: 'center', flex: 1 }}><ActivityIndicator /></View> : this.state.dataList.length > 0 ?
                            <FlatList
                                data={this.state.dataList}
                                renderItem={({ item, index }) => this.renderItems(item, index)}
                                nestedScrollEnabled={true}
                                keyExtractor={(item, index) => `${index}`}
                                showsVerticalScrollIndicator={true}
                                showsHorizontalScrollIndicator={false}
                                extraData={this.state}
                            />
                            : <View style={{
                                flex: 0.7, justifyContent: 'center',
                                alignItems: 'center', alignContents: 'center'
                            }}>
                                <ListError subtitle={'No relationship manager found...'} />
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
