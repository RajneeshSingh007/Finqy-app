import { Heading, Image, Screen, Subtitle, Title } from "@shoutem/ui";
import React from "react";
import { ScrollView, StatusBar, StyleSheet, TouchableWithoutFeedback, FlatList, View } from "react-native";
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { Avatar, Card } from "react-native-paper";
import PushNotificationAndroid from "react-native-push-android";
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-navigation';
import { sizeHeight, sizeWidth } from '../../util/Size';
import NavigationActions from "../../util/NavigationActions";
import * as Pref from '../../util/Pref';

export default class CommonScreen extends React.PureComponent {

    constructor(props) {
        super(props);
        changeNavigationBarColor(Pref.PRIMARY_COLOR, true, true);
        const { loading } = this.props;
        this.state = {
            loading: loading
        }
    }

    header() {
        const { title, rightIcon, showRightIcon = false, showProfile = false, leftIcon, imaguri = { uri: Pref.profileDefaultPic } } = this.props;
        return (<View styleName='horizontal' style={styles.headerBar}>
            <View style={{ flexDirection: 'row' }}>
                {showRightIcon ? showProfile ? <Avatar.Image source={imaguri} style={{ alignSelf: 'center' }} size={56} backgroundColor={'transparent'} /> : <TouchableWithoutFeedback onPress={() => NavigationActions.goBack()}>
                    <Icon
                        name={'arrow-left'}
                        size={24}
                        color={'#292929'}
                        style={{ alignSelf: 'center', justifyContent: 'center', padding: 4 }}
                    />
                </TouchableWithoutFeedback> : rightIcon}
                <Heading style={styles.heading}> {title}</Heading>
            </View>
            {leftIcon}
        </View>)
    }

    render() {
        const { showTopBar, enabelWithScroll = true, body, absoluteBody, header, showAbsolute = true, backgroundColor = Pref.BACKGROUND_COLOR, headerDis = 0.2, bodyDis=0.8 } = this.props;
        return (
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: backgroundColor
            }} forceInset={{ top: 'never' }}>
                <Screen style={{
                    flex: 1,
                    backgroundColor: backgroundColor
                }}>
                    {Platform.OS === 'android' ? <StatusBar barStyle="light-content" backgroundColor={Pref.PRIMARY_COLOR} /> : null}
                    {
                        enabelWithScroll ? <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
                            {showTopBar ? this.header() : null}
                            {body}
                        </ScrollView> : <View style={{ flex: 1 }}>
                                <View style={{ flex: headerDis }}>
                                    {header}
                                </View>
                                <View style={{ flex: bodyDis }}>
                                    {body}
                                </View>
                            </View>
                    }
                    {showAbsolute ? absoluteBody : null}
                </Screen>
            </SafeAreaView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Pref.BACKGROUND_COLOR
    },
    heading: {
        fontSize: 18, fontFamily: 'Rubik', fontFamily: 'bold', letterSpacing: 1, color: '#292929', fontWeight: 'bold', marginStart: sizeWidth(4), alignSelf: 'center'
    },
    headerBar: {
        flexDirection: 'row', flex: 0.1, marginVertical: sizeHeight(2), paddingVertical: sizeHeight(1), justifyContent: 'space-between', marginHorizontal: sizeWidth(5)
    },
})
