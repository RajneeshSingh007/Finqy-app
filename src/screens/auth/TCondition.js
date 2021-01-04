import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import {
  View,
} from '@shoutem/ui';
import * as Pref from '../../util/Pref';
import CommonScreen from '../common/CommonScreen';
import WebView from 'react-native-webview';

export default class TCondition extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <CommonScreen
        title={'Finorbit'}
        loading={false}
        enabelWithScroll={false}
        // header={<LeftHeaders title={'Terms & Conditions'} showBack />}
        headerDis={0}
        bodyDis={1}
        body={
          <>
            <View style={{ backgroundColor: 'white', flex: 1 }}>
              <WebView
                style={{ marginTop: 8, marginHorizontal: 16 }}
                source={{ uri: `${Pref.TCondition}` }}
                javaScriptEnabled
                allowsBackForwardNavigationGestures
              />
            </View>
          </>
        }
      />
    );
  }
}


