import React from 'react';
import {StyleSheet, BackHandler} from 'react-native';
import {Title, View, Image} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {Button, Colors} from 'react-native-paper';
import {sizeHeight, sizeWidth} from '../../util/Size';
import CustomForm from '../finorbit/CustomForm';
import LeftHeaders from '../common/CommonLeftHeader';
import Loader from '../../util/Loader';
import CScreen from '../component/CScreen';
import NewDropDown from '../component/NewDropDown';
import CommonFileUpload from '../common/CommonFileUpload';
import lodash from 'lodash';
import NavigationActions from '../../util/NavigationActions';

const regex = /(<([^>]+)>|&nbsp;|\s{2,})/gi;

let ticketIssueList = [
  {
    value: 'IT/Software/App Issue',
  },
  {
    value: 'Non-IT Issue',
  },
];

let itIssueList = [
  {value: 'FinNews'},
  {value: 'FinTrain Learning'},
  {value: 'FinTeam Manager'},
  {value: 'HelpDesk/Relation Manager'},
  {value: 'My Profile'},
  {value: 'My Finqy'},
  {value: 'Marketing Tool'},
  {value: 'MIS'},
  {value: 'Offers'},
  {value: 'Popular Plan'},
  {value: 'Product'},
  {value: 'Wallet'},
  {value: 'Training'},
];

let nonitIssueList = [
  {
    value: 'Auto Loan',
  },
  {
    value: 'Business Loan',
  },
  {
    value: 'Credit Card',
  },
  {
    value: 'Fixed Deposit',
  },
  {
    value: 'Health Insurance',
  },
  {
    value: 'Home Loan',
  },
  {
    value: 'Insurance Samadhan',
  },
  {
    value: 'Life Cum Investment Plan',
  },
  {
    value: 'Loan Against Property',
  },
  {
    value: 'Motor Insurance',
  },
  {
    value: 'Mutual Fund',
  },
  {
    value: 'Personal Loan',
  },
  {
    value: 'Term Insurance',
  },
];

let nonitesubIssueList = [
  // {
  //   value: 'Bank/Insurance Company related query',
  // },
  {
    value: 'Invoice',
  },
  {
    value: 'Lead related Issues',
  },
  {
    value: 'Other',
  },
  {
    value: 'Payout',
  },
  {
    value: 'Tax Related',
  },
];

let priorityList = [
  {
    value: 'High',
  },
  {
    value: 'Low',
  },
  {
    value: 'Medium',
  },
];

let attachmentsList = [];

