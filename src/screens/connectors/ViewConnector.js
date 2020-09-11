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
import CScreen from '../component/CScreen';
import Download from './../component/Download';

let HEADER = `Sr. No,Username,Name,Email,Mobile,Refcode,LeadRecord,,Status\n`;
let FILEPATH = `${RNFetchBlob.fs.dirs.SDCardDir}/ERB/Finpro/Connector.csv`;

export default class ViewConnector extends React.PureComponent {
  constructor(props) {
    super(props);
    const date = new Date();
    this.refdataClick = this.refdataClick.bind(this);
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
        'Name',
        'Email',
        'Mobile',
        'Refcode',
        'LeadRecord',
        '',
        'Status',
      ],
      widthArr: [60, 100, 140, 140, 100, 100, 100, 100, 100],
      itemSize: 6,
      disableNext: false,
      disableBack: false,
      searchQuery: '',
      cloneList: [],
    };
  }

  componentDidMount() {
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
      Pref.ViewConnectorUrl,
      body,
      Pref.methodPost,
      this.state.token,
      (result) => {
        const {data, response_header} = result;
        const {res_type, message} = response_header;
        if (res_type === `success`) {
          if (data.length > 0) {
            const dataList = data;
            const {itemSize} = this.state;
            this.setState({
              cloneList: dataList,
              dataList: this.returnData(dataList, 0, dataList.length).slice(
                0,
                itemSize,
              ),
              loading: false,
              itemSize: dataList.length > 6 ? 6 : dataList.length,
            });
          } else {
            this.setState({loading: false});
          }
        } else {
          this.setState({loading: false});
        }
      },
      (error) => {
        this.setState({loading: false});
      },
    );
  };

  refdataClick = (value) => {
    NavigationActions.navigate('LeadList', {ref: value});
  };

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  /**
   *
   * @param {*} data
   */
  returnData = (sort, start = 0, end) => {
    const dataList = [];
    console.log(start, end);
    if (sort.length > 0) {
      if (start >= 0) {
        for (let i = start; i < end; i++) {
          const item = sort[i];
          if (item !== undefined && item !== null) {
            const rowData = [];
            rowData.push(`${i + 1}`);
            rowData.push(`${Lodash.capitalize(item.username)}`);
            rowData.push(`${item.rname}`);
            rowData.push(`${item.email}`);
            rowData.push(`${item.rcontact}`);
            rowData.push(`${Lodash.capitalize(item.pancard)}`);
            rowData.push(`${item.refercode}`);
            const refdataView = (value) => (
              <TouchableWithoutFeedback
                onPress={() => this.refdataClick(value)}>
                <View>
                  <Title
                    style={{
                      textAlign: 'center',
                      fontWeight: '400',
                      color: Pref.RED,
                      fontSize: 15,
                    }}>
                    {`View`}
                  </Title>
                </View>
              </TouchableWithoutFeedback>
            );
            rowData.push(refdataView(item.refercode));
            const stdataView = (value) => (
              <View>
                <Title
                  style={{
                    textAlign: 'center',
                    fontWeight: '400',
                    color: Number(value) === 1 ? '#1bd741' : Pref.RED,
                    fontSize: 15,
                  }}>
                  {`${Number(value) === 1 ? `Active` : `Inactive`}`}
                </Title>
              </View>
            );
            rowData.push(stdataView(item.status));
            dataList.push(rowData);
          }
        }
      }
    }
    return dataList;
  };

  /**
   *
   * @param {*} mode true ? next : back
   */
  pagination = (mode) => {
    const {itemSize, cloneList} = this.state;
    let clone = JSON.parse(JSON.stringify(cloneList));
    let plus = itemSize;
    let slicedArray = [];
    if (mode) {
      plus += 6;
      if (itemSize < clone.length) {
        if (plus > clone.length) {
          const rem = clone.length - itemSize;
          plus = itemSize + rem;
        }
        slicedArray = this.returnData(clone, itemSize, plus);
        this.setState({dataList: slicedArray, itemSize: plus});
      }
    } else {
      if (itemSize <= 6) {
        plus = 0;
      } else {
        plus -= 6;
      }
      if (plus >= 0 && plus < clone.length) {
        slicedArray = this.returnData(clone, plus, itemSize);
        this.setState({dataList: slicedArray, itemSize: plus});
      }
    }
  };

  render() {
    return (
      <CScreen
        body={
          <>
            <LeftHeaders showBack title={'View Connector'} />

            <View styleName="horizontal md-gutter">
              <TouchableWithoutFeedback onPress={() => this.pagination(false)}>
                <Title style={styles.itemtopText}>{`Back`}</Title>
              </TouchableWithoutFeedback>
              <View
                style={{
                  height: 16,
                  marginHorizontal: 12,
                  backgroundColor: '#0270e3',
                  width: 1.5,
                }}
              />
              <TouchableWithoutFeedback onPress={() => this.pagination(true)}>
                <Title style={styles.itemtopText}>{`Next`}</Title>
              </TouchableWithoutFeedback>
            </View>
            {this.state.loading ? (
              <View style={styles.loader}>
                <ActivityIndicator />
              </View>
            ) : this.state.dataList.length > 0 ? (
              <CommonTable
                dataList={this.state.dataList}
                widthArr={this.state.widthArr}
                tableHead={this.state.tableHead}
              />
            ) : (
              <View style={styles.emptycont}>
                <ListError subtitle={'No connectors found...'} />
              </View>
            )}
            {this.state.dataList.length > 0 ? (
              <Title style={styles.itemtext}>{`Showing ${
                this.state.itemSize
              }/${Number(this.state.cloneList.length)} entries`}</Title>
            ) : null}
          </>
        }
      />
      // <CommonScreen
      //   title={'Finorbit'}
      //   loading={this.state.loading}
      //   enabelWithScroll={false}
      //   header={
      //     <LeftHeaders
      //       title={'View Connector'}
      //       // showAvtar
      //        showBack
      //       // showBottom
      //       // bottomIconName={'download'}
      //       // bottomIconTitle={`Excel`}
      //       // bottombg={Colors.red600}
      //       // bottomClicked={() => {
      //       //   const {dataList} = this.state;
      //       //   if (dataList.length > 0) {
      //       //     Helper.writeCSV(HEADER, dataList, FILEPATH, (result) => {
      //       //       console.log(result);
      //       //       if (result) {
      //       //         alert(
      //       //           'Data exported successfully \n You can check in Download/ErbFinPro/ directory',
      //       //         );
      //       //         //Linking.openURL(`uri:${FILEPATH}`);
      //       //       }
      //       //     });
      //       //   }
      //       // }}
      //     />
      //   }
      //   headerDis={0.15}
      //   bodyDis={0.85}
      //   body={
      //     <>
      // {this.state.loading ? (
      //   <View
      //     style={{
      //       justifyContent: 'center',
      //       alignSelf: 'center',
      //       flex: 1,
      //     }}>
      //     <ActivityIndicator />
      //   </View>
      // ) : this.state.dataList.length > 0 ? (
      //   <CommonTable
      //     dataList={this.state.dataList}
      //     widthArr={this.state.widthArr}
      //     tableHead={this.state.tableHead}
      //     style={{marginTop: sizeHeight(1.5)}}
      //   />
      // ) : (
      //   <View
      //     style={{
      //       flex: 1,
      //       justifyContent: 'center',
      //       alignItems: 'center',
      //       alignContents: 'center',
      //     }}>
      //     <ListError subtitle={'No connectors found...'} />
      //   </View>
      // )}
      //     </>
      //   }
      // />
    );
  }
}

const styles = StyleSheet.create({
  button: {
    color: 'white',
    paddingVertical: sizeHeight(0.5),
    marginTop: 24,
    marginHorizontal: 24,
    backgroundColor: '#e21226',
    textAlign: 'center',
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 1,
  },
  emptycont: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginVertical: 48,
    paddingVertical: 56,
  },
  loader: {
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 1,
    marginVertical: 48,
    paddingVertical: 48,
  },
  itemtext: {
    letterSpacing: 0.5,
    fontWeight: '700',
    lineHeight: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#0270e3',
    fontSize: 14,
    paddingVertical: 16,
    marginTop: 4,
  },
  itemtopText: {
    letterSpacing: 0.5,
    fontWeight: '700',
    lineHeight: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#0270e3',
    fontSize: 16,
  },
});
