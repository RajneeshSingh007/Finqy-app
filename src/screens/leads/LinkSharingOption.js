import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import {
  Image,
  Title,
  View,
} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {
  Button,
} from 'react-native-paper';
import { sizeWidth } from '../../util/Size';
import LeftHeaders from '../common/CommonLeftHeader';
import Share from 'react-native-share';
import CScreen from '../component/CScreen';
import Lodash from 'lodash';
import NewDropDown from '../component/NewDropDown';

export default class LinkSharingOption extends React.PureComponent {
  constructor(props) {
    super(props);
    this.shareApp = this.shareApp.bind(this);
    this.shareBtn = this.shareBtn.bind(this);
    this.state = {
      loading: false,
      coupon: '',
      wallet: 0,
      userData: null,
      progressloader: false,
      dataList: [],
      showProduct: true,
      productList: [
        { value: 'Auto Loan', url: `${Pref.FinURL}alform.php` },
        { value: 'Business Loan', url: `${Pref.FinURL}blform.php` },
        { value: 'Credit Card', url: `${Pref.FinURL}ccf.php` },
        { value: 'Fixed Deposit', url: `${Pref.FinURL}fd.php` },
        { value: 'Home Loan', url: `${Pref.FinURL}hlform.php` },
        { value: 'Health Insurance', url: `${Pref.FinURL}hiform.php` },
        { value: 'Insurance Samadhan', url: `${Pref.FinURL}isform.php` },
        { value: 'Insure Check', url: `${Pref.FinURL}ic.php` },
        { value: 'Loan Against Property', url: `${Pref.FinURL}lapform.php` },
        { value: 'Life Cum Investment', url: `${Pref.FinURL}lci.php` },
        { value: 'Motor Insurance', url: `${Pref.FinURL}mi.php` },
        { value: 'Mutual Fund', url: `${Pref.FinURL}mfform.php` },
        { value: 'Personal Loan', url: `${Pref.FinURL}plform.php` },
        { value: 'Term Insurance', url: `${Pref.FinURL}tiform.php` },
        // { value: 'Hello Doctor Policy', url: `${Pref.FinURL}hp.php` },
        // { value: 'Asaan Health Policy', url: `${Pref.FinURL}shp.php` },
        // { value: 'Sabse Asaan Health Plan', url: `${Pref.FinURL}sahp.php` },
        // { value: 'MCD Policy', url: `${Pref.FinURL}religare_form.php` },
      ],
      productName: '',
    };
  }

  componentDidMount() {
    Pref.getVal(Pref.userData, (parse) => {
      this.setState({ userData: parse });
    });
  }

  shareApp = (value) => {
    const userData = this.state.userData;
    const { rcontact, rname, refercode } = userData;
    const url = ``;
    const title = 'ERB Referral';
    const finalUrl = `${value}?ref=${refercode}`
    console.log('finalUrl', finalUrl)
    const message = `Greetings!!\n\nPlease find the below product your looking for\n\nLink – ${finalUrl}\n\nIn case of any query please feel free to call us at ${rcontact}.\n\nYours Sincerely\n${rname}`
    const options = Platform.select({
      ios: {
        activityItemSources: [
          {
            placeholderItem: { type: 'url', content: url },
            item: {
              default: { type: 'url', content: url },
            },
            subject: {
              default: title,
            },
            linkMetadata: { originalUrl: url, url, title },
          },
          {
            placeholderItem: { type: 'text', content: message },
            item: {
              default: { type: 'text', content: message },
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

  shareBtn = () => {
    const { productName, productList } = this.state;
    if (productName === '') {
      Helper.showToastMessage('Please, Select product', 2);
      return false;
    }
    this.setState({ showProduct: false });
    const find = Lodash.find(productList, io => io.value === productName);
    this.shareApp(find.url);
  };

  render() {
    return (
      <CScreen
        body={
          <>
            <LeftHeaders
              showBack
              title={'Link Sharing'}
              // bottomtext={
              //   <>
              //     {`Link `}
              //     <Title style={styles.passText}>{`Sharing`}</Title>
              //   </>
              // }
              bottomtextStyle={{
                color: '#555555',
                fontSize: 20,
              }}
            />

            <View
              style={{
                marginStart: 16,
                marginEnd: 16,
              }}>
              <View styleName="md-gutter">
                <Title
                  style={{
                    fontSize: 16,
                    letterSpacing: 0.5,
                    color: Pref.RED,
                    fontWeight: '700',
                  }}>
                  {`Select Product`}
                </Title>
                <NewDropDown
                  list={this.state.productList}
                  placeholder={''}
                  selectedItem={(value) => this.setState({ productName: value })}
                  value={this.state.productName}
                  style={{
                    borderRadius: 0,
                    borderBottomColor: Pref.RED,
                    borderBottomWidth: 1.5,
                    borderWidth: 0
                  }} />

              </View>

              <View styleName="horizontal v-start h-start md-gutter">
                <Button
                  mode={'flat'}
                  uppercase={false}
                  dark={true}
                  loading={false}
                  style={styles.loginButtonStyle}
                  onPress={this.shareBtn}>
                  <Title style={styles.btntext}>{'Share'}</Title>
                </Button>
              </View>
            </View>

            <Image
              source={require('../../res/images/share.jpg')}
              styleName="large"
              style={{
                resizeMode: 'contain',
              }}
            />
          </>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  selectCont: {
    borderBottomColor: Pref.RED,
    borderBottomWidth: 1.5,
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
  subtitle: {
    fontSize: 14,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'center',
    fontWeight: '400',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'flex-start',
    fontWeight: '700',
  },
  viewBox: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    width: '100%',
    padding: 10,
    alignItems: 'center',
    height: 150,
  },
  boxstyle: {
    flexDirection: 'row',
    height: 48,
    paddingStart: 10,
    paddingEnd: 10,
    justifyContent: 'space-between',
    marginStart: -10,
    marginEnd: -10
  },
  dotContainer: {
    backgroundColor: 'transparent',
  },
  title1: {
    fontSize: 16,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'flex-start',
    fontWeight: '700',
    marginHorizontal: sizeWidth(3),
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
  btntext: {
    color: 'white',
    fontSize: 16,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
});
