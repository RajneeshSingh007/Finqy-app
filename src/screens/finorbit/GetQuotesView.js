import React from 'react';
import {
    StatusBar,
    StyleSheet,
    Linking
} from 'react-native';
import {
    View,
    Title
} from '@shoutem/ui';
import * as Pref from '../../util/Pref';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import LeftHeaders from '../common/CommonLeftHeader';
import Pdf from 'react-native-pdf';
import CScreen from '../component/CScreen';
import Download from '../component/Download';
import Share from "react-native-share";
import * as Helper from '../../util/Helper';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import NavigationActions from '../../util/NavigationActions';
import { Button, Paragraph, Dialog, Portal, RadioButton } from 'react-native-paper';

export default class GetQuotesView extends React.PureComponent {
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
            referCode: '',
            companyList: [],
            showDialog: false,
            company: ''
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        const url = navigation.getParam('url', null);
        const companyList = navigation.getParam('company', []);
        console.log('companyList', companyList);
        Pref.getVal(Pref.userData, data => {
            //console.log('data', data)
            this.setState({ companyList: companyList });
            this.fetchData(url, data);
        })

    }

    fetchData = (url, data) => {
        const { refercode } = data;
        this.setState({
            pdfurl: url,
            loading: false,
            modalvis: true,
            remoteFileUrl: url,
            referCode: refercode
        });

    };

    componentWillUnMount() {
        if (this.focusListener !== undefined) this.focusListener.remove();
    }

    shareFile = () => {
        const { pdfurl } = this.state;
        if (pdfurl === "") {
            this.setState({ modalvis: false });
            Helper.showToastMessage("Failed to find quote", 0);
            return false;
        }
        const url = `${this.state.pdfurl}`;
        const title = "";
        const message = ``;
        const options = Platform.select({
            ios: {
                activityItemSources: [
                    {
                        placeholderItem: { type: "url", content: url },
                        item: {
                            default: { type: "url", content: url },
                        },
                        subject: {
                            default: title,
                        },
                        linkMetadata: { originalUrl: url, url, title },
                    },
                    {
                        placeholderItem: { type: "text", content: message },
                        item: {
                            default: { type: "text", content: message },
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

    buyNow = () => {
        const { companyList } = this.state;
        if (companyList.length === 0) {
            Linking.openURL(Pref.BuyInsurance)
            //NavigationActions.navigate('WebComp', { url: `${Pref.BuyInsurance}` })
        } else {
            this.setState({ showDialog: true });
        }
    }

    hideDialog = () => this.setState({ showDialog: false });

    selectedCompany = (value) => {
        this.setState({ company: value, })
        if (value === 'Religare') {
            const item = {
                name: 'Vector Plus',
                url: '',
            };
            NavigationActions.navigate('FinorbitForm', item)
        } else {
            Linking.openURL(Pref.BuyInsurance)
            //NavigationActions.navigate('WebComp', { url: `${Pref.BuyInsurance}` })
        }
    }

    render() {
        const { companyList } = this.state;
        return (
            <CScreen
                absolute={
                    companyList.length > 0 ?
                        <Portal>
                            <Dialog visible={this.state.showDialog} onDismiss={this.hideDialog}>
                                <Dialog.Title>{`Select Company`}</Dialog.Title>
                                <Dialog.Content>
                                    <RadioButton.Group
                                        onValueChange={(value) => this.selectedCompany(value)}
                                        value={this.state.company}>
                                        <View styleName="vertical" style={{ marginBottom: 8 }}>
                                            {companyList.map(item => {
                                                return <View
                                                    styleName="horizontal"
                                                    style={{ marginVertical: 4 }}>
                                                    <RadioButton
                                                        value={item.name}
                                                        style={{ alignSelf: 'center' }}
                                                    />
                                                    <Title
                                                        styleName="v-center h-center"
                                                        style={styles.textopen}>{item.name}</Title>
                                                </View>
                                            })}
                                        </View>
                                    </RadioButton.Group>

                                </Dialog.Content>
                            </Dialog>
                        </Portal> : null
                }
                scrollEnable={false}
                body={
                    <View style={{ flex: 1 }}>
                        <LeftHeaders title={`Your Quote`} showBack />
                        <View style={{ flex: 0.02 }}></View>
                        <Pdf
                            source={{
                                uri: this.state.pdfurl,
                                cache: true,
                            }}
                            style={{
                                flex: 0.85,
                                backgroundColor: '#f9f8f1',
                            }}
                                          fitWidth
              fitPolicy={0}
              enablePaging
              scale={1}

                        />

                        <TouchableWithoutFeedback onPress={this.buyNow}>
                            <View style={{
                                backgroundColor: '#f9f8f1',
                            }}>
                                <Title style={styles.belowtext}>
                                    {`Buy Now`}
                                </Title>
                            </View>
                        </TouchableWithoutFeedback>

                        <Download
                            rightIconClick={() => {
                                Helper.downloadFileWithFileName(`${this.state.remoteFileUrl}.pdf`, `Quotes_${this.state.referCode}`, `Quotes_${this.state.referCode}.pdf`, 'application/pdf');
                            }}
                            style={{ flex: 0.09 }}
                            showLeft
                            leftIconClick={this.shareFile}
                        />
                    </View>
                }
            />
        );
    }
}

const styles = StyleSheet.create({
    belowtext: {
        fontSize: 16,
        letterSpacing: 0.5,
        color: '#0270e3',
        fontWeight: '700',
        lineHeight: 36,
        alignSelf: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        paddingVertical: 8,
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
})