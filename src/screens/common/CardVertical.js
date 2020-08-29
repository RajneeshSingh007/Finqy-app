import React from "react";
import {StyleSheet, View} from 'react-native';
import { TouchableOpacity, Image, Screen, Subtitle, Title, } from "@shoutem/ui";
import { Button, Card, Colors, Snackbar, TextInput, DataTable, Modal, Portal, Avatar } from "react-native-paper";
import NavigationActions from '../../util/NavigationActions';
import { sizeFont, sizeHeight, sizeWidth } from '../../util/Size';

const CardVertical = props => {
    const { cardStyle, color = Colors.white, clickName, title, subtitle, url, item = {}, bottom,elevation=2,subtitleColor=Colors.white, titleColor=Colors.white,innerstyle } = props;
    return (
      <Card
        elevation={elevation}
        style={[styles.card, {backgroundColor: color}, cardStyle]}>
        <View style={[styles.cardContainer, innerstyle]}>
          {url !== '' ? (
            <Image
              styleName="large-wide"
              source={url}
              style={{resizeMode: 'contain', width: '100%'}}
            />
          ) : null}
          {title !== '' ? (
            <Title
              style={{
                fontSize: 20,
                fontFamily: 'Rubik',
                letterSpacing: 1,
                color: titleColor,
                alignSelf: 'center',
                fontWeight: '700',
                paddingVertical: sizeHeight(1),
              }}>
              
              {title}
            </Title>
          ) : null}
          {subtitle !== '' ? (
            <Subtitle
              styleName="wrap"
              style={{
                fontSize: 18,
                fontFamily: 'Rubik',
                letterSpacing: 1,
                color: subtitleColor,
                alignSelf: 'center',
                fontWeight: '400',
                paddingVertical: sizeHeight(0),
              }}>
              
              {subtitle}
            </Subtitle>
          ) : null}
          {bottom}
        </View>
      </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: sizeWidth(3), marginVertical: sizeHeight(1), paddingVertical: sizeHeight(1), paddingHorizontal: sizeWidth(0),
    },
    cardContainer: {
        flexDirection: 'column', marginHorizontal: sizeWidth(2.5), flex: 1,
    },
    subtitle: {
        fontSize: 18, fontFamily: 'Rubik', letterSpacing: 1, color: '#dedede', alignSelf: 'center',
        fontWeight: '400',
        paddingVertical: sizeHeight(0)
    },
    title: {
        fontSize: 20, fontFamily: 'Rubik', letterSpacing: 1, color: 'white', alignSelf: 'center', fontWeight: '700',
        paddingVertical:sizeHeight(1)
    }
})

export default CardVertical;