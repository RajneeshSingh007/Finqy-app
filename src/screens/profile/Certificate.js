import React from 'react';
import {StatusBar} from 'react-native';
import {View} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import NavigationActions from '../../util/NavigationActions';
import Pdf from 'react-native-pdf';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import CScreen from '../component/CScreen';
import LeftHeaders from '../common/CommonLeftHeader';
import Download from '../component/Download';

export default class Certificate extends React.PureComponent {
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

  componentDidMount() {
    const {navigation} = this.props;
    const item = navigation.getParam('item', null);
    console.log(`item`, item);
    if (item !== null) {
      Pref.getVal(Pref.USERTYPE, (v) => this.fetchData(item, v));
    } else {
      NavigationActions.goBack();
    }
  }

  componentDidUpdate(preProp, nextState) {
    if (preProp.navigation !== undefined) {
      const {navigation} = this.props;
      const olditem = preProp.navigation.getParam('item', null);
      const item = navigation.getParam('item', null);
      if (olditem !== item) {
        if (item !== null) {
          Pref.getVal(Pref.USERTYPE, (v) => this.fetchData(item, v));
        } else {
          NavigationActions.goBack();
        }
      }
    }
  }

  fetchData = (refercode, v) => {
    const cert = `${Pref.CertUrl}?refercode=${refercode}&type=${v}`;
    this.setState({
      pdfurl: cert,
      loading: false,
      modalvis: true,
    });
  };

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  render() {
    return (
      <CScreen
        scrollEnable={false}
        body={
          <View style={{flex: 1}}>
            <LeftHeaders title={`My Certificate`} showBack />
            <View style={{flex: 0.02}}></View>
            <Pdf
              source={{
                uri: this.state.pdfurl,
                cache: false,
              }}
              style={{
                flex: 0.76,
                backgroundColor: '#f9f8f1',
              }}
            />
            <Download
              rightIconClick={() => {
                Helper.downloadFileWithFileName(`${this.state.pdfurl}.pdf`,'Certificate', 'Certificate.pdf','application/pdf');
              }}
              style={{flex: 0.09}}
            />
          </View>
        }
      />
    );
  }
}
