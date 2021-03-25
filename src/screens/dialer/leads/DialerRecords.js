import React from 'react';
import {
  StyleSheet,
  BackHandler,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import {Title, View, Subtitle} from '@shoutem/ui';
import * as Helper from '../../../util/Helper';
import * as Pref from '../../../util/Pref';
import {ActivityIndicator, Searchbar, Portal} from 'react-native-paper';
import {sizeHeight} from '../../../util/Size';
import Lodash from 'lodash';
import LeftHeaders from '../../common/CommonLeftHeader';
import ListError from '../../common/ListError';
import CommonTable from '../../common/CommonTable';
import RNFetchBlob from 'rn-fetch-blob';
import IconChooser from '../../common/IconChooser';
import CScreen from './../../component/CScreen';
import NavigationActions from '../../../util/NavigationActions';
import moment from 'moment';
import PaginationNumbers from './../../component/PaginationNumbers';
import Download from '../../component/Download';
import Timeline from 'react-native-timeline-flatlist';

let FILEPATH = `${RNFetchBlob.fs.dirs.DownloadDir}/`;
const ITEM_LIMIT = 10;

export default class DialerRecords extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderDetail = this.renderDetail.bind(this);
    this.exportCallLogs = this.exportCallLogs.bind(this);
    this.state = {
      dataList: [],
      loading: false,
      token: '',
      userData: '',
      tableHead: [],
      widthArr: [],
      cloneList: [],
      type: '',
      itemSize: ITEM_LIMIT,
      orderBy: 'asc',
      fileName: '',
      csvHeader: `Sr. No.Name,Number,Call Date,Call Duration,Status,Remarks\n`,
      detailShow: false,
      threadList: [],
      threadLoader: true,
      filterMode: 'Today',
      callLogData: [],
      userref: '',
      findUsername: null,
      exportEnabled: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backClick);
    const {navigation} = this.props;
    const active = navigation.getParam('active', 1);
    const exportEnabled = navigation.getParam('export', false);
    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({loading: true, dataList: []});
    });
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.userData, userData => {
        this.setState({
          userData: userData,
          active: active,
          exportEnabled: exportEnabled,
        });
        Pref.getVal(Pref.USERTYPE, v => {
          this.setState({type: v}, () => {
            Pref.getVal(Pref.saveToken, value => {
              this.setState({token: value}, () => {
                this.fetchData();
              });
            });
          });
        });
      });
    });
  }

  backClick = () => {
    const {detailShow} = this.state;
    if (detailShow) {
      this.setState({
        detailShow: false,
        threadList: [],
        threadLoader: false,
      });
    } else {
      NavigationActions.goBack();
      BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    }
    return true;
  };

  componentWillUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  fetchData = () => {
    this.setState({loading: true});
    const {active, userData} = this.state;
    Pref.getVal(Pref.DIALER_DATA, userdatas => {
      const {id, tlid, pname} = userdatas[0].tc;
      // const { team_id,id } = userData;
      const body = JSON.stringify({
        teamid: tlid,
        userid: id,
        active: active,
        tname: pname,
      });
      //console.log('body', body);
      Helper.networkHelperTokenPost(
        Pref.DIALER_LEAD_RECORD,
        body,
        Pref.methodPost,
        this.state.token,
        result => {
          const {data, status} = result;
          if (status) {
            if (data.length > 0) {
              const findUsername = Lodash.find(
                data,
                io => Helper.nullStringCheck(io.username) === false,
              );
              const sorting = data.sort((a, b) => {
                const splita = a.updated_at.split(/\s/g);
                const splitb = b.updated_at.split(/\s/g);
                const sp = splita[0].split('-');
                const spz = splitb[0].split('-');
                return (
                  Number(sp[2]) - Number(spz[2]) ||
                  Number(sp[1]) - Number(spz[1]) ||
                  Number(sp[0]) - Number(spz[0])
                );
              });
              const sort = sorting.reverse();
              const {itemSize} = this.state;
              let tableHead = [];
              let widthArr = [];
              let csvHeader = '';

              if (Helper.nullCheck(findUsername) === true) {
                tableHead = [
                  'Sr. No.',
                  'Name',
                  'Number',
                  'Call Date',
                  'Duration',
                  'Product',
                  'Status',
                  'Remarks',
                  'Call Logs',
                ];
                widthArr = [60, 120, 110, 110, 70,120, 120, 140, 80];
                csvHeader = `Sr.No,Name,Number,Call Date,Duration,Status,Remarks\n`;
              } else {
                tableHead = [
                  'Sr. No.',
                  'Name',
                  'Number',
                  'Call Date',
                  'Duration',
                  'Status',
                  'Remarks',
                  'Member Name',
                  'Member Mobile',
                  'Member Refercode',
                  'Call Logs',
                ];
                widthArr = [60, 120, 110, 110, 70, 120, 140, 120, 120, 120, 80];
                csvHeader = `Sr.No,Name,Number,Call Date,Duration,Status,Remarks,Member Name,Member Mobile,Member Refercode\n`;
              }

              this.setState({
                csvHeader: csvHeader,
                findUsername: findUsername,
                widthArr: widthArr,
                tableHead: tableHead,
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
    });
  };

  editLead = item => {
    NavigationActions.navigate('DialerCalling', {
      data: item,
      editEnabled: true,
    });
  };

  logviewClick = item => {
    const {device_call_logs} = item;
    const parse = JSON.parse(device_call_logs);
    parse.map(io => {
      io.time = io.dateTime;
      if (io.duration === 0) {
        io.duration = '0';
      } else {
        if (io.duration > 60) {
          const callDur = Number(io.duration / 60).toPrecision(3);
          io.duration = callDur;
        }
      }
      return io;
    });
    this.setState({callLogData: parse, detailShow: true}, () => {
      this.filterCallHistory('Today');
    });
  };

  filterCallHistory = (filterMode = 'Today') => {
    const dateFormator = 'DD-MM-YYYY';
    const {callLogData} = this.state;

    //today
    const today = moment().format(dateFormator);
    //yesterday
    const yesterday = moment()
      .subtract(1, 'days')
      .format(dateFormator);
    //this month
    const startOfMonth = moment()
      .startOf('month')
      .format(dateFormator);

    const splitStartOfMonth = startOfMonth.split('-');

    const filter = Lodash.filter(callLogData, io => {
      const parse = moment(io.dateTime).format(dateFormator);
      const parseSplit = parse.split('-');
      if (filterMode === 'Today' && today === parse) {
        return io;
      } else if (filterMode === 'Yesterday' && yesterday === parse) {
        return io;
      } else if (
        filterMode === 'This Month' &&
        Number(splitStartOfMonth[1]) === Number(parseSplit[1]) &&
        Number(splitStartOfMonth[2]) === Number(parseSplit[2])
      ) {
        return io;
      } else if (filterMode === 'All') {
        return io;
      }
    });

    this.setState({
      threadList: filter,
      threadLoader: false,
      filterMode: filterMode,
    });
  };

  /**
   *
   * @param {*} rowData
   * @param {*} sectionID
   * @param {*} rowID
   */
  renderDetail = (rowData, sectionID, rowID) => {
    return (
      <View styleName="horizontal v-center" style={styles.mainTcontainer}>
        <View style={styles.callcircle}>
          <IconChooser
            name={
              rowData.type === 'OUTGOING' ? 'phone-outgoing' : 'phone-incoming'
            }
            size={24}
            color={rowData.type === 'OUTGOING' ? 'green' : Pref.RED}
            type={1}
            style={{alignSelf: 'center'}}
          />
        </View>
        <View styleName="vertical" style={{marginStart: 16}}>
          <Subtitle style={{fontSize: 13, color: 'grey'}}>
            {rowData.dateTime}
          </Subtitle>
          {rowData.name !== '' ? (
            <Title style={styles.timelinetitle}>{rowData.name}</Title>
          ) : null}
          <View
            styleName="horizontal space-between"
            style={{justifyContent: 'space-between'}}>
            <Title style={styles.tlphone}>{rowData.phoneNumber}</Title>
            <Subtitle
              style={{
                fontSize: 13,
                color: 'grey',
                marginStart: 16,
              }}>{`Duration: ${rowData.duration}s`}</Subtitle>
            <Subtitle
              style={{
                fontSize: 13,
                color: 'grey',
                marginEnd: 6,
                marginStart: 16,
              }}>
              {Lodash.capitalize(rowData.type)}
            </Subtitle>
          </View>
        </View>
      </View>
    );
  };

  renderFilterView = title => {
    const {filterMode} = this.state;
    return (
      <TouchableWithoutFeedback onPress={() => this.filterCallHistory(title)}>
        <View
          styleName="horizontal v-center"
          style={StyleSheet.flatten([
            styles.filterContainers,
            {
              backgroundColor: filterMode === title ? Pref.RED : '#fff',
              borderColor: filterMode === title ? Pref.RED : '#bcbaa1',
            },
          ])}>
          <Title
            style={StyleSheet.flatten([
              styles.timelinetitle,
              {
                color: filterMode === title ? 'white' : '#292929',
              },
            ])}>
            {title}
          </Title>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  /**
   *
   * @param {*} data
   */
  returnData = (sort, start = 0, end) => {
    const {findUsername} = this.state;
    const dataList = [];
    if (sort.length > 0) {
      if (start >= 0) {
        for (let i = start; i < end; i++) {
          const item = sort[i];
          if (Helper.nullCheck(item) === false) {
            const rowData = [];
            rowData.push(`${Number(i + 1)}`);
            rowData.push(item.name);
            rowData.push(item.mobile);
            rowData.push(
              item.call_date.slice(0, String(item.call_date).lastIndexOf(':')),
            );
            if (item.call_duration === null) {
              rowData.push(``);
            } else {
              rowData.push(`${item.call_duration}s`);
            }
            rowData.push(item.product);
            rowData.push(
              Number(item.tracking_type) === 0
                ? `Contactable\n${item.tracking_type_detail}`
                : `Non-Contactable\n${item.tracking_type_detail}`,
            );
            rowData.push(item.remarks);

            if (Helper.nullStringCheck(findUsername) === false) {
              if (Helper.nullCheck(item.username) === false) {
                rowData.push(item.username);
              } else {
                rowData.push('');
              }

              if (Helper.nullCheck(item.mobile) === false) {
                rowData.push(item.mobile);
              } else {
                rowData.push('');
              }

              if (Helper.nullCheck(item.refercode) === false) {
                rowData.push(item.refercode);
              } else {
                rowData.push('');
              }
            }

            const logView = value => (
              <TouchableWithoutFeedback
                onPress={() => this.logviewClick(value)}>
                <View>
                  <Title
                    style={{
                      textAlign: 'center',
                      fontWeight: '400',
                      color: '#0270e3',
                      fontSize: 15,
                    }}>
                    {`View`}
                  </Title>
                </View>
              </TouchableWithoutFeedback>
            );
            rowData.push(logView(item));

            // const editView = (value) => (
            //   <View
            //     style={{
            //       flexDirection: 'row',
            //       alignSelf: 'center',
            //       alignItems: 'center',
            //       justifyContent: 'center',
            //     }}>
            //     <TouchableWithoutFeedback
            //       onPress={() => this.editLead(value)}>
            //       <View>
            //         <IconChooser
            //           name={`edit-2`}
            //           size={20}
            //           color={`#9f9880`}
            //         />
            //       </View>
            //     </TouchableWithoutFeedback>
            //   </View>
            // );
            // if(Helper.nullCheck(item.editenable) === false && item.editenable === 0){
            //   rowData.push(editView(item));
            // }else{
            //   rowData.push('');
            // }

            dataList.push(rowData);
          }
        }
      }
    }
    return dataList;
  };

  clickedexport = () => {
    const {cloneList, userData, csvHeader} = this.state;
    if (cloneList.length > 0) {
      const data = this.returnData(cloneList, 0, cloneList.length);
      //const { refercode } = userData;
      const date = moment().format('DD_MM_YYYY');
      const name = `${date}_CallRecords`;
      const finalFilePath = `${FILEPATH}${name}.csv`;
      Helper.writeCSV(csvHeader, data, finalFilePath, result => {
        if (result) {
          RNFetchBlob.fs.scanFile([{path: finalFilePath, mime: 'text/csv'}]),
            RNFetchBlob.android.addCompleteDownload({
              title: name,
              description: 'Calls record exported successfully',
              mime: 'text/comma-separated-values',
              path: finalFilePath,
              showNotification: true,
            }),
            Helper.showToastMessage('Download Complete', 1);
        }
      });
    }
  };

  exportCallLogs = () => {
    const {callLogData} = this.state;
    if (callLogData.length > 0) {
      const parse = Lodash.map(callLogData, (io, index) => {
        if (io.duration === 0) {
          io.duration = '0';
        } else {
          const callDur = Number(io.duration / 60).toPrecision(3);
          io.duration = callDur;
        }
        io.type = Lodash.capitalize(io.type);
        delete io.rawType;
        delete io.timestamp;
        return io;
      });
      const csvHeader = 'Type, Datetime, Name,Duration,Phone Number';
      const date = moment().format('DD_MM_YYYY');
      const name = `${date}_CallLogs`;
      const finalFilePath = `${FILEPATH}${name}.csv`;
      Helper.writeCSV(csvHeader, parse, finalFilePath, result => {
        if (result) {
          RNFetchBlob.fs.scanFile([{path: finalFilePath, mime: 'text/csv'}]),
            RNFetchBlob.android.addCompleteDownload({
              title: name,
              description: 'Calls record exported successfully',
              mime: 'text/comma-separated-values',
              path: finalFilePath,
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

  onChangeSearch = query => {
    this.setState({searchQuery: query});
    const {cloneList, itemSize} = this.state;
    if (cloneList.length > 0) {
      const trimquery = String(query)
        .trim()
        .toLowerCase();
      const clone = JSON.parse(JSON.stringify(cloneList));
      const result = Lodash.filter(clone, it => {
        const {name, mobile, product} = it;
        if (Helper.nullCheck(it.username) === true) {
          return (
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
                .includes(trimquery))
          );
        } else {
          return (
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
            (it.username &&
              it.username
                .trim()
                .toLowerCase()
                .includes(trimquery)) ||
            (it.mobile &&
              it.mobile
                .trim()
                .toLowerCase()
                .includes(trimquery)) ||
            (it.refercode &&
              it.refercode
                .trim()
                .toLowerCase()
                .includes(trimquery))
          );
        }
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

  render() {
    const {searchQuery, enableSearch, detailShow} = this.state;
    return (
      <CScreen
        refresh={() => this.fetchData()}
        absolute={
          <>
            {detailShow === true ? (
              <Portal>
                <View style={{flex: 1, backgroundColor: 'white'}}>
                  <LeftHeaders
                    showBack
                    title={'Call History'}
                    backClicked={this.backClick}
                  />
                  <View style={{flex: 1}}>
                    <View
                      style={{
                        marginTop: 8,
                      }}>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}>
                        {this.renderFilterView('Today')}
                        {this.renderFilterView('Yesterday')}
                        {this.renderFilterView('This Month')}
                        {this.renderFilterView('All')}
                      </ScrollView>
                    </View>

                    {this.state.threadLoader ? (
                      <View style={styles.loader}>
                        <ActivityIndicator />
                      </View>
                    ) : this.state.threadList.length > 0 ? (
                      <Timeline
                        style={{
                          flex: 1,
                          marginHorizontal: 8,
                          marginTop: 16,
                        }}
                        data={this.state.threadList}
                        circleSize={16}
                        circleColor="#555"
                        lineColor="#ecebec"
                        timeContainerStyle={{minWidth: 24}}
                        timeStyle={{
                          textAlign: 'center',
                          backgroundColor: '#555',
                          padding: 8,
                          borderRadius: 16,
                          overflow: 'hidden',
                          color: 'white',
                          fontSize: 13,
                        }}
                        showTime={false}
                        renderDetail={this.renderDetail}
                        separator={false}
                      />
                    ) : (
                      <View style={styles.emptycont}>
                        <ListError subtitle={'No call history Found...'} />
                      </View>
                    )}
                    {this.state.exportEnabled ? (
                      <Download rightIconClick={this.exportCallLogs} />
                    ) : null}
                  </View>
                </View>
              </Portal>
            ) : null}
          </>
        }
        body={
          <>
            <LeftHeaders
              showBack
              title={'Calls Record'}
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
                <ListError subtitle={'No Calls Records Found...'} />
              </View>
            )}
            {this.state.dataList.length > 0 ? (
              <>
                <Title style={styles.itemtext}>{`Showing ${
                  this.state.itemSize
                }/${Number(this.state.cloneList.length)} entries`}</Title>
                {this.state.exportEnabled ? (
                  <Download rightIconClick={this.clickedexport} />
                ) : null}
              </>
            ) : null}
          </>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  callcircle: {
    width: 48,
    height: 48,
    backgroundColor: '#ecebec',
    borderRadius: 48,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainTcontainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: '#bcbaa1',
    borderWidth: 0.8,
    borderRadius: 10,
    marginVertical: 10,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  filterContainers: {
    backgroundColor: '#fff',
    borderColor: '#bcbaa1',
    borderWidth: 0.8,
    borderRadius: 10,
    marginStart: 16,
    paddingHorizontal: 16,
    height: 40,
  },
  timelinetitle: {
    color: '#292929',
    fontSize: 14,
    fontWeight: '700',
  },
  tlphone: {
    color: '#313131',
    fontSize: 13,
    fontWeight: '700',
  },
  timelinedesc: {
    color: '#292929',
    fontSize: 14,
    fontFamily: Pref.getFontName(1),
    flexShrink: 1,
  },
  timelineContainer: {
    flexDirection: 'row',
  },
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
