import React, { Component } from "react";
import { Colors, Modal, Portal,} from "react-native-paper";
import { Spinner, Subtitle,Image } from "@shoutem/ui";
import { StyleSheet, View,BackHandler } from "react-native";
import { ACCENT_COLOR, PRIMARY_COLOR } from "./Pref";
import * as Pref from './Pref';

export default class Loader extends React.PureComponent{

    constructor(props){
        super(props);
        this.backClick = this.backClick.bind(this);
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.backClick);
    }

    backClick = () =>{
        const { isShow } = this.props;
        if(isShow){
            return true;
        }else{
            return false;
        }
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    }

    render(){
        const {isShow, title = 'Please Wait...',}  = this.props;
        return isShow !== undefined && isShow !== null && isShow ? (
          <Portal>
            <View style={styles.topContainer}>
              <View style={{flex: 0.4}}></View>
              <View style={styles.container}>
                <Spinner
                  size="large"
                  style={{
                    color: PRIMARY_COLOR,
                  }}
                />
                <Subtitle
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: '#555555',
                    letterSpacing: 0.5,
                    marginTop: 24,
                    alignContent:'center',
                    justifyContent:'center',
                    fontFamily: Pref.getFontName(3),
                  }}>{title}</Subtitle>
              </View>
              <View style={{flex: 0.4}}></View>
            </View>
          </Portal>
        ) : null;
    }
}    

const styles = StyleSheet.create({
    container:{
        flex: 0.2,
        alignSelf: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: "white",
        width: '40%',
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center"
    },
    topContainer:{
        position: 'absolute',
        height: '100%',
        width: '100%',
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignContent: 'center',
        alignSelf: 'center',
        alignItems: 'center'
    }
})

//export default Loader;
