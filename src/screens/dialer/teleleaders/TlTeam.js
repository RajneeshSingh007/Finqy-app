import React from 'react';
import {StyleSheet, BackHandler, TouchableWithoutFeedback} from 'react-native';
import {Title, View} from '@shoutem/ui';
import * as Helper from '../../../util/Helper';
import * as Pref from '../../../util/Pref';
import {ActivityIndicator, Searchbar} from 'react-native-paper';
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
      tableHead: ['Sr. No.', 'Team Name', 'Member Count', 'View'],
      widthArr: [60, 140, 120, 60],
      cloneList: [],
      type: '',
      itemSize: 10,
      disableNext: false,
      disableBack: false,
      searchQuery: '',
      enableSearch: false,
      orderBy: 'asc',
      fileName: '',
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({loading: true, dataList: []});
    });
    //this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.DIALER_DATA, userData => {
          this.setState({userData:userData})
        Pref.getVal(Pref.saveToken, value => {
            this.setState({token: value}, () => {
              this.fetchData();
            });
        });
      });
    //});
  }

  componentWillUnMount() {
    this.setState({reportenabled: false});
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  fetchData = () => {
    this.setState({loading: true});
    const {userData} = this.state;
    const {id} = userData[0].tl;
    const body = JSON.stringify({
      teamid: id,
    });
    Helper.networkHelperTokenPost(
      Pref.DIALER_TL_TEAMS,
      body,
      Pref.methodPost,
      this.state.token,
      result => {
        //console.log('result',result);
        const {data, status} = result;
        if (status) {
          if (data.length > 0) {
            const {itemSize} = this.state;
            this.setState({
              cloneList: data,
              dataList: this.returnData(data, 0, data.length).slice(
                0,
                itemSize,
              ),
              loading: false,
              itemSize: data.length <= ITEM_LIMIT ? data.length : ITEM_LIMIT,
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
  };

  /**
   *
   * @param {*} data
   */
  returnData = (sort, start = 0, end) => {
    const {reportenabled} = this.state;
    const dataList = [];
    if (sort.length > 0) {
      if (start >= 0) {
        for (let i = start; i < end; i++) {
          const item = sort[i];
          if (Helper.nullCheck(item) === false) {
            const rowData = [];
            rowData.push(`${Number(i + 1)}`);
            rowData.push(item.team);
            rowData.push(item.totalm);
            const leadView = value => (
              <TouchableWithoutFeedback
                onPress={() => this.rowClicked(value)}>
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
            rowData.push(leadView(item));
            dataList.push(rowData);
          }
        }
      }
    }
    return dataList;
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
        const {team} = it;
        return (
          (team &&
            team
              .trim()
              .toLowerCase()
              .includes(trimquery)));
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

  rowClicked = item => {
    console.log('item', item);
    // const {reportenabled} = this.state;
    // if (reportenabled === true) {
    //   NavigationActions.navigate('MemberReport', {data: item});
    // }
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

  render() {
    const {searchQuery, enableSearch, reportenabled} = this.state;
    return (
      <CScreen
        body={
          <>
            <LeftHeaders
              showBack
              title={reportenabled ? 'Performance Review' : 'My Team Members'}
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
                rowClicked={this.rowClicked}
              />
            ) : (
              <View style={styles.emptycont}>
                <ListError subtitle={'No Teams Found...'} />
              </View>
            )}
            {this.state.dataList.length > 0 ? (
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
