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

let HEADER = `Sr. No.,Dated,Particular,View\n`;
let FILEPATH = `${RNFetchBlob.fs.dirs.DownloadDir}/erb/finpro/${moment(
  new Date(),
).format('DDMMYYYYhhmm')}as26.xlsx`;

export default class As26 extends React.PureComponent {
  constructor(props) {
    super(props);
    const date = new Date();
    this.backclick = this.backclick.bind(this);
    this.invoiceViewClick = this.invoiceViewClick.bind(this);
    this.state = {
      dataList: [],
      loading: false,
      showCalendar: false,
      currentDate: date,
      dates: '',
      token: '',
      userData: '',
      tableHead: ['Sr. No.', 'Dated', 'Particular', 'View'],
      widthArr: [60, 120, 160, 100],
      cloneList: [],
      modalvis: false,
      pdfurl: '',
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backclick);
    const {navigation} = this.props;
    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({loading: true, dataList: []});
    });
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.userData, (userData) => {
        this.setState({userData: userData});
        Pref.getVal(Pref.saveToken, (value) => {
          this.setState({token: value}, () => {
            this.fetchData();
          });
        });
      });
    });
  }

  backclick = () => {
    const {modalvis} = this.state;
    if (modalvis) {
      this.setState({modalvis: false, pdfurl: ''});
      return true;
    }
    return false;
  };

  componentWillUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backclick);
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  fetchData = () => {
    this.setState({loading: true});
    const {refercode, id} = this.state.userData;
    const body = JSON.stringify({
      user_id: Number(id),
    });
    Helper.networkHelperTokenPost(
      Pref.As26Url,
      body,
      Pref.methodPost,
      this.state.token,
      (result) => {
        const {data, response_header} = result;
        const {res_type, message} = response_header;
        if (res_type === `success`) {
          const {dataList} = this.state;
          if (data.length > 0) {
            for (let i = 0; i < data.length; i += 1) {
              const item = data[i];
              const rowData = [];
              rowData.push(`${i + 1}`);
              rowData.push(item.created);
              rowData.push(item.name);
              const invoiceView = (value) => (
                <TouchableWithoutFeedback
                  onPress={() => this.invoiceViewClick(value)}>
                  <View>
                    <Subtitle
                      style={{
                        textAlign: 'center',
                        fontWeight: '400',
                        color: Colors.red900,
                        fontSize: 13,
                      }}>
                      {`View/Download`}
                    </Subtitle>
                  </View>
                </TouchableWithoutFeedback>
              );
              rowData.push(invoiceView(item.filePath));
              dataList.push(rowData);
            }
          }
          this.setState({cloneList: data, dataList: dataList, loading: false});
        } else {
          this.setState({loading: false});
        }
      },
      (error) => {
        this.setState({loading: false});
      },
    );
  };

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  invoiceViewClick = (value) => {
    let parse = value.replace('home/erevbiig/public_html/', '');
    this.setState({modalvis: true, pdfurl: `https://erb.ai/${parse}`});
  };

  render() {
    return (
      <CommonScreen
        title={'Finorbit'}
        loading={this.state.loading}
        enabelWithScroll={false}
        header={
          <LeftHeaders
            title={'My 26AS'}
            showAvtar
            showBack
            showBottom
            bottomIconName={'download'}
            bottomIconTitle={`Excel`}
            bottombg={Colors.red600}
            bottomClicked={() => {
              const {dataList} = this.state;
              if (dataList.length > 0) {
                Helper.writeCSV(HEADER, dataList, FILEPATH, (result) => {
                  console.log(result);
                  if (result) {
                    RNFetchBlob.fs.scanFile([
                      {path: FILEPATH, mime: 'text/csv'},
                    ]),
                      RNFetchBlob.android.addCompleteDownload({
                        title: 'Lead Record',
                        description: 'Lead record exported successfully',
                        mime: 'text/csv',
                        path: FILEPATH,
                        showNotification: true,
                      }),
                      Helper.showToastMessage('Download Complete', 1);
                    //Linking.openURL(`uri:${FILEPATH}`);
                  }
                });
              }
            }}
          />
        }
        headerDis={0.15}
        bodyDis={0.85}
        body={
          <>
            <Modal
              visible={this.state.modalvis}
              setModalVisible={() =>
                this.setState({pdfurl: '', modalvis: false})
              }
              ratioHeight={0.87}
              backgroundColor={`white`}
              topCenterElement={
                <Subtitle
                  style={{
                    color: '#292929',
                    fontSize: 17,
                    fontWeight: '700',
                    letterSpacing: 1,
                  }}>{`26AS`}</Subtitle>
              }
              topRightElement={
                <TouchableWithoutFeedback
                  onPress={() => Helper.downloadFile(this.state.pdfurl, '')}>
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
                      cache: true,
                    }}
                    style={{
                      flex: 1,
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </View>
              }
            />
            {this.state.loading ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  flex: 1,
                }}>
                <ActivityIndicator />
              </View>
            ) : this.state.dataList.length > 0 ? (
              <CommonTable
                dataList={this.state.dataList}
                widthArr={this.state.widthArr}
                tableHead={this.state.tableHead}
                style={{marginTop: sizeHeight(6)}}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContents: 'center',
                  color: '#767676',
                }}>
                <ListError subtitle={'No 26As found...'} />
              </View>
            )}
          </>
        }
      />
    );
  }
}
