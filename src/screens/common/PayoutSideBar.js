import React from 'react';
import {
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import { Title, View } from '@shoutem/ui';
import { Colors } from 'react-native-paper';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import DrawerTop from '../component/DrawerTop';
import * as Helper from '../../util/Helper';
import NavigationActions from '../../util/NavigationActions';
import Lodash from 'lodash';

const COLOR = '#f9f8f1';

export default class PayoutSideBar extends React.PureComponent {
  constructor(props) {
    super(props);
    changeNavigationBarColor(COLOR, true, true);
    StatusBar.setBackgroundColor(COLOR, false);
    StatusBar.setBarStyle('dark-content');
  }

  itemClick = (title) => {
    const { backClicked, ogData, screenName = 'PayoutForm',refercode = null } = this.props;
    const parsetitle = String(title)
      .toLowerCase()
      .replace(/ /g, '_')
    //console.log('parsetitle',parsetitle,ogData[parsetitle]);
    backClicked();
    if (Helper.nullCheck(ogData[parsetitle]) === false) {
      const { available } = ogData[parsetitle];
      if (available) {
        const { data, length, tc, head,pn,ex,width } = ogData[parsetitle];
        NavigationActions.navigate(screenName, {
          title: title,
          data: data,
          length: length,
          tc: tc,
          head: head,
          pn: pn,
          ex:ex,
          width:width,
          editable: Helper.nullCheck(ogData[parsetitle].editable) === false ? true : false,
          refercode:refercode,
          payout:Helper.nullCheck(ogData.payout) === false ? ogData.payout : null
        });
      } else {
        Helper.showToastMessage('No data found', 0);
      }
    } else {
      Helper.showToastMessage('No data found', 0);
    }
  };

  render() {
    const { list, backClicked } = this.props;
    if (Helper.nullCheck(list)) {
      return null;
    }
    const size = list.length;
    const sort = Lodash.sortBy(list, ['name']);
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <TouchableWithoutFeedback onPress={backClicked}>
          <View style={{ flex: 0.4, overflow: 'hidden', opactiy: 0 }} />
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
                        onPress={() => this.itemClick(item.name)}>
                        <View styleName="horizontal v-center h-center">
                          <Title
                            styleName="wrap"
                            style={styles.text}>{`${item.name === 'Vector Plus' ? 'MCD Policy' : item.name === 'Life Cum Invt. Plan' ? 'Life Cum Investment Plan' : item.name}`}</Title>
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
  subMargin: { marginStart: 16 },
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
