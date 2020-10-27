import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, ScrollView} from 'react-native';
import {Text, View, Subtitle, Heading, Title} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {Button, Card, Colors} from 'react-native-paper';
import {sizeHeight, sizeWidth} from '../../util/Size';
import CommonScreen from '../common/CommonScreen';
import CustomForm from '../finorbit/CustomForm';
import LeftHeaders from '../common/CommonLeftHeader';
import Loader from '../../util/Loader';
import DropDown from '../common/CommonDropDown';
import Icon from 'react-native-vector-icons/Feather';
import CScreen from '../component/CScreen';

export default class AddConnector extends React.PureComponent {
  constructor(props) {
    super(props);
    this.submitt = this.submitt.bind(this);
    this.state = this.returnst();
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({loading: false});
    });
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.userData, (userData) => {
        this.setState({userData: userData});
        Pref.getVal(Pref.saveToken, (value) => {
          this.setState({token: value}, () => {
            //this.fetchData();
          });
        });
      });
    });
  }

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  fetchData = () => {
    this.setState({loading: false});
    const {userData} = this.state;
    const {id} = userData;
    const body = JSON.stringify({refercode: id});
    Helper.networkHelperTokenPost(
      Pref.PayoutUrl,
      body,
      Pref.methodPost,
      this.state.token,
      (result) => {
        const {data, response_header} = result;
        const {res_type} = response_header;
        if (res_type === `success`) {
          const {
            hl,
            lap,
            pl,
            bl,
            al,
            cc,
            fd,
            hi,
            is,
            ic,
            lcip,
            mi,
            mf,
            ti,
            vp,
          } = data;
          const text = `${hl[0].split('_')[1]},${hl[1].split('_')[1]},${
            hl[2].split('_')[1]
          }`;
          const text1 = `${lap[0].split('_')[1]},${lap[1].split('_')[1]},${
            lap[2].split('_')[1]
          }`;
          const text2 = `${pl[0].split('_')[1]},${pl[1].split('_')[1]},${
            pl[2].split('_')[1]
          }`;
          const text3 = `${bl[0].split('_')[1]},${bl[1].split('_')[1]},${
            bl[2].split('_')[1]
          }`;
          const text4 = `${al[0].split('_')[1]},${al[1].split('_')[1]},${
            al[2].split('_')[1]
          }`;

          const text5 = `${cc[0]}`;
          const text6 = `${fd[0]}`;
          const text7 = `${is[0]}`;
          const text8 = `${ic[0]}`;
          const text9 = `${mf[0]}`;
          const text10 = `${ti[0]}`;
          const text11 = `${vp[0]}`;
          const text12 = `${lcip[0]}`;
          const text13 = `${hi[0].replace('a')}`;
          const text14 = `${hi[1].replace('ua')}`;
          const text15 = `${mi[0].replace('c')}`;
          const text16 = `${mi[1].replace('tp')}`;

          this.setState({
            hi_adultp: text13.replace('undefined', ''),
            hi_nonp: text14.replace('undefined', ''),
            mi_compp: text15.replace('undefined', ''),
            mi_thirdp: text16.replace('undefined', ''),
            lcipp: text12,
            home_loanp: text,
            ccp: text5,
            fdp: text6,
            isp: text7,
            inCheckp: text8,
            mfp: text9,
            tip: text10,
            vpp: text11,
            lapp: text1,
            plp: text2,
            blp: text3,
            alp: text4,
            loading: false,
          });
        } else {
          this.setState({loading: false});
        }
      },
      () => {
        this.setState({loading: false});
      },
    );
  };

  returnst = () => {
    return {
      loading: false,
      name: '',
      mobile_no: '',
      profession: '',
      email: '',
      refercode: '',
      pancard: '',
      token: '',
      userData: '',
      gstno: '',
      companyname: '',
      location: '',
      showCityList: false,
      enbleerror: false,
      hi_adultp: '',
      hi_nonp: '',
      mi_compp: '',
      mi_thirdp: '',
      lcipp: '',
      home_loanp: '',
      ccp: '',
      fdp: '',
      isp: '',
      inCheckp: '',
      mfp: '',
      tip: '',
      vpp: '',
      lapp: '',
      plp: '',
      blp: '',
      alp: '',
    };
  };

  randompass = () => {
    var array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array.slice(0, 4).join('');
  };

  submitt = () => {
    const {refercode} = this.state.userData;
    let checkData = true;
    const body = JSON.parse(JSON.stringify(this.state));
    delete body.userData;
    delete body.token;

    if (body.name === '') {
      Helper.showToastMessage('Name empty', 0);
      return false;
    } else if (body.mobile_no === '') {
      Helper.showToastMessage('Mobile Number empty', 0);
      return false;
    } else if (body.mobile_no.length < 10 || body.mobile_no === '9876543210') {
      Helper.showToastMessage('Invalid Mobile Number', 0);
      return false;
    } else if (body.email === '') {
      Helper.showToastMessage('Email empty', 0);
      return false;
    } else if (Helper.emailCheck(body.email) === false) {
      Helper.showToastMessage('Invalid Email', 0);
      return false;
    } else if (body.profession === '') {
      Helper.showToastMessage('Profession empty', 0);
      return false;
    } else if (!Helper.checkPanCard(body.pancard)) {
      Helper.showToastMessage('Invalid Pancard number', 0);
      return false;
    } else if (body.location === '') {
      Helper.showToastMessage('Please, select location', 0);
      return false;
    }

    body.master_refercode = refercode;
    body.cper = '0';
    body.password = `${this.randompass()}`;

    //console.log(`body`, body);

    if (checkData) {
      this.setState({loading: true});
      Helper.networkHelperTokenPost(
        Pref.ConnectorregisterUrl,
        JSON.stringify(body),
        Pref.methodPost,
        this.state.token,
        (result) => {
          const {response_header} = result;
          const {res_type, message} = response_header;
          this.setState({loading: false});
          if (res_type === `error`) {
            Helper.showToastMessage(message, 0);
          } else {
            this.setState({
              loading: false,
              name: '',
              mobile_no: '',
              profession: '',
              email: '',
              refercode: '',
              pancard: '',
              gstno: '',
              companyname: '',
              location: '',
              showCityList: false,
              enbleerror: false,
            });
            Helper.showToastMessage(`Added successfully`, 1);
          }
        },
        (e) => {
          console.log(e);
          this.setState({loading: false});
        },
      );
    }
  };

  changeText = (v, place) => {
    let p = place.includes(',') ? place.split(',')[0] : place;
    if (Number(v) >= Number(p) || Number(v) <= Number(p)) {
      Helper.showToastMessage(`Value needs to be between 0 & ${p}`);
      this.setState({enbleerror: true});
      return false;
    }
  };

  render() {
    return (
      <CScreen
        absolute={<Loader isShow={this.state.loading} />}
        body={
          <>
            <LeftHeaders
              title={`New Leader`}
              bottomtext={
                <>
                  {`New `}
                  {<Title style={styles.passText}>{`Leader`}</Title>}
                </>
              }
              bottomtextStyle={{
                color: '#555555',
                fontSize: 20,
              }}
              showBack
            />

            <View styleName="md-gutter">
              <CustomForm
                value={this.state.name}
                onChange={(v) => this.setState({name: v})}
                label={`Name *`}
                placeholder={`Enter name`}
              />

              <CustomForm
                value={this.state.mobile_no}
                onChange={(v) => {
                  if (String(v).match(/^[0-9]*$/g) !== null) {
                    this.setState({mobile_no: v});
                  }
                }}
                label={`Mobile Number *`}
                placeholder={`Enter mobile number`}
                keyboardType={'numeric'}
                maxLength={10}
              />

              <CustomForm
                value={this.state.email}
                onChange={(v) => this.setState({email: v})}
                label={`Email *`}
                placeholder={`Enter email`}
                keyboardType={'email-address'}
              />

              <CustomForm
                value={this.state.companyname}
                onChange={(v) => this.setState({companyname: v})}
                label={`Company Name`}
                placeholder={`Enter company name`}
              />

              <CustomForm
                value={this.state.profession}
                onChange={(v) => this.setState({profession: v})}
                label={`Profession *`}
                placeholder={`Enter profession`}
              />

              <CustomForm
                value={this.state.pancard}
                onChange={(v) => this.setState({pancard: v})}
                label={`Pancard Number *`}
                placeholder={`Enter pancard number`}
                maxLength={10}
              />

              <CustomForm
                value={this.state.gstno}
                onChange={(v) => this.setState({gstno: v})}
                label={`GST Number `}
                placeholder={`Enter gst number`}
                maxLength={15}
              />

              <View style={styles.radiocont}>
                <TouchableWithoutFeedback
                  onPress={() =>
                    this.setState({
                      showCityList: !this.state.showCityList,
                    })
                  }>
                  <View style={styles.dropdownbox}>
                    <Subtitle
                      style={[
                        styles.boxsubtitle,
                        {
                          color:
                            this.state.location === `` ? `#6d6a57` : `#555555`,
                        },
                      ]}>
                      {this.state.location === ''
                        ? 'Select Location *'
                        : this.state.location}
                    </Subtitle>
                    <Icon
                      name={'chevron-down'}
                      size={24}
                      color={'#6d6a57'}
                      style={styles.downIcon}
                    />
                  </View>
                </TouchableWithoutFeedback>
                {this.state.showCityList ? (
                  <DropDown
                    itemCallback={(value) =>
                      this.setState({
                        showCityList: false,
                        location: value,
                      })
                    }
                    list={Pref.citiesList}
                    isCityList
                    enableSearch
                  />
                ) : null}
              </View>

              {/* <View>
                    <View>
                      <View
                        style={{
                          marginTop: sizeHeight(2),
                          marginBottom: sizeHeight(1),
                        }}
                        styleName="horizontal">
                        <View
                          styleName="vertical"
                          style={{marginStart: sizeWidth(2)}}>
                          <Subtitle style={styles.title}>
                            {`Commission Percentage`}
                          </Subtitle>
                        </View>
                      </View>
                      <View style={styles.line} />
                    </View>

                    <View styleName="horizontal" style={{flex: 1}}>
                      <CustomForm
                        showTopText
                        value={this.state.home_loan}
                        onChange={(v) => {
                          this.changeText(v, this.state.home_loanp);
                          this.setState({home_loan: v, enbleerror: false});
                        }}
                        label={`Home Loan `}
                        placeholder={this.state.home_loanp}
                        keyboardType={'numeric'}
                        style={{flex: 0.5}}
                      />
                      <CustomForm
                        value={this.state.lap}
                        onChange={(v) => {
                          this.changeText(v, this.state.lapp);
                          this.setState({lap: v, enbleerror: false});
                        }}
                        label={`Loan Against Property`}
                        placeholder={this.state.home_loanp}
                        placeholder={this.state.lapp}
                        keyboardType={'numeric'}
                        style={{flex: 0.5}}
                      />
                    </View>
                    <View styleName="horizontal" style={{flex: 1}}>
                      <CustomForm
                        value={this.state.cc}
                        onChange={(v) => {
                          this.changeText(v, this.state.ccp);
                          this.setState({cc: v, enbleerror: false});
                        }}
                        label={`Credit Card`}
                        placeholder={this.state.ccp}
                        keyboardType={'numeric'}
                        style={{flex: 0.5}}
                      />
                      <CustomForm
                        value={this.state.pl}
                        onChange={(v) => {
                          this.changeText(v, this.state.plp);
                          this.setState({pl: v, enbleerror: false});
                        }}
                        label={`Personal Loan`}
                        placeholder={this.state.plp}
                        keyboardType={'numeric'}
                        style={{flex: 0.5}}
                      />
                    </View>

                    <View styleName="horizontal" style={{flex: 1}}>
                      <CustomForm
                        value={this.state.bl}
                        onChange={(v) => {
                          this.changeText(v, this.state.blp);
                          this.setState({bl: v, enbleerror: false});
                        }}
                        label={`Business Loan `}
                        placeholder={this.state.blp}
                        keyboardType={'numeric'}
                        style={{flex: 0.5}}
                      />
                      <CustomForm
                        value={this.state.al}
                        onChange={(v) => {
                          this.changeText(v, this.state.alp);
                          this.setState({al: v, enbleerror: false});
                        }}
                        label={`Auto Loan`}
                        placeholder={this.state.alp}
                        keyboardType={'numeric'}
                        style={{flex: 0.5}}
                      />
                    </View>

                    <View styleName="horizontal" style={{flex: 1}}>
                      <CustomForm
                        value={this.state.mf}
                        onChange={(v) => {
                          this.changeText(v, this.state.mfp);
                          this.setState({mf: v, enbleerror: false});
                        }}
                        label={`Mutual Fund `}
                        placeholder={this.state.mfp}
                        keyboardType={'numeric'}
                        style={{flex: 0.5}}
                      />
                      <CustomForm
                        value={this.state.is}
                        onChange={(v) => {
                          this.changeText(v, this.state.isp);
                          this.setState({is: v, enbleerror: false});
                        }}
                        label={`Insurance Samadhan`}
                        placeholder={this.state.isp}
                        keyboardType={'numeric'}
                        style={{flex: 0.5}}
                      />
                    </View>

                    <View styleName="horizontal" style={{flex: 1}}>
                      <CustomForm
                        value={this.state.fd}
                        onChange={(v) => {
                          this.changeText(v, this.state.fdp);
                          this.setState({fd: v, enbleerror: false});
                        }}
                        label={`Fixed Deposit `}
                        placeholder={this.state.fdp}
                        keyboardType={'numeric'}
                        style={{flex: 0.5}}
                      />
                      <CustomForm
                        value={this.state.mi_comp}
                        onChange={(v) => {
                          this.changeText(v, this.state.mi_compp);
                          this.setState({mi_comp: v, enbleerror: false});
                        }}
                        label={`Motor Insurance Comprehensive`}
                        placeholder={this.state.mi_compp}
                        keyboardType={'numeric'}
                        style={{flex: 0.5}}
                      />
                    </View>

                    <View styleName="horizontal" style={{flex: 1}}>
                      <CustomForm
                        value={this.state.mi_third}
                        onChange={(v) => {
                          this.changeText(v, this.state.mi_thirdp);
                          this.setState({mi_third: v, enbleerror: false});
                        }}
                        label={`Motor Insurance Third Party`}
                        placeholder={this.state.mi_thirdp}
                        keyboardType={'numeric'}
                        style={{flex: 0.5}}
                      />
                      <CustomForm
                        value={this.state.ti}
                        onChange={(v) => {
                          this.changeText(v, this.state.tip);
                          this.setState({ti: v, enbleerror: false});
                        }}
                        label={`Term Insurance`}
                        placeholder={this.state.tip}
                        keyboardType={'numeric'}
                        style={{flex: 0.5}}
                      />
                    </View>

                    <View styleName="horizontal" style={{flex: 1}}>
                      <CustomForm
                        value={this.state.hi_adult}
                        onChange={(v) => {
                          this.changeText(v, this.state.hi_adultp);
                          this.setState({hi_adult: v, enbleerror: false});
                        }}
                        label={`Health Insurance Non Senior`}
                        placeholder={this.state.hi_adultp}
                        keyboardType={'numeric'}
                        style={{flex: 0.5}}
                      />
                      <CustomForm
                        value={this.state.hi_non}
                        onChange={(v) => {
                          this.changeText(v, this.state.hi_nonp);
                          this.setState({hi_non: v, enbleerror: false});
                        }}
                        label={`Health Insurance Senior`}
                        placeholder={this.state.hi_nonp}
                        keyboardType={'numeric'}
                        style={{flex: 0.5}}
                      />
                    </View>
                    <View styleName="horizontal" style={{flex: 1}}>
                      <CustomForm
                        value={this.state.vp}
                        onChange={(v) => {
                          this.changeText(v, this.state.vpp);
                          this.setState({vp: v, enbleerror: false});
                        }}
                        label={`Vector Plus`}
                        placeholder={this.state.vpp}
                        keyboardType={'numeric'}
                        style={{flex: 0.5}}
                      />
                      <CustomForm
                        value={this.state.lcip}
                        onChange={(v) => {
                          this.changeText(v, this.state.lcipp);
                          this.setState({lcip: v, enbleerror: false});
                        }}
                        label={`Life Cum Invt Plan`}
                        placeholder={this.state.lcipp}
                        keyboardType={'numeric'}
                        style={{flex: 0.5}}
                      />
                    </View>
                    <View styleName="horizontal" style={{flex: 1}}>
                      <CustomForm
                        value={this.state.inCheck}
                        onChange={(v) => {
                          this.changeText(v, this.state.inCheckp);
                          this.setState({inCheck: v, enbleerror: false});
                        }}
                        label={`Insure Check `}
                        placeholder={this.state.inCheckp}
                        keyboardType={'numeric'}
                        style={{flex: 0.5}}
                      />
                    </View>
                  </View>
                  */}
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
                  mode={'flat'}
                  uppercase={false}
                  dark={true}
                  loading={false}
                  style={styles.loginButtonStyle}
                  onPress={this.submitt}>
                  <Title style={styles.btntext}>{`Submit`}</Title>
                </Button>
              </View>
              {/* <Button
                mode={'flat'}
                uppercase={true}
                dark={true}
                loading={false}
                style={[styles.loginButtonStyle]}
                onPress={this.submitt}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 16,
                    letterSpacing: 1,
                  }}>
                  {'SUBMIT'}
                </Text>
              </Button> */}
            </View>
          </>
        }
      />
      // <CommonScreen
      //   title={''}
      //   loading={this.state.loading}
      //   absoluteBody={<Loader isShow={this.state.loading} />}
      //   body={
      //     <>
      //       <LeftHeaders title={'New Leader'} showBack />

      //       <Card
      //         style={{
      //           marginHorizontal: sizeWidth(4),
      //           marginVertical: sizeHeight(2),
      //           paddingHorizontal: sizeWidth(0),
      //         }}>
      //         <ScrollView
      //           showsVerticalScrollIndicator={false}
      //           keyboardShouldPersistTaps={'handled'}>
      // <View>
      //   <CustomForm
      //     value={this.state.name}
      //     onChange={(v) => this.setState({name: v})}
      //     label={`Name *`}
      //     placeholder={`Enter name`}
      //   />

      //   <CustomForm
      //     value={this.state.mobile_no}
      //     onChange={(v) => {
      //       if (String(v).match(/^[0-9]*$/g) !== null) {
      //         this.setState({mobile_no: v});
      //       }
      //     }}
      //     label={`Mobile Number *`}
      //     placeholder={`Enter mobile number`}
      //     keyboardType={'numeric'}
      //     style={{
      //       marginBottom: 2,
      //     }}
      //     maxLength={10}
      //   />

      //   <CustomForm
      //     value={this.state.email}
      //     onChange={(v) => this.setState({email: v})}
      //     label={`Email *`}
      //     placeholder={`Enter email`}
      //     keyboardType={'email-address'}
      //     style={{
      //       marginBottom: 2,
      //     }}
      //   />

      //   <CustomForm
      //     value={this.state.companyname}
      //     onChange={(v) => this.setState({companyname: v})}
      //     label={`Company Name`}
      //     placeholder={`Enter company name`}
      //     style={{
      //       marginBottom: 2,
      //     }}
      //   />

      //   <CustomForm
      //     value={this.state.profession}
      //     onChange={(v) => this.setState({profession: v})}
      //     label={`Profession *`}
      //     placeholder={`Enter profession`}
      //     style={{
      //       marginBottom: 2,
      //     }}
      //   />

      //   <CustomForm
      //     value={this.state.pancard}
      //     onChange={(v) => this.setState({pancard: v})}
      //     label={`Pancard Number *`}
      //     placeholder={`Enter pancard number`}
      //     style={{
      //       marginBottom: 2,
      //     }}
      //     maxLength={10}
      //   />

      //   <CustomForm
      //     value={this.state.gstno}
      //     onChange={(v) => this.setState({gstno: v})}
      //     label={`GST Number `}
      //     placeholder={`Enter gst number`}
      //     style={{
      //       marginBottom: 2,
      //     }}
      //     maxLength={15}
      //   />

      //   <View
      //     style={{
      //       marginHorizontal: sizeWidth(3),
      //     }}>
      //     <TouchableWithoutFeedback
      //       onPress={() =>
      //         this.setState({
      //           showCityList: !this.state.showCityList,
      //         })
      //       }>
      //       <View style={styles.dropdownbox}>
      //         <Subtitle
      //           style={[
      //             styles.boxsubtitle,
      //             {
      //               color:
      //                 this.state.location === ``
      //                   ? `#767676`
      //                   : `#292929`,
      //             },
      //           ]}>
      //           {this.state.location === ''
      //             ? 'Select Location *'
      //             : this.state.location}
      //         </Subtitle>
      //         <Icon
      //           name={'chevron-down'}
      //           size={24}
      //           color={'#767676'}
      //           style={styles.downIcon}
      //         />
      //       </View>
      //     </TouchableWithoutFeedback>
      //     {this.state.showCityList ? (
      //       <DropDown
      //         itemCallback={(value) =>
      //           this.setState({
      //             showCityList: false,
      //             location: value,
      //           })
      //         }
      //         list={Pref.citiesList}
      //         isCityList
      //         enableSearch
      //       />
      //     ) : null}
      //   </View>

      //   {/* <View>
      //     <View>
      //       <View
      //         style={{
      //           marginTop: sizeHeight(2),
      //           marginBottom: sizeHeight(1),
      //         }}
      //         styleName="horizontal">
      //         <View
      //           styleName="vertical"
      //           style={{marginStart: sizeWidth(2)}}>
      //           <Subtitle style={styles.title}>
      //             {`Commission Percentage`}
      //           </Subtitle>
      //         </View>
      //       </View>
      //       <View style={styles.line} />
      //     </View>

      //     <View styleName="horizontal" style={{flex: 1}}>
      //       <CustomForm
      //         showTopText
      //         value={this.state.home_loan}
      //         onChange={(v) => {
      //           this.changeText(v, this.state.home_loanp);
      //           this.setState({home_loan: v, enbleerror: false});
      //         }}
      //         label={`Home Loan `}
      //         placeholder={this.state.home_loanp}
      //         keyboardType={'numeric'}
      //         style={{flex: 0.5}}
      //       />
      //       <CustomForm
      //         value={this.state.lap}
      //         onChange={(v) => {
      //           this.changeText(v, this.state.lapp);
      //           this.setState({lap: v, enbleerror: false});
      //         }}
      //         label={`Loan Against Property`}
      //         placeholder={this.state.home_loanp}
      //         placeholder={this.state.lapp}
      //         keyboardType={'numeric'}
      //         style={{flex: 0.5}}
      //       />
      //     </View>
      //     <View styleName="horizontal" style={{flex: 1}}>
      //       <CustomForm
      //         value={this.state.cc}
      //         onChange={(v) => {
      //           this.changeText(v, this.state.ccp);
      //           this.setState({cc: v, enbleerror: false});
      //         }}
      //         label={`Credit Card`}
      //         placeholder={this.state.ccp}
      //         keyboardType={'numeric'}
      //         style={{flex: 0.5}}
      //       />
      //       <CustomForm
      //         value={this.state.pl}
      //         onChange={(v) => {
      //           this.changeText(v, this.state.plp);
      //           this.setState({pl: v, enbleerror: false});
      //         }}
      //         label={`Personal Loan`}
      //         placeholder={this.state.plp}
      //         keyboardType={'numeric'}
      //         style={{flex: 0.5}}
      //       />
      //     </View>

      //     <View styleName="horizontal" style={{flex: 1}}>
      //       <CustomForm
      //         value={this.state.bl}
      //         onChange={(v) => {
      //           this.changeText(v, this.state.blp);
      //           this.setState({bl: v, enbleerror: false});
      //         }}
      //         label={`Business Loan `}
      //         placeholder={this.state.blp}
      //         keyboardType={'numeric'}
      //         style={{flex: 0.5}}
      //       />
      //       <CustomForm
      //         value={this.state.al}
      //         onChange={(v) => {
      //           this.changeText(v, this.state.alp);
      //           this.setState({al: v, enbleerror: false});
      //         }}
      //         label={`Auto Loan`}
      //         placeholder={this.state.alp}
      //         keyboardType={'numeric'}
      //         style={{flex: 0.5}}
      //       />
      //     </View>

      //     <View styleName="horizontal" style={{flex: 1}}>
      //       <CustomForm
      //         value={this.state.mf}
      //         onChange={(v) => {
      //           this.changeText(v, this.state.mfp);
      //           this.setState({mf: v, enbleerror: false});
      //         }}
      //         label={`Mutual Fund `}
      //         placeholder={this.state.mfp}
      //         keyboardType={'numeric'}
      //         style={{flex: 0.5}}
      //       />
      //       <CustomForm
      //         value={this.state.is}
      //         onChange={(v) => {
      //           this.changeText(v, this.state.isp);
      //           this.setState({is: v, enbleerror: false});
      //         }}
      //         label={`Insurance Samadhan`}
      //         placeholder={this.state.isp}
      //         keyboardType={'numeric'}
      //         style={{flex: 0.5}}
      //       />
      //     </View>

      //     <View styleName="horizontal" style={{flex: 1}}>
      //       <CustomForm
      //         value={this.state.fd}
      //         onChange={(v) => {
      //           this.changeText(v, this.state.fdp);
      //           this.setState({fd: v, enbleerror: false});
      //         }}
      //         label={`Fixed Deposit `}
      //         placeholder={this.state.fdp}
      //         keyboardType={'numeric'}
      //         style={{flex: 0.5}}
      //       />
      //       <CustomForm
      //         value={this.state.mi_comp}
      //         onChange={(v) => {
      //           this.changeText(v, this.state.mi_compp);
      //           this.setState({mi_comp: v, enbleerror: false});
      //         }}
      //         label={`Motor Insurance Comprehensive`}
      //         placeholder={this.state.mi_compp}
      //         keyboardType={'numeric'}
      //         style={{flex: 0.5}}
      //       />
      //     </View>

      //     <View styleName="horizontal" style={{flex: 1}}>
      //       <CustomForm
      //         value={this.state.mi_third}
      //         onChange={(v) => {
      //           this.changeText(v, this.state.mi_thirdp);
      //           this.setState({mi_third: v, enbleerror: false});
      //         }}
      //         label={`Motor Insurance Third Party`}
      //         placeholder={this.state.mi_thirdp}
      //         keyboardType={'numeric'}
      //         style={{flex: 0.5}}
      //       />
      //       <CustomForm
      //         value={this.state.ti}
      //         onChange={(v) => {
      //           this.changeText(v, this.state.tip);
      //           this.setState({ti: v, enbleerror: false});
      //         }}
      //         label={`Term Insurance`}
      //         placeholder={this.state.tip}
      //         keyboardType={'numeric'}
      //         style={{flex: 0.5}}
      //       />
      //     </View>

      //     <View styleName="horizontal" style={{flex: 1}}>
      //       <CustomForm
      //         value={this.state.hi_adult}
      //         onChange={(v) => {
      //           this.changeText(v, this.state.hi_adultp);
      //           this.setState({hi_adult: v, enbleerror: false});
      //         }}
      //         label={`Health Insurance Non Senior`}
      //         placeholder={this.state.hi_adultp}
      //         keyboardType={'numeric'}
      //         style={{flex: 0.5}}
      //       />
      //       <CustomForm
      //         value={this.state.hi_non}
      //         onChange={(v) => {
      //           this.changeText(v, this.state.hi_nonp);
      //           this.setState({hi_non: v, enbleerror: false});
      //         }}
      //         label={`Health Insurance Senior`}
      //         placeholder={this.state.hi_nonp}
      //         keyboardType={'numeric'}
      //         style={{flex: 0.5}}
      //       />
      //     </View>
      //     <View styleName="horizontal" style={{flex: 1}}>
      //       <CustomForm
      //         value={this.state.vp}
      //         onChange={(v) => {
      //           this.changeText(v, this.state.vpp);
      //           this.setState({vp: v, enbleerror: false});
      //         }}
      //         label={`Vector Plus`}
      //         placeholder={this.state.vpp}
      //         keyboardType={'numeric'}
      //         style={{flex: 0.5}}
      //       />
      //       <CustomForm
      //         value={this.state.lcip}
      //         onChange={(v) => {
      //           this.changeText(v, this.state.lcipp);
      //           this.setState({lcip: v, enbleerror: false});
      //         }}
      //         label={`Life Cum Invt Plan`}
      //         placeholder={this.state.lcipp}
      //         keyboardType={'numeric'}
      //         style={{flex: 0.5}}
      //       />
      //     </View>
      //     <View styleName="horizontal" style={{flex: 1}}>
      //       <CustomForm
      //         value={this.state.inCheck}
      //         onChange={(v) => {
      //           this.changeText(v, this.state.inCheckp);
      //           this.setState({inCheck: v, enbleerror: false});
      //         }}
      //         label={`Insure Check `}
      //         placeholder={this.state.inCheckp}
      //         keyboardType={'numeric'}
      //         style={{flex: 0.5}}
      //       />
      //     </View>
      //   </View>
      //   */}
      //   <Button
      //     mode={'flat'}
      //     uppercase={true}
      //     dark={true}
      //     loading={false}
      //     style={[styles.loginButtonStyle]}
      //     onPress={this.submitt}>
      //     <Text
      //       style={{
      //         color: 'white',
      //         fontSize: 16,
      //         letterSpacing: 1,
      //       }}>
      //       {'SUBMIT'}
      //     </Text>
      //   </Button>
      // </View>
      //         </ScrollView>
      //       </Card>
      //     </>
      //   }
      // />
    );
  }
}

/**
 * styles
 */
const styles = StyleSheet.create({
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
  },
  boxsubtitle: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    alignSelf: 'center',
    marginStart: 4,
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
