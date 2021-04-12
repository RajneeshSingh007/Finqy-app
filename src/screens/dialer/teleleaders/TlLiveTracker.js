import {Title, Subtitle, View} from '@shoutem/ui';
import React from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {StyleSheet, FlatList} from 'react-native';
import * as Helper from '../../../util/Helper';
import LeftHeaders from '../../common/CommonLeftHeader';
import * as Pref from '../../../util/Pref';
import CScreen from '../../component/CScreen';
import Lodash, { result } from 'lodash';
import {sizeHeight} from '../../../util/Size';
import moment from 'moment';
import {disableOffline} from '../../../util/DialerFeature';
import {firebase} from '@react-native-firebase/firestore';
import ListError from '../../common/ListError';

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
          //console.log('result', result);
          const {data, status} = result;
          if (status) {
            const teamUserList = [];
            Lodash.map(data, (io) => {
              const {team,tl, teamdata} = io;
              //console.log('io', io);
              if (teamdata.length > 0) {
                teamdata.map((iz, index) => {
                  iz.teamName = team;
                  iz.tl = tl;
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
          const spl = checkin.split(':');
          const dateobj = new Date();
          dateobj.setHours(Number(spl[0]));
          dateobj.setMinutes(Number(spl[1]));
          dateobj.setSeconds(Number(spl[2]));
          const formatTime = moment(dateobj).format('hh:mm a');
          userData.livedata = formatTime;
          //checkin;
          trackChanges = true;
        } else if (
          Helper.nullStringCheck(checkin) === false &&
          Helper.nullStringCheck(checkout) === false
        ) {
          userData.type = 'Check Out';

          const spl = checkout.split(':');
          const dateobj = new Date();
          dateobj.setHours(Number(spl[0]));
          dateobj.setMinutes(Number(spl[1]));
          dateobj.setSeconds(Number(spl[2]));
          const formatTime = moment(dateobj).format('hh:mm a');
          userData.livedata = formatTime;
          //checkout;
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
          userData.isdata = false;
          teamUserList[findUserIndex] = userData;

          const startDate = moment().subtract(15, 'minute').format('DD-MM-YYYY HH:mm');
          const endDate = moment().add(15, 'minute').format('DD-MM-YYYY HH:mm');

          const jBody = JSON.stringify({teamid:userData.tl,userid:userData.id,date:`${startDate}:00`,tname:userData.teamName,endate:`${endDate}:00`});

          //console.log('jBody', jBody);

          Helper.networkHelperTokenPost(Pref.DIALER_LIVE_TRACK_DATA,jBody, Pref.methodPost,this.state.token, result =>{
            const {status, data} = result;

            const cloneObj = JSON.parse(JSON.stringify(userData));
            cloneObj.isdata = status;
            
            if(status && data.length > 0){
              const {call_duration,name, mobile,product, tracking_type_detail} = data[0];  
              
              cloneObj.status = tracking_type_detail;
              cloneObj.name = name;
              cloneObj.custnumber = mobile;
              cloneObj.product = product;
              cloneObj.dur = `${call_duration}sec`;

              teamUserList.push(cloneObj);
            }

            //console.log('teamUserList', teamUserList);

            this.setState({dataList: teamUserList}, () => this.forceUpdate()); 

          }, error =>{
            this.setState({dataList: teamUserList}, () => this.forceUpdate()); 
          })

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
              <View style={{height:1,backgroundColor:'#ecebec', marginVertical:2}} />
              <View styleName="horizontal v-center" style={{flex: 10, marginTop:4}}>
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
              <View styleName="horizontal v-center" style={{flex: 12}}>
                <View styleName="horizontal v-center " style={{flex: 4}}>
                  <Subtitle
                    style={{
                      fontSize: 14,
                      color: '#555555',
                    }}>
                    {rowData.status}
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
                    {rowData.product}
                  </Subtitle>
                </View>
                <View
                  styleName="horizontal v-center  h-center"
                  style={{flex: 4}}>
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
                        rowData.type === 'Check In' ? '#1bd741' : Pref.RED,
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
              <View styleName="horizontal v-center h-center" style={{flex: 4}}>
                {Helper.nullStringCheck(rowData.idle) === false ? (
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
                ) : null}
              </View>
              <View styleName="horizontal v-center  h-center" style={{flex: 4}}>
                {Helper.nullStringCheck(rowData.break) === false ? (
                  <>
                    <View
                      style={StyleSheet.flatten([
                        styles.dividercircle,
                        {
                          backgroundColor: Pref.CARROT_ORANGE,
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
                ) : null}
              </View>
            </View>
          )}
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
              <View style={styles.emptycont}>
                <ListError subtitle={'Loading...'} />
              </View>
            )}
          </View>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
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
