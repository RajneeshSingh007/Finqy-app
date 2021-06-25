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
      productList: Helper.productShareList(),
      productName: '',
    };
  }

  componentDidMount() {
    Pref.getVal(Pref.userData, (parse) => {
      this.setState({ userData: parse });
    });
  }

  shareApp = (value, productName) => {
    const userData = this.state.userData;
    const { refercode,id } = userData;
    const url = ``;
    const title = 'ERB Referral';
    const finalUrl = `${value}?ref=${refercode}&id=${id}`
    const username =
    Helper.nullCheck(userData.rname) === false
      ? userData.rname
      : userData.username;
  const mobile =
    Helper.nullCheck(userData.rcontact) === false
      ? userData.rcontact
      : userData.mobile;
    const message = `Greetings!!\n\nPlease find the link below for your ${productName} requirement\n\nLink – ${finalUrl}\n\nIn case of any query please feel free to call us at ${mobile}.\n\nYours Sincerely\n${username}`
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
    this.shareApp(find.url, productName);
  };

  render() {
    return (
      <CScreen
        body={
          <>
            <LeftHeaders
              showBack
              title={Helper.getScreenName(this.props).replace(/Option/g, '')}
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
