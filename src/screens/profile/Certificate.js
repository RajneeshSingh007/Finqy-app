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

export default class Certificate extends React.Component {
  constructor(props) {
    super(props);
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

  fetchData = (refercode,v) => {
    const cert = `${Pref.CertUrl}?refercode=${refercode}&type=${v}`;
    console.log(`cert`, cert);
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
      <CommonScreen
        title={'Finorbit'}
        loading={this.state.loading}
        enabelWithScroll={false}
        header={null}
        headerDis={0.15}
        bodyDis={0.85}
        body={
          <>
            {this.state.loading ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  flex: 1,
                }}>
                <ActivityIndicator />
              </View>
            ) : (
              <Modal
                visible={this.state.modalvis}
                setModalVisible={() => {
                  this.setState({modalvis: false, pdfurl: ''});
                  NavigationActions.goBack();
                }}
                ratioHeight={0.87}
                backgroundColor={`white`}
                topCenterElement={
                  <Subtitle
                    style={{
                      color: '#292929',
                      fontSize: 17,
                      fontWeight: '700',
                      letterSpacing: 1,
                    }}>{`Certificate`}</Subtitle>
                }
                topRightElement={
                  <TouchableWithoutFeedback
                    onPress={() =>
                      Helper.downloadFile(`${this.state.pdfurl}.pdf`, '')
                    }>
                    <View>
                      <IconChooser
                        name="download"
                        size={24}
                        color={Colors.blue900}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                }
                children={
                  <View
                    style={{
                      flex: 1,
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'white',
                    }}>
                    <Pdf
                      source={{
                        uri: this.state.pdfurl,
                        cache: false,
                      }}
                      style={{
                        flex: 1,
                        width: '100%',
                        height: '100%',
                      }}
                      onError={(e) => console.log(e)}
                    />
                  </View>
                }
              />
            )}
          </>
        }
      />
    );
  }
}
