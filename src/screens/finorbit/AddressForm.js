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
  FAB,
  HelperText,
  RadioButton,
  Checkbox,
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

let layheight = 56;

export default class AddressForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.fetchcitystate = this.fetchcitystate.bind(this);
    this.state = {
      addressLine1Lang1p: '',
      addressLine2Lang1p: '',
      pinCodep: '',
      cityCdp: '',
      stateCdp: '',
      ref: '',
      addressLine1Lang1c: '',
      addressLine2Lang1c: '',
      pinCodec: '',
      cityCdc: '',
      stateCdc: '',
      currentAddChecked: false,
    };
  }

  fetchcitystate = (value) => {
    if (value !== '' && value.length === 6) {
      this.setState({pinCodep: value});
      const url = `${Pref.FindCityState}?pincode=${value}`;
      //console.log(`url`, url);
      Helper.getNetworkHelper(
        url,
        Pref.methodGet,
        (result) => {
          //console.log(`result`, result);
          if (result === 'no data found') {
            this.setState({
              cityCdp: '',
              stateCdp: '',
              pinCodep: '',
            });
          } else {
            const sp = result.split('@');
            const state = String(sp[0]).trim();
            const city = String(sp[1]).trim();
            this.setState({stateCdp: state, cityCdp: city});
          }
        },
        (error) => {
          //console.log(`error`, error);
        },
      );
    } else {
      this.setState({cityCdp: '', stateCdp: '', pinCodep: value});
    }
  };

  fetchcityCurrentstate = (value) => {
    if (value !== '' && value.length === 6) {
      this.setState({pinCodec: value});
      const url = `${Pref.FindCityState}?pincode=${value}`;
      //console.log(`url`, url);
      Helper.getNetworkHelper(
        url,
        Pref.methodGet,
        (result) => {
          //console.log(`result`, result);
          if (result === 'no data found') {
            this.setState({
              cityCdc: '',
              stateCdc: '',
              pinCodec: '',
            });
          } else {
            const sp = result.split('@');
            const state = String(sp[0]).trim();
            const city = String(sp[1]).trim();
            this.setState({cityCdc: state, stateCdc: city});
          }
        },
        (error) => {
          //console.log(`error`, error);
        },
      );
    } else {
      this.setState({cityCdc: '', stateCdc: '', pinCodec: value});
    }
  };

  render() {
    const {
      showemploy,
      title,
      editable = true,
      disabled = false,
      heading = `Personal Details`,
    } = this.props;
    const ispolicy = title && title === 'Vector Plus' ? true : false;
    return (
      <View>
        <View
          style={{
            marginTop: sizeHeight(2),
            marginBottom: sizeHeight(1),
          }}
          styleName="horizontal">
          {/* <Icons name={'npm'} size={24} style={{ color: '#e21226', padding: 4, alignSelf: 'center', marginStart: sizeWidth(1) }} /> */}
          <View styleName="vertical" style={{marginStart: sizeWidth(2)}}>
            <Subtitle style={styles.title}> {`Address Information`}</Subtitle>
          </View>
        </View>
        <View style={styles.line} />
        {ispolicy ? (
          <View
            styleName="vertical"
            style={{marginStart: sizeWidth(2), paddingVertical: 10}}>
            <Subtitle
              style={StyleSheet.flatten([styles.title, {fontSize: 15}])}>
              {`Permanent Address`}
            </Subtitle>
          </View>
        ) : null}

        <TextInput
          mode="flat"
          underlineColor="transparent"
          underlineColorAndroid="transparent"
          style={[
            styles.inputStyle,
            // { marginVertical: sizeHeight(1) },
          ]}
          label={'Address Line 1*'}
          placeholder={'Enter address line 1'}
          placeholderTextColor={'#DEDEDE'}
          onChangeText={(value) => this.setState({addressLine1Lang1p: value})}
          value={this.state.addressLine1Lang1p}
          theme={theme}
          returnKeyType={'next'}
        />

        <TextInput
          mode="flat"
          underlineColor="transparent"
          underlineColorAndroid="transparent"
          style={[
            styles.inputStyle,
            // { marginVertical: sizeHeight(1) },
          ]}
          label={'Address Line 2*'}
          placeholder={'Enter address line 2'}
          placeholderTextColor={'#DEDEDE'}
          onChangeText={(value) => this.setState({addressLine2Lang1p: value})}
          value={this.state.addressLine2Lang1p}
          theme={theme}
          returnKeyType={'next'}
        />
        <TextInput
          mode="flat"
          underlineColor="transparent"
          underlineColorAndroid="transparent"
          style={[
            styles.inputStyle,
            // { marginVertical: sizeHeight(1) },
          ]}
          label={`Pincode *`}
          maxLength={6}
          keyboardType={'number-pad'}
          placeholder={'Enter pincode'}
          placeholderTextColor={'#DEDEDE'}
          onChangeText={this.fetchcitystate}
          value={this.state.pinCodep}
          theme={theme}
          returnKeyType={'next'}
        />
        <TextInput
          mode="flat"
          underlineColor="transparent"
          underlineColorAndroid="transparent"
          style={[
            styles.inputStyle,
            // { marginVertical: sizeHeight(1) },
          ]}
          label={`City`}
          placeholder={'Enter pincode'}
          placeholderTextColor={'#DEDEDE'}
          onChangeText={(value) => this.setState({cityCdp: value})}
          value={this.state.cityCdp}
          theme={theme}
          editable={false}
          disabled={true}
          returnKeyType={'next'}
        />
        <TextInput
          mode="flat"
          underlineColor="transparent"
          underlineColorAndroid="transparent"
          style={[
            styles.inputStyle,
            // { marginVertical: sizeHeight(1) },
          ]}
          label={`State`}
          placeholder={'Enter state'}
          placeholderTextColor={'#DEDEDE'}
          onChangeText={(value) => this.setState({stateCdp: value})}
          value={this.state.stateCdp}
          theme={theme}
          returnKeyType={'next'}
          editable={false}
          disabled={true}
        />

        {ispolicy ? (
          <View>
            <View
              styleName="vertical"
              style={{
                marginStart: sizeWidth(2),
                paddingVertical: 10,
                marginVertical: 4,
              }}>
              <View styleName="horizontal" style={{marginBottom: 16}}>
                <Checkbox.Android
                  status={
                    this.state.currentAddChecked ? 'checked' : 'unchecked'
                  }
                  onPress={() => {
                    let {
                      currentAddChecked,
                      addressLine1Lang1p,
                      addressLine2Lang1p,
                      pinCodep,
                      stateCdp,
                      cityCdp,
                      addressLine1Lang1c,
                      addressLine2Lang1c,
                      pinCodec,
                      stateCdc,
                      cityCdc,
                    } = this.state;
                    currentAddChecked = !currentAddChecked;
                    if (currentAddChecked === true) {
                      addressLine1Lang1c = addressLine1Lang1p;
                      addressLine2Lang1c = addressLine2Lang1p;
                      pinCodec = pinCodep;
                      stateCdc = stateCdp;
                      cityCdc = cityCdp;
                    } else {
                      addressLine1Lang1c = '';
                      addressLine2Lang1c = '';
                      pinCodec = '';
                      stateCdc = '';
                      cityCdc = '';
                    }
                    this.setState({
                      currentAddChecked: currentAddChecked,
                      addressLine1Lang1c: addressLine1Lang1c,
                      addressLine2Lang1c: addressLine2Lang1c,
                      pinCodec: pinCodec,
                      stateCdc: stateCdc,
                      cityCdc: cityCdc,
                    });
                  }}
                />
                <Subtitle
                  style={StyleSheet.flatten([
                    styles.title,
                    {
                      fontSize: 15,
                      fontWeight: '400',
                      letterSpacing: 0,
                      alignSelf: 'center',
                    },
                  ])}>
                  {`Permanent address same as current address *`}
                </Subtitle>
              </View>

              <Subtitle
                style={StyleSheet.flatten([styles.title, {fontSize: 15}])}>
                {`Current Address`}
              </Subtitle>
            </View>

            <TextInput
              mode="flat"
              underlineColor="transparent"
              underlineColorAndroid="transparent"
              style={[
                styles.inputStyle,
                // { marginVertical: sizeHeight(1) },
              ]}
              label={'Address Line 1*'}
              placeholder={'Enter address line 1'}
              placeholderTextColor={'#DEDEDE'}
              onChangeText={(value) =>
                this.setState({addressLine1Lang1c: value})
              }
              value={this.state.addressLine1Lang1c}
              theme={theme}
              returnKeyType={'next'}
            />

            <TextInput
              mode="flat"
              underlineColor="transparent"
              underlineColorAndroid="transparent"
              style={[
                styles.inputStyle,
                // { marginVertical: sizeHeight(1) },
              ]}
              label={'Address Line 2*'}
              placeholder={'Enter address line 2'}
              placeholderTextColor={'#DEDEDE'}
              onChangeText={(value) =>
                this.setState({addressLine2Lang1c: value})
              }
              value={this.state.addressLine2Lang1c}
              theme={theme}
              returnKeyType={'next'}
            />
            <TextInput
              mode="flat"
              underlineColor="transparent"
              underlineColorAndroid="transparent"
              style={[
                styles.inputStyle,
                // { marginVertical: sizeHeight(1) },
              ]}
              label={`Pincode *`}
              maxLength={6}
              keyboardType={'number-pad'}
              placeholder={'Enter pincode'}
              placeholderTextColor={'#DEDEDE'}
              onChangeText={this.fetchcityCurrentstate}
              value={this.state.pinCodec}
              theme={theme}
              returnKeyType={'next'}
            />
            <TextInput
              mode="flat"
              underlineColor="transparent"
              underlineColorAndroid="transparent"
              style={[
                styles.inputStyle,
                // { marginVertical: sizeHeight(1) },
              ]}
              label={`City`}
              placeholder={'Enter pincode'}
              placeholderTextColor={'#DEDEDE'}
              onChangeText={(value) => this.setState({cityCdc: value})}
              value={this.state.cityCdc}
              theme={theme}
              editable={false}
              disabled={true}
              returnKeyType={'next'}
            />
            <TextInput
              mode="flat"
              underlineColor="transparent"
              underlineColorAndroid="transparent"
              style={[
                styles.inputStyle,
                // { marginVertical: sizeHeight(1) },
              ]}
              label={`State`}
              placeholder={'Enter state'}
              placeholderTextColor={'#DEDEDE'}
              onChangeText={(value) => this.setState({stateCdc: value})}
              value={this.state.stateCdc}
              theme={theme}
              returnKeyType={'next'}
              editable={false}
              disabled={true}
            />

            <TextInput
              mode="flat"
              underlineColor="transparent"
              underlineColorAndroid="transparent"
              style={[
                styles.inputStyle,
                // { marginVertical: sizeHeight(1) },
              ]}
              label={'Referral Code'}
              placeholder={'Enter referral code'}
              placeholderTextColor={'#DEDEDE'}
              onChangeText={(value) => this.setState({ref: value})}
              value={this.state.ref}
              theme={theme}
              returnKeyType={'next'}
            />
          </View>
        ) : null}
      </View>
    );
  }
}

/**
 * styles
 */
const styles = StyleSheet.create({
  line: {
    backgroundColor: Pref.RED,
    height: 1.2,
    marginHorizontal: sizeWidth(3),
    marginTop: 4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Rubik',
    fontFamily: 'bold',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Rubik',
    fontFamily: 'bold',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
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
    borderBottomColor: Colors.grey300,
    fontFamily: 'Rubik',
    fontSize: 16,
    borderBottomWidth: 0.6,
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
    paddingVertical: sizeHeight(0.5),
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
    height: 48,
    borderBottomColor: Colors.grey300,
    borderRadius: 2,
    borderBottomWidth: 0.6,
    marginVertical: sizeHeight(1),
    justifyContent: 'space-between',
  },
  boxsubtitle: {
    fontSize: 16,
    fontFamily: 'Rubik',
    fontWeight: '400',
    color: '#767676',
    lineHeight: 25,
    alignSelf: 'center',
    padding: 4,
    alignSelf: 'center',
    marginHorizontal: 8,
  },
  downIcon: {
    padding: 4,
    alignSelf: 'center',
    marginHorizontal: 1,
  },
  bbstyle: {
    fontSize: 16,
    fontFamily: 'Rubik',
    fontWeight: '400',
    color: '#767676',
    lineHeight: 25,
    padding: 4,
    marginHorizontal: 8,
  },
});
