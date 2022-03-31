import React from "react";
import {
  StatusBar,
  BackHandler,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { View } from "@shoutem/ui";
import * as Pref from "../../util/Pref";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import LeftHeaders from "../common/CommonLeftHeader";
import Pdf from "react-native-pdf";
import CScreen from "../component/CScreen";
import NavigationActions from "../../util/NavigationActions";
import WebView from "react-native-webview";

export default class WebForm extends React.PureComponent {
  constructor(props) {
    super(props);
    changeNavigationBarColor(Pref.WHITE, true, true);
    StatusBar.setBackgroundColor(Pref.WHITE, false);
    StatusBar.setBarStyle("dark-content");
    this.webref = React.createRef();
    this.state = {
      url: "",
      title: "",
      editMode: false,
      redirectUrl: "",
      loading: true,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const url = navigation.getParam("url", "");
    const title = navigation.getParam("title", "");
    const editMode = navigation.getParam("editMode", false);
    const redirectUrl = navigation.getParam("redirect", "");

    //this.focusListener = navigation.addListener("didFocus", () => {
      //console.log('focused', url, title, editMode, redirectUrl);
      this.setState({
        title: title,
        url: url,
        editMode: editMode,
        redirectUrl: redirectUrl,
      }, () => this.forceUpdate());
    //});
  }

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
  }

  finishForm = () => {
    const { editMode } = this.state;
    let backScreenName = editMode === false ? "FinorbitScreen" : "LeadList";
    NavigationActions.navigate("Finish", {
      top: editMode === false ? "Add New Lead" : "Edit Lead",
      red: "Success",
      grey: editMode === false ? "Details uploaded" : "Details updated",
      blue: editMode === false ? "Add another lead?" : "Back to Lead Record",
      back: backScreenName,
    });
  };

  render() {
    return (
      <CScreen
        scrollEnable={false}
        body={
          <View style={{ flex: 1 }}>
            <LeftHeaders
              title={this.state.title}
              showBack
              backClicked={() => this.state.editMode ? NavigationActions.navigate("LeadList") : NavigationActions.goBack()}
            />

            <WebView
              ref={this.webref}
              source={{ uri: this.state.url }}
              javaScriptEnabled
              style={
                this.state.loading == false && {
                  flex: 1,
                  marginTop: 16,
                  backgroundColor: "white",
                }
              }
              onNavigationStateChange={(event) => {
                const { url } = event;
                if (this.state.redirectUrl.length > 0 &&  url.toLowerCase().includes(this.state.redirectUrl)) {
                  this.finishForm();
                }
              }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              domStorageEnabled
              onLoad={(e) => this.setState({ loading: false })}
              injectedJavaScript={`
              const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
              if (!iOS) {
                const meta = document.createElement('meta');
                let initialScale = 1;
                if(screen.width <= 800) {
                 initialScale = ((screen.width / window.innerWidth) + 0.1).toFixed(2);
                }
                const content = 'width=device-width, initial-scale=' + initialScale ;
                meta.setAttribute('name', 'viewport');
                meta.setAttribute('content', content);
                document.getElementsByTagName('head')[0].appendChild(meta);
              }
              `}
              scalesPageToFit={Platform.OS === "ios"}
            />

            {this.state.loading ? (
              <View style={styles.loader}>
                <ActivityIndicator color={Pref.RED} />
              </View>
            ) : null}
          </View>
        }
      />
    );
  }
}

/**
 * styles
 */
const styles = StyleSheet.create({
  loader: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignSelf: "center",
    flex: 1,
    paddingVertical: 48,
    backgroundColor: "#f9f8f1",
  },
});
