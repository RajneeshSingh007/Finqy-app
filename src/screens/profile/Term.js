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
      type: '',
      title: '',
    };
  }

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate() {
    this.fetch();
  }

  fetch = () =>{
    const {navigation} = this.props;
    const pdfUrl = navigation.getParam('url', Pref.TermOfUseUrl);
    const title = navigation.getParam('title', 'Term Of Use');

    //this.focusListener = navigation.addListener('didFocus', () => {
    this.setState({
      title: title,
      pdfurl: pdfUrl,
      loading: false,
      modalvis: true,
      remoteFileUrl: pdfUrl,
    });

    //});
  }

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
  }

  render() {
    return (
      <CScreen
        scrollEnable={false}
        body={
          <View style={{flex: 1}}>
            <LeftHeaders
              title={this.state.title}
              showBack
              backClicked={() => NavigationActions.goBack()}
            />
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
          </View>
        }
      />
    );
  }
}
