import React from "react";
import { StyleSheet, BackHandler } from "react-native";
import * as Pref from "../../../util/Pref";
import { sizeHeight } from "../../../util/Size";
import LeftHeaders from "../../common/CommonLeftHeader";
import CScreen from "./../../component/CScreen";
import CallerForm from "./CallerForm";
import Loader from "../../../util/Loader";
import { firebase } from "@react-native-firebase/firestore";
import { disableOffline } from "../../../util/DialerFeature";
import NavigationActions from "../../../util/NavigationActions";
import * as Helper from "../../../util/Helper";

const activeCallerPlaceholderJSON = {
  name: "",
  mobile: "",
  editable: false,
  dob: "",
  pincode: ""
};

export default class DialerCallerForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.update = false;
    this.callerformsubmit = this.callerformsubmit.bind(this);
    this.formResult = this.formResult.bind(this);
    this.backClick = this.backClick.bind(this);
    this.backClick1 = this.backClick1.bind(this);
    this.apiToken = "";
    this.state = this.initialState();
    Pref.getVal(Pref.saveToken, value => {
      this.apiToken = value;
    });
	this.formLinks = null;
  }

  initialState = () => {
    return {
      userid: -1,
      teamid: -1,
      outside: false,
      userData: null,
      isFollowup: false,
      activeCallerItem: activeCallerPlaceholderJSON,
      callTrack: -1,
      productList: [],
      progressLoader: false,
      editEnabled: false,
      teamName: "",
      whatsappMode: false
    };
  };

  componentDidMount() {
    this.setupData();
  }

  setupData = () => {
    //global variable to store dialer temperorary data
    delete global.dialerCustomerItem;

    BackHandler.addEventListener("hardwareBackPress", this.backClick);

    const { navigation } = this.props;
    const activeCallerItem = navigation.getParam(
      "data",
      activeCallerPlaceholderJSON
    );
    const editEnabled = navigation.getParam("editEnabled", false);
    const isFollowup = navigation.getParam("isFollowup", -1);
    const outside = navigation.getParam("outside", false);

    //console.log("activeCallerItem", activeCallerItem);
    //console.log('editEnabled', editEnabled);

    this.focusListener = navigation.addListener("didFocus", () => {
		Pref.getVal(Pref.WEBVIEW_FORMS, (value) => {
            this.formLinks = value;
      Pref.getVal(Pref.DIALER_DATA, userdatas => {
        const { id, tlid, pname } = userdatas[0].tc;
        activeCallerItem.team_id = tlid;
        activeCallerItem.user_id = id;
        Pref.getVal(Pref.userData, userData => {
          this.setState(
            {
              userid: id,
              teamName: pname,
              teamid: tlid,
              outside: outside,
              userData: userData,
              editEnabled: editEnabled,
              activeCallerItem: activeCallerItem,
              progressLoader: false,
              isFollowup: isFollowup
            },
            () => this.forceUpdate()
          );
        });
      });
		});
      this.fetchProduct();
    });
  };

  fetchProduct = () => {
    disableOffline();
    this.firebaseListerner = firebase
      .firestore()
      .collection(Pref.COLLECTION_PRODUCT)
      .onSnapshot(querySnapshot => {
        const productList = [];
        querySnapshot.forEach(documentSnapshot => {
          const { enabled, name } = documentSnapshot.data();
          if (Number(enabled) === 0) {
            documentSnapshot.data().value = name;
            productList.push(documentSnapshot.data());
          }
        });
        if (productList.length > 0) {
          const sorting = productList.sort((a, b) => {
            return String(a.value).localeCompare(b.value);
          });
          this.setState({ productList: sorting }, () => this.forceUpdate());
        }
      });
  };

  // componentDidUpdate() {
  //   const { navigation } = this.props;
  //   const outside = navigation.getParam("outside", false);
  //   if (this.state.productList.length === 0) {
  //     //this.setupData();
  //     this.fetchProduct();
  //   }

  //   if (outside != this.state.outside && this.update === false) {
  //     this.update = true;
  //     this.setupData();
  //   }
  // }

  backClick = () => {
    const { outside } = this.state;
    if (outside === false) {
      NavigationActions.navigate("DialerCalling");
      return true;
    } else {
      NavigationActions.goBack();
      return true;
    }
  };

  backClick1 = () => {
    const { outside } = this.state;
    if (outside === false) {
      NavigationActions.navigate("DialerCalling");
    }
  };

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backClick);
    if (this.didBlurListener !== undefined) this.didBlurListener.remove();
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.firebaseListerner !== undefined && this.firebaseListerner.remove)
      this.firebaseListerner.remove();
  }

  formResult = (status, message) => {
    const { editEnabled } = this.state;
    this.setState(this.initialState(), () => this.forceUpdate());
    if (editEnabled === true) {
      Helper.showToastMessage(message, status === true ? 1 : 0);
    } else {
      Helper.showToastMessage(message, status === true ? 1 : 0);
    }
    NavigationActions.navigate("DialerCalling");
  };

  callerformsubmit = (value, leadConfirm) => {
    this.setState({ progressLoader: value });
    if (leadConfirm === 0) {
      this.setState(this.initialState(), () => this.forceUpdate());
      NavigationActions.navigate("DialerCalling");
    }
  };

  render() {
    return (
      <CScreen
        absolute={
          <Loader
            isShow={this.state.progressLoader}
            bottomText={"Please do not press back button"}
          />
        }
        showRefreshControl={false}
        body={
          <>
            <LeftHeaders
              showBack
              title={"Add Customer Details"}
              backClicked={() => this.backClick()}
            />

            <CallerForm
              teamName={this.state.teamName}
              editEnabled={this.state.editEnabled}
              userData={this.state.userData}
              productList={this.state.productList}
              customerItem={this.state.activeCallerItem}
              token={this.apiToken}
              formResult={this.formResult}
              startLoader={this.callerformsubmit}
			  formLinks={this.formLinks}
            />
          </>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  iconmarg: { marginStart: 4 },
  leftpart: { flex: 0.2 },
  rightpart: { flex: 0.8 },
  topcalling: { flex: 0.5 },
  callingitem: { flex: 3 },
  callingcontainer: {
    flex: 13,
    flexDirection: "row"
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Pref.RED
  },
  spacer: {
    flex: 0.2
  },
  firstWord: {
    alignSelf: "center",
    color: "white",
    fontSize: 14
  },
  callcircle: {
    width: 48,
    height: 48,
    backgroundColor: Pref.RED,
    borderRadius: 48,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    marginStart: 6
  },
  mainTcontainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderColor: "#bcbaa1",
    borderWidth: 0.8,
    borderRadius: 10,
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 6,
    marginHorizontal: 16
  },
  button: {
    color: "white",
    paddingVertical: sizeHeight(0.5),
    marginTop: 24,
    marginHorizontal: 24,
    backgroundColor: Pref.RED,
    textAlign: "center",
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 1
  },
  emptycont: {
    flex: 0.7,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginVertical: 48,
    paddingVertical: 56
  },
  loader: {
    justifyContent: "center",
    alignSelf: "center",
    flex: 1,
    marginVertical: 48,
    paddingVertical: 48
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
    marginTop: 4
  },
  itemtopText: {
    letterSpacing: 0.5,
    fontWeight: "700",
    lineHeight: 20,
    alignSelf: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#0270e3",
    fontSize: 16
  },
  timelinetitle: {
    color: "#292929",
    fontSize: 15,
    fontWeight: "700"
  },
  tlphone: {
    color: "#555",
    fontSize: 13,
    fontWeight: "700"
  }
});
