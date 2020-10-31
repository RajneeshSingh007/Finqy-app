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
import Download from '../component/Download';
import * as Helper from '../../util/Helper';
import RNFetchBlob from 'rn-fetch-blob';

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
      remoteFileUrl: '',
      referCode: ''
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.userData, data => {
        //console.log('data', data)
        Pref.getVal(Pref.USERTYPE, (v) => this.fetchData(data, v));
      })
    });
  }

  fetchData = (data, v) => {
    const { refercode } = data;
    let filePath = `${RNFetchBlob.fs.dirs.DownloadDir}/${refercode}_MyAgreement.pdf`;
    const agree = `${Pref.AgreeUrl}`;
    RNFetchBlob.fs.exists(filePath)
      .then((exist) => {
        console.log(exist,filePath)
        if (exist) {
          this.setState({
            pdfurl: `file://${filePath}`,
            loading: false,
            modalvis: true,
            remoteFileUrl: agree,
            referCode: refercode
          });
        } else {
          this.setState({
            pdfurl: agree,
            loading: false,
            modalvis: true,
            remoteFileUrl: agree,
            referCode: refercode
          });
        }
      })
      .catch((err) => {
        this.setState({
          pdfurl: agree,
          loading: false,
          modalvis: true,
          remoteFileUrl: agree,
          referCode: refercode

        });
      });
  };

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
  }


  render() {
    return (
      <CScreen
        scrollEnable={false}
        body={
          <View style={{ flex: 1 }}>
            <LeftHeaders title={`My Agreement`} showBack />
            <View style={{ flex: 0.02 }}></View>
            <Pdf
              source={{
                uri: Pref.AgreeUrl,
                cache: true,
              }}
              style={{
                flex: 0.85,
                backgroundColor: '#f9f8f1',
              }}
              fitWidth
              fitPolicy={0}
              enablePaging
              scale={1}
            />
            <Download
              rightIconClick={() => {
                Helper.downloadFileWithFileName(`${this.state.remoteFileUrl}`, `${this.state.referCode}_MyAgreement`, `${this.state.referCode}_MyAgreement.pdf`, 'application/pdf');
              }}
              style={{ flex: 0.09 }}
            />
          </View>
        }
      />
    );
  }
}
