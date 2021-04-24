import React from 'react';
import {StyleSheet, BackHandler, TouchableWithoutFeedback} from 'react-native';
import {Title, View} from '@shoutem/ui';
import * as Helper from '../../../util/Helper';
import * as Pref from '../../../util/Pref';
import {ActivityIndicator, Searchbar, List} from 'react-native-paper';
import {sizeHeight} from '../../../util/Size';
import Lodash from 'lodash';
import LeftHeaders from '../../common/CommonLeftHeader';
import ListError from '../../common/ListError';
import CommonTable from '../../common/CommonTable';
import RNFetchBlob from 'rn-fetch-blob';
import IconChooser from '../../common/IconChooser';
import CScreen from './../../component/CScreen';
import NavigationActions from '../../../util/NavigationActions';
import Download from '../../component/Download';
import moment from 'moment';
import PaginationNumbers from '../../component/PaginationNumbers';
import {disableOffline} from '../../../util/DialerFeature';
import {firebase} from '@react-native-firebase/firestore';

const ITEM_LIMIT = 10;

export default class TlTeam extends React.PureComponent {
  constructor(props) {
    super(props);
    this.rowClicked = this.rowClicked.bind(this);
    this.state = {
      dataList: [],
      loading: false,
      token: '',
      userData: '',
      tableHead: ['Sr. No.', 'Name', 'Mobile', 'Refercode', 'View'],
      widthArr: [60, 140, 100, 100, 80],
      cloneList: [],
      type: '',
      itemSize: 10,
      disableNext: false,
      disableBack: false,
      searchQuery: '',
      enableSearch: false,
      orderBy: 'asc',
      fileName: '',
      leaderData: [],
      teamInfo: null,
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({loading: true, dataList: []});
    });
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.userData, (data) => {
        Pref.getVal(Pref.DIALER_DATA, (userData) => {
          this.setState({userData: userData, leaderData: data});
          Pref.getVal(Pref.saveToken, (value) => {
            this.setState({token: value}, () => {
              this.fetchData();
            });
          });
        });
      });
    });
  }

  componentWillUnMount() {
    this.setState({reportenabled: false});
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  fetchData = () => {
    this.setState({loading: true});
    disableOffline();
    const {userData, leaderData} = this.state;
    const {leader} = leaderData;
    const {id} = userData[0].tl;
    firebase
      .firestore()
      .collection(Pref.COLLECTION_PARENT)
      .doc(leader[0].id)
      .get()
      .then((firestoredata) => {
        if (firestoredata.exists) {
          const {teamlist} = firestoredata.data();
          //console.log('teamlist', teamlist);
          teamlist.map((io) => {
            const {tllist, name, memberlist} = io;
            tllist.map((item) => {
              if (Number(item.id) === Number(id)) {
                //console.log('item', io);
                const body = JSON.stringify({
                  tlid: item.id,
                  tname: name,
                  idlist: memberlist.map((io) => io.id),
                });
                Helper.networkHelperTokenPost(
                  Pref.DILAER_TL_TEAM_MEMBERS,
                  body,
                  Pref.methodPost,
                  this.state.token,
                  (result) => {
                    //console.log('result',result);
                    const {data, status} = result;
                    if (status) {
                      if (data.length > 0) {
                        const {itemSize} = this.state;
                        const teamData = data[0].teamdata;
                        this.setState({
                          teamInfo: data[0],
                          cloneList: teamData,
                          dataList: this.returnData(
                            teamData,
                            0,
                            teamData.length,
                          ).slice(0, itemSize),
                          loading: false,
                          itemSize:
                            teamData.length <= ITEM_LIMIT
                              ? teamData.length
                              : ITEM_LIMIT,
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
              }
            });
          });
        } else {
          this.setState({loading: false});
        }
      })
      .catch((e) => {
        this.setState({loading: false});
      });
  };

  /**
   *
   * @param {*} data
   */
  returnData = (sort, start = 0, end, tlObject = {}) => {
    const dataList = [];
    if (sort.length > 0) {
      if (start >= 0) {
        for (let i = start; i < end; i++) {
          const item = sort[i];
          if (Helper.nullCheck(item) === false) {
            const rowData = [];
            rowData.push(`${Number(i + 1)}`);
            rowData.push(item.username);
            rowData.push(item.mobile);
            rowData.push(item.refercode);
            const leadView = (value, tlObject) => (
              <TouchableWithoutFeedback
                onPress={() => this.rowClicked(value, tlObject)}>
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
            rowData.push(leadView(item, tlObject));
            dataList.push(rowData);
          }
        }
      }
    }
    return dataList;
  };

  onChangeSearch = (query) => {
    this.setState({searchQuery: query});
    const {cloneList, itemSize} = this.state;
    if (cloneList.length > 0) {
      const trimquery = String(query).trim().toLowerCase();
      const clone = JSON.parse(JSON.stringify(cloneList));
      const result = Lodash.filter(clone, (it) => {
        const {team} = it;
        return team && team.trim().toLowerCase().includes(trimquery);
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
      const data = this.returnData(clone, 0, 10);
      this.setState({dataList: data});
    }
    this.setState({searchQuery: '', enableSearch: !enableSearch, itemSize: 10});
  };

  rowClicked = (item, tlObject) => {
    const {teamInfo} = this.state;
    const {tl, tname} = teamInfo;
    const sp = String(tname).split('&');
    const data = [
      sp[2],
      item.username,
      item.mobile,
      item.email,
      item.refercode,
      Number(item.id),
    ];
    NavigationActions.navigate('MemberReport', {
      data: data,
      tlID: Number(tl),
      currentId: item.id,
      tname: tname,
    });
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

  // renderTeamData = (item, dataList) => {
  //   return (
  //     // <List.Accordion
  //     //   title={item.team}
  //     //   description={`${item.totalm} Members`}
  //     //   titleStyle={styles.accordTitle}
  //     //   style={styles.accordStyle}>
  //     // </List.Accordion>
  //   );
  // };

  render() {
    const {searchQuery, enableSearch, teamInfo, dataList} = this.state;
    return (
      <CScreen
        body={
          <>
            <LeftHeaders
              showBack
              title={'My Team'}
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

            {teamInfo != null ? (
              <View styleName="v-center h-center md-gutter">
                <Title styleName="v-center h-center" style={styles.accordTitle}>
                  {teamInfo.team}
                </Title>
              </View>
            ) : null}

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
            ) : dataList.length > 0 ? (
              <CommonTable
                enableHeight={false}
                dataList={dataList}
                widthArr={this.state.widthArr}
                tableHead={this.state.tableHead}
                //rowClicked={this.rowClicked}
              />
            ) : (
              <View style={styles.emptycont}>
                <ListError subtitle={'No Teams Found...'} />
              </View>
            )}
            {dataList.length > 0 ? (
              <>
                <Title style={styles.itemtext}>{`Showing ${
                  this.state.itemSize
                }/${Number(this.state.cloneList.length)} entries`}</Title>
              </>
            ) : null}
          </>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
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
    fontSize: 16,
    fontWeight: '700',
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
