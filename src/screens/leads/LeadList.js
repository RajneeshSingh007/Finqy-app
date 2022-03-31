import React from "react";
import {
  StyleSheet,
  BackHandler,
  TouchableWithoutFeedback,
  FlatList,
  ScrollView,
} from "react-native";
import { Subtitle, Title, View, Text } from "@shoutem/ui";
import * as Helper from "../../util/Helper";
import * as Pref from "../../util/Pref";
import { Button, ActivityIndicator, Searchbar } from "react-native-paper";
import { sizeHeight } from "../../util/Size";
import Lodash from "lodash";
import LeftHeaders from "../common/CommonLeftHeader";
import ListError from "../common/ListError";
import CommonTable from "../common/CommonTable";
import RNFetchBlob from "rn-fetch-blob";
import IconChooser from "../common/IconChooser";
import Pdf from "react-native-pdf";
import Modal from "../../util/Modal";
import Share from "react-native-share";
import CustomForm from "./../finorbit/CustomForm";
import CScreen from "./../component/CScreen";
import Download from "./../component/Download";
import NavigationActions from "../../util/NavigationActions";
import {
  constructObjEditLead,
  constructObjEditMotor,
  constructObjEditSamadhan,
  constructObjEditTmp,
} from "../../util/FormCheckHelper";
import FileUploadForm from "../finorbit/FileUploadForm";
import PaginationNumbers from "../component/PaginationNumbers";
import moment from "moment";
import WebView from "react-native-webview";
import Loader from '../../util/Loader';

let HEADER = `Sr. No.,Date,Modified Date,Lead No,Source,Customer Name,Mobile No,Product,Company,Status,CIF,Remark,Backend Remark\n`;
let FILEPATH = `${RNFetchBlob.fs.dirs.DownloadDir}/`;

const ITEM_LIMIT = 10;

export default class LeadList extends React.PureComponent {
  constructor(props) {
    super(props);
    const date = new Date();
    this.clickedexport = this.clickedexport.bind(this);
    this.backclick = this.backclick.bind(this);
    this.invoiceViewClick = this.invoiceViewClick.bind(this);
    this.cifClick = this.cifClick.bind(this);
    //this.quotesClick = this.quotesClick.bind(this);
    this.emailSubmit = this.emailSubmit.bind(this);
    this.quoteEmailClicked = this.quoteEmailClicked.bind(this);
    this.headerchange = false;
    this.formLinks = null;
    this.state = {
      dataList: [],
      loading: false,
      showCalendar: false,
      currentDate: date,
      dates: "",
      token: "",
      userData: "",
      tableHead: [
        "Sr. No.",
        "Date",
        "Last Modified",
        "Lead No",
        "Source",
        "Customer Name",
        "Mob. No",
        "Product",
        "Company",
        "Status",
        "Files",
        //'Email Quote',
        "CIF",
        //'Policy',
        "Remark",
        "Backend Remark",
        "Eligibility Reports",
        "Edit",
      ],
      widthArr: [
        60, 120, 120, 100, 100, 160, 100, 140, 120, 140,
        //80,
        60,
        //100,
        80, 160, 160,180, 60,
      ],
      cloneList: [],
      modalvis: false,
      pdfurl: "",
      pdfTitle: "",
      quotemodalVis: false,
      quotemailData: "",
      quotemail: "",
      type: "",
      itemSize: ITEM_LIMIT,
      disableNext: false,
      disableBack: false,
      searchQuery: "",
      enableSearch: false,
      orderBy: "asc",
      fileName: "",
      downloadFormTitle: "",
      downloadModal: false,
      editThird: null,
      flag: 2,
      backScreen: null,
      editFirst: null,
      editSecond: null,
      activeRowData: null,
      quotemailType: -1,
      tmpPolicy: null,
      tmpPolicyIssued: null,
      backendRemarkShow: false,
      backendRemark: "",
      currentLeadID: "",
      downloadFormUrl: "",
      progressLoader:false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.backclick);
    const { navigation } = this.props;
    this.willfocusListener = navigation.addListener("willFocus", () => {
      this.setState({ loading: true, dataList: [] });
    });
    this.focusListener = navigation.addListener("didFocus", () => {
      Pref.getVal(Pref.WEBVIEW_FORMS, (value) => {
        this.formLinks = value;
      });
      Pref.getVal(Pref.userData, (userData) => {
        this.setState({ userData: userData });
        Pref.getVal(Pref.USERTYPE, (v) => {
          this.setState({ type: v }, () => {
            const { navigation } = this.props;
            const ref = navigation.getParam("ref", null);
            var flag = navigation.getParam("flag", 2);
            if (v !== "referral") {
              flag = 1;
            }
            const backScreen = navigation.getParam("backScreen", null);
            Pref.getVal(Pref.saveToken, (value) => {
              this.setState(
                {
                  type: v,
                  token: value,
                  backScreen: backScreen,
                  flag: flag,
                  ref: ref,
                },
                () => {
                  this.fetchData();
                }
              );
            });
          });
        });
      });
    });
  }

