import {Subtitle, Title, View} from '@shoutem/ui';
import React from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  Alert,
} from 'react-native';
import {Colors} from 'react-native-paper';
import * as Helper from '../../util/Helper';
import {sizeWidth} from '../../util/Size';
import NavigationActions from '../../util/NavigationActions';
import LeftHeaders from '../common/CommonLeftHeader';
import * as Pref from '../../util/Pref';
import {PieChart} from 'react-native-chart-kit';
import CardVertical from '../common/CardVertical';
import CScreen from '../component/CScreen';
import Lodash from 'lodash';

const data = [
  {
    name: 'Link Sourcing',
    population: 10,
    color: Colors.green400,
    legendFontColor: '#7F7F7F',
    legendFontSize: 14,
  },
  {
    name: 'Self Sourcing',
    population: 20,
    color: Colors.blue400,
    legendFontColor: '#7F7F7F',
    legendFontSize: 14,
  },
];

const data1 = [
  {
    name: 'Pending Confirmation',
    population: 8,
    color: Colors.indigo400,
    legendFontColor: '#7F7F7F',
    legendFontSize: 14,
  },
  {
    name: 'Quote Sent',
    population: 10,
    color: Colors.lightGreen400,
    legendFontColor: '#7F7F7F',
    legendFontSize: 14,
  },
  {
    name: 'Payment Link Sent',
    population: 4,
    color: Colors.brown400,
    legendFontColor: '#7F7F7F',
    legendFontSize: 14,
  },
];

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: () => `rgba(26, 255, 146, 0.5)`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: true, // optional
};

