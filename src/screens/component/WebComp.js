import React from 'react';
import {
    StyleSheet,
    BackHandler
} from 'react-native';
import {
    View,
} from '@shoutem/ui';
import * as Pref from '../../util/Pref';
import CScreen from '../component/CScreen';
import WebView from 'react-native-webview';
import NavigationActions from '../../util/NavigationActions';

export default class WebComp extends React.PureComponent {
    constructor(props) {
        super(props);
        this.backClick = this.backClick.bind(this);
        this.state = {
            url: null,
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backClick);
        const { navigation } = this.props;
        const url = navigation.getParam('url', null);
        if (url !== null) {
            this.setState({ url: url });
        }
    }

    backClick = () =>{
        NavigationActions.goBack();
        return true;  
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    }

    render() {
        return (
            <CScreen
                scrollEnable={false}
                body={
                    <>
                        <View style={{ backgroundColor: 'white', flex: 1 }}>
                            {this.state.url !== null ? <WebView
                                source={{ uri: this.state.url }}
                                javaScriptEnabled
                                allowsBackForwardNavigationGestures
                            /> : null}
                        </View>
                    </>
                }
            />
        );
    }
}


