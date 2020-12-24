import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, TouchableWithoutFeedback, Text } from 'react-native'

export default class ColumnChartItem extends Component {
  render () {
    let renders = []
    let seriesCount = this.props.seriesArray.length
    for (let seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
      let lastElementMarginRight = 0
      if (seriesIndex === (seriesCount - 1)) {
        lastElementMarginRight = this.props.defaultMargin
      }
      let yvalue = Number(this.props.seriesArray[seriesIndex].data[this.props.dataIndex]['y']);
      renders.push(
        <View key={seriesIndex} style={[styles.bar, {
          width: this.props.defaultWidth / seriesCount,
          height: this.props.seriesArray[seriesIndex].data[this.props.dataIndex]['ratioY'],
          marginRight: lastElementMarginRight,
          //backgroundColor: this.props.seriesArray[seriesIndex].seriesColor,
                    backgroundColor: this.props.seriesArray[seriesIndex].data[this.props.dataIndex]['color'],
          borderColor: this.props.isSelected ? this.props.highlightColor : '#FFFFFF',
          alignItems:'center',
          alignContent:'center',
          justifyContent:'center'
        }]}>
          {yvalue > 0 ? 
          <Text style={
            {

            fontSize: 13,
            alignContent:'center',
            alignSelf:'center',
            justifyContent:'center',
            alignItems:'center',
            color:'#666666'
            }
          }>{`${this.props.seriesArray[seriesIndex].data[this.props.dataIndex]['y']}`}</Text> : null}
        </View>
      )
    }
    return (
      <TouchableWithoutFeedback onPressIn={(evt) => this.props.onClick(evt)}>
        <View style={{height: this.props.defaultHeight}}>
          <View style={styles.chartView}>
            {renders}
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  chartView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
    paddingTop: 20
  },
  bar: {
    justifyContent: 'flex-end',
    borderWidth: 1
  }
})

ColumnChartItem.propTypes = {
  seriesArray: PropTypes.array,
  onClick: PropTypes.func,
  defaultWidth: PropTypes.number,
  defaultHeight: PropTypes.number,
  defaultMargin: PropTypes.number,
  primaryColor: PropTypes.string,
  highlightColor: PropTypes.string
}
