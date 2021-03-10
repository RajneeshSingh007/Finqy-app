import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  BackHandler,
  Text,
} from 'react-native';
import {Title, View, Subtitle} from '@shoutem/ui';
import * as Pref from '../../util/Pref';
import LeftHeaders from '../common/CommonLeftHeader';
import CScreen from '../component/CScreen';
import {ActivityIndicator, Button} from 'react-native-paper';
import ListError from '../common/ListError';
import CommonTable from '../common/CommonTable';
import * as Helper from '../../util/Helper';
import IconChooser from '../common/IconChooser';
import NavigationActions from '../../util/NavigationActions';
import Modal from '../../util/Modal';
import CustomForm from './../finorbit/CustomForm';
import {sizeHeight, sizeWidth} from '../../util/Size';
import Lodash from 'lodash';

const editStyle = {
  flexDirection: 'row',
  alignSelf: 'center',
  alignItems: 'center',
  justifyContent: 'center',
};

export default class PayoutUpdate extends React.PureComponent {
  constructor(props) {
    super(props);
    this.backClick = this.backClick.bind(this);
    this.updatePayoutPerRow = this.updatePayoutPerRow.bind(this);
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
      refercode: null,
      payout: null,
      title: null,
      showModal: false,
      payoutValue: '',
      payoutPort: '',
      currentRowPos: -1,
      selectedRowData: [],
      ogValue: '',
      ogPortValue: '',
    };
  }

  editrow = (data, position, title) => {
    let lastitem = '';
    //console.log('lastitem', lastitem);
    const parse = Helper.lowercaseWithDashWord(title);
    let payoutport = '';
    if (parse === 'health_insurance') {
      lastitem = data[data.length - 3];
      payoutport = data[data.length - 2];
    } else {
      lastitem = data[data.length - 2];
    }
    if(lastitem !== ''){
      lastitem = lastitem.replace(/\%/g, '');
    }
    if(payoutport !== ''){
      payoutport = payoutport.replace(/\%/g, '');
    }
    this.setState({
      currentRowPos: position,
      ogValue: lastitem,
      ogPortValue: payoutport,
      selectedRowData: data,
      payoutValue: lastitem,
      payoutPort: payoutport,
      showModal: true,
    });
  };

  editableItem = (element, position, title) => {
    return (
      <View style={editStyle}>
        <TouchableWithoutFeedback
          onPress={() => this.editrow(element, position, title)}>
          <View>
            <IconChooser name={`edit-2`} size={20} color={`#9f9880`} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backClick);
    const {navigation} = this.props;
    const title = navigation.getParam('title', '');
    const data = navigation.getParam('data', null);
    const length = navigation.getParam('length', -1);
    const tc = navigation.getParam('tc', '');
    const head = navigation.getParam('head', []);
    const pleaseNote = navigation.getParam('pn', null);
    const exData = navigation.getParam('ex', null);
    const width = navigation.getParam('width', []);
    const editable = navigation.getParam('editable', false);
    const refercode = navigation.getParam('refercode', null);
    const payout = navigation.getParam('payout', null);

    //console.log('payout', payout);

    //console.log('title', title.toLowerCase().replace(/\s/g, '_'));

    this.focusListener = navigation.addListener('didFocus', () => {
      let widthArr = [],
        exWidthArr = [];
      if (Helper.nullCheck(width) === false && width.length > 0) {
        widthArr = width;
        if (editable) {
          widthArr.push(40);
        }
      }
      if (editable && head.length > 0) {
        head.push('Edit');
      }
      let dataList = [],
        exDataList = [];
      if (length && length > 0) {
        for (let index = 1; index <= length; index++) {
          const element = data[index];
          if (editable) {
            element.push(this.editableItem(element, index, title));
          }
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

      //console.log('payout', payout);

      this.setState({
        payout: payout,
        refercode: refercode,
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
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  backClick = () => {
    NavigationActions.navigate('PayinProducts', {
      screenName: 'PayoutUpdate',
      showUpdateButton: true,
    });
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    return true;
  };

  updatePayoutPerRow = () => {
    const {payoutValue, title, payoutPort} = this.state;
    if (Number(payoutValue) <= 0) {
      alert('Please, Enter value greater than zero');
    } else if (Helper.lowercaseWithDashWord(title) === 'health_insurance' && Number(payoutPort) <= 0) {
      alert('Please, Enter value greater than zero');
    } else {
      this.setState({showModal:false}, () =>{
        this.updateData();
      })
    }
  };

  updateData = () => {
    const {
      payoutValue,
      currentRowPos,
      selectedRowData,
      title,
      refercode,
      payout,
      ogValue,
      dataList,
      ogPortValue,
      payoutPort,
    } = this.state;
    const parsetitle = Helper.lowercaseWithDashWord(title);
    let finalvalue = payoutValue === '' ? ogValue : payoutValue;
    let finalPort = payoutPort === '' ? ogPortValue : payoutPort;
    if (parsetitle === 'health_insurance') {
      selectedRowData[selectedRowData.length - 3] = finalvalue;
      selectedRowData[selectedRowData.length - 2] = finalPort;
    } else {
      selectedRowData[selectedRowData.length - 2] = finalvalue;
    }

    //console.log('currentRowPos', currentRowPos,dataList);

    dataList[currentRowPos - 1] = selectedRowData;

    const filterOnlyDatas1 = this.filterPayoutDatas(dataList);
    payout[parsetitle].data = filterOnlyDatas1;
    payout.refercode = refercode;

    //console.log('filterOnlyDatas',filterOnlyDatas1);
    
    //save payout data
    Pref.getVal(Pref.salespayoutUpdate, vlpayout =>{
      if(Helper.nullCheck(vlpayout) === false){
        //console.log('vlpayoutolder', filterOnlyDatas1);
        vlpayout[parsetitle].data = filterOnlyDatas1;
        vlpayout.refercode = refercode;
        Pref.setVal(Pref.salespayoutUpdate, vlpayout);
        //console.log('vlpayout', vlpayout);
      }else{
        Pref.setVal(Pref.salespayoutUpdate, payout);
      }
      //console.log('payout', payout);
    });

    this.setState({
      dataList: dataList,
      showModal: false,
      currentRowPos: -1,
      payoutValue: '',
      ogValue: '',
      ogPortValue: '',
      payoutPort: '',
      selectedRowData: [],
    });
  };

  filterPayoutDatas = (dataList) =>{
    const resultList = Lodash.map(dataList, io => {
      const filterReactElement = Lodash.filter(io, it => {
        if (React.isValidElement(it) === false) {
          return io;
        }
      });
      let result = '';
      filterReactElement.map(item =>{
        result+=`${item}#`;
      })
      return result;
    });
    return resultList;
  }

  render() {
    const {title, tc, payoutPort} = this.state;
    const split =
      title && title !== ''
        ? title.includes(' ')
          ? title.split(' ')
          : [title]
        : [''];
    return (
      <CScreen
        absolute={
          <>
            <Modal
              visible={this.state.showModal}
              setModalVisible={() =>
                this.setState({
                  showModal: false,
                  currentRowPos: -1,
                  selectedRowData: [],
                })
              }
              ratioHeight={0.6}
              backgroundColor={`white`}
              topCenterElement={
                <Subtitle
                  style={{
                    color: '#292929',
                    fontSize: 17,
                    fontWeight: '700',
                    letterSpacing: 1,
                  }}>
                  {`Payout Update`}
                </Subtitle>
              }
              topRightElement={null}
              children={
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'white',
                  }}>
                  <CustomForm
                    label={`Payout *`}
                    placeholder={`Enter your value`}
                    value={this.state.payoutValue}
                    onChange={value => {
                      if (String(value).match(/^[0-9]*$/g) !== null) {
                        this.setState({payoutValue: value});
                      }
                    }}
                    keyboardType={'numeric'}
                    style={{
                      marginHorizontal: 12,
                      marginVertical: payoutPort !== '' ? 8 : 16,
                    }}
                  />
                  {payoutPort !== '' ? (
                    <CustomForm
                      label={`Payout Port *`}
                      placeholder={`Enter your value`}
                      value={this.state.payoutPort}
                      onChange={value => {
                        if (String(value).match(/^[0-9]*$/g) !== null) {
                          this.setState({payoutPort: value});
                        }
                      }}
                      keyboardType={'numeric'}
                      style={{marginHorizontal: 12, marginVertical: 2}}
                    />
                  ) : null}

                  <Button
                    mode={'flat'}
                    uppercase={true}
                    dark={true}
                    loading={false}
                    style={[styles.button]}
                    onPress={this.updatePayoutPerRow}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 16,
                        letterSpacing: 1,
                      }}>
                      {`Submit`}
                    </Text>
                  </Button>
                </View>
              }
            />
          </>
        }
        body={
          <>
            <LeftHeaders
              title={'Payout'}
              backClicked={() => {
                NavigationActions.navigate('PayinProducts', {
                  screenName: 'PayoutUpdate',
                  showUpdateButton: true,
                });
              }}
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
  button: {
    color: 'white',
    paddingVertical: sizeHeight(0.5),
    marginTop: 24,
    marginHorizontal: 24,
    backgroundColor: Pref.RED,
    textAlign: 'center',
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 1,
  },
});
