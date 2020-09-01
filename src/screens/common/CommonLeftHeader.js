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
import {Heading, Subtitle, Image, View, Title} from '@shoutem/ui';
import Lodash from 'lodash';
import IconChooser from '../common/IconChooser';

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
    bottombg = `white`,
    bottomtext = '',
    bottomtextStyle
  } = props;

  return (
    <View
      style={{
        flex: 0.13,
        backgroundColor: 'white',
      }}>
      <View styleName="md-gutter" style={styles.cont}>
        <View style={styles.con}>
          <View style={styles.leftcon}>
            <TouchableWithoutFeedback onPress={backClicked}>
              <View style={styles.circle}>
                <IconChooser
                  name={showBack === true ? 'chevron-left' : 'menu'}
                  size={18}
                  color={Pref.RED}
                  style={styles.icon}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={{flex: 0.6}}>
            {showBack === true ? (
              <Title style={styles.centertext}>{Lodash.truncate(title)}</Title>
            ) : (
              <Image
                source={require('../../res/images/squarelogo.png')}
                styleName="medium"
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}
              />
            )}
          </View>
          <View style={styles.rightcon}>
            <TouchableWithoutFeedback
              onPress={() => {
                if (title === 'Hi,') {
                  backClicked();
                } else {
                  NavigationActions.openDrawer();
                }
              }}>
              <View
                style={StyleSheet.flatten([
                  styles.circle,
                  {
                    backgroundColor: title === 'Hi,' ? Pref.RED : Pref.WHITE,
                    borderColor: title === 'Hi,' ? Pref.RED : '#4a4949',
                    borderStyle: 'solid',
                    borderWidth: title === 'Hi,' ? 0 : 3,
                  },
                ])}>
                {title === 'Hi,' ? (
                  <Title
                    style={StyleSheet.flatten([
                      styles.belowtext,
                      {
                        color: Pref.WHITE,
                      },
                    ])}>
                    {Lodash.capitalize(title.replace(/hi,/g, '').slice(0, 1))}
                  </Title>
                ) : (
                  <IconChooser
                    name={'menu'}
                    size={18}
                    color={'red'}
                    style={styles.icon}
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
      <View style={styles.line} />
      {bottomtext !== '' ? (
        <Title style={StyleSheet.flatten([styles.belowtext, bottomtextStyle])}>{bottomtext}</Title>
      ) : null}
      {bottomBody}
    </View>
  );
  // return (
  //   <View style={[styles.container, style]}>
  //     <View
  //       style={{
  //         flexDirection: 'row',
  //         alignContent: 'center',
  //         alignItems: 'center',
  //         marginStart: sizeHeight(4),
  //         justifyContent:
  //           showBack && showAvtar
  //             ? 'space-between'
  //             : showBack
  //             ? 'flex-start'
  //             : 'space-between',
  //       }}>
  //       {showBack ? (
  //         <View style={{flexDirection: 'row', marginBottom: 12}}>
  //           <TouchableWithoutFeedback onPress={backClicked}>
  //             <Icon
  //               name={backicon}
  //               size={24}
  //               color={backColor}
  //               style={{alignSelf: 'center', marginEnd: 4}}
  //             />
  //           </TouchableWithoutFeedback>
  //           <Heading
  //             style={{
  //               fontSize: 17,
  //               fontFamily: 'Rubik',
  //               letterSpacing: 1,
  //               color: '#292929',
  //               fontWeight: 'bold',
  //               paddingVertical: sizeWidth(1.5),
  //               marginStart: showBack ? sizeHeight(1) : 0,
  //             }}>

  // {Lodash.truncate(title, {
  //   length: 21,
  //   separator: `...`,
  // })}
  //           </Heading>
  //         </View>
  //       ) : (
  //         <Heading
  //           style={{
  //             fontSize: 17,
  //             fontFamily: 'Rubik',
  //             letterSpacing: 1,
  //             color: '#292929',
  //             fontWeight: 'bold',
  //             paddingVertical: sizeWidth(1.5),
  //             marginStart: showBack ? sizeHeight(1) : 0,
  //           }}>

  //           {Lodash.truncate(title, {
  //             length: 20,
  //             separator: `...`,
  //           })}
  //         </Heading>
  //       )}
  //       {showAvtar ? (
  //         !rightImage ? (
  //           <Avatar.Image
  //             source={url}
  //             style={[styles.avatar]}
  //             size={64}
  //             backgroundColor={'transparent'}
  //           />
  //         ) : showIcon ? (
  //           <Icon
  //             name={iconName}
  //             color={iconColor}
  //             size={iconSize}
  //             style={styles.avatar}
  //           />
  //         ) : (
  //           <Image
  //             styleName={'small'}
  //             source={rightUrl}
  //             style={styles.avatar}
  //           />
  //         )
  //       ) : null}
  //     </View>
  //     {showBottom ? (
  //       <TouchableWithoutFeedback onPress={bottomClicked}>
  //         <View
  //           style={{
  //             alignContent: 'center',
  //             borderRadius: 16,
  //             width: '36%',
  //             borderColor: 'rgba(255,255,255,0.2)',
  //             backgroundColor: bottombg,
  //             flexDirection: 'row',
  //             marginStart: sizeWidth(10),
  //             paddingVertical:6
  //           }}>
  //           <Icon
  //             name={bottomIconName}
  //             size={22}
  //             color={'white'}
  //             style={{alignSelf: 'center', marginStart: 12}}
  //           />
  //           <Subtitle style={styles.subtitle}>{bottomIconTitle}</Subtitle>
  //         </View>
  //       </TouchableWithoutFeedback>
  //     ) : (
  //       bottomBody
  //     )}
  //   </View>
  //);
};

const styles = StyleSheet.create({
  cont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centertext: {
    fontSize: 18,
    letterSpacing: 0.5,
    color: '#555555',
    lineHeight: 36,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingVertical: 16,
  },
  belowtext: {
    fontSize: 18,
    letterSpacing: 0.5,
    color: '#555555',
    fontWeight: '700',
    lineHeight: 36,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingVertical: 16,
  },
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
  icon: {
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  con: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftcon: {
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightcon: {
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightText: {
    color: '#bbb8ac',
    fontSize: 18,
    marginEnd: 8,
    letterSpacing: 0.5,
  },
  circle: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 4,
    borderRadius: 42 / 2,
    borderColor: '#4a4949',
    borderStyle: 'solid',
    borderWidth: 3,
  },
  line: {
    backgroundColor: '#f2f1e6',
    height: 1.2,
    marginStart: 12,
    marginEnd: 12,
  },
});

export default LeftHeaders;
