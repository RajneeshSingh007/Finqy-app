import {Title, Subtitle, View} from '@shoutem/ui';
import React from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {StyleSheet, FlatList} from 'react-native';
import * as Helper from '../../../util/Helper';
import LeftHeaders from '../../common/CommonLeftHeader';
import * as Pref from '../../../util/Pref';
import CScreen from '../../component/CScreen';
import Lodash, {result} from 'lodash';
import {sizeHeight} from '../../../util/Size';
import moment from 'moment';
import {disableOffline} from '../../../util/DialerFeature';
import {firebase} from '@react-native-firebase/firestore';
import ListError from '../../common/ListError';
import {ScrollView} from 'react-native-gesture-handler';

export default class TlLiveTracker extends React.PureComponent {
  constructor(props) {
    super(props);
    this.serverDateTime = [];
    this.livelisterner = [];
    this.date = moment().format('DDMMYYYY');
    this.state = {
      dataList: [],
      teamUserList: [],
      teamUserListClone: [],
    };
  }

  componentDidMount() {
    const {navigation} = this.props;

    this.focusListener = navigation.addListener('didFocus', () => {
      Helper.networkHelperGet(Pref.SERVER_DATE_TIME, (datetime) => {
        this.serverDateTime = serverClientDateCheck(datetime, false);
      });

      Pref.getVal(Pref.saveToken, (value) => {
        this.setState({token: value});
        this.fetchDashboard(value, '');
      });
    });
  }

  fetchDashboard = (token) => {
    Pref.getVal(Pref.DIALER_DATA, (vl) => {
      const {id} = vl[0].tl;
      const body = JSON.stringify({
        teamid: id,
      });
      Helper.networkHelperTokenPost(
        Pref.DIALER_TL_TEAMS,
        body,
        Pref.methodPost,
        token,
        (result) => {
          //console.log('result', result);
          const {data, status} = result;
          if (status) {
            const teamUserList = [];
            Lodash.map(data, (io) => {
              const {team, tl, teamdata, tname} = io;
              //console.log('io', io);
              if (teamdata.length > 0) {
                teamdata.map((iz, index) => {
                  iz.teamName = team;
                  iz.tl = tl;
                  iz.tname = tname;
                  teamUserList.push(iz);
                });
              }
            });
            this.setState(
              {
                teamUserListClone: teamUserList,
                teamUserList: teamUserList,
                dataList: [],
              },
              () => {
                this.setupLiveListerner();
              },
            );
          }
        },
        (error) => {},
      );
    });
  };

  setupLiveListerner = () => {
    disableOffline();
    const {teamUserList} = this.state;
    for (let index = 0; index < teamUserList.length; index++) {
      const element = teamUserList[index];
      this.livelisterner[index] = firebase
        .firestore()
        .collection(Pref.COLLECTION_CHECKIN)
        .doc(`${element.id}${this.date}`)
        .onSnapshot((liveSnapshot) => this.parseLiveData(liveSnapshot));
    }
  };

