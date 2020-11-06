import React from 'react';
import { StatusBar } from 'react-native';
import { View } from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import NavigationActions from '../../util/NavigationActions';
import Pdf from 'react-native-pdf';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import CScreen from '../component/CScreen';
import LeftHeaders from '../common/CommonLeftHeader';
import Download from '../component/Download';
import RNFetchBlob from 'rn-fetch-blob';

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
    let filePath = `${RNFetchBlob.fs.dirs.DownloadDir}/${refercode}_MyCertificate.pdf`;
    const cert = `${Pref.CertUrl}?refercode=${refercode}&type=${v}`;
    RNFetchBlob.fs.exists(filePath)
      .then((exist) => {
        //console.log(exist,filePath)
        if (exist) {
          this.setState({
            pdfurl: `file://${filePath}`,
            loading: false,
            modalvis: true,
            remoteFileUrl: cert,
            referCode: refercode
          });
        } else {
          this.setState({
            pdfurl: cert,
            loading: false,
            modalvis: true,
            remoteFileUrl: cert,
            referCode: refercode
          }, () => {
            Helper.downloadFileWithFileName(`${this.state.remoteFileUrl}`, `${this.state.referCode}_MyCertificate`, `${this.state.referCode}_MyCertificate.pdf`, 'application/pdf');

          });
        }
      })
      .catch((err) => {
        this.setState({
          pdfurl: cert,
          loading: false,
          modalvis: true,
          remoteFileUrl: cert,
          referCode: refercode

        }, () => {
          Helper.downloadFileWithFileName(`${this.state.remoteFileUrl}`, `${this.state.referCode}_MyCertificate`, `${this.state.referCode}_MyCertificate.pdf`, 'application/pdf');

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
            <LeftHeaders title={`My Certificate`} showBack />
            <View style={{ flex: 0.02 }}></View>
            <Pdf
              source={{
                uri: this.state.pdfurl,
                cache: false,
              }}
              style={{
                flex: 0.76,
                backgroundColor: '#f9f8f1',
              }}
            // fitWidth
            // fitPolicy={0}
            // enablePaging
            // scale={1}

            />
            <Download
              rightIconClick={() => {
                Helper.downloadFileWithFileName(`${this.state.remoteFileUrl}`, `${this.state.referCode}_MyCertificate`, `${this.state.referCode}_MyCertificate.pdf`, 'application/pdf');
              }}
              style={{ flex: 0.09 }}
            />
          </View>
        }
      />
    );
  }
}
