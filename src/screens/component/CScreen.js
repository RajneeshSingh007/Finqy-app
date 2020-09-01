import {Screen, View} from '@shoutem/ui';
import React from 'react';
import {ScrollView, StatusBar, StyleSheet} from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {SafeAreaView} from 'react-navigation';
import {sizeHeight, sizeWidth} from '../../util/Size';
import * as Pref from '../../util/Pref';
import Footer from '../component/Footer';

export default class CScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    changeNavigationBarColor(Pref.PRIMARY_COLOR, true, true);
    StatusBar.setBackgroundColor(Pref.WHITE, false);
    StatusBar.setBarStyle('dark-content');
  }

  render() {
    const {body, scrollEnable = true} = this.props;
    return (
      <SafeAreaView style={styles.mainContainer} forceInset={{top: 'never'}}>
        <Screen style={styles.mainContainer}>
          {scrollEnable === true ? (
            <ScrollView
              style={styles.scroller}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps={'handled'}>
              {body}
              <Footer />
            </ScrollView>
          ) : (
            body
          )}
        </Screen>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  scroller: {flex: 1},
  mainContainer: {
    flex: 1,
    backgroundColor: Pref.WHITE,
  },
});
