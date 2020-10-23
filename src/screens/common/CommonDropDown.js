import React from 'react';
import {StyleSheet, FlatList, ScrollView} from 'react-native';
import {
  TouchableOpacity,
  Image,
  Screen,
  Subtitle,
  Title,
  View,
} from '@shoutem/ui';
import {
  Button,
  Card,
  Colors,
  Snackbar,
  TextInput,
  DataTable,
  Portal,
  Searchbar,
} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import {sizeFont, sizeHeight, sizeWidth} from '../../util/Size';
import * as Pref from '../../util/Pref';
import Lodash from 'lodash';
import Modal from '../../util/Modal';

class DropDown extends React.PureComponent {
  constructor(props) {
    super(props);
    this.filterData = this.filterData.bind(this);
    const {list, isCityList} = this.props;
    //console.log(list.length);
    //const filter = list;
    // if (isCityList) {
    //   filter.length = 7;
    // }
    this.state = {
      firstQuery: '',
      listItem: list,
      clonItems: list,
      cloneList: Pref.citiesList,
      error: false,
      isCityList: isCityList,
      modalvis: true,
    };
  }

  filterData(text) {
    this.setState({firstQuery: text});
    if (text !== '') {
      if (this.state.isCityList) {
        const fil = this.state.cloneList.filter((ele) => {
          const {value} = ele;
          if (
            value !== undefined &&
            value.toLowerCase().trim().includes(text.toLowerCase().trim())
          ) {
            return ele;
          }
        });
        if (fil !== undefined && fil.length > 0) {
          //   if (fil.length > 7) {
          //     fil.length = 7;
          //   }
          const filter = Lodash.orderBy(fil, ['value'], ['asc']);
          this.setState({listItem: filter, error: false});
        } else {
          this.setState({error: true});
        }
      }
    } else {
      this.setState({listItem: this.state.clonItems, error: false});
    }
  }

  renderItems(item, index) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.itemCallback(item.value);
          this.setState({modalvis: false});
        }}>
        <View style={styles.cardContainer}>
          {item !== undefined && item.value !== undefined ? (
            <Title style={styles.title}> {item.value}</Title>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const {
      enableSearch,
      autoFocus = false,
      isCityList,
      ratioHeight = 0.7,
      title = '',
    } = this.props;
    return (
      <Modal
        visible={this.state.modalvis}
        setModalVisible={() => this.setState({modalvis: false})}
        ratioHeight={ratioHeight}
        backgroundColor={`white`}
        topCenterElement={
          <Title style={styles.heading}>
            {isCityList ? `Select Location` : `${title}`}
          </Title>
        }
        children={
        
        <View style={styles.continr}>
            {enableSearch ? (
              <Searchbar
                placeholder="Search"
                onChangeText={(text) => this.filterData(text)}
                value={this.state.firstQuery}
                elevation={0}
                style={styles.search}
              />
            ) : null}
            {!this.state.error &&
            this.state.listItem !== undefined &&
            this.state.listItem.length > 0 ? (
              <FlatList
                data={this.state.listItem}
                renderItem={({item, index}) => this.renderItems(item, index)}
                keyExtractor={(item, index) => `${index}`}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => {
                  return <View style={styles.line} />;
                }}
              />
            ) : (
              <Title styleName="v-center h-center sm-gutter" style={StyleSheet.flatten([styles.heading, {
                fontSize:14,
                color:'#555'
              }])}>{'No data found...'}</Title>
            )}
          </View>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  search: {
    elevation: 0,
    width: '94%',
    borderBottomWidth: 1.3,
    borderBottomColor: '#f2f1e6',
    marginBottom: 8,
  },
  continr: {
    flex: 1,
    width: '100%',
    height: '100%',
    marginStart: 16,
    marginEnd: 16,
  },
  heading: {
    color: '#6d6a57',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  card: {
    flex: 1,
    marginVertical: -sizeHeight(1),
    paddingBottom: sizeHeight(0),
    paddingHorizontal: sizeWidth(1),
  },
  cardLeft: {
    flexWrap: 'wrap',
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 0.7,
  },
  cardRight: {
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 0.3,
    marginStart: 4,
  },
  cardContainer: {
    marginVertical: sizeHeight(1.5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: sizeWidth(1.5),
    flex: 1,
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
    fontSize: 15,
    letterSpacing: 0.5,
    color: '#555',
    alignSelf: 'flex-start',
    fontWeight: '700',
    paddingVertical:4
  },
  line: {
    marginHorizontal: sizeWidth(1.5),
    height: 0.6,
    backgroundColor: '#f2f1e6',
  },
});

export default DropDown;
