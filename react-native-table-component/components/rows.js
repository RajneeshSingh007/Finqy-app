import React, { Component } from 'react';
import { View, ViewPropTypes, Text, StyleSheet, FlatList } from 'react-native';
import { Cell } from './cell';
import { sum } from '../utils';

export class Row extends Component {
  static propTypes = {
    style: ViewPropTypes.style,
    textStyle: Text.propTypes.style
  };

  render() {
    const { data, style, widthArr, height, flexArr, textStyle, ...props } = this.props;
    let width = widthArr ? sum(widthArr) : 0;

    return data ? (
      <View style={[height && { height }, width && { width }, styles.row, style]}>
        {/* <FlatList
          keyExtractor={(item, index) => `${index}`}
          data={data}
          renderItem={({ item, i }) => {
           const flex = flexArr && flexArr[i];
            const wth = widthArr && widthArr[i];
            return <Cell key={i} data={item} width={wth} height={height} flex={flex} textStyle={textStyle} {...props} />
          }}
          horizontal
        /> */}
        {data.map((item, i) => {
          const flex = flexArr && flexArr[i];
          const wth = widthArr && widthArr[i];
          return <Cell key={i} data={item} width={wth} height={height} flex={flex} textStyle={textStyle} {...props} />;
        })}
      </View>
    ) : null;
  }
}

export class Rows extends Component {
  static propTypes = {
    style: ViewPropTypes.style,
    textStyle: Text.propTypes.style
  };

  render() {
    const { data, style, widthArr, heightArr, flexArr, textStyle, ...props } = this.props;
    const flex = flexArr ? sum(flexArr) : 0;
    const width = widthArr ? sum(widthArr) : 0;

    return data ? (
      <View style={[flex && { flex }, width && { width }]}>
        <FlatList
          keyExtractor={(item, index) => `${index}`}
          data={data}
          renderItem={({ item, index }) => {
            const height = heightArr && heightArr[i];
            return <Row key={index} data={item} widthArr={widthArr} height={height} flexArr={flexArr} style={style} textStyle={textStyle} {...props} />
          }}
        />
      </View>
    ) : null;
  }
}


const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    overflow: 'hidden'
  }
});