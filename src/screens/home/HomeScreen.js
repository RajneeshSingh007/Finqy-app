import {Title, View} from '@shoutem/ui';
import React from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  Alert,
} from 'react-native';
import {Portal} from 'react-native-paper';
import * as Helper from '../../util/Helper';
import {sizeWidth} from '../../util/Size';
import NavigationActions from '../../util/NavigationActions';
import LeftHeaders from '../common/CommonLeftHeader';
import * as Pref from '../../util/Pref';
import CScreen from '../component/CScreen';
import Lodash from 'lodash';
import IconChooser from '../common/IconChooser';
import Purechart from 'react-native-pure-chart';

let pieData = [
  {
    value: 59,
    label: 'Credit Card',
    color: '#87c1fc',
  },
  {
    value: 30,
    label: 'Insurance',
    color: '#fe8c8c',
  },
  {
    value: 20,
    label: 'Investment',
    color: '#77e450',
  },
  {
    value: 9,
    label: 'Loan',
    color: '#ffe251',
  },
];

let sampleData = [
  {
    seriesName: 'series1',
    data: [
      {x: 'Jan - 20', y: 10},
      {x: 'Feb - 20', y: 40},
      {x: 'March - 20', y: 60},
      {x: 'April - 20', y: 75},
    ],
    color: '#87c1fc',
  },
  {
    seriesName: 'series2',
    data: [
      {x: 'Jan - 20', y: 20},
      {x: 'Feb - 20', y: 40},
      {x: 'March - 20', y: 60},
      {x: 'April - 20', y: 70},
    ],
    color: '#ffe251',
  },
  {
    seriesName: 'series3',
    data: [
      {x: 'Jan - 20', y: 30},
      {x: 'Feb - 20', y: 40},
      {x: 'March - 20', y: 34},
      {x: 'April - 20', y: 120},
    ],
    color: '#fe8c8c',
  },
  {
    seriesName: 'series4',
    data: [
      {x: 'Jan - 20', y: 17},
      {x: 'Feb - 20', y: 20},
      {x: 'March - 20', y: 40},
      {x: 'April - 20', y: 200},
    ],
    color: '#77e450',
  },
];


