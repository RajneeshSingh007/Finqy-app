import React from 'react';
import {
  StyleSheet,
  ScrollView,
  BackHandler,
  TouchableWithoutFeedback,
} from 'react-native';
import {Subtitle, View, Title} from '@shoutem/ui';
import * as Pref from '../../util/Pref';
import {Colors, TextInput, DefaultTheme, RadioButton} from 'react-native-paper';
import {sizeHeight, sizeWidth} from '../../util/Size';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import Lodash from 'lodash';
import {FlatList} from 'react-native-gesture-handler';
import * as Helper from '../../util/Helper';
import AnimatedInputBox from '../component/AnimatedInputBox';

let itemData = null;
let curpos = -1;
let floatCloneList = [
  {
    id: 1,
    name: '',
    gender: '',
    dob: '',
    relation: '',
    showspouse: true,
    showrelation: true,
  },
  {
    id: 2,
    name: '',
    gender: '',
    dob: '',
    relation: '',
    showspouse: false,
    showrelation: true,
  },
  {
    id: 3,
    name: '',
    gender: '',
    dob: '',
    relation: '',
    showspouse: false,
    showrelation: true,
  },
  {
    id: 4,
    name: '',
    gender: '',
    dob: '',
    relation: '',
    showspouse: false,
    showrelation: true,
  },
];

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'transparent',
    accent: 'transparent',
    backgroundColor: Colors.white,
    surface: Colors.white,
  },
};

