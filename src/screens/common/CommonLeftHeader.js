import React from 'react';
import {
  Linking,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  FlatList,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  View,
} from 'react-native';
import * as Pref from '../../util/Pref';
import {
  Avatar,
  List,
  Checkbox,
  Chip,
  Button,
  Card,
  Colors,
  Snackbar,
  TextInput,
  DataTable,
  Modal,
  Portal,
  DefaultTheme,
} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import {sizeFont, sizeHeight, sizeWidth} from '../../util/Size';
import Icon from 'react-native-vector-icons/Feather';
import Icons from 'react-native-vector-icons/FontAwesome5';
import {Heading, Subtitle, Image} from '@shoutem/ui';
import Lodash from 'lodash';

const LeftHeaders = (props) => {
  const {
    title,
    url = require('../../res/images/logo.png'),
    style,
    showAvtar,
    data = {},
    screenName,
    showBottom = false,
    bottomBody,
    rightImage = false,
    rightUrl,
    showBack = false,
    showIcon = false,
    iconName,
    iconColor,
    iconSize,
    bottomIconName = 'bell',
    bottomIconTitle = 'Notification',
    bottomClicked,
    backClicked = () => {
      NavigationActions.goBack();
    },
    backicon = `arrow-left`,
    backColor = `#292929`,
    bottombg=`white`
  } = props;

  return (
    <View style={[styles.container, style]}>
      <View
        style={{
          flexDirection: 'row',
          alignContent: 'center',
          alignItems: 'center',
          marginStart: sizeHeight(4),
          justifyContent:
            showBack && showAvtar
              ? 'space-between'
              : showBack
              ? 'flex-start'
              : 'space-between',
        }}>
        {showBack ? (
          <View style={{flexDirection: 'row', marginBottom: 12}}>
            <TouchableWithoutFeedback onPress={backClicked}>
              <Icon
                name={backicon}
                size={24}
                color={backColor}
                style={{alignSelf: 'center', marginEnd: 4}}
              />
            </TouchableWithoutFeedback>
            <Heading
              style={{
                fontSize: 17,
                fontFamily: 'Rubik',
                letterSpacing: 1,
                color: '#292929',
                fontWeight: 'bold',
                paddingVertical: sizeWidth(1.5),
                marginStart: showBack ? sizeHeight(1) : 0,
              }}>
              
              {Lodash.truncate(title, {
                length: 21,
                separator: `...`,
              })}
            </Heading>
          </View>
        ) : (
          <Heading
            style={{
              fontSize: 17,
              fontFamily: 'Rubik',
              letterSpacing: 1,
              color: '#292929',
              fontWeight: 'bold',
              paddingVertical: sizeWidth(1.5),
              marginStart: showBack ? sizeHeight(1) : 0,
            }}>
            
            {Lodash.truncate(title, {
              length: 20,
              separator: `...`,
            })}
          </Heading>
        )}
        {showAvtar ? (
          !rightImage ? (
            <Avatar.Image
              source={url}
              style={[styles.avatar]}
              size={64}
              backgroundColor={'transparent'}
            />
          ) : showIcon ? (
            <Icon
              name={iconName}
              color={iconColor}
              size={iconSize}
              style={styles.avatar}
            />
          ) : (
            <Image
              styleName={'small'}
              source={rightUrl}
              style={styles.avatar}
            />
          )
        ) : null}
      </View>
      {showBottom ? (
        <TouchableWithoutFeedback onPress={bottomClicked}>
          <View
            style={{
              alignContent: 'center',
              borderRadius: 16,
              width: '36%',
              borderColor: 'rgba(255,255,255,0.2)',
              backgroundColor: bottombg,
              flexDirection: 'row',
              marginStart: sizeWidth(10),
              paddingVertical:6
            }}>
            <Icon
              name={bottomIconName}
              size={22}
              color={'white'}
              style={{alignSelf: 'center', marginStart: 12}}
            />
            <Subtitle style={styles.subtitle}>{bottomIconTitle}</Subtitle>
          </View>
        </TouchableWithoutFeedback>
      ) : (
        bottomBody
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  insideview: {
    height: sizeHeight(5),
    alignContent: 'center',
    borderRadius: 16,
    width: '40%',
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    marginStart: sizeWidth(10),
  },
  container: {
    //flex:1,
    paddingVertical: sizeHeight(3.2),
    backgroundColor: 'white',
    elevation: 4,
    borderBottomLeftRadius: 64,
  },
  avatar: {
    marginEnd: sizeWidth(3),
    backgroundColor: 'transparent',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: 'white',
    marginStart: sizeWidth(3),
    alignSelf: 'center',
    marginStart: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
  },
});

export default LeftHeaders;
