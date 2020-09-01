import * as React from "react";
import {StatusBar, StyleSheet, View,BackHandler} from 'react-native';
import {AppContainer} from './src/util/AppRouter';
import NavigationActions from './src/util/NavigationActions';
import {inject, observer} from "mobx-react";
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import FlashMessage from "react-native-flash-message";

let currentScreenx = ''
class App extends React.PureComponent {
    constructor(props) {
        super(props);
        this.backClick = this.backClick.bind(this);
        changeNavigationBarColor('white', true);
        StatusBar.setBackgroundColor('white', false);
        StatusBar.setBarStyle('dark-content');
    }

    componentDidMount(){
        //BackHandler.addEventListener('hardwareBackPress', this.backClick);
    }

    backClick = () =>{
        if (currentScreenx !== '' && currentScreenx === 'Login') {
            BackHandler.exitApp();
            return false;
        } 
        else if (currentScreenx !== '' && (currentScreenx === 'LeadList' || currentScreenx === 'ProfScreen' || currentScreenx === 'FinorbitScreen')){
            NavigationActions.navigate('HomeScreen')
            return true;
        } else if (currentScreenx !== '' && currentScreenx === 'HomeScreen'){
            return false;
        }else if (currentScreenx !== '' && currentScreenx === 'HomeScreen'){
            return false;
        }else{
            NavigationActions.goBack();
            return true;
        }
        return false;
    }

    componentWillUnmount(){
        //BackHandler.removeEventListener('hardwareBackPress', this.backClick);
    }

    render() {
        return (
            <View style={{
                flex: 1
            }}>
                <AppContainer
                    ref={ref => NavigationActions.setTopLevelNavigator(ref)}
                    onNavigationStateChange={this.handleNavigationChange}/>
                    
                <FlashMessage position='bottom' />
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
