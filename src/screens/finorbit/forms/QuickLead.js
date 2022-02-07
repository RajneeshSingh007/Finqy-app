import React from "react";
import { Pressable, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Title, View } from "@shoutem/ui";
import * as Helper from "../../../util/Helper";
import * as Pref from "../../../util/Pref";
import { Colors, Button, Checkbox } from "react-native-paper";
import { sizeHeight, sizeWidth } from "../../../util/Size";
import NewDropDown from "../../component/NewDropDown";
import Loader from "../../../util/Loader";
import { quickLeadFormCheck } from "../../../util/FormCheckHelper";
import NavigationActions from "../../../util/NavigationActions";
import { ScrollView } from "react-native-gesture-handler";
import IconChooser from "../../common/IconChooser";
import CommonForm from "../CommonForm";
import FileUploadForm from "../FileUploadForm";
import Lodash from "lodash";

const categoryList = [{
  value:'Credit Card',
  name:'Credit Card'
},{
  value:'Loan',
  name:'Loan'
},{
  value:'Insurance',
  name:'Insurance'
},{
  value:'Investment',
  name:'Investment'
}]

export default class QuickLead extends React.PureComponent {
  constructor(props) {
    super(props);
    this.commonFormRef = React.createRef();
    this.FileUploadFormRef = React.createRef();
    this.token = "";
    this.userData = null;
    this.state = {
      productsList:[],
      catList:'',
      productName: "",
      disableClick: 0,
      progressLoader: false,
      showFileUpload: false,
    };
    Pref.getVal(Pref.saveToken, (value) => {
      this.token = value;
      Pref.getVal(Pref.userData, (userData) => {
        this.userData = userData;
      });
    });
  }

  componentDidMount() {
    Pref.getVal(Pref.saveToken, (value) => {
      this.token = value;
      Pref.getVal(Pref.userData, (userData) => {
        this.userData = userData;
      });
    });
  }

  /**
   * submit form
   */
  formSubmit = () => {
    const { disableClick, productName } = this.state;
    const formState = JSON.parse(
      JSON.stringify(this.commonFormRef.current.state)
    );
    let checkData = true;
    formState.productName = productName;
    formState.catList = this.state.catList;
    checkData = quickLeadFormCheck(formState);
    if (checkData) {
      if (disableClick === 0) {
        this.setState({ progressLoader: true, disableClick: 1 }, () => {
          this.forceUpdate();
        });
        const { refercode } = this.userData;
        let formData = new FormData();
        let formName = productName.toLowerCase().replace(/\s/g, "_").trim();
        if (formName === "test_my_policy") {
          formName += `_form`;
        }

        //files
        if (
          this.state.showFileUpload &&
          this.FileUploadFormRef !== undefined &&
          this.FileUploadFormRef.current !== undefined
        ) {
          const allfileslist = this.FileUploadFormRef.current.state.fileList;
          if (allfileslist !== undefined && allfileslist.length > 0) {
            const loops = Lodash.map(allfileslist, (ele) => {
              let parseJs = JSON.parse(JSON.stringify(ele));
              Object.entries(parseJs).forEach(([key, value]) => {
                if (Helper.arrayObjCheck(value, false)) {
                  formData.append(key, value);
                }
              });
            });
          }
          const fileListForms = this.FileUploadFormRef.current.state;
          const popItemList = fileListForms.popitemList;
          let property = "";
          if (
            popItemList !== undefined &&
            popItemList != null &&
            popItemList.length > 0
          ) {
            Lodash.map(popItemList, (io) => {
              const { value } = io;
              if (Helper.nullStringCheck(value) === false) {
                property += `${value},`;
              }
            });
          }

          formData.append("exisitng_loan_doc", fileListForms.exisitng_loan_doc);
          formData.append("proof_of_property", property);
          formData.append("current_add_proof", fileListForms.current_add_proof);

          if (formName === "personal_loan") {
            formData.append("statement_bank", fileListForms.statement_bank);
            formData.append("bstatepass", fileListForms.bstatepass);
            formData.append("account_type", fileListForms.account_type);
          } else if (formName === "credit_card") {
            formData.append("docnameother", fileListForms.docnameother);
            formData.append("docnameother2", fileListForms.docnameother2);
            formData.append("docnameother3", fileListForms.docnameother3);
            formData.append("docnameother4", fileListForms.docnameother4);
            formData.append("docnameother5", fileListForms.docnameother5);
          }
        }

        formData.append(formName, formName);
        formData.append("ref", refercode);
        formData.append("frommobile", "frommobile");
        formData.append("quicklead", "app");

        delete formState.maxDate;
        delete formState.currentDate;
        if (formState.currentlocation === "Select Current Location *") {
          formState.currentlocation === "";
        }
        Object.entries(formState).forEach(([key, value]) => {
          if (Helper.arrayObjCheck(value, true)) {
            formData.append(key, value);
          }
        });

        const formUrls = `${Pref.FinorbitFormUrl}${formName}.php`;

        //console.log("formData", formData, formUrls);

        Helper.networkHelperTokenContentType(
          formUrls,
          formData,
          Pref.methodPost,
          this.token,
          (result) => {
            const { response_header } = result;
            const { res_type } = response_header;
            if (res_type === "success") {
              this.props.close();
              this.setState({ progressLoader: false });
              Helper.showToastMessage("Form submitted successfully", 1);
              //this.finishForm();
            } else {
              this.props.close();
              this.setState({ progressLoader: false });
              Helper.showToastMessage("Failed to submit form", 0);
            }
          },
          (e) => {
            console.log(e);
            this.props.close();
            this.setState({ progressLoader: false });
            Helper.showToastMessage("Something went wrong", 0);
          }
        );
      }
    }
  };

