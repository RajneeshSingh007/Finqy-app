import React from 'react';
import {
  StyleSheet,
  ScrollView,
  BackHandler,
  TouchableWithoutFeedback,
} from 'react-native';
import {Subtitle, View} from '@shoutem/ui';
import * as Pref from '../../util/Pref';
import {Colors, TextInput, DefaultTheme, RadioButton} from 'react-native-paper';
import {sizeHeight, sizeWidth} from '../../util/Size';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import Lodash from 'lodash';
import {FlatList} from 'react-native-gesture-handler';
import * as Helper from '../../util/Helper';

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
          <View
            style={{
              marginTop: sizeHeight(2),
              marginBottom: sizeHeight(1),
            }}
            styleName="horizontal">
            <View styleName="vertical" style={{marginStart: sizeWidth(2)}}>
              <Subtitle style={styles.title}> {`Member Details *`}</Subtitle>
            </View>
          </View>
          <View style={styles.line} />
          <TextInput
            mode="flat"
            underlineColor="transparent"
            underlineColorAndroid="transparent"
            style={[
              styles.inputStyle,
              //{ marginVertical: sizeHeight(1) },
            ]}
            label={'First Name'}
            placeholder={'Enter first name'}
            onChangeText={(value) =>
              this.onFloatitemChange(value, item, 0, index)
            }
            value={item.name}
            theme={theme}
            returnKeyType={'next'}
          />
          <TextInput
            mode="flat"
            underlineColor="transparent"
            underlineColorAndroid="transparent"
            style={[
              styles.inputStyle,
              //{ marginVertical: sizeHeight(1) },
            ]}
            label={'Last Name'}
            placeholder={'Enter last name'}
            onChangeText={(value) =>
              this.onFloatitemChange(value, item, 3, index)
            }
            value={item.relation}
            theme={theme}
            returnKeyType={'done'}
          />
          {item.showrelation === false ? null : (
            <View
              style={{
                marginStart: 8,
                borderBottomColor: Colors.grey300,
                borderRadius: 2,
                borderBottomWidth: 0.6,
                alignContents: 'center',
              }}>
              <Subtitle style={styles.bbstyle}>{`Select Relation`}</Subtitle>

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
                      <RadioButton value="SPSE" style={{alignSelf: 'center'}} />
                      <Subtitle styleName="v-center h-center">{`Spouse`}</Subtitle>
                    </View>
                  ) : null}
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value="SONM" style={{alignSelf: 'center'}} />
                    <Subtitle styleName="v-center h-center">{`Son`}</Subtitle>
                  </View>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value="UDTR" style={{alignSelf: 'center'}} />
                    <Subtitle styleName="v-center h-center">{`Daughter`}</Subtitle>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
          )}
          <View
            style={{
              marginHorizontal: sizeWidth(3),
            }}>
            <TouchableWithoutFeedback
              onPress={() => this.enableCalendar(item, index)}>
              <View style={styles.dropdownbox}>
                <Subtitle
                  style={[
                    styles.boxsubtitle,
                    {
                      color: item.dob === `` ? `#767676` : `#292929`,
                    },
                  ]}>
                  {item.dob === '' ? `Date of Birth` : item.dob}
                </Subtitle>
                <Icon
                  name={'calendar'}
                  size={24}
                  color={'#767676'}
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
        {showHeader ? (
          <View>
            <View
              style={{
                marginTop: sizeHeight(2),
                marginBottom: sizeHeight(1),
              }}
              styleName="horizontal">
              {/* <Icons name={'npm'} size={24} style={{ color: '#e21226', padding: 4, alignSelf: 'center', marginStart: sizeWidth(1) }} /> */}
              <View styleName="vertical" style={{marginStart: sizeWidth(2)}}>
                <Subtitle style={styles.title}>{`Policy Information`}</Subtitle>
              </View>
            </View>
            <View style={styles.line} />
          </View>
        ) : null}

        <View>
          <View
            style={{
              marginStart: 8,
              marginVertical: sizeHeight(0.5),
              alignContents: 'center',
              borderBottomColor: Colors.grey300,
              borderRadius: 2,
              borderBottomWidth: 0.6,
            }}>
            <Subtitle style={styles.bbstyle}>{`Sum Insured *`}</Subtitle>
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
                  <Subtitle styleName="v-center h-center">
                    {`Individual(50K)`}
                  </Subtitle>
                </View>
                <View
                  styleName="horizontal"
                  style={{alignSelf: 'center', alignItems: 'center'}}>
                  <RadioButton value={'003'} style={{alignSelf: 'center'}} />
                  <Subtitle styleName="v-center h-center">
                    {`Individual(100K)`}
                  </Subtitle>
                </View>
              </View>
              <View styleName="horizontal" style={{marginBottom: 8}}>
                <View
                  styleName="horizontal"
                  style={{alignSelf: 'center', alignItems: 'center'}}>
                  <RadioButton value={'002'} style={{alignSelf: 'center'}} />
                  <Subtitle styleName="v-center h-center">
                    {`Family Floater(50K)`}
                  </Subtitle>
                </View>
                <View
                  styleName="horizontal"
                  style={{alignSelf: 'center', alignItems: 'center'}}>
                  <RadioButton value={'004'} style={{alignSelf: 'center'}} />
                  <Subtitle styleName="v-center h-center">
                    {`Family Floater(100K)`}
                  </Subtitle>
                </View>
              </View>
            </RadioButton.Group>
          </View>
        </View>
        {this.state.sumInsured === '001' || this.state.sumInsured === '003' ? (
          <View>
            <View
              style={{
                marginStart: 8,
                marginVertical: sizeHeight(0.5),
                alignContents: 'center',
                borderBottomColor: Colors.grey300,
                borderRadius: 2,
                borderBottomWidth: 0.6,
              }}>
              <Subtitle style={styles.bbstyle}>{`Relation *`}</Subtitle>
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
                    <RadioButton value={'SELF'} style={{alignSelf: 'center'}} />
                    <Subtitle styleName="v-center h-center">{`Self`}</Subtitle>
                  </View>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value={'SPSE'} style={{alignSelf: 'center'}} />
                    <Subtitle styleName="v-center h-center">{`Spouse`}</Subtitle>
                  </View>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value={'UDTR'} style={{alignSelf: 'center'}} />
                    <Subtitle styleName="v-center h-center">
                      {`Daughter`}
                    </Subtitle>
                  </View>
                  <View
                    styleName="horizontal"
                    style={{alignSelf: 'center', alignItems: 'center'}}>
                    <RadioButton value={'SONM'} style={{alignSelf: 'center'}} />
                    <Subtitle styleName="v-center h-center">{`Son`}</Subtitle>
                  </View>
                </View>
              </RadioButton.Group>
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
            <View
              style={{
                marginStart: 8,
                marginVertical: sizeHeight(0.5),
                alignContents: 'center',
                borderBottomColor: Colors.grey300,
                borderRadius: 2,
                borderBottomWidth: 0.6,
              }}>
              <Subtitle style={styles.bbstyle}>{`Floater *`}</Subtitle>

              <RadioButton.Group
                onValueChange={this.floaterchange}
                value={this.state.floaters}>
                <View styleName="vertical" style={{marginBottom: 8}}>
                  {this.state.healthFList.map((e) => (
                    <View styleName="horizontal">
                      <RadioButton
                        value={`${e.value}`}
                        style={{alignSelf: 'center', justifyContent: 'center'}}
                      />
                      <Subtitle
                        styleName="v-center h-center"
                        style={{
                          alignSelf: 'center',
                          justifyContent: 'center',
                        }}>{`${e.name}`}</Subtitle>
                    </View>
                  ))}
                </View>
              </RadioButton.Group>
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
    fontFamily: 'Rubik',
    fontFamily: 'bold',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
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
    height: 48,
    borderBottomColor: Colors.grey300,
    borderRadius: 2,
    borderBottomWidth: 0.6,
    marginVertical: sizeHeight(1),
    justifyContent: 'space-between',
  },
  boxsubtitle: {
    fontSize: 16,
    fontFamily: 'Rubik',
    fontWeight: '400',
    color: '#767676',
    lineHeight: 25,
    alignSelf: 'center',
    padding: 4,
    alignSelf: 'center',
    marginHorizontal: 8,
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
});
