import * as React from 'react';
import {View, FlatList, Alert,ActivityIndicator, StyleSheet} from 'react-native';
import * as Pref from '../../util/Pref';
import * as Helper from '../../util/Helper';
import CScreen from './../component/CScreen';
import LeftHeaders from '../common/CommonLeftHeader';
import {sizeWidth, sizeHeight} from '../../util/Size';
import DashboardItem from './components/DashboardItem';
import NavigationActions from '../../util/NavigationActions';
import ListError from '../common/ListError';

const TLDashboard = [
  {
    name: 'Dashboard',
    image: require('../../res/images/dialer/dashboard.png'),
    click: 'TlDashboard',
    option: {},
  },
  {
    name: 'Report',
    image: require('../../res/images/dialer/report.png'),
    click: 'MemberReport',
    option: {},
  },
  {
    name: 'My Team Members',
    image: require('../../res/images/dialer/dashboard.png'),
    click: 'AllMembers',
    option: {},
  },
];

const TCDashboard = [
  {
    name: 'Dashboard',
    image: require('../../res/images/dialer/dashboard.png'),
    click: 'TcDashboard',
    option: {},
  },
  {
    name: 'Start Calling',
    image: require('../../res/images/dialer/phone.png'),
    click: 'DialerCalling',
    option: {editEnabled: false},
  },
  {
    name: 'Follow-up',
    image: require('../../res/images/dialer/phonecall.png'),
    //click: 'Followup',
    click:'DialerCalling',
    option: {editEnabled:false,isFollowup:1},
  },
  {
    name: 'Extras',
    image: require('../../res/images/dialer/emergency_call.png'),
    //click: 'Followup',
    click:'DialerCalling',
    option: {editEnabled:false,isFollowup:2},
  },
  {
    name: 'Call Records',
    image: require('../../res/images/dialer/report.png'),
    click: 'DialerRecords',
    option: {},
  },
  {
    name: 'Performance',
    image: require('../../res/images/dialer/growth.png'),
    click: 'TcPerformance',
    option: {},
  },
  {
    name: 'Templates',
    image: require('../../res/images/dialer/template.png'),
    click: 'TcPerformance',
    option: {},
  },
];

/**
 * SwitchUser
 */
export default class SwitchUser extends React.PureComponent {
  constructor(props) {
    super(props);
    this.itemClicked = this.itemClicked.bind(this);
    this.state = {
      userData: null,
      dialerData: null,
      dataList: [],
      loading:true,
      appoint:false
    };
  }

  /**
   *
   */
  componentDidMount() {
    const {navigation} = this.props;
    //this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.USERTYPE, type => {
        Pref.getVal(Pref.userData, data => {
          if (type === 'team') {
            Pref.getVal(Pref.DIALER_DATA, value => {
              let result = [];
              const {id, tlid, pname} = value[0].tc;
                            
              if (value.length > 0 && Helper.nullCheck(value[0].tc) === false) {
                result = TCDashboard;
              } else if (
                value.length > 0 &&
                Helper.nullCheck(value[0].tl) === false
              ) {
                result = TLDashboard;
              }
              this.setState({
                userData: data,
                dialerData: value,
                dataList: result,
                loading:false
              }, () =>{
                this.followupAvailableCheck(tlid, id, pname);
              });

              // Alert.alert('Check-In', '', [
              //   {
              //     text: 'Ok',
              //     onPress: () => {
              //       this.setState({
              //         userData: data,
              //         dialerData: value,
              //         dataList: result,
              //       });
              //     },
              //   },
              //   {
              //     text: 'Cancel',
              //     onPress: () => {
              //       NavigationActions.goBack();
              //     },
              //   },
              // ]);
            });
          }
        });
      });
    //});
  }

  followupAvailableCheck = (tlid,id, tname) => {
    Pref.getVal(Pref.saveToken, value => {
      const body = JSON.stringify({
        teamid: tlid,
        userid: id,
        tname: tname,
      });
      //console.log(body);
      Helper.networkHelperTokenPost(
      Pref.DIALER_TC_Follow,
      body,
      Pref.methodPost,
      value,
      result => {
        const {appoint} = result;
        //console.log('appoint', appoint);
        this.setState({appoint:appoint})
        //console.log(result);
      },
      (e) => {

      });
    });
  };

  itemClicked = ({name, click, option}) => {
    NavigationActions.navigate(click, option);
  };

  render() {
    const {dataList,appoint} = this.state;
    return (
      <CScreen
        showScrollToTop={false}
        body={
          <>
            <LeftHeaders showBack title={'Dialer'} />

            {this.state.loading ? (
              <View style={styles.loader}>
                <ActivityIndicator color={Pref.RED} />
              </View>
            ) : dataList && dataList.length > 0 ? (
              <FlatList
                style={{
                  marginHorizontal: sizeWidth(2),
                  flex: 1,
                  marginVertical: 12,
                }}
                data={this.state.dataList}
                renderItem={({item, index}) => (
                  <DashboardItem
                    item={item}
                    index={index}
                    itemClick={() => this.itemClicked(item)}
                    appoint={appoint}
                  />
                )}
                keyExtractor={(_item, index) => `${index}`}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={false}
                extraData={this.state}
                numColumns={2}
              />
            ): (
              <View style={styles.emptycont}>
                <ListError subtitle={'No data found...'} />
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
