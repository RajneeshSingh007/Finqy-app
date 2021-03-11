import React from 'react';
import {
  StyleSheet,
  FlatList,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { Title, View } from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import { Colors, ActivityIndicator, Chip } from 'react-native-paper';
import { sizeWidth, sizeHeight } from '../../util/Size';
import Lodash from 'lodash';
import LeftHeaders from '../common/CommonLeftHeader';
import ListError from '../common/ListError';
import IconChooser from '../common/IconChooser';


const OfferMarketingFilter = (props) =>{

        return <View>
                        <View styleName="horizontal v-end h-end md-gutter">
              <TouchableWithoutFeedback
                onPress={() => this.setState({ showFilter: !showFilter })}
                onLayout={this.onLayout}>
                <Title
                  style={StyleSheet.flatten([
                    styles.passText,
                    {
                      color: '#82b9f4',
                      fontSize: 16,
                      lineHeight: 20,
                      paddingVertical: 0,
                    },
                  ])}>
                  {`Filter by `}
                  <IconChooser
                    name={showFilter ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={'#82b9f4'}
                    style={{
                      alignSelf: 'center',
                      justifyContent: 'center',
                    }}
                  />
                </Title>
              </TouchableWithoutFeedback>
            </View>

            {showFilter ? (
              <View styleName="vertical md-gutter" style={StyleSheet.flatten([styles.filtercont, {
                top: sizeHeight(14) + this.state.height
              }])}>
                <TouchableWithoutFeedback
                  onPress={() => this.chipclick({ name: 'All' }, 2)}>
                  <Title
                    style={StyleSheet.flatten([
                      styles.passText,
                      {
                        color: '#6e6852',
                        fontSize: 16,
                        lineHeight: 20,
                        paddingVertical: 0,
                      },
                    ])}>
                    {`All`}
                  </Title>
                </TouchableWithoutFeedback>
                <View
                  style={{
                    marginTop: 4,
                    height: 1,
                    width: '100%',
                    backgroundColor: '#e4cbcb',
                  }}></View>
                <TouchableWithoutFeedback
                  onPress={() => this.chipclick({ name: 'Video' }, 0)}>
                  <Title
                    style={StyleSheet.flatten([
                      styles.passText,
                      {
                        marginTop: 10,
                        color: '#6e6852',
                        fontSize: 16,
                        lineHeight: 20,
                        paddingVertical: 0,
                      },
                    ])}>
                    {`Video`}
                  </Title>
                </TouchableWithoutFeedback>
                <View
                  style={{
                    marginTop: 4,
                    height: 1,
                    width: '100%',
                    backgroundColor: '#e4cbcb',
                  }}></View>
                <TouchableWithoutFeedback
                  onPress={() => this.chipclick({ name: 'Download' }, 1)}>
                  <Title
                    style={StyleSheet.flatten([
                      styles.passText,
                      {
                        marginTop: 16,
                        color: '#6e6852',
                        fontSize: 16,
                        lineHeight: 20,
                        paddingVertical: 0,
                        marginBottom: -2,
                      },
                    ])}>
                    {`PDF`}
                  </Title>
                </TouchableWithoutFeedback>
              </View>
            ) : null}

        </View>
}