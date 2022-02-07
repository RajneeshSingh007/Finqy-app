import {Title, View} from '@shoutem/ui';
import React from 'react';
import {StyleSheet, ActivityIndicator, Platform} from 'react-native';
import * as Helper from '../../../util/Helper';
import {sizeWidth} from '../../../util/Size';
import LeftHeaders from '../../common/CommonLeftHeader';
import * as Pref from '../../../util/Pref';
import CScreen from '../../component/CScreen';
import Purechart from 'react-native-pure-chart';
import {Card} from 'react-native-paper';
import { disableOffline } from '../../../util/DialerFeature';
import {firebase} from '@react-native-firebase/firestore';

export default class TcPerformance extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      totalIdleTime:0,
      dashboardData: null,
      barData: [
        {x: 'Interested', y: 0, color: '#87c1fc'},
        {x: 'Not-Interested', y: 0, color: '#fe8c8c'},
        {x: 'Incorrect Number', y: 0, color: '#ffe251'},
        {x: 'Avg. Talktime', y: 0, color: '#77e450'},
        {x: 'Idle Time', y: 0, color: '#fd8e'},
      ],
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.saveToken, (value) => {
        this.setState({token: value});
        this.firebasereport();
      });
    });
  }

  fetchDashboard = () => {
    Pref.getVal(Pref.DIALER_DATA, (vl) => {
      const {id, tlid, pname} = vl[0].tc;
      const body = JSON.stringify({
        teamid: tlid,
        userid: id,
        tname: pname,
      });
      //console.log('body', body)
      Helper.networkHelperTokenPost(
        Pref.DIALER_TC_PERFORMANCE,
        body,
        Pref.methodPost,
        this.state.token,
        (result) => {
          //console.log(result);
          const {barData} = this.state;
          let {data, status} = result;
          if (status) {            
            barData[0].y = Number(data.inter);
            barData[1].y = Number(data.ntinter);
            barData[2].y = Number(data.wrong);
            barData[3].y = Number(data.totalSecond);
            barData[4].y = this.state.totalIdleTime;
            this.setState({dashboardData: data, barData: barData});
          }
        },
        () => {
          //console.log(error);
        },
      );
    });
  };

  firebasereport = () =>{
    let totalIdleTime = 0;
    disableOffline();
    Pref.getVal(Pref.DIALER_DATA, (vl) => {
      console.log('vl[0].tc', vl[0].tc);
      const {id, tlid, pname} = vl[0].tc;
      firebase.firestore()
      .collection(Pref.COLLECTION_CHECKIN)
      .get()
      .then(snapshot =>{
        snapshot.forEach(item =>{
          if(item.exists){
            const docpath = String(item.ref.path).replace(
              `${Pref.COLLECTION_CHECKIN}/`,
              '',
            );
            const patternRegex = new RegExp(docpath.slice(-8));
            const userID = Number(docpath.replace(patternRegex.source, ''));
            if(Number(userID) === Number(id)){
              const {idle} = item.data();
              if (Helper.nullCheck(idle) === false && idle.length > 0) {
                totalIdleTime = idle.length;
              }
            }
          }
        });
        this.setState({totalIdleTime:totalIdleTime});
        this.fetchDashboard();
      }).catch(e =>{
        console.log('e', e);
      })

    });
  }

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  /**
   *
   * @param {*} count
   * @param {*} title
   * @param {*} icon
   * @param {*} iconClick
   */
  renderCircleItem = (
    count = 0,
    title = '',
    icon = 'bell',
    iconClick = () => {},
    type = 1,
  ) => {
    return (
      <View styleName="horizontal space-between" style={{marginBottom: 6}}>
        <Title
          style={StyleSheet.flatten([
            styles.passText,
            {
              fontSize: 16,
            },
          ])}>{`${title}`}</Title>
        <Title
          style={StyleSheet.flatten([
            styles.passText,
            {
              fontSize: 16,
              color: '#0270e3',
              marginBottom: 10,
            },
          ])}>{`${count}`}</Title>
      </View>
    );
  };

  render() {
    const {dashboardData} = this.state;
    return (
      <CScreen
        refresh={() => this.firebasereport()}
        bgColor={Pref.WHITE}
        body={
          <View>
            <LeftHeaders showBack title={'Performance'} />

            {dashboardData !== null ? (
              <>
                <Card
                  style={{
                    marginHorizontal: 24,
                    marginVertical: 10,
                    elevation: 2,
                  }}>
                  <Card.Content>
                    {this.renderCircleItem(
                      `${dashboardData.inter}`,
                      'Interested',
                      '',
                      () => {},
                      1,
                    )}
                    {this.renderCircleItem(
                      `${dashboardData.ntinter}`,
                      'Not-Interested',
                      '',
                      () => {},
                    )}
                    {this.renderCircleItem(
                      `${dashboardData.wrong}`,
                      'Incorrect Number',
                      '',
                      () => {},
                    )}
                    {this.renderCircleItem(
                      `${dashboardData.dur}`,
                      'Avg. Talktime',
                      '',
                      () => {},
                    )}
                    {this.renderCircleItem(
                      `${this.state.totalIdleTime}min`,
                      'Idle Time',
                      '',
                      () => {},
                    )}
                  </Card.Content>
                </Card>
                <View style={{marginTop: 16}}>
                  <Purechart
                    data={this.state.barData}
                    type="bar"
                    yAxisGridLineColor={'#d5d5d5'}
                    yAxislabelColor={'#656565'}
                    labelColor={'#656565'}
                    showEvenNumberXaxisLabel={false}
                    backgroundColor={Pref.WHITE}
                    height={250}
                    defaultColumnWidth={60}
                    defaultColumnMargin={38}
                    highlightColor={'#d5d5d5'}
                  />
                </View>
              </>
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
  loader: {
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 1,
    marginVertical: 48,
    paddingVertical: 100,
  },
  submitbuttonpicker: {
    backgroundColor: Pref.RED,
    borderColor: 'transparent',
    borderWidth: 0,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    width: '100%',
    borderRadius: 0,
    marginEnd: 10,
    marginBottom: -2,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  iconcenter: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignSelf: 'flex-end',
    borderRadius: 42 / 2,
    backgroundColor: '#0270e3',
    marginEnd: 16,
    marginBottom: 8,
  },
  circle1: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 16 / 2,
    backgroundColor: '#0270e3',
  },
  leadercont: {
    flex: 1,
    flexDirection: 'row',
  },
  leadcircle: {
    borderColor: '#dbd9cc',
    width: sizeWidth(48),
    height: sizeWidth(48),
    borderRadius: sizeWidth(48) / 2.0,
    borderWidth: 1.5,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  tri: {
    //position: 'absolute',
    backgroundColor: 'transparent',
    borderTopWidth: 36 / 2.0,
    borderRightWidth: 0,
    borderBottomWidth: 36 / 2.0,
    borderLeftWidth: 24,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'white',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    right: -28,
  },
  pfiltercont: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
    borderColor: '#dbdacd',
    borderWidth: 0.8,
    backgroundColor: Pref.WHITE,
    borderRadius: 8,
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    }),
  },
  filtercont: {
    flex: 0.6,
    //position: 'absolute',
    //zIndex: 99,
    borderColor: '#dbdacd',
    borderWidth: 0.8,
    backgroundColor: Pref.WHITE,
    alignSelf: 'flex-end',
    borderRadius: 8,
    //top: 24,
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    }),
  },
  passText: {
    fontSize: 20,
    letterSpacing: 0.5,
    color: '#555555',
    fontWeight: '700',
    lineHeight: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  line: {
    backgroundColor: '#f2f1e6',
    height: 1.2,
    marginStart: 12,
    marginEnd: 12,
    marginTop: 8,
  },
});
