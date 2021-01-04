import {Title, View} from '@shoutem/ui';
import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  Alert,
} from 'react-native';
import * as Helper from '../../../util/Helper';
import {sizeWidth} from '../../../util/Size';
import NavigationActions from '../../../util/NavigationActions';
import LeftHeaders from '../../common/CommonLeftHeader';
import * as Pref from '../../../util/Pref';
import CScreen from '../../component/CScreen';
import Lodash from 'lodash';
import IconChooser from '../../common/IconChooser';
import Purechart from 'react-native-pure-chart';
import DateRangePicker from 'react-native-daterange-picker';
import moment from 'moment';

const productList = ['All Status', 'Contactable', 'Not Contactable'];

export default class DialerHome extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      startDate: null,
      endDate: null,
      displayedDate: moment(),
      loading: false,
      progressloader: false,
      dataList: [],
      bannerList: [],
      showRefDialog: false,
      userData: null,
      pageIndex: 0,
      showNotification: false,
      noteContent: '',
      leadcount: 0,
      token: '',
      showProfile: false,
      type: '',
      leadData: {
        contactable: 0,
        notContactable: 0,
      },
      pieData: [],
      barData: [
        {x: productList[1], y: 0, color: '#87c1fc'},
        {x: productList[2], y: 0, color: '#fe8c8c'},
      ],
      enableFilter: false,
      selectedProdut: 'All Status',
      enableDropdown: false,
      allProducts: productList,
      pieTextData: [],
      datefilter: false,
      filterdates: '',
    };
    Pref.getVal(Pref.userData, value => {
      if (value !== undefined && value !== null) {
        const pp = value.user_prof;
        //console.log('pp', pp)
        let profilePic =
          pp === undefined ||
          pp === null ||
          pp === '' ||
          (!pp.includes('.jpg') &&
            !pp.includes('.jpeg') &&
            !pp.includes('.png'))
            ? null
            : {uri: decodeURIComponent(pp)};
        this.setState({userData: value, profilePic: profilePic});
      }
    });
    Pref.getVal(Pref.USERTYPE, v => {
      this.setState({type: v});
    });
  }

  setDates = dates => {
    this.setState({
      ...dates,
    });
  };

  dateFilterSubmit = () => {
    const {token, userData, endDate, startDate} = this.state;
    const {id, leader_of} = userData;
    //const { endDate, startDate, } = dates;
    //console.log('dates', endDate, startDate)
    if (startDate != null) {
      const parse = moment(startDate).format('DD-MM-YYYY');
      this.setState({datefilter: false, endDate: null, startDate: null});
      let endparse = null;
      if (endDate != null) {
        endparse = moment(endDate).format('DD-MM-YYYY');
      } else {
        endparse = parse;
      }
      this.fetchDashboard(token, id, `${parse}@${endparse}`, leader_of);
    } else {
      this.setState({datefilter: false, endDate: null, startDate: null});
    }
  };

  componentDidMount() {
    try {
      Helper.requestPermissions();
    } catch (e) {
      // //console.log(e);
    }
    const {navigation} = this.props;
    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({loading: false});
    });
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.saveToken, value => {
        if (Helper.nullStringCheck(value) === true) {
          const body = JSON.stringify({
            username: `ERBFinPro`,
            product: `FinPro App`,
          });
          Helper.networkHelper(
            Pref.GetToken,
            body,
            Pref.methodPost,
            result => {
              const {data, response_header} = result;
              const {res_type} = response_header;
              if (res_type === `success`) {
                this.setState({token: Helper.removeQuotes(data)});
                Pref.setVal(Pref.saveToken, Helper.removeQuotes(data));
                const {id, leader_of} = this.state.userData;
                this.fetchDashboard(
                  Helper.removeQuotes(data),
                  id,
                  '',
                  leader_of,
                );
              }
            },
            () => {
              //console.log(`error`, error)
            },
          );
        } else {
          this.setState({token: value});
          const {id, leader_of} = this.state.userData;
          this.fetchDashboard(value, id, '', leader_of);
        }
      });
    });
  }

  fetchDashboard = (token, ref, filterdates = '', leader_of) => {
    const body = JSON.stringify({
      teamid: leader_of,
      userid: ref,
      date_range: filterdates,
    });
    //console.log('body', body);
    Helper.networkHelperTokenPost(
      Pref.DIALER_USER_DASHBOARD,
      body,
      Pref.methodPost,
      token,
      output => {
        const result = output.data;
        //console.log('result', result.contactable);
        let {leadData} = this.state;
        leadData.contactable = Number(result.contactable);
        leadData.notContactable = Number(result.notContactable);
        const barData = this.returnBarData(leadData);
        const pieData = this.returnPieData(leadData);
        const filter = Lodash.filter(pieData, io => io.value != 0);
        //console.log('leadData', barData);
        this.setState({
          pieData: filter,
          leadData: leadData,
          barData: barData,
          datefilter: false,
          endDate: null,
          startDate: null,
        });
      },
      () => {
        //console.log(error);
      },
    );
  };

  getFilterList = selectedProdut => {
    const {allProducts} = this.state;
    let filter = Lodash.filter(allProducts, io =>
      io.name.includes(selectedProdut),
    );
    return filter;
  };

  filterResult = ed => {
    if (ed === 'All Status') {
      this.reset();
      return false;
    }
    //console.log('leadData', leadData)
    let mapBarData = [];
    let mapPieData = [];
    let pieTextData = [];
    const piearraySize = mapPieData.length;
    let counter = 0;
    //console.log('mapPieData', mapPieData)
    if (mapPieData.length > 0) {
      const totalSum = Lodash.sumBy(mapPieData, op => op.value);
      pieTextData = Lodash.map(mapPieData, i => {
        const perc = this.getPercentage(totalSum, i.value);
        i.perc = perc;
        if (perc === 0) {
          counter += 1;
        }
        return i;
      });
    }
    //console.log(mapBarData)
    //mapBarData = [];
    if (piearraySize === counter) {
      pieTextData = [];
    }
    this.setState(
      {
        barData: mapBarData,
        pieData:
          mapPieData.length > 0
            ? ed.includes('Credit')
              ? []
              : Lodash.filter(mapPieData, io => io.value != 0)
            : [],
        selectedProdut: ed,
        enableDropdown: false,
        enableFilter: true,
        pieTextData: pieTextData,
      },
      () => {
        this.forceUpdate();
      },
    );
  };

  getPercentage = (total, got) => {
    return total > 0 && got > 0 ? Number((got * 100) / total).toFixed(1) : 0;
  };

  returnBarData = result => {
    const {contactable, notContactable} = result;
    const barData = [
      {x: productList[1], y: contactable, color: '#87c1fc'},
      {x: productList[2], y: notContactable, color: '#fe8c8c'},
    ];
    return barData;
  };

  returnPieData = result => {
    const {contactable, notContactable} = result;

    let pie = [];
    if (contactable === 0 && notContactable === 0) {
      pie = [];
    } else {
      pie = [
        {
          value: contactable,
          label: productList[1],
          color: '#87c1fc',
        },
        {
          value: notContactable,
          label: productList[2],
          color: '#fe8c8c',
        },
      ];
    }
    return pie;
  };

  reset = () => {
    const {leadData} = this.state;
    const barData = this.returnBarData(leadData);
    const pieData = this.returnPieData(leadData);
    const filter = Lodash.filter(pieData, io => io.value != 0);
    this.setState({
      pieData: filter,
      barData: barData,
      enableDropdown: false,
      enableFilter: false,
      selectedProdut: 'All Status',
      pieTextData: [],
    });
  };

  returnTotalLead = () => {
    const {leadData} = this.state;
    return Number(leadData.contactable);
  };

  returnConfirmLead = () => {
    const {leadData} = this.state;
    return leadData.notContactable;
  };

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  dismisssProfile = () => {
    this.setState({showProfile: false});
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
    iconClick = () => {},
    type = 1,
  ) => {
    return (
      <View
        styleName="md-gutter vertical  v-center h-center"
        style={styles.leadcircle}>
        <TouchableWithoutFeedback onPress={iconClick}>
          <View style={styles.circle} styleName="v-center h-center">
            <IconChooser
              name={icon}
              size={20}
              color={'white'}
              style={styles.iconcenter}
              iconType={type}
            />
          </View>
        </TouchableWithoutFeedback>
        <Title
          style={StyleSheet.flatten([
            styles.passText,
            {
              fontSize: 30,
              lineHeight: 30,
              color: '#6e6e6e',
              marginBottom: 10,
            },
          ])}>{`${count}`}</Title>
        <Title
          style={StyleSheet.flatten([
            styles.passText,
            {
              fontSize: 18,
              lineHeight: 18,
              color: '#6e6e6e',
            },
          ])}>{`${title}`}</Title>
      </View>
    );
  };

  renderFooter = (title, color, style = {}, textColor = null) => {
    return (
      <View
        styleName="horizontal"
        style={StyleSheet.flatten([
          {
            marginHorizontal: 16,
            flex: 1,
          },
          style,
        ])}>
        <View
          style={StyleSheet.flatten([
            styles.circle1,
            {
              backgroundColor: `${color}`,
            },
          ])}
        />
        <Title
          style={StyleSheet.flatten([
            styles.passText,
            {
              color: textColor === null ? `${color}` : `${textColor}`,
              fontSize: 17,
              lineHeight: 20,
              fontWeight: '400',
              fontFamily: Pref.getFontName(4),
              marginStart: 16,
              textAlign: 'left',
              flex: 1,
            },
          ])}>{`${title}`}</Title>
      </View>
    );
  };

  returnSelectProductPos = () => {
    const {selectedProdut} = this.state;
    const find = Lodash.findLastIndex(productList, e => e === selectedProdut);
    return find;
  };

  returnSelectProductColor = selectedProdut => {
    if (selectedProdut === 'All Status') {
      return '#87c1fc';
    } else if (selectedProdut === 'Contactable') {
      return '#87c1fc';
    } else if (selectedProdut === 'Not Contactable') {
      return '#fe8c8c';
    } else {
      return '#77e450';
    }
  };

  itemClick = e => {
    this.filterResult(e);
  };

  render() {
    const {
      type,
      userData,
      profilePic,
      endDate,
      startDate,
      displayedDate,
      datefilter,
    } = this.state;
    let name = '';
    if (Helper.nullCheck(userData) === false) {
      name = userData.rname === undefined ? userData.username : userData.rname;
      //profilePic = userData.user_prof === undefined || userData.user_prof === null ? null : {uri:userData.user_prof};
    }
    return (
      <CScreen
        bgColor={Pref.WHITE}
        absolute={
          <>
            {datefilter === true ? (
              <DateRangePicker
                onChange={this.setDates}
                endDate={endDate}
                startDate={startDate}
                displayedDate={displayedDate}
                range
                //presetButtons
                //buttonStyle={styles.submitbuttonpicker}
                buttonTextStyle={{
                  fontSize: 15,
                  fontWeight: '700',
                  color: 'white',
                }}
                submitClicked={this.dateFilterSubmit}
                closeCallback={() =>
                  this.setState({
                    startDate: null,
                    endDate: null,
                    datefilter: false,
                  })
                }
              />
            ) : null}
          </>
        }
        body={
          <TouchableWithoutFeedback onPress={this.dismisssProfile}>
            <View>
              <LeftHeaders
                backClicked={() => NavigationActions.openDrawer()}
                title={`Hi,`}
                name={name}
                profilePic={profilePic}
                type={type}
              />

              <View styleName="horizontal md-gutter v-center h-center">
                <View styleName="vertical v-center h-center">
                  <View styleName="horizontal">
                    <Title
                      style={StyleSheet.flatten([
                        styles.itemtopText,
                        {
                          color: '#6e6e6e',
                          fontSize: 16,
                          fontWeight: '700',
                          marginStart: 16,
                        },
                      ])}>
                      {`Filter By:`}
                    </Title>

                    <TouchableWithoutFeedback
                      onPress={() =>
                        this.setState({
                          enableDropdown: !this.state.enableDropdown,
                          datefilter: false,
                          endDate: null,
                          startDate: null,
                        })
                      }>
                      <View styleName="horizontal">
                        <Title
                          style={StyleSheet.flatten([
                            styles.itemtopText,
                            {
                              color: '#0270e3',
                              fontSize: 16,
                              fontWeight: '700',
                              marginStart: 16,
                            },
                          ])}>
                          {`${this.state.selectedProdut}`}
                        </Title>
                        <IconChooser
                          name={
                            this.state.enableFilter
                              ? 'chevron-up'
                              : 'chevron-down'
                          }
                          size={20}
                          color={'#0270e3'}
                          style={{
                            alignSelf: 'center',
                            justifyContent: 'center',
                            marginStart: 12,
                          }}
                        />
                      </View>
                    </TouchableWithoutFeedback>

                    <View
                      style={{
                        width: 1,
                        height: '100%',
                        backgroundColor: '#5555',
                        alignSelf: 'center',
                        marginStart: 6,
                      }}
                    />
                    <TouchableWithoutFeedback
                      onPress={() =>
                        this.setState({
                          datefilter: !this.state.datefilter,
                        })
                      }>
                      <View styleName="horizontal">
                        <Title
                          style={StyleSheet.flatten([
                            styles.itemtopText,
                            {
                              color: '#0270e3',
                              fontSize: 16,
                              fontWeight: '700',
                              marginStart: 16,
                            },
                          ])}>
                          {`Date Range`}
                        </Title>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                  {this.state.enableDropdown === true ? (
                    <View
                      styleName="vertical v-end h-end"
                      style={styles.pfiltercont}>
                      {productList.map((e, i) => {
                        return (
                          <View
                            styleName="vertical"
                            style={{
                              marginVertical: 6,
                            }}>
                            <TouchableWithoutFeedback
                              onPress={() => this.itemClick(e, i)}>
                              <Title
                                style={StyleSheet.flatten([
                                  styles.passText,
                                  {
                                    color: '#6e6852',
                                    fontSize: 16,
                                    lineHeight: 20,
                                    fontWeight: '400',
                                    paddingHorizontal: 8,
                                    alignSelf: 'flex-start',
                                    justifyContent: 'flex-start',
                                    textAlign: 'left',
                                  },
                                ])}>
                                {`${e}`}
                              </Title>
                            </TouchableWithoutFeedback>
                            <View
                              style={{
                                height: 1,
                                width: '100%',
                                backgroundColor: '#dcdace',
                                marginVertical: 1,
                              }}
                            />
                          </View>
                        );
                      })}
                    </View>
                  ) : null}
                </View>
              </View>
              <View
                styleName="md-gutter vertical v-center h-center"
                style={styles.leadercont}>
                {this.renderCircleItem(
                  `${this.returnTotalLead()}`,
                  'Contactable\n',
                  'bell',
                  () => {},
                  1,
                )}
                {this.renderCircleItem(
                  `${this.returnConfirmLead()}`,
                  'Not Contactable\n',
                  'filter',
                  () => {},
                )}
              </View>

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
                defaultColumnMargin={12}
                highlightColor={'#d5d5d5'}
              />
            </View>
          </TouchableWithoutFeedback>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
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
    alignItems: 'center',
    alignContent: 'center',
  },
  leadcircle: {
    borderColor: '#dbd9cc',
    width: sizeWidth(56),
    height: sizeWidth(56),
    borderRadius: sizeWidth(56) / 2.0,
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
