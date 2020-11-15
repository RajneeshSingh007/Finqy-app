import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Title,
  View,
} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {
  ActivityIndicator,
  Searchbar
} from 'react-native-paper';
import { sizeHeight } from '../../util/Size';
import Lodash from 'lodash';
import LeftHeaders from '../common/CommonLeftHeader';
import ListError from '../common/ListError';
import CommonTable from '../common/CommonTable';
import RNFetchBlob from 'rn-fetch-blob';
import IconChooser from '../common/IconChooser';
import CScreen from '../component/CScreen';
import Download from './../component/Download';

let HEADER = `Sr. No,Username,Email,Mobile,Pancard,Aadharcard,Status\n`;
let FILEPATH = `${RNFetchBlob.fs.dirs.DownloadDir}/Team.csv`;

export default class ViewTeam extends React.PureComponent {
  constructor(props) {
    super(props);
    const date = new Date();
    this.state = {
      dataList: [],
      loading: true,
      showCalendar: false,
      currentDate: date,
      dates: '',
      token: '',
      userData: '',
      tableHead: [
        'Sr. No.',
        'Username',
        'Email',
        'Mobile',
        'Pancard',
        'Aadharcard',
        'Status',
      ],
      widthArr: [60, 100, 160, 100, 100, 100, 100],
      itemSize: 5,
      disableNext: false,
      disableBack: false,
      searchQuery: '',
      cloneList: [],
      enableSearch: false
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({ loading: true });
    });
    this.focusListener = navigation.addListener('didFocus', () => {
      this.fetch();
    });
  }

  // componentDidUpdate(prevProp, nextState) {
  //   if (this.state.dataList.length == 0) {
  //     this.fetch();
  //   }
  // }

  fetch = () => {
    Pref.getVal(Pref.userData, (userData) => {
      this.setState({ userData: userData });
      Pref.getVal(Pref.saveToken, (value) => {
        this.setState({ token: value }, () => {
          this.fetchData();
        });
      });
    });
  }

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  fetchData = () => {
    this.setState({ loading: true });
    const { refercode } = this.state.userData;
    const body = JSON.stringify({
      refercode: refercode,
    });
    Helper.networkHelperTokenPost(
      Pref.ViewTeamUrl,
      body,
      Pref.methodPost,
      this.state.token,
      (result) => {
        const { data, response_header } = result;
        const { res_type } = response_header;
        if (res_type === `success`) {
         // //console.log('data', data)
          if (data.length > 0) {
            const dataList = data.reverse();
            const { itemSize } = this.state;
            this.setState({
              cloneList: dataList,
              dataList: this.returnData(dataList, 0, dataList.length).slice(
                0,
                itemSize,
              ),
              loading: false,
              itemSize: data.length >= 5 ? 5 : data.length,
            });
          } else {
            this.setState({ loading: false });
          }
        } else {
          this.setState({ loading: false });
        }
      },
      () => {
        this.setState({ loading: false });
      },
    );
  };

  /**
   *
   * @param {*} data
   */
  returnData = (sort, start = 0, end) => {
    const dataList = [];
    //console.log(start, end);
    if (sort.length > 0) {
      if (start >= 0) {
        for (let i = start; i < end; i++) {
          const item = sort[i];
          if (item !== undefined && item !== null) {
            const rowData = [];
            rowData.push(`${i + 1}`);
            rowData.push(`${Lodash.capitalize(item.username)}`);
            rowData.push(`${item.email}`);
            rowData.push(`${item.mobile}`);
            rowData.push(`${Lodash.capitalize(item.pancard)}`);
            rowData.push(`${item.aadharcard}`);
            const stdataView = (value) => (
              <View>
                <Title
                  style={{
                    textAlign: 'center',
                    fontWeight: '400',
                    color: value === 'Active' ? '#1bd741' : Pref.RED,
                    fontSize: 15,
                  }}>
                  {value}
                </Title>
              </View>
            );
            rowData.push(stdataView(item.status));
            dataList.push(rowData);
          }
        }
      }
    }
    return dataList;
  };

  /**
   *
   * @param {*} mode true ? next : back
   */
  pagination = (mode) => {
    const { itemSize, cloneList } = this.state;
    let clone = JSON.parse(JSON.stringify(cloneList));
    let plus = itemSize;
    let slicedArray = [];
    if (mode) {
      plus += 5;
      if (itemSize < clone.length) {
        if (plus > clone.length) {
          const rem = clone.length - itemSize;
          plus = itemSize + rem;
        }
        slicedArray = this.returnData(clone, itemSize, plus);
        this.setState({ dataList: slicedArray, itemSize: plus });
      }
    } else {
      if (itemSize <= 5) {
        plus = 0;
      } else {
        plus -= 5;
      }
      if (plus >= 0 && plus < clone.length) {
        slicedArray = this.returnData(clone, plus, itemSize);
        if (slicedArray.length > 0) {
          this.setState({ dataList: slicedArray, itemSize: plus });
        }
      }
    }
  };

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  clickedexport = () => {
    const { cloneList } = this.state;
    if (cloneList.length > 0) {
      const data = this.returnData(cloneList, 0, cloneList.length);
      Helper.writeCSV(HEADER, data, FILEPATH, (result) => {
        //console.log(result);
        if (result) {
          RNFetchBlob.fs.scanFile([{ path: FILEPATH, mime: 'text/csv' }]),
            RNFetchBlob.android.addCompleteDownload({
              title: 'Team Record',
              description: 'Team record exported successfully',
              mime: 'text/comma-separated-values',
              path: FILEPATH,
              showNotification: true,
            }),
            Helper.showToastMessage('Download Complete', 1);
        }
      });
    }
  };

  onChangeSearch = (query) => {
    this.setState({ searchQuery: query });
    const { cloneList, itemSize } = this.state;
    if (cloneList.length > 0) {
      const trimquery = String(query).trim().toLowerCase();
      const clone = JSON.parse(JSON.stringify(cloneList));

      const result = Lodash.filter(clone, (it) => {
        const { aadharcard, pancard, status, mobile, email, username } = it;
        return aadharcard && aadharcard.trim().toLowerCase().includes(trimquery) || pancard && pancard.trim().toLowerCase().includes(trimquery) || status && status.trim().toLowerCase().includes(trimquery) || mobile && mobile.trim().toLowerCase().includes(trimquery) || email && email.trim().toLowerCase().includes(trimquery) || username && username.trim().toLowerCase().includes(trimquery);
      });
      const data = result.length > 0 ? this.returnData(result, 0, result.length) : [];
      const count = result.length > 0 ? result.length : itemSize;
      this.setState({ dataList: data, itemSize: count });
    }
  };

  revertBack = () => {
    const { enableSearch } = this.state;
    const { cloneList } = this.state;
    if (enableSearch === true && cloneList.length > 0) {
      const clone = JSON.parse(JSON.stringify(cloneList));
      const data = this.returnData(clone, 0, 5);
      this.setState({ dataList: data });
    }
    this.setState({ searchQuery: '', enableSearch: !enableSearch, itemSize: 5 });
  }


  render() {
    const { searchQuery, enableSearch } = this.state;

    return (
      <CScreen
        body={
          <>
            <LeftHeaders showBack title={'My Team'} />
            <View styleName="horizontal md-gutter space-between">
              <View styleName="horizontal">
                <TouchableWithoutFeedback onPress={() => this.pagination(false)}>
                  <Title style={styles.itemtopText}>{`Back`}</Title>
                </TouchableWithoutFeedback>
                <View
                  style={{
                    height: 16,
                    marginHorizontal: 12,
                    backgroundColor: '#0270e3',
                    width: 1.5,
                  }}
                />
                <TouchableWithoutFeedback onPress={() => this.pagination(true)}>
                  <Title style={styles.itemtopText}>{`Next`}</Title>
                </TouchableWithoutFeedback>
              </View>

              <TouchableWithoutFeedback onPress={this.revertBack}>
                <View styleName="horizontal v-center h-center">
                  <IconChooser name={enableSearch ? 'x' : 'search'} size={24} color={'#555555'} />
                </View>
              </TouchableWithoutFeedback>

            </View>
            {enableSearch === true ? <View styleName='md-gutter'>
              <Searchbar
                placeholder="Search"
                onChangeText={this.onChangeSearch}
                value={searchQuery}
                style={{
                  elevation: 0,
                  borderColor: '#dbd9cc',
                  borderWidth: 0.5,
                  borderRadius: 8
                }}
                clearIcon={() => null}
              />
            </View> : null}

            {this.state.loading ? (
              <View style={styles.loader}>
                <ActivityIndicator />
              </View>
            ) : this.state.dataList.length > 0 ? (
              <CommonTable
                dataList={this.state.dataList}
                widthArr={this.state.widthArr}
                tableHead={this.state.tableHead}
              />
            ) : (
                  <View style={styles.emptycont}>
                    <ListError subtitle={'No teams found...'} />
                  </View>
                )}
            {this.state.dataList.length > 0 ? (
              <>
                <Title style={styles.itemtext}>{`Showing ${this.state.itemSize
                  }/${Number(this.state.cloneList.length)} entries`}</Title>
                <Download rightIconClick={this.clickedexport} />
              </>
            ) : null}
          </>
        }
      />
      // <CommonScreen
      //   title={'Finorbit'}
      //   loading={this.state.loading}
      //   enabelWithScroll={false}
      //   header={
      //     <LeftHeaders
      //       title={'View Team'}
      //       showAvtar
      //       showBack
      //       showBottom
      //       bottomIconName={'download'}
      //       bottomIconTitle={`Excel`}
      //       bottombg={Colors.red600}
      //       bottomClicked={() => {
      //   const {dataList} = this.state;
      //   if (dataList.length > 0) {
      //     Helper.writeCSV(HEADER, dataList, FILEPATH, (result) => {
      //       //console.log(result);
      //       if (result) {
      //         RNFetchBlob.fs.scanFile([
      //           {path: FILEPATH, mime: 'text/csv'},
      //         ]),
      //           RNFetchBlob.android.addCompleteDownload({
      //             title: 'Lead Record',
      //             description: 'Lead record exported successfully',
      //             mime: 'text/csv',
      //             path: FILEPATH,
      //             showNotification: true,
      //           }),
      //           Helper.showToastMessage('Download Complete', 1);
      //       }
      //     });
      //    }
      // }
      //      }
      //     />
      //   }
      //   headerDis={0.15}
      //   bodyDis={0.85}
      //   body={
      //     <>
      //   {this.state.loading ? (
      //     <View
      //       style={{
      //         justifyContent: 'center',
      //         alignSelf: 'center',
      //         flex: 1,
      //       }}>
      //       <ActivityIndicator />
      //     </View>
      //   ) : this.state.dataList.length > 0 ? (
      //     <CommonTable
      //       dataList={this.state.dataList}
      //       widthArr={this.state.widthArr}
      //       tableHead={this.state.tableHead}
      //       style={{marginTop: sizeHeight(6)}}
      //     />
      //   ) : (
      //     <View
      //       style={{
      //         flex: 1,
      //         justifyContent: 'center',
      //         alignItems: 'center',
      //         alignContents: 'center',
      //       }}>
      //       <ListError subtitle={'No teams found...'} />
      //     </View>
      //   )}
      // </>
      //   }
      // />
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
