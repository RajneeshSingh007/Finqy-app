import React from "react";
import { StatusBar, StyleSheet, ScrollView, BackHandler, FlatList, TouchableWithoutFeedback, Linking } from "react-native";
import { TouchableOpacity, Image, Screen, Subtitle, Title, View, Heading, NavigationBar, Text, Caption, GridView, TextInput } from "@shoutem/ui";
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import { Button, Card, Colors, Snackbar, DataTable, Modal, Portal, Avatar,DefaultTheme } from "react-native-paper";
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
import moment from "moment";

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: "transparent",
        accent: "transparent",
        backgroundColor: Colors.white,
        surface: Colors.white,
    },
}

// {
//     message: 'Hello',
//         timestamp: '04-04-2020 18:30 PM',
//             left: true
// }, {
//     message: 'Right Hellodhhhhhhhhhhh dhhhhhhhhhhhhhhhhhhhhhhhhhh hddddddddddddddddddd',
//         timestamp: '04-04-2020 18:30 PM',
//             left: false
// }

let layheight = 56;

export default class ChatScreen extends React.PureComponent {
    constructor(props) {
        super(props);
        this.renderItems = this.renderItems.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.state = {
            height: 0,
            dataList: [],
            loading: false,
            chatMessage:'',
            imageUrl:'',
            userData:{}
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.willfocusListener = navigation.addListener("willFocus", () => {
            Pref.getVal(Pref.userData, parse => {
                const pp = parseda.user_prof;
                const url = { uri: pp === '' ? Pref.profileDefaultPic : `${pp}` };
                this.setState({ userData: parse,imageUrl: url });
            })
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
    
    renderItems(item, index) {
        return (item.left ? <View style={{ flex: 1, flexDirection: 'row', marginVertical: sizeHeight(1.5),marginHorizontal:sizeWidth(1),elevation:8 }}>
            <View style={{ flex: 0.6, flexDirection: 'row' }}>
                <Avatar.Image source={{ uri: 'https://cdn.dribbble.com/users/1971922/avatars/normal/f244137353d6ae304c1513dca9ef2a50.jpg' }} size={40} backgroundColor={'transparent'} style={{
                    marginHorizontal: sizeWidth(2),
                    alignSelf: 'flex-start',
                    backgroundColor: 'white',
                    marginTop: 4,
                }} />
                <View style={styles.chatContent}>
                    <Subtitle styleName='multiline wrap' style={{ flex: 1, flexWrap: 'wrap',color:'white'}}> {item.message}</Subtitle>
                    <Caption style={{ alignSelf: 'flex-end', marginHorizontal: 8, marginTop: 4 }}> {item.timestamp}</Caption>
                </View>
            </View>
            <View style={{ flex: 0.4 }}>
            </View>
        </View> : <View style={{ flex: 1, flexDirection: 'row-reverse', marginVertical: sizeHeight(1.5), elevation: 8 }}>
                <View style={{ flex: 0.6, flexDirection:'row-reverse'}}>
                    <Avatar.Image source={this.state.imageUrl} size={40} backgroundColor={'transparent'} style={{
                        marginHorizontal: sizeWidth(2),
                        alignSelf: 'flex-end',
                        backgroundColor:'white',
                        marginBottom:4,
                    }} />
                    <View style={styles.chatContent}>
                        <Subtitle styleName='multiline wrap' style={{ flex: 1, flexWrap: 'wrap', color: 'white'}}> {item.message}</Subtitle>
                        <Caption  style={{ alignSelf: 'flex-end', marginHorizontal: 8,marginTop:4 }}> {item.timestamp}</Caption>
                    </View>
                </View>
                <View style={{flex:0.4}}>
                </View>
        </View>)
    }

    sendMessage(){
        const right = {
            message:this.state.chatMessage,
            left:false,
            timestamp:moment(new Date()).format('DD-MM-YYYY hh:mm A')
        }
        if(this.state.chatMessage !== ''){
            this.setState({ dataList: [...this.state.dataList, right], chatMessage:''})
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.container} forceInset={{ top: 'never' }}>
                <Screen style={styles.container}>
                    {Platform.OS === 'android' ? <StatusBar barStyle="light-content" backgroundColor={Pref.PRIMARY_COLOR} /> : null}
                    <View style={{ flex: 1 }}>
                        <LeftHeaders
                           // showAvtar
                            rightImage
                            showBack
                            title={'Chat'}
                        />

                        <View style={{ flex: 1, flexDirection: 'column', }}>
                            {this.state.dataList.length > 0 ?
                                <FlatList
                                    data={this.state.dataList}
                                    nestedScrollEnabled={true}
                                    renderItem={({ item, index }) => this.renderItems(item, index)}
                                    keyExtractor={(item, index) => item.timestamp.toString()}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    extraData={this.state}
                                /> : <View style={{ flex: 1, justifyContent: 'center' }}><Caption style={{ justifyContent: 'center', alignSelf: 'center',fontSize:16 }}>{`no chats found...`}</Caption></View>}

                            <View style={{ flex: 0 }}>
                                <Card elevation={0}>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            borderTopColor: "#dedede",
                                            borderTopWidth: 0.4,
                                            height: this.state.chatMessage === '' ? 56 : layheight,
                                            justifyContent: "space-between",
                                            alignContents: 'center',
                                            alignItems: 'center',
                                            flexGrow: 1,

                                        }}
                                    >
                                        <TextInput
                                            styleName={'multiline'}
                                            multiline
                                            mode="flat"
                                            underlineColor="transparent"
                                            underlineColorAndroid="transparent"
                                            onContentSizeChange={(event) => {
                                                layheight = this.state.chatMessage === '' ? 56 : event.nativeEvent.contentSize.height;
                                                //console.log('layheight', layheight);
                                                // this.setState({ height: event.nativeEvent.contentSize.height })
                                            }}
                                            placeholder={"Enter a message"}
                                            placeholderTextColor={"#dedede"}
                                            onChangeText={(value) =>
                                                this.setState({ chatMessage: value })
                                            }
                                            style={styles.input}
                                            value={this.state.chatMessage}
                                            theme={theme}
                                            returnKeyType={"done"}
                                        />
                                        <TouchableWithoutFeedback
                                            onPress={ () => this.sendMessage()}
                                        >
                                            <Icon
                                                name={"send"}
                                                size={28}
                                                color={"#292929"}
                                                style={{
                                                    padding: 4,
                                                    alignSelf: "center",
                                                    marginHorizontal: sizeWidth(2),
                                                }}
                                            />
                                        </TouchableWithoutFeedback>
                                    </View>
                                </Card>
                            </View>
                        </View>
                    </View>
                </Screen>
            </SafeAreaView>
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
    },
    input:{
        //backgroundColor:'red',
        color: "#292929",
        fontFamily: "Rubik",
        borderBottomColor:'transparent',
        fontSize: 16,
        flex:1,
        height:'100%',
        //borderTopWidth: 0.6,
        fontWeight: "400",
        marginHorizontal:sizeWidth(2),
        letterSpacing: 1,
    }, container: {
        flex: 1,
        backgroundColor: Pref.BACKGROUND_COLOR
    }, triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 12,
        borderRightWidth: 12,
        borderBottomWidth: 20,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: Colors.blueGrey900,
        transform: [
            { rotate: '90deg' }
        ],
        margin: 0,
        marginLeft: -6,
        borderWidth: 0,
        borderColor: "transparent",
        alignSelf:'center'
    },lefttriangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 12,
        borderRightWidth: 12,
        borderBottomWidth: 20,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: Colors.blueGrey900,
        transform: [
            { rotate: '-90deg' }
        ],
        margin: 0,
        marginRight:-6,
        borderWidth: 0,
        borderColor: "transparent",
        alignSelf: 'center'
    },
    chatContent:{
        borderTopRightRadius: 8, borderRadius: 8, backgroundColor: Colors.blueGrey900, paddingHorizontal: sizeWidth(2), paddingVertical: sizeHeight(1)
    }
})
