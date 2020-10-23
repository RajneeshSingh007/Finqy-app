import { Screen, View } from '@shoutem/ui';
import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  BackHandler
} from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { SafeAreaView } from 'react-navigation';
import { sizeHeight, sizeWidth } from '../../util/Size';
import * as Pref from '../../util/Pref';
import Footer from '../component/Footer';
import IconChooser from '../common/IconChooser';
import ScrollTop from '../common/ScrollTop';

export default class CScreen extends React.Component {
  constructor(props) {
    super(props);
    this.scrollViewRef = React.createRef();
    changeNavigationBarColor(Pref.WHITE, true, true);
    StatusBar.setBackgroundColor(Pref.WHITE, false);
    StatusBar.setBarStyle('dark-content');
    this.backClick = this.backClick.bind(this);
    this.state = {
      scrollreset: false
    }
  }


  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backClick);
    this.scrollToTop();
  }

  backClick = () => {
    this.scrollToTop();
    return false;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
  }


  componentWillReceiveProps(nextProps) {
    //console.log(nextProps.scrollreset)
    if (nextProps.scrollreset) {
      this.scrollToTop();
    }
  }

  scrollToTop = () => {
    if (this.scrollViewRef && this.scrollViewRef.current) {
      const ref = this.scrollViewRef.current;
      //console.log('ref',ref)
      if (ref && ref.scrollTo) {
        const timer = setTimeout(() => {
          ref.scrollTo({ x: 0, y: 0, animated: false });
          if(timer){
            clearTimeout(timer);
          }
        }, 150);
      }
    }
  };

  render() {
    const { body, scrollEnable = true, absolute = null, showfooter = true, bgColor = Pref.WHITE } = this.props;
    return (
      <SafeAreaView style={StyleSheet.flatten([styles.mainContainer, {
        backgroundColor: bgColor
      }])} forceInset={{ top: 'never' }}>
        <Screen style={StyleSheet.flatten([styles.mainContainer, {
          backgroundColor: bgColor
        }])}>
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
                  <ScrollTop onPress={this.scrollToTop} />
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
    flexDirection: 'row-reverse'
  },
  scroller: { flex: 1 },
  mainContainer: {
    flex: 1,
    backgroundColor: Pref.WHITE,
  },
  icon: {
    alignItems: 'center'
  }
});
