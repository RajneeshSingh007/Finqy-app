import React from 'react';
import {
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Title, View } from '@shoutem/ui';
import { Colors } from 'react-native-paper';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import DrawerTop from '../component/DrawerTop';
import * as Helper from '../../util/Helper';
import NavigationActions from '../../util/NavigationActions';

const COLOR = '#f9f8f1';

export default class NotificationSidebar extends React.PureComponent {
  constructor(props) {
    super(props);
    changeNavigationBarColor(COLOR, true, true);
    StatusBar.setBackgroundColor(COLOR, false);
    StatusBar.setBarStyle('dark-content');
  }

  notificationClick = (item) => {
    const { list = [], backClicked } = this.props;
    const { name } = item;
    const ticketCheck = /ticket/g.test(name);
    if (ticketCheck) {
      backClicked();
      NavigationActions.navigate('TrackQuery', {name:'Track My Query'})
    }
    const leadCheck = /Status/g.test(name);
    const newLeadCheck = /generated/g.test(name);
    if (leadCheck || newLeadCheck) {
      backClicked();
      NavigationActions.navigate('LeadList', {name:'Q-Leads'})
    }
    const finTrainCheck = /FinTrain/g.test(name);
    if (finTrainCheck) {
      backClicked();
      NavigationActions.navigate('Training', {name:'Q-Train Learning'})
    }
    const finMarketing = /Marketing/g.test(name);
    if (finMarketing) {
      backClicked();
      NavigationActions.navigate('MarketingTool',{name:'Q-Marketing Tool'})
    }
    const popularCheck = /Popular/g.test(name);
    if (popularCheck) {
      backClicked();
      NavigationActions.navigate('PopularPlan',{name:'Q-Popular Plan'})
    }
    const offerCheck = /Offer/g.test(name);
    if (offerCheck) {
      backClicked();
      NavigationActions.navigate('MyOffers',{name:'Q-Offers'})
    }
  }

  render() {
    const { list = [], backClicked } = this.props;
    const size = list.length;
    return (
      <View style={styles.cont}>
        <TouchableWithoutFeedback onPress={backClicked}>
          <View style={{ flex: 0.3, overflow: 'hidden', opactiy: 0 }} />
        </TouchableWithoutFeedback>
        <View style={styles.mainContainer}>
          <DrawerTop backClicked={backClicked} />
          <View styleName="v-center h-center sm-gutter" style={styles.maiscons}>
            {list.length === 0 ? (
              <View style={StyleSheet.flatten([styles.cont, { flex: 0.7 }])} styleName="vertical v-center h-center">
                <Title styleName="wrap" style={styles.text}>
                  {`No notification found...`}
                </Title>
              </View>
            ) : (
              <ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>
                <View styleName="v-center h-center sm-gutter">
                  {list.map((item, index) => {
                    return (
                      <>
                        <TouchableWithoutFeedback onPress={() => this.notificationClick(item)}>
                          <View styleName="horizontal v-center h-center">
                            <Title styleName="wrap" style={styles.text}>
                              {item.name}
                            </Title>
                          </View>
                        </TouchableWithoutFeedback>
                        {index === size - 1 ? null : (
                          <View style={styles.line} />
                        )}
                      </>
                    );
                  })}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cont: { flex: 1, flexDirection: 'row' },
  maiscons: {
    flex: 1,
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
    flex: 0.7,
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
