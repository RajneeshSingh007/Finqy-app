import React from 'react';
import {
  StatusBar,
  StyleSheet,
  ScrollView,
  BackHandler,
  FlatList,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import {
  TouchableOpacity,
  Image,
  Screen,
  Subtitle,
  Title,
  View,
  Heading,
  NavigationBar,
  Text,
  Caption,
  GridView,
  Video,
} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {
  Button,
  Card,
  Colors,
  Snackbar,
  TextInput,
  DataTable,
  Modal,
  Portal,
  Avatar,
  ActivityIndicator,
  Chip,
} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import {SafeAreaView} from 'react-navigation';
import {sizeFont, sizeHeight, sizeWidth} from '../../util/Size';
import PlaceholderLoader from '../../util/PlaceholderLoader';
import Icon from 'react-native-vector-icons/Feather';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Lodash from 'lodash';
import MenuProvider from '../../util/MenuProvider.js';
import CommonScreen from '../common/CommonScreen';
import CardRow from '../common/CommonCard';
import LeftHeaders from '../common/CommonLeftHeader';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import ListError from '../common/ListError';
import IconChooser from '../common/IconChooser';

export default class Blogs extends React.PureComponent {
  constructor(props) {
    super(props);
    this.backClick = this.backClick.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.renderCatItems = this.renderCatItems.bind(this);
    this.state = {
      dataList: [],
      loading: false,
      showCalendar: false,
      dates: '',
      token: '',
      userData: '',
      categoryList: [],
      cloneList: [],
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backClick);
    const {navigation} = this.props;
    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({loading: true});
    });
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.userData, (userData) => {
        this.setState({userData: userData});
        Pref.getVal(Pref.saveToken, (value) => {
          this.setState({token: value}, () => {
            this.fetchData();
          });
        });
      });
    });
  }

  componentWillUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  backClick = () => {
      console.log('data')
    NavigationActions.goBack();
    return true;
  };

  fetchData = () => {
    this.setState({loading: true});
    Helper.networkHelperToken(
      Pref.BlogsUrl,
      Pref.methodGet,
      this.state.token,
      (result) => {
        const {data, response_header} = result;
        const {res_type, message} = response_header;
        if (res_type === `success`) {
          let categoryList = this.state.categoryList;
          categoryList = [];
          categoryList.push({name: `All`, selected: true});
          const catlist = Lodash.map(data, (io) => {
            const {category} = io;
            const find = Lodash.find(
              categoryList,
              (ui) => ui.name === category,
            );
            if (find === undefined) {
              categoryList.push({name: category, selected: false});
            }
            return io;
          });
          this.setState({
            cloneList: catlist,
            dataList: catlist,
            categoryList: categoryList,
            loading: false,
          });
        } else {
          this.setState({loading: false});
        }
      },
      (error) => {
        this.setState({loading: false});
      },
    );
  };

  /**
   *
   * @param {*} item
   * @param {*} index
   */
  renderItems(item, index) {
    // let url = item.category === `newspaper` ? `https://erb.ai/erevbay_admin/blogs/newspaper/${item.img}` : `https://erb.ai/erevbay_admin/${item.img}`;
    // if (url.includes('newspaper')){
    //     url = url.replace('/images', '');
    // }
    let url = `https://erb.ai/erevbay_admin/${item.img}`;
    return (
      <TouchableWithoutFeedback
        onPress={() => NavigationActions.navigate(`BlogDetails`, {item: item})}>
        <View
          styleName="vertical"
          style={{
            marginVertical: sizeHeight(1.3),
            marginStart: 10,
            marginEnd: 8,
          }}>
          <Card elevation={2} style={{borderRadius: 8}}>
            <Card.Cover source={{uri: `${encodeURI(url)}`}} />
            <View
              style={{
                marginVertical: 16,
                marginHorizontal: 12,
              }}>
              <Title
                styleName="v-start h-start"
                numberOfLines={1}
                style={{
                  fontSize: 15,
                  fontFamily: 'Rubik',
                  letterSpacing: 1,
                  color: '#292929',
                  fontWeight: '700',
                }}>{`${item.title}`}</Title>
              <Subtitle
                styleName="v-start h-start"
                numberOfLines={3}
                style={{
                  fontSize: 14,
                  fontFamily: 'Rubik',
                  letterSpacing: 0,
                  color: '#767676',
                  fontWeight: '400',
                }}>{`${item.desc}`}</Subtitle>
            </View>
          </Card>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  chipclick = (item, index) => {
    const {categoryList, cloneList} = this.state;
    const sel = item.selected;
    const ok = Lodash.map(categoryList, (io) => {
      if (io.name === item.name) {
        io.selected = !sel;
      } else {
        io.selected = false;
      }
      return io;
    });
    const clo = JSON.parse(JSON.stringify(cloneList));
    const fil = Lodash.filter(clo, (kok) => kok.category === item.name);
    this.setState({
      categoryList: ok,
      dataList: item.name === `All` ? cloneList : fil,
    });
  };

  renderCatItems(item, index) {
    const name = item.name.replace('_', ' ');
    return (
      <Chip
        selected={false}
        style={{
          backgroundColor: item.selected ? Colors.blueGrey900 : `white`,
          marginHorizontal: 8,
          marginVertical: 4,
          elevation: 2,
        }}
        textStyle={{color: item.selected ? `white` : `black`, fontSize: 14}}
        onPress={() => this.chipclick(item, index)}>{`${
        item.name === `All` ? `    All    ` : Lodash.capitalize(name)
      }`}</Chip>
    );
  }

  render() {
    return (
      <CommonScreen
        title={'Finorbit'}
        loading={this.state.loading}
        enabelWithScroll={false}
        header={
          <LeftHeaders title={'FinNews'} showBack style={{marginBottom: 8}} />
        }
        headerDis={0.15}
        bodyDis={0.85}
        body={
          <>
            {this.state.loading ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  flex: 1,
                }}>
                <ActivityIndicator />
              </View>
            ) : this.state.dataList.length > 0 ? (
              <FlatList
                data={this.state.dataList}
                renderItem={({item, index}) => this.renderItems(item, index)}
                nestedScrollEnabled={true}
                keyExtractor={(item, index) => `${index}`}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={false}
                extraData={this.state}
                ListHeaderComponent={() => (
                  <FlatList
                    horizontal
                    data={this.state.categoryList}
                    style={{marginVertical: 16, marginStart: 8}}
                    renderItem={({item, index}) =>
                      this.renderCatItems(item, index)
                    }
                    nestedScrollEnabled={true}
                    keyExtractor={(item, index) => `${item.name}`}
                    showsVerticalScrollIndicator={true}
                    showsHorizontalScrollIndicator={false}
                    extraData={this.state}
                  />
                )}
              />
            ) : (
              <View
                style={{
                  flex: 0.7,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContents: 'center',
                }}>
                <ListError subtitle={'No Finnews found...'} />
              </View>
            )}
          </>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
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
});
