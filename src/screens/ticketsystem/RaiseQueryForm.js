import React from 'react';
import { StyleSheet, BackHandler } from 'react-native';
import { Title, View,Image } from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import { Button, Colors } from 'react-native-paper';
import { sizeHeight, sizeWidth } from '../../util/Size';
import CustomForm from '../finorbit/CustomForm';
import LeftHeaders from '../common/CommonLeftHeader';
import Loader from '../../util/Loader';
import CScreen from '../component/CScreen';
import NewDropDown from '../component/NewDropDown';
import CommonFileUpload from '../common/CommonFileUpload';

let ticketIssueList = [
  {
    value: 'IT/Software/App Issue',
  },
  {
    value: 'Non-It Issue',
  },
];

let itIssueList = [
  { value: 'My Profile' },
  { value: 'My FinPro' },
  { value: 'Marketing Tool' },
  { value: 'FinTrain Learning' },
  { value: 'Popular Plan' },
  { value: 'Offers' },
  { value: 'Wallet' },
  { value: 'FinTeam Manager' },
  { value: 'FinNews' },
  { value: 'HelpDesk/Relation Manager' },
];

let nonitIssueList = [
  {
    value: 'Term Insurance',
  },
  {
    value: 'Health Insurance',
  },
  {
    value: 'Motor Insurance',
  },
  {
    value: 'Insurance Samadhan',
  },
  {
    value: 'Life Cum Investment Plan',
  },
  {
    value: 'Fixed Deposit',
  },
  {
    value: 'Mutual Fund',
  },
  {
    value: 'Credit Card',
  },
  {
    value: 'Home Loan',
  },
  {
    value: 'Loan Against Property',
  },
  {
    value: 'Personal Loan',
  },
  {
    value: 'Business Loan',
  },
  {
    value: 'Auto Loan',
  },
  //   {
  //   value: 'Vector Plus',
  // },
  // {
  //   value: 'Insure Check',
  // },
  //   {
  //   value: 'Religare Group Plan',
  // },
  // {
  //   value: 'Hello Doctor Policy',
  // },
  // {
  //   value: 'Asaan Health Policy',
  // },
  // {
  //   value: 'Sabse Asaan Health Plan',
  // },
];

let nonitesubIssueList = [
  {
    value: 'Payout',
  },
  {
    value: 'Invoice',
  },
  {
    value: 'TDS',
  },
  {
    value: 'Bank/Insurance Company related query',
  },
  {
    value: 'Other',
  },
];

export default class RaiseQueryForm extends React.Component {
  constructor(props) {
    super(props);
    this.submitt = this.submitt.bind(this);
    this.backClick = this.backClick.bind(this);
    this.state = this.returnState();
    Pref.getVal(Pref.userData, value => this.setState({ userData: value }));
    Pref.getVal(Pref.saveToken, value => this.setState({ token: value }));
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backClick);
    this.setState(this.returnState());
  }

  backClick = () => {
    this.setState(this.returnState());
    return false;
  };

  returnState = () =>{
    return {
      loading: false,
      remark: '',
      ticketissue: '',
      itissue: '',
      nonitissue: '',
      nonitesubissue: "",
      attachment:''
    };
  }

  componentWillUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backClick);
  }

  submitt = () => {
    let checkData = true;
    const body = JSON.parse(JSON.stringify(this.state));
    delete body.userData;
    delete body.token;


    if (checkData) {
      this.setState({ loading: true });
      // Helper.networkHelperTokenPost(
      //   Pref.AddTeam,
      //   JSON.stringify(body),
      //   Pref.methodPost,
      //   this.state.token,
      //   result => {
      //     const { response_header } = result;
      //     const { res_type, message } = response_header;
      //     this.setState({ loading: false });
      //     if (res_type === `error`) {
      //       Helper.showToastMessage(message, 0);
      //     } else {
      //       Helper.showToastMessage(`Added successfully`, 1);
      //     }
      //   },
      //   (e) => {
      //     this.setState({ loading: false });
      //   },
      // );
    }
  };

  render() {
    return (
      <CScreen
        absolute={<Loader isShow={this.state.loading} />}
        body={
          <>
            <LeftHeaders
              title={`Raise A Ticket`}
              bottomtext={
                <>
                  {`Raise A `}
                  {<Title style={styles.passText}>{`Query`}</Title>}
                </>
              }
              bottomtextStyle={{
                color: '#555555',
                fontSize: 20,
              }}
              showBack
            />

            <View styleName="md-gutter">
              <NewDropDown
                list={ticketIssueList}
                placeholder={`Select Ticket Type`}
                starVisible
                value={this.state.ticketissue}
                selectedItem={value => this.setState({ ticketissue: value, itissue: '', nonitissue: '', nonitesubissue:''})}
                style={styles.dropdowncontainers}
                textStyle={styles.dropdowntextstyle}
              />

              {this.state.ticketissue === 'IT/Software/App Issue' ? (
                <NewDropDown
                  list={itIssueList}
                  placeholder={`Select IT Issue`}
                  starVisible
                  value={this.state.itissue}
                  selectedItem={value => this.setState({ itissue: value })}
                  style={styles.dropdowncontainers}
                  textStyle={styles.dropdowntextstyle}
                />
              ) : null}

              {this.state.ticketissue === 'Non-It Issue' ?
                <NewDropDown
                  list={nonitIssueList}
                  placeholder={`Select Non-IT Issue`}
                  starVisible
                  value={this.state.nonitissue}
                  selectedItem={value => this.setState({ nonitissue: value })}
                  style={styles.dropdowncontainers}
                  textStyle={styles.dropdowntextstyle}
                /> : null}

              {this.state.nonitissue !== '' ? <NewDropDown
                list={nonitesubIssueList}
                placeholder={`Select Non-IT Issue`}
                starVisible
                value={this.state.nonitesubissue}
                selectedItem={value => this.setState({ nonitesubissue: value })}
                style={styles.dropdowncontainers}
                textStyle={styles.dropdowntextstyle}
              /> : null}

              <CommonFileUpload
                title={''}
                type={2}
                pickedCallback={(selected, res) => {
                  if (!selected) {
                    const { name } = res;
                    if (
                      // name.includes('pdf') ||
                      name.includes('png') ||
                      name.includes('jpeg') ||
                      name.includes('jpg')
                    ) {
                      this.setState({attachment:res});
                    } else {
                      Helper.showToastMessage('Please, select Pdf or Image', 0);
                    }
                  }
                }}
              />

              <CustomForm
                value={this.state.remark}
                onChange={v => this.setState({ remark: v })}
                label={`Remark`}
                placeholder={`Enter remark`}
                keyboardType={'text'}
                multiline
                maxLength={128}
              />

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
                alignSelf:'center'
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
