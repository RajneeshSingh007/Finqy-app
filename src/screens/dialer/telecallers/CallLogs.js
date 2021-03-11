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
import {ActivityIndicator} from 'react-native-paper';
import {sizeHeight} from '../../../util/Size';
import Lodash from 'lodash';
import LeftHeaders from '../../common/CommonLeftHeader';
import ListError from '../../common/ListError';
import RNFetchBlob from 'rn-fetch-blob';
import IconChooser from '../../common/IconChooser';
import CScreen from './../../component/CScreen';
import moment from 'moment';
import Download from '../../component/Download';
import Timeline from 'react-native-timeline-flatlist';

let FILEPATH = `${RNFetchBlob.fs.dirs.DownloadDir}/`;
const ITEM_LIMIT = 10;

export default class CallLogs extends React.PureComponent {
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
      filterMode: 'All',
      callLogData: [],
      userref: '',
      findUsername: null,
      exportEnabled: true,
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({loading: true, dataList: []});
    });
    //this.focusListener = navigation.addListener('didFocus', () => {
    Pref.getVal(Pref.userData, userData => {
      this.setState({
        userData: userData,
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
    //});
  }

  componentWillUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  fetchData = () => {
    this.setState({threadLoader: true});
    Pref.getVal(Pref.DIALER_DATA, userdatas => {
      const {id, tlid, pname} = userdatas[0].tc;
      const body = JSON.stringify({
        teamid: tlid,
        userid: id,
        tname: pname,
      });
      Helper.networkHelperTokenPost(
        Pref.DIALER_TC_CallLogs,
        body,
        Pref.methodPost,
        this.state.token,
        result => {
          const {data, status} = result;
          if (status === true) {
            const callLogData = Lodash.map(data, io => {
              io.time = io.dateTime;
              if (io.duration === 0) {
                io.duration = '0';
              } else {
                const callDur = Number(io.duration / 60).toPrecision(3);
                io.duration = `${callDur}`;
              }
              return io;
            });
            this.setState(
              {
                cloneList: callLogData,
                threadList: data,
                threadLoader: false,
              },
              () => {
                this.filterCallHistory('All');
              },
            );
          } else {
            this.setState({threadLoader: false});
          }
        },
        e => {
          this.setState({threadLoader: false});
        },
      );
    });
  };

  filterCallHistory = (filterMode = 'All') => {
    const dateFormator = 'DD-MM-YYYY';
    const {cloneList} = this.state;
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

    const filter = Lodash.filter(cloneList, io => {
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
  renderDetail = rowData => {
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

  exportCallLogs = () => {
    const {callLogData} = this.state;
    if (callLogData.length > 0) {
      const parse = Lodash.map(callLogData, io => {
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

  render() {
    return (
      <CScreen
        refresh={() => this.fetchData()}
        body={
          <>
            <LeftHeaders
              showBack
              title={'Call Logs'}
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

            <View style={{flex: 1}}>
              <View
                style={{
                  marginTop: 8,
                }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                    flex:1,
                    marginHorizontal: 8,
                    marginTop: 16,
                  }}
                  data={this.state.threadList}
                  circleSize={16}
                  circleColor="#555"
                  lineColor="#ecebec"
                  showTime={false}
                  renderDetail={this.renderDetail}
                  separator={false}
                />
              ) : (
                <View style={styles.emptycont}>
                  <ListError subtitle={'No call logs Found...'} />
                </View>
              )}
              {/* {this.state.exportEnabled ? (
                <Download rightIconClick={this.exportCallLogs} />
              ) : null} */}
            </View>
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
