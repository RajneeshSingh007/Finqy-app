import React from 'react';
import {StyleSheet} from 'react-native';
import {Title, View} from '@shoutem/ui';
import * as Pref from '../../util/Pref';
import LeftHeaders from '../common/CommonLeftHeader';
import CScreen from '../component/CScreen';
import {ActivityIndicator} from 'react-native-paper';
import ListError from '../common/ListError';
import CommonTable from '../common/CommonTable';
import * as Helper from '../../util/Helper';

export default class PayoutForm extends React.PureComponent {
  constructor(props) {
    super(props);
    //this.backClick = this.backClick.bind(this);
    this.state = {
      dataList: [],
      exDataList: [],
      loading: true,
      selectedText: '',
      tableHead: [],
      exTableHead: [],
      widthArr: [],
      exWidthArr: [],
      tc: '',
      length: -1,
      pleaseNote: null,
    };
  }

  componentDidMount() {
    //BackHandler.addEventListener('hardwareBackPress', this.backClick);
    const {navigation} = this.props;
    const title = navigation.getParam('title', '');
    const data = navigation.getParam('data', null);
    const length = navigation.getParam('length', -1);
    const tc = navigation.getParam('tc', '');
    const head = navigation.getParam('head', []);
    const pleaseNote = navigation.getParam('pn', null);
    const exData = navigation.getParam('ex', null);
    const width = navigation.getParam('width', []);
    //console.log('exData', data)

    this.focusListener = navigation.addListener('didFocus', () => {
      let widthArr = [],
        exWidthArr = [];
      if (Helper.nullCheck(width) === false && width.length > 0) {
        widthArr = width;
        // if (head.length === 5) {
        //     widthArr = [60, 80, 300, 300, 120];
        // } else if (head.length === 3) {
        //     widthArr = [60, 500, 120];
        // } else if (head.length === 4) {
        //     widthArr = [60, 300, 120, 120];
        // }
      }
      let dataList = [],
        exDataList = [];
      if (length && length > 0) {
        for (let index = 1; index <= length; index++) {
          const element = data[index];
          dataList.push(element);
        }
      }

      if (Helper.nullCheck(exData) === false) {
        if (
          Helper.nullCheck(exData.width) === false &&
          exData.width.length > 0
        ) {
          exWidthArr = exData.width;
        }
        if (Helper.nullCheck(exData.length) === false && length > 0) {
          if (Helper.nullCheck(exData.data) === false) {
            exDataList = exData.data;
          }
        }
      }

      this.setState({
        loading: false,
        tc: tc,
        length: length,
        title: title,
        tableHead: head,
        widthArr: widthArr,
        dataList: dataList,
        pleaseNote: pleaseNote,
        exWidthArr: exWidthArr,
        exDataList: exDataList,
        exTableHead:
          Helper.nullCheck(exData) === false &&
          Helper.nullCheck(exData.head) === false
            ? exData.head
            : [],
      });
    });
  }

  componentWillUnMount() {
    //BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  // backClick = () => {
  //   NavigationActions.goBack();
  //   return true;
  // };

  render() {
    const {title, tc} = this.state;
    const split =
      title && title !== ''
        ? title.includes(' ')
          ? title.split(' ')
          : [title]
        : [''];
    return (
      <CScreen
        body={
          <>
            <LeftHeaders
              title={'Payout Structure'}
              showBack
              bottomtext={
                <>
                  {`${split[0]} ${
                    split.length === 4
                      ? split[1]
                      : split.length === 3
                      ? split[1]
                      : ''
                  }`}
                  {split.length === 2 ? (
                    <Title style={styles.passText}>{`${split[1]}`}</Title>
                  ) : split.length === 3 ? (
                    <Title style={styles.passText}>{` ${split[2]}`}</Title>
                  ) : split.length === 4 ? (
                    <Title
                      style={
                        styles.passText
                      }>{` ${split[2]} ${split[3]}`}</Title>
                  ) : null}
                </>
              }
              bottomtextStyle={{
                color: '#555555',
                fontSize: 20,
              }}
            />
            {this.state.loading ? (
              <View style={styles.loader}>
                <ActivityIndicator />
              </View>
            ) : this.state.dataList.length > 0 ? (
              <>
                <CommonTable
                  dataList={this.state.dataList}
                  widthArr={this.state.widthArr}
                  tableHead={this.state.tableHead}
                  headerTextStyle={{
                    textAlign: 'left',
                  }}
                  textStyle={{
                    textAlign: 'left',
                    marginStart: 8,
                    marginEnd: 8,
                  }}
                  enableHeight={false}
                />
                <View style={{marginTop: 4}}></View>
                {this.state.exDataList.length > 0 ? (
                  <CommonTable
                    dataList={this.state.exDataList}
                    widthArr={this.state.exWidthArr}
                    tableHead={this.state.exTableHead}
                    headerTextStyle={{
                      textAlign: 'left',
                    }}
                    textStyle={{
                      textAlign: 'left',
                      marginStart: 8,
                      marginEnd: 8,
                    }}
                    enableHeight={false}
                  />
                ) : null}
                {Helper.nullStringCheck(this.state.pleaseNote) === false ? (
                  <View styleName="vertical v-start h-start sm-gutter">
                    <Title
                      style={StyleSheet.flatten([
                        styles.passText,
                        {
                          marginTop: 16,
                          paddingVertical: 0,
                          fontSize: 15,
                          textAlign: 'left',
                          alignSelf: 'flex-start',
                          justifyContent: 'center',
                          textAlign: 'center',
                          marginHorizontal: 16,
                          marginBottom: 8,
                        },
                      ])}>
                      {`Please Note`}
                    </Title>
                    <Title
                      style={StyleSheet.flatten([
                        styles.passText,
                        {
                          color: '#686868',
                          paddingVertical: 0,
                          marginHorizontal: 16,
                          fontSize: 13,
                          textAlign: 'left',
                          marginBottom: 0,
                          lineHeight: 28,
                          fontWeight: '600',
                          fontFamily: Pref.getFontName(1),
                        },
                      ])}>
                      {this.state.pleaseNote}
                    </Title>
                  </View>
                ) : null}
                <View styleName="vertical v-start h-start sm-gutter">
                  <Title
                    style={StyleSheet.flatten([
                      styles.passText,
                      {
                        marginTop: 16,
                        paddingVertical: 0,
                        fontSize: 15,
                        textAlign: 'left',
                        alignSelf: 'flex-start',
                        justifyContent: 'center',
                        textAlign: 'center',
                        marginHorizontal: 16,
                        marginBottom: 8,
                      },
                    ])}>
                    {`Terms & Condition`}
                  </Title>
                  <Title
                    style={StyleSheet.flatten([
                      styles.passText,
                      {
                        color: '#686868',
                        paddingVertical: 0,
                        marginHorizontal: 16,
                        fontSize: 13,
                        textAlign: 'left',
                        marginBottom: 0,
                        lineHeight: 28,
                        fontWeight: '600',
                        fontFamily: Pref.getFontName(1),
                      },
                    ])}>
                    {tc}
                  </Title>
                </View>
              </>
            ) : (
              <View style={styles.emptycont}>
                <ListError subtitle={'No Data Found...'} />
              </View>
            )}
          </>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  sideItem: {
    color: '#6e6852',
    fontWeight: '400',
    fontSize: 14,
    alignSelf: 'center',
    justifyContent: 'center',
    letterSpacing: 0.5,
  },
  dummy: {flex: 0.2},
  mainconx: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemcont: {
    backgroundColor: '#f9f8f1',
    borderColor: '#bbbbba',
    borderWidth: 1,
    borderRadius: 56,
    marginVertical: 10,
    paddingVertical: 12,
    flex: 0.6,
  },
  divider: {
    backgroundColor: '#dedede',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  itemContainer: {
    marginVertical: 10,
    borderColor: '#bcbaa1',
    borderWidth: 0.8,
    borderRadius: 16,
    marginHorizontal: 16,
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
    fontSize: 20,
    letterSpacing: 0.5,
    color: Pref.RED,
    fontWeight: '700',
    lineHeight: 36,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingVertical: 16,
    marginBottom: 12,
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
  itemtext: {
    letterSpacing: 0.5,
    fontWeight: '700',
    lineHeight: 20,
    // alignSelf: 'center',
    // justifyContent: 'center',
    // textAlign: 'center',
    color: '#686868',
    fontSize: 16,
    marginStart: 16,
    marginEnd: 16,
  },
  itemtext1: {
    letterSpacing: 0.5,
    fontWeight: '700',
    lineHeight: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#97948c',
    fontSize: 16,
  },
  circle: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 4,
    borderRadius: 36 / 2,
  },
});
