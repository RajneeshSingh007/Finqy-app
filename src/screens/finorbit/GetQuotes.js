import React from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { Title, Subtitle, View } from "@shoutem/ui";
import * as Helper from "../../util/Helper";
import * as Pref from "../../util/Pref";
import { Button, Colors, RadioButton } from "react-native-paper";
import { sizeHeight, sizeWidth } from "../../util/Size";
import LeftHeaders from "../common/CommonLeftHeader";
import CScreen from "../component/CScreen";
import Pdf from "react-native-pdf";
import Modal from "../../util/Modal";
import IconChooser from "../common/IconChooser";
import Share from "react-native-share";
import Lodash from 'lodash';

export default class GetQuotes extends React.Component {
  constructor(props) {
    super(props);
    this.submitt = this.submitt.bind(this);
    this.specificFormRef = React.createRef();
    this.state = {
      modalvis: false,
      sumInsurred: "",
      showCompType: false,
      compTypeList: [
        { value: `3`, name: "3Lac" },
        { value: `3.5`, name: "3.5Lac" },
        { value: `4`, name: "4Lac" },
        { value: `4.5`, name: "4.5Lac" },
        { value: `5`, name: "5Lac" },
        { value: `5.5`, name: "5.5Lac" },
        { value: `7`, name: "7Lac" },
        { value: `7.5`, name: "7.5Lac" },
        { value: `10`, name: "10Lac" },
        { value: `15`, name: "15Lac" },
        { value: `20`, name: "20Lac" },
        { value: `25`, name: "25Lac" },
        { value: `30`, name: "30Lac" },
        { value: `35`, name: "35Lac" },
        { value: `40`, name: "40Lac" },
        { value: `45`, name: "45Lac" },
        { value: `50`, name: "50Lac" },
        { value: `75`, name: "75Lac" },
        { value: `100`, name: "100Lac" },
      ],
      pdfurl: "",
      companyList: [],
      formId: "",
      loading: false,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const formId = navigation.getParam('formId', null);
    const sumInsurred = navigation.getParam('sumin', null);
    let check = 1;
    if(sumInsurred !== null){
      const parse = String(sumInsurred);
      if(parse.includes('.')){
        const sp = parse.split('.');
        if(sp[1] === '0'){
          check = 0;
        }else{
          check = 1;
        }
      }
    }
    this.focusListener = navigation.addListener('didFocus', () => {
      this.setState({ formId: formId, sumInsurred:`${Number(sumInsurred).toFixed(check)}` });
      this.fetchCompany(formId, Number(sumInsurred).toFixed(check), true);
    });
  }

  fetchCompany = (id, sum_insured, isFirstTime) => {
    this.setState({ loading: true });
    const formData = new FormData();
    formData.append("id", id);
    formData.append("sum_insured", sum_insured);
    Helper.networkHelperContentType(
      Pref.AjaxWithoutToken,
      formData,
      Pref.methodPost,
      (result) => {
        const { type, company } = result;
        if (type === "success") {
          if (company.length > 0) {
            const list = company.map((e, index) => {
              const sp = e.split("$&");
              const cname = sp[1].split("(")[0].trim();
              return {
                companyid: sp[0],
                name: cname,
                og: e,
                id: index + 1,
                select: false,
              };
            });
            console.log('list',list)
            this.setState({ companyList: list, loading: false });
          }
        } else {
          this.setState({ companyList: [], loading: false });
        }
      },
      (error) => {
        console.log("er", error);
        this.setState({ companyList: [], loading: false });
      }
    );
  };

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
  }

