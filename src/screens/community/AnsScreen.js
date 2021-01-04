import React from "react";
import { StyleSheet, BackHandler, FlatList } from "react-native";
import { Subtitle, Title, View } from "@shoutem/ui";
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import { Card, Avatar, FAB } from "react-native-paper";
import NavigationActions from '../../util/NavigationActions';
import { sizeHeight, sizeWidth } from '../../util/Size';
import PlaceholderLoader from '../../util/PlaceholderLoader';
import Lodash from 'lodash';
import CommonScreen from '../common/CommonScreen';
import LeftHeaders from '../common/CommonLeftHeader';
import AskQues from '../../util/AskQues';
import ListError from '../common/ListError';
import Loader from '../../util/Loader';


export default class AnsScreen extends React.PureComponent {
    constructor(props) {
        super(props);
        this.buttonCallback = this.buttonCallback.bind(this);
        this.backClick = this.backClick.bind(this);
        this.renderItems = this.renderItems.bind(this);
        this.state = {
            progressLoader: false,
            loading: false,
            userData: {},
            pic: '',
            showQuesView: false,
            dataList: [],
            item: null,
            uid: ''
        }
        Pref.getVal(Pref.userID, value => {
            const rm = Helper.removeQuotes(value);
            if (rm !== '') {
                this.setState({ uid: rm });
            }
        })


    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backClick);
        const { navigation } = this.props;
        const item = navigation.getParam('item', null);
        if (item !== null) {
            const { reply } = item;
            this.setState({ dataList: reply, item: item })
        }
        this.willfocusListener = navigation.addListener("willFocus", () => {
            this.setState({ loading: true, });
        });
        this.focusListener = navigation.addListener("didFocus", () => {
            this.setState({ loading: false });
            Pref.getVal(Pref.userData, value => {
                const parse = JSON.parse(value);
                const pp = parse.profile_pic;
                const url = { uri: pp === '' ? Pref.profileDefaultPic : `${Pref.ApiDirUrl}${pp}` };
                this.setState({ userData: parse, pic: url })
            })
        });
    }

    componentWillUnMount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backClick);
        if (this.focusListener !== undefined)
            this.focusListener.remove();
        if (this.willfocusListener !== undefined)
            this.willfocusListener.remove();
    }

    backClick = () => {
        if (this.state.showQuesView) {
            this.setState({ showQuesView: false })
            return true;
        } else {
            NavigationActions.goBack();
            return true;
        }
    }

    buttonCallback = (ques) => {
        if (ques === '') {
            alert('Answer empty')
        } else {
            const { uid, userData, item } = this.state;
            this.setState({ progressLoader: true })
            const date = new Date();
            const body = {
                question: ques,
                uid: uid,
                date: date,
                qid: item.id,
            };
            Helper.networkHelper(Pref.AnsCQuesUrl, JSON.stringify(body), Pref.methodPost, result => {
                const { response_header } = result;
                this.setState({ progressLoader: false, showQuesView: false, });
                if (response_header.res_type === 'success') {
                    const merg = this.state.dataList;
                    const pp = userData.profile_pic;
                    const url = pp === '' ? Pref.profileDefaultPic : pp;
                    merg.unshift({
                        username: userData.first_name,
                        ans: ques,
                        pic: url,
                        time: date,
                    })
                    this.setState({ dataList: merg });
                    this.forceUpdate();
                    Helper.showToastMessage('Posted successfully', 1);
                } else {
                    Helper.showToastMessage('Failed to post', 0);
                }
            }, () => {
                this.setState({ progressLoader: false, showQuesView: false, });
            })
        }
    }


    renderItems(item) {
        return (<Card elevation={0} style={{ marginVertical: sizeHeight(0.8), borderRadius: 0, }}
            onPress={() => NavigationActions.navigate('AnsScreen', { item: item })}
        >
            <Card.Content>
                <View style={{ flex: 1, flexDirection: 'column', padding: 4 }}>
                    <View style={{ flex: 1, flexDirection: 'row', marginBottom: 16 }}>
                        <Avatar.Image source={{ uri: item.pic !== '' ? `${Pref.ApiDirUrl}${item.pic}` : `${Pref.profileDefaultPic}` }} size={42} backgroundColor={'transparent'} style={{
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
                    {item.question !== undefined && item.question !== '' ? <Title
                        style={{
                            fontSize: 16,
                            letterSpacing: 0.5,
                            fontWeight: "700",
                            color: '#292929',
                            fontFamily: 'Rubik',
                        }}
                    >{`${Lodash.capitalize(item.question)}`}</Title> : null}


                    {item.ans !== undefined && item.ans !== '' ? <Subtitle
                        styleName='wrap' style={{
                            fontSize: 15,
                            fontFamily: 'Rubik',
                            letterSpacing: 0.5,
                            color: '#292929',
                            fontWeight: '600',
                        }}
                    >{`${Lodash.capitalize(item.ans)}`}</Subtitle> : null}
                </View>
            </Card.Content>
        </Card>)
    }

    render() {
        return (
            <CommonScreen
                title={``}
                loading={this.state.loading}
                absoluteBody={
                    <>
                        <Loader isShow={this.state.progressLoader} />

                        <FAB
                            style={styles.fab}
                            icon="message"
                            onPress={() => this.setState({ showQuesView: true })}
                            color={'white'}
                        />
                        {this.state.showQuesView ? <AskQues buttonCallback={this.buttonCallback} clickedcallback={() => this.setState({ showQuesView: false })} replyMode replyQuestion={this.state.item.question} /> : null}
                    </>
                }
                backgroundColor={'#f5f5f5'}
                body={
                    <>
                        <LeftHeaders
                            title={''}
                            showBack
                        />

                        {this.state.item !== null ? this.renderItems(this.state.item) : null}

                        <Card elevation={0} style={{ marginTop: 10, marginBottom: 10, borderRadius: 0, backgroundColor: Pref.EXTRA_COLOR, height: 56 }}>
                            <Card.Content>
                                <Title
                                    style={{
                                        fontSize: 16,
                                        letterSpacing: 0.5,
                                        fontWeight: "700",
                                        color: 'white',
                                        fontFamily: 'Rubik',
                                    }}
                                >{`${this.state.dataList.length} Reply`}</Title>
                            </Card.Content>
                        </Card>


                        <PlaceholderLoader
                            visibilty={this.state.loading}
                            children={
                                this.state.dataList.length > 0 ?
                                    <FlatList
                                        style={{ marginTop: sizeWidth(2), marginBottom: sizeHeight(2), }}
                                        data={this.state.dataList}
                                        nestedScrollEnabled
                                        renderItem={({ item, index }) => this.renderItems(item)}
                                        keyExtractor={(item, index) => index.toString()}
                                        showsVerticalScrollIndicator={true}
                                        showsHorizontalScrollIndicator={false}
                                        extraData={this.state}
                                    />
                                    :
                                    <View style={{ flex: 1, }}>
                                        <ListError subtitle={'No answer found...\nBe the first to answer and help to grow this community'} url={''} />
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
