import React from 'react';
import {
  StyleSheet,
  BackHandler,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import {Subtitle, Title, View, Text} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {Button, ActivityIndicator, Searchbar} from 'react-native-paper';
import {sizeHeight} from '../../util/Size';
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
import NavigationActions from '../../util/NavigationActions';
import {
  constructObjEditLead,
  constructObjEditSamadhan,
} from '../../util/FormCheckHelper';
import FileUploadForm from '../finorbit/FileUploadForm';
import PaginationNumbers from '../component/PaginationNumbers';

let HEADER = `Sr. No.,Date,Lead No,Source,Customer Name,Mobile No,Product,Company,Status,Quote,Cif,Policy,Remark\n`;
let FILEPATH = `${RNFetchBlob.fs.dirs.DownloadDir}/`;

const ITEM_LIMIT = 10;

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
    this.headerchange = false;
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
        'Mobile No',
        'Product',
        'Company',
        'Status',
        'Quote',
        'Cif',
        'Policy',
        'Remark',
        'Download',
        '',
      ],
      widthArr: [
        60,
        120,
        100,
        100,
        160,
        100,
        140,
        100,
        140,
        100,
        100,
        100,
        140,
        80,
        60,
      ],
      cloneList: [],
      modalvis: false,
      pdfurl: '',
      pdfTitle: '',
      quotemodalVis: false,
      quotemailData: '',
      quotemail: '',
      type: '',
      itemSize: ITEM_LIMIT,
      disableNext: false,
      disableBack: false,
      searchQuery: '',
      enableSearch: false,
      orderBy: 'asc',
      fileName: '',
      downloadFormTitle: '',
      downloadModal: false,
      editThird: null,
      flag: 2,
      backScreen: null,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backclick);
    const {navigation} = this.props;
    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({loading: true, dataList: []});
    });
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.userData, userData => {
        this.setState({userData: userData});
        Pref.getVal(Pref.USERTYPE, v => {
          this.setState({type: v}, () => {
            const {navigation} = this.props;
            const ref = navigation.getParam('ref', null);
            var flag = navigation.getParam('flag', 2);
            if (v !== 'referral') {
              flag = 1;
            }
            const backScreen = navigation.getParam('backScreen', null);
            Pref.getVal(Pref.saveToken, value => {
              this.setState(
                {
                  type: v,
                  token: value,
                  backScreen: backScreen,
                  flag: flag,
                  ref: ref,
                },
                () => {
                  this.fetchData();
                },
              );
            });
          });
        });
      });
    });
  }

  backclick = () => {
    const {modalvis, backScreen, flag} = this.state;
    if (modalvis) {
      this.setState({modalvis: false, pdfurl: ''});
      return true;
    }
    if (flag === 1 && Helper.nullStringCheck(backScreen) === false) {
      this.setState({backScreen: null});
      NavigationActions.navigate(backScreen);
      return true;
    } else {
      NavigationActions.goBack();
      BackHandler.removeEventListener('hardwareBackPress', this.backclick);
      return true;
    }
    //return false;
  };

  componentWillUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backclick);
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  fetchData = () => {
    //referral
    this.setState({loading: true});
    const {type, ref, flag} = this.state;
    const {refercode, username} = this.state.userData;
    const body = JSON.stringify({
      refercode: ref === null ? refercode : ref,
      team_user: username,
      flag: flag,
      type: type,
    });
    //console.log('body', body);
    Helper.networkHelperTokenPost(
      Pref.LeadRecordUrl,
      body,
      Pref.methodPost,
      this.state.token,
      result => {
        const {data, response_header} = result;
        const {res_type} = response_header;
        if (res_type === `success`) {
          if (data.length > 0) {
            const sorting = data.sort((a, b) => {
              if (a.date.includes(' ') && b.date.includes(' ')) {
                const splita = a.date.split(/\s/g);
                const splitb = b.date.split(/\s/g);
                const sp = splita[0].split('-');
                const spz = splitb[0].split('-');
                return (
                  Number(sp[2]) - Number(spz[2]) ||
                  Number(sp[1]) - Number(spz[1]) ||
                  Number(sp[0]) - Number(spz[0])
                );
              } else {
                const sp = a.date.split('-');
                const spz = b.date.split('-');
                return (
                  Number(sp[2]) - Number(spz[2]) ||
                  Number(sp[1]) - Number(spz[1]) ||
                  Number(sp[0]) - Number(spz[0])
                );
              }
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
              itemSize: sort.length <= ITEM_LIMIT ? sort.length : ITEM_LIMIT,
            });
          } else {
            this.setState({
              loading: false,
            });
          }
        } else {
          this.setState({loading: false});
        }
      },
      e => {
        this.setState({loading: false});
      },
    );
  };

  editLead = item => {
    const {product} = item;
    //console.log('item', item)
    let pname = '';
    if (product === 'Mutual Fund') {
      pname = 'Mutual Fund';
    } else if (product === `Health Insurance`) {
      pname = `Health Insurance`;
    } else if (product === `Life Cum Investment`) {
      pname = `Life Cum Invt. Plan`;
    } else {
      pname = product;
    }
    if (product === 'Insurance Samadhan') {
      NavigationActions.navigate('Samadhan', {
        leadData: constructObjEditSamadhan(item),
        title: pname,
        url: '',
        edit: true,
      });
    } else {
      NavigationActions.navigate('FinorbitForm', {
        leadData: constructObjEditLead(item),
        title: pname,
        url: '',
        edit: true,
      });
    }
  };

  downloadFile = item => {
    const {product} = item;
    //console.log('item', item)
    let pname = '';
    if (product === 'Mutual Fund') {
      pname = 'Mutual Fund';
    } else if (product === `Health Insurance`) {
      pname = `Health Insurance`;
    } else if (product === `Life Cum Investment`) {
      pname = `Life Cum Invt. Plan`;
    } else {
      pname = product;
    }
    const getAll = constructObjEditLead(item);
    if (
      Helper.nullCheck(getAll.first) === false &&
      Helper.nullStringCheck(getAll.first.employ) === false
    ) {
      if (
        (pname === 'Home Loan' || pname === 'Loan Against Property') &&
        getAll.first &&
        getAll.first.employ === 'Salaried'
      ) {
        this.headerchange = true;
      } else if (
        (pname === 'Home Loan' || pname === 'Loan Against Property') &&
        getAll.first &&
        getAll.first.employ === 'Self Employed'
      ) {
        this.headerchange = false;
      }
    }
    this.setState({
      downloadFormTitle: pname,
      downloadModal: true,
      editThird: getAll.third,
    });
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
            const {quotes, mail, sharewhatsapp, sharemail, policy} = item;
            const rowData = [];
            rowData.push(`${Number(i + 1)}`);
            rowData.push(item.date);
            rowData.push(item.leadno);
            rowData.push(item.source_type);
            rowData.push(item.name);
            rowData.push(item.mobile);
            rowData.push(item.product);
            rowData.push(
              item.bank === 'null' || item.bank === '' ? '' : item.bank,
            );
            rowData.push(item.status);
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
                    <View style={{marginStart: 8}}>
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
                    <View style={{marginStart: 8}}>
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
            const policyView = value => (
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

            const downloadView = value => (
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableWithoutFeedback
                  onPress={() => this.downloadFile(value)}>
                  <View>
                    <IconChooser
                      name={`download`}
                      size={20}
                      color={`#0270e3`}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            );
            if (
              Helper.nullCheck(item.downloadenable) === false &&
              item.downloadenable === 0
            ) {
              rowData.push(downloadView(item));
            } else {
              rowData.push('');
            }

            const editView = value => (
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableWithoutFeedback onPress={() => this.editLead(value)}>
                  <View>
                    <IconChooser name={`edit-2`} size={20} color={`#9f9880`} />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            );
            if (
              Helper.nullCheck(item.editenable) === false &&
              item.editenable === 0
            ) {
              rowData.push(editView(item));
            } else {
              rowData.push('');
            }

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
    const {userData} = this.state;
    const {rcontact, rname} = userData;
    const sp = value.split('@');
    const url = ``;
    const title = '';
    const message = `Dear Customer,\n\nGreeting for the day :)\n\nPlease find below the CIF as desired.\n\n${sp[0]}
    \n\nFor further details contact:\n\nRP name : ${rname}\n\nMobile no : ${rcontact}\n\nRegards\n\nTeam ERB`;
    const options = Platform.select({
      ios: {
        activityItemSources: [
          {
            placeholderItem: {type: 'url', content: url},
            item: {
              default: {type: 'url', content: url},
            },
            subject: {
              default: title,
            },
            linkMetadata: {originalUrl: url, url, title},
          },
          {
            placeholderItem: {type: 'text', content: message},
            item: {
              default: {type: 'text', content: message},
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
      result => {
        //console.log(`result`, result);
      },
      e => {
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
      const fileName = split[split.length - 1];
      if (value.includes('pdf')) {
        this.setState({
          modalvis: true,
          pdfurl: value,
          pdfTitle: title,
          fileName: fileName,
        });
      } else {
        Helper.downloadFileWithFileName(value, fileName, fileName, '*/*');
        //Helper.downloadFile(value, title);
      }
    }
  };

  invoiceViewClick = (value, title) => {
    const split = value.split('/');
    const fileName = split[split.length - 1];
    this.setState({
      modalvis: true,
      pdfurl: value,
      pdfTitle: title,
      fileName: fileName,
    });
  };

  emailSubmit = () => {
    const {quotemailData, quotemail, userData} = this.state;
    const {rname, rcontact} = userData;
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
      result => {
        //console.log(`result`, result);
        const {response_header} = result;
        const {res_type} = response_header;
        if (res_type === 'success') {
          alert(`Email sent successfully`);
        }
        this.setState({
          quotemodalVis: false,
          quotemailData: '',
          quotemail: '',
        });
      },
      e => {
        alert(`Failed to send mail`);
        this.setState({quotemodalVis: false, quotemailData: '', quotemail: ''});
      },
    );
  };

  clickedexport = () => {
    const {cloneList, userData} = this.state;
    if (cloneList.length > 0) {
      const data = this.returnData(cloneList, 0, cloneList.length);
      const {refercode, username} = userData;
      const name = `${refercode}_MyLeadRecord`;
      const finalFilePath = `${FILEPATH}${name}.csv`;
      Helper.writeCSV(HEADER, data, finalFilePath, result => {
        if (result) {
          RNFetchBlob.fs.scanFile([{path: finalFilePath, mime: 'text/csv'}]),
            RNFetchBlob.android.addCompleteDownload({
              title: name,
              description: 'Lead record exported successfully',
              mime: 'text/comma-separated-values',
              path: finalFilePath,
              showNotification: true,
            }),
            Helper.showToastMessage('Download Complete', 1);
        }
      });
    }
  };

  onChangeSearch = query => {
    this.setState({searchQuery: query});
    const {cloneList, itemSize} = this.state;
    if (cloneList.length > 0) {
      const trimquery = String(query)
        .trim()
        .toLowerCase();
      const clone = JSON.parse(JSON.stringify(cloneList));
      const result = Lodash.filter(clone, it => {
        const {
          date,
          leadno,
          source_type,
          name,
          mobile,
          product,
          bank,
          status,
        } = it;
        return (
          (date &&
            date
              .trim()
              .toLowerCase()
              .includes(trimquery)) ||
          (leadno &&
            leadno
              .trim()
              .toLowerCase()
              .includes(trimquery)) ||
          (source_type &&
            source_type
              .trim()
              .toLowerCase()
              .includes(trimquery)) ||
          (name &&
            name
              .trim()
              .toLowerCase()
              .includes(trimquery)) ||
          (mobile &&
            mobile
              .trim()
              .toLowerCase()
              .includes(trimquery)) ||
          (product &&
            product
              .trim()
              .toLowerCase()
              .includes(trimquery)) ||
          (bank &&
            bank
              .trim()
              .toLowerCase()
              .includes(trimquery)) ||
          (status &&
            status
              .trim()
              .toLowerCase()
              .includes(trimquery))
        );
      });
      const data =
        result.length > 0 ? this.returnData(result, 0, result.length) : [];
      const count = result.length > 0 ? result.length : itemSize;
      this.setState({dataList: data, itemSize: count});
    }
  };

  revertBack = () => {
    const {enableSearch} = this.state;
    const {cloneList} = this.state;
    if (enableSearch === true && cloneList.length > 0) {
      const clone = JSON.parse(JSON.stringify(cloneList));
      const data = this.returnData(clone, 0, ITEM_LIMIT);
      this.setState({dataList: data});
    }
    this.setState({
      searchQuery: '',
      enableSearch: !enableSearch,
      itemSize: ITEM_LIMIT,
    });
  };

  pageNumberClicked = (start, end) => {
    const {cloneList} = this.state;
    const clone = JSON.parse(JSON.stringify(cloneList));
    const data = this.returnData(clone, start, end);
    this.setState({
      dataList: data,
      itemSize: end,
    });
  };

  render() {
    const {searchQuery, enableSearch, editThird, flag, type} = this.state;
    return (
      <CScreen
        refresh={() => {
          this.fetchData();
        }}
        body={
          <>
            <LeftHeaders
              backClicked={this.backclick}
              showBack
              title={
                type === ''
                  ? ''
                  : type !== 'referaal'
                  ? 'My Lead Records'
                  : flag === 2
                  ? 'My Lead Records'
                  : 'Lead Records'
              }
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
              visible={this.state.downloadModal}
              setModalVisible={() => this.setState({downloadModal: false})}
              ratioHeight={0.6}
              backgroundColor={`white`}
              centerFlex={0.8}
              topCenterElement={
                <Subtitle
                  style={{
                    color: '#292929',
                    fontSize: 17,
                    fontWeight: '700',
                    letterSpacing: 1,
                  }}>
                  {`Download Attachments`}
                </Subtitle>
              }
              children={
                <CScreen
                  showfooter={false}
                  body={
                    <View style={{marginStart: 8, marginEnd: 8}}>
                      <FileUploadForm
                        truDownloadEnable={1}
                        downloadTitles={'dhdh'}
                        mode={true}
                        title={this.state.downloadFormTitle}
                        headerchange={this.headerchange}
                        editItemRestore={editThird}
                        rcCopy={editThird && editThird.rcCopy}
                        oldInsCopy={editThird && editThird.oldInsCopy}
                        pucCopy={editThird && editThird.pucCopy}
                        policycopy={editThird && editThird.policycopy}
                        panCard={editThird && editThird.panCard}
                        aadharCard={editThird && editThird.aadharCard}
                        salarySlip={editThird && editThird.salarySlip}
                        salarySlip1={editThird && editThird.salarySlip1}
                        salarySlip2={editThird && editThird.salarySlip2}
                        salarySlip3={editThird && editThird.salarySlip3}
                        salarySlip4={editThird && editThird.salarySlip4}
                        salarySlip5={editThird && editThird.salarySlip5}
                        bankState={editThird && editThird.bankState}
                      />
                    </View>
                  }
                />
              }
            />

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
                  }}>
                  {this.state.pdfTitle}
                </Subtitle>
              }
              topRightElement={
                <TouchableWithoutFeedback
                  onPress={() =>
                    Helper.downloadFileWithFileName(
                      `${this.state.pdfurl}`,
                      this.state.fileName,
                      `${this.state.fileName}`,
                      'application/pdf',
                    )
                  }>
                  <View>
                    <IconChooser name="download" size={24} color={Pref.RED} />
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
                    onChange={v => this.setState({quotemail: v})}
                    keyboardType={'email-address'}
                    style={{marginHorizontal: 12}}
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
              <PaginationNumbers
                dataSize={this.state.cloneList.length}
                itemSize={this.state.itemSize}
                itemLimit={ITEM_LIMIT}
                pageNumberClicked={this.pageNumberClicked}
              />
              <TouchableWithoutFeedback onPress={this.revertBack}>
                <View styleName="horizontal v-center h-center">
                  <IconChooser
                    name={enableSearch ? 'x' : 'search'}
                    size={24}
                    color={'#555555'}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>

            {enableSearch === true ? (
              <View styleName="md-gutter">
                <Searchbar
                  placeholder="Search"
                  onChangeText={this.onChangeSearch}
                  value={searchQuery}
                  style={{
                    elevation: 0,
                    borderColor: '#dbd9cc',
                    borderWidth: 0.5,
                    borderRadius: 8,
                  }}
                  clearIcon={() => null}
                />
              </View>
            ) : null}

            {this.state.loading ? (
              <View style={styles.loader}>
                <ActivityIndicator />
              </View>
            ) : this.state.dataList.length > 0 ? (
              <CommonTable
                enableHeight={false}
                dataList={this.state.dataList}
                widthArr={this.state.widthArr}
                tableHead={this.state.tableHead}
              />
            ) : (
              <View style={styles.emptycont}>
                <ListError subtitle={'No Lead Records Found...'} />
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
