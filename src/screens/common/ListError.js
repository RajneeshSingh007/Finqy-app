import React from "react";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity, Image, Screen, Subtitle, Title, Caption, } from "@shoutem/ui";
import { Button, Card, Colors, Snackbar, TextInput, DataTable, Modal, Portal, Avatar } from "react-native-paper";
import NavigationActions from '../../util/NavigationActions';
import { sizeFont, sizeHeight, sizeWidth } from '../../util/Size';

const ListError = props => {
    const {subtitle, url,style} = props;
    return (
        <View style={[styles.cardContainer,style]}>
            {url !== '' ? <Image source={url} style={{ resizeMode: 'cover', width: '100%', height: 256 }} /> : null}
            {subtitle !== '' ? <Caption styleName='wrap' style={{fontSize:16,letterSpacing:1,justifyContent:'center',alignSelf:'center',position:'absolute'}}> {subtitle}</Caption> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: { alignSelf: 'center', justifyContent: 'center', alignContent: 'center', position: 'absolute',top:0,bottom:0,left:0,right:0,},
})

export default ListError;