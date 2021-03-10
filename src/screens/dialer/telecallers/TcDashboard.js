import {Title, View} from '@shoutem/ui';
import React from 'react';
import {StyleSheet, ActivityIndicator, Platform} from 'react-native';
import * as Helper from '../../../util/Helper';
import {sizeWidth} from '../../../util/Size';
import LeftHeaders from '../../common/CommonLeftHeader';
import * as Pref from '../../../util/Pref';
import CScreen from '../../component/CScreen';
import Purechart from 'react-native-pure-chart';

export default class TcDashboard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dashboardData: null,
      barData: [
        {x: 'Contactable', y: 0, color: '#87c1fc'},
        {x: 'Non-Contactable', y: 0, color: '#fe8c8c'},
        {x: 'Follow up', y: 0, color: '#ffe251'},
        {x: 'Dialed', y: 0, color: '#77e450'},
      ],
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.saveToken, value => {
        this.setState({token: value});
        this.fetchDashboard(value, '');
      });
    });
  }

  fetchDashboard = token => {
    Pref.getVal(Pref.DIALER_DATA, vl => {
      const {id, tlid, pname} = vl[0].tc;
      const body = JSON.stringify({
        teamid: tlid,
        userid: id,
        tname: pname,
      });
      //console.log('body', body)
      Helper.networkHelperTokenPost(
        Pref.DIALER_TC_DASHBOARD,
        body,
        Pref.methodPost,
        token,
        result => {
          const {barData} = this.state;
          let {data, status} = result;
          if (status) {
            barData[0].y = Number(data.contactable);
            barData[1].y = Number(data.notContactable);
            barData[2].y = Number(data.follwup);
            barData[3].y = Number(data.dialer);
            this.setState({dashboardData: data,barData:barData});
          }
        },
        () => {
          //console.log(error);
        },
      );
    });
  };

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
      <View
        styleName="md-gutter vertical  v-center h-center"
        style={styles.leadcircle}>
        <Title
          style={StyleSheet.flatten([
            styles.passText,
            {
              fontSize: 30,
              lineHeight: 30,
              color: '#0270e3',
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

  render() {
    const {dashboardData} = this.state;
    return (
      <CScreen
        refresh={() => this.fetchDashboard(this.state.token, '')}
        bgColor={Pref.WHITE}
        body={
          <View>
            <LeftHeaders showBack title={'Dashboard'} />

            {dashboardData !== null ? (
              <View
                styleName="md-gutter vertical v-center h-center"
                style={styles.leadercont}>
                {this.renderCircleItem(
                  `${dashboardData.contactable}`,
                  'Contactable',
                  '',
                  () => {},
                  1,
                )}
                {this.renderCircleItem(
                  `${dashboardData.notContactable}`,
                  'Not-Contactable',
                  '',
                  () => {},
                )}
                {this.renderCircleItem(
                  `${dashboardData.follwup}`,
                  'Follow-up',
                  '',
                  () => {},
                )}
                {this.renderCircleItem(
                  `${dashboardData.dialer}`,
                  'Dialed',
                  '',
                  () => {},
                )}

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
    alignItems: 'center',
    alignContent: 'center',
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
