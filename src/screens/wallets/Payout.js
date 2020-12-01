
import React from 'react';
import { StyleSheet, BackHandler, TouchableWithoutFeedback } from 'react-native';
import { Title, View, Image } from '@shoutem/ui';
import * as Pref from '../../util/Pref';
import { Portal } from 'react-native-paper';
import Lodash from 'lodash';
import LeftHeaders from '../common/CommonLeftHeader';
import CScreen from '../component/CScreen';
import IconChooser from '../common/IconChooser';
import PayoutSideBar from '../common/PayoutSideBar';
import * as Helper from '../../util/Helper';
import {
  Button,
  ActivityIndicator,
  Searchbar,
} from 'react-native-paper';

export default class Payout extends React.PureComponent {
  constructor(props) {
    super(props);
    //this.backClick = this.backClick.bind(this);
    this.state = {
      dataList: [],
      loading: true,
      selectedText: '',
      userData: null,
      token: '',
      ogData: null
    };
  }

  componentDidMount() {
    //BackHandler.addEventListener('hardwareBackPress', this.backClick);
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.saveToken, (value) => this.setState({ token: value }, () => {
        Pref.getVal(Pref.userData, udata => {
          this.setState({ userData: udata });
          this.fetchData(udata, this.state.token);
        })
      }));
    });
  }

  fetchData = (udata) => {
    const { id } = udata;
    const body = JSON.stringify(
      { refercode: id }
    )
    //console.log('body',body)
    Helper.networkHelperTokenPost(Pref.PayoutUrl, body, Pref.methodPost, this.state.token, result => {
      console.log('result', result)
      const { response_header, product } = result;
      const { res_type } = response_header;
      if (res_type === 'success') {
        const mapobje = Lodash.map(product, io => {
          return { name: io }
        })
        //console.log('mapobje', mapobje, result);
        this.setState({ loading: false, dataList: mapobje, ogData: result });
      } else {
        this.setState({ loading: false, dataList: [] });
      }
    }, error => {
      //console.log('error', error)
      this.setState({ loading: false, dataList: [] });
    })
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

  renderFinProItems = (iconName, title) => {
    const { selectedText } = this.state;
    return (
      <View style={styles.mainconx}>
        <View style={styles.dummy} />
        <TouchableWithoutFeedback
          onPress={() => {
            // if (title === 'Credit Card') {
            //   const parseItem = {
            //     name: 'Credit Card',
            //     url: '',
            //   };
            //   NavigationActions.navigate('FinorbitForm', parseItem);
            // } else {
            this.setState({ selectedText: title })
            //}
          }}>
          <View
            styleName="v-center h-center horizontal"
            style={styles.itemcont}>
            <View style={styles.mainconx}>
              <View style={{ flex: 0.05 }} />
              <View style={{ flex: 0.25 }}>
                <View
                  style={StyleSheet.flatten([
                    styles.circle,
                    {
                      backgroundColor:
                        selectedText === title ? '#0270e3' : Pref.RED,
                    },
                  ])}>
                  <Image
                    source={iconName}
                    style={StyleSheet.flatten([styles.icon, {
                      width: 20,
                      height: 20,
                      resizeMode: 'contain'
                    }])}
                  />
                  {/* <IconChooser
                    name={iconName}
                    size={17}
                    color={'white'}
                    style={styles.icon}
                  /> */}
                </View>
              </View>
              <View style={{ flex: 0.5, flexDirection: 'row' }}>
                <Title
                  style={StyleSheet.flatten([
                    styles.itemtext1,
                    {
                      marginStart: 8,
                      color: selectedText === title ? '#0270e3' : '#97948c',
                    },
                  ])}>
                  {title}
                </Title>
              </View>
              <View
                style={{
                  flex: 0.2,
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                }}>
                <IconChooser
                  name="chevron-right"
                  size={20}
                  color={selectedText === title ? '#0270e3' : '#97948c'}
                //style={styles.icon}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.dummy} />
      </View>
    );
  };

  getFilterList = () => {
    const { selectedText, dataList } = this.state;
    const clone = JSON.parse(JSON.stringify(dataList));
    let filter = Lodash.filter(clone, (io) => {
      if (selectedText.includes('Insurance')) {
        return io.name.includes(selectedText) || io.name.includes('Policy') || io.name.includes('Sabse') || io.name.includes('Insure Check') || io.name.includes('Vector')
      } else {
        return io.name.includes(selectedText);
      }
    });
    if (selectedText.includes('Investment')) {
      filter = Lodash.filter(
        clone,
        (io) =>
          !io.name.includes('Loan') &&
          !io.name.includes('Insurance') &&
          !io.name.includes('Credit') && !io.name.includes('Vector') && !io.name.includes('Policy') && !io.name.includes('Sabse') && !io.name.includes('Insure Check')
      );
    }
    return filter;
  };

  render() {
    const { selectedText, ogData } = this.state;
    return (
      <CScreen
        absolute={
          <>
            {selectedText !== '' ? (
              <Portal>
                <PayoutSideBar
                  list={this.getFilterList()}
                  backClicked={() => this.setState({ selectedText: '' })}
                  ogData={ogData}
                />
              </Portal>
            ) : null}
          </>
        }
        body={
          <>
            <LeftHeaders
              title={'My Payout Structure'}
              showBack
            // bottomtext={' '}
            // bottomtextStyle={{
            //   color: '#555555',
            //   fontSize: 20,
            // }}
            />

            {this.state.loading ? (
              <View style={styles.loader}>
                <ActivityIndicator />
              </View>
            ) : <>
                {this.renderFinProItems(require('../../res/images/docicon.png'), 'Credit Card')}
                {this.renderFinProItems(require('../../res/images/symbol.png'), 'Loan')}
                {this.renderFinProItems(require('../../res/images/insuranceicn.png'), 'Insurance')}
                {this.renderFinProItems(require('../../res/images/investicon.png'), 'Investment')}

              </>}
            <Image
              source={require('../../res/images/finpro.jpg')}
              styleName="large"
              style={{
                resizeMode: 'contain',
              }}
            />
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
  dummy: { flex: 0.2 },
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

