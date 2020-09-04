import React from 'react';
import {
  StatusBar,
  StyleSheet,
  ScrollView,
  BackHandler,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Image,
  Screen,
  Subtitle,
  Title,
  Text,
  Caption,
  View,
  Heading,
  TouchableOpacity,
  DropDownMenu,
  DropDownModal,
} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {
  Button,
  Card,
  Colors,
  Snackbar,
  TextInput,
  DefaultTheme,
  RadioButton,
  FAB,
} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import {SafeAreaView} from 'react-navigation';
import {sizeFont, sizeHeight, sizeWidth} from '../../util/Size';
import Icon from 'react-native-vector-icons/Feather';
import Icons from 'react-native-vector-icons/FontAwesome5';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import DropDown from '../common/CommonDropDown';
import Lodash from 'lodash';
import CommonFileUpload from '../common/CommonFileUpload';
import AnimatedInputBox from '../component/AnimatedInputBox';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'transparent',
    accent: 'transparent',
    backgroundColor: Colors.white,
    surface: Colors.white,
  },
};

export default class BankForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      bank: '',
      bank_ifsc: '',
      account_no: '',
      bank_account_name: '',
      account_branch: '',
      account_type: '',
    };
  }

  saveData = (
    bank,
    bank_ifsc,
    account_no,
    bank_account_name,
    account_branch,
    account_type,
  ) => {
    this.setState({
      bank: bank,
      bank_ifsc: bank_ifsc,
      account_no: account_no,
      bank_account_name: bank_account_name,
      account_branch: account_branch,
      account_type: account_type,
    });
  };

  render() {
    return (
      <View>
        {/* <View
          style={{
            marginTop: sizeHeight(2),
            marginBottom: sizeHeight(1),
          }}
          styleName="horizontal">
          <View styleName="vertical" style={{marginStart: sizeWidth(2)}}>
            <Title style={styles.title}> {`Bank Information`}</Title>
          </View>
        </View>
        <View style={styles.line} /> */}

        {/* <AnimatedInputBox
                    mode="flat"
                    underlineColor="transparent"
                    underlineColorAndroid="transparent"
                    style={[
                        styles.inputStyle,
                        
                    ]}
                    label={"Bank Name"}
                    placeholder={"Enter bank name"}
                    placeholderTextColor={"#DEDEDE"}
                    onChangeText={(value) =>
                        this.setState({ bank: value })
                    }
                    value={this.state.bank}
                    theme={theme}
                    returnKeyType={"next"}
                /> */}

        <AnimatedInputBox
          changecolor
          containerstyle={styles.animatedInputCont}
          placeholder={'Account Holder Name'}
          onChangeText={(value) => this.setState({bank_account_name: value})}
          value={this.state.bank_account_name}
          returnKeyType={'next'}
        />

        <AnimatedInputBox
          changecolor
          containerstyle={styles.animatedInputCont}
          placeholder={'Account Number'}
          onChangeText={(value) => {
            if (String(value).match(/^[0-9]*$/g) !== null) {
              this.setState({account_no: value});
            }
          }}
          keyboardType={'number-pad'}
          value={this.state.account_no}
          returnKeyType={'next'}
        />

        <AnimatedInputBox
          changecolor
          containerstyle={styles.animatedInputCont}
          placeholder={'Branch Name'}
          onChangeText={(value) => this.setState({account_branch: value})}
          value={this.state.account_branch}
          returnKeyType={'next'}
        />

        <AnimatedInputBox
          changecolor
          containerstyle={styles.animatedInputCont}
          placeholder={'IFSC code'}
          onChangeText={(value) => this.setState({bank_ifsc: value})}
          value={this.state.bank_ifsc}
          returnKeyType={'next'}
        />

        <View style={styles.radiocont}>
          <Title style={styles.boxsubtitle}>{`Type of Account`}</Title>

          <RadioButton.Group
            onValueChange={(value) => this.setState({account_type: value})}
            value={this.state.account_type}>
            <View styleName="horizontal" style={{marginBottom: 8}}>
              <View
                styleName="horizontal"
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                }}>
                <RadioButton value="Saving" style={{alignSelf: 'center'}} />
                <Title
                  styleName="v-center h-center"
                  style={styles.textopen}>{`Saving Account`}</Title>
              </View>
              <View
                styleName="horizontal"
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                }}>
                <RadioButton value="Current" style={{alignSelf: 'center'}} />
                <Title
                  styleName="v-center h-center"
                  style={styles.textopen}>{`Current Account`}</Title>
              </View>
            </View>
          </RadioButton.Group>
        </View>

        {/* <View
                    style={{
                        paddingVertical: sizeHeight(1),
                        marginHorizontal: sizeWidth(3),
                    }}
                >
                    <TouchableWithoutFeedback
                        onPress={() => this.setState({
                            showaccountType: !this.state.showaccountType
                        })}
                    >
                        <View
                            style={styles.dropdownbox}
                        >
                            <Title
                                style={styles.boxsubtitle}
                            >

                                {this.state.account_type === ""
                                    ? `Select Account Type`
                                    : this.state.account_type}
                            </Title>
                            <Icon
                                name={"chevron-down"}
                                size={24}
                                color={"#292929"}
                                style={styles.downIcon}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                    {this.state.showaccountType ? <DropDown itemCallback={value => this.setState({ showaccountType: false, account_type: value })} list={this.state.accountTypeList} /> : null}

                </View>
 */}
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
    borderBottomColor: '#f2f1e6',
    alignContent: 'center',
  },
  animatedInputCont: {
    marginStart: 10,
    marginEnd: 10,
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
  line: {
    backgroundColor: Pref.RED,
    height: 1.2,
    marginHorizontal: sizeWidth(3),
    marginTop: 4,
    marginBottom: 4,
  },
  line1: {
    backgroundColor: '#dedede',
    height: 1.2,
    marginHorizontal: sizeWidth(3),
    marginTop: 4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
  },
  title1: {
    fontSize: 16,
    fontFamily: 'Rubik',
    fontFamily: '400',
    letterSpacing: 1,
    color: '#242424',
    alignSelf: 'flex-start',
  },
  inputStyle: {
    height: sizeHeight(8),
    backgroundColor: 'white',
    color: '#292929',
    borderBottomColor: Colors.grey300,
    fontFamily: 'Rubik',
    fontSize: 16,
    borderBottomWidth: 0.6,
    fontWeight: '400',
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
  },
  dropdownbox: {
    flexDirection: 'row',
    height: 48,
    borderBottomColor: Colors.grey300,
    borderRadius: 2,
    borderBottomWidth: 0.6,
    marginVertical: sizeHeight(1),
    justifyContent: 'space-between',
  },
  boxsubtitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6d6a57',
    lineHeight: 20,
    marginStart: 4,
    letterSpacing: 0.5,
  },
  downIcon: {
    padding: 4,
    alignSelf: 'center',
    marginHorizontal: 1,
  },
});