export default class RaiseQueryForm extends React.Component {
  constructor(props) {
    super(props);
    this.submitt = this.submitt.bind(this);
    this.backClick = this.backClick.bind(this);
    this.state = this.returnState(false, true);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backClick);
    const {navigation} = this.props;
    const data = navigation.getParam('data', null);
    const editMode = navigation.getParam('editmode', false);
    //console.log(data, editMode);

    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.userData, userData => {
        this.fetchData(userData, data, editMode);
      });
    });
  }

  fetchData = (userData, data, editMode) => {
    this.setState({
      loading: true,
      userData: userData,
      editItem: data,
      editMode: editMode,
    });
    Helper.networkHelperGet(
      Pref.AGENTS_URL,
      result => {
        const {agent, status} = JSON.parse(result);
        if (status === `success`) {
          let remark = '';
          let ticketissue = '';
          let itissue = '';
          let nonitissue = '';
          let nonitesubissue = '';
          let description = '';
          let priority = 'Low';
          if (editMode === true && Helper.nullCheck(data) === false) {
            if (data.TDesc === 'IT/Software/App Issue') {
              ticketissue = 'IT/Software/App Issue';
            } else {
              ticketissue = 'Non-IT Issue';
            }
            description = data.description.replace(regex, '');
            remark = data.umessage.replace(regex, '');
            if (data.subject.includes('|')) {
              const sp = data.subject.split('|');
              nonitissue = sp[0].trim();
              nonitesubissue = sp[1].trim();
            } else {
              itissue = data.subject;
            }
            priority = lodash.capitalize(data.Pcode);
          }
          //console.log('priority', priority);
          this.setState({
            agentList: agent,
            loading: false,
            userData: userData,
            remark: remark,
            ticketissue: ticketissue,
            description: description,
            nonitissue: nonitissue,
            nonitesubissue: nonitesubissue,
            itissue: itissue,
            priority: priority,
          });
        } else {
          this.setState({
            loading: false,
            userData: userData,
            editItem: data,
            editMode: editMode,
          });
        }
      },
      e => {
        this.setState({
          loading: false,
          userData: userData,
          editItem: data,
          editMode: editMode,
        });
      },
    );
  };

  backClick = () => {
    this.setState(this.returnState(false, true));
    if (this.state.editMode === true) {
      NavigationActions.navigate('TrackQuery');
      BackHandler.removeEventListener('hardwareBackPress', this.backClick);
      return true;
    }
    NavigationActions.goBack();
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    return true;
  };

  returnState = (loading, resetAgentList) => {
    return {
      agentList: resetAgentList ? [] : this.state.agentList,
      loading: loading,
      remark: '',
      ticketissue: '',
      itissue: '',
      nonitissue: '',
      nonitesubissue: '',
      description: '',
      priority: 'Low',
      extraFileUploadArray: [],
    };
  };

  componentWillUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  submitt = () => {
    let checkData = true;
    const body = JSON.parse(JSON.stringify(this.state));
    const {userData, editItem, editMode} = body;

    if (body.ticketissue === '') {
      checkData = false;
      Helper.showToastMessage('Please, Select ticket type', 0);
      return false;
    } else if (
      body.ticketissue === 'IT/Software/App Issue' &&
      body.itissue === ''
    ) {
      checkData = false;
      Helper.showToastMessage('Please, Select IT Issue', 0);
      return false;
    } else if (body.ticketissue === 'Non-IT Issue' && body.nonitissue === '') {
      checkData = false;
      Helper.showToastMessage('Please, Select Non-IT Issue', 0);
      return false;
    } else if (
      body.ticketissue === 'Non-IT Issue' &&
      body.nonitissue !== '' &&
      body.nonitesubissue === ''
    ) {
      checkData = false;
      Helper.showToastMessage('Please, Select Sub Issue', 0);
      return false;
    }
    // else if (body.description === '') {
    //   checkData = false;
    //   Helper.showToastMessage('Description empty', 0);
    //   return false;
    // } else if (body.remark === '') {
    //   checkData = false;
    //   Helper.showToastMessage('Remark empty', 0);
    //   return false;
    // }

    const agentList = body.agentList;
    //console.log('agentList', agentList)

    if (agentList.length === 0) {
      checkData = false;
      Helper.showToastMessage(`No team found, please try after some time`, 0);
      return false;
    }

    if (checkData) {
      if (
        Helper.nullCheck(userData) === false &&
        Helper.nullCheck(userData.rcontact) === true
      ) {
        userData.rcontact = userData.mobile;
      }

      if (
        Helper.nullCheck(userData) === false &&
        Helper.nullCheck(userData.rname) === true
      ) {
        userData.rname = userData.username;
      }

      let subject = '';
      let type = '';
      let agentUserID = -1;
      const productSelected = body.nonitissue;

      if (body.ticketissue === 'IT/Software/App Issue') {
        subject = `${body.itissue}`;
        type = 'IT Issue';
        // const findTeam = lodash.find(agentList, io => io.supportTeamId === '1');
        // //console.log('findTeamT', findTeam);
        // if (findTeam != undefined) {
        //   agentUserID = findTeam.user_id;
        // }
      } else if (body.ticketissue === 'Non-IT Issue') {
        subject = `${productSelected} | ${body.nonitesubissue}`;
        type = 'Non-IT Issue';
        //console.log('body.nonitesubissue', body.nonitesubissue);
       
        // if (
        //   body.nonitesubissue === 'Tax Related' ||
        //   body.nonitesubissue === 'Payout' ||
        //   body.nonitesubissue == 'Invoice'
        // ) {
        //   const findTeam = lodash.find(
        //     agentList,
        //     io => io.supportTeamId === '3',
        //   );
        //   //console.log('findTeamNT', findTeam);
        //   if (findTeam != undefined) {
        //     agentUserID = findTeam.user_id;
        //   }
        // } else {
        //   const findTeam = lodash.find(agentList, io => {
        //     //const teamid = io.supportTeamId === '2';
        //     const desg = String(io.designation).trim();
        //     let designationCheck = '';
        //     if (productSelected.includes('Insurance')) {
        //       designationCheck = io.supportTeamId === '9';
        //       //desg === 'Insurance';
        //     } else if (productSelected === 'Home Loan') {
        //       designationCheck = io.supportTeamId === '4';
        //       //desg === 'Home Loan';
        //     } else if (productSelected === 'Business Loan') {
        //       designationCheck = io.supportTeamId === '7';
        //       //designationCheck = desg === 'Business Loan';
        //     } else if (productSelected === 'Credit Card') {
        //       //designationCheck = desg === 'Credit Card';
        //       designationCheck = io.supportTeamId === '8';
        //     } else if (productSelected === 'Loan Against Property') {
        //       //designationCheck = desg === 'Loan Against Property';
        //       designationCheck = io.supportTeamId === '6';
        //     } else if (productSelected === 'Personal Loan') {
        //       //designationCheck = desg === 'Personal Loan';
        //       designationCheck = io.supportTeamId === '5';
        //     } else if (productSelected === 'Investment'){
        //       //designationCheck = desg === 'Investment';
        //       designationCheck = io.supportTeamId === '10';
        //     }
        //     //return teamid && designationCheck;
        //     return designationCheck;
        //   });
        //   if (findTeam != undefined) {
        //     agentUserID = findTeam.user_id;
        //   }

        //   // if (productSelected.includes('Insurance')) {
        //   //   const findTeam = lodash.find(
        //   //     agentList,
        //   //     io => io.supportTeamId === '2' && io.designation.toLowerCase() === 'insurance',
        //   //   );
        //   //   //console.log('findTeamNT', findTeam);
        //   //   if (findTeam != undefined) {
        //   //     agentUserID = findTeam.user_id;
        //   //   }
        //   // } else {
        //   //   const findTeam = lodash.find(
        //   //     agentList,
        //   //     io =>
        //   //       io.supportTeamId === '2' &&
        //   //       io.designation.toLowerCase() === productSelected.toLowerCase(),
        //   //   );
        //   //   //console.log('findTeamNT', findTeam);
        //   // }
        // }
      }

      const findTeam = lodash.find(agentList,io => {
        const replace = io.designation.replace(/\s/g, '_');
        const currentProduct = productSelected.replace(/\s/g, '_');
        if(type === 'IT Issue'){
          return io.supportTeamId === '1';
        }else if(body.nonitesubissue === 'Tax Related' || body.nonitesubissue === 'Payout' || body.nonitesubissue == 'Invoice'){
          return io.supportTeamId === '3';
        }else if(String(replace).toLowerCase() === String(currentProduct).toLowerCase()){
          return io;
        }
        return undefined;
      });
      //console.log('findTeamNT', findTeam);
      if (findTeam != undefined) {
        agentUserID = findTeam.user_id;
      }

      //console.log('agentUserID', agentUserID)

      if (agentUserID === -1) {
        Helper.showToastMessage(`No team found, please try after some time`, 0);
        return false;
      }

      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('type', type);
      formData.append('name', userData.rname);
      formData.append('mobile', userData.rcontact);
      formData.append('from', userData.email);
      formData.append('actAsType', 'customer');
      formData.append('message', body.remark);
      formData.append('source', 'app');
      formData.append('description', body.description);
      if (body.priority === '') {
        formData.append('prioritycode', 'low');
      } else {
        formData.append('prioritycode', body.priority.toLowerCase());
      }

      if (editMode === true) {
        const {ticket_id} = editItem;
        formData.append('ticketID', Number(ticket_id));
      } else {
        formData.append('ticketID', '');
      }

      // body.subject = subject;
      // body.type = type;
      // body.name = userData.rname;
      // body.mobile = userData.rcontact;
      // body.from = userData.email;
      // body.actAsType = 'customer';
      // body.message = body.remark;

      if (attachmentsList.length > 0) {
        lodash.map(attachmentsList, (io, index) => {
          formData.append(`attachments[${index}]`, io);
        });
      }

      delete body.userData;
      delete body.loading;

      //console.log('body', formData);

      this.setState({loading: true});

      Helper.networkHelperHelpDeskTicket(
        Pref.UVDESK_TICKET_URL,
        formData,
        Pref.methodPost,
        Pref.UVDESK_API,
        result => {
          //console.log('result', result);
          const {message} = JSON.parse(JSON.stringify(result));
          if (message.includes('Success')) {
            const ticketID = result.ticketId;
            const agentBody = {id: agentUserID};
            //console.log('agentBody', agentBody);
            Helper.networkHelperHelpDeskTicket(
              `${Pref.UVDESK_ASSIGN_AGENT}${ticketID}/agent`,
              JSON.stringify(agentBody),
              Pref.methodPut,
              Pref.UVDESK_API,
              result => {
                //console.log('result1', result);
                const {success} = JSON.parse(JSON.stringify(result));
                this.setState({loading: false});
                if (success.includes('Success')) {
                  Helper.showToastMessage(
                    editMode
                      ? 'Success ! Ticket updated successfully'
                      : 'Success ! Ticket has been created successfully.',
                    1,
                  );
                  NavigationActions.navigate('TrackQuery');
                } else {
                  if(result.description.includes('already assigned')){
                    Helper.showToastMessage('Ticket updated successfully');
                  }else{
                    Helper.showToastMessage(
                      editMode
                        ? `Failed to update ticket`
                        : `Failed to create ticket`,
                      0,
                    );
                  }
                }
              },
              e => {
                this.setState({loading: false});
                Helper.showToastMessage(`Something went wrong`, 0);
              },
            );
          } else {
            this.setState({loading: false});
            Helper.showToastMessage(`Failed to create ticket`, 0);
          }
        },
        e => {
          this.setState({loading: false});
          Helper.showToastMessage(`Something went wrong`, 0);
        },
      );
    }
  };

  render() {
    const {editMode} = this.state;
    return (
      <CScreen
        absolute={<Loader isShow={this.state.loading} />}
        body={
          <>
            <LeftHeaders
              title={Helper.getScreenName(this.props)}
              // title={`Raise A Ticket`}
              bottomtext={
                <>
                  {editMode ? 'Edit ' : `Raise A `}
                  {
                    <Title style={styles.passText}>
                      {editMode ? `Ticket` : `Ticket`}
                    </Title>
                  }
                </>
              }
              bottomtextStyle={{
                color: '#555555',
                fontSize: 20,
              }}
              showBack
              backClicked={() => {
                if (this.state.editMode === true) {
                  NavigationActions.navigate('TrackQuery');
                } else {
                  NavigationActions.goBack();
                }
              }}
            />

            <View styleName="md-gutter">
              <NewDropDown
                list={ticketIssueList}
                placeholder={`Select Ticket Type`}
                starVisible
                value={this.state.ticketissue}
                selectedItem={(value) =>
                  this.setState({
                    ticketissue: value,
                    itissue: '',
                    nonitissue: '',
                    nonitesubissue: '',
                  })
                }
                style={styles.dropdowncontainers}
                textStyle={styles.dropdowntextstyle}
              />

              {this.state.ticketissue === 'IT/Software/App Issue' ? (
                <NewDropDown
                  list={itIssueList}
                  placeholder={`Select Issue`}
                  starVisible
                  value={this.state.itissue}
                  selectedItem={(value) => this.setState({itissue: value})}
                  style={styles.dropdowncontainers}
                  textStyle={styles.dropdowntextstyle}
                />
              ) : null}

              {this.state.ticketissue === 'Non-IT Issue' ? (
                <NewDropDown
                  list={nonitIssueList}
                  placeholder={`Select Product`}
                  starVisible
                  value={this.state.nonitissue}
                  selectedItem={(value) => this.setState({nonitissue: value})}
                  style={styles.dropdowncontainers}
                  textStyle={styles.dropdowntextstyle}
                />
              ) : null}

              {this.state.nonitissue !== '' ? (
                <NewDropDown
                  list={nonitesubIssueList}
                  placeholder={`Select Issue`}
                  starVisible
                  value={this.state.nonitesubissue}
                  selectedItem={(value) =>
                    this.setState({nonitesubissue: value})
                  }
                  style={styles.dropdowncontainers}
                  textStyle={styles.dropdowntextstyle}
                />
              ) : null}

              <NewDropDown
                list={priorityList}
                placeholder={`Select Priority`}
                value={this.state.priority}
                selectedItem={(value) => this.setState({priority: value})}
                style={styles.dropdowncontainers}
                textStyle={styles.dropdowntextstyle}
              />

              <CustomForm
                value={this.state.description}
                onChange={(v) => this.setState({description: v})}
                label={`Short Description`}
                placeholder={`Enter description`}
                keyboardType={'text'}
                multiline
                maxLength={50}
              />

              <CustomForm
                value={this.state.remark}
                onChange={(v) => this.setState({remark: v})}
                label={`Remark`}
                placeholder={`Enter remark`}
                keyboardType={'text'}
                multiline
                maxLength={200}
              />

              <CommonFileUpload
                showPlusIcon={true}
                plusClicked={() => {
                  if (this.state.extraFileUploadArray.length < 2) {
                    this.state.extraFileUploadArray.push(1);
                    this.setState({
                      extraFileUploadArray: this.state.extraFileUploadArray,
                    });
                  }
                }}
                title={'Attachment'}
                type={2}
                pickedCallback={(selected, res) => {
                  attachmentsList.push(res);
                }}
              />

              {this.state.extraFileUploadArray.length > 0 ? (
                <>
                  {this.state.extraFileUploadArray.map((io, index) => {
                    return (
                      <CommonFileUpload
                        minusClicked={() => {
                          this.state.extraFileUploadArray.splice(index, 1);
                          this.setState({
                            extraFileUploadArray: this.state
                              .extraFileUploadArray,
                          });
                        }}
                        showMinusIcon
                        title={`Attachment ${index + 1}`}
                        type={2}
                        pickedCallback={(selected, res) => {
                          attachmentsList.push(res);
                        }}
                      />
                    );
                  })}
                </>
              ) : null}

              <View styleName="horizontal space-between md-gutter v-center h-center">
                <Button
                  mode={'flat'}
                  uppercase={false}
                  dark={true}
                  loading={false}
                  style={styles.loginButtonStyle}
                  onPress={this.submitt}>
                  <Title style={styles.btntext}>{`Submit`}</Title>
                </Button>
              </View>
            </View>

            <Image
              source={require('../../res/images/customerservice.png')}
              styleName="medium-portrait"
              style={{
                resizeMode: 'contain',
                alignSelf: 'center',
              }}
            />
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
  dropdowntextstyle: {
    color: '#6d6a57',
    fontSize: 14,
    fontFamily: Pref.getFontName(4),
  },
  dropdowncontainers: {
    borderRadius: 0,
    borderBottomColor: '#f2f1e6',
    borderBottomWidth: 1.3,
    borderWidth: 0,
    marginStart: 10,
    marginEnd: 10,
    paddingVertical: 10,
    marginStart: 12,
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
  textopen: {
    fontSize: 14,
    fontWeight: '700',
    color: '#555555',
    lineHeight: 20,
    alignSelf: 'center',
    marginStart: 4,
    letterSpacing: 0.5,
  },
  btntext: {
    color: 'white',
    fontSize: 16,
    letterSpacing: 0.5,
    fontWeight: '700',
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
  boxstyle: {
    flexDirection: 'row',
    height: 48,
    borderBottomColor: Colors.grey300,
    borderRadius: 2,
    borderBottomWidth: 0.6,
    marginVertical: sizeHeight(1),
    justifyContent: 'space-between',
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
    color: 'white',
    backgroundColor: Pref.RED,
    textAlign: 'center',
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 0.5,
    borderRadius: 48,
    width: '40%',
    paddingVertical: 4,
    fontWeight: '700',
    marginTop: 12,
  },
  boxsubtitle: {
    fontSize: 16,
    fontFamily: 'Rubik',
    fontWeight: '400',
    color: '#292929',
    lineHeight: 25,
    alignSelf: 'center',
    padding: 4,
    alignSelf: 'center',
    marginHorizontal: 8,
  },
  bbstyle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6d6a57',
    lineHeight: 20,
    marginStart: 4,
    letterSpacing: 0.5,
    paddingVertical: 10,
  },
  radiocont: {
    marginStart: 10,
    marginEnd: 10,
    borderBottomWidth: 1.3,
    borderBottomColor: '#f2f1e6',
    alignContent: 'center',
  },
  copy: {
    marginStart: 10,
    marginEnd: 10,
    alignContent: 'center',
    paddingVertical: 10,
  },
});
