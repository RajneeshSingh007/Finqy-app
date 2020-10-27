import React from 'react';
import {
    StyleSheet,
} from 'react-native';
import {
    View,
} from '@shoutem/ui';
import * as Pref from '../../util/Pref';
import CScreen from '../component/CScreen';
import WebView from 'react-native-webview';

export default class WebComp extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            url: null,
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        const url = navigation.getParam('url', null);
        if (url !== null) {
            this.setState({ url: url });
        }
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


