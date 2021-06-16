import {ScrollView} from 'react-native';
import {Menu, TouchableRipple, useTheme, Searchbar} from 'react-native-paper';
import React, {forwardRef, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Title, View} from '@shoutem/ui';
import Icon from 'react-native-vector-icons/Feather';
import * as Pref from '../../util/Pref';
import {sizeWidth} from '../../util/Size';
import {FlatList, TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Lodash from 'lodash';
import * as Helper from '../../util/Helper';

class NewDropDown extends React.Component {
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


  openMenu = () => this.setState({visible: true});

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
      filterData = true,
      searchQuery = (v) =>{}
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
              <View style={StyleSheet.flatten([styles.boxstyle, style])}>
                <Title
                  style={StyleSheet.flatten([
                    styles.passText,
                    {
                      fontSize: 14,
                      color: '#555555',
                    },
                    textStyle,
                    displayValue
                      ? {
                          fontWeight: '700',
                          color: '#555555',
                          fontSize: 14,
                          fontFamily: Pref.getFontName(4),
                        }
                      : {},
                  ])}>
                  {this.getTitle()}
                </Title>
                <Icon
                  name={'chevron-down'}
                  size={24}
                  color={'#292929'}
                  style={{
                    padding: 4,
                    alignSelf: 'center',
                  }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        }
        style={{
          maxWidth: width,
          width: width,
          marginTop: height,
        }}>
        {enableSearch ? (
          <Searchbar
            placeholder="Search"
            onChangeText={(v) => {
              if(filterData){
                this.filterData(v);
              }else{
                this.setState({query: v});
                searchQuery(v);
              }
            }}
            value={query}
            elevation={0}
            style={styles.search}
            textContentType={{
              fontSize:13
            }}
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
              <View style={{height: 1, backgroundColor: '#dedede'}} />
            )}
            nestedScrollEnabled
            keyboardShouldPersistTaps={'handled'}
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

export default NewDropDown;

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
    fontSize: 20,
    letterSpacing: 0.5,
    color: Pref.RED,
    fontWeight: '700',
    lineHeight: 36,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingVertical: 16,
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
    height: 56,
    justifyContent: 'space-between',
    borderColor: '#dedede',
    borderWidth: 0.5,
    borderRadius: 4,
  },
  dotContainer: {
    backgroundColor: 'transparent',
  },
  title1: {
    fontSize: 14,
    fontFamily: 'Rubik',
    color: '#555555',
    alignSelf: 'flex-start',
    fontWeight: '500',
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
