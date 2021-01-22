import React, {useState, useEffect} from 'react';
import {Menu, StyleSheet, FlatList} from 'react-native';
import {Subtitle, View, Title} from '@shoutem/ui';
import {Checkbox} from 'react-native-paper';

const MultiSelectList = props => {
  const {style = {}, dataList = [], checkedItem = data => {}} = props;

  const [data, setData] = useState(dataList);

  const checkClicked = (item, index) => {
    data[index].checked = item.checked === 'checked' ? 'unchecked' : 'checked';
    //setData(data);
    checkedItem(data);
  };

  return (
    <View>
      <FlatList
        data={data}
        style={StyleSheet.flatten([styles.liststyle, style])}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({item, index}) => {
          return (
            <View styleName="horizontal">
              <Checkbox.Android
                status={item.checked}
                onPress={() => checkClicked(item, index)}
              />
              <Subtitle style={styles.title1}>{item.value}</Subtitle>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />
    </View>
  );
};

export default MultiSelectList;

const styles = StyleSheet.create({
  sep: {height: 1, backgroundColor: '#dedede'},
  liststyle: {marginTop: 8},
  title1: {
    fontSize: 14,
    fontWeight: '700',
    color: '#555555',
    lineHeight: 20,
    alignSelf: 'center',
    marginStart: 4,
    letterSpacing: 0.5,
  },
  bbstyle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6d6a57',
    lineHeight: 20,
    marginStart: 4,
  },
});