  /**
   * parse Live data
   * @param {} liveSnapshot
   */
  parseLiveData = (liveSnapshot) => {
    if (liveSnapshot.exists) {
      const patternRegex = new RegExp(this.date);
      const {breaktime, checkincheckout, idle} = liveSnapshot.data();
      const docpath = String(liveSnapshot.ref.path).replace(
        `${Pref.COLLECTION_CHECKIN}/`,
        '',
      );
      const userID = Number(docpath.replace(patternRegex.source, ''));
      const {teamUserList} = this.state;
      const findUserIndex = Lodash.findLastIndex(
        teamUserList,
        (io) => `${io.id}` === `${userID}`,
      );
      if (findUserIndex !== -1) {
        let trackChanges = false;
        var userData = teamUserList[findUserIndex];

        if (
          Helper.nullCheck(checkincheckout) === false &&
          checkincheckout.length > 0
        ) {
          const spl = checkincheckout[checkincheckout.length - 1].split(':');
          const dateobj = new Date();
          dateobj.setHours(Number(spl[0]));
          dateobj.setMinutes(Number(spl[1]));
          dateobj.setSeconds(Number(spl[2]));
          const formatTime = moment(dateobj).format('hh:mm a');
          userData.livedata = formatTime;
          userData.livetype =
            checkincheckout.length % 2 === 0 ? 'checkout' : 'checkin';
          trackChanges = true;
        } else {
          userData.livedata = '';
          userData.livetype = 'checkin';
        }

        // if (
        //   Helper.nullStringCheck(checkin) === false &&
        //   Helper.nullStringCheck(checkout)
        // ) {
        //   userData.type = 'Check In';
        //   const spl = checkin.split(':');
        //   const dateobj = new Date();
        //   dateobj.setHours(Number(spl[0]));
        //   dateobj.setMinutes(Number(spl[1]));
        //   dateobj.setSeconds(Number(spl[2]));
        //   const formatTime = moment(dateobj).format('hh:mm a');
        //   userData.livedata = formatTime;
        //   //checkin;
        //   trackChanges = true;
        // } else if (
        //   Helper.nullStringCheck(checkin) === false &&
        //   Helper.nullStringCheck(checkout) === false
        // ) {
        //   userData.type = 'Check Out';

        //   const spl = checkout.split(':');
        //   const dateobj = new Date();
        //   dateobj.setHours(Number(spl[0]));
        //   dateobj.setMinutes(Number(spl[1]));
        //   dateobj.setSeconds(Number(spl[2]));
        //   const formatTime = moment(dateobj).format('hh:mm a');
        //   userData.livedata = formatTime;
        //   //checkout;
        //   trackChanges = true;
        // }

        //idle time
        if (Helper.nullCheck(idle) === false && idle.length > 0) {
          if (idle.length >= 60) {
            const hrs = Number(idle.length / 60).toPrecision(3);
            userData.idle = `${hrs}Hrs`;
          } else {
            userData.idle = `${idle.length}min`;
          }
          trackChanges = true;
        } else {
          userData.idle = '';
        }

        //break
        if (Helper.nullCheck(breaktime) === false && breaktime.length > 0) {
          const spl = breaktime[breaktime.length - 1].split(':');
          const dateobj = new Date();
          dateobj.setHours(Number(spl[0]));
          dateobj.setMinutes(Number(spl[1]));
          dateobj.setSeconds(Number(spl[2]));
          const formatTime = moment(dateobj).format('hh:mm a');
          userData.break = formatTime;
          //`${breaktime[breaktime.length - 1]}`;
          userData.type = breaktime.length % 2 === 0 ? 'Resume' : 'Break';
          trackChanges = true;
        } else {
          userData.break = '';
          userData.type = '';
        }

        //update
        if (trackChanges) {
          userData.isdata = false;
          if (
            Helper.nullStringCheck(userData.livedata) &&
            Helper.nullStringCheck(userData.break) &&
            Helper.nullStringCheck(userData.idle)
          ) {
            userData.showinList = false;
          } else {
            userData.showinList = true;
          }
          const cloneObj = JSON.parse(JSON.stringify(userData));
          teamUserList[findUserIndex] = cloneObj;
          this.setState(
            {
              dataList: teamUserList.map((item) => {
                if (
                  Helper.nullStringCheck(item.livedata) &&
                  Helper.nullStringCheck(item.break) &&
                  Helper.nullStringCheck(item.idle)
                ) {
                  item.showinList = false;
                }
                return item;
              }),
            },
            () => this.forceUpdate(),
          );
        }

        //lead update
        if (Helper.nullCheck(liveSnapshot.data().lead) === false) {
          const {lead} = liveSnapshot.data();
          if (Number(lead) !== -1) {
            const userData1 = teamUserList[findUserIndex];
            const jBody = JSON.stringify({
              teamid: userData1.tl,
              userid: userData1.id,
              tname: userData1.tname,
            });

            Helper.networkHelperTokenPost(
              Pref.DIALER_LIVE_TRACK_DATA,
              jBody,
              Pref.methodPost,
              this.state.token,
              (result) => {
                const {status, data} = result;
                const cloneObj = JSON.parse(JSON.stringify(userData1));
                cloneObj.isdata = status;
                if (status && data.length > 0) {
                  const {
                    call_duration,
                    name,
                    mobile,
                    product,
                    tracking_type_detail,
                  } = data[0];

                  cloneObj.status = tracking_type_detail;
                  cloneObj.name = name;
                  cloneObj.custnumber = mobile;
                  cloneObj.product = product;
                  cloneObj.dur = `${call_duration}sec`;
                  teamUserList.push(cloneObj);
                }
                this.setState({dataList: teamUserList}, () =>
                  this.forceUpdate(),
                );
              },
              (error) => {},
            );
          }
        }
      }
    }
  };

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
    const {teamUserList} = this.state;
    for (let index = 0; index < teamUserList.length; index++) {
      if (this.livelisterner[index] !== undefined)
        this.livelisterner[index].remove();
    }
  }

  /**
   *
   * @param {*} rowData
   * @param {*} sectionID
   * @param {*} rowID
   */
  renderDetail = (rowData) => {
    if (rowData.showinList === false) {
      return null;
    }
    return (
      <View styleName="horizontal v-center" style={styles.mainTcontainer}>
        <View style={{flex: 0.17, marginStart: 4}}>
          <View style={styles.leftcircle}>
            <Title style={styles.firstWord}>
              {rowData.username !== ''
                ? Lodash.capitalize(rowData.username[0])
                : '#'}
            </Title>
          </View>
        </View>
        <View
          styleName="vertical"
          style={{flex: 0.83, flexDirection: 'column'}}>
          <View styleName="horizontal v-center">
            <Subtitle style={{fontSize: 13, color: '#555555'}}>
              {`${rowData.teamName}`}
            </Subtitle>
            <View
              style={StyleSheet.flatten([
                styles.dividercircle,
                {
                  marginHorizontal: 16,
                },
              ])}></View>
            <Subtitle style={{fontSize: 13, color: '#555555'}}>
              {rowData.mobile}
            </Subtitle>
          </View>
          <Title style={styles.timelinetitle}>{rowData.username}</Title>
          {rowData.isdata ? (
            <View>
              <View
                style={{
                  height: 1,
                  backgroundColor: '#ecebec',
                  marginVertical: 2,
                }}
              />
              <View
                styleName="horizontal v-center"
                style={{flex: 10, marginTop: 4}}>
                <View styleName="horizontal v-center " style={{flex: 6}}>
                  <Subtitle
                    style={{
                      fontSize: 14,
                      color: '#555555',
                    }}>
                    {rowData.name}
                  </Subtitle>
                </View>
                <View
                  styleName="horizontal v-center h-center"
                  style={{flex: 4}}>
                  <View
                    style={StyleSheet.flatten([styles.dividercircle])}></View>

                  <Subtitle
                    style={{
                      fontSize: 14,
                      color: '#555555',
                      marginStart: 10,
                    }}>
                    {rowData.custnumber}
                  </Subtitle>
                </View>
              </View>
              <Subtitle
                style={{
                  fontSize: 14,
                  color: '#555555',
                  paddingVertical: 4,
                  fontWeight: '700',
                }}>
                {`Status: ${rowData.status}`}
              </Subtitle>
              <View styleName="horizontal v-center" style={{flex: 12}}>
                {/* <View styleName="horizontal v-center " style={{flex: 4}}>
                  <Subtitle
                    style={{
                      fontSize: 14,
                      color: '#555555',
                    }}>
                    {rowData.status}
                  </Subtitle>
                </View> */}
                <View styleName="horizontal v-center" style={{flex: 8}}>
                  <Subtitle
                    style={{
                      fontSize: 14,
                      color: '#555555',
                    }}>
                    {`Product: ${rowData.product}`}
                  </Subtitle>
                </View>
                <View styleName="horizontal v-center" style={{flex: 4}}>
                  <View
                    style={StyleSheet.flatten([styles.dividercircle])}></View>
                  <Subtitle
                    style={{
                      fontSize: 14,
                      color: '#555555',
                      marginStart: 10,
                    }}>
                    {rowData.dur}
                  </Subtitle>
                </View>
              </View>
            </View>
          ) : (
            <View styleName="horizontal v-center" style={{flex: 12}}>
              <View styleName="horizontal v-center " style={{flex: 4}}>
                <View
                  style={StyleSheet.flatten([
                    styles.dividercircle,
                    {
                      backgroundColor:
                        rowData.livetype === 'checkin' ? '#1bd741' : Pref.RED,
                    },
                  ])}></View>
                <Subtitle
                  style={{
                    fontSize: 14,
                    color: '#555555',
                    fontWeight: '700',
                    marginStart: 10,
                  }}>
                  {rowData.livedata}
                </Subtitle>
              </View>
              <View styleName="horizontal v-center" style={{flex: 4}}>
                <>
                  <View
                    style={StyleSheet.flatten([
                      styles.dividercircle,
                      {
                        backgroundColor: '#0270e3',
                      },
                    ])}></View>

                  <Subtitle
                    style={{
                      fontSize: 14,
                      color: '#555555',
                      fontWeight: '700',
                      marginStart: 10,
                    }}>
                    {rowData.idle}
                  </Subtitle>
                </>
              </View>
              <View styleName="horizontal v-center" style={{flex: 4}}>
                <>
                  <View
                    style={StyleSheet.flatten([
                      styles.dividercircle,
                      {
                        backgroundColor:
                          rowData.type === 'Resume'
                            ? Pref.HIPPIE_BLUE
                            : Pref.CARROT_ORANGE,
                      },
                    ])}></View>
                  <Subtitle
                    style={{
                      fontSize: 14,
                      color: '#555555',
                      fontWeight: '700',
                      marginStart: 10,
                    }}>
                    {rowData.break}
                  </Subtitle>
                </>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  renderInfo = (title, color) => {
    return (
      <View
        styleName="horizontal v-center h-center"
        style={styles.topdividercolorcontainer}>
        <View
          style={StyleSheet.flatten([
            styles.dividercircle,
            {
              backgroundColor: color,
            },
          ])}></View>
        <Title
          style={{
            fontSize: 14,
            marginStart: 8,
            color: '#555555',
            fontWeight: 'bold',
          }}>
          {title}
        </Title>
      </View>
    );
  };

  render() {
    const {dataList} = this.state;
    return (
      <CScreen
        refresh={() => this.fetchDashboard(this.state.token, '')}
        bgColor={Pref.WHITE}
        body={
          <View>
            <LeftHeaders showBack title={'Live Tracking'} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              <View styleName="horizontal v-center">
                {this.renderInfo('Check-In', '#1bd741')}
                {this.renderInfo('Check-Out', Pref.RED)}
                {this.renderInfo('Idle', '#0270e3')}
                {this.renderInfo('Break', Pref.CARROT_ORANGE)}
                {this.renderInfo('Resume', Pref.HIPPIE_BLUE)}
              </View>
            </ScrollView>
            {dataList.length > 0 ? (
              <FlatList
                style={{paddingBottom: sizeHeight(24)}}
                data={dataList}
                keyExtractor={({item, index}) => `${index}`}
                renderItem={({item, index}) => this.renderDetail(item)}
                nestedScrollEnabled
                extraData={this.state}
              />
            ) : (
              <View style={styles.emptycont}></View>
            )}
          </View>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  topdividercolorcontainer: {
    paddingHorizontal: 4,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    marginHorizontal: 4,
    paddingVertical: 4,
  },
  dividercircle: {
    backgroundColor: '#ecebec',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  firstWord: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 14,
  },
  loader: {
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 1,
    marginVertical: 48,
    paddingVertical: 100,
  },
  leftcircle: {
    width: 40,
    height: 40,
    backgroundColor: Pref.RED,
    borderRadius: 40 / 2,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainTcontainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: '#bcbaa1',
    borderWidth: 0.6,
    borderRadius: 10,
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 6,
    marginHorizontal: 16,
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
    color: '#555555',
    fontSize: 14,
    fontWeight: '700',
    paddingBottom: 4,
  },
  tlphone: {
    color: '#313131',
    fontSize: 14,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginVertical: 48,
    paddingVertical: 100,
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
