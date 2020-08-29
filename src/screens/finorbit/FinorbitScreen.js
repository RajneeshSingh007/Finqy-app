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

const colorList = [
  '#d0f2f1',
  '#e4dcf5',
  '#f8edca',
  '#8ee6df',
  '#6abc2e',
  '#6c757d',
  '#28a745',
];

export default class FinorbitScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.backClick = this.backClick.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.state = {
      dataList: Pref.productList,
      loading: false,
    };
  }

  //      {
  //     name: 'Demat',
  //         url: require('./../../res/images/demat.png')
  // }, {
  //     name: 'Fast Tag',
  //         url: require('./../../res/images/fasttag.png')
  // }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backClick);
    const {navigation} = this.props;
    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({loading: true});
    });
    this.focusListener = navigation.addListener('didFocus', () => {
      this.setState({loading: false});
    });
  }

  componentWillUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  backClick = () => {
    NavigationActions.goBack();
    return true;
  };

  /**
   *
   * @param {*} color
   * @param {*} clickName
   * @param {*} title
   * @param {*} subtitle
   * @param {*} url
   * @param {*} textColor
   */
  cardviewRender(color, clickName, title, subtitle, url, item = {}) {
    return (
      <Card
        elevation={2}
        style={{
          flex: 1,
          backgroundColor: color,
          marginVertical: sizeHeight(1.5),
          marginStart: 4,
          marginEnd: 4,
          paddingVertical: sizeHeight(1),
        }}
        onPress={() => {
          if (title === 'Fast Tag') {
            Linking.openURL(
              `https://digipay.axisbank.co.in/fastag/customer?utm_source=payerevbay&utm_medium=affiliates&utm_campaign=freefastag-affiliates&utm_content=pay&fbclid=IwAR3lZ53fZdh6aOlldFewCdink9mDEvaguAA3JahnI99lSWsDi7609tljbWY`,
            );
          } else {
            console.log('title', title);
            if (title === 'Vector Plus') {
              NavigationActions.navigate(`VectorForm`, item);
            } else if (title.includes('Samadhan')) {
              NavigationActions.navigate(`Samadhan`);
            } else if (
              title.includes('Hello') ||
              title.includes('Sabse') ||
              title.includes('Asaan')
            ) {
              NavigationActions.navigate('NewForm', item);
            } else {
              NavigationActions.navigate(clickName, item);
            }
          }
        }}>
        <View
          style={{
            marginVertical: sizeHeight(0.5),
            marginHorizontal: sizeWidth(2),
            alignItems: 'center',
            alignContents: 'center',
          }}>
          <Image
            source={url}
            styleName="medium"
            style={{
              resizeMode: 'contain',
              alignSelf: 'center',
              marginVertical: sizeHeight(1),
            }}
          />
          <Title
            style={{
              color: '#292929',
              fontWeight: '700',
              fontSize: 14,
              fontFamily: 'Rubik',
              //paddingVertical: sizeHeight(1.2),
              alignSelf: 'center',
              justifyContent: 'center',
              marginTop: 8,
              letterSpacing: 0.5,
              paddingBottom: 4,
            }}>
            {title}
          </Title>
        </View>
      </Card>
    );
  }

  renderItems(item, index) {
    //const random = Math.floor(Math.random(0, 6) * 6);
    //colorList[random]
    //Pref.GREY_COLOR
    //Pref.WHITE_LINEN
    return (
      <View
        style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
        {this.cardviewRender('white', 'FinorbitForm', item.name, '', item.url, {
          title: item.name,
          url: item.url,
        })}
      </View>
    );
  }

  render() {
    return (
      <CommonScreen
        title={'Finorbit'}
        loading={this.state.loading}
        enabelWithScroll={false}
        header={
          <LeftHeaders
            showAvtar
            showBack
            rightImage
            title={'Add Single Lead'}
            style={{marginBottom: 8}}
            rightUrl={require('../../res/images/logo.png')}
          />
        }
        headerDis={0.17}
        bodyDis={0.83}
        body={
          <>
            {/* <CardRow 
                            color={Pref.JET_BLACK}
                            title={'Apply for a Loan or Insurance'}
                            subtitle={'One stop shop for all your financial needs!'}
                            //url={require('../../res/images/personalloan.png')}
                            showImage={false}
                            //titleColor={'white'}
                            //subtitleColor={'#dedede'}
                            titleColor={'#292929'}
                            subtitleColor={'#292929'}
                        /> */}
            {this.state.dataList.length > 0 ? (
              <FlatList
                style={{
                  marginHorizontal: sizeWidth(2),
                  paddingHorizontal: sizeWidth(1),
                }}
                data={this.state.dataList}
                numColumns={2}
                renderItem={({item, index}) => this.renderItems(item, index)}
                keyExtractor={(item, index) => item.name.toString()}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                extraData={this.state}
              />
            ) : null}
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
