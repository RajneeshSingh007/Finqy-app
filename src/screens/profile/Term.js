import React from 'react';
import {StatusBar, BackHandler} from 'react-native';
import {View} from '@shoutem/ui';
import * as Pref from '../../util/Pref';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import LeftHeaders from '../common/CommonLeftHeader';
import Pdf from 'react-native-pdf';
import CScreen from '../component/CScreen';
import NavigationActions from '../../util/NavigationActions';

export default class Term extends React.PureComponent {
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
      referCode: '',
      type:''
    };
  }

  componentDidMount() {
    //BackHandler.addEventListener('hardwareBackPress', this.backClick);
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.userData, data => {
        //console.log('data', data)
        Pref.getVal(Pref.USERTYPE, v => this.fetchData(data, v));
      });
    });
  }

  fetchData = (data, v) => {
    const {refercode} = data;
    const agree = `${Pref.TermOfUse}`;
    this.setState({
      pdfurl: agree,
      loading: false,
      modalvis: true,
      remoteFileUrl: agree,
      referCode: refercode,
      type:v
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
          <View style={{flex: 1}}>
            <LeftHeaders title={`Term Of Use`} showBack backClicked={() => NavigationActions.goBack()} />
            {/* <View style={{ flex: 0.02 }}></View> */}
            <Pdf
              source={{
                uri: this.state.pdfurl,
                cache: false,
              }}
              style={{
                flex: 1,
                backgroundColor: '#f9f8f1',
              }}
              fitWidth
              fitPolicy={0}
              enablePaging
              scale={1}
            />
            {/* <Download
              rightIconClick={() => {
                Helper.downloadFileWithFileName(`${this.state.remoteFileUrl}.pdf`, `Agreement_${this.state.referCode}`, `Agreement_${this.state.referCode}.pdf`, 'application/pdf');
              }}
              style={{ flex: 0.09 }}
            /> */}
          </View>
        }
      />
    );
  }
}
