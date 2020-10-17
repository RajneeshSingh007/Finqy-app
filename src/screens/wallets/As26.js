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
import CScreen from '../component/CScreen';
import Download from '../component/Download';

let HEADER = `Sr. No.,Dated,Particular,View\n`;
let FILEPATH = `${RNFetchBlob.fs.dirs.SDCardDir}/ERB/Finpro/AS26.csv`;

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
      widthArr: [60, 120, 200, 100],
      cloneList: [],
      modalvis: false,
      pdfurl: '',
      itemSize: 6,
      disableNext: false,
      disableBack: false,
      searchQuery: '',
            enableSearch:false
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
          if (data.length > 0) {
            const sorting = data.sort((a, b) => {
              const sp = a.created.split(' ');
              const spz = b.created.split(' ');
              return (
                Number(sp[0].split('/')[2]) - Number(spz[0].split('/')[2]) ||
                Number(sp[0].split('/')[1]) - Number(spz[0].split('/')[1]) ||
                Number(sp[0].split('/')[0]) - Number(spz[0].split('/')[0])
              );
            });
            const sort = sorting.reverse();
            const {itemSize} = this.state;
            this.setState({
              cloneList: sort,
              dataList: this.returnData(sort, 0, sort.length).slice(
                0,
                itemSize,
              ),
              loading: false,
              itemSize: sort.length > 6 ? 6 : sort.length,
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

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  invoiceViewClick = (value) => {
    let parse = value.replace('home/erevbiig/public_html/', '');
    this.setState({modalvis: true, pdfurl: `https://erb.ai/${parse}`});
  };

  /**
   *
   * @param {*} data
   */
  returnData = (sort, start = 0, end) => {
    const dataList = [];
    if (sort.length > 0) {
      if (start >= 0) {
        for (let i = start; i < end; i++) {
          const item = sort[i];
          if (item !== undefined && item !== null) {
            const rowData = [];
            rowData.push(`${i + 1}`);
            rowData.push(item.created);
            rowData.push(item.name);
            const invoiceView = (value) => (
              <TouchableWithoutFeedback
                onPress={() => this.invoiceViewClick(value)}>
                <View>
                  <Title
                    style={{
                      textAlign: 'center',
                      fontWeight: '400',
                      color: Pref.RED,
                      fontSize: 15,
                    }}>
                    {`View/Download`}
                  </Title>
                </View>
              </TouchableWithoutFeedback>
            );
            rowData.push(invoiceView(item.filePath));
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

  clickedexport = () => {
    const {cloneList} = this.state;
    if (cloneList.length > 0) {
      const data = this.returnData(cloneList,0, cloneList.length);
      Helper.writeCSV(HEADER, data, FILEPATH, (result) => {
        console.log(result);
        if (result) {
          RNFetchBlob.fs.scanFile([{path: FILEPATH, mime: 'text/csv'}]),
            RNFetchBlob.android.addCompleteDownload({
              title: 'AS26',
              description: 'AS26 record exported successfully',
              mime: 'text/comma-separated-values',
              path: FILEPATH,
              showNotification: true,
            }),
            Helper.showToastMessage('Download Complete', 1);
        }
      });
    }
  };

  render() {
    return (
      <CScreen
        body={
          <>
            <LeftHeaders showBack title={'26AS'} />

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
                  onPress={() => Helper.downloadFileWithFileName(`${this.state.pdfurl}`,'AS26', 'AS26.pdf','application/pdf')}>
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
                <ListError subtitle={'No 26AS found...'} />
              </View>
            )}

            {this.state.dataList.length > 0 ? (
              <>
                <Title style={styles.itemtext}>{`Showing ${
                  this.state.itemSize
                }/${Number(this.state.cloneList.length)} entries`}</Title>
                <Download rightIconClick={this.clickedexport} />
              </>
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
      //       title={'My 26AS'}
      //       showAvtar
      //       showBack
      //       showBottom
      //       bottomIconName={'download'}
      //       bottomIconTitle={`Excel`}
      //       bottombg={Colors.red600}
      //       bottomClicked={() => {
      // const {dataList} = this.state;
      // if (dataList.length > 0) {
      //   Helper.writeCSV(HEADER, dataList, FILEPATH, (result) => {
      //     console.log(result);
      //     if (result) {
      //       RNFetchBlob.fs.scanFile([
      //         {path: FILEPATH, mime: 'text/csv'},
      //       ]),
      //         RNFetchBlob.android.addCompleteDownload({
      //           title: 'Lead Record',
      //           description: 'Lead record exported successfully',
      //           mime: 'text/csv',
      //           path: FILEPATH,
      //           showNotification: true,
      //         }),
      //         Helper.showToastMessage('Download Complete', 1);
      //       //Linking.openURL(`uri:${FILEPATH}`);
      //     }
      //   });
      // }
      //       }}
      //     />
      //   }
      //   headerDis={0.15}
      //   bodyDis={0.85}
      //   body={
      //     <>
      // <Modal
      //   visible={this.state.modalvis}
      //   setModalVisible={() =>
      //     this.setState({pdfurl: '', modalvis: false})
      //   }
      //   ratioHeight={0.87}
      //   backgroundColor={`white`}
      //   topCenterElement={
      //     <Subtitle
      //       style={{
      //         color: '#292929',
      //         fontSize: 17,
      //         fontWeight: '700',
      //         letterSpacing: 1,
      //       }}>{`26AS`}</Subtitle>
      //   }
      //   topRightElement={
      //     <TouchableWithoutFeedback
      //       onPress={() => Helper.downloadFile(this.state.pdfurl, '')}>
      //       <View>
      //         <IconChooser
      //           name="download"
      //           size={24}
      //           color={Colors.blue900}
      //         />
      //       </View>
      //     </TouchableWithoutFeedback>
      //   }
      //   children={
      //     <View
      //       style={{
      //         flex: 1,
      //         width: '100%',
      //         height: '100%',
      //         backgroundColor: 'white',
      //       }}>
      //       <Pdf
      //         source={{
      //           uri: this.state.pdfurl,
      //           cache: true,
      //         }}
      //         style={{
      //           flex: 1,
      //           width: '100%',
      //           height: '100%',
      //         }}
      //       />
      //     </View>
      //   }
      // />
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
      //     style={{marginTop: sizeHeight(6)}}
      //   />
      // ) : (
      //   <View
      //     style={{
      //       flex: 1,
      //       justifyContent: 'center',
      //       alignItems: 'center',
      //       alignContents: 'center',
      //       color: '#767676',
      //     }}>
      //     <ListError subtitle={'No 26As found...'} />
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
