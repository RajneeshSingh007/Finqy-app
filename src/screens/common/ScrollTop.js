
import { View } from '@shoutem/ui';
import React from 'react';
import {
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import * as Pref from '../../util/Pref';
import IconChooser from '../common/IconChooser';


const ScrollTop = props => {
    const { onPress = () => { } } = props;
    return <View styleName="v-start h-start" style={styles.topcon}>
        <TouchableWithoutFeedback onPress={onPress}>

            <View style={{
                flex: 0.1
            }}>
                <IconChooser
                    name={'arrow-up'}
                    size={28}
                    color={Pref.RED}
                    style={styles.icon}
                />
            </View>
        </TouchableWithoutFeedback>
        <View style={{
            flex: 0.9,
            //backgroundColor: 'red',
        }}>

        </View>
    </View>
}

export default ScrollTop;


const styles = StyleSheet.create({
    topcon: {
        margin: 16,
        //position: 'absolute',
        //right: 0,
        //bottom: 0,
        flexDirection: 'row-reverse',
        flexWrap: 'wrap'
    },
    icon: {
        alignItems: 'center'
    }
});
