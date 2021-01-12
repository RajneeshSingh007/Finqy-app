import React from 'react';
import {
  StyleSheet,
  BackHandler,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Title,
  View,
} from '@shoutem/ui';
import * as Helper from '../../../util/Helper';
import * as Pref from '../../../util/Pref';
import {
  ActivityIndicator,
  Searchbar,
} from 'react-native-paper';
import { sizeHeight } from '../../../util/Size';
import Lodash from 'lodash';
import LeftHeaders from '../../common/CommonLeftHeader';
import ListError from '../../common/ListError';
import CommonTable from '../../common/CommonTable';
import RNFetchBlob from 'rn-fetch-blob';
import IconChooser from '../../common/IconChooser';
import CScreen from './../../component/CScreen';
import NavigationActions from '../../../util/NavigationActions';
import moment from 'moment';

export default class DialerRecords extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      loading: false,
      token: '',
      userData: '',
      tableHead: [],
      widthArr: [],
      cloneList: [],
      type: '',
      itemSize: 50,
      orderBy: 'asc',
      fileName: ''
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({ loading: true, dataList: [] });
    });
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.userData, (userData) => {
        const active = navigation.getParam("active", 1);
        //console.log('active', active)
        this.setState({ userData: userData,active:active });
        Pref.getVal(Pref.USERTYPE, (v) => {
          this.setState({ type: v }, () => {
            Pref.getVal(Pref.saveToken, (value) => {
              this.setState({ token: value }, () => {
                this.fetchData();
              });
            });
          });
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
    const {active,userData} = this.state;
    const { team_id,id } = userData;
    const body = JSON.stringify({
      teamid: team_id,
      userid: id,
      active: active,
    });
    Helper.networkHelperTokenPost(
      Pref.DIALER_LEAD_RECORD,
      body,
      Pref.methodPost,
      this.state.token,
      (result) => {
        const { data, status } = result;
        if (status) {
          if (data.length > 0) {
            const findUsername = Lodash.find(data, io => Helper.nullStringCheck(io.username) === false);
            const sorting = data.sort((a, b) => {
              const splita = a.updated_at.split(/\s/g);
              const splitb = b.updated_at.split(/\s/g);
              const sp = splita[0].split('-');
              const spz = splitb[0].split('-');
              return (
                Number(sp[2]) - Number(spz[2]) ||
                Number(sp[1]) - Number(spz[1]) ||
                Number(sp[0]) - Number(spz[0])
              );
            });
            const sort = sorting.reverse();
            const { itemSize } = this.state;
            let tableHead = [];
            let widthArr = [];
            
            if(Helper.nullCheck(findUsername) === true){
              tableHead = [
                'Sr. No.',
                'Name',
                'Number',
                'Call Date',
                'Call Duration',
                'Status',
                'Remarks',
                ''
              ];
              widthArr = [60, 120, 110, 110, 70, 120, 140,60];
            }else {
              tableHead = [
                'Sr. No.',
                'Name',
                'Number',
                'Call Date',
                'Call Duration',
                'Status',
                'Remarks',
                'Member Name',
                'Member Mobile',
                'Member Refercode',
                ''
              ];
              widthArr = [60, 120, 110, 110, 70, 120, 140,120,120,120,60];
            }

            this.setState({
              widthArr:widthArr,
              tableHead:tableHead,
              cloneList: sort,
              dataList: this.returnData(sort, 0, sort.length).slice(
                0,
                itemSize,
              ),
              loading: false,
              itemSize: sort.length >= 50 ? 50 : sort.length,
            });
          } else {
            this.setState({
              loading: false,
            });
          }
        } else {
          this.setState({ loading: false });
        }
      },
      (e) => {
        this.setState({ loading: false });
      },
    );
  };

  editLead = (item) =>{
    NavigationActions.navigate('DialerCalling', {data:item, editEnabled:true})
  }

  /**
   *
   * @param {*} data
   */
  returnData = (sort, start = 0, end) => {
    const dataList = [];
    if (sort.length > 0) {
      if (start >= 0) {
        for (let i = start; i < end; i++) {
          const item = sort[i];
          if (Helper.nullCheck(item) === false) {
            const rowData = [];
            rowData.push(`${Number(i + 1)}`);
            rowData.push(item.name);
            rowData.push(item.mobile);
            rowData.push(item.call_date.slice(0, String(item.call_date).lastIndexOf(':')));
            if(item.call_duration === null){
              rowData.push(``);
            }else{
              rowData.push(`${item.call_duration}s`);
            }
            rowData.push(Number(item.tracking_type) === 0 ? `Contactable\n${item.tracking_type_detail}` : `Non-Contactable\n${item.tracking_type_detail}`);
            rowData.push(item.remarks);

            if(Helper.nullCheck(item.username) === false){
              rowData.push(item.username);
            }else{
              rowData.push('');
            }

            if(Helper.nullCheck(item.mobile) === false){
              rowData.push(item.mobile);
            }else{
              rowData.push('');
            }

            if(Helper.nullCheck(item.refercode) === false){
              rowData.push(item.refercode);
            }else{
              rowData.push('');
            }

            const editView = (value) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableWithoutFeedback
                  onPress={() => this.editLead(value)}>
                  <View>
                    <IconChooser
                      name={`edit-2`}
                      size={20}
                      color={`#9f9880`}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            );
            if(Helper.nullCheck(item.editenable) === false && item.editenable === 0){
              rowData.push(editView(item));
            }else{
              rowData.push('');
            }
            

            dataList.push(rowData);
          }
        }
      }
    }
    return dataList;
  };

  clickedexport = () => {
    const { cloneList,userData } = this.state;
    if (cloneList.length > 0) {
      const data = this.returnData(cloneList, 0, cloneList.length);
      const { refercode } = userData;
      const name = `${refercode}_MyLeadRecord`;
      const finalFilePath = `${FILEPATH}${name}.csv`;
      Helper.writeCSV(HEADER, data, finalFilePath, (result) => {
        if (result) {
          RNFetchBlob.fs.scanFile([{ path: finalFilePath, mime: 'text/csv' }]),
            RNFetchBlob.android.addCompleteDownload({
              title: name,
              description: 'Lead record exported successfully',
              mime: 'text/comma-separated-values',
              path: finalFilePath,
              showNotification: true,
            }),
            Helper.showToastMessage('Download Complete', 1);
        }
      });
    }
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
      plus += 50;
      if (itemSize < clone.length) {
        if (plus > clone.length) {
          const rem = clone.length - itemSize;
          plus = itemSize + rem;
        }
        slicedArray = this.returnData(clone, itemSize, plus);
        this.setState({ dataList: slicedArray, itemSize: plus });
      }
    } else {
      if (itemSize <= 50) {
        plus = 0;
      } else {
        plus -= 50;
      }
      if (plus >= 0 && plus < clone.length) {
        slicedArray = this.returnData(clone, plus, itemSize);
        if (slicedArray.length > 0) {
          this.setState({ dataList: slicedArray, itemSize: plus });
        }
      }
    }
  };

  onChangeSearch = (query) => {
    this.setState({ searchQuery: query });
    const { cloneList, itemSize } = this.state;
    if (cloneList.length > 0) {
      const trimquery = String(query).trim().toLowerCase();
      const clone = JSON.parse(JSON.stringify(cloneList));
      const result = Lodash.filter(clone, (it) => {
        const { name, mobile, product } = it;
        if(Helper.nullCheck(it.username) === true){
          return name && name.trim().toLowerCase().includes(trimquery) || mobile && mobile.trim().toLowerCase().includes(trimquery) || product && product.trim().toLowerCase().includes(trimquery);
        }else{
          return name && name.trim().toLowerCase().includes(trimquery) || mobile && mobile.trim().toLowerCase().includes(trimquery) || product && product.trim().toLowerCase().includes(trimquery) 
          || it.username && it.username.trim().toLowerCase().includes(trimquery)
          || it.mobile && it.mobile.trim().toLowerCase().includes(trimquery)
          || it.refercode && it.refercode.trim().toLowerCase().includes(trimquery);
        }
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
      const data = this.returnData(clone, 0, 50);
      this.setState({ dataList: data });
    }
    this.setState({ searchQuery: '', enableSearch: !enableSearch, itemSize: 50 });
  }

  render() {
    const { searchQuery, enableSearch, active } = this.state;
    return (
      <CScreen
        refresh={() => this.fetchData()}
        body={
          <>
            <LeftHeaders
              showBack
              title={active === 1 ? 'My Lead Records': 'Team Lead Records'}
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
              enableHeight={false}
                dataList={this.state.dataList}
                widthArr={this.state.widthArr}
                tableHead={this.state.tableHead}
              />
            ) : (
                  <View style={styles.emptycont}>
                    <ListError subtitle={ active === -1 ? 'No Team Lead Records Found...': 'No Lead Records Found...'} />
                  </View>
                )}
            {this.state.dataList.length > 0 ? (
              <>
                <Title style={styles.itemtext}>{`Showing ${this.state.itemSize
                  }/${Number(this.state.cloneList.length)} entries`}</Title>
                {/* <Download rightIconClick={this.clickedexport} /> */}
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
