import { Heading, Image, Screen, Subtitle, Title, View } from "@shoutem/ui";
import React from "react";
import { ScrollView, StatusBar, StyleSheet, TouchableWithoutFeedback, FlatList } from "react-native";
import { Colors,Avatar, Card } from "react-native-paper";
import PushNotificationAndroid from "react-native-push-android";
import Icon from 'react-native-vector-icons/Feather';
import * as Helper from '../../util/Helper';
import { sizeHeight, sizeWidth } from '../../util/Size';
import NavigationActions from "../../util/NavigationActions";
import CommonScreen from '../common/CommonScreen';
import CardRow from '../common/CommonCard';
import LeftHeaders from '../common/CommonLeftHeader';
import ProgressCircle from 'react-native-progress-circle'
import Fade from '../../util/Fade';
import * as Pref from '../../util/Pref';

const size = 96;

const CircularCardLeft = props => {
    const { color, clickName, title, subtitle, data = {}, progress, progressTitle, showProgress = true, clicked, cardStyle, titleColor = 'white', subtitleColor ='white'} = props;

    return (
        <Card elevation={2} style={[styles.container, { backgroundColor: color, }, cardStyle]} onPress={clicked}>
            <Fade body={
                <View style={styles.viewinis}>
                    <View style={styles.viewiniss}>
                        <Title style={{
                            fontSize: 18, fontFamily: 'Rubik', letterSpacing: 1, 
                            color: titleColor, alignSelf: 'flex-start', 
                            fontWeight: '700',}}> {title}</Title>
                        <Subtitle style={{
                            fontSize: 15, fontFamily: 'Rubik', letterSpacing: 1, color: subtitleColor, alignSelf: 'center',
                            fontWeight: '400',
                        }}> {subtitle}</Subtitle>
                    </View>
                    {showProgress ? <View style={styles.incir}>
                        <ProgressCircle
                            percent={progress}
                            radius={48}
                            borderWidth={7}
                            color={'#02c26a'}
                            bgColor={Colors.white}
                            shadowColor={Colors.grey300}
                        >
                            <Title styleName='v-center h-center' style={{
                                fontSize: 18, fontFamily: 'Rubik', letterSpacing: 1, color: '#292929', alignSelf: 'flex-start', fontWeight: '700', alignSelf: 'center'
                            }}> {progress}</Title>
                            {progressTitle !== '' ? < Subtitle styleName='v-center h-center' style={{
                                fontSize: 15, fontFamily: 'Rubik', letterSpacing: 1, color: '#292929', alignSelf: 'center',
                                fontWeight: '400',
                            }}> {progressTitle}</Subtitle> : null}
                        </ProgressCircle>

                        {/* <View style={styles.circulin}> */}
                        {/* </View>
                    <View style={styles.cir}></View> */}
                    </View> : <Title styleName='v-center h-center' style={{
                            fontSize: 18, fontFamily: 'Rubik', letterSpacing: 1, color: titleColor, alignSelf: 'flex-start', fontWeight: '700', alignSelf: 'center'
                    }}> {progress}</Title>}
                </View>
            }/>
        </Card>
    )
}

const styles = StyleSheet.create({
    viewiniss: {
        flexWrap: 'wrap', alignSelf: 'center', justifyContent: 'center', flex: 0.7,
    },
    viewinis: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: sizeWidth(2.5), flex: 1, flexBasis: 1
    },
    incir: {
        width: size,
        height: size,
        borderWidth: 6,
        borderRadius: size / 2,
        borderColor: '#dedede',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        marginHorizontal: sizeWidth(4), marginVertical: sizeHeight(2), paddingVertical: sizeHeight(2), paddingHorizontal: sizeWidth(1)
    },
    cir: {
        width: size,
        height: size,
        borderWidth: 6,
        borderRadius: size / 2,
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: '#dedede',
        borderTopColor: '#dedede',
        transform: [{ rotateZ: '-135deg' }]
    },
    circulin: {
        width: size,
        height: size,
        borderWidth: 6,
        borderRadius: size / 2,
        position: 'absolute',
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: '#02c26a',
        borderTopColor: '#02c26a', alignItems: 'center', justifyContent: 'center'
    },
    subtitle: {
        fontSize: 14, fontFamily: 'Rubik', letterSpacing: 1, color: 'white', alignSelf: 'center',
        fontWeight: '400',
    },
    title: {
        fontSize: 18, fontFamily: 'Rubik', letterSpacing: 1, color: 'white', alignSelf: 'flex-start', fontWeight: '700',
    }
})

export default CircularCardLeft;