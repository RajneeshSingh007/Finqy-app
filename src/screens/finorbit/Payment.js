import React from 'react';
import {
  StatusBar,
  StyleSheet,
  ScrollView,
  BackHandler,
  FlatList,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import {
  TouchableOpacity,
  Image,
  Screen,
  Subtitle,
  Title,
  View,
  Heading,
  NavigationBar,
  Text,
  Caption,
  GridView,
} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {
  Button,
  Card,
  Colors,
  Snackbar,
  TextInput,
  DataTable,
  Modal,
  Portal,
  Avatar,
  ActivityIndicator,
} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import {SafeAreaView} from 'react-navigation';
import {sizeFont, sizeHeight, sizeWidth} from '../../util/Size';
import PlaceholderLoader from '../../util/PlaceholderLoader';
import Icon from 'react-native-vector-icons/Feather';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Lodash from 'lodash';
import MenuProvider from '../../util/MenuProvider.js';
import CommonScreen from '../common/CommonScreen';
import CardRow from '../common/CommonCard';
import LeftHeaders from '../common/CommonLeftHeader';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import ListError from '../common/ListError';
import WebView from 'react-native-webview';

export default class Payment extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      url: ``,
      success:false
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    const suminsured = navigation.getParam('suminsured', '');
    const result = navigation.getParam('result', null);
    if (suminsured !== '' && result !== null) {
      const amount = result.policyamount;
      const guid = result.guid;
      let type = '';
      if (suminsured === '001') {
        type = 'doc';
      } else if (suminsured === '002') {
        type = 'ci';
      } else if (suminsured === '003') {
        type = 'cio';
      }
      const finalUrl = `${Pref.NewFormPayment}?proposalamount=${amount}&guid=${guid}&type=${type}`;
      //console.log(`finalUrl`, finalUrl);
      this.setState({url:finalUrl,success:true})
    }
  }

  render() {
    return (
      <CommonScreen
        title={'Finorbit'}
        loading={false}
        enabelWithScroll={false}
        // header={
        //     <LeftHeaders
        //         title={'Raise Qrc'}
        //         showBack
        //     />
        // }
        headerDis={0}
        bodyDis={1}
        body={
          <>
            {this.state.success === true ? (
              <WebView
                source={{uri: `${this.state.url}`}}
                javaScriptEnabled
                goBack={() =>{
                  NavigationActions.navigate('FinorbitScreen');
                }}
              />
            ) : null}
          </>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 14,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'center',
    fontWeight: '400',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'flex-start',
    fontWeight: '700',
  },
});