  backclick = () => {
    const { modalvis, backScreen, flag } = this.state;
    if (modalvis) {
      this.setState({ modalvis: false, pdfurl: "" });
      return true;
    }
    if (flag === 1 && Helper.nullStringCheck(backScreen) === false) {
      this.setState({ backScreen: null });
      NavigationActions.navigate(backScreen);
      return true;
    } else {
      NavigationActions.goBack();
      BackHandler.removeEventListener("hardwareBackPress", this.backclick);
      return true;
    }
    //return false;
  };

  componentWillUnMount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backclick);
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  fetchData = () => {
    //referral
    this.setState({ loading: true });
    const { type, ref, flag } = this.state;
    const { refercode, username } = this.state.userData;
    const body = JSON.stringify({
      refercode: ref === null ? refercode : ref,
      team_user: username,
      flag: flag,
      type: type,
    });
    //console.log('body', body,this.state.token);
    //console.log(Pref.LeadRecordUrl, body)
    Helper.networkHelperTokenPost(
      Pref.LeadRecordUrl,
      body,
      Pref.methodPost,
      this.state.token,
      (result) => {
        const { data, response_header } = result;
        //console.log('data', data);
        const { res_type } = response_header;
        if (res_type === `success`) {
          if (data.length > 0) {
            // const sorting = data.sort((a, b) => {
            //   if (Helper.nullStringCheck(a.modified_date) === false) {
            //     const splita = a.modified_date.split(/\s/g);
            //     const splitb = b.modified_date.split(/\s/g);
            //     const sp = splita[0].split("-");
            //     const spz = splitb[0].split("-");
            //     return (
            //       Number(sp[2]) - Number(spz[2]) ||
            //       Number(sp[1]) - Number(spz[1]) ||
            //       Number(sp[0]) - Number(spz[0])
            //     );
            //   } else {
            //     const sp = a.date.split("-");
            //     const spz = b.date.split("-");
            //     return (
            //       Number(sp[2]) - Number(spz[2]) ||
            //       Number(sp[1]) - Number(spz[1]) ||
            //       Number(sp[0]) - Number(spz[0])
            //     );
            //   }
            // });
            const sort = Lodash.sortBy(data,['modified_date']).reverse();
            //.reverse();
            const { itemSize } = this.state;
            this.setState({
              cloneList: sort,
              dataList: this.returnData(sort, 0, sort.length).slice(
                0,
                itemSize
              ),
              loading: false,
              itemSize: sort.length <= ITEM_LIMIT ? sort.length : ITEM_LIMIT,
            });
          } else {
            this.setState({
              loading: false,
            });
          }
        } else {
          this.setState({ loading: false });
        }
      },
      (e) => {
        this.setState({ loading: false });
      }
    );
  };

  editLead = (item) => {
    const { id = "", ref = "" } = item.alldata;
    const { product } = item;
    //console.log('item', item)
    let pname = "";
    if (product === "Mutual Fund") {
      pname = "Mutual Fund";
    } else if (product === `Health Insurance`) {
      pname = `Health Insurance`;
    } else if (product === `Life Cum Investment`) {
      pname = `Life Cum Invt. Plan`;
    } else {
      pname = product;
    }
    //console.log('product', product);
    if (product === "Insurance Samadhan") {
      NavigationActions.navigate("Samadhan", {
        leadData: constructObjEditSamadhan(item),
        title: pname,
        url: "",
        edit: true,
      });
    } else if (product === "Tmp" || product === "Test My Policy") {
      NavigationActions.navigate("TestMyPolicy", {
        leadData: constructObjEditTmp(item),
        edit: true,
      });
    } else if (
      product === "Sbi Credit Card" ||
      product === "SBI Credit Card" ||
      product === "sbi_credit_card"
    ) {
      // NavigationActions.navigate('SbiCard', {
      //   leadData: constructObjEditSbicc(item),
      //   edit: true,
      // });
      const { sbi_edit_form = "" } = this.formLinks;
      NavigationActions.navigate("WebForm", {
        url: `${sbi_edit_form}ref=${ref}&lead_no=${id}`,
        title: "SBI Credit Card",
        redirect: "thank",
        editMode: true,
      });
    } else if (product === "Personal Loan" || product === "personal_loan") {
      const { pl_edit_form = "" } = this.formLinks;
      NavigationActions.navigate("WebForm", {
        url: `${pl_edit_form}ref=${ref}&lead_no=${id}`,
        title: "Edit Personal Loan",
        redirect: "thank",
        editMode: true,
      });
    } else if (product === "Motor Insurance") {
      NavigationActions.navigate("MotorInsurance", {
        leadData: constructObjEditMotor(item),
        edit: true,
      });
    } else {
      NavigationActions.navigate("FinorbitForm", {
        leadData: constructObjEditLead(item),
        title: pname,
        url: "",
        edit: true,
      });
    }
  };

  downloadFile = (item) => {
    const { id = "", ref = "" } = item.alldata;
    const { product, quotes, policy, policyissued, cif_file } = item;
    //policy, quote
    let pname = "";
    if (product === "Mutual Fund") {
      pname = "Mutual Fund";
    } else if (product === `Health Insurance`) {
      pname = `Health Insurance`;
    } else if (product === `Life Cum Investment`) {
      pname = `Life Cum Invt. Plan`;
    } else {
      pname = product;
    }
    const getAll = constructObjEditLead(item);
    if (
      Helper.nullCheck(getAll.first) === false &&
      Helper.nullStringCheck(getAll.first.employ) === false
    ) {
      if (
        (pname === "Home Loan" || pname === "Loan Against Property") &&
        getAll.first &&
        getAll.first.employ === "Salaried"
      ) {
        this.headerchange = true;
      } else if (
        (pname === "Home Loan" || pname === "Loan Against Property") &&
        getAll.first &&
        getAll.first.employ === "Self Employed"
      ) {
        this.headerchange = false;
      }
    }
    const { pl_edit_form = "", sbi_edit_form = "" } = this.formLinks;
    let downloadFormUrl = "";
    if (pname === "Personal Loan") {
      downloadFormUrl = `${pl_edit_form}ref=${ref}&lead_no=${id}`;
    } else if (
      pname === "Sbi Credit Card" ||
      pname === "SBI Credit Card" ||
      pname === "sbi_credit_card"
    ) {
      downloadFormUrl = `${sbi_edit_form}ref=${ref}&lead_no=${id}`;
    }
    //console.log(downloadFormUrl, pname);
    this.setState({
      downloadFormTitle: pname === "Tmp" ? "TMP" : pname,
      downloadFormUrl: downloadFormUrl,
      downloadModal: true,
      editThird: getAll.third,
      editSecond: getAll.second,
      editFirst: getAll.first,
      quotes: quotes,
      policy: policy,
      activeRowData: item,
      cif: cif_file,
      tmpPolicy: policy,
      tmpPolicyIssued: policyissued,
      //pname === 'TMP' ? constructObjEditTmp(item) : null
    });
  };
  

  /**
   * eligibility button clicked
   * @param {*} item 
   */
  eligibiltiyClicked = (item) =>{
   this.setState({downloadFormTitle:"eligibility", downloadFormUrl:item.eligibilityreport, downloadModal:true})
  }

  /**
   *
   * @param {*} data
   */
  returnData = (sort, start = 0, end) => {
    const dataList = [];
    if (sort.length > 0) {
      if (start >= 0) {
        for (let i = start; i < end; i++) {
          const item = sort[i];
          if (item !== undefined && item !== null) {
            const {
              quotes,
              mail,
              sharewhatsapp,
              sharemail,
              policy,
              modified_date,
            } = item;
            const { alldata } = item;
            const { event_descrip } = alldata;
            //const parsedate = moment(modified_date).format("DD-MM-YYYY");
            const rowData = [];
            rowData.push(`${Number(i + 1)}`);
            rowData.push(item.date);
            rowData.push(modified_date);
            rowData.push(item.leadno);
            rowData.push(item.source_type);
            rowData.push(item.name);
            rowData.push(item.mobile);
            rowData.push(item.product);
            rowData.push(
              item.bank === "null" || item.bank === "" ? "" : item.bank
            );
            rowData.push(item.status);
            // const quotesView = (value, mail) => (
            //   <View
            //     style={{
            //       flexDirection: 'row',
            //       alignSelf: 'center',
            //       alignItems: 'center',
            //       justifyContent: 'center',
            //     }}>
            //     {value !== '' ? (
            //       <TouchableWithoutFeedback
            //         onPress={() => this.quotesClick(value, 'Quote')}>
            //         <View>
            //           <IconChooser
            //             name={value.includes('png') ? `download` : `file-pdf`}
            //             size={20}
            //             iconType={value.includes('png') ? 0 : 5}
            //             color={`#9f9880`}
            //           />
            //         </View>
            //       </TouchableWithoutFeedback>
            //     ) : null}
            //     {mail !== '' ? (
            //       <TouchableWithoutFeedback
            //         onPress={() => this.quotesClick(mail, 'Mail')}>
            //         <View style={{marginStart: 8}}>
            //           <IconChooser
            //             name={'mail'}
            //             size={20}
            //             iconType={0}
            //             color={`#9f9880`}
            //           />
            //         </View>
            //       </TouchableWithoutFeedback>
            //     ) : null}
            //   </View>
            // );
            // rowData.push(quotesView(quotes, mail));

            const downloadView = (value) => (
              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableWithoutFeedback
                  onPress={() => this.downloadFile(value)}
                >
                  <View>
                    <IconChooser
                      name={`download`}
                      size={20}
                      color={`#0270e3`}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            );
            if (
              Helper.nullCheck(item.downloadenable) === false &&
              item.downloadenable === 0
            ) {
              rowData.push(downloadView(item));
            } else {
              rowData.push("");
            }
            const shareView = (value, mail) => (
              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {value !== "" ? (
                  <TouchableWithoutFeedback
                    onPress={() => this.cifClick(value, false)}
                  >
                    <View>
                      <IconChooser
                        name={`whatsapp`}
                        size={20}
                        iconType={2}
                        color={`#1bd741`}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                ) : null}
                {mail !== "" ? (
                  <TouchableWithoutFeedback
                    onPress={() => this.cifClick(value, true)}
                  >
                    <View style={{ marginStart: 8 }}>
                      <IconChooser
                        name={"mail"}
                        size={20}
                        iconType={0}
                        color={`#9f9880`}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                ) : null}
              </View>
            );
            if(Helper.nullCheck(item.cifEnable) === false){
              if(item.cifEnable === 1){
                rowData.push(shareView(sharewhatsapp, sharemail));
              }else{
                rowData.push("");
              }
            }else{
              rowData.push("");
            }
            // const policyView = value => (
            //   <View
            //     style={{
            //       flexDirection: 'row',
            //       alignSelf: 'center',
            //       alignItems: 'center',
            //       justifyContent: 'center',
            //     }}>
            //     <TouchableWithoutFeedback
            //       onPress={() => this.invoiceViewClick(value, 'Policy')}>
            //       <View>
            //         <IconChooser
            //           name={`download`}
            //           size={20}
            //           iconType={2}
            //           color={`#9f9880`}
            //         />
            //       </View>
            //     </TouchableWithoutFeedback>
            //   </View>
            // );
            // rowData.push(policy === '' ? '' : policyView(policy));
            rowData.push(item.remark);

            const eventDescView = (value, id) => (
              <TouchableWithoutFeedback
                onPress={() =>
                  this.setState({
                    currentLeadID: id,
                    backendRemarkShow: true,
                    backendRemark: value,
                  })
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignSelf: "center",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Title style={styles.event}>
                    {Lodash.truncate(value, { length: 22, separator: "..." })}
                  </Title>
                </View>
              </TouchableWithoutFeedback>
            );

            let backendRemark = event_descrip;
            if (Helper.nullStringCheck(backendRemark)) {
            } else if (backendRemark.length > 22) {
              backendRemark = `${event_descrip} More`;
            }
            rowData.push(eventDescView(backendRemark, item.leadno));
            
            //eligibilityReport check
            const checkEligibilityReportView = (value) => (
              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                    mode={"flat"}
                    uppercase={true}
                    dark={true}
                    loading={false}
                    style={value.eligibilityreport.includes('eligibility_api') ? styles.eligibilitybutton : styles.eligibilitybuttonDownload}
                    onPress={() => this.eligibiltiyClicked(value)}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 14,
                      }}
                    >
                      {value.eligibilityreport.includes('eligibility_api') ? 'Check' : `Download`}
                    </Text>
                </Button>
              </View>
            );
            if (
              Helper.nullCheck(item.eligibilityreport) === false &&
              item.eligibilityreport != ""
            ) {
              rowData.push(checkEligibilityReportView(item));
            } else {
              rowData.push("");
            }

            const editView = (value) => (
              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableWithoutFeedback onPress={() => this.editLead(value)}>
                  <View>
                    <IconChooser name={`edit-2`} size={20} color={`#9f9880`} />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            );
            if (
              Helper.nullCheck(item.editenable) === false &&
              item.editenable === 0
            ) {
              rowData.push(editView(item));
            } else {
              rowData.push("");
            }

            dataList.push(rowData);
          }
        }
      }
    }
    return dataList;
  };

  // sortData = (key) => {
  //   const { dataList,orderBy } = this.state;
  //   //const orderchangedlist = Lodash.orderBy(dataList, [key], ['desc'])
  //   //console.log('orderchangedlist', orderchangedlist, dataList);
  //   var result = Lodash.orderBy(dataList, item => item[key], [orderBy]);
  //   result = Lodash.map(result, (item, index) =>{
  //     item[0] = Number(index+1);
  //     return item;
  //   })
  //   //console.log('result', result)
  //   this.setState({ dataList: result,orderBy:orderBy === 'asc' ? 'desc' : 'asc'})
  // }

  // headerItem = (title, key) => {
  //   const item =
  //     <TouchableWithoutFeedback
  //       onPress={() => this.sortData(key)}>
  //       <View
  //         style={{
  //           flexDirection: 'row',
  //           alignSelf: 'center',
  //           alignItems: 'center',
  //           justifyContent: 'center',
  //         }}>
  //         <Title style={{
  //           textAlign: 'center',
  //           fontWeight: '700',
  //           color: '#656259',
  //           fontSize: 16,
  //         }}>
  //           {title}
  //         </Title>
  //         <View>
  //           <IconChooser
  //             name={`sort`}
  //             size={18}
  //             iconType={2}
  //             color={`#555555`}
  //             style={{
  //               marginStart: 6
  //             }}
  //           />
  //         </View>
  //       </View>
  //     </TouchableWithoutFeedback>
  //   return item;
  // }

  /**
   * mode single, multiple
   * @param {*} value
   * @param {*} mode
   */
  cifClick = (value, mode) => {
    const { userData } = this.state;
    const sp = value.split("@");
    const url = ``;
    const title = mode ? "CIF Details" : "";
    const username =
      Helper.nullCheck(userData.rname) === false
        ? userData.rname
        : userData.username;
    const mobile =
      Helper.nullCheck(userData.rcontact) === false
        ? userData.rcontact
        : userData.mobile;
    const message = `Dear Customer,\n\nGreeting for the day :)\n\nPlease find below the CIF as desired.\n\n${sp[0]}
    \n\nFor further details contact:\n\nRP name : ${username}\n\nMobile no : ${mobile}\n\nRegards\n\nTeam Finqy`;
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
    const body = JSON.stringify({
      fid: `${sp[1]}`,
      form_name: `${sp[2]}`,
    });
    Helper.networkHelperTokenPost(
      Pref.AjaxUrl,
      body,
      Pref.methodPost,
      this.state.token,
      (result) => {
        //console.log(`result`, result);
      },
      (e) => {
        //console.log('e', e);
      }
    );
    if (mode === true) {
      options.social = Share.Social.EMAIL;
    } else {
      options.social = Share.Social.WHATSAPP;
      options.whatsAppNumber = "";
    }
    Share.shareSingle(options);
  };

  /**
   * quotes email sharing
   * type: if 1 then quotes : cif
   */
  quoteEmailClicked = (type) => {
    const { activeRowData } = this.state;
    const { mail } = activeRowData;
    const sp = mail.split("@");
    this.setState({
      downloadModal: false,
      quotemodalVis: true,
      quotemailData: mail,
      quotemail: type == 2 ? "" : sp[0].includes("@") ? sp[0] : "",
      quotemailType: type,
    });
  };

  /**
   * quote whatsapp sharing
   */
  quoteWhatsappClicked = () => {
    const { activeRowData, userData } = this.state;
    const { mail } = activeRowData;
    const splitmails = mail.split("@");
    const quoteLink = `${Pref.CORP_USER_QLINK}${splitmails[1]}`;
    const username =
      Helper.nullCheck(userData.rname) === false
        ? userData.rname
        : userData.username;
    const mobile =
      Helper.nullCheck(userData.rcontact) === false
        ? userData.rcontact
        : userData.mobile;
    const content = `Dear Customer,\n\nGreeting for the day :)\n\nPlease find below the Quotation as desired.\n\n${quoteLink}\n\nFor further details contact:\n\nRP name : ${username}\n\nMobile no : ${mobile}\n\nRegards\n\nTeam Finqy`;
    const shareOptions = {
      title: "",
      message: content,
      url: "",
      social: Share.Social.WHATSAPP,
      whatsAppNumber: "",
    };
    Share.shareSingle(shareOptions);
  };

  /**
   * cif whatsapp sharing
   */
  cifWhatsappClicked = () => {
    const { activeRowData, userData } = this.state;
    const { cif_file } = activeRowData;
    const username =
      Helper.nullCheck(userData.rname) === false
        ? userData.rname
        : userData.username;
    const mobile =
      Helper.nullCheck(userData.rcontact) === false
        ? userData.rcontact
        : userData.mobile;
    const content = `Dear Customer,\n\nGreeting for the day :)\n\nPlease find below the CIF as desired.\n\n${cif_file}\n\nFor further details contact:\n\nRP name : ${username}\n\nMobile no : ${mobile}\n\nRegards\n\nTeam Finqy`;
    const shareOptions = {
      title: "",
      message: content,
      url: "",
      social: Share.Social.WHATSAPP,
      whatsAppNumber: "",
    };
    Share.shareSingle(shareOptions);
  };

  /**
   * quotes click
   * @param {} value
   * @param {*} title
   */
  // quotesClick = (value, title) => {
  //   if (title === `Mail`) {
  //     const sp = value.split('@');
  //     this.setState({
  //       quotemodalVis: true,
  //       quotemailData: value,
  //       quotemail: sp[0].includes('@') ? sp[0] : '',
  //     });
  //   } else {
  //     const split = value.split('/');
  //     const fileName = split[split.length - 1];
  //     if (value.includes('pdf')) {
  //       this.setState({
  //         modalvis: true,
  //         pdfurl: value,
  //         pdfTitle: title,
  //         fileName: fileName,
  //       });
  //     } else {
  //       Helper.downloadFileWithFileName(value, fileName, fileName, '*/*');
  //       //Helper.downloadFile(value, title);
  //     }
  //   }
  // };

  invoiceViewClick = (value, title) => {
    const split = value.split("/");
    const fileName = split[split.length - 1];
    this.setState({
      modalvis: true,
      pdfurl: value,
      pdfTitle: title,
      fileName: fileName,
    });
  };

  /**
   * quotes/cif mail send
   */
  emailSubmit = () => {
    const { quotemailData, quotemail, userData, quotemailType } = this.state;
    const username =
      Helper.nullCheck(userData.rname) === false
        ? userData.rname
        : userData.username;
    const mobile =
      Helper.nullCheck(userData.rcontact) === false
        ? userData.rcontact
        : userData.mobile;
    const sp = quotemailData.split("@");
    let data = {};
    if (quotemailType === 1) {
      data = {
        email: quotemail,
        form_name: `${sp[sp.length - 1]}`,
        form_id: `${sp.length === 4 ? sp[1] : sp[0]}`,
        username: username,
        mobile: mobile,
        //quote_file:`${sp.length === 4 ? sp[3] : sp[2]}`
      };
    } else {
      const { activeRowData } = this.state;
      const { cif_file } = activeRowData;
      const spl = cif_file.split(/\//g);
      const name = spl[spl.length - 1];
      data = {
        email_cif: quotemail,
        cif_ff: name,
        username: username,
        mobile: mobile,
      };
    }
    const body = JSON.stringify(data);
    //console.log('body', quotemailType, body);
    Helper.networkHelperTokenPost(
      Pref.AjaxUrl,
      body,
      Pref.methodPost,
      this.state.token,
      (result) => {
        //console.log(`result`, result);
        const { response_header } = result;
        const { res_type } = response_header;
        if (res_type === "success") {
          alert(`Email sent successfully`);
        }
        this.setState({
          quotemodalVis: false,
          quotemailData: "",
          quotemail: "",
        });
      },
      (e) => {
        alert(`Failed to send mail`);
        this.setState({
          quotemodalVis: false,
          quotemailData: "",
          quotemail: "",
        });
      }
    );
  };

  /**
   * export
   */
  clickedexport = () => {
    const { cloneList, userData } = this.state;
    if (cloneList.length > 0) {
      const data = this.returnData(cloneList, 0, cloneList.length);
      const { refercode } = userData;
      const name = `${refercode}_MyLeadRecord`;
      const finalFilePath = `${FILEPATH}${name}.csv`;
      Helper.writeCSV(HEADER, data, finalFilePath, (result) => {
        if (result) {
          RNFetchBlob.fs.scanFile([{ path: finalFilePath, mime: "text/csv" }]),
            RNFetchBlob.android.addCompleteDownload({
              title: name,
              description: "Lead record exported successfully",
              mime: "text/comma-separated-values",
              path: finalFilePath,
              showNotification: true,
            }),
            Helper.showToastMessage("Download Complete", 1);
        }
      });
    }
  };

  onChangeSearch = (query) => {
    this.setState({ searchQuery: query });
    const { cloneList, itemSize } = this.state;
    if (cloneList.length > 0) {
      const trimquery = String(query).trim().toLowerCase();
      const clone = JSON.parse(JSON.stringify(cloneList));
      const result = Lodash.filter(clone, (it) => {
        const {
          date,
          leadno,
          source_type,
          name,
          mobile,
          product,
          bank,
          status,
        } = it;
        return (
          (date && date.trim().toLowerCase().includes(trimquery)) ||
          (leadno && leadno.trim().toLowerCase().includes(trimquery)) ||
          (source_type &&
            source_type.trim().toLowerCase().includes(trimquery)) ||
          (name && name.trim().toLowerCase().includes(trimquery)) ||
          (mobile && mobile.trim().toLowerCase().includes(trimquery)) ||
          (product && product.trim().toLowerCase().includes(trimquery)) ||
          (bank && bank.trim().toLowerCase().includes(trimquery)) ||
          (status && status.trim().toLowerCase().includes(trimquery))
        );
      });
      const data =
        result.length > 0 ? this.returnData(result, 0, result.length) : [];
      const count = result.length > 0 ? result.length : itemSize;
      this.setState({ dataList: data, itemSize: count });
    }
  };

  revertBack = () => {
    const { enableSearch } = this.state;
    const { cloneList } = this.state;
    if (enableSearch === true && cloneList.length > 0) {
      const clone = JSON.parse(JSON.stringify(cloneList));
      const data = this.returnData(clone, 0, ITEM_LIMIT);
      this.setState({ dataList: data });
    }
    this.setState({
      searchQuery: "",
      enableSearch: !enableSearch,
      itemSize: ITEM_LIMIT,
    });
  };

  pageNumberClicked = (start, end) => {
    const { cloneList } = this.state;
    const clone = JSON.parse(JSON.stringify(cloneList));
    const data = this.returnData(clone, start, end);
    this.setState({
      dataList: data,
      itemSize: end,
    });
  };

  render() {
    const {
      searchQuery,
      enableSearch,
      editThird,
      editSecond,
      editFirst,
      flag,
      type,
    } = this.state;
    return (
      <CScreen
        refresh={() => {
          this.fetchData();
        }}
        absolute={
          <>
            <Loader
              isShow={this.state.progressLoader}
              bottomText={'Please do not press back button'}
            />
          </>
        }
        body={
          <>
            <LeftHeaders
              backClicked={this.backclick}
              showBack
              title={"Q-Leads"}
              // title={
              //   type === ''
              //     ? ''
              //     : type !== 'referaal'
              //     ? 'My Lead Records'
              //     : flag === 2
              //     ? 'My Lead Records'
              //     : 'Lead Records'
              // }
              bottomBody={
                <>
                  {/* <View styleName="md-gutter">
                    <Searchbar
                      placeholder="Search"
                      onChangeText={this.onChangeSearch}
                      value={searchQuery}
                    />
                  </View> */}
                </>
              }
            />

            <Modal
              visible={this.state.downloadModal}
              setModalVisible={() => this.setState({ downloadModal: false })}
              ratioHeight={0.6}
              backgroundColor={`white`}
              centerFlex={0.8}
              topCenterElement={
                <Subtitle
                  style={{
                    color: "#292929",
                    fontSize: 17,
                    fontWeight: "700",
                    letterSpacing: 1,
                  }}
                >
                  {this.state.downloadFormUrl.includes('eligibility_api') ? `Elgibility Check` : this.state.downloadFormTitle === "eligibility" ? 'Eligibility Reports' : `Download Attachments`}
                </Subtitle>
              }
              children={
                <CScreen
                  showfooter={false}
                  body={
                    <View style={{ marginStart: 8, marginEnd: 8 }}>
                      {this.state.downloadFormTitle === "Personal Loan" ||
                      this.state.downloadFormTitle === "Sbi Credit Card" ||
                      this.state.downloadFormTitle === "SBI Credit Card" ||
                      this.state.downloadFormTitle === "sbi_credit_card" || this.state.downloadFormTitle === "eligibility" ? (
                        <WebView
                          style={{ flex: 1, height: 1600, marginTop: 8 }}
                          source={{ uri: this.state.downloadFormUrl }}
                          javaScriptEnabled
                          showsVerticalScrollIndicator={false}
                          showsHorizontalScrollIndicator={false}
                          domStorageEnabled
                          cacheEnabled={false}
                          injectedJavaScript={this.state.downloadFormTitle === "eligibility" ? '' : `$( document ).ready(function() {
                            var downloadList = '<body><style>body{overflow: auto;height:500px;} a{font-size:17px;text-transform: capitalize;} li{margin-top:10px;}}</style><ol>';
                            $("a").each(function() {
                                var url = this.href;
                                const urlSplit = this.href.split("/");
                                const fileNameSplit = urlSplit[urlSplit.length-1];
                                const parsename = fileNameSplit.split(".")[0];
                                let finalname = "";
                                if(parsename.includes('_')){
                                  finalname = parsename.split("_")[1];
                                }else{
                                  finalname = parsename;
                                }
                                downloadList += "<li><a href="+url+">"+finalname+"<a/></li><br>";
                          })
                          //window.ReactNativeWebView.postMessage(downloadList);
                          console.log('downloadList', downloadList);
                          downloadList += "</ol></body>";
                          $('body').replaceWith(downloadList);
                          });
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
                          onNavigationStateChange={(event) => {
                            const { url } = event;
                            if (url.toLowerCase().includes("thank_you")) {
                              this.setState({ downloadModal: false })
                            }
                          }}
                          // onMessage={(event) =>
                          //   console.log("Received: ", event.nativeEvent.data)
                          // }
                        />
                      ) : (
                        <FileUploadForm
                          truDownloadEnable={1}
                          downloadTitles={"dhdh"}
                          mode={true}
                          title={this.state.downloadFormTitle}
                          headerchange={this.headerchange}
                          editItemRestore={editThird}
                          rcCopy={editThird && editThird.rcCopy}
                          oldInsCopy={editThird && editThird.oldInsCopy}
                          pucCopy={editThird && editThird.pucCopy}
                          policycopy={editThird && editThird.policycopy}
                          panCard={editThird && editThird.panCard}
                          aadharCard={editThird && editThird.aadharCard}
                          salarySlip={editThird && editThird.salarySlip}
                          salarySlip1={editThird && editThird.salarySlip1}
                          salarySlip2={editThird && editThird.salarySlip2}
                          salarySlip3={editThird && editThird.salarySlip3}
                          salarySlip4={editThird && editThird.salarySlip4}
                          salarySlip5={editThird && editThird.salarySlip5}
                          bankState={editThird && editThird.bankState}
                          multipleFilesList={
                            editThird && editThird.multipleFilesList
                          }
                          other={editThird && editThird.other}
                          existing={editThird && editThird.existing}
                          passportPhoto={editThird && editThird.passportPhoto}
                          cap_aadhar={editThird && editThird.cap_aadhar}
                          pop_electricity={
                            editThird && editThird.pop_electricity
                          }
                          current_loan_repayment_statement={
                            editThird &&
                            editThird.current_loan_repayment_statement
                          }
                          current_add_proof={
                            editThird && editThird.current_add_proof
                          }
                          exisitng_loan_doc={
                            editThird && editThird.exisitng_loan_doc
                          }
                          proof_of_property={
                            editThird && editThird.proof_of_property
                          }
                          existingcard={editSecond && editSecond.existingcard}
                          employ={editFirst && editFirst.employ}
                          fresh_pop={editSecond && editSecond.fresh_pop}
                          itrdoc={editThird && editThird.itrdoc}
                          quotes={this.state.quotes}
                          policy={this.state.policy}
                          cif={this.state.cif}
                          popitemList={editThird && editThird.popitemList}
                          quoteEmailClicked={() => this.quoteEmailClicked(1)}
                          quoteWhatsappClicked={() =>
                            this.quoteWhatsappClicked()
                          }
                          cifWhatsappClicked={() => this.cifWhatsappClicked()}
                          cifEmailClicked={() => this.quoteEmailClicked(2)}
                          tmpPolicy={this.state.tmpPolicy}
                          tmpPolicyIssued={this.state.tmpPolicyIssued}
                        />
                      )}
                    </View>
                  }
                />
              }
            />

            <Modal
              visible={this.state.modalvis}
              setModalVisible={() =>
                this.setState({ pdfurl: "", modalvis: false })
              }
              ratioHeight={0.87}
              backgroundColor={`white`}
              topCenterElement={
                <Subtitle
                  style={{
                    color: "#292929",
                    fontSize: 17,
                    fontWeight: "700",
                    letterSpacing: 1,
                  }}
                >
                  {this.state.pdfTitle}
                </Subtitle>
              }
              topRightElement={
                <TouchableWithoutFeedback
                  onPress={() =>
                    Helper.downloadFileWithFileName(
                      `${this.state.pdfurl}`,
                      this.state.fileName,
                      `${this.state.fileName}`,
                      "application/pdf"
                    )
                  }
                >
                  <View>
                    <IconChooser name="download" size={24} color={Pref.RED} />
                  </View>
                </TouchableWithoutFeedback>
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
                    fitWidth
                    fitPolicy={0}
                    enablePaging
                    scale={1}
                  />
                </View>
              }
            />

            <Modal
              visible={this.state.quotemodalVis}
              setModalVisible={() =>
                this.setState({
                  quotemodalVis: false,
                  quotemailData: "",
                  quotemail: "",
                })
              }
              ratioHeight={0.6}
              backgroundColor={`white`}
              topCenterElement={
                <Subtitle
                  style={{
                    color: "#292929",
                    fontSize: 17,
                    fontWeight: "700",
                    letterSpacing: 1,
                  }}
                >
                  {`Share via E-Mail`}
                </Subtitle>
              }
              topRightElement={null}
              children={
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "white",
                  }}
                >
                  <CustomForm
                    label={`Email`}
                    placeholder={`Enter email id`}
                    value={this.state.quotemail}
                    onChange={(v) => this.setState({ quotemail: v })}
                    keyboardType={"email-address"}
                    style={{ marginHorizontal: 12 }}
                  />

                  <Button
                    mode={"flat"}
                    uppercase={true}
                    dark={true}
                    loading={false}
                    style={[styles.button]}
                    onPress={this.emailSubmit}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                        letterSpacing: 1,
                      }}
                    >
                      {`Submit`}
                    </Text>
                  </Button>
                </View>
              }
            />

            <Modal
              visible={this.state.backendRemarkShow}
              setModalVisible={() =>
                this.setState({
                  backendRemarkShow: false,
                  backendRemark: "",
                  currentLeadID: "",
                })
              }
              leftFlex={0.2}
              centerFlex={0.8}
              ratioHeight={0.6}
              backgroundColor={`white`}
              topCenterElement={
                <Subtitle
                  style={{
                    color: "#292929",
                    fontSize: 16,
                    fontWeight: "700",
                  }}
                >
                  {`${this.state.currentLeadID} Backend Remark`}
                </Subtitle>
              }
              topRightElement={null}
              children={
                <ScrollView
                  style={{
                    flex: 1,
                    backgroundColor: "white",
                  }}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                >
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: "white",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        marginHorizontal: 16,
                        marginVertical: 8,
                      }}
                    >
                      <Title style={styles.event1}>
                        {this.state.backendRemark}
                      </Title>
                    </View>
                  </View>
                </ScrollView>
              }
            />

            <View styleName="horizontal md-gutter space-between">
              <PaginationNumbers
                dataSize={this.state.cloneList.length}
                itemSize={this.state.itemSize}
                itemLimit={ITEM_LIMIT}
                pageNumberClicked={this.pageNumberClicked}
              />
              <TouchableWithoutFeedback onPress={this.revertBack}>
                <View styleName="horizontal v-center h-center">
                  <IconChooser
                    name={enableSearch ? "x" : "search"}
                    size={24}
                    color={"#555555"}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>

            {enableSearch === true ? (
              <View styleName="md-gutter">
                <Searchbar
                  placeholder="Search"
                  onChangeText={this.onChangeSearch}
                  value={searchQuery}
                  style={{
                    elevation: 0,
                    borderColor: "#dbd9cc",
                    borderWidth: 0.5,
                    borderRadius: 8,
                  }}
                  clearIcon={() => null}
                />
              </View>
            ) : null}

            {this.state.loading ? (
              <View style={styles.loader}>
                <ActivityIndicator />
              </View>
            ) : this.state.dataList.length > 0 ? (
              <CommonTable
                enableHeight={false}
                dataList={this.state.dataList}
                widthArr={this.state.widthArr}
                tableHead={this.state.tableHead}
              />
            ) : (
              <View style={styles.emptycont}>
                <ListError subtitle={"No Lead Records Found..."} />
              </View>
            )}
            {this.state.dataList.length > 0 ? (
              <>
                <Title style={styles.itemtext}>{`Showing ${
                  this.state.itemSize
                }/${Number(this.state.cloneList.length)} entries`}</Title>
                <Download rightIconClick={this.clickedexport} />
              </>
            ) : null}
          </>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  button: {
    color: "white",
    paddingVertical: sizeHeight(0.5),
    marginTop: 24,
    marginHorizontal: 24,
    backgroundColor: Pref.RED,
    textAlign: "center",
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 1,
  },
  eligibilitybutton: {
    color: "white",
    backgroundColor: "#17a2b8",
    textAlign: "center",
    elevation: 0,
    borderRadius: 8,
  },
  eligibilitybuttonDownload: {
    color: "white",
    backgroundColor: "#007bff",
    textAlign: "center",
    elevation: 0,
    borderRadius: 8,
  },
  emptycont: {
    flex: 0.7,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginVertical: 48,
    paddingVertical: 56,
  },
  loader: {
    justifyContent: "center",
    alignSelf: "center",
    flex: 1,
    marginVertical: 48,
    paddingVertical: 48,
  },
  itemtext: {
    letterSpacing: 0.5,
    fontWeight: "700",
    lineHeight: 20,
    alignSelf: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#0270e3",
    fontSize: 14,
    paddingVertical: 16,
    marginTop: 4,
  },
  itemtopText: {
    letterSpacing: 0.5,
    fontWeight: "700",
    lineHeight: 20,
    alignSelf: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#0270e3",
    fontSize: 16,
  },
  event: {
    fontWeight: "700",
    fontSize: 15,
    color: Pref.RED,
  },
  event1: {
    fontWeight: "700",
    fontSize: 15,
    color: "black",
  },
});
