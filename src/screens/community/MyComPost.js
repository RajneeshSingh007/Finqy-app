import React from "react";
import { StatusBar, StyleSheet, ScrollView, BackHandler, FlatList, TouchableWithoutFeedback, Linking, TextInput, Alert } from "react-native";
import { TouchableOpacity, Image, Screen, Subtitle, Title, View, Heading, NavigationBar, Text, Caption, GridView } from "@shoutem/ui";
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import { Button, Card, Colors, Snackbar, DataTable, Modal, Portal, Avatar, DefaultTheme, FAB } from "react-native-paper";
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
import AskQues from '../../util/AskQues';
import ListError from '../common/ListError';
import Loader from '../../util/Loader';
import moment from "moment";


export default class MyComPost extends React.PureComponent {
    constructor(props) {
        super(props);
        this.buttonCallback = this.buttonCallback.bind(this);
        this.deleteCallback = this.deleteCallback.bind(this);
        this.backClick = this.backClick.bind(this);
        this.renderItems = this.renderItems.bind(this);
        this.state = {
            progressLoader: false,
            uid: '',
            loading: false,
            loadingz: false,
            userData: null,
            pic: '',
            showQuesView: false,
            dataList: []
        }

        Pref.getVal(Pref.userID, value => {
            const rm = Helper.removeQuotes(value);
            console.log('rm', rm)
            if (rm !== '') {
                this.setState({ uid: rm });
            }
        })

    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backClick);
        const { navigation } = this.props;
        this.willfocusListener = navigation.addListener("willFocus", () => {
            this.setState({ loadingz: true, });
        });
        this.focusListener = navigation.addListener("didFocus", () => {
            Pref.getVal(Pref.userData, value => {
                const parse = JSON.parse(value);
                const pp = parse.profile_pic;
                const url = { uri: pp === '' ? Pref.profileDefaultPic : `${Pref.FOLDERPATH}${pp}` };
                this.setState({ userData: parse, pic: url })
            })
            this.fetchData();
        });
    }

    componentWillUnMount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backClick);
        if (this.focusListener !== undefined)
            this.focusListener.remove();
        if (this.willfocusListener !== undefined)
            this.willfocusListener.remove();
    }

    fetchData = () => {
        Pref.getVal(Pref.userID, value => {
            const rm = Helper.removeQuotes(value);
            console.log('rm', rm)
            if (rm !== '') {
                const body = {
                    uid: rm
                };
                console.log('bod', body)
                Helper.networkHelper(Pref.FetchMyCUrl, JSON.stringify(body), Pref.methodPost, result => {
                    const { response_header, response } = result;
                    this.setState({ loadingz: false, showQuesView: false, });
                    if (response_header.res_type === 'success') {
                        const sortResult = Lodash.map(response, (ele) => {
                            const { reply } = ele;
                            if (reply.length > 0) {
                                ele.reply = Lodash.orderBy(reply, ['time'], ['desc'])
                            }
                            return ele;
                        })
                        this.setState({ dataList: Lodash.orderBy(sortResult, ['time'], ['desc']) })
                    }
                    this.forceUpdate();
                }, error => {
                    this.setState({ loadingz: false })
                });
            }
        })
    }

    backClick = () => {
        if (this.state.showQuesView) {
            this.setState({ showQuesView: false })
            return true;
        } else {
            NavigationActions.goBack();
            return false;
        }
    }

    buttonCallback = (ques) => {
        if (ques === '') {
            alert('Question empty')
        } else {
            const { uid, userData, pic } = this.state;
            this.setState({ progressLoader: true })
            const date = new Date();
            const body = {
                question: ques,
                uid: uid,
                date: date
            };
            Helper.networkHelper(Pref.PostCQuesUrl, JSON.stringify(body), Pref.methodPost, result => {
                const { response_header, response } = result;
                console.log('result', result);
                this.setState({ progressLoader: false, showQuesView: false, });
                if (response_header.res_type === 'success') {
                    const merg = this.state.dataList;
                    const pp = userData.profile_pic;
                    const url = pp === '' ? Pref.profileDefaultPic : pp;
                    merg.unshift({
                        username: userData.first_name, question: ques,
                        pic: url, time: date,
                        reply: []
                    })
                    this.setState({ dataList: merg });
                    this.forceUpdate();
                    Helper.showToastMessage('Posted successfully', 1);
                } else {
                    Helper.showToastMessage('Failed to post', 0);
                }
            }, error => {
                this.setState({ progressLoader: false, showQuesView: false, });
            })
        }
    }

    deleteCallback(item, index){
                    const { uid, userData, pic } = this.state;
        const { id } = item;
        Alert.alert('Delete Post', 'are you sure want to delet?', [
            {
                text:'No',
                onPress:() =>{}
            },
            {
                text:'Yes',
                onPress:()=>{
                    this.setState({ progressLoader: true })
                    const body = {
                        uid: uid,
                        qid: id
                    };
                    Helper.networkHelper(Pref.DeleteComPost, JSON.stringify(body), Pref.methodPost, result => {
                        console.log('result', result)
                        const { response_header } = result;
                        this.setState({ progressLoader: false, showQuesView: false, });
                        if (response_header.res_type === 'success') {
                            const merg = this.state.dataList;
                            merg.splice(index);
                            this.setState({ dataList: merg });
                            this.forceUpdate();
                            Helper.showToastMessage('Deleted successfully', 1);
                        } else {
                            Helper.showToastMessage('Failed to delete', 0);
                        }
                    }, error => {
                            console.log('error', error)
                        this.setState({ progressLoader: false, showQuesView: false, });
                    })
                }
            }
        ])
    }


    renderItems(item, index) {
        return (<Card elevation={0} style={{ marginVertical: sizeHeight(0.8), borderRadius: 0, }}
            //onPress={() => NavigationActions.navigate('AnsScreen', { item: item })}
        >
            <Card.Content>
                <View style={{ flex: 1, flexDirection: 'column', padding: 4 }}>
                    <View style={{ flex: 1, flexDirection: 'row', marginBottom: 16 }}>
                        <Avatar.Image source={{ uri: `${Pref.FOLDERPATH}${item.pic}` }} size={42} backgroundColor={'transparent'} style={{
                            backgroundColor: 'transparent'
                        }} />
                        <View>
                            <Subtitle
                                numberOfLines={1}
                                style={{
                                    marginHorizontal: sizeWidth(3),
                                    fontSize: 16,
                                    letterSpacing: 1,
                                    fontWeight: 'bold',
                                    color: '#292929',
                                    fontFamily: 'Rubik',
                                }}
                            >{`${Lodash.capitalize(item.username)}`}</Subtitle>
                            <Subtitle
                                numberOfLines={1}
                                style={{
                                    marginHorizontal: sizeWidth(3),
                                    fontSize: 12,
                                    letterSpacing: 1,
                                    fontWeight: '400',
                                    color: '#757575',
                                    fontFamily: 'Rubik',
                                }}
                            >{`${Lodash.capitalize(Helper.parseTimePassed(item.time))}`}</Subtitle>
                        </View>
                    </View>
                    <Title
                        numberOfLines={1}
                        style={{
                            fontSize: 16,
                            letterSpacing: 0.5,
                            fontWeight: "700",
                            color: '#292929',
                            fontFamily: 'Rubik',
                        }}
                    >{`${Lodash.capitalize(item.question)}`}</Title>

                    {item.reply !== undefined && item.reply.length > 0 ? <Subtitle
                        numberOfLines={3}
                        styleName='wrap' style={{
                            fontSize: 14,
                            fontFamily: 'Rubik',
                            letterSpacing: 0.5,
                            color: '#757575',
                            fontWeight: '400',
                        }}
                    >{`${Helper.subslongText(Lodash.capitalize(item.reply[0].ans), 130)}`}<TouchableWithoutFeedback onPress={() => NavigationActions.navigate('AnsScreen', { item: item })}>
                            <Subtitle
                                numberOfLines={3}
                                styleName='wrap' style={{
                                    fontSize: 14,
                                    fontFamily: 'Rubik',
                                    letterSpacing: 1,
                                    color: Pref.RED,
                                    fontWeight: '400',
                                }}
                            >{`  Read More...`}</Subtitle>
                        </TouchableWithoutFeedback></Subtitle> : null}

                </View>
                <View style={{ flex: 1, flexDirection: 'row', height: 0.6, backgroundColor: Colors.grey300, marginVertical: sizeHeight(1)}} />
                <View style={{ flex: 1, flexDirection: 'row', marginVertical:sizeHeight(0.5) }}>
                    {/* <TouchableWithoutFeedback onPress={() => alert('d')}>
                        <Icon name={'edit'} size={20} color={Pref.HIPPIE_BLUE} style={{marginStart:4}} />
                    </TouchableWithoutFeedback> */}
                    <TouchableWithoutFeedback onPress={() => this.deleteCallback(item, index)}>
                        <Icon name={'trash-2'} size={20} color={Pref.RED} style={{ marginHorizontal: 4 }} />
                    </TouchableWithoutFeedback>

                </View>

                {/* <View style={{flexDirection:'row'}}>
                    <Icon name={'message-circle'} size={18} style={{alignSelf:'center'}} />
                    <Subtitle
                        numberOfLines={3}
                        styleName='wrap' style={{
                            fontSize: 14,
                            fontFamily: 'Rubik',
                            letterSpacing: 1,
                            color: '#757575',
                            fontWeight: '400',
                            alignSelf:'center',
                            marginHorizontal:4
                        }}
                    >{`10`}</Subtitle>
                </View> */}
            </Card.Content>
        </Card>)
    }

    render() {
        return (
            <CommonScreen
                title={`My Post`}
                loading={this.state.loading}
                absoluteBody={
                    <>
                        <Loader isShow={this.state.progressLoader} />
                    </>
                }
                backgroundColor={'#f5f5f5'}
                body={
                    <>
                        <LeftHeaders
                            title={'My Post'}
                            showBack
                        />

                        <PlaceholderLoader
                            visibilty={this.state.loadingz}
                            children={
                                this.state.dataList.length > 0 ?
                                    <FlatList
                                        style={{ marginTop: sizeWidth(2), marginBottom: sizeHeight(2), }}
                                        data={this.state.dataList}
                                        renderItem={({ item, index }) => this.renderItems(item, index)}
                                        keyExtractor={(item, index) => index.toString()}
                                        showsVerticalScrollIndicator={true}
                                        showsHorizontalScrollIndicator={false}
                                        extraData={this.state}
                                    />
                                    :
                                    <View style={{ flex: 1, }}>
                                        <ListError subtitle={''} url={require('../../res/images/nodatafound.png')} />
                                    </View>
                            }
                        />

                    </>
                }
            />
        );
    }
}


const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: Pref.EXTRA_COLOR
    },
    subtitle: {
        fontSize: 14, fontFamily: 'Rubik', letterSpacing: 1, color: '#292929', alignSelf: 'center',
        fontWeight: '400',
    },
    title: {
        fontSize: 18, fontFamily: 'Rubik', letterSpacing: 1, color: '#292929', alignSelf: 'flex-start', fontWeight: '700',
    }
})
