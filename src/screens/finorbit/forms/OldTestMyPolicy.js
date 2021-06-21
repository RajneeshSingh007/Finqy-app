import React from 'react';
import {StyleSheet, BackHandler} from 'react-native';
import {Title, View} from '@shoutem/ui';
import * as Helper from '../../../util/Helper';
import * as Pref from '../../../util/Pref';
import {Colors, Button} from 'react-native-paper';
import {sizeHeight, sizeWidth} from '../../../util/Size';
import Lodash from 'lodash';
import InputBox from '../../component/formComponent/InputBox';
import DropDown from '../../component/formComponent/DropDown';
import CScreen from '../../component/CScreen';
import FormStepIndicator from '../../component/formComponent/FormStepIndicator';
import Loader from '../../../util/Loader';
import TopHeader from '../../common/TopHeader';
import FileUploadForm from '../FileUploadForm';
import {
  tmpFirstFormCheck,
  tmpSecondFormCheck,
} from '../../../util/FormCheckHelper';
import NavigationActions from '../../../util/NavigationActions';

let healthRequiredCover = [
  {value: `3`, name: '3Lac'},
  {value: `3.5`, name: '3.5Lac'},
  {value: `4`, name: '4Lac'},
  {value: `4.5`, name: '4.5Lac'},
  {value: `5`, name: '5Lac'},
  {value: `5.5`, name: '5.5Lac'},
  {value: `7`, name: '7Lac'},
  {value: `7.5`, name: '7.5Lac'},
  {value: `10`, name: '10Lac'},
  {value: `15`, name: '15Lac'},
  {value: `20`, name: '20Lac'},
  {value: `25`, name: '25Lac'},
  {value: `30`, name: '30Lac'},
  {value: `35`, name: '35Lac'},
  {value: `40`, name: '40Lac'},
  {value: `45`, name: '45Lac'},
  {value: `50`, name: '50Lac'},
  {value: `75`, name: '75Lac'},
  {value: `100`, name: '100Lac'},
];

let floaterList = [
  {value: '1 Adults', name: '1 Adults'},
  {value: '2 Adult', name: '2 Adult'},
  {value: '2 Adult + 1 Child', name: '2 Adult + 1 Child'},
  {value: '1 Adult + 1 Child', name: '1 Adult + 1 Child'},
  {value: '1 Adult + 2 Children', name: '1 Adult + 2 Children'},
  {value: '2 Adult + 2 Children', name: '2 Adult + 2 Children'},
];

