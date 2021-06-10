import {Menu, Searchbar} from 'react-native-paper';
import React, {} from 'react';
import {StyleSheet} from 'react-native';
import {Title, View} from '@shoutem/ui';
import Icon from 'react-native-vector-icons/Feather';
import * as Pref from '../../../util/Pref';
import {FlatList, TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Lodash from 'lodash';
import * as Helper from '../../../util/Helper';

class DropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
      width: 0,
      displayValue: '',
      visible: false,
      finalList: [],
      cloneList: [],
      query: '',
    };
  }

  componentDidMount() {
    const {list = []} = this.props;
    this.setState({finalList: list, cloneList: list});
  }

  componentWillReceiveProps(props) {
    const {list = []} = props;
    this.setState({finalList: list, cloneList: list});
  }


  openMenu = () => {
    const {list = []} = this.props;
    if(list.length > 0){
      this.setState({visible: true})
    }
  };

  closeMenu = () => this.setState({visible: false});

  onLayout = (event) => {
    const {width, height} = event.nativeEvent.layout;
    this.setState({width: width, height: height});
  };

  filterData = (text) => {
    this.setState({query: text});
    if (text !== '') {
      const {finalList} = this.state;
      const filter = Lodash.filter(finalList, (item) => {
        const {value} = JSON.parse(JSON.stringify(item));
        return String(value)
          .toLowerCase()
          .trim()
          .includes(text.toLowerCase().trim());
      });
      this.setState({finalList: filter});
    } else {
      const {cloneList} = this.state;
      this.setState({finalList: cloneList});
    }
  };

  getTitle = () => {
    const {
      style,
      placeholder = '',
      selectedItem,
      enableSearch = false,
      textStyle,
      value = '',
      starVisible = false,
      truncate = false,
    } = this.props;
    const {visible, finalList, width, height, displayValue, query} = this.state;
    if (Helper.nullStringCheck(value) == false) {
      return truncate
        ? Lodash.truncate(value, {
            separator: '...',
            length: 12,
          })
        : value;
    } else if (Helper.nullStringCheck(displayValue) === false) {
      return displayValue;
    } else if (Helper.nullStringCheck(placeholder) === false) {
      if (starVisible === true) {
        return `${placeholder} *`;
      } else {
        return placeholder;
      }
    } else {
      return '';
    }
    // value != null && value !== ''
    // ?  truncate ?  Lodash.truncate(value,{
    //   separator:'...',
    //   length:12
    // }) : value
    // : placeholder === ''
    // ? displayValue
    // : displayValue !== ''
    // ? displayValue
    // : `${placeholder}${starVisible ? ' *' : ''}`
  };

  render() {
    const {
      style,
      placeholder = '',
      selectedItem,
      enableSearch = false,
      textStyle,
      value = '',
      starVisible = false,
      truncate = false,
    } = this.props;
    const {visible, finalList, width, height, displayValue, query} = this.state;
    return (
      <Menu
        visible={visible}
        onDismiss={this.closeMenu}
        anchor={
          <TouchableWithoutFeedback
            onPress={this.openMenu}
            onLayout={this.onLayout}>
            <View pointerEvents={'none'}>
              <View style={styles.boxstyle}>
                <Title
                  style={styles.passText}>
                  {this.getTitle()}
                </Title>
                <Icon
                  name={'chevron-down'}
                  size={24}
                  color={Pref.RED}
                  style={{
                    padding: 4,
                    alignSelf: 'center',
                    marginEnd:8
                  }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        }
        style={{
          maxWidth: (width-16),
          width: '100%',
          marginTop: (height-10),
          marginStart:8,
          marginEnd:8
        }}>
        {enableSearch ? (
          <Searchbar
            placeholder="Search"
            onChangeText={this.filterData}
            value={query}
            elevation={0}
            style={styles.search}
          />
        ) : null}
        {finalList.length > 0 ? (
          <FlatList
            style={{
              maxHeight: enableSearch ? 300 : 200,
            }}
            data={finalList}
            renderItem={({item: _item, index: _index}) => (
              <TouchableWithoutFeedback
                onPress={() => {
                  this.setState({displayValue: _item.value});
                  selectedItem(_item.value);
                  this.closeMenu();
                }}>
                <View
                  style={{
                    paddingVertical: 4,
                    marginVertical: 4,
                  }}>
                  <Title style={styles.title1}>{_item.value}</Title>
                </View>
              </TouchableWithoutFeedback>
            )}
            ItemSeparatorComponent={() => (
              <View style={{height: 0.5, backgroundColor: '#dedede'}} />
            )}
            //stickyHeaderIndices={enableSearch ? [0] : []}
          />
        ) : enableSearch ? (
          <View
            style={{
              paddingVertical: 4,
              marginVertical: 4,
            }}>
            <Title
              style={StyleSheet.flatten([
                styles.title1,
                {
                  alignSelf: 'center',
                  justifyContent: 'center',
                  paddingVertical: 10,
                },
              ])}>{`No data found...`}</Title>
          </View>
        ) : null}
      </Menu>
    );
  }
}

export default DropDown;

const styles = StyleSheet.create({
  search: {
    elevation: 0,
    //width: '94%',
    borderBottomWidth: 1.3,
    borderBottomColor: '#f2f1e6',
    marginBottom: 8,
  },
  selectCont: {
    borderBottomColor: Pref.RED,
    borderBottomWidth: 1.5,
  },
  passText: {
    color: '#000',
    fontSize: 14,
    lineHeight: 36,
    textAlign: 'left',
    padding: 6,
    ...Platform.select({
      android: {
        textAlignVertical: 'top',
      },
    }),
    fontFamily: Pref.getFontName(4),
    lineHeight:24,
    letterSpacing:0.2
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
  viewBox: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    width: '100%',
    padding: 10,
    alignItems: 'center',
    height: 150,
  },
  boxstyle: {
    flexDirection: 'row',
    height: 46,
    justifyContent: 'space-between',
    borderColor: Pref.RED,
    borderWidth: 1.1,
    borderRadius: 4,
    marginHorizontal:8,
    marginBottom:12,
    marginTop:16
  },
  placeholder: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    fontFamily: Pref.getFontName(5),
    lineHeight:24,
    letterSpacing:0.2
  },
  dotContainer: {
    backgroundColor: 'transparent',
  },
  title1: {
    fontSize: 14,
    fontFamily: Pref.getFontName(0),
    color: '#000',
    alignSelf: 'flex-start',
    marginHorizontal: 8,
    flex: 1,
  },
  loginButtonStyle: {
    color: 'white',
    backgroundColor: Pref.RED,
    textAlign: 'center',
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 0.5,
    borderRadius: 48,
    width: '40%',
    paddingVertical: 4,
    fontWeight: '700',
  },
  btntext: {
    color: 'white',
    fontSize: 16,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
});
