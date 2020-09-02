import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet, View,Text } from 'react-native';
import {Colors} from 'react-native-paper';
import { Heading, Image, Screen, Subtitle, Title } from "@shoutem/ui";
import AppIntroSlider from 'react-native-app-intro-slider';
import NavigationActions from '../../util/NavigationActions';
import * as Pref from '../../util/Pref';
import { sizeHeight, sizeWidth } from '../../util/Size';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

const slides = [
    {
        key: 1,
        title: 'ERB',
        text: 'One Stop Shop For All Your Financial Needs!',
        image: require('../../res/images/squarelogo.png'),
        backgroundColor:'white',
    },
    {
        key: 2,
        title: 'Refer And Earn ',
        text: 'earn money',
        image: { uri: `https://erb.ai/images/about/about.jpg` },
        backgroundColor: 'white',
    },
];

export default class IntroScreen extends React.Component {


    componentDidMount(){
        changeNavigationBarColor('white', true, true);
    }

    _renderItem = ({ item }) => {
        return (
            <View style={[styles.slide, { backgroundColor: item.backgroundColor}]}>
                <Image source={item.image} style={{ resizeMode: 'contain', width: 250, height: 250,justifyContent:'center'}} />
                <View style={{flexDirection:'column',marginVertical:sizeHeight(5)}}>
                    <Heading style={styles.title}>{item.title}</Heading>
                    <Title style={styles.subtitle}>{item.text}</Title>
                </View>
            </View>
        );
    }

    _renderNextButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Icon
                    name="md-arrow-round-forward"
                    color="rgba(255, 255, 255, .9)"
                    size={24}
                />
            </View>
        );
    };
    _renderDoneButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Icon
                    name="md-checkmark"
                    color="rgba(255, 255, 255, .9)"
                    size={24}
                />
            </View>
        );
    };

    _onDone = () => {
        NavigationActions.navigate('Login');
    }

    render() {
        return (
            <AppIntroSlider
                data={slides}
                renderItem={this._renderItem}
                renderDoneButton={this._renderDoneButton}
                renderNextButton={this._renderNextButton}
                onDone={this._onDone}
            />
        );
    }
}

const styles = StyleSheet.create({
    circle: {
        width: 48, height: 48,
        justifyContent: 'center', alignSelf: 'center', marginBottom: 4, borderRadius: 48 / 2, borderColor: 'rgba(0,0,0,0.1)', borderStyle: 'solid', borderWidth: 1,
        backgroundColor: Pref.JET_BLACK
    },
    line: {
        backgroundColor: '#dedede', height: 0.7,
        marginHorizontal: sizeWidth(3.5),
    },
    subtitle: {
        fontSize: 16, fontFamily: 'Rubik', letterSpacing: 1, color: '#292929', alignSelf: 'center',
        fontWeight: '400',
    }, 
    title: {
        fontSize: 24, 
        fontFamily: 'Rubik', letterSpacing: 1, color: '#292929', alignSelf: 'center', fontWeight: '700',
        marginVertical:16
    },
    buttonCircle: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(0, 0, 0, .2)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slide:{
        flex:1,
        flexDirection:'column',
        alignContent:'center',
        alignItems:'center',
    }
})