export default class TestMyPolicy extends React.PureComponent {
  constructor(props) {
    super(props);
    this.backClick = this.backClick.bind(this);
    this.fileState = null;
    this.fileUploadFormRef = React.createRef();
    this.token = '';
    this.userData = null;
    this.storeState = null;
    this.state = {
      currentPosition: 0,
      scrollReset: false,
      editMode: false,
      disableClick: 0,
      name: '',
      email: '',
      mobile: '',
      age: '',
      insType: '',
      insCompany: '',
      insPlan: '',
      sumAss: '',
      remark: '',
      apremium: '',
      companyList: [],
      planList: [],
      tmpPolicy: null,
      formid: '',
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backClick);
    const {navigation} = this.props;
    const editMode = navigation.getParam('edit', false);
    const editLeadData = navigation.getParam('leadData', null);
    //dialer data
    const dialerName = navigation.getParam('dialerName', '');
    const dialerMobile = navigation.getParam('dialerMobile', '');
    const dialerEmail = navigation.getParam('dialerEmail', '');
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.saveToken, (value) => {
        this.token = value;
        Pref.getVal(Pref.userData, (userData) => {
          this.userData = userData;
          let state =
            editLeadData === null
              ? {
                  name: '',
                  email: '',
                  mobile: '',
                  age: '',
                  insType: '',
                  insCompany: '',
                  insPlan: '',
                  sumAss: '',
                  remark: '',
                  apremium: '',
                }
              : editLeadData;
          state.dialerEmail = dialerEmail;
          state.editMode = editMode;
          state.dialerName = dialerName;
          state.currentPosition = 0;
          state.dialerMobile = dialerMobile;
          this.storeState = state;
          this.setState(state);
        });
      });
    });
  }

  componentWillUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    if (this.focusListener !== undefined) this.focusListener.remove();
  }

  backClick = () => {
    const {currentPosition, editMode, dialerMobile} = this.state;
    if (Helper.nullStringCheck(dialerMobile) === false) {
      return false;
    } else {
      if (editMode === true) {
        NavigationActions.navigate('LeadList');
        return true;
      } else {
        NavigationActions.goBack();
        return true;
      }
    }
  };

  fetchCompany = (value) => {
    this.setState({insType: value});
    const formData = new FormData();
    formData.append('get_cdata', value);
    Helper.getNetworkHelperTextPost(
      Pref.HealthQouteCompanyUrl,
      {
        body: formData,
        method: Pref.methodPost,
      },
      (result) => {
        //console.log('result', result);
        if (Helper.nullStringCheck(result) === false) {
          const replacehtmltag = result.split(/\>/g);
          if (replacehtmltag.length > 0) {
            const filterList = [];
            replacehtmltag.map((io, index) => {
              if (
                index > 1 &&
                index % 2 != 0 &&
                Helper.nullStringCheck(io) === false
              ) {
                const rpl = io.replace(/<\/option/g, '');
                filterList.push({
                  name: rpl,
                  value: rpl,
                });
              }
            });
            this.setState({companyList: filterList});
          }
        }
      },
      (error) => {
        console.log(error);
      },
    );
  };

  fetchPlan = (value) => {
    this.setState({insCompany: value});
    const formData = new FormData();
    formData.append('get_plan', value);
    formData.append('get_type', this.state.get_type);
    Helper.getNetworkHelperTextPost(
      Pref.HealthQouteCompanyUrl,
      {
        body: formData,
        method: Pref.methodPost,
      },
      (result) => {
        //console.log('result', result);
        if (Helper.nullStringCheck(result) === false) {
          const replacehtmltag = result.split(/\>/g);
          if (replacehtmltag.length > 0) {
            const filterList = [];
            replacehtmltag.map((io, index) => {
              if (
                index > 1 &&
                index % 2 != 0 &&
                Helper.nullStringCheck(io) === false
              ) {
                const rpl = io.replace(/<\/option/g, '');
                filterList.push({
                  name: rpl,
                  value: rpl,
                });
              }
            });
            this.setState({planList: filterList});
          }
        }
      },
      (error) => {
        console.log(error);
      },
    );
  };

  backNav = (jumped = false, position = 0) => {
    this.storeState = this.state;
    if (this.state.currentPosition === 1) {
      this.fileState = JSON.parse(
        JSON.stringify(this.fileUploadFormRef.current.state),
      );
    }
    this.setState((prev) => {
      return {
        currentPosition: prev.currentPosition - 1,
        scrollReset: true,
        name: this.storeState != null ? this.storeState.name : '',
        mobile: this.storeState != null ? this.storeState.mobile : '',
        email: this.storeState != null ? this.storeState.email : '',
        insType: this.storeState != null ? this.storeState.insType : '',
        insCompany: this.storeState != null ? this.storeState.insCompany : '',
        insPlan: this.storeState != null ? this.storeState.insPlan : '',
      };
    });
  };

  /**
   * submit form
   */
  formSubmit = (jumped = false, position = 0) => {
    const {currentPosition, editMode, disableClick} = this.state;

    let checkData = true;
    let formData = new FormData();
    formData.append('tmp_form', 'tmp_form');

    if (currentPosition === 0) {
      checkData = tmpFirstFormCheck(this.state);
    } else if (currentPosition === 1) {
      checkData = tmpSecondFormCheck(this.state);
    }

    if (checkData) {
      if (currentPosition == 0) {
        this.setState(
          (prevState) => {
            return {
              currentPosition: prevState.currentPosition + 1,
              scrollReset: true,
              sumAss: this.storeState != null ? this.storeState.sumAss : '',
              apremium: this.storeState != null ? this.storeState.apremium : '',
              remark: this.storeState != null ? this.storeState.remark : '',
              age: this.storeState != null ? this.storeState.age : '',
            };
          },
          () => {
            this.storeState = this.state;
            if (
              this.fileUploadFormRef != null &&
              this.fileUploadFormRef.current
            ) {
              this.fileUploadFormRef.current.restoreData(this.fileState);
            }
          },
        );
      } else {
        this.fileState = JSON.parse(
          JSON.stringify(this.fileUploadFormRef.current.state),
        );

        if (disableClick === 0) {
          this.setState({progressLoader: true, disableClick: 1}, () => {
            this.forceUpdate();
          });
          const {refercode} = this.userData;
          formData.append('ref', refercode);
          formData.append('frommobile', 'frommobile');

          let parseJs = JSON.parse(JSON.stringify(this.state));
          delete parseJs.companyList;
          delete parseJs.planList;
          Object.entries(parseJs).forEach(([key, value]) => {
            formData.append(key, value);
          });

          //policy file
          let allfileslist = this.fileState.fileList;
          if (
            Helper.nullCheck(allfileslist) === false &&
            allfileslist.length > 0
          ) {
            const loops = Lodash.map(allfileslist, (ele) => {
              let parseJs = JSON.parse(JSON.stringify(ele));
              Object.entries(parseJs).forEach(([key, value]) => {
                if (
                  Helper.arrayObjCheck(value, false) &&
                  key === 'tmp_file_upload'
                ) {
                  formData.append(key, value);
                }
              });
            });
          }

          const formUrls = `${Pref.FinorbitFormUrl}test_my_policy_form.php`;

          //console.log('formData', formData);

          Helper.networkHelperTokenContentType(
            formUrls,
            formData,
            Pref.methodPost,
            this.token,
            (result) => {
              const {response_header} = result;
              const {res_type, res} = response_header;
              this.setState({progressLoader: false});
              if (res_type === 'success') {
                Helper.showToastMessage(
                  editMode === false
                    ? 'Form submitted successfully'
                    : 'Form updated successfully',
                  1,
                );
                this.finishForm();
                // if (Helper.nullCheck(res.id) === false && res.id !== '') {
                //   const {id} = res;
                //   NavigationActions.navigate('GetQuotes', {
                //     formId: id,
                //     sumin: cov,
                //     editmode: this.state.editMode,
                //   });
                // } else {
                //   this.finishForm();
                // }
              } else {
                Helper.showToastMessage('Failed to submit form', 0);
              }
            },
            (e) => {
              console.log(e);
              this.setState({progressLoader: false});
              Helper.showToastMessage('Something went wrong', 0);
            },
          );
        }
      }
    }
  };

  finishForm = () => {
    const {editMode} = this.state;
    let backScreenName = editMode === false ? 'FinorbitScreen' : 'LeadList';
    //for dialer screen

    if (Helper.nullStringCheck(this.state.dialerMobile) === false) {
      backScreenName = 'DialerCalling';
    }

    //finish screen
    NavigationActions.navigate('Finish', {
      top: editMode === false ? 'Add New Lead' : 'Edit Lead',
      red: 'Success',
      grey: editMode === false ? 'Details uploaded' : 'Details updated',
      blue: editMode === false ? 'Add another lead?' : 'Back to Lead Record',
      back: backScreenName,
    });
  };

  btnText = () => {
    const {currentPosition} = this.state;
    const btnText = currentPosition === 1 ? 'Submit' : 'Next';
    return btnText;
  };

  renderFirstPart = () => {
    return (
      <View>
        <InputBox
          onChangeText={(value) => {
            if (String(value).match(/^[a-z, A-Z]*$/g) !== null) {
              this.setState({name: value});
            }
          }}
          value={this.state.name}
          showStarVisible
          placeholder={`Full Name`}
          returnKeyType={'next'}
          changecolor
          containerstyle={styles.animatedInputCont}
        />

        <InputBox
          placeholder={`Mobile Number`}
          changecolor
          showStarVisible
          containerstyle={styles.animatedInputCont}
          maxLength={10}
          keyboardType={'number-pad'}
          onChangeText={(value) => {
            if (String(value).match(/^[0-9]*$/g) !== null) {
              this.setState({mobile: value});
            }
          }}
          value={this.state.mobile}
          editable={this.state.dialerMobile ? false : true}
          disabled={this.state.dialerMobile ? true : false}
          returnKeyType={'next'}
        />

        <InputBox
          placeholder={`Email`}
          changecolor
          showStarVisible
          containerstyle={styles.animatedInputCont}
          onChangeText={(value) => this.setState({email: value})}
          value={this.state.email}
          returnKeyType={'next'}
          keyboardType={'email'}
        />

        <DropDown
          list={floaterList}
          placeholder={'Select Insurance Type'}
          starVisible
          value={this.state.insType}
          selectedItem={this.fetchCompany}
          style={styles.newdropdowncontainers}
          textStyle={styles.newdropdowntextstyle}
        />

        <DropDown
          list={this.state.companyList}
          placeholder={'Select Company'}
          starVisible
          value={this.state.insCompany}
          selectedItem={this.fetchPlan}
          style={styles.newdropdowncontainers}
          textStyle={styles.newdropdowntextstyle}
        />

        <DropDown
          list={this.state.planList}
          placeholder={'Select Plan'}
          starVisible
          value={this.state.insPlan}
          selectedItem={(v) => this.setState({insPlan: v})}
          style={styles.newdropdowncontainers}
          textStyle={styles.newdropdowntextstyle}
        />
      </View>
    );
  };

  renderSecondPart = () => {
    return (
      <View>
        <DropDown
          list={healthRequiredCover}
          placeholder={'Select Required Cover'}
          starVisible
          value={this.state.sumAss}
          selectedItem={(value) => {
            this.setState({sumAss: value});
          }}
          style={StyleSheet.flatten([
            styles.newdropdowncontainers,
            {
              marginHorizontal: 16,
            },
          ])}
          textStyle={styles.newdropdowntextstyle}
        />

        <InputBox
          placeholder={`Annual Premium`}
          changecolor
          showStarVisible
          containerstyle={styles.animatedInputCont}
          maxLength={10}
          keyboardType={'number-pad'}
          onChangeText={(value) => {
            if (String(value).match(/^[0-9]*$/g) !== null) {
              this.setState({apremium: value});
            }
          }}
          value={this.state.apremium}
          returnKeyType={'next'}
          enableWords
        />

        <InputBox
          placeholder={`Age of the Eldest Person`}
          changecolor
          showStarVisible
          containerstyle={styles.animatedInputCont}
          onChangeText={(value) => {
            if (String(value).match(/^[0-9]*$/g) !== null) {
              this.setState({age: value});
            }
          }}
          keyboardType={'number-pad'}
          maxLength={2}
          value={this.state.age}
          returnKeyType={'next'}
        />

        <FileUploadForm
          ref={this.fileUploadFormRef}
          title={'TMP'}
          headerchange={false}
          tmpPolicy={this.state.tmpPolicy}
          editMode={this.state.editMode}
        />

        <InputBox
          placeholder={`Remark`}
          changecolor
          containerstyle={styles.animatedInputCont}
          onChangeText={(value) =>
            this.setState({remark: value, scrollReset: false})
          }
          maxLength={200}
          value={this.state.remark}
          multiline
        />
      </View>
    );
  };

  render() {
    const {editMode} = this.state;
    return (
      <CScreen
        scrollreset={this.state.scrollReset}
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
            <TopHeader
              backClicked={this.backClick}
              showBack
              title={!editMode ? `Add New Lead` : `Edit Lead`}
              bottomtext={
                <>
                  {`Test My `}
                  <Title style={styles.passText}>{`Policy`}</Title>
                </>
              }
              bottomtextStyle={{
                color: '#000',
                fontSize: 20,
              }}
            />
            <FormStepIndicator
              activeCounter={this.state.currentPosition}
              stepCount={2}
              positionClicked={(pos) => {
                // const {currentPosition} = this.state;
                // if(pos > currentPosition){
                //   this.formSubmit(true, pos);
                // }else{
                //   this.backNav(true, pos);
                // }
              }}
            />
            <View styleName="md-gutter">
              {this.state.currentPosition === 0
                ? this.renderFirstPart()
                : this.state.currentPosition === 1
                ? this.renderSecondPart()
                : null}
            </View>

            <View
              styleName={
                this.state.currentPosition > 0
                  ? `horizontal space-between md-gutter`
                  : `horizontal space-between md-gutter v-end h-end`
              }>
              {this.state.currentPosition > 0 ? (
                <Button
                  mode={'flat'}
                  uppercase={true}
                  dark={true}
                  loading={false}
                  style={[
                    styles.loginButtonStyle,
                    {
                      backgroundColor: 'transparent',
                      borderColor: '#dedede',
                      borderWidth: 1.3,
                    },
                  ]}
                  onPress={() => this.backNav(false)}>
                  <Title
                    style={StyleSheet.flatten([
                      styles.btntext,
                      {
                        color: Pref.RED,
                      },
                    ])}>
                    {'Back'}
                  </Title>
                </Button>
              ) : null}
              <Button
                mode={'flat'}
                uppercase={false}
                dark={true}
                loading={false}
                style={styles.loginButtonStyle}
                onPress={() => this.formSubmit(false)}>
                <Title style={styles.btntext}>{this.btnText()}</Title>
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
  dropdownnewtext: {
    color: '#6d6a57',
    fontSize: 14,
    fontFamily: Pref.getFontName(4),
  },
  dropdownnewcontainer: {
    borderRadius: 0,
    borderBottomColor: '#f2f1e6',
    borderBottomWidth: 1.3,
    borderWidth: 0,
    marginStart: 10,
    marginEnd: 10,
    paddingVertical: 10,
  },
  newdropdowntextstyle: {
    color: '#6d6a57',
    fontSize: 14,
    fontFamily: Pref.getFontName(4),
  },
  newdropdowncontainers: {
    borderRadius: 0,
    borderBottomColor: '#f2f1e6',
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
    borderBottomColor: '#f2f1e6',
    alignContent: 'center',
  },
  radiocont1: {
    marginStart: 10,
    marginEnd: 10,
    alignContent: 'center',
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
    borderBottomColor: '#f2f1e6',
    alignContent: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Rubik',
    fontFamily: 'bold',
    letterSpacing: 1,
    color: '#6d6a57',
    alignSelf: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6d6a57',
    lineHeight: 20,
    alignSelf: 'center',
    marginStart: 4,
  },
  inputStyle: {
    height: sizeHeight(7.5),
    backgroundColor: 'white',
    color: '#6d6a57',
    borderBottomColor: Colors.grey300,
    fontFamily: 'Rubik',
    fontSize: 16,
    borderBottomWidth: 0.6,
    fontWeight: '400',
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
  },
  loginButtonStyle: {
    height: 40,
    color: 'white',
    marginHorizontal: sizeWidth(3),
    marginVertical: sizeHeight(3.5),
    backgroundColor: '#e61e25',
    textAlign: 'center',
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 1,
  },
  dropdownbox: {
    flexDirection: 'row',
    height: 56,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  radiodownbox: {
    flexDirection: 'column',
    height: 56,
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 16,
  },
  boxsubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6d6a57',
    lineHeight: 20,
    alignSelf: 'center',
    marginStart: 4,
  },
  textopen: {
    fontSize: 14,
    fontWeight: '700',
    color: '#555555',
    lineHeight: 20,
    alignSelf: 'center',
    marginStart: 4,
    letterSpacing: 0.5,
  },
  bbstyle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6d6a57',
    lineHeight: 20,
    marginStart: 4,
  },
  downIcon: {
    alignSelf: 'center',
  },
  textstyle12: {
    fontSize: 14,
    fontWeight: '700',
    color: Pref.RED,
    lineHeight: 20,
    marginStart: 8,
    paddingVertical: 8,
    marginVertical: 4,
  },
  dropdowntextstyle: {
    color: '#6d6a57',
    fontSize: 14,
    fontFamily: Pref.getFontName(4),
  },
  dropdownmulticontainer: {
    borderRadius: 0,
    borderBottomColor: '#f2f1e6',
    borderBottomWidth: 1.3,
    borderWidth: 0,
    marginStart: 10,
    marginEnd: 10,
    paddingVertical: 10,
  },
  loader: {
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 1,
    marginVertical: 48,
    paddingVertical: 48,
  },

  passText: {
    fontSize: 20,
    letterSpacing: 0.5,
    color: Pref.RED,
    fontWeight: '700',
    lineHeight: 36,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingVertical: 16,
  },
  inputStyle: {
    height: sizeHeight(8),
    backgroundColor: 'white',
    color: '#292929',
    borderBottomColor: '#dedede',
    fontFamily: 'Rubik',
    fontSize: 16,
    borderBottomWidth: 1,
    fontWeight: '400',
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
  },
  inputPassStyle: {
    height: sizeHeight(8),
    backgroundColor: 'white',
    color: '#292929',
    borderBottomColor: '#dedede',
    fontFamily: 'Rubik',
    fontSize: 16,
    borderBottomWidth: 1,
    fontWeight: '400',
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
    marginVertical: sizeHeight(1),
  },
  inputPass1Style: {
    height: sizeHeight(8),
    backgroundColor: 'white',
    color: '#292929',
    fontFamily: 'Rubik',
    fontSize: 16,
    fontWeight: '400',
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
    marginTop: -7,
  },
  loginButtonStyle: {
    height: 48,
    color: 'white',
    backgroundColor: Pref.RED,
    textAlign: 'center',
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 0.5,
    borderRadius: 48,
    width: '40%',
    fontWeight: '700',
  },
  btntext: {
    color: 'white',
    fontSize: 15,
    letterSpacing: 0.5,
    fontWeight: '700',
    fontFamily: Pref.getFontName(4),
  },
});
