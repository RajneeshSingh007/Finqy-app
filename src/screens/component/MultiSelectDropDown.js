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
import MultiSelectList from './MultiSelectList';

class MultiSelectDropDown extends React.Component {
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
    // //console.log('list', list)
    this.setState({finalList: list, cloneList: list});
  }

  openMenu = () => this.setState({visible: true});

  closeMenu = () => {
    const {closedMenu = data => {}} = this.props;
    closedMenu(this.state.finalList);
    this.setState({visible: false});
  };

  onLayout = event => {
    const {width, height} = event.nativeEvent.layout;
    this.setState({width: width, height: height});
  };

  filterData = text => {
    this.setState({query: text});
    if (text !== '') {
      const {finalList} = this.state;
      const filter = Lodash.filter(finalList, item => {
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

  render() {
    const {
      style,
      placeholder = '',
      selectedItem,
      enableSearch = false,
      textStyle,
      value = '',
      starVisible = false,
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
                  {value != null && value !== ''
                    ? Lodash.truncate(value, {
                        separator: '...',
                        length: 40,
                      })
                    : placeholder === ''
                    ? displayValue
                    : displayValue !== ''
                    ? Lodash.truncate(displayValue, {
                        separator: '...',
                        length: 40,
                      })
                    : `${placeholder}${starVisible ? ' *' : ''}`}
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
            onChangeText={this.filterData}
            value={query}
            elevation={0}
            style={styles.search}
          />
        ) : null}
        {finalList && finalList.length > 0 ? (
          <MultiSelectList
            dataList={finalList}
            style={{
              maxHeight: enableSearch ? 300 : 200,
            }}
            checkedItem={data => {
              const getAllText = Lodash.filter(data, io => {
                if (io.checked === 'checked') {
                  return io.value;
                }
              });
              let updateValue = ``;
              if (getAllText.length > 0) {
                Lodash.map(getAllText, io => {
                  updateValue += `${io.value},`;
                });
                updateValue = updateValue.slice(0, updateValue.length - 1);
              }
              this.setState({displayValue: updateValue});
            }}
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

export default MultiSelectDropDown;

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
    flexShrink: 1,
  },
  dotContainer: {
    backgroundColor: 'transparent',
  },
  title1: {
    fontSize: 15,
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
