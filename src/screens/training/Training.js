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
import YoutubePlayer from 'react-native-youtube-iframe';

export default class Training extends React.PureComponent {
    constructor(props) {
        super(props);
        this.renderItems = this.renderItems.bind(this);
        this.renderCatItems = this.renderCatItems.bind(this);
        this.state = {
            dataList: [],
            loading: false,
            showCalendar: false,
            dates: '',
            token: '',
            userData: '',
            categoryList:[],
            cloneList:[]
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.willfocusListener = navigation.addListener("willFocus", () => {
            this.setState({ loading: true, });
        });
        //this.focusListener = navigation.addListener("didFocus", () => {
            Pref.getVal(Pref.userData, userData => {
                this.setState({ userData: userData })
                Pref.getVal(Pref.saveToken, value => {
                    this.setState({ token: value }, () => {
                        this.fetchData();
                    })
                })
            })
        //});
    }

    componentWillUnMount() {
        if (this.focusListener !== undefined)
            this.focusListener.remove();
        if (this.willfocusListener !== undefined)
            this.willfocusListener.remove();
    }

    fetchData = () => {
        this.setState({ loading: true, });
        const body = JSON.stringify({
            training_id:"1"
        })
        Helper.networkHelperTokenPost(Pref.TrainingUrl, body, Pref.methodPost, this.state.token, result => {
            const { data, response_header } = result;
            //console.log('resultx', result);
            const { res_type, message } = response_header;
            if (res_type === `success`) {
                const {categoryList} = this.state;
                categoryList.push({ name: `All`, selected: true })
                //https://www.youtube.com/embed/GegDvKYZ1rA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture
                const catlist = Lodash.map(data, io => {
                    const { product_name, link} = io;
                    const find = Lodash.find(categoryList, ui => ui.name === product_name);
                    if(find === undefined){
                        categoryList.push({ name: product_name,selected:false})
                    }
                    if (link.includes(`embed`)){
                        //https://www.youtube.com/watch?v=GegDvKYZ1rA
                        const sp = link.split('/');
                        const id = sp[4];
                        if (!id.includes(`frameborder`)){
                            io.link = `https://www.youtube.com/watch?v=${id.trim()}`
                        }else{
                            let agsp = id.split('frameborder');
                            const idx = agsp[0].replace('\"\/', '').replace('"', '').trim();
                            io.link = `https://www.youtube.com/watch?v=${idx}`;
                        }
                    }
                    return io;
                })
                categoryList.push({ name: `Download`, selected: false })
                this.setState({ cloneList: catlist, dataList: catlist, categoryList: categoryList, loading: false });
            } else {
                this.setState({ loading: false });
            }
        }, error => {
            this.setState({ loading: false });
        })

    }

    findDownloadSelected = () =>{
        const {categoryList} = this.state;
        const find = Lodash.find(categoryList, io => io.name === `Download` && io.selected === true);
        return find === undefined ? false : true;
    }

    /**
         * 
         * @param {*} item 
         * @param {*} index 
         */
    renderItems(item, index) {
        const videoid = item.link !== '' ? item.link.split('?')[1].replace('v=', '') : ''
        return (
          <View
            styleName="vertical"
            style={{
              marginStart: 10,
              marginEnd: 8,
            }}>
            {item.link !== '' ? (
              <Card
                elevation={2}
                style={{
                  borderRadius: 8,
                  marginTop: 16,
                  marginBottom: 16,
                }}>
                <YoutubePlayer
                  height={200}
                  width={sizeWidth(95)}
                  videoId={videoid}
                  style={{width: '100%', borderRadius: 8}}
                  allowWebViewZoom={false}
                />
                {/* <Video
                  source={{uri: `${item.link}`}}
                  height={156}
                  width={sizeWidth(100)}
                  style={{width: '100%', borderRadius: 8}}
                /> */}
                <View>
                  <Subtitle
                    styleName="v-start h-start"
                    numberOfLines={1}
                    style={{
                      marginStart: 16,
                      fontSize: 15,
                      fontFamily: 'Rubik',
                      letterSpacing: 0.5,
                      color: '#292929',
                      fontWeight: '700',
                      marginBottom: 16,
                    }}>{`${item.header}`}</Subtitle>
                </View>
              </Card>
            ) : this.findDownloadSelected() ? (
              <Card
                elevation={2}
                style={{
                  borderRadius: 8,
                  marginHorizontal: sizeWidth(5),
                  marginTop: 16,
                  marginBottom: 8,
                  paddingTop: 12,
                  paddingBottom: 4,
                }}
                onPress={() =>
                  Helper.downloadFile(
                    `https://erb.ai/erevbay_admin/${item.product_name}/${item.pdf_file}`,
                    '',
                  )
                }>
                <View>
                  {/* <Image
                    source={{
                      uri: `https://image.freepik.com/free-vector/bibliophile-concept-illustration_114360-923.jpg`,
                    }}
                    styleName="large-banner"
                  /> */}
                  <IconChooser
                    name={`file-pdf`}
                    size={48}
                    iconType={5}
                    style={{
                      alignSelf: 'center',
                      alignContents: 'center',
                      alignItems: 'center',
                      paddingVertical: 8,
                      marginTop: 4,
                    }}
                    color={Colors.red400}
                  />
                  <Subtitle
                    styleName="v-start h-start"
                    numberOfLines={1}
                    style={{
                      marginStart: 16,
                      fontSize: 15,
                      fontFamily: 'Rubik',
                      letterSpacing: 1,
                      color: '#292929',
                      fontWeight: '700',
                      marginVertical: 8,
                    }}>{`${item.header}`}</Subtitle>
                </View>
              </Card>
            ) : null}
          </View>
        );
    }

    chipclick = (item, index) => {
        const { categoryList, cloneList } = this.state;
        const sel = item.selected;
        const ok = Lodash.map(categoryList, io =>{
            if(io.name === item.name){
                io.selected  = !sel;
            }else{
                io.selected = false
            }
            return io;
        })
        const clo = JSON.parse(JSON.stringify(cloneList));
        const fil = Lodash.filter(clo, kok => item.name !== 'Download' ? kok.product_name === item.name : kok.link === '');
        this.setState({ categoryList: ok, dataList: item.name === `All` ? cloneList : fil})
    }

    renderCatItems(item, index){
        const name = item.name.replace("_", ' ');
        return (<Chip selected={false} style={{ backgroundColor: item.selected ? Colors.blueGrey900 : `white`, marginHorizontal: 8, marginVertical: 4, elevation: 2 }} textStyle={{ color: item.selected ? `white` : `black`, fontSize: 14, }} onPress={() => this.chipclick(item, index)}>{`${item.name === `All`? `    All    ` : Lodash.capitalize(name)}`}</Chip>)
    }

    render() {
        return (
            <CommonScreen
                title={'Finorbit'}
                loading={this.state.loading}
                enabelWithScroll={false}
                header={
                    <LeftHeaders
                        title={'Training Module'}
                        showBack
                        style={{ marginBottom: 8 }}
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
                                ListHeaderComponent={() => <FlatList
                                    horizontal
                                    data={this.state.categoryList}
                                    style={{marginTop:16,marginStart:8}}
                                    renderItem={({ item, index }) => this.renderCatItems(item, index)}
                                    nestedScrollEnabled={true}
                                    keyExtractor={(item, index) => `${item.name}`}
                                    showsVerticalScrollIndicator={true}
                                    showsHorizontalScrollIndicator={false}
                                    extraData={this.state}
                                />}
                            />
                            : <View style={{
                                flex: 0.7, justifyContent: 'center',
                                alignItems: 'center', alignContents: 'center'
                            }}>
                                <ListError subtitle={'No training modules found...'} />
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
