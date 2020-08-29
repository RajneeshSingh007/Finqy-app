import * as React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { Button, Paragraph, Menu, Divider, Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import * as Pref from './Pref';
import NavigationActions from './NavigationActions';
import { sizeHeight, sizeWidth, } from './Size';

export default class MenuProvider extends React.PureComponent {
  state = {
    visible: false,
  };

  _openMenu = () => this.setState({ visible: true });

  _closeMenu = () => this.setState({ visible: false });

  _logout = () => {
    Pref.setVal(Pref.loggedStatus, false);
    NavigationActions.navigate('Login');
    this.setState({ visible: false });
  }


  render() {
    return (
      <Menu
        visible={this.state.visible}
        onDismiss={this._closeMenu}
        anchor={
          <TouchableWithoutFeedback onPress={this._openMenu}>
            <Icon
              name={'align-left'}
              size={24}
              color={'#292929'}
            />
          </TouchableWithoutFeedback>
        }
      >
        {/* <Menu.Item onPress={() => {
          NavigationActions.navigate('ProfileScreen');
          this.setState({ visible: false });
        }} style={{ height: sizeHeight(4), marginBottom: 8 }} title="Profile" /> */}
        <Menu.Item onPress={this._logout} title="Logout" style={{ height: sizeHeight(4), marginBottom: 8 }} />
      </Menu>
    );
  }
}
