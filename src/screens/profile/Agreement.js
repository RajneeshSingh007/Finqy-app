import React from 'react';
import {
  StatusBar,
  StyleSheet,
  ScrollView,
  BackHandler,
  FlatList,
  TouchableWithoutFeedback,
  Linking,
  Alert,
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
import ListError from '../common/ListError';
import CommonTable from '../common/CommonTable';
import RNFetchBlob from 'rn-fetch-blob';
import IconChooser from '../common/IconChooser';
import moment from 'moment';
import Pdf from 'react-native-pdf';
import Modal from '../../util/Modal';

export default class Agreement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      modalvis: true,
      pdfurl: '',
    };
  }

  render() {
    return (
      <CommonScreen
        title={'Finorbit'}
        loading={this.state.loading}
        enabelWithScroll={false}
        header={<LeftHeaders title={`My Agreement`} showBack />}
        headerDis={0.15}
        bodyDis={0.85}
        body={
          <>
            <View
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
              }}>
              <Pdf
                source={{
                  uri: Pref.AgreeUrl,
                  cache: true,
                }}
                style={{
                  flex: 1,
                  width: '100%',
                  height: '100%',
                }}
              />
            </View>
          </>
        }
      />
    );
  }
}