export default class VectorSpecForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.floaterchange = this.floaterchange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.renderFloatRow = this.renderFloatRow.bind(this);
    this.onFloatDatePicker = this.onFloatDatePicker.bind(this);
    this.onFloatitemChange = this.onFloatitemChange.bind(this);
    this.enableCalendar = this.enableCalendar.bind(this);
    const date = new Date();
    //date.setFullYear(2000, 0, 1);
    const maxDates = new Date();
    maxDates.setFullYear(2000, 0, 1);
    this.state = {
      // currentDate: date,
      // maxDates: maxDates,
      // minDates: date,
      healthFList: [
        {value: '2', name: '2 Member'},
        {value: '3', name: '3 Member'},
        {value: '4', name: '4 Member'},
      ],
      floaterItemList: [],
      showItemCalendar: false,
      sumInsured: '',
      floaters: '',
      relationCd: '',
      coverType: '',
    };
  }

  onChange = (event, selectDate) => {
    if (event.type === 'set') {
      this.setState({showCalendar: false, currentDate: selectDate});
    }
  };

  onFloatitemChange(value, item, type, pos) {
    if (type === 0) {
      item.name = value;
    } else if (type === 1) {
      item.gender = value;
    } else if (type === 2) {
      item.dob = value;
    } else if (type === 3) {
      item.relation = value;
    }
    const {floaterItemList} = this.state;
    floaterItemList[pos] = item;
    this.setState(
      {floaterItemList: floaterItemList, showItemCalendar: false},
      () => {
        this.forceUpdate();
      },
    );
  }

  onFloatDatePicker = (event, selectDate) => {
    if (event.type === 'set') {
      const fullDate = moment(selectDate).format('DD-MM-YYYY');
      this.setState({showItemCalendar: false}, () => {
        this.onFloatitemChange(fullDate, itemData, 2, curpos);
      });
    }
  };

  enableCalendar(item, index) {
    itemData = item;
    curpos = index;
    if (item.gender === '') {
      Helper.showToastMessage('Please, select relation', 6);
    } else {
      let dateArray = [];
      if (item.gender === 'SPSE') {
        dateArray = Helper.maxminDate(18, 60);
      } else {
        dateArray = Helper.maxminDateMonth(3, 25);
      }
      this.setState({
        maxDates: dateArray[0],
        currentDate: dateArray[0],
        minDates: dateArray[1],
        showItemCalendar: true,
      });
    }
  }

  renderFloatRow(item, index) {
    return (
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View>
          {/* <View
            style={{
              marginTop: sizeHeight(2),
              marginBottom: sizeHeight(1),
            }}
            styleName="horizontal">
            <View styleName="vertical" style={{marginStart: sizeWidth(2)}}>
              <Title style={styles.title}> {`Member Details *`}</Title>
            </View>
          </View>
          <View style={styles.line} /> */}
          <AnimatedInputBox
            changecolor
            containerstyle={styles.animatedInputCont}
            placeholder={'First Name'}
            onChangeText={(value) =>
              this.onFloatitemChange(value, item, 0, index)
            }
            value={item.name}
            returnKeyType={'next'}
          />
          <AnimatedInputBox
            changecolor
            containerstyle={styles.animatedInputCont}
            placeholder={'Last Name'}
            onChangeText={(value) =>
              this.onFloatitemChange(value, item, 3, index)
            }
            value={item.relation}
            returnKeyType={'done'}
          />
          {item.showrelation === false ? null : (
            <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                <Title style={styles.title}>{`Select Relation`}</Title>

                <RadioButton.Group
                  onValueChange={(value) =>
                    this.onFloatitemChange(value, item, 1, index)
                  }
                  value={item.gender}>
                  <View styleName="horizontal" style={{marginBottom: 8}}>
                    {item.showspouse === true ? (
                      <View
                        styleName="horizontal"
                        style={{alignSelf: 'center', alignItems: 'center'}}>
                        <RadioButton
                          value="SPSE"
                          style={{alignSelf: 'center'}}
                        />
                        <Title
                          styleName="v-center h-center"
                          style={styles.textopen}>{`Spouse`}</Title>
                      </View>
                    ) : null}
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton value="SONM" style={{alignSelf: 'center'}} />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Son`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton value="UDTR" style={{alignSelf: 'center'}} />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Daughter`}</Title>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </View>
          )}
          <View style={styles.radiocont}>
            <TouchableWithoutFeedback
              onPress={() => this.enableCalendar(item, index)}>
              <View style={styles.dropdownbox}>
                <Title
                  style={[
                    styles.boxsubtitle,
                    {
                      color: item.dob === `` ? `#6d6a57` : `#555555`,
                    },
                  ]}>
                  {item.dob === '' ? `Date of Birth` : item.dob}
                </Title>
                <Icon
                  name={'calendar'}
                  size={24}
                  color={'#6d6a57'}
                  style={styles.downIcon}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </ScrollView>
    );
  }

  floaterchange = (value) => {
    const clone = JSON.parse(JSON.stringify(floatCloneList));
    if (value === `2`) {
      clone.length = 2;
    } else if (value === `3`) {
      clone.length = 3;
    } else {
      clone.length = 4;
    }
    this.setState({
      floaters: value,
      floaterItemList: clone,
    });
  };

  render() {
    const {showHeader = true} = this.props;
    return (
      <View>
        {/* {showHeader ? (
          <View>
            <View
              style={{
                marginTop: sizeHeight(2),
                marginBottom: sizeHeight(1),
              }}
              styleName="horizontal">
              <View styleName="vertical" style={{marginStart: sizeWidth(2)}}>
                <Title style={styles.title}>{`Policy Information`}</Title>
              </View>
            </View>
            <View style={styles.line} />
          </View>
        ) : null} */}

        <View>
          <View style={styles.radiocont}>
            <View
              style={StyleSheet.flatten([
                styles.radiodownbox,
                {
                  height: 100,
                },
              ])}>
              <Title style={styles.title}>{`Sum Insured *`}</Title>
              <RadioButton.Group
                onValueChange={(value) => {
                  //coverType
                  let type = '';
                  if (value === '001' || value == '003') {
                    type = 'INDIVIDUAL';
                  } else {
                    type = 'FAMILYFLOATER';
                  }
                  this.setState({
                    coverType: type,
                    sumInsured: value,
                    floaters: '',
                    relationCd: '',
                    floaterItemList: [],
                  });
                }}
                value={this.state.sumInsured}>
                <View styleName="horizontal" style={{marginBottom: 8}}>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value={'001'} style={{alignSelf: 'center'}} />
                    <Title
                      styleName="v-center h-center"
                      style={styles.textopen}>
                      {`Individual(50K)`}
                    </Title>
                  </View>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value={'003'} style={{alignSelf: 'center'}} />
                    <Title
                      styleName="v-center h-center"
                      style={styles.textopen}>
                      {`Individual(100K)`}
                    </Title>
                  </View>
                </View>
                <View styleName="horizontal" style={{marginBottom: 8}}>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value={'002'} style={{alignSelf: 'center'}} />
                    <Title
                      styleName="v-center h-center"
                      style={styles.textopen}>
                      {`Family Floater(50K)`}
                    </Title>
                  </View>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value={'004'} style={{alignSelf: 'center'}} />
                    <Title
                      styleName="v-center h-center"
                      style={styles.textopen}>
                      {`Family Floater(100K)`}
                    </Title>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
          </View>
        </View>
        {this.state.sumInsured === '001' || this.state.sumInsured === '003' ? (
          <View>
            <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                <Title style={styles.title}>{`Relation *`}</Title>
                <RadioButton.Group
                  onValueChange={(value) => {
                    let clone = JSON.parse(JSON.stringify(floatCloneList));
                    if (value !== `SELF`) {
                      clone[0] = {
                        id: 1,
                        name: '',
                        gender: value,
                        dob: '',
                        relation: '',
                        showspouse: true,
                        showrelation: false,
                      };
                      clone.length = 1;
                    } else {
                      clone = [];
                    }
                    this.setState({relationCd: value, floaterItemList: clone});
                  }}
                  value={this.state.relationCd}>
                  <View styleName="horizontal" style={{marginBottom: 8}}>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value={'SELF'}
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Self`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value={'SPSE'}
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Spouse`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value={'UDTR'}
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Daughter`}</Title>
                    </View>
                    <View
                      styleName="horizontal"
                      style={{alignSelf: 'center', alignItems: 'center'}}>
                      <RadioButton
                        value={'SONM'}
                        style={{alignSelf: 'center'}}
                      />
                      <Title
                        styleName="v-center h-center"
                        style={styles.textopen}>{`Son`}</Title>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </View>
            {this.state.floaterItemList.length > 0 ? (
              <FlatList
                data={this.state.floaterItemList}
                renderItem={({item: item, index}) =>
                  this.renderFloatRow(item, index)
                }
                nestedScrollEnabled
                extraData={this.state}
                keyExtractor={(item) => `${item.id}`}
              />
            ) : null}
          </View>
        ) : this.state.sumInsured === '002' ||
          this.state.sumInsured === '004' ? (
          <View>
            <View style={styles.radiocont}>
              <View style={styles.radiodownbox}>
                <Title style={styles.title}>{`Floater *`}</Title>

                <RadioButton.Group
                  onValueChange={this.floaterchange}
                  value={this.state.floaters}>
                  <View styleName="horizontal" style={{marginBottom: 8}}>
                    {this.state.healthFList.map((e) => (
                      <View styleName="horizontal">
                        <RadioButton
                          value={`${e.value}`}
                          style={{
                            alignSelf: 'center',
                            justifyContent: 'center',
                          }}
                        />
                        <Title
                          styleName="v-center h-center"
                          style={StyleSheet.flatten([
                            styles.textopen,
                            {
                              alignSelf: 'center',
                              justifyContent: 'center',
                            },
                          ])}>{`${e.name}`}</Title>
                      </View>
                    ))}
                  </View>
                </RadioButton.Group>
              </View>
            </View>
            {this.state.floaterItemList.length > 0 ? (
              <FlatList
                data={this.state.floaterItemList}
                renderItem={({item: item, index}) =>
                  this.renderFloatRow(item, index)
                }
                nestedScrollEnabled
                extraData={this.state}
                keyExtractor={(item) => `${item.id}`}
              />
            ) : null}
          </View>
        ) : null}

        {this.state.showItemCalendar ? (
          <DateTimePicker
            value={this.state.currentDate}
            mode={'date'}
            is24Hour={false}
            display={'spinner'}
            onChange={this.onFloatDatePicker}
            maximumDate={this.state.maxDates}
            minimumDate={this.state.minDates}
          />
        ) : null}
      </View>
    );
  }
}

/**
 * styles
 */
const styles = StyleSheet.create({
  radiocont: {
    marginStart: 10,
    marginEnd: 10,
    borderBottomWidth: 1.3,
    borderBottomColor: '#f2f1e6',
    alignContent: 'center',
  },
  animatedInputCont: {
    marginStart: 10,
    marginEnd: 10,
    paddingVertical: 10,
  },
  radiodownbox: {
    flexDirection: 'column',
    height: 56,
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 16,
  },
  line: {
    backgroundColor: Pref.RED,
    height: 1.2,
    marginHorizontal: sizeWidth(3),
    marginTop: 4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Rubik',
    fontFamily: 'bold',
    letterSpacing: 1,
    color: '#767676',
    alignSelf: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#555555',
    lineHeight: 20,
    marginStart: 4,
  },
  inputStyle: {
    height: sizeHeight(7.5),
    backgroundColor: 'white',
    color: '#767676',
    borderBottomColor: Colors.grey300,
    fontFamily: 'Rubik',
    fontSize: 16,
    borderBottomWidth: 0.6,
    fontWeight: '400',
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
  },
  loginButtonStyle: {
    color: 'white',
    paddingVertical: sizeHeight(0.5),
    marginHorizontal: sizeWidth(3),
    marginVertical: sizeHeight(3.5),
    backgroundColor: '#e61e25',
    textAlign: 'center',
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 1,
  },
  dropdownbox: {
    flexDirection: 'row',
    height: 56,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  boxsubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6d6a57',
    lineHeight: 20,
    alignSelf: 'center',
    marginStart: 4,
  },
  bbstyle: {
    fontSize: 16,
    fontFamily: 'Rubik',
    fontWeight: '400',
    color: '#767676',
    lineHeight: 25,
    padding: 4,
    marginHorizontal: 8,
  },
  downIcon: {
    padding: 4,
    alignSelf: 'center',
    marginHorizontal: 1,
  },
  textopen: {
    fontSize: 14,
    fontWeight: '700',
    color: '#555555',
    lineHeight: 20,
    alignSelf: 'center',
    marginStart: 4,
    letterSpacing: 0.5,
  },
});
