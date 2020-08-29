import React from 'react';
import {
  StatusBar,
  StyleSheet,
  ScrollView,
  BackHandler,
  FlatList,
  TouchableWithoutFeedback,
  Linking,
    View,
} from 'react-native';
import {
  TouchableOpacity,
  Image,
  Screen,
  Subtitle,
  Title,
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
  ActivityIndicator,
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
import {Table, TableWrapper, Row} from 'react-native-table-component';

const CommonTable = props =>{

    const {widthArr, tableHead,dataList = [],style} = props;

    return (
      <ScrollView horizontal={true} style={style}>
        <View style={[{marginHorizontal: sizeWidth(2), marginTop: 12}]}>
          <Table
            borderStyle={{
              borderWidth: 1,
              borderColor: Colors.grey400,
            }}>
            <Row
              data={tableHead}
              widthArr={widthArr}
              style={styles.header}
              textStyle={styles.headerText}
            />
          </Table>
          <ScrollView style={styles.dataWrapper}>
            <Table
              borderStyle={{
                borderWidth: 1,
                borderColor: Colors.grey300,
              }}>
              {dataList.map((rowData, index) => (
                <Row
                  key={index}
                  data={rowData}
                  widthArr={widthArr}
                  style={[
                    styles.row,
                    index % 2 && {backgroundColor: Colors.grey100},
                  ]}
                  textStyle={styles.text}
                />
              ))}
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
    );
}

export default CommonTable;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  header: {
    height: 48,
    backgroundColor: Colors.blueGrey900,
    borderColor: '#dedede',
    borderWidth: 0.5,
  },
  text: {
    textAlign: 'center',
    fontWeight: '400',
    color: '#212121',
    fontSize: 13,
  },
  headerText: {
    textAlign: 'center',
    fontWeight: '700',
    color: Colors.grey200,
    fontSize: 14,
  },
  dataWrapper: {marginTop: -1},
  row: {height: 48, backgroundColor: '#ebeceb'},
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
