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
import Share from 'react-native-share';
import CustomForm from './../finorbit/CustomForm';

let HEADER = `Sr. No.,Date,Lead No,Source,Customer Name,Cust Moble No,Product,Company,Status,Quote,Cif,Policy\n`;
let FILEPATH = `${RNFetchBlob.fs.dirs.SDCardDir}/erb/finpro/${moment(
  new Date(),
).format('DDMMYYYYhhmm')}leadrecord.xlsx`;

export default class As26 extends React.PureComponent {
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
        'Cust Moble No',
        'Product',
        'Company',
        'Status',
        'Quote',
        'Cif',
        'Policy',
      ],
      widthArr: [60, 120, 100, 100, 160, 100, 140, 100, 140, 100, 100, 100],
      cloneList: [],
      modalvis: false,
      pdfurl: '',
      pdfTitle: '',
      quotemodalVis: false,
      quotemailData: '',
      quotemail: '',
      type: '',
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
        Pref.getVal(Pref.USERTYPE, (v) => {
          this.setState({type: v}, () => {
            Pref.getVal(Pref.saveToken, (value) => {
              this.setState({token: value}, () => {
                const {navigation} = this.props;
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

  fetchData = (ref) => {
    //referral
    this.setState({loading: true});
    const {type} = this.state;
    const {refercode, id, username} = this.state.userData;
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
        const {data, response_header} = result;
        const {res_type, message} = response_header;
        if (res_type === `success`) {
          const {dataList} = this.state;
          if (data.length > 0) {
            const sorting = data.sort((a, b) => {
              const sp = a.date.split('-');
              const spz = b.date.split('-');
              return sp[2] - spz[2] || sp[1] - spz[1] || sp[0] - spz[0];
            });
            const sort = sorting.reverse();
            for (let i = 0; i < sort.length; i += 1) {
              const item = sort[i];
              const rowData = [];
              rowData.push(`${i + 1}`);
              rowData.push(item.date);
              rowData.push(item.leadno);
              rowData.push(item.source_type);
              rowData.push(item.name);
              rowData.push(item.mobile);
              rowData.push(item.product);
              rowData.push(item.bank === 'null' ? '' : item.bank);
              rowData.push(item.status);
              const {quotes, mail, sharewhatsapp, sharemail, policy} = item;
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
                          color={Colors.blue400}
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
                          color={Colors.blue400}
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
                      onPress={() => this.cifClick(value)}>
                      <View>
                        <IconChooser
                          name={`whatsapp`}
                          size={20}
                          iconType={2}
                          color={Colors.blue400}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  ) : null}
                  {mail !== '' ? (
                    <TouchableWithoutFeedback
                      onPress={() => this.cifClick(value)}>
                      <View style={{marginStart: 8}}>
                        <IconChooser
                          name={'mail'}
                          size={20}
                          iconType={0}
                          color={Colors.blue400}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  ) : null}
                </View>
              );
              rowData.push(shareView(sharewhatsapp, sharemail));
              const policyView = (value, mail) => (
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
                        color={Colors.blue400}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              );
              rowData.push(policy === '' ? '' : policyView(policy));

              dataList.push(rowData);
            }
          }
          this.setState({
            cloneList: data,
            dataList: dataList,
            loading: false,
          });
        } else {
          this.setState({loading: false});
        }
      },
      (error) => {
        this.setState({loading: false});
      },
    );
  };

  cifClick = (value, titlex) => {
    const sp = value.split('@');
    const url = ``;
    const title = 'FinPro';
    const message = `${sp[0]}`;
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
    Share.open(options);
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
        console.log(`result`, result);
      },
      (error) => {},
    );
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
      if (value.includes('pdf')) {
        this.setState({modalvis: true, pdfurl: value, pdfTitle: title});
      } else {
        Helper.downloadFile(value, title);
      }
    }
  };

  invoiceViewClick = (value, title) => {
    this.setState({modalvis: true, pdfurl: value, pdfTitle: title});
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
    });
    Helper.networkHelperTokenPost(
      Pref.AjaxUrl,
      body,
      Pref.methodPost,
      this.state.token,
      (result) => {
        console.log(`result`, result);
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
      (error) => {
        alert(`Failed to send mail`);
        this.setState({quotemodalVis: false, quotemailData: '', quotemail: ''});
      },
    );
  };

  clickedexport = () => {
    const {dataList} = this.state;
    if (dataList.length > 0) {
      Helper.writeCSV(HEADER, dataList, FILEPATH, (result) => {
        //console.log(result);
        if (result) {
          RNFetchBlob.fs.scanFile([{path: FILEPATH, mime: 'text/csv'}]),
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
  };
  render() {
    return (
      <CommonScreen
        title={'Finorbit'}
        loading={this.state.loading}
        enabelWithScroll={false}
        header={
          <LeftHeaders
            title={'My Lead Record'}
            showAvtar
            showBack
            showBottom
            bottomIconName={'download'}
            bottomIconTitle={`Excel`}
            bottombg={Colors.red600}
            bottomClicked={this.clickedexport}
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
                  }}>
                  {this.state.pdfTitle}
                </Subtitle>
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
                    onChange={(v) => this.setState({quotemail: v})}
                    keyboardType={'email-address'}
                    style={{marginHorizontal: 24}}
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
                <ListError subtitle={'No lead record found...'} />
              </View>
            )}
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
});
