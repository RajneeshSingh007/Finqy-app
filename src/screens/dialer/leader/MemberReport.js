import React from 'react';
import { StyleSheet, BackHandler, TouchableWithoutFeedback } from 'react-native';
import { Title, View } from '@shoutem/ui';
import * as Helper from '../../../util/Helper';
import * as Pref from '../../../util/Pref';
import { ActivityIndicator, Searchbar, List, FAB } from 'react-native-paper';
import { sizeHeight, sizeWidth } from '../../../util/Size';
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
import DateRangePicker from "react-native-daterange-picker";
let DATE_FORMAT = 'DD-MM-YYYY';

export default class MemberReport extends React.PureComponent {
  constructor(props) {
    super(props);
    this.backClick = this.backClick.bind(this);
    this.rowClicked = this.rowClicked.bind(this);
    this.filterItemClick = this.filterItemClick.bind(this);
    this.state = {
      dataList: [],
      loading: false,
      token: '',
      userData: '',
      cloneList: [],
      type: '',
      dialerUserData: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backClick);
    const { navigation } = this.props;
    const dialerUserData = navigation.getParam('data', []);
    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({ loading: true, dataList: [] });
    });
    //console.log('dialerUserData', dialerUserData);
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.userData, userData => {
        this.setState({ userData: userData, dialerUserData: dialerUserData });
        Pref.getVal(Pref.USERTYPE, v => {
          this.setState({ type: v }, () => {
            Pref.getVal(Pref.saveToken, value => {
              this.setState({ token: value }, () => {
                const pastStartDate = moment().format(DATE_FORMAT);
                const pastEndDate = moment()
                  .subtract(7, 'd')
                  .format(DATE_FORMAT);
                const efStartDate = moment().format(DATE_FORMAT);
                const efEndDate = moment()
                  .subtract(1, 'M')
                  .format(DATE_FORMAT);
                const plStartDate = moment().format(DATE_FORMAT);
                const plEndDate = moment()
                  .subtract(1, 'M')
                  .format(DATE_FORMAT);
                // console.log(
                //   pastStartDate,
                //   pastEndDate,
                //   efStartDate,
                //   efEndDate,
                //   plStartDate,
                //   plEndDate,
                // );
                this.fetchData(
                  pastStartDate,
                  pastEndDate,
                  efStartDate,
                  efEndDate,
                  plStartDate,
                  plEndDate,
                );
              });
            });
          });
        });
      });
    });
  }

  componentWillUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  backClick = () => {
    const { reportenabled } = this.state;
    if (reportenabled === true) {
      NavigationActions.navigate('All Members', { reportenabled: true });
      return true;
    }
    NavigationActions.goBack();
    return false;
  };

  fetchData = (
    pastStartDate = '',
    pastEndDate = '',
    efStartDate = '',
    efEndDate = '',
    plStartDate = '',
    plEndDate = '',
  ) => {
    this.setState({ loading: true });
    const { team_id } = this.state.userData;
    const dialerUserData = this.state.dialerUserData;
    const userid = dialerUserData[dialerUserData.length - 1];
    const todaysDate = moment().format(DATE_FORMAT);
    const body = JSON.stringify({
      teamid: team_id,
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
    //console.log('body', body)
    Helper.networkHelperTokenPost(
      Pref.DIALER_GET_MEMBERS,
      body,
      Pref.methodPost,
      this.state.token,
      result => {
        //console.log('result', result);
        const { data, status } = result;
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
          this.setState({ loading: false });
        }
      },
      e => {
        this.setState({ loading: false });
      },
    );
  };

  rowClicked = item => {
    //NavigationActions.navigate('MemberReport', {data: item});
  };

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
    iconClick = () => { },
    type = 1,
  ) => {
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

  userView = dialerUserData => {
    return (
      <View styleName="sm-gutter vertical" style={styles.itemContainer}>
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
                color: '#848486',
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
                color: '#848486',
                fontWeight: '400',
                marginTop: 0,
                marginBottom: 0,
                paddingBottom: 0,
              },
            ])}>
            {`Ref: ${dialerUserData[dialerUserData.length - 2]}`}
          </Title>
        </View>
      </View>
    );
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
        style={{
          borderColor: '#f2f1e6',
          borderBottomWidth: 1.3,
          marginVertical: 4,
        }}
        titleStyle={StyleSheet.flatten([
          styles.accordTitle,
          {
            color: '#848486',
            fontWeight: '400',
            fontSize: 13,
          },
        ])}>
        <CommonTable
          enableHeight={false}
          dataList={data}
          widthArr={width}
          tableHead={head}
        />
      </List.Accordion>
    );
  };

  filterItemClick = () => { };

  render() {
    const { searchQuery, enableSearch, dataList, dialerUserData } = this.state;
    const data = dataList[0];
    return (
      <CScreen
        absolute={
          <>
            {this.state.loading === false ? <FAB
              style={styles.fab}
              icon={'filter'}
              onPress={this.filterItemClick}
            /> : null}

          </>
        }
        body={
          <>
            <LeftHeaders
              showBack
              title={'Performance Report'}
              bottomBody={<></>}
            />

            {this.state.loading ? (
              <View style={styles.loader}>
                <ActivityIndicator />
              </View>
            ) : this.state.dataList.length > 0 ? (
              <View>
                <View styleName="horizontal sm-gutter v-center h-center">
                  {this.renderCircleItem(
                    data.today && data.today.data.length > 0
                      ? data.today.data.length
                      : 0,
                    'Total Today Call',
                  )}

                  {this.renderCircleItem(
                    data.past && data.past.data.length > 0
                      ? data.past.data.length
                      : 0,
                    'Last 7 Days Call',
                  )}
                </View>

                {dialerUserData.length > 0
                  ? this.userView(dialerUserData)
                  : null}

                <View style={styles.newItemContainer}>
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
                </View>

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
                  // <CommonTable
                  //   enableHeight={false}
                  //   dataList={this.state.dataList}
                  //   widthArr={this.state.widthArr}
                  //   tableHead={this.state.tableHead}
                  //   rowClicked={this.rowClicked}
                  // />
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
    backgroundColor: Pref.RED
  },
});