const screenWidth = Dimensions.get('window').width;

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
        //console.log(v);
        this.setState({type: v});
      });
    });
  }

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

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
            {showProfile === true ? (
              <View styleName="vertical md-gutter" style={styles.filtercont}>
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
                      color: '#555',
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

                <TouchableWithoutFeedback
                  onPress={() => {
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
                          Pref.setVal(Pref.loggedStatus, false);
                          NavigationActions.navigate('IntroScreen');
                        },
                      },
                    ]);
                  }}>
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
            ) : null}
          </>
        }
        body={
          <TouchableWithoutFeedback
            onPress={() => this.setState({showProfile: false})}>
            <View>
              <LeftHeaders
                profile={() => this.setState({showProfile: !showProfile})}
                backClicked={() => NavigationActions.openDrawer()}
                title={`Hi,`}
              />
              <CardVertical
                url={''}
                title={''}
                subtitle={'Sourcing Chart'}
                subtitleColor={'#292929'}
                innerstyle={{paddingTop: 8}}
                bottom={
                  <View>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        height: 200,
                      }}>
                      <View style={{flex: 0.2}}></View>
                      <View style={{flex: 0.6}}>
                        <PieChart
                          data={data}
                          width={screenWidth}
                          height={200}
                          chartConfig={chartConfig}
                          accessor="population"
                          backgroundColor="transparent"
                          paddingLeft="5"
                          hasLegend={false}
                          //absolute
                        />
                      </View>
                      <View style={{flex: 0.2}}></View>
                    </View>
                    <View
                      styleName="horizontal wrap"
                      style={{
                        flex: 1,
                        flexDirection: 'column',
                        paddingBottom: 6,
                        flexGrow: 1,
                      }}>
                      <View
                        styleName="horizontal"
                        style={{alignSelf: 'center'}}>
                        <Subtitle
                          styleName="v-center h-center"
                          style={{
                            fontSize: 13,
                            fontFamily: 'Rubik',
                            letterSpacing: 1,
                            color: '#292929',
                            fontWeight: '400',
                            alignSelf: 'center',
                          }}>
                          {`Link Sourcing(${`85%`})`}
                        </Subtitle>
                        <View
                          styleName="v-center h-center"
                          style={{
                            backgroundColor: Colors.green500,
                            height: 12,
                            width: 24,
                            alignSelf: 'center',
                            marginStart: 8,
                          }}></View>
                      </View>
                      <View
                        styleName="horizontal"
                        style={{alignSelf: 'center'}}>
                        <Subtitle
                          styleName="v-center h-center"
                          style={{
                            fontSize: 13,
                            fontFamily: 'Rubik',
                            letterSpacing: 1,
                            color: '#292929',
                            fontWeight: '400',
                            alignSelf: 'center',
                          }}>
                          {`Self Sourcing(${`15%`})`}
                        </Subtitle>
                        <View
                          styleName="v-center h-center"
                          style={{
                            backgroundColor: Colors.blue500,
                            height: 12,
                            width: 24,
                            alignSelf: 'center',
                            marginStart: 8,
                          }}></View>
                      </View>
                      <View style={{flex: 0.1}}></View>
                    </View>
                  </View>
                }
              />

              <CardVertical
                url={''}
                title={''}
                subtitle={'Status Chart'}
                subtitleColor={'#292929'}
                innerstyle={{paddingTop: 8}}
                bottom={
                  <View>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        height: 200,
                      }}>
                      <View style={{flex: 0.2}}></View>
                      <View style={{flex: 0.6}}>
                        <PieChart
                          data={data1}
                          width={screenWidth}
                          height={200}
                          chartConfig={chartConfig}
                          accessor="population"
                          backgroundColor="transparent"
                          paddingLeft="5"
                          hasLegend={false}
                          //absolute
                        />
                      </View>
                      <View style={{flex: 0.2}}></View>
                    </View>
                    <View
                      styleName="horizontal wrap"
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        paddingBottom: 6,
                        flexGrow: 1,
                      }}>
                      <View
                        styleName="horizontal"
                        style={{alignSelf: 'center'}}>
                        <Subtitle
                          styleName="v-center h-center"
                          style={{
                            fontSize: 13,
                            fontFamily: 'Rubik',
                            letterSpacing: 1,
                            color: '#292929',
                            fontWeight: '400',
                            alignSelf: 'center',
                          }}>
                          {`Pending Confirmation(${`55%`})`}
                        </Subtitle>
                        <View
                          styleName="v-center h-center"
                          style={{
                            backgroundColor: Colors.green500,
                            height: 12,
                            width: 24,
                            alignSelf: 'center',
                            marginStart: 8,
                          }}></View>
                      </View>
                      <View
                        styleName="horizontal"
                        style={{alignSelf: 'center', marginEnd: 8}}>
                        <Subtitle
                          styleName="v-center h-center"
                          style={{
                            fontSize: 13,
                            fontFamily: 'Rubik',
                            letterSpacing: 1,
                            color: '#292929',
                            fontWeight: '400',
                            alignSelf: 'center',
                          }}>
                          {`Quote Sent(${`25%`})`}
                        </Subtitle>
                        <View
                          styleName="v-center h-center"
                          style={{
                            backgroundColor: Colors.blue500,
                            height: 12,
                            width: 24,
                            alignSelf: 'center',
                            marginStart: 8,
                          }}></View>
                      </View>
                      <View
                        styleName="horizontal"
                        style={{alignSelf: 'center'}}>
                        <Subtitle
                          styleName="v-center h-center"
                          style={{
                            fontSize: 13,
                            fontFamily: 'Rubik',
                            letterSpacing: 1,
                            color: '#292929',
                            fontWeight: '400',
                            alignSelf: 'center',
                          }}>
                          {`Payment Link Sent(${`20%`})`}
                        </Subtitle>
                        <View
                          styleName="v-center h-center"
                          style={{
                            backgroundColor: Colors.blue500,
                            height: 12,
                            width: 24,
                            alignSelf: 'center',
                            marginStart: 8,
                          }}></View>
                      </View>
                    </View>
                  </View>
                }
              />
            </View>
          </TouchableWithoutFeedback>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  filtercont: {
    position: 'absolute',
    zIndex: 99,
    borderColor: '#dbdacd',
    borderWidth: 0.8,
    backgroundColor: Pref.WHITE,
    width: '60%',
    right: sizeWidth(18.5),
    borderRadius: 8,
    top: 24,
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