  finishForm = () => {
    const editMode = false;
    let backScreenName = editMode === false ? "FinorbitScreen" : "LeadList";
    //for dialer screen

    if (Helper.nullStringCheck(this.state.dialerMobile) === false) {
      backScreenName = "DialerCalling";
    }

    //finish screen
    NavigationActions.navigate("Finish", {
      top: editMode === false ? "Add New Lead" : "Edit Lead",
      red: "Success",
      grey: editMode === false ? "Details uploaded" : "Details updated",
      blue: editMode === false ? "Add another lead?" : "Back to Lead Record",
      back: backScreenName,
    });
  };

  getFilterList = (list,catList = '') => {
    let filter = Lodash.filter(list, (io) => {
      if (catList.includes('Insurance')) {
        return io.value.includes(catList) || io.value.includes('Policy') || io.value.includes('Sabse') || io.value.includes('Insure Check') || io.value.includes('Vector')
      } else {
        return io.value.includes(catList);
      }
    });
    if (catList.includes('Investment')) {
      filter = Lodash.filter(
        list,
        (io) =>
          !io.value.includes('Loan') &&
          !io.value.includes('Insurance') &&
          !io.value.includes('Credit') && !io.value.includes('Vector') && !io.value.includes('Policy') && !io.value.includes('Sabse') && !io.value.includes('Insure Check')
      );
    }
    return filter;
  };

