import React from "react";
import { StyleSheet, BackHandler } from "react-native";
import { View } from "@shoutem/ui";
import * as Pref from "../../util/Pref";
import CScreen from "../component/CScreen";
import WebView from "react-native-webview";
import NavigationActions from "../../util/NavigationActions";
import LeftHeaders from "../common/CommonLeftHeader";
import { ActivityIndicator } from "react-native-paper";

export default class WebComp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.webRef = React.createRef();
    this.backClick = this.backClick.bind(this);
    this.state = {
      url: null,
      navState: null,
      title:''
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.backClick);
    const { navigation } = this.props;
    const url = navigation.getParam("url", null);
    const title = navigation.getParam("title", '');
    if (url !== null) {
      this.setState({ url: url,title:title });
    }
  }

  backClick = () => {
    const { navState } = this.state;
    if (navState == null) {
      NavigationActions.goBack();
    } else {
      const { canGoBack } = navState;
      if (canGoBack && this.webRef && this.webRef.current) {
        this.webRef.current.goBack();
      } else {
        NavigationActions.goBack();
      }
    }
    BackHandler.removeEventListener("hardwareBackPress", this.backClick);
    return true;
  };

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backClick);
  }

  render() {
    return (
      <CScreen
        scrollEnable={false}
        body={
          <>
            <LeftHeaders showBack title={this.state.title} backClicked={() => this.backClick()} />
            <View style={{ backgroundColor: "white", flex: 1 }}>
              {this.state.url !== null ? (
                <WebView
                  startInLoadingState={true}
                  renderLoading={() => (
                    <View style={styles.loader} styleName='fill-parent'>
                      <ActivityIndicator />
                    </View>
                  )}
                  cacheEnabled={false}
                  cacheMode={'LOAD_NO_CACHE'}
                  ref={this.webRef}
                  source={{ uri: this.state.url, cache: false }}
                  javaScriptEnabled
                  allowsBackForwardNavigationGestures={false}
                  onNavigationStateChange={navState => {
                    console.log(navState);
                    this.setState({ navState: navState });
                  }}
                />
              ) : null}
            </View>
          </>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  loader: {
    justifyContent: "center",
    alignSelf: "center",
    flex: 1,
  }
});
