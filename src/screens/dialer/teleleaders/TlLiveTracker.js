import {Title, Subtitle, View} from '@shoutem/ui';
import React from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {StyleSheet, FlatList} from 'react-native';
import * as Helper from '../../../util/Helper';
import LeftHeaders from '../../common/CommonLeftHeader';
import * as Pref from '../../../util/Pref';
import CScreen from '../../component/CScreen';
import Lodash from 'lodash';
import {sizeHeight} from '../../../util/Size';
import moment from 'moment';
import {disableOffline} from '../../../util/DialerFeature';
import {firebase} from '@react-native-firebase/firestore';
import {Pattern} from 'react-native-svg';

export default class TlLiveTracker extends React.PureComponent {
  constructor(props) {
    super(props);
    this.livelisterner = [];
    this.date = moment().format('DDMMYYYY');
    this.state = {
      dataList: [],
      teamUserList: [],
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
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
          console.log('result', result);
          const {data, status} = result;
          if (status) {
            const teamUserList = [];
            Lodash.map(data, (io) => {
              const {team, teamdata} = io;
              //console.log('io', io);
              if (teamdata.length > 0) {
                teamdata.map((iz, index) => {
                  iz.teamName = team;
                  teamUserList.push(iz);
                });
              }
            });
            this.setState({teamUserList: teamUserList, dataList: []}, () => {
              this.setupLiveListerner();
            });
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
      const {breaktime, checkin, checkout, idle} = liveSnapshot.data();
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
        const userData = teamUserList[findUserIndex];
        if (
          Helper.nullStringCheck(checkin) === false &&
          Helper.nullStringCheck(checkout)
        ) {
          userData.type = 'Check In';
          userData.livedata = checkin;
          trackChanges = true;
        } else if (
          Helper.nullStringCheck(checkin) === false &&
          Helper.nullStringCheck(checkout) === false
        ) {
          userData.type = 'Check Out';
          userData.livedata = checkout;
          trackChanges = true;
        }
        if (Helper.nullCheck(idle) === false && idle.length > 0) {
          if (idle.length >= 60) {
            const hrs = Number(idle.length / 60).toPrecision(3);
            userData.idle = `${hrs}Hrs`;
          } else {
            userData.idle = `${idle.length}min`;
          }
          trackChanges = true;
        }
        if (Helper.nullCheck(breaktime) === false && breaktime.length > 0) {
          userData.break = `${breaktime[breaktime.length - 1]}`;
          userData.isBreak = breaktime.length % 2 === 0 ? 'Resume' : 'Break';
          trackChanges = true;
        } else {
          userData.isBreak = 'Break';
        }
        if (trackChanges) {
          teamUserList[findUserIndex] = userData;
          console.log(teamUserList);
          this.setState({dataList: teamUserList}, () => this.forceUpdate());
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
    console.log(rowData.type);
    return (
      <View styleName="horizontal v-center" style={styles.mainTcontainer}>
        <View style={{flex: 0.18}}>
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
          style={{flex: 0.82, flexDirection: 'column'}}>
          <Subtitle style={{fontSize: 13, color: '#292929'}}>
            {`${rowData.teamName}`}
          </Subtitle>
          <Title style={styles.timelinetitle}>{rowData.username}</Title>
          <View styleName="horizontal" style={{flex: 1, flexDirection: 'row'}}>
            <View
              style={{
                flex: 0.4,
              }}>
              <Title style={styles.tlphone}>{rowData.mobile}</Title>
            </View>
            <View
              style={{
                flex: 0.3,
              }}>
              <Subtitle
                style={{
                  fontSize: 14,
                  color:
                    rowData.type === 'Idle'
                      ? '#0270e3'
                      : rowData.type === 'Check In'
                      ? 'green'
                      : Pref.RED,
                  alignSelf: 'center',
                  fontWeight: '700',
                }}>
                {rowData.type}
              </Subtitle>
            </View>
            <View
              style={{
                flex: 0.3,
              }}>
              <Subtitle
                style={{
                  fontSize: 14,
                  color: '#292929',
                  alignSelf: 'center',
                  fontWeight: '700',
                }}>
                {rowData.livedata}
              </Subtitle>
            </View>
          </View>
          <View
            styleName="horizontal"
            style={{flex: 1, marginTop: 4, flexDirection: 'row'}}>
            {rowData.idle !== '' ? (
              <View
                style={{
                  flex: 0.5,
                }}>
                <Subtitle
                  style={{
                    fontSize: 14,
                    color: '#0270e3',
                    fontWeight: '700',
                  }}>
                  {'Idle    '}
                  <Subtitle
                    style={{
                      fontSize: 14,
                      color: '#292929',
                      fontWeight: '700',
                    }}>
                    {rowData.idle}
                  </Subtitle>
                </Subtitle>
              </View>
            ) : null}
            <View
              style={{
                flex: 0.5,
              }}>
              <Subtitle
                style={{
                  fontSize: 14,
                  color: Pref.CARROT_ORANGE,
                  fontWeight: '700',
                }}>
                {`${rowData.isBreak}    `}
                <Subtitle
                  style={{
                    fontSize: 14,
                    color: '#292929',
                    fontWeight: '700',
                  }}>
                  {rowData.break}
                </Subtitle>
              </Subtitle>
            </View>
          </View>
        </View>
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

            {dataList.length > 0 ? (
              <FlatList
                data={dataList}
                keyExtractor={({item, index}) => `${index}`}
                renderItem={({item, index}) => this.renderDetail(item)}
                nestedScrollEnabled
                extraData={this.state}
              />
            ) : (
              <View style={styles.loader}>
                <ActivityIndicator color={Pref.RED} />
              </View>
            )}
          </View>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
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
    width: 42,
    height: 42,
    backgroundColor: Pref.RED,
    borderRadius: 42 / 2,
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
    color: '#292929',
    fontSize: 15,
    fontWeight: '700',
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
