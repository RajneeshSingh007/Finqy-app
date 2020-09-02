import React from 'react';
import {StyleSheet, ScrollView, View, FlatList} from 'react-native';
import {Colors} from 'react-native-paper';
import {sizeWidth, sizeHeight} from '../../util/Size';
import {Table, Row} from 'react-native-table-component';

const CommonTable = (props) => {
  const {widthArr, tableHead, dataList = [], style} = props;

  return (
    <ScrollView
      horizontal
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}>
      <View
        style={[
          {
            marginHorizontal: sizeWidth(2),
            height: sizeHeight(55),
            marginTop: 4,
            backgroundColor: 'white',
          },
        ]}>
        <Table>
          <Row
            data={tableHead}
            widthArr={widthArr}
            style={styles.header}
            textStyle={styles.headerText}
          />
        </Table>
        <FlatList
          data={dataList}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({item, index}) => (
            <Row
              key={index}
              data={item}
              widthArr={widthArr}
              style={[styles.row, index % 2 && {backgroundColor: '#ffffff'}]}
              textStyle={styles.text}
            />
          )}
        />

        {/* <ScrollView style={styles.dataWrapper}>
          <Table>
            {dataList.map((rowData, index) => (
              <Row
                key={index}
                data={rowData}
                widthArr={widthArr}
                style={[styles.row, index % 2 && {backgroundColor: '#ffffff'}]}
                textStyle={styles.text}
              />
            ))}
          </Table>
        </ScrollView> */}
      </View>
    </ScrollView>
  );
};

export default CommonTable;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  header: {
    height: 56,
    // backgroundColor: Colors.blueGrey900,
    // borderColor: '#dedede',
    // borderWidth: 0.5,
  },
  text: {
    textAlign: 'center',
    fontWeight: '400',
    color: '#9a937a',
    fontSize: 15,
  },
  headerText: {
    textAlign: 'center',
    fontWeight: '700',
    color: '#656259',
    fontSize: 16,
  },
  dataWrapper: {marginTop: -1},
  row: {height: 56, backgroundColor: '#f9f8f1'},
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
