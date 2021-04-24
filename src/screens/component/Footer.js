import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableWithoutFeedback, Linking} from 'react-native';
import {Subtitle, View} from '@shoutem/ui';
import {Avatar} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import * as Pref from '../../util/Pref';
import codePush from 'react-native-code-push';

async function getAppVersion() {
  const [{appVersion}, update] = await Promise.all([
    codePush.getConfiguration(),
    codePush.getUpdateMetadata(),
  ]);

  if (!update) {
    return `v${appVersion}`;
  }

  const label = update.label.substring(1);
  return `v${appVersion} rev.${label}`;
}

export {getAppVersion};

const Footer = (prop) => {
  const {flex = 0.13, iconClick = () => {}} = prop;

  const [version, setVersion] = useState();

  useEffect(() => {
    getAppVersion().then((r) => {
      setVersion(r);
    });
    return () => {};
  }, []);

  return (
    <View
      styleName="md-gutter"
      style={{
        flex: flex,
        backgroundColor: '#f9f8f1',
      }}>
      <View
        style={{
          paddingVertical: 12,
        }}>
        <TouchableWithoutFeedback>
          <Subtitle style={styles.centerText}>{`© 2020 erevbay`}</Subtitle>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => Linking.openURL(`${Pref.MainUrl}about.php`)}>
          <Subtitle style={styles.centerText}>{`About Finqy`}</Subtitle>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() =>
            NavigationActions.navigate('Term', {
              url: Pref.TermOfUseUrl,
              title: 'Term Of Use',
            })
          }>
          <Subtitle style={styles.centerText}>{`Read Term of use`}</Subtitle>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() =>
            NavigationActions.navigate('Term', {
              url: Pref.PrivacyPolicyUrl,
              title: 'Privacy Policy',
            })
          }>
          <Subtitle style={styles.centerText}>{`Privacy Policy`}</Subtitle>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() =>
            NavigationActions.navigate('Term', {
              url: Pref.CookiePolicyUrl,
              title: 'Coockie Policy',
            })
          }>
          <Subtitle style={styles.centerText}>{`Coockie Policy`}</Subtitle>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() =>
            NavigationActions.navigate('Term', {
              url: Pref.DisclaimerUrl,
              title: 'Disclaimer',
            })
          }>
          <Subtitle style={styles.centerText}>{`Disclaimer`}</Subtitle>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.line} />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'center',
          paddingVertical: 2,
        }}>
        <Subtitle style={styles.rightText}>{`Powered By`}</Subtitle>
        <Avatar.Image
          size={42}
          source={require('../../res/images/logo.png')}
          style={{
            backgroundColor: 'transparent',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
          }}
        />
      </View>
      <Subtitle
        style={StyleSheet.flatten([
          styles.centerText,
          {
            marginEnd: 0,
            paddingVertical: 0,
            fontSize: 13,
          },
        ])}>{`${version}`}</Subtitle>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  icon: {
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  leftcon: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightcon: {
    flex: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightText: {
    color: '#bfb9b4',
    fontSize: 16,
    marginEnd: 8,
    letterSpacing: 0.5,
  },
  centerText: {
    color: '#bfb9b4',
    fontSize: 16,
    marginEnd: 0,
    letterSpacing: 0.5,
    justifyContent: 'center',
    paddingVertical: 8,
    alignSelf: 'center',
  },
  circle: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 4,
    borderRadius: 48 / 2,
    borderColor: '#000',
    borderStyle: 'solid',
    borderWidth: 3,
  },
  line: {
    backgroundColor: '#eeedde',
    height: 1.4,
    marginStart: 12,
    marginEnd: 12,
    marginVertical: 6,
  },
});