export default class HomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.crousel = React.createRef();
    this.state = {
      loading: false,
      progressloader: false,
      dataList: [],
      bannerList: [],
      showRefDialog: false,
      userData: {},
      pageIndex: 0,
      showNotification: false,
      noteContent: '',
      leadcount: 0,
      token: '',
      showProfile: false,
      type: '',
    };
    Pref.getVal(Pref.initial, (value) => {
      const check = Helper.removeQuotes(value);
      this.setState({showRefDialog: check === '' || check === null});
    });
    Pref.getVal(Pref.userData, (value) => {
      if (value !== undefined && value !== null) {
        this.setState({userData: value});
      }
    });
  }

  componentDidMount() {
    try {
      Helper.requestPermissions();
    } catch (e) {
      // console.log(e);
    }
    const {navigation} = this.props;
    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({loading: false});
    });
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.saveToken, (value) => {
        //console.log(`value`, value)
        if (value === undefined || value === null) {
          const body = JSON.stringify({
            username: `ERBFinPro`,
            product: `FinPro App`,
          });
          Helper.networkHelper(
            Pref.GetToken,
            body,
            Pref.methodPost,
            (result) => {
              const {data, response_header} = result;
              const {res_type} = response_header;
              if (res_type === `success`) {
                this.setState({token: Helper.removeQuotes(data)});
                Pref.setVal(Pref.saveToken, Helper.removeQuotes(data));
              }
            },
            () => {
              //console.log(`error`, error)
            },
          );
        } else {
          this.setState({token: value});
        }
      });
      Pref.getVal(Pref.USERTYPE, (v) => {
        this.setState({type: v});
      });
    });
  }

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  logout = () => {
    Alert.alert('Logout', 'Are you sure want to Logout?', [
      {
        text: 'Cancel',
      },
      {
        text: 'Ok',
        onPress: () => {
          Pref.setVal(Pref.saveToken, null);
          Pref.setVal(Pref.userData, null);
          Pref.setVal(Pref.userID, null);
          Pref.setVal(Pref.USERTYPE, '');
          Pref.setVal(Pref.loggedStatus, false);
          NavigationActions.navigate('IntroScreen');
        },
      },
    ]);
  };

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

  renderFooter = (title, color) => {
    return (
      <View
        styleName="horizontal"
        style={{
          marginHorizontal: 16,
          flex: 1,
        }}>
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
              color: `${color}`,
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

  render() {
    const {showProfile, type, userData} = this.state;
    let name = '';
    if (Helper.nullCheck(userData) === false) {
      name = userData.rname === undefined ? userData.username : userData.rname;
    }
    return (
      <CScreen
        absolute={
          <>
            {showProfile ? (
              <Portal>
                <TouchableWithoutFeedback onPress={this.dismisssProfile}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      backgroundColor: 'transparent',
                    }}
                    onPress={this.dismisssProfile}>
                    <View style={{flex: 0.13}} />
                    <View style={{flex: 0.1}}>
                      <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 0.2}} />
                        <View
                          styleName="vertical md-gutter"
                          style={styles.filtercont}>
                          {/* <View style={styles.tri}></View> */}
                          <Title
                            style={StyleSheet.flatten([
                              styles.passText,
                              {
                                lineHeight: 24,
                                fontSize: 18,
                              },
                            ])}>
                            {Lodash.truncate(name, {
                              length: 24,
                              separator: '...',
                            })}
                          </Title>
                          <Title
                            style={StyleSheet.flatten([
                              styles.passText,
                              {
                                color: Pref.RED,
                                fontSize: 16,
                                lineHeight: 20,
                                paddingVertical: 0,
                                marginBottom: 8,
                                marginTop: 4,
                              },
                            ])}>
                            {`${
                              type === 'connector'
                                ? `Connector`
                                : type === `referral`
                                ? 'Referral'
                                : `Team`
                            } Partner`}
                          </Title>

                          <View style={styles.line}></View>

                          <TouchableWithoutFeedback onPress={this.logout}>
                            <Title
                              style={StyleSheet.flatten([
                                styles.passText,
                                {
                                  marginTop: 8,
                                  color: '#0270e3',
                                  fontSize: 14,
                                  lineHeight: 20,
                                  paddingVertical: 0,
                                  textDecorationColor: '#0270e3',
                                  textDecorationStyle: 'solid',
                                  textDecorationLine: 'underline',
                                },
                              ])}>
                              {`Logout`}
                            </Title>
                          </TouchableWithoutFeedback>
                        </View>
                        <View style={{flex: 0.2}} />
                      </View>
                    </View>
                    <View style={{flex: 0.77}} />
                  </View>
                </TouchableWithoutFeedback>
              </Portal>
            ) : null}
          </>
        }
        body={
          <TouchableWithoutFeedback onPress={this.dismisssProfile}>
            <View>
              <LeftHeaders
                profile={() => this.setState({showProfile: !showProfile})}
                backClicked={() => NavigationActions.openDrawer()}
                title={`Hi,`}
                name={name}
              />

              <View
                styleName="md-gutter vertical v-center h-center"
                style={styles.leadercont}>
                {this.renderCircleItem(
                  100,
                  'Total\nLeads',
                  'bell',
                  () => {},
                  1,
                )}
                {this.renderCircleItem(
                  40,
                  'Total Converted\nLeads',
                  'filter',
                  () => {},
                )}
                {this.renderCircleItem(
                  '40%',
                  'Total Converted\nPercentage',
                  'percent',
                  () => {},
                )}
              </View>

              <Purechart
                data={sampleData}
                type="bar"
                yAxisGridLineColor={'#d5d5d5'}
                yAxislabelColor={'#656565'}
                labelColor={'#656565'}
                showEvenNumberXaxisLabel={false}
                backgroundColor={'white'}
                height={250}
                defaultColumnWidth={60}
                defaultColumnMargin={10}
              />

              <View styleName="h-center v-center">
                <View
                  styleName="horizontal h-center v-center"
                  style={{
                    marginVertical: 16,
                  }}>
                  <Purechart data={pieData} type="pie" size={200} />
                </View>
              </View>
              <View
                style={{
                  paddingVertical: 10,
                }}>
                <Title
                  style={StyleSheet.flatten([
                    styles.passText,
                    {
                      color: '#555555',
                      fontSize: 24,
                      lineHeight: 24,
                      marginVertical: 8,
                      paddingVertical: 10,
                    },
                  ])}>{`Sales By Category`}</Title>
                <View styleName="horizontal space-between v-center h-center">
                  {this.renderFooter('Credit Card', '#87c1fc')}
                  {this.renderFooter('Insurance', '#fe8c8c')}
                </View>
                <View
                  styleName="horizontal space-between v-center h-center"
                  style={{
                    marginTop: 10,
                  }}>
                  {this.renderFooter('Loan', '#ffe251')}
                  {this.renderFooter('Investment', '#77e450')}
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
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
