import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
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
import {sizeWidth} from '../../util/Size';
import Icon from 'react-native-vector-icons/Feather';
import LeftHeaders from '../common/CommonLeftHeader';
import Share from 'react-native-share';
import DropDown from '../common/CommonDropDown';
import CScreen from '../component/CScreen';

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
      showProduct: false,
      productList: [
        {
          value: 'Auto Loan',
        },
        {value: 'Business Loan'},
        {value: 'Credit Card'},
        {value: 'Fixed Deposit'},
        {value: 'Home Loan'},
        {value: 'Health Insurance'},
        {value: 'Motor Insurance'},
        {value: 'Insurance Samadhan'},
        {value: 'Insure Check'},
        {value: 'Loan Against Property'},
        {value: 'Life Cum Investment'},
        {value: 'Mutual Fund'},
        {value: 'Personal Loan'},
        {value: 'Term Insurance'},
        {value: 'Hello Doctor Policy'},
        {value: 'Asaan Health Policy'},
        {value: 'Sabse Asaan Health Plan'},
      ],
      productName: '',
    };
  }

  componentDidMount() {
    Pref.getVal(Pref.userData, (parse) => {
      this.setState({userData: parse});
    });
  }

  shareApp = (value) => {
    const {refercode} = this.state.userData;
    //https://play.google.com/store/apps/details?id=com.erb
    let fix = '';
    if (value.includes(' ')) {
      const sp = value.toString().split(` `);
      fix = sp[0];
    } else {
      fix = value;
    }
    const url = ``;
    const title = 'ERB';
    let message = `http://erb.ai/erbfinorbit/index.php?type=${fix}&ref=${refercode}`;
    if (fix === 'Hello') {
      message = `https://www.erb.ai/erbfinorbit/hd.php`;
    } else if (fix === 'Asaan') {
      message = `https://www.erb.ai/erbfinorbit/ahp.php`;
    } else if (fix === 'Sabse') {
      message = `https://www.erb.ai/erbfinorbit/sahp.php`;
    }
    const options = Platform.select({
      ios: {
        activityItemSources: [
          {
            placeholderItem: {type: 'url', content: url},
            item: {
              default: {type: 'url', content: url},
            },
            subject: {
              default: title,
            },
            linkMetadata: {originalUrl: url, url, title},
          },
          {
            placeholderItem: {type: 'text', content: message},
            item: {
              default: {type: 'text', content: message},
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
    this.setState({showProduct: false});
  };

  shareBtn = () => {
    const {productName} = this.state;
    if (productName === '') {
      Helper.showToastMessage('Please, Select product', 2);
      return false;
    }
    this.shareApp(productName);
  };

  render() {
    const {productName} = this.state;
    return (
      <CScreen
        body={
          <>
            <LeftHeaders
              showBack
              title={'Link Sharing'}
              bottomtext={
                <>
                  {`Link `}
                  <Title style={styles.passText}>{`Sharing`}</Title>
                </>
              }
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
                <View style={styles.selectCont}>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      this.setState({
                        showProduct: !this.state.showProduct,
                      })
                    }>
                    <View style={styles.boxstyle}>
                      <Title
                        style={StyleSheet.flatten([
                          styles.passText,
                          {
                            fontSize: 16,
                            color: '#555555',
                          },
                        ])}>
                        {productName}
                      </Title>
                      <Icon
                        name={'chevron-down'}
                        size={24}
                        color={'#292929'}
                        style={{
                          padding: 4,
                          alignSelf: 'center',
                        }}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                  {this.state.showProduct ? (
                    <DropDown
                      itemCallback={(value) =>
                        this.setState({productName: value, showProduct: false})
                      }
                      list={this.state.productList}
                      isCityList={false}
                      enableSearch={false}
                      autoFocus={false}
                    />
                  ) : null}
                </View>
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
    paddingEnd:10,
    justifyContent: 'space-between',
    marginStart:-10,
    marginEnd:-10
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