  submitt = () => {
    const { companyList, sumInsurred, formId } = this.state;
    if (companyList.length === 0) {
      Helper.showToastMessage("Failed to find quote", 0);
      return false;
    }
    const map = Lodash.filter(companyList, {select:true});
    let finalUrl = "";
    if (map.length === 0) {
      Helper.showToastMessage("Please, Select Company", 0);
      return false;
    }else if (map.length > 3) {
      Helper.showToastMessage("Please, Select maximum 3 companies", 0);
      return false;
    }
    if (map.length === 1) {
      const compId = `${map[0]["id"]}`;
      finalUrl = `https://erb.ai/erbfinorbit/download_quote1.php?id=${formId}&product_id=${compId}&sum_insured=${sumInsurred}`;
    } else if (map.length === 2) {
      const compId = `${map[0]["id"]}$$${map[1]["id"]}`;
      finalUrl = `https://erb.ai/erbfinorbit/download_quote2.php?id=${formId}&product_id=${compId}&sum_insured=${sumInsurred}`;
    } else if (map.length === 3) {
      const compId = `${map[0]["id"]}$$${map[1]["id"]}$$${map[2]["id"]}`;
      finalUrl = `https://erb.ai/erbfinorbit/download_quote3.php?id=${formId}&product_id=${compId}&sum_insured=${sumInsurred}`;
    }
                console.log("map", map.length,finalUrl);

    this.setState({ modalvis: true, pdfurl: finalUrl });
  };

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
              default: { type: "url", content: url },
            },
            subject: {
              default: title,
            },
            linkMetadata: { originalUrl: url, url, title },
          },
          {
            placeholderItem: { type: "text", content: message },
            item: {
              default: { type: "text", content: message },
              message: null, // Specify no text to share via Messages app.
            },
          },
        ],
      },
      default: {
        title,
        subject: title,
        url: url,
        message: `${message}`,
      },
    });
    Share.open(options);
  };

  onChangeComp = (val, k, i) => {
    const { companyList } = this.state;
    const sel = !k.select;
    k.select = sel;
    companyList[i] = k;
    this.setState({ companyList: companyList });
  };

  render() {
    const { formId, sumInsurred, loading } = this.state;
    return (
      <CScreen
        absolute={
          <>
            <Modal
              visible={this.state.modalvis}
              setModalVisible={() =>
                this.setState({ pdfurl: "", modalvis: false })
              }
              ratioHeight={0.9}
              backgroundColor={`white`}
              topCenterElement={
                <Subtitle
                  style={{
                    color: "#555",
                    fontSize: 17,
                    fontWeight: "700",
                    letterSpacing: 0.5,
                  }}
                >
                  {"Your Quote"}
                </Subtitle>
              }
              topRightElement={
                <View styleName="horizontal">
                  <TouchableWithoutFeedback
                    onPress={() => Helper.downloadFile(this.state.pdfurl, "")}
                  >
                    <View>
                      <IconChooser
                        name="download"
                        size={24}
                        color={Pref.RED}
                        style={{
                          marginEnd: 8,
                        }}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={this.shareFile}>
                    <View>
                      <IconChooser name="share-2" size={24} color={"green"} />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              }
              children={
                <View
                  style={{
                    flex: 1,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "white",
                  }}
                >
                  <Pdf
                    source={{
                      uri: this.state.pdfurl,
                      cache: true,
                    }}
                    style={{
                      flex: 1,
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </View>
              }
            />
          </>
        }
        body={
          <>
            <LeftHeaders
              title={`Get Your Quote`}
              bottomtext={
                <>
                  {`Get Your `}
                  {<Title style={styles.passText}>{`Quote`}</Title>}
                </>
              }
              bottomtextStyle={{
                color: "#555555",
                fontSize: 20,
              }}
              showBack
            />

            <View styleName="md-gutter">
              <View style={styles.radiocont}>
                <Title style={styles.bbstyle}>{`Compnay Selection`}</Title>
                {this.state.companyList.length > 0 ? (
                  <View styleName="vertical" style={{ marginBottom: 8 }}>
                    {this.state.companyList.map((k, i) => {
                      return (
                        <RadioButton.Group
                          onValueChange={(value) =>
                            this.onChangeComp(value, k, i)
                          }
                          value={k.select === false ? "" : `${k.id}`}
                        >
                          <View styleName="horizontal">
                            <RadioButton
                              value={`${k.id}`}
                              style={{
                                alignSelf: "center",
                                justifyContent: "center",
                              }}
                            />
                            <Title
                              styleName="v-center h-center"
                              style={styles.textopen}
                            >{`${k.name}`}</Title>
                          </View>
                        </RadioButton.Group>
                      );
                    })}
                  </View>
                ) : loading === false ? (
                  <Title
                    styleName="v-start h-start"
                    style={StyleSheet.flatten([
                      styles.textopen,
                      {
                        paddingVertical: 10,
                        textAlign: "left",
                        alignSelf: "flex-start",
                      },
                    ])}
                  >{`No company found...`}</Title>
                ) : (
                  <View style={styles.loader}>
                    <ActivityIndicator />
                  </View>
                )}
              </View>

              <View style={styles.radiocont}>
                <Title
                  style={styles.bbstyle}
                >{`Choose Cover Required/Sum Insured`}</Title>

                <RadioButton.Group
                  onValueChange={(value) => {
                    this.setState({ sumInsurred: value });
                    this.fetchCompany(formId, value, false);
                  }}
                  value={this.state.sumInsurred}
                >
                  <View styleName="vertical" style={{ marginBottom: 8 }}>
                    <View
                      styleName="horizontal"
                      style={{
                        flexWrap: "wrap",
                      }}
                    >
                      {this.state.compTypeList.map((e) => {
                        return (
                          <View style={{ marginStart: 4, paddingVertical: 2 }}>
                            <RadioButton
                              value={`${e.value}`}
                              style={{
                                alignSelf: "center",
                                justifyContent: "center",
                              }}
                            />

                            <Title
                              styleName="v-center h-center"
                              style={styles.textopen}
                            >{`${e.name}`}</Title>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </View>

            <View styleName="horizontal space-between md-gutter v-end h-end">
              {/* <Button
                mode={'flat'}
                uppercase={true}
                dark={true}
                loading={false}
                style={styles.loginButtonStyle}
                onPress={this.login}>
                <Title style={styles.btntext}>{'Sign In'}</Title>
              </Button> */}
              <Button
                mode={"flat"}
                uppercase={false}
                dark={true}
                loading={false}
                style={styles.loginButtonStyle}
                onPress={this.submitt}
              >
                <Title style={styles.btntext}>{`Submit`}</Title>
              </Button>
            </View>
          </>
        }
      />
    );
  }
}

/**
 * styles
 */
const styles = StyleSheet.create({
  radiodownbox: {
    flexDirection: "column",
    height: 56,
    justifyContent: "space-between",
    paddingVertical: 10,
    marginBottom: 16,
  },
  textopen: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555555",
    lineHeight: 20,
    alignSelf: "center",
    marginStart: 4,
    letterSpacing: 0.5,
  },
  btntext: {
    color: "white",
    fontSize: 16,
    letterSpacing: 0.5,
    fontWeight: "700",
  },
  passText: {
    fontSize: 20,
    letterSpacing: 0.5,
    color: Pref.RED,
    fontWeight: "700",
    lineHeight: 36,
    alignSelf: "center",
    justifyContent: "center",
    textAlign: "center",
    paddingVertical: 16,
  },
  inputStyle: {
    height: sizeHeight(8),
    backgroundColor: "white",
    color: "#292929",
    borderBottomColor: "#dedede",
    fontFamily: "Rubik",
    fontSize: 16,
    borderBottomWidth: 1,
    fontWeight: "400",
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
  },
  boxstyle: {
    flexDirection: "row",
    height: 48,
    borderBottomColor: Colors.grey300,
    borderRadius: 2,
    borderBottomWidth: 0.6,
    marginVertical: sizeHeight(1),
    justifyContent: "space-between",
  },
  inputPassStyle: {
    height: sizeHeight(8),
    backgroundColor: "white",
    color: "#292929",
    borderBottomColor: "#dedede",
    fontFamily: "Rubik",
    fontSize: 16,
    borderBottomWidth: 1,
    fontWeight: "400",
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
    marginVertical: sizeHeight(1),
  },
  inputPass1Style: {
    height: sizeHeight(8),
    backgroundColor: "white",
    color: "#292929",
    fontFamily: "Rubik",
    fontSize: 16,
    fontWeight: "400",
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
    marginTop: -7,
  },
  loginButtonStyle: {
    color: "white",
    backgroundColor: Pref.RED,
    textAlign: "center",
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 0.5,
    borderRadius: 48,
    width: "40%",
    paddingVertical: 4,
    fontWeight: "700",
  },
  boxsubtitle: {
    fontSize: 16,
    fontFamily: "Rubik",
    fontWeight: "400",
    color: "#292929",
    lineHeight: 25,
    alignSelf: "center",
    padding: 4,
    alignSelf: "center",
    marginHorizontal: 8,
  },
  bbstyle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6d6a57",
    lineHeight: 20,
    marginStart: 4,
    letterSpacing: 0.5,
    paddingVertical: 10,
  },
  radiocont: {
    marginStart: 10,
    marginEnd: 10,
    borderBottomWidth: 1.3,
    borderBottomColor: "#f2f1e6",
    alignContent: "center",
    paddingVertical: 10,
  },
  copy: {
    marginStart: 10,
    marginEnd: 10,
    alignContent: "center",
    paddingVertical: 10,
  },
  loader: {
    justifyContent: "center",
    alignSelf: "center",
    flex: 1,
    marginVertical: 48,
    paddingVertical: 48,
  },
});
