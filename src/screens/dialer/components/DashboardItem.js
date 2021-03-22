import React from 'react';
import {StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {Image, Title, View} from '@shoutem/ui';
import * as Helper from '../../../util/Helper';
import * as Pref from '../../../util/Pref';
import Lodash from 'lodash';
import IconChooser from '../../common/IconChooser';

const DashboardItem = prop => {
  const {item, itemClick = () => {}, index = -1, appoint = false} = prop;

  if (Helper.nullCheck(item)) {
    return null;
  }

  return (
    <View style={{flex:1}}>
      <TouchableWithoutFeedback onPress={itemClick}>
        <View
          styleName="vertical sm-gutter"
          style={StyleSheet.flatten([styles.itemContainer])}>
          <Image source={item.image} style={styles.image} />

          <View styleName="horizontal space-between" style={styles.footerCon}>
            <Title
              styleName="v-start h-start"
              numberOfLines={2}
              style={styles.itemtext}>
              {item.name}
            </Title>
          </View>
          {appoint && item.name === 'Follow-up' ? <View style={styles.indicator}></View>:null}
        </View>
      </TouchableWithoutFeedback>
      {item.enabled === false ? <View
          styleName="vertical sm-gutter"
          style={{
          position:'absolute', 
          backgroundColor:'rgba(0,0,0,0.6)',   
          marginVertical: 16,
          borderColor: 'transparent',
          borderRadius: 16,
          marginStart: 8,
          marginEnd: 8,
          justifyContent: 'center',
          width:'92%',
          height:'82%'
      }}>
        <IconChooser name={'lock'} color={'white'} size={24} style={{alignSelf:'center'}} />
      </View> : null}
    </View>
  );
};

export default DashboardItem;

const styles = StyleSheet.create({
  indicator: {
    backgroundColor: Pref.RED,
    width: 12,
    height: 12,
    position: 'absolute',
    bottom: 24,
    right: 16,
    borderRadius: 12,
  },
  gap: {
    marginHorizontal: 8,
  },
  image: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  footerCon: {
    marginTop: 16,
    paddingHorizontal: 12,
    marginBottom: 8,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'center',
    fontWeight: '400',
  },
  title: {
    fontSize: 17,
    fontFamily: 'Rubik',
    letterSpacing: 0.5,
    color: '#292929',
    alignSelf: 'flex-start',
    fontWeight: '700',
  },
  itemtext: {
    letterSpacing: 0.5,
    fontWeight: '700',
    lineHeight: 20,
    // alignSelf: 'center',
    // justifyContent: 'center',
    // textAlign: 'center',
    color: '#292929',
    fontSize: 15,
    marginTop: 12,
    marginBottom: 8,
  },
  emptycont: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginVertical: 48,
    paddingVertical: 56,
  },
  loader: {
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 1,
    marginVertical: 48,
    paddingVertical: 48,
  },
  itemContainer: {
    marginVertical: 16,
    borderColor: '#bcbaa1',
    borderWidth: 0.8,
    borderRadius: 16,
    flex: 1,
    marginStart: 8,
    marginEnd: 8,
    justifyContent: 'center',
  },
  passText: {
    fontSize: 20,
    letterSpacing: 0.5,
    color: Pref.RED,
    fontWeight: '700',
    lineHeight: 36,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingVertical: 16,
    marginBottom: 12,
  },
  circle: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 4,
    borderRadius: 16,
    //borderColor: '#000',
    //borderStyle: 'solid',
    //borderWidth: 3,
    backgroundColor: '#1bd741',
  },
});
