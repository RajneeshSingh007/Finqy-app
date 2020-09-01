import React from 'react';
import {
  StyleSheet,
  BackHandler,
} from 'react-native';
import {
  Image,
  Title,
  View,
  Caption,
  Html,
} from '@shoutem/ui';
import * as Pref from '../../util/Pref';
import {
  ActivityIndicator,
} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import Lodash from 'lodash';
import LeftHeaders from '../common/CommonLeftHeader';
import moment from 'moment';
import ListError from '../common/ListError';
import CScreen from '../component/CScreen';

export default class BlogDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.back = this.back.bind(this);
    this.state = {
      loading: false,
      item: null,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.back);
    const {navigation} = this.props;
    const item = navigation.getParam('item', null);
    this.setState({item: item, loading: false});
    // this.focusListener = navigation.addListener("didFocus", () => {
    //     const item = navigation.getParam('item', null);
    //     this.setState({ item: item, loading: false })
    // });
  }

  componentDidUpdate(preProp, nextState) {
    if (preProp.navigation !== undefined) {
      const {navigation} = this.props;
      const olditem = preProp.navigation.getParam('item', null);
      const item = navigation.getParam('item', null);
      if (olditem !== item) {
        this.setState({item: item, loading: false});
      }
    }
  }

  back = () => {
    NavigationActions.navigate(`Blogs`);
    return true;
  };
  componentWillUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.back);
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  /**
   *
   * @param {*} item
   * @param {*} index
   */
  renderItems(item) {
          let url = `https://erb.ai/erevbay_admin/${item.img}`;

    // const url =
    //   item.category === `newspaper`
    //     ? `https://erb.ai/erevbay_admin/blogs/newspaper/${item.img}`
    //     : `https://erb.ai/erevbay_admin/${item.img}`;
    const cat = item.category.replace('_', ' ');
    const sp = item.date.split(' ');
    const d = new Date();
    const dx = sp[0].split('-');
    const time = sp[1].split(':');
    d.setFullYear(dx[0], dx[1], dx[2]);
    d.setHours(time[0], time[1], time[2]);
    const date = moment(d).format('DD-MM-YYYY hh:mm A');
    return (
      <View styleName="vertical" style={{flex: 1}}>
        <Title
          styleName="v-center h-center"
          style={StyleSheet.flatten([
            styles.passText,
            {
              color: '#686868',
              paddingVertical: 0,
            },
          ])}>{`${item.title}`}</Title>

        <View styleName="horizontal v-center h-center">
          <Caption
            styleName="v-center h-center"
            style={StyleSheet.flatten([
              styles.passText,
              {
                color: '#bbb8ac',
                paddingVertical: 0,
                fontSize: 13,
                fontWeight: '400',
              },
            ])}>{`${Lodash.capitalize(cat)}`}</Caption>
          <View style={styles.line}></View>
          <Caption
            styleName="v-center h-center"
            style={StyleSheet.flatten([
              styles.passText,
              {
                color: '#bbb8ac',
                paddingVertical: 0,
                fontSize: 13,
                fontWeight: '400',
              },
            ])}>{`${date}`}</Caption>
        </View>

        <View styleName="md-gutter">
          <Image
            styleName="large"
            source={{uri: `${encodeURI(url)}`}}
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
              width: '90%',
              height: 224,
              resizeMode: 'contain',
            }}
          />
          <Html
            body={`<p style=\"color:#a7a6a6; \"><span class=\"ql-font-serif\">${item.desc}</span></p><p style=\"color:#a7a6a6; \">${item.post}`}
          />
        </View>
      </View>
    );
  }

  render() {
    return (
      <CScreen
        body={
          <>
            <LeftHeaders
              showBack
              title={'FinNews'}
              bottomtext={
                <>
                  {`Fin`}
                  <Title style={styles.passText}>{`News`}</Title>
                </>
              }
              bottomtextStyle={{
                color: '#555555',
                fontSize: 24,
              }}
            />
            {this.state.loading ? (
              <View style={styles.loader}>
                <ActivityIndicator />
              </View>
            ) : this.state.item !== null ? (
              this.renderItems(this.state.item)
            ) : (
              <View style={styles.emptycont}>
                <ListError subtitle={'Failed to load data...'} />
              </View>
            )}
          </>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  line: {
    backgroundColor: '#bbb8ac',
    width: 1,
    alignSelf: 'center',
    marginHorizontal: 12,
    height: 16,
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
  },
});