  render() {
    return (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <Loader
          isShow={this.state.progressLoader}
          bottomText={"Please do not press back button"}
        />
        <View style={{ flex: 0.1 }}>
          <Title style={styles.passText}>{`Quick Lead`}</Title>
          <TouchableWithoutFeedback onPress={() => this.props.close()}>
            <View style={{ position: "absolute", right: 16, top: 16 }}>
              <IconChooser name={"x"} size={24} />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={{ flex: 0.9 }}>
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <View>
              <View styleName="md-gutter">

              <NewDropDown
                  list={[...categoryList]}
                  placeholder={"Select Category *"}
                  selectedItem={(value) =>{
                    const cloneProducts = [...Helper.productShareList()];
                    const productsList = cloneProducts.filter(
                      (io) =>
                      io.value !== "Test My Policy" &&
                      io.value !== "Insure Check" &&
                      io.value !== "Insurance Samadhan"
                    );
                    const pList = this.getFilterList(productsList, value);
                    this.setState({ catList: value, productName:'', productsList:pList });
                  }}
                  value={this.state.catList}
                  style={styles.newdropdowncontainers}
                  textStyle={styles.newdropdowntextstyle}
                />

                <NewDropDown
                  list={this.state.productsList}
                  placeholder={"Select Product *"}
                  selectedItem={(value) =>
                    this.setState({ productName: value })
                  }
                  value={this.state.productName}
                  style={styles.newdropdowncontainers}
                  textStyle={styles.newdropdowntextstyle}
                />
                <CommonForm
                  ref={this.commonFormRef}
                  showemploy={false}
                  title={""}
                  quickLeads
                />

                <View styleName="horizontal v-center" style={{ marginTop: 16 }}>
                  <Checkbox.Android
                    status={this.state.showFileUpload ? "checked" : "unchecked"}
                    selectedColor={Pref.PRIMARY_COLOR}
                    onPress={() =>
                      this.setState({
                        showFileUpload: !this.state.showFileUpload,
                      })
                    }
                  />
                  <Title style={styles.subtitle}>{`Upload Files?`}</Title>
                </View>

                {this.state.productName !== "" && this.state.showFileUpload ? (
                  <FileUploadForm
                    ref={this.FileUploadFormRef}
                    title={this.state.productName}
                    editMode={false}
                    quickLeads
                  />
                ) : null}
              </View>

              <View
                styleName={
                  this.state.currentPosition > 0
                    ? `horizontal space-between md-gutter`
                    : `horizontal space-between md-gutter v-end h-end`
                }
              >
                <Button
                  mode={"flat"}
                  uppercase={false}
                  dark={true}
                  loading={false}
                  style={styles.loginButtonStyle}
                  onPress={() => this.formSubmit(false)}
                >
                  <Title style={styles.btntext}>{`Submit`}</Title>
                </Button>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

/**
 * styles
 */
const styles = StyleSheet.create({
  radiocont: {
    marginStart: 10,
    marginEnd: 10,
    borderBottomWidth: 1.3,
    borderBottomColor: "#f2f1e6",
    alignContent: "center",
  },
  dropdownnewtext: {
    color: "#6d6a57",
    fontSize: 14,
    fontFamily: Pref.getFontName(4),
  },
  dropdownnewcontainer: {
    borderRadius: 0,
    borderBottomColor: "#f2f1e6",
    borderBottomWidth: 1.3,
    borderWidth: 0,
    marginStart: 10,
    marginEnd: 10,
    paddingVertical: 10,
  },
  newdropdowntextstyle: {
    color: "#6d6a57",
    fontSize: 14,
    fontFamily: Pref.getFontName(4),
  },
  newdropdowncontainers: {
    borderRadius: 0,
    borderBottomColor: "#f2f1e6",
    borderBottomWidth: 1.3,
    borderWidth: 0,
    marginStart: 10,
    marginEnd: 10,
    paddingVertical: 10,
  },
  radiocont: {
    marginStart: 10,
    marginEnd: 10,
    borderBottomWidth: 1.3,
    borderBottomColor: "#f2f1e6",
    alignContent: "center",
  },
  radiocont1: {
    marginStart: 10,
    marginEnd: 10,
    alignContent: "center",
  },
  animatedInputCont: {
    marginStart: 10,
    marginEnd: 10,
    //paddingVertical: 10,
  },
  line: {
    marginStart: 10,
    marginEnd: 10,
    borderBottomWidth: 1.3,
    borderBottomColor: "#f2f1e6",
    alignContent: "center",
    marginTop: 4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Pref.getFontName(1),
    fontFamily: "bold",
    letterSpacing: 1,
    color: "#6d6a57",
    alignSelf: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6d6a57",
    lineHeight: 20,
    alignSelf: "center",
    marginStart: 4,
  },
  inputStyle: {
    height: sizeHeight(7.5),
    backgroundColor: "white",
    color: "#6d6a57",
    borderBottomColor: Colors.grey300,
    fontFamily: "Rubik",
    fontSize: 16,
    borderBottomWidth: 0.6,
    fontWeight: "400",
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
  },
  loginButtonStyle: {
    height: 40,
    color: "white",
    marginHorizontal: sizeWidth(3),
    marginVertical: sizeHeight(3.5),
    backgroundColor: "#e61e25",
    textAlign: "center",
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 1,
  },
  dropdownbox: {
    flexDirection: "row",
    height: 56,
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  radiodownbox: {
    flexDirection: "column",
    height: 56,
    justifyContent: "space-between",
    paddingVertical: 10,
    marginBottom: 16,
  },
  boxsubtitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6d6a57",
    lineHeight: 20,
    alignSelf: "center",
    marginStart: 4,
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
  bbstyle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6d6a57",
    lineHeight: 20,
    marginStart: 4,
  },
  downIcon: {
    alignSelf: "center",
  },
  textstyle12: {
    fontSize: 14,
    fontWeight: "700",
    color: Pref.RED,
    lineHeight: 20,
    marginStart: 8,
    paddingVertical: 8,
    marginVertical: 4,
  },
  dropdowntextstyle: {
    color: "#6d6a57",
    fontSize: 14,
    fontFamily: Pref.getFontName(4),
  },
  dropdownmulticontainer: {
    borderRadius: 0,
    borderBottomColor: "#f2f1e6",
    borderBottomWidth: 1.3,
    borderWidth: 0,
    marginStart: 10,
    marginEnd: 10,
    paddingVertical: 10,
  },
  loader: {
    justifyContent: "center",
    alignSelf: "center",
    flex: 1,
    marginVertical: 48,
    paddingVertical: 48,
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
    height: 48,
    color: "white",
    backgroundColor: Pref.RED,
    textAlign: "center",
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 0.5,
    borderRadius: 48,
    width: "40%",
    fontWeight: "700",
  },
  btntext: {
    color: "white",
    fontSize: 15,
    letterSpacing: 0.5,
    fontWeight: "700",
    fontFamily: Pref.getFontName(4),
  },
  downIcon: {
    alignSelf: "center",
  },
});
