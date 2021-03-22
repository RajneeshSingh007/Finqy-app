import React from 'react';
import {StyleSheet, BackHandler, TouchableWithoutFeedback} from 'react-native';
import {Title, View, Subtitle} from '@shoutem/ui';
import * as Helper from '../../../util/Helper';
import * as Pref from '../../../util/Pref';
import {ActivityIndicator, List, FAB, Button, Portal} from 'react-native-paper';
import {sizeHeight, sizeWidth} from '../../../util/Size';
import LeftHeaders from '../../common/CommonLeftHeader';
import ListError from '../../common/ListError';
import CommonTable from '../../common/CommonTable';
import CScreen from './../../component/CScreen';
import NavigationActions from '../../../util/NavigationActions';
import moment from 'moment';
import DateRangePicker from 'react-native-daterange-picker';
import Modal from '../../../util/Modal';
import AnimatedWithoutInputBox from '../../component/AnimatedWithoutInputBox';
import Download from '../../component/Download';
import RNFetchBlob from 'rn-fetch-blob';
import IconChooser from '../../common/IconChooser';

let DATE_FORMAT = 'DD-MM-YYYY';
let FILEPATH = `${RNFetchBlob.fs.dirs.DownloadDir}/`;

export default class MemberReport extends React.PureComponent {
  constructor(props) {
    super(props);
    this.export = this.export.bind(this);
    this.backClick = this.backClick.bind(this);
    this.filterItemClick = this.filterItemClick.bind(this);
    this.state = {
      dataList: [],
      loading: false,
      token: '',
      userData: '',
      cloneList: [],
      type: '',
      dialerUserData: false,
      filterModal: false,
      plDates: '',
      efDates: '',
      dateFilter: -1,
      startDate: null,
      endDate: null,
      displayedDate: moment(),
    };
  }

