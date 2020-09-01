import {Screen, View} from '@shoutem/ui';
import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
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
    const {body, scrollEnable = true, absolute = null} = this.props;
    return (
      <SafeAreaView style={styles.mainContainer} forceInset={{top: 'never'}}>
        <Screen style={styles.mainContainer}>
          {scrollEnable === true ? (
            <KeyboardAvoidingView
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
              }}
              behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
              enabled
              keyboardVerticalOffset={150}>
              <ScrollView
                style={styles.scroller}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps={'handled'}>
                {body}
                <Footer />
              </ScrollView>
            </KeyboardAvoidingView>
          ) : (
            body
          )}
          {absolute}
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
