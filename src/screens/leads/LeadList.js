import React from 'react';
import {
  StyleSheet,
  BackHandler,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Subtitle,
  Title,
  View,
  Text,
} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {
  Button,
  ActivityIndicator,
  Searchbar,
} from 'react-native-paper';
import { sizeHeight } from '../../util/Size';
import Lodash from 'lodash';
import LeftHeaders from '../common/CommonLeftHeader';
import ListError from '../common/ListError';
import CommonTable from '../common/CommonTable';
import RNFetchBlob from 'rn-fetch-blob';
import IconChooser from '../common/IconChooser';
import Pdf from 'react-native-pdf';
import Modal from '../../util/Modal';
import Share from 'react-native-share';
import CustomForm from './../finorbit/CustomForm';
import CScreen from './../component/CScreen';
import Download from './../component/Download';

let HEADER = `Sr. No.,Date,Lead No,Source,Customer Name,Moble No,Product,Company,Status,Quote,Cif,Policy,Remark\n`;
let FILEPATH = `${RNFetchBlob.fs.dirs.DownloadDir}/Leadrecord.csv`;

export default class LeadList extends React.PureComponent {
  constructor(props) {
    super(props);
    const date = new Date();
    this.clickedexport = this.clickedexport.bind(this);
    this.backclick = this.backclick.bind(this);
    this.invoiceViewClick = this.invoiceViewClick.bind(this);
    this.cifClick = this.cifClick.bind(this);
    this.quotesClick = this.quotesClick.bind(this);
    this.emailSubmit = this.emailSubmit.bind(this);
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
        'Date',
        'Lead No',
        'Source',
        'Customer Name',
        'Moble No',
        'Product',
        'Company',
        'Status',
        'Quote',
        'Cif',
        'Policy',
        'Remark',
      ],
      widthArr: [60, 120, 100, 100, 160, 100, 140, 100, 140, 100, 100, 100, 100],
      cloneList: [],
      modalvis: false,
      pdfurl: '',
      pdfTitle: '',
      quotemodalVis: false,
      quotemailData: '',
      quotemail: '',
      type: '',
      itemSize: 5,
      disableNext: false,
      disableBack: false,
      searchQuery: '',
      enableSearch: false,
      orderBy: 'asc',
      fileName:''
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backclick);
    const { navigation } = this.props;
    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({ loading: true, dataList: [] });
    });
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.userData, (userData) => {
        this.setState({ userData: userData });
        Pref.getVal(Pref.USERTYPE, (v) => {
          this.setState({ type: v }, () => {
            Pref.getVal(Pref.saveToken, (value) => {
              this.setState({ token: value }, () => {
                const { navigation } = this.props;
                const ref = navigation.getParam('ref', null);
                this.fetchData(ref);
              });
            });
          });
        });
      });
    });
  }

  backclick = () => {
    const { modalvis } = this.state;
    if (modalvis) {
      this.setState({ modalvis: false, pdfurl: '' });
      return true;
    }
    return false;
  };

  componentWillUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backclick);
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  fetchData = (ref) => {
    //referral
    this.setState({ loading: true });
    const { type } = this.state;
    const { refercode, username } = this.state.userData;
    const body = JSON.stringify({
      refercode: ref === null ? refercode : ref,
      team_user: username,
      flag: type === 'referral' ? 1 : 2,
    });
    Helper.networkHelperTokenPost(
      Pref.LeadRecordUrl,
      body,
      Pref.methodPost,
      this.state.token,
      (result) => {
        const { data, response_header } = result;
        const { res_type } = response_header;
        if (res_type === `success`) {
          if (data.length > 0) {
            const sorting = data.sort((a, b) => {
              const sp = a.date.split('-');
              const spz = b.date.split('-');
              return (
                Number(sp[2]) - Number(spz[2]) ||
                Number(sp[1]) - Number(spz[1]) ||
                Number(sp[0]) - Number(spz[0])
              );
            });
            const sort = sorting.reverse();
            const { itemSize } = this.state;
            this.setState({
              cloneList: sort,
              dataList: this.returnData(sort, 0, sort.length).slice(
                0,
                itemSize,
              ),
              loading: false,
              itemSize: sort.length >= 5 ? 5 : sort.length,
            });
          } else {
            this.setState({
              loading: false,
            });
          }
        } else {
          this.setState({ loading: false });
        }
      },
      () => {
        this.setState({ loading: false });
      },
    );
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
            rowData.push(`${Number(i + 1)}`);
            rowData.push(item.date);
            rowData.push(item.leadno);
            rowData.push(item.source_type);
            rowData.push(item.name);
            rowData.push(item.mobile);
            rowData.push(item.product);
            rowData.push(item.bank === 'null' ? '' : item.bank);
            rowData.push(item.status);
            const { quotes, mail, sharewhatsapp, sharemail, policy } = item;
            const quotesView = (value, mail) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {value !== '' ? (
                  <TouchableWithoutFeedback
                    onPress={() => this.quotesClick(value, 'Quote')}>
                    <View>
                      <IconChooser
                        name={value.includes('png') ? `download` : `file-pdf`}
                        size={20}
                        iconType={value.includes('png') ? 0 : 5}
                        color={`#9f9880`}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                ) : null}
                {mail !== '' ? (
                  <TouchableWithoutFeedback
                    onPress={() => this.quotesClick(mail, 'Mail')}>
                    <View style={{ marginStart: 8 }}>
                      <IconChooser
                        name={'mail'}
                        size={20}
                        iconType={0}
                        color={`#9f9880`}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                ) : null}
              </View>
            );
            rowData.push(quotesView(quotes, mail));

            const shareView = (value, mail) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {value !== '' ? (
                  <TouchableWithoutFeedback
                    onPress={() => this.cifClick(value, false)}>
                    <View>
                      <IconChooser
                        name={`whatsapp`}
                        size={20}
                        iconType={2}
                        color={`#1bd741`}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                ) : null}
                {mail !== '' ? (
                  <TouchableWithoutFeedback
                    onPress={() => this.cifClick(value, true)}>
                    <View style={{ marginStart: 8 }}>
                      <IconChooser
                        name={'mail'}
                        size={20}
                        iconType={0}
                        color={`#9f9880`}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                ) : null}
              </View>
            );
            rowData.push(shareView(sharewhatsapp, sharemail));
            const policyView = (value) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableWithoutFeedback
                  onPress={() => this.invoiceViewClick(value, 'Policy')}>
                  <View>
                    <IconChooser
                      name={`download`}
                      size={20}
                      iconType={2}
                      color={`#9f9880`}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            );
            rowData.push(policy === '' ? '' : policyView(policy));
            rowData.push(item.remark);
            dataList.push(rowData);
          }
        }
      }
    }
    return dataList;
  };

  // sortData = (key) => {
  //   const { dataList,orderBy } = this.state;
  //   //const orderchangedlist = Lodash.orderBy(dataList, [key], ['desc'])
  //   //console.log('orderchangedlist', orderchangedlist, dataList);
  //   var result = Lodash.orderBy(dataList, item => item[key], [orderBy]);
  //   result = Lodash.map(result, (item, index) =>{
  //     item[0] = Number(index+1);
  //     return item;
  //   })
  //   //console.log('result', result)
  //   this.setState({ dataList: result,orderBy:orderBy === 'asc' ? 'desc' : 'asc'})
  // }

  // headerItem = (title, key) => {
  //   const item =
  //     <TouchableWithoutFeedback
  //       onPress={() => this.sortData(key)}>
  //       <View
  //         style={{
  //           flexDirection: 'row',
  //           alignSelf: 'center',
  //           alignItems: 'center',
  //           justifyContent: 'center',
  //         }}>
  //         <Title style={{
  //           textAlign: 'center',
  //           fontWeight: '700',
  //           color: '#656259',
  //           fontSize: 16,
  //         }}>
  //           {title}
  //         </Title>
  //         <View>
  //           <IconChooser
  //             name={`sort`}
  //             size={18}
  //             iconType={2}
  //             color={`#555555`}
  //             style={{
  //               marginStart: 6
  //             }}
  //           />
  //         </View>
  //       </View>
  //     </TouchableWithoutFeedback>
  //   return item;
  // }

  /**
   * mode single, multiple
   * @param {*} value 
   * @param {*} mode 
   */
  cifClick = (value, mode) => {
    const { userData } = this.state;
    const { rcontact, rname } = userData;
    const sp = value.split('@');
    const url = ``;
    const title = '';
    const message = `Dear Customer,\n\nGreeting for the day :)\n\nPlease find below the CIF as desired.\n\n${sp[0]}
    \n\nFor further details contact:\n\nRP name : ${rname}\n\nMobile no : ${rcontact}\n\nRegards\n\nTeam ERB`;
    const options = Platform.select({
      ios: {
        activityItemSources: [
          {
            placeholderItem: { type: 'url', content: url },
            item: {
              default: { type: 'url', content: url },
            },
            subject: {
              default: title,
            },
            linkMetadata: { originalUrl: url, url, title },
          },
          {
            placeholderItem: { type: 'text', content: message },
            item: {
              default: { type: 'text', content: message },
              message: null, // Specify no text to share via Messages app.
            },
          },
        ],
      },
      default: {
        title,
        subject: title,
        url: url,
        message: `${message}`,
      },
    });
    const body = JSON.stringify({
      fid: `${sp[1]}`,
      form_name: `${sp[2]}`,
    });
    Helper.networkHelperTokenPost(
      Pref.AjaxUrl,
      body,
      Pref.methodPost,
      this.state.token,
      (result) => {
        //console.log(`result`, result);
      },
      (e) => {
        //console.log('e', e);
      },
    );
    if (mode === true) {
      options.social = Share.Social.EMAIL;
      Share.shareSingle(options);
    } else {
      Share.open(options);
    }
  };

  quotesClick = (value, title) => {
    if (title === `Mail`) {
      const sp = value.split('@');
      this.setState({
        quotemodalVis: true,
        quotemailData: value,
        quotemail: sp[0].includes('@') ? sp[0] : '',
      });
    } else {
      const split = value.split('/');
      const fileName = split[split.length -1];
      if (value.includes('pdf')) {
        this.setState({ modalvis: true, pdfurl: value, pdfTitle: title,fileName:fileName });
      } else {
        Helper.downloadFileWithFileName(value, fileName, fileName, '*/*')
        //Helper.downloadFile(value, title);
      }
    }
  };

  invoiceViewClick = (value, title) => {
    const split = value.split('/');
    const fileName = split[split.length -1];
    this.setState({ modalvis: true, pdfurl: value, pdfTitle: title,fileName:fileName});
  };

  emailSubmit = () => {
    const { quotemailData, quotemail, userData } = this.state;
    const { rname, rcontact } = userData;
    const sp = quotemailData.split('@');
    const body = JSON.stringify({
      email: `${quotemail}`,
      form_name: `${sp[sp.length - 1]}`,
      form_id: `${sp.length === 4 ? sp[1] : sp[0]}`,
      username: rname,
      mobile: rcontact,
      //quote_file:`${sp.length === 4 ? sp[3] : sp[2]}`
    });
    //console.log('body', body);
    Helper.networkHelperTokenPost(
      Pref.AjaxUrl,
      body,
      Pref.methodPost,
      this.state.token,
      (result) => {
        //console.log(`result`, result);
        const { response_header } = result;
        const { res_type } = response_header;
        if (res_type === 'success') {
          alert(`Email sent successfully`);
        }
        this.setState({
          quotemodalVis: false,
          quotemailData: '',
          quotemail: '',
        });
      },
      () => {
        alert(`Failed to send mail`);
        this.setState({ quotemodalVis: false, quotemailData: '', quotemail: '' });
      },
    );
  };

  clickedexport = () => {
    const { cloneList } = this.state;
    if (cloneList.length > 0) {
      const data = this.returnData(cloneList, 0, cloneList.length);
      Helper.writeCSV(HEADER, data, FILEPATH, (result) => {
        if (result) {
          RNFetchBlob.fs.scanFile([{ path: FILEPATH, mime: 'text/csv' }]),
            RNFetchBlob.android.addCompleteDownload({
              title: 'Lead Record',
              description: 'Lead record exported successfully',
              mime: 'text/comma-separated-values',
              path: FILEPATH,
              showNotification: true,
            }),
            Helper.showToastMessage('Download Complete', 1);
        }
      });
    }
  };

  /**
   *
   * @param {*} mode true ? next : back
   */
  pagination = (mode) => {
    const { itemSize, cloneList } = this.state;
    let clone = JSON.parse(JSON.stringify(cloneList));
    let plus = itemSize;
    let slicedArray = [];
    if (mode) {
      plus += 5;
      if (itemSize < clone.length) {
        if (plus > clone.length) {
          const rem = clone.length - itemSize;
          plus = itemSize + rem;
        }
        slicedArray = this.returnData(clone, itemSize, plus);
        this.setState({ dataList: slicedArray, itemSize: plus });
      }
    } else {
      if (itemSize <= 5) {
        plus = 0;
      } else {
        plus -= 5;
      }
      if (plus >= 0 && plus < clone.length) {
        slicedArray = this.returnData(clone, plus, itemSize);
        if (slicedArray.length > 0) {
          this.setState({ dataList: slicedArray, itemSize: plus });
        }
      }
    }
  };

  onChangeSearch = (query) => {
    this.setState({ searchQuery: query });
    const { cloneList, itemSize } = this.state;
    if (cloneList.length > 0) {
      const trimquery = String(query).trim().toLowerCase();
      const clone = JSON.parse(JSON.stringify(cloneList));
      const result = Lodash.filter(clone, (it) => {
        const { date, leadno, source_type, name, mobile, product, bank, status } = it;
        return date && date.trim().toLowerCase().includes(trimquery) || leadno && leadno.trim().toLowerCase().includes(trimquery) || source_type && source_type.trim().toLowerCase().includes(trimquery) || name && name.trim().toLowerCase().includes(trimquery) || mobile && mobile.trim().toLowerCase().includes(trimquery) || product && product.trim().toLowerCase().includes(trimquery) || bank && bank.trim().toLowerCase().includes(trimquery) || status && status.trim().toLowerCase().includes(trimquery);
      });
      const data = result.length > 0 ? this.returnData(result, 0, result.length) : [];
      const count = result.length > 0 ? result.length : itemSize;
      this.setState({ dataList: data, itemSize: count });
    }
  };

  revertBack = () => {
    const { enableSearch } = this.state;
    const { cloneList } = this.state;
    if (enableSearch === true && cloneList.length > 0) {
      const clone = JSON.parse(JSON.stringify(cloneList));
      const data = this.returnData(clone, 0, 5);
      this.setState({ dataList: data });
    }
    this.setState({ searchQuery: '', enableSearch: !enableSearch, itemSize: 5 });
  }

  render() {
    const { searchQuery, enableSearch } = this.state;
    return (
      <CScreen
        body={
          <>
            <LeftHeaders
              showBack
              title={'My Lead Record'}
              bottomBody={
                <>
                  {/* <View styleName="md-gutter">
                    <Searchbar
                      placeholder="Search"
                      onChangeText={this.onChangeSearch}
                      value={searchQuery}
                    />
                  </View> */}
                </>
              }
            />

            <Modal
              visible={this.state.modalvis}
              setModalVisible={() =>
                this.setState({ pdfurl: '', modalvis: false })
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
                  }}>
                  {this.state.pdfTitle}
                </Subtitle>
              }
              topRightElement={
                <TouchableWithoutFeedback
                  onPress={() => Helper.downloadFileWithFileName(`${this.state.pdfurl}`, this.state.fileName, `${this.state.fileName}`, 'application/pdf')}>
                  <View>
                    <IconChooser
                      name="download"
                      size={24}
                      color={Pref.RED}
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
                    fitWidth
                    fitPolicy={0}
                    enablePaging
                    scale={1}

                  />
                </View>
              }
            />

            <Modal
              visible={this.state.quotemodalVis}
              setModalVisible={() =>
                this.setState({
                  quotemodalVis: false,
                  quotemailData: '',
                  quotemail: '',
                })
              }
              ratioHeight={0.6}
              backgroundColor={`white`}
              topCenterElement={
                <Subtitle
                  style={{
                    color: '#292929',
                    fontSize: 17,
                    fontWeight: '700',
                    letterSpacing: 1,
                  }}>
                  {`Share via E-Mail`}
                </Subtitle>
              }
              topRightElement={null}
              children={
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'white',
                  }}>
                  <CustomForm
                    label={`Email`}
                    placeholder={`Enter email id`}
                    value={this.state.quotemail}
                    onChange={(v) => this.setState({ quotemail: v })}
                    keyboardType={'email-address'}
                    style={{ marginHorizontal: 12 }}
                  />

                  <Button
                    mode={'flat'}
                    uppercase={true}
                    dark={true}
                    loading={false}
                    style={[styles.button]}
                    onPress={this.emailSubmit}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 16,
                        letterSpacing: 1,
                      }}>
                      {`Submit`}
                    </Text>
                  </Button>
                </View>
              }
            />
            <View styleName="horizontal md-gutter space-between">
              <View styleName="horizontal">
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
              <TouchableWithoutFeedback onPress={this.revertBack}>
                <View styleName="horizontal v-center h-center">
                  <IconChooser name={enableSearch ? 'x' : 'search'} size={24} color={'#555555'} />
                </View>
              </TouchableWithoutFeedback>

            </View>

            {enableSearch === true ? <View styleName='md-gutter'>
              <Searchbar
                placeholder="Search"
                onChangeText={this.onChangeSearch}
                value={searchQuery}
                style={{
                  elevation: 0,
                  borderColor: '#dbd9cc',
                  borderWidth: 0.5,
                  borderRadius: 8
                }}
                clearIcon={() => null}
              />
            </View> : null}

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
                    <ListError subtitle={'No Lead Record Found...'} />
                  </View>
                )}
            {this.state.dataList.length > 0 ? (
              <>
                <Title style={styles.itemtext}>{`Showing ${this.state.itemSize
                  }/${Number(this.state.cloneList.length)} entries`}</Title>
                <Download rightIconClick={this.clickedexport} />
              </>
            ) : null}
          </>
        }
      />
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
