import React from 'react';
import {
    StatusBar,
} from 'react-native';
import {
    View,
} from '@shoutem/ui';
import * as Pref from '../../util/Pref';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import LeftHeaders from '../common/CommonLeftHeader';
import Pdf from 'react-native-pdf';
import CScreen from '../component/CScreen';

export default class Term extends React.PureComponent {
    constructor(props) {
        super(props);
        changeNavigationBarColor(Pref.WHITE, true, true);
        StatusBar.setBackgroundColor(Pref.WHITE, false);
        StatusBar.setBarStyle('dark-content');
        this.state = {
            loading: false,
            modalvis: true,
            pdfurl: '',
            remoteFileUrl: '',
            referCode: ''
        };
    }

    componentDidMount() {
        //this.focusListener = navigation.addListener('didFocus', () => {
        Pref.getVal(Pref.userData, data => {
            //console.log('data', data)
            Pref.getVal(Pref.USERTYPE, (v) => this.fetchData(data, v));
        })
        //});
    }

    fetchData = (data) => {
        const { refercode } = data;
        const agree = `${Pref.TermOfUse}`;
        this.setState({
            pdfurl: agree,
            loading: false,
            modalvis: true,
            remoteFileUrl: agree,
            referCode: refercode
        });

    };

    componentWillUnMount() {
        if (this.focusListener !== undefined) this.focusListener.remove();
    }


    render() {
        return (
            <CScreen
                scrollEnable={false}
                body={
                    <View style={{ flex: 1 }}>
                        <LeftHeaders title={`Term Of Use`} showBack />
                        <View style={{ flex: 0.02 }}></View>
                        <Pdf
                            source={{
                                uri: this.state.pdfurl,
                                cache: true,
                            }}
                            style={{
                                flex: 1,
                                backgroundColor: '#f9f8f1',
                            }}
                        />
                        {/* <Download
              rightIconClick={() => {
                Helper.downloadFileWithFileName(`${this.state.remoteFileUrl}.pdf`, `Agreement_${this.state.referCode}`, `Agreement_${this.state.referCode}.pdf`, 'application/pdf');
              }}
              style={{ flex: 0.09 }}
            /> */}
                    </View>
                }
            />
        );
    }
}
