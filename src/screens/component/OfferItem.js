import React from 'react';
import {StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {Image, Title, View} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import Lodash from 'lodash';
import moment from 'moment';
import IconChooser from '../common/IconChooser';

const OfferItem = (prop) => {
  const {
    item,
    navigate = () => {},
    download = () => {},
    sharing = () => {},
    mailSharing = () =>{},
  } = prop;
  if (Helper.nullCheck(item)) {
    return null;
  }
  const formatDates = `Valid till ${moment(
    Helper.dateObj(item.valid_date, '-'),
  ).format('DD MMM YYYY')}`;
  
  return (
    <View styleName="sm-gutter">
      <View styleName="vertical" style={styles.itemContainer}>
        <TouchableWithoutFeedback onPress={navigate}>
          <Image
            source={{uri: `${item.inner_img}`}}
            styleName="large"
            style={styles.image}
          />
        </TouchableWithoutFeedback>

        <View styleName="horizontal space-between" style={styles.footerCon}>
          <View>
            <Title
              styleName="v-start h-start"
              numberOfLines={1}
              style={styles.itemtext}>
              {Lodash.truncate(`${item.header}`, {
                length: 36,
                separator: '...',
              })}
            </Title>
            {/* <Title
              style={StyleSheet.flatten([
                styles.itemtext,
                {
                  paddingVertical: 0,
                  fontSize: 13,
                  color: '#848486',
                  fontWeight: '400',
                  marginTop: 0,
                  marginBottom: 0,
                  paddingBottom: 0,
                },
              ])}>{formatDates}</Title> */}
          </View>
          <View styleName="horizontal v-center h-center space-between">
            <TouchableWithoutFeedback onPress={mailSharing}>
              <View style={StyleSheet.flatten([styles.circle, {
                backgroundColor:Pref.RED
              }])}>
                <IconChooser
                  name="mail"
                  size={20}
                  color={'white'}
                  iconType={1}
                  style={styles.icon}
                />
              </View>
            </TouchableWithoutFeedback>
            <View style={styles.gap}></View>
            <TouchableWithoutFeedback onPress={sharing}>
              <View style={styles.circle}>
                <IconChooser
                  name="whatsapp"
                  size={20}
                  color={'white'}
                  iconType={2}
                  style={styles.icon}
                />
              </View>
            </TouchableWithoutFeedback>
            <View style={styles.gap}></View>
            <TouchableWithoutFeedback onPress={download}>
              <View
                style={StyleSheet.flatten([
                  styles.circle,
                  {
                    backgroundColor: '#e8e5d7',
                  },
                ])}>
                <IconChooser
                  name="download"
                  size={20}
                  color={'#97948c'}
                  iconType={1}
                  style={styles.icon}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    </View>
  );
};

export default OfferItem;

const styles = StyleSheet.create({
  gap: {
    marginHorizontal: 8,
  },
  image: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 8,
    width: '90%',
    height: 250,
    resizeMode: 'contain',
  },
  footerCon: {
    paddingVertical: 16,
    paddingHorizontal: 12,
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
    fontSize: 18,
    fontFamily: 'Rubik',
    letterSpacing: 1,
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
    color: '#686868',
    fontSize: 16,
    marginStart: 16,
    marginEnd: 16,
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
    marginVertical: 10,
    borderColor: '#bcbaa1',
    borderWidth: 0.8,
    borderRadius: 16,
    marginHorizontal: 16,
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
