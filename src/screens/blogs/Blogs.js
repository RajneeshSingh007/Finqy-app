import React from 'react';
import {
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  BackHandler,
  Platform,
  Linking,
} from 'react-native';
import {Image, Title, View} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {Colors, ActivityIndicator, Chip} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import Lodash from 'lodash';
import LeftHeaders from '../common/CommonLeftHeader';
import ListError from '../common/ListError';
import CScreen from '../component/CScreen';
import analytics from '@react-native-firebase/analytics';

export default class Blogs extends React.PureComponent {
  constructor(props) {
    super(props);
    //this.headerFlatListRef = React.createRef();
    this.back = this.back.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.renderCatItems = this.renderCatItems.bind(this);
    this.state = {
      dataList: [],
      loading: true,
      showCalendar: false,
      dates: '',
      token: '',
      userData: '',
      categoryList: [],
      cloneList: [],
      selected: 'All',
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.back);
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

  back = () => {
    NavigationActions.goBack();
    return true;
  };

  componentWillUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.back);
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  fetchData = () => {
    this.setState({loading: true});
    Helper.networkHelperToken(
      Pref.BlogsUrl,
      Pref.methodGet,
      this.state.token,
      (result) => {
        const {data, response_header} = result;
        const {res_type} = response_header;
        if (res_type === `success`) {
          let categoryList = [];
          categoryList.push('All');
          const catlist = Lodash.map(data, (io) => {
            const {category} = io;
            const find = Lodash.find(
              categoryList,
              (ui) =>
                String(ui.name).toLowerCase() ===
                String(category).toLowerCase(),
            );
            if (find === undefined) {
              categoryList.push(category);
            }
            return io;
          });
          this.setState({
            cloneList: catlist,
            dataList: catlist,
            categoryList: Lodash.uniq(categoryList),
            loading: false,
          });
        } else {
          this.setState({loading: false});
        }
      },
      (e) => {
        this.setState({loading: false});
      },
    );
  };

  /**
   *
   * @param {*} item
   * @param {*} index
   */
  renderItems(item) {
    // let url = item.category === `newspaper` ? `https://erb.ai/erevbay_admin/blogs/newspaper/${item.img}` : `https://erb.ai/erevbay_admin/${item.img}`;
    // if (url.includes('newspaper')){
    //     url = url.replace('/images', '');
    // }
    let url = `${Pref.MainUrl}/erevbay_admin/${item.img}`;
    return (
      <View styleName="md-gutter">
        <TouchableWithoutFeedback
          onPress={() => {
            //if (item.post.includes('https') || item.post.includes('http')) {
              Linking.openURL(item.post);
            //} else {
              //NavigationActions.navigate(`BlogDetails`, {item: item});
            //}
          }}>
          <View styleName="vertical" style={styles.itemContainer}>
            <Image
              source={{uri: `${encodeURI(url)}`}}
              styleName="large"
              style={styles.itemimage}
            />
            <Title
              styleName="v-start h-start"
              numberOfLines={1}
              style={styles.itemtext}>{`${item.title}`}</Title>
            <Title
              styleName="v-start h-start"
              numberOfLines={3}
              style={styles.itemdesc}>{`${item.desc}`}</Title>
            <Title
              styleName="v-start h-start"
              style={styles.readmore}>{`Read More >>`}</Title>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  /**
   * chip click
   * @param {*} catName
   */
  chipclick = (catName, index) => {
    const {cloneList} = this.state;
    const filter = Lodash.filter(
      cloneList,
      (item) =>
        String(item.category).toLowerCase() === String(catName).toLowerCase(),
    );
    this.setState({
      dataList: catName === `All` ? cloneList : filter,
      selected: catName,
    });
    // if(this.headerFlatListRef && this.headerFlatListRef.current){
    //   if(this.headerFlatListRef.current.scrollToIndex){
    //     this.headerFlatListRef.current.scrollToIndex({animated:true,index:index})
    //   }
    // }
  };

  renderCatItems(item, index) {
    return (
      <Chip
        selected={false}
        style={[
          styles.chipcontainer,
          {
            backgroundColor:
              this.state.selected === item ? Colors.blueGrey900 : `white`,
          },
        ]}
        textStyle={{
          color: this.state.selected === item ? `white` : `black`,
          fontSize: 14,
        }}
        onPress={() => this.chipclick(item, index)}>
        {item === 'All' ? '  All  ' : Helper.replacetext(item)}
      </Chip>
    );
  }

  render() {
    return (
      <CScreen
        refresh={() => this.fetchData()}
        body={
          <>
            <LeftHeaders
              showBack
              title={'FinNews'}
              // bottomtext={
              //   <>
              //     {`Fin`}
              //     <Title style={styles.passText}>{`News`}</Title>
              //   </>
              // }
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
              <FlatList
                data={this.state.dataList}
                renderItem={({item, index}) => this.renderItems(item)}
                nestedScrollEnabled={true}
                keyExtractor={(item, index) => `${index}`}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={false}
                extraData={this.state}
                ListHeaderComponent={() => (
                  <FlatList
                    //ref={this.headerFlatListRef}
                    horizontal
                    data={this.state.categoryList}
                    style={{marginVertical: 16, marginStart: 8}}
                    renderItem={({item, index}) =>
                      this.renderCatItems(item, index)
                    }
                    nestedScrollEnabled={true}
                    keyExtractor={(item) => `${item.name}`}
                    showsVerticalScrollIndicator={true}
                    showsHorizontalScrollIndicator={false}
                    extraData={this.state}
                  />
                )}
              />
            ) : (
              <View style={styles.emptycont}>
                <ListError subtitle={'No FinNews found...'} />
              </View>
            )}
          </>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  chipcontainer: {
    marginHorizontal: 8,
    marginVertical: 4,
    ...Platform.select({
      android: {
        elevation: 2,
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
  itemimage: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 8,
    width: '90%',
    height: 200,
    resizeMode: 'contain',
    marginStart: 8,
    marginEnd: 8,
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
  itemContainer: {
    marginVertical: 4,
    borderColor: '#bcbaa1',
    borderWidth: 0.8,
    borderRadius: 16,
    marginHorizontal: 16,
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
  },
  itemtext: {
    letterSpacing: 0.5,
    fontWeight: '700',
    lineHeight: 36,
    // alignSelf: 'center',
    // justifyContent: 'center',
    // textAlign: 'center',
    color: '#686868',
    fontSize: 16,
    marginStart: 16,
    marginEnd: 16,
    marginTop: 2,
  },
  itemdesc: {
    letterSpacing: 0.5,
    fontWeight: '400',
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 4,
    // alignSelf: 'center',
    // justifyContent: 'center',
    // textAlign: 'center',
    color: '#bbb8ac',
    fontSize: 14,
    marginStart: 16,
    marginEnd: 16,
    paddingBottom: 8,
  },
  readmore: {
    letterSpacing: 0.5,
    fontWeight: '400',
    lineHeight: 16,
    // alignSelf: 'center',
    // justifyContent: 'center',
    // textAlign: 'center',
    color: '#0271e4',
    fontSize: 14,
    marginStart: 16,
    marginEnd: 16,
    paddingBottom: 16,
  },
});
