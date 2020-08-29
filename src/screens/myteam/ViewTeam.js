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
import ListError from '../common/ListError';
import CommonTable from '../common/CommonTable';
import RNFetchBlob from 'rn-fetch-blob';
import IconChooser from '../common/IconChooser';
import moment from 'moment';

let HEADER = `Sr. No,Username,Email,Mobile,Pancard,Aadharcard,Status\n`;
let FILEPATH = `${RNFetchBlob.fs.dirs.DownloadDir}/erb/finpro/${moment(
  new Date(),
).format('DDMMYYYYhhmm')}viewTeam.xlsx`;

export default class ViewTeam extends React.PureComponent {
  constructor(props) {
    super(props);
    const date = new Date();
    this.state = {
      dataList: [],
      loading: false,
      showCalendar: false,
      currentDate: date,
      dates: '',
      token: '',
      userData: '',
      tableHead: [
        'Sr. No.',
        'Username',
        'Email',
        'Mobile',
        'Pancard',
        'Aadharcard',
        'Status',
      ],
      widthArr: [60, 100, 160, 100, 100, 100, 100],
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({loading: true});
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

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  fetchData = () => {
    this.setState({loading: true});
    const {refercode} = this.state.userData;
    const body = JSON.stringify({
      refercode: refercode,
    });
    Helper.networkHelperTokenPost(
      Pref.ViewTeamUrl,
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
              rowData.push(`${Lodash.capitalize(item.username)}`);
              rowData.push(`${item.email}`);
              rowData.push(`${item.mobile}`);
              rowData.push(`${Lodash.capitalize(item.pancard)}`);
              rowData.push(`${item.aadharcard}`);
              rowData.push(`${Lodash.capitalize(item.status)}`);
              dataList.push(rowData);
            }
          }
          this.setState({dataList: dataList, loading: false});
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

  render() {
    return (
      <CommonScreen
        title={'Finorbit'}
        loading={this.state.loading}
        enabelWithScroll={false}
        header={
          <LeftHeaders
            title={'View Team'}
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
                }}>
                <ListError subtitle={'No teams found...'} />
              </View>
            )}
          </>
        }
      />
    );
  }
}
