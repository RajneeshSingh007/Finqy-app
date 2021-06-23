import React from "react";
import { StatusBar, StyleSheet, Linking, BackHandler } from "react-native";
import { View, Title } from "@shoutem/ui";
import * as Pref from "../../util/Pref";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import LeftHeaders from "../common/CommonLeftHeader";
import Pdf from "react-native-pdf";
import CScreen from "../component/CScreen";
import Download from "../component/Download";
import Share from "react-native-share";
import * as Helper from "../../util/Helper";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import NavigationActions from "../../util/NavigationActions";
import { Dialog, Portal, RadioButton } from "react-native-paper";

export default class GetQuotesView extends React.PureComponent {
  constructor(props) {
    super(props);
    //this.backClick = this.backClick.bind(this);
    changeNavigationBarColor(Pref.WHITE, true, true);
    StatusBar.setBackgroundColor(Pref.WHITE, false);
    StatusBar.setBarStyle("dark-content");
    this.state = {
      loading: false,
      modalvis: true,
      pdfurl: "",
      remoteFileUrl: "",
      referCode: "",
      companyList: [],
      showDialog: false,
      company: ""
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.backClick);
    const { navigation } = this.props;
    const url = navigation.getParam("url", null);
    const companyList = navigation.getParam("company", []);
    const sumInsurred = navigation.getParam("sumInsurred", 0);
    const formId = navigation.getParam("formId", null);
    const editMode = navigation.getParam("editmode", false);
    const deductible = navigation.getParam("deductible", -1);
    //console.log('url', url,sumInsurred,formId);
    //this.focusListener = navigation.addListener("didFocus", () => {
      Pref.getVal(Pref.userData, data => {
        //console.log('data', data)
        this.setState({
          companyList: companyList,
          formId: formId,
          sumInsurred: sumInsurred,
          editMode: editMode,
          deductible: deductible
        });
        this.fetchData(url, data);
      });
    //});
  }

  fetchData = (url, data) => {
    const { refercode } = data;
    this.setState({
      pdfurl: url,
      loading: false,
      modalvis: true,
      remoteFileUrl: url,
      referCode: refercode
    });
  };

  backClick = () => {
    this.navigateToBack();
    BackHandler.removeEventListener("hardwareBackPress", this.backClick);
    return true;
  };

  navigateToBack = () => {
    NavigationActions.navigate("GetQuotes", {
      formId: this.state.formId,
      sumInsurred: this.state.sumInsurred,
      editMode: this.state.editMode
    });
  };

  componentWillUnMount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backClick);
    if (this.focusListener !== undefined) this.focusListener.remove();
  }

  shareFile = () => {
    const { pdfurl } = this.state;
    if (pdfurl === "") {
      this.setState({ modalvis: false });
      Helper.showToastMessage("Failed to find quote", 0);
      return false;
    }
    const url = `${this.state.pdfurl}`;
    const title = "";
    const message = ``;
    const options = Platform.select({
      ios: {
        activityItemSources: [
          {
            placeholderItem: { type: "url", content: url },
            item: {
              default: { type: "url", content: url }
            },
            subject: {
              default: title
            },
            linkMetadata: { originalUrl: url, url, title }
          },
          {
            placeholderItem: { type: "text", content: message },
            item: {
              default: { type: "text", content: message },
              message: null // Specify no text to share via Messages app.
            }
          }
        ]
      },
      default: {
        title,
        subject: title,
        url: url,
        message: `${message}`
      }
    });
    Share.open(options);
  };

  buyNow = () => {
    const { companyList } = this.state;
    if (companyList.length === 0 || companyList.length == 1) {
      const value =
        companyList.length === 0
          ? ""
          : Helper.nullCheck(companyList[0]["name"]) == false
          ? companyList[0]["name"]
          : "";
      this.openCif(value);
    } else {
      this.setState({ showDialog: true });
    }
  };

  hideDialog = () => this.setState({ showDialog: false });

  selectedCompany = value => {
    this.setState({ company: value });
    if (value === "Religare") {
      const item = {
        name: "Vector Plus",
        url: ""
      };
      NavigationActions.navigate("FinorbitForm", item);
    } else {
      this.openCif(value);
      this.hideDialog();
    }
  };

  /**
   *
   * @param {*} value
   */
  openCif = value => {
    const { formId, deductible } = this.state;
    let healthByLink = `${Pref.HLCifUrl}?unq_no=${formId}&com=${value}`;
    if (deductible === -1) {
      healthByLink += `&type=tmp`;
    }
    Linking.openURL(healthByLink);
  };

  render() {
    const { companyList } = this.state;
    return (
      <CScreen
        absolute={
          companyList.length > 0 ? (
            <Portal>
              <Dialog
                visible={this.state.showDialog}
                onDismiss={this.hideDialog}
              >
                <Dialog.Title>{`Select Company`}</Dialog.Title>
                <Dialog.Content>
                  <RadioButton.Group
                    onValueChange={value => this.selectedCompany(value)}
                    value={this.state.company}
                  >
                    <View styleName="vertical" style={{ marginBottom: 8 }}>
                      {companyList.map(item => {
                        return (
                          <View
                            styleName="horizontal v-center h-center"
                            style={{ marginVertical: 6 }}
                          >
                            <RadioButton
                              value={item.name}
                              style={{ alignSelf: "center" }}
                            />
                            <Title
                              styleName="v-center h-center"
                              style={styles.textopen}
                            >
                              {item.name}
                            </Title>
                          </View>
                        );
                      })}
                    </View>
                  </RadioButton.Group>
                </Dialog.Content>
              </Dialog>
            </Portal>
          ) : null
        }
        scrollEnable={false}
        body={
          <View style={{ flex: 1 }}>
            <LeftHeaders
              title={`Your Quote`}
              showBack
              backClicked={() => this.navigateToBack()}
            />
            <View style={{ flex: 0.02 }}></View>
            <Pdf
              source={{
                uri: this.state.pdfurl,
                cache: false
              }}
              style={{
                flex: 0.85,
                backgroundColor: "#f9f8f1"
              }}
              fitWidth
              fitPolicy={0}
              enablePaging
              scale={1}
            />

            <TouchableWithoutFeedback onPress={this.buyNow}>
              <View
                style={{
                  backgroundColor: "#f9f8f1"
                }}
              >
                <Title style={styles.belowtext}>{`Buy Now`}</Title>
              </View>
            </TouchableWithoutFeedback>

            <Download
              rightIconClick={() => {
                Helper.downloadFileWithFileName(
                  `${this.state.pdfurl}.pdf`,
                  `${this.state.sumInsurred}`,
                  `${this.state.sumInsurred}.pdf`,
                  "application/pdf"
                );
              }}
              style={{ flex: 0.09 }}
              showLeft
              leftIconClick={this.shareFile}
            />
          </View>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  belowtext: {
    fontSize: 16,
    letterSpacing: 0.5,
    color: "#0270e3",
    fontWeight: "700",
    lineHeight: 36,
    alignSelf: "center",
    justifyContent: "center",
    textAlign: "center",
    paddingVertical: 8
  },
  textopen: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555555",
    lineHeight: 20,
    alignSelf: "center",
    marginStart: 4,
    letterSpacing: 0.5
  }
});
