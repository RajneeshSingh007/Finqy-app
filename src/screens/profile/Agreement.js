import React from 'react';
import {
  StatusBar,
} from 'react-native';
import {
  View,
} from '@shoutem/ui';
import * as Pref from '../../util/Pref';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import LeftHeaders from '../common/CommonLeftHeader';
import Pdf from 'react-native-pdf';
import CScreen from '../component/CScreen';

export default class Agreement extends React.PureComponent {
  constructor(props) {
    super(props);
    changeNavigationBarColor(Pref.WHITE, true, true);
    StatusBar.setBackgroundColor(Pref.WHITE, false);
    StatusBar.setBarStyle('dark-content');
    this.state = {
      loading: false,
      modalvis: true,
      pdfurl: '',
    };
  }

  render() {
    return (
      <CScreen
        scrollEnable={false}
        body={
          <View style={{flex: 1}}>
            <LeftHeaders title={`My Agreement`} showBack />
            <View style={{flex: 0.02}}></View>
            <Pdf
              source={{
                uri: Pref.AgreeUrl,
                cache: true,
              }}
              style={{
                flex: 0.85,
                backgroundColor: '#f9f8f1',
              }}
            />
          </View>
        }
      />
    );
  }
}
