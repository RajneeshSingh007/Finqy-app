import React, { Component } from "react";
import { View } from "react-native";
import {
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
  ShineOverlay,
} from "rn-placeholder";
//import PropTypes from "prop-types";

export default class PlaceholderLoader extends Component {
  // static propTypes = {
  //   visibilty: PropTypes.bool,
  //   children: PropTypes.object,
  // };

  render() {
    const { visibilty, children } = this.props;
    return visibilty ? (
      <View style={{ flex: 1}}>
        <Placeholder
          style={{ marginHorizontal: 16, marginVertical: 2, marginTop: 8 }}
          Left={PlaceholderMedia}
          Animation={props => <ShineOverlay {...props} duration={2000}/>}
        >
          <PlaceholderLine width={80} />
          <PlaceholderLine width={65} />
          <PlaceholderLine width={45} />
          <PlaceholderLine width={25} />
        </Placeholder>

        <Placeholder
          style={{ marginHorizontal: 16, marginVertical: 2 }}
          Left={PlaceholderMedia}
          Animation={props => <ShineOverlay {...props} duration={2000} />}
        >
          <PlaceholderLine width={80} />
          <PlaceholderLine width={65} />
          <PlaceholderLine width={45} />
          <PlaceholderLine width={25} />
        </Placeholder>

        <Placeholder
          style={{ marginHorizontal: 16, marginVertical: 2 }}
          Left={PlaceholderMedia}
          Animation={props => <ShineOverlay {...props} duration={2000} />}
        >
          <PlaceholderLine width={80} />
          <PlaceholderLine width={65} />
          <PlaceholderLine width={45} />
          <PlaceholderLine width={25} />
        </Placeholder>

        <Placeholder
          style={{ marginHorizontal: 16, marginVertical: 2 }}
          Left={PlaceholderMedia}
          Animation={props => <ShineOverlay {...props} duration={2000} />}
        >
          <PlaceholderLine width={80} />
          <PlaceholderLine width={65} />
          <PlaceholderLine width={45} />
          <PlaceholderLine width={25} />
        </Placeholder>
      </View>
    ) : (
        children
      );
  }
}

