import * as React from "react";
import {View} from 'react-native';
import * as Pref from '../../util/Pref';
import * as Helper from '../../util/Helper';
/**
 * AuthPage
 */
export default class AuthPage extends React.PureComponent {

	/**
	 *
	 */
    componentDidMount() {
        Pref.getVal(Pref.loggedStatus, value => {
            //console.log(`loggedStatus`, value)
            if (Helper.nullCheck(value) == true){
                Helper.itemClick(this.props, "Login");
            }else {
                if (value === true){
                    Helper.itemClick(this.props, "Home");
                } else {
                    Helper.itemClick(this.props, "Login");
                }
            }
        });
    }

    render() {
        return <View></View>;
    }
}