  componentDidMount() {
    //BackHandler.addEventListener('hardwareBackPress', this.backClick);
    const {navigation} = this.props;
    const dialerUserData = navigation.getParam('data', []);
    const tlID = navigation.getParam('tlID', null);
    const currentId = navigation.getParam('currentId', null);
    const tname = navigation.getParam('tname', null);
    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({loading: true, dataList: []});
    });
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.userData, (userData) => {
        const pastStartDate = moment().format(DATE_FORMAT);
        const pastEndDate = moment().subtract(7, 'd').format(DATE_FORMAT);
        const efStartDate = moment().format(DATE_FORMAT);
        const efEndDate = moment()
          ///.subtract(1, 'M')
          .format(DATE_FORMAT);
        const plStartDate = moment().format(DATE_FORMAT);
        const plEndDate = moment()
          //.subtract(1, 'M')
          .format(DATE_FORMAT);

        this.setState({
          tname: tname,
          currentId: currentId,
          tlID: tlID,
          userData: userData,
          dialerUserData: dialerUserData,
          pastStartDate: pastStartDate,
          pastEndDate: pastEndDate,
          efStartDate: efStartDate,
          efEndDate: efEndDate,
          plStartDate: plStartDate,
          plEndDate: plEndDate,
        });
        Pref.getVal(Pref.USERTYPE, (v) => {
          this.setState({type: v}, () => {
            Pref.getVal(Pref.saveToken, (value) => {
              this.setState({token: value}, () => {
                this.fetchData();
              });
            });
          });
        });
      });
    });
  }

  componentWillUnMount() {
    //BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  backClick = () => {
    NavigationActions.navigate('AllMembers', {reportenabled: true});
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    return true;
  };

  fetchData = () => {
    const {
      pastStartDate,
      pastEndDate,
      efStartDate,
      efEndDate,
      plStartDate,
      plEndDate,
      userData,
      dialerUserData,
      tlID,
      currentId,
      tname,
    } = this.state;
    this.setState({loading: true});
    //const {id} = userData;
    const userid = dialerUserData[dialerUserData.length - 1];
    const members = dialerUserData[0];
    const todaysDate = moment().format(DATE_FORMAT);
    const body = JSON.stringify({
      tname: tname,
      currentuser: currentId,
      members: members,
      teamid: tlID,
      userid: userid,
      flag: 1,
      todaydate: todaysDate,
      enddate: pastStartDate,
      startdate: pastEndDate,
      efstartdate: efStartDate,
      efendDate: efEndDate,
      plstartDate: plStartDate,
      plendDate: plEndDate,
    });
    //console.log('body', body);
    Helper.networkHelperTokenPost(
      Pref.DIALER_GET_MEMBERS,
      body,
      Pref.methodPost,
      this.state.token,
      (result) => {
        //console.log('result', result);
        const {data, status} = result;
        if (status) {
          if (data.length > 0) {
            this.setState({
              cloneList: data,
              dataList: data,
              loading: false,
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
      (e) => {
        this.setState({loading: false});
      },
    );
  };

  dateFilterSubmit = () => {
    const {endDate, startDate, dateFilter} = this.state;
    if (startDate != null) {
      const parse = moment(startDate).format(DATE_FORMAT);
      let endparse = null;
      if (endDate != null) {
        endparse = moment(endDate).format(DATE_FORMAT);
      } else {
        endparse = parse;
      }

      let plDates = '',
        efDates = '',
        efStartDate = '',
        efEndDate = '',
        plStartDate = '',
        plEndDate = '';
      if (dateFilter === 1) {
        plDates = `${endparse != null ? `${parse} - ${endparse}` : parse}`;
        plStartDate = parse;
        plEndDate = endparse === null ? parse : endparse;

        this.setState({
          dateFilter: -1,
          endDate: null,
          startDate: null,
          plDates: plDates,
          filterModal: true,
          plStartDate: plStartDate,
          plEndDate: plEndDate,
        });
      } else if (dateFilter === 2) {
        efDates = `${endparse != null ? `${parse} - ${endparse}` : parse}`;
        efStartDate = parse;
        efEndDate = endparse === null ? parse : endparse;

        this.setState({
          dateFilter: -1,
          endDate: null,
          startDate: null,
          efDates: efDates,
          filterModal: true,
          efStartDate: efStartDate,
          efEndDate: efEndDate,
        });
      }
    } else {
      this.setState({
        dateFilter: -1,
        endDate: null,
        startDate: null,
        filterModal: true,
      });
    }
  };

  /**
   *
   * @param {*} count
   * @param {*} title
   * @param {*} icon
   * @param {*} iconClick
   */
  renderCircleItem = (count = 0, title = '') => {
    return (
      <View
        styleName="md-gutter vertical  v-center h-center"
        style={styles.leadcircle}>
        <Title
          style={StyleSheet.flatten([
            styles.passText,
            {
              fontSize: 24,
              color: '#0270e3',
            },
          ])}>{`${count}`}</Title>
        <Title
          style={StyleSheet.flatten([
            styles.passText,
            {
              fontSize: 17,
              color: '#6e6e6e',
            },
          ])}>{`${title}`}</Title>
      </View>
    );
  };

  callLogClicked = () => {
    const {currentId, tlID, tname} = this.state;
    const finalDataProcess = {
      id: currentId,
      tlid: tlID,
      tname: tname,
      exportEnabled: true,
    };
    NavigationActions.navigate('CallLogs', finalDataProcess);
  };

  userView = (dialerUserData) => {
    return (
      <View
        styleName="sm-gutter vertical"
        style={StyleSheet.flatten([
          styles.accordStyle,
          {
            paddingVertical: 8,
          },
        ])}>
        <Title
          styleName="v-start h-start"
          numberOfLines={1}
          style={StyleSheet.flatten([
            styles.usertopText,
            {
              color: '#292929',
              paddingVertical: 0,
              fontSize: 15,
            },
          ])}>
          {`Name: ${dialerUserData[1]}`}
        </Title>
        <Title
          styleName="v-start h-start"
          numberOfLines={1}
          style={StyleSheet.flatten([
            styles.usertopText,
            {
              fontSize: 14,
              color: '#555555',
            },
          ])}>
          {`Mobile: ${dialerUserData[2]}`}
        </Title>
        <View styleName="horizontal v-start h-start">
          <Title
            style={StyleSheet.flatten([
              styles.usertopText,
              {
                paddingVertical: 0,
                fontSize: 13,
                color: '#353535',
                fontWeight: '400',
                marginTop: 0,
                marginBottom: 0,
                paddingBottom: 0,
              },
            ])}>
            {`Email: ${dialerUserData[3]}`}
          </Title>
          <View style={styles.divider} />
          <Title
            style={StyleSheet.flatten([
              styles.usertopText,
              {
                paddingVertical: 0,
                fontSize: 13,
                color: '#353535',
                fontWeight: '400',
                marginTop: 0,
                marginBottom: 0,
                paddingBottom: 0,
              },
            ])}>
            {`Ref: ${dialerUserData[dialerUserData.length - 2]}`}
          </Title>
        </View>
        <View styleName="horizontal v-start h-start" style={{marginTop: 4}}>
          <TouchableWithoutFeedback onPress={this.callLogClicked}>
            <View
              styleName="horizontal v-start h-center"
              style={{marginTop: 8, paddingVertical: 4}}>
              <IconChooser name={'phone-outgoing'} size={24} color={'green'} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  };

  export = (data, head, title) => {
    const date = moment().format('DD_MM_YYYY');
    let headers = '';
    for (let z = 0; z < head.length; z++) {
      if (z === Number(head.length - 1)) {
        headers += `${head[z]}\n`;
      } else {
        headers += `${head[z]},`;
      }
    }
    const replace = title.replace(/\s/g, '_');
    const name = `${date}_${replace}`;
    const finalFilePath = `${FILEPATH}${name}.csv`;
    Helper.writeCSV(headers, data, finalFilePath, (result) => {
      if (result) {
        RNFetchBlob.fs.scanFile([{path: finalFilePath, mime: 'text/csv'}]),
          RNFetchBlob.android.addCompleteDownload({
            title: name,
            description: 'Record exported successfully',
            mime: 'text/comma-separated-values',
            path: finalFilePath,
            showNotification: true,
          }),
          Helper.showToastMessage('Download Complete', 1);
      }
    });
  };

  /**
   * report accordation view
   * @param {} data
   * @param {*} width
   * @param {*} head
   * @param {*} title
   */
  accordationView = (data = [], width = [], head = [], title = '') => {
    return (
      <List.Accordion
        title={title}
        style={styles.accordStyle}
        titleStyle={styles.accordTitle}>
        <View>
          <CommonTable
            enableHeight={false}
            dataList={data}
            widthArr={width}
            tableHead={head}
          />

          <Download rightIconClick={() => this.export(data, head, title)} />
        </View>
      </List.Accordion>
    );
  };

  setDates = (dates) => {
    this.setState({
      ...dates,
    });
  };

  filterItemClick = () => {
    this.setState({filterModal: false, datefilter: -1, loading: true});
    this.fetchData();
  };

  render() {
    const {
      dataList,
      dialerUserData,
      dateFilter,
      startDate,
      endDate,
      displayedDate,
    } = this.state;
    const data = dataList[0];
    return (
      <CScreen
        refresh={() => this.fetchData()}
        absolute={
          <>
            {this.state.loading === false && dataList.length > 0 ? (
              <FAB
                style={styles.fab}
                icon={'filter'}
                onPress={() => this.setState({filterModal: true})}
              />
            ) : null}

            <Modal
              visible={this.state.filterModal}
              setModalVisible={() =>
                this.setState({
                  filterModal: false,
                })
              }
              ratioHeight={0.5}
              backgroundColor={`white`}
              topCenterElement={
                <Subtitle
                  style={{
                    color: '#292929',
                    fontSize: 17,
                    fontWeight: '700',
                    letterSpacing: 0.5,
                  }}>
                  {`Filter Reports`}
                </Subtitle>
              }
              topRightElement={null}
              children={
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'white',
                  }}>
                  <AnimatedWithoutInputBox
                    onChangeText={() =>
                      this.setState({dateFilter: 1, filterModal: false})
                    }
                    value={this.state.plDates}
                    placeholder={'Performance Date'}
                    returnKeyType={'next'}
                    changecolor
                    containerstyle={styles.animatedInputCont}
                  />

                  <AnimatedWithoutInputBox
                    onChangeText={() =>
                      this.setState({dateFilter: 2, filterModal: false})
                    }
                    value={this.state.efDates}
                    placeholder={'Efficiency Date'}
                    returnKeyType={'next'}
                    changecolor
                    containerstyle={styles.animatedInputCont}
                  />

                  <Button
                    mode={'flat'}
                    uppercase={false}
                    dark={true}
                    loading={false}
                    style={styles.loginButtonStyle}
                    onPress={this.filterItemClick}>
                    <Title style={styles.btntext}>{`Submit`}</Title>
                  </Button>
                </View>
              }
            />
            <Portal>
              {dateFilter !== -1 ? (
                <DateRangePicker
                  onChange={this.setDates}
                  endDate={endDate}
                  startDate={startDate}
                  displayedDate={displayedDate}
                  range
                  //presetButtons
                  //buttonStyle={styles.submitbuttonpicker}
                  buttonTextStyle={{
                    fontSize: 15,
                    fontWeight: '700',
                    color: 'white',
                  }}
                  submitClicked={this.dateFilterSubmit}
                  closeCallback={() =>
                    this.setState({
                      startDate: null,
                      endDate: null,
                      datefilter: -1,
                    })
                  }
                />
              ) : null}
            </Portal>
          </>
        }
        body={
          <>
            <LeftHeaders
              showBack
              title={'Performance Report'}
              //backClicked={() => this.backClick()}
              bottomBody={<></>}
            />

            <View styleName="horizontal sm-gutter v-center h-center">
              {this.renderCircleItem(
                data && data.today && data.today.data.length > 0
                  ? data.today.data.length
                  : 0,
                'Total Today Call',
              )}

              {this.renderCircleItem(
                data && data.past && data.past.data.length > 0
                  ? data.past.data.length
                  : 0,
                'Last 7 Days Call',
              )}
            </View>

            {dialerUserData.length > 0 ? this.userView(dialerUserData) : null}

            {this.state.loading ? (
              <View style={styles.loader}>
                <ActivityIndicator />
              </View>
            ) : this.state.dataList.length > 0 ? (
              <View>
                {/* <View style={styles.newItemContainer}>
                  <Title
                    style={StyleSheet.flatten([
                      styles.accordTitle,
                      {
                        fontSize: 17,
                        marginStart: 4,
                        color: Pref.CARROT_ORANGE,
                        paddingVertical: 0,
                        marginVertical: 0,
                      },
                    ])}>
                    {`Report`}
                  </Title>
                </View> */}

                {data.today && data.today.data.length > 0
                  ? this.accordationView(
                      data.today.data,
                      data.today.width,
                      data.today.head,
                      'Today',
                    )
                  : null}

                {data.past && data.past.data.length > 0
                  ? this.accordationView(
                      data.past.data,
                      data.past.width,
                      data.past.head,
                      'Last 7 Days',
                    )
                  : null}

                <List.Section
                  title={'Extract Report'}
                  titleStyle={styles.itemtopText}>
                  {data.hourreport && data.hourreport.data.length > 0
                    ? this.accordationView(
                        data.hourreport.data,
                        data.hourreport.width,
                        data.hourreport.head,
                        'Hour Report',
                      )
                    : null}

                  {data.plreport && data.plreport.data.length > 0
                    ? this.accordationView(
                        data.plreport.data,
                        data.plreport.width,
                        data.plreport.head,
                        'Performance Report',
                      )
                    : null}

                  {data.efreport && data.efreport.data.length > 0
                    ? this.accordationView(
                        data.efreport.data,
                        data.efreport.width,
                        data.efreport.head,
                        'Efficiency Report',
                      )
                    : null}
                </List.Section>
              </View>
            ) : (
              <View style={styles.emptycont}>
                <ListError subtitle={'No data Found...'} />
              </View>
            )}
          </>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  accordTitle: {
    fontFamily: Pref.getFontName(3),
    fontSize: 14,
    letterSpacing: 0.5,
    color: '#292929',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: 'white',
    marginStart: sizeWidth(3),
    alignSelf: 'center',
    marginStart: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
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
  usertopText: {
    letterSpacing: 0.5,
    fontWeight: '700',
    lineHeight: 16,
    color: '#0270e3',
    fontSize: 15,
    marginTop: 4,
    flexShrink: 1,
    marginStart: 4,
    marginEnd: 4,
    marginBottom: 4,
    paddingVertical: 6,
  },
  itemtopText: {
    letterSpacing: 0.5,
    fontWeight: '700',
    lineHeight: 20,
    justifyContent: 'center',
    color: '#0270e3',
    fontSize: 15,
  },
  divider: {
    backgroundColor: '#dedede',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
    alignSelf: 'center',
  },
  itemContainer: {
    marginVertical: 12,
    borderColor: '#bcbaa1',
    borderWidth: 0.8,
    borderRadius: 12,
    marginHorizontal: 12,
    paddingVertical: 8,
  },
  newItemContainer: {
    marginVertical: 8,
    marginHorizontal: 12,
  },
  emptycont: {
    flex: 1,
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
  subtitle: {
    fontSize: 14,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'center',
    fontWeight: '400',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'flex-start',
    fontWeight: '700',
  },
  passText: {
    letterSpacing: 0.5,
    color: Pref.RED,
    fontWeight: '700',
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  gap: {
    marginHorizontal: 8,
  },
  image: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 8,
    width: '90%',
    height: 156,
    resizeMode: 'contain',
  },
  footerCon: {
    paddingBottom: 12,
    paddingHorizontal: 12,
    paddingTop: 4,
  },
  icon: {
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  leadcircle: {
    borderColor: '#dbd9cc',
    width: sizeWidth(35),
    height: sizeWidth(35),
    borderRadius: sizeWidth(35) / 2.0,
    borderWidth: 1.5,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    marginVertical: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Pref.RED,
  },
  animatedInputCont: {
    marginStart: 16,
    marginEnd: 16,
    paddingVertical: 10,
    marginVertical: 8,
  },
  loginButtonStyle: {
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    color: 'white',
    backgroundColor: Pref.RED,
    textAlign: 'center',
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 0.5,
    borderRadius: 24,
    width: '42%',
    paddingVertical: 4,
    fontWeight: '700',
    marginTop: 16,
  },
  btntext: {
    color: 'white',
    fontSize: 16,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  accordStyle: {
    backgroundColor: '#fff',
    borderColor: '#bcbaa1',
    borderWidth: 0.8,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 16,
  },
  accordTitle: {
    color: '#292929',
    fontSize: 15,
    fontWeight: '700',
  },
});
