import {Screen, View} from '@shoutem/ui';
import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {SafeAreaView} from 'react-navigation';
import {sizeHeight, sizeWidth} from '../../util/Size';
import * as Pref from '../../util/Pref';
import Footer from '../component/Footer';
import IconChooser from '../common/IconChooser';

export default class CScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.scrollViewRef = React.createRef();
    changeNavigationBarColor(Pref.WHITE, true, true);
    StatusBar.setBackgroundColor(Pref.WHITE, false);
    StatusBar.setBarStyle('dark-content');
  }

  scrollToTop = () => {
    const ref = this.scrollViewRef.current;
    if (ref && ref.scrollTo) {
      ref.scrollTo({x: 0, y: 0, animated: true});
    }
  };

  render() {
    const {body, scrollEnable = true, absolute = null, showfooter =true} = this.props;
    return (
      <SafeAreaView style={styles.mainContainer} forceInset={{top: 'never'}}>
        <Screen style={styles.mainContainer}>
          {scrollEnable === true ? (
            // <KeyboardAvoidingView
            //   style={{
            //     flex: 1,
            //     flexDirection: 'column',
            //     justifyContent: 'center',
            //   }}
            //   behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            //   enabled
            //   keyboardVerticalOffset={150}>
            <ScrollView
              ref={this.scrollViewRef}
              style={styles.scroller}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps={'handled'}>
              {body}
              {showfooter === true ?
              <View>
                <TouchableWithoutFeedback onPress={this.scrollToTop}>
                  <View styleName="v-start h-start" style={styles.topcon}>
                    <IconChooser
                      name={'arrow-up'}
                      size={28}
                      color={Pref.RED}
                      style={styles.icon}
                    />
                  </View>
                </TouchableWithoutFeedback>
                <Footer />
              </View> : null}
            </ScrollView>
          ) : (
            //  </KeyboardAvoidingView>
            body
          )}
          {absolute}
        </Screen>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  topcon: {
    margin: 16,
    //position: 'absolute',
    //right: 0,
    //bottom: 0,
    flexDirection:'row-reverse'
  },
  scroller: {flex: 1},
  mainContainer: {
    flex: 1,
    backgroundColor: Pref.WHITE,
  },
  icon:{
    alignItems:'center'
  }
});
