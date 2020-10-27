import React,{useState,useEffect} from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import * as Pref from '../../util/Pref';
import {
  Avatar,
} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import { sizeHeight, sizeWidth } from '../../util/Size';
import { Image, View, Title } from '@shoutem/ui';
import Lodash from 'lodash';
import IconChooser from '../common/IconChooser';

const LeftHeaders = (props) => {
  const {
    title,
    bottomBody,
    showBack = false,
    backClicked = () => {
      NavigationActions.goBack();
    },
    bottomtext = '',
    bottomtextStyle,
    profile = () => { }  
  } = props;

  const [pic, setPic] = useState(null);

  useEffect(() => {
    Pref.getVal(Pref.userData, (value) => {
      if (value !== undefined && value !== null) {
        const pp = value.user_prof;
        let profilePic = pp === undefined || pp === null || pp === '' || (!pp.includes('.jpg') && !pp.includes('.jpeg')&& !pp.includes('.png')) ? null : { uri: decodeURIComponent(pp) };
        setPic(profilePic);
      }
    });

    return () => {
    };
  }, []);

  return (
    <View
      style={{
        flex: 0.13,
        backgroundColor: 'white',
      }}>
      <View styleName="sm-gutter" style={styles.cont}>
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
          <View style={{ flex: 0.6 }}>
            {showBack === true ? (
              <Title style={styles.centertext}>{Lodash.truncate(title)}</Title>
            ) : (
                <Image
                  source={require('../../res/images/squarelogo.png')}
                  styleName="medium"
                  style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    resizeMode:'contain'
                  }}
                />
              )}
          </View>
          <View style={styles.rightcon}>
            <TouchableWithoutFeedback
              onPress={() => {
                //console.log('title', title);
                //if (title === 'Hi,') {
                  profile();
                //} else {
                  //NavigationActions.openDrawer();
                //}
              }}>
              {/* {title === 'Hi,' ? ( */}
                <View>
                  <Avatar.Image
                    source={pic === null ? require('../../res/images/account.png') :pic}
                    size={48}
                    style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
                  />
                </View>
              {/* //   <Title
              //     style={StyleSheet.flatten([
              //       styles.belowtext,
              //       {
              //         color: Pref.WHITE,
              //       },
              //     ])}>
              //     {Lodash.capitalize(name.slice(0, 1))}
              //   </Title>
              // ) : (
              //     <View
              //       style={StyleSheet.flatten([
              //         styles.circle,
              //         {
              //           backgroundColor: title === 'Hi,' ? Pref.RED : Pref.WHITE,
              //           borderColor: title === 'Hi,' ? Pref.RED : '#4a4949',
              //           borderStyle: 'solid',
              //           borderWidth: title === 'Hi,' ? 0 : 3,
              //         },
              //       ])}>
              //       <IconChooser
              //         name={'menu'}
              //         size={18}
              //         color={'red'}
              //         style={styles.icon}
              //       />
              //     </View>
              //   )} */}
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
      <View style={styles.line} />
      {bottomtext !== '' ? (
        <Title style={StyleSheet.flatten([styles.belowtext, bottomtextStyle])}>
          {bottomtext}
        </Title>
      ) : null}
      {bottomBody}
    </View>
  );
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
    paddingVertical: 8,
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
    marginStart:8
  },
  rightcon: {
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    //marginEnd:4
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
