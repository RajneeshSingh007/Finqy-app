import * as React from "react";
import { StatusBar, View, BackHandler } from 'react-native';
import { AppContainer } from './src/util/AppRouter';
import NavigationActions from './src/util/NavigationActions';
import { inject, observer } from "mobx-react";
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import FlashMessage from "react-native-flash-message";
import CodePush from "react-native-code-push";
import Loader from './src/util/Loader';
import Crashes from 'appcenter-crashes';
import analytics  from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

let currentScreenx = ''

class App extends React.PureComponent {
    constructor(props) {
        super(props);
        this.backClick = this.backClick.bind(this);
        changeNavigationBarColor('white', true);
        StatusBar.setBackgroundColor('white', false);
        StatusBar.setBarStyle('dark-content');
        this.state = { restartAllowed: true, downloading: -1 };
    }

    componentDidMount() {
        //this.syncImmediate();
        Crashes.setEnabled(true)
        .then(res => {
            console.log('res', res)
        }).catch(e => console.log(e))
        analytics().setAnalyticsCollectionEnabled(true);
        crashlytics().setCrashlyticsCollectionEnabled(true);
        //BackHandler.addEventListener('hardwareBackPress', this.backClick);
    }

    backClick = () => {
        if (currentScreenx !== '' && currentScreenx === 'Login') {
            BackHandler.exitApp();
            return false;
        }
        else if (currentScreenx !== '' && (currentScreenx === 'LeadList' || currentScreenx === 'ProfScreen' || currentScreenx === 'FinorbitScreen')) {
            NavigationActions.navigate('HomeScreen')
            return true;
        } else if (currentScreenx !== '' && currentScreenx === 'HomeScreen') {
            return false;
        } else if (currentScreenx !== '' && currentScreenx === 'HomeScreen') {
            return false;
        } else {
            NavigationActions.goBack();
            return true;
        }
        return false;
    }

    componentWillUnmount() {
        //BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    }

    codePushStatusDidChange(syncStatus) {
        console.log('syncStatus', syncStatus)
        switch (syncStatus) {
            case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                this.setState({ downloading: -1 });
                break;
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                this.setState({ downloading: 1 });
                break;
            case CodePush.SyncStatus.AWAITING_USER_ACTION:
                this.setState({ downloading: 1 });
                break;
            case CodePush.SyncStatus.INSTALLING_UPDATE:
                this.setState({ downloading: 1 });
                break;
            case CodePush.SyncStatus.UP_TO_DATE:
                this.setState({ downloading: -1 });
                break;
            case CodePush.SyncStatus.UPDATE_IGNORED:
                this.setState({ downloading: -1 });
                break;
            case CodePush.SyncStatus.UPDATE_INSTALLED:
                this.setState({ downloading: 2 });
                break;
        }
    }

    codePushDownloadDidProgress() {
    }

    syncImmediate() {
        CodePush.sync(
            { installMode: CodePush.InstallMode.IMMEDIATE, updateDialog: true },
            this.codePushStatusDidChange.bind(this),
            this.codePushDownloadDidProgress.bind(this)
        );
    }

    codepushDialog = () => {
        const { downloading } = this.state;
        return <Loader isShow={downloading === 1 ? true : false} />
    }


    render() {
        return (
            <View style={{
                flex: 1
            }}>
                <AppContainer
                    ref={ref => NavigationActions.setTopLevelNavigator(ref)}
                    onNavigationStateChange={this.handleNavigationChange} />

                <FlashMessage position='bottom' />
                {this.codepushDialog()}
            </View>
        );
    }

    handleNavigationChange = (prevState, newState) => {
        const currentScreen = getActiveRouteName(newState)
        const prevScreen = getActiveRouteName(prevState)
        currentScreenx = currentScreen;
        if (prevScreen !== currentScreen) {
            this
                .props
                .navigationStore
                .onChangeNavigation(prevScreen, currentScreen)
        }
    }
}

const getActiveRouteName = (navigationState) => {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
        return getActiveRouteName(route);
    }
    return route.routeName;
}

export default inject("navigationStore")(observer(App));
