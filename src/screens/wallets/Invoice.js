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
} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {
  Colors,
  ActivityIndicator,
} from 'react-native-paper';
import {sizeHeight} from '../../util/Size';
import Lodash from 'lodash';
import LeftHeaders from '../common/CommonLeftHeader';
import ListError from '../common/ListError';
import CommonTable from '../common/CommonTable';
import RNFetchBlob from 'rn-fetch-blob';
import IconChooser from '../common/IconChooser';
import Pdf from 'react-native-pdf';
import Modal from './../../util/Modal';
import CScreen from '../component/CScreen';
import Download from '../component/Download';
import PaginationNumbers from '../component/PaginationNumbers';

//Summary
let HEADER = `Sr. No.,Invoice No,Status,Invoice Amount,Gross Amount,TDS,Paid Amount,Payment Date,Reference No,Invoice\n`;
let FILEPATH = `${RNFetchBlob.fs.dirs.SDCardDir}/Invoice.csv`;
const ITEM_LIMIT = 10;

export default class Invoice extends React.PureComponent {
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
      tableHead: [
        'Sr. No.',
        'Invoice No',
        'Status',
        'Invoice Amount',
        'Gross Amount',
        'TDS',
        'Paid Amount',
        'Payment Date',
        'Reference No',
        'Invoice',
      ],
      widthArr: [60, 100, 60, 136, 100, 60, 100, 100, 100, 100],
      cloneList: [],
      modalvis: false,
      pdfurl: '',
      itemSize: ITEM_LIMIT,
      disableNext: false,
      disableBack: false,
      searchQuery: '',
      enableSearch: false,
      utype: '',
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
          this.setState({utype: v});
          Pref.getVal(Pref.saveToken, value => {
            this.setState({token: value}, () => {
              this.fetchData();
            });
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
      user_id: `${refercode}`,
    });
    Helper.networkHelperTokenPost(
      Pref.WalletInvoiceUrl,
      body,
      Pref.methodPost,
      this.state.token,
      result => {
        const {data, response_header} = result;
        const {res_type, message} = response_header;
        if (res_type === `success`) {
          if (data.length > 0) {
            const sorting = data.sort((a, b) => {
              const sp = a.summary.date.split('-');
              const spz = b.summary.date.split('-');
              return (
                Number(sp[2]) - Number(spz[2]) ||
                Number(sp[1]) - Number(spz[1]) ||
                Number(sp[0]) - Number(spz[0])
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
              itemSize: sort.length <= ITEM_LIMIT ? sort.length : ITEM_LIMIT,
            });
          } else {
            this.setState({loading: false});
          }
        } else {
          this.setState({loading: false});
        }
      },
      error => {
        this.setState({loading: false});
      },
    );
  };

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  invoiceViewClick = value => {
    const {utype} = this.state;
    this.setState({
      modalvis: true,
      pdfurl: `${Pref.ApiDirUrl}${value}&type=${utype}`,
    });
  };

  /**
   *
   * @param {*} data
   */
  returnData = (sort, start = 0, end) => {
    const {refercode, id} = this.state.userData;
    const dataList = [];
    if (sort.length > 0) {
      if (start >= 0) {
        for (let i = start; i < end; i++) {
          const item = sort[i];
          if (item !== undefined && item !== null) {
            const rowData = [];
            rowData.push(`${i + 1}`);
            rowData.push(`${Lodash.capitalize(item.invoice_no)}`);
            const statusView = value => (
              <View>
                <Title
                  style={{
                    textAlign: 'center',
                    fontWeight: '400',
                    color: value === 'Paid' ? Pref.RED : '#1bd741',
                    fontSize: 15,
                  }}>
                  {Lodash.capitalize(value)}
                </Title>
              </View>
            );
            rowData.push(statusView(item.status));
            rowData.push(`${item.invoice_amount}`);
            rowData.push(`${item.gross_amount}`);
            rowData.push(`${item.tds}`);
            rowData.push(`${item.paid_amount}`);
            rowData.push(`${item.payment_date}`);
            rowData.push(`${item.ref_no}`);
            const invoiceView = (value, userid) => (
              <TouchableWithoutFeedback
                onPress={() =>
                  this.invoiceViewClick(
                    `tool_invoice_pdf.php?id=${value}&user_id=${userid}`,
                  )
                }>
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
            //refercode
            rowData.push(invoiceView(id, refercode));
            //rowData.push(`View`);
            dataList.push(rowData);
          }
        }
      }
    }
    return dataList;
  };


  clickedexport = () => {
    const {cloneList} = this.state;
    if (cloneList.length > 0) {
      const data = this.returnData(cloneList, 0, cloneList.length);
      Helper.writeCSV(HEADER, data, FILEPATH, result => {
        //console.log(result);
        if (result) {
          RNFetchBlob.fs.scanFile([{path: FILEPATH, mime: 'text/csv'}]),
            RNFetchBlob.android.addCompleteDownload({
              title: 'Invoice Record',
              description: 'Invoice record exported successfully',
              mime: 'text/comma-separated-values',
              path: FILEPATH,
              showNotification: true,
            }),
            Helper.showToastMessage('Download Complete', 1);
        }
      });
    }
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
    return (
      <CScreen
        refresh={() => this.fetchData()}
        body={
          <>
            <LeftHeaders showBack 
              title={Helper.getScreenName(this.props)}
              />
            <View styleName="horizontal md-gutter">
            <PaginationNumbers
                dataSize={this.state.cloneList.length}
                itemSize={this.state.itemSize}
                itemLimit={ITEM_LIMIT}
                pageNumberClicked={this.pageNumberClicked}
              />
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
                  }}>{`Invoice`}</Subtitle>
              }
              topRightElement={
                <TouchableWithoutFeedback
                  onPress={() =>
                    Helper.downloadFileWithFileName(
                      `${this.state.pdfurl}`,
                      'Invoice',
                      'Invoice.pdf',
                      'application/pdf',
                    )
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
                    fitWidth
                    fitPolicy={0}
                    enablePaging
                    scale={1}
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
              enableHeight={false}
                dataList={this.state.dataList}
                widthArr={this.state.widthArr}
                tableHead={this.state.tableHead}
              />
            ) : (
              <View style={styles.emptycont}>
                <ListError subtitle={'No invoice found...'} />
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
