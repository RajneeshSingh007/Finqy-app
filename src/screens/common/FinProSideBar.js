import React from 'react';
import {
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import {Title, View} from '@shoutem/ui';
import {Colors} from 'react-native-paper';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import DrawerTop from '../component/DrawerTop';
import * as Helper from '../../util/Helper';
import NavigationActions from '../../util/NavigationActions';
import Lodash from 'lodash';

const COLOR = '#f9f8f1';

export default class FinProSideBar extends React.PureComponent {
  constructor(props) {
    super(props);
    changeNavigationBarColor(COLOR, true, true);
    StatusBar.setBackgroundColor(COLOR, false);
    StatusBar.setBarStyle('dark-content');
  }

  itemClick = (title, item) => {
    const {backClicked} = this.props;
    backClicked();
    const parseItem = {
      title: item.name,
      url: item.url,
    };
    if (title === 'Fast Tag') {
      Linking.openURL(
        `https://digipay.axisbank.co.in/fastag/customer?utm_source=payerevbay&utm_medium=affiliates&utm_campaign=freefastag-affiliates&utm_content=pay&fbclid=IwAR3lZ53fZdh6aOlldFewCdink9mDEvaguAA3JahnI99lSWsDi7609tljbWY`,
      );
    } else {
      if (title === 'Vector Plus' || title === 'Religare Group Plan') {
        NavigationActions.navigate(`VectorForm`, parseItem);
      } else if (title.includes('Samadhan')) {
        NavigationActions.navigate(`Samadhan`);
      } else if (
        title.includes('Hello') ||
        title.includes('Sabse') ||
        title.includes('Asaan')
      ) {
        NavigationActions.navigate('NewForm', parseItem);
      } else {
        NavigationActions.navigate('FinorbitForm', parseItem);
      }
    }
  };

  render() {
    const {list, backClicked} = this.props;
    if (Helper.nullCheck(list)) {
      return null;
    }
    const size = list.length;
    const sort = Lodash.sortBy(list, ['name']);
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <TouchableWithoutFeedback onPress={backClicked}>
          <View style={{flex: 0.4, overflow: 'hidden', opactiy: 0}} />
        </TouchableWithoutFeedback>
        <View style={styles.mainContainer}>
          <DrawerTop backClicked={backClicked} />
          <View styleName="v-center h-center sm-gutter" style={styles.maiscons}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              <View styleName="v-center h-center sm-gutter">
                {sort.map((item, index) => {
                  return (
                                      // item.name === 'Vector Plus' ? null :
                    <>
                      <TouchableWithoutFeedback
                        onPress={() => this.itemClick(item.name, item)}>
                        <View styleName="horizontal v-center h-center">
                          <Title
                            styleName="wrap"
                            style={styles.text}>{`${item.name === 'Vector Plus' ? 'MCD Policy' : item.name}`}</Title>
                        </View>
                      </TouchableWithoutFeedback>
                      {index === size - 1 ? null : <View style={styles.line} />}
                    </>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  maiscons: {
    flex: 0.87,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  text: {
    fontSize: 14,
    letterSpacing: 0.5,
    color: '#6e6852',
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    lineHeight: 20,
    paddingVertical: 20,
  },
  line: {
    backgroundColor: '#e4cbcb',
    height: 1.2,
    marginStart: 16,
    marginEnd: 16,
  },
  mainContainer: {
    flex: 0.6,
    backgroundColor: COLOR,
    elevation: 8,
  },
  subMargin: {marginStart: 16},
  subtitle: {
    fontSize: 14,

    letterSpacing: 0.5,
    color: '#97948c',
    alignSelf: 'flex-start',
    marginStart: 16,
  },
  title: {
    fontSize: 17,

    letterSpacing: 0.5,
    color: 'black',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    marginStart: 16,
  },
  image: {
    backgroundColor: Colors.grey200,
    resizeMode: 'contain',
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menutitle: {
    fontSize: 13,

    letterSpacing: 0.5,
    color: '#97948c',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
  },
  menusubtitle: {
    fontSize: 13,

    letterSpacing: 0.5,
    color: '#97948c',
    alignSelf: 'flex-start',
  },
});
