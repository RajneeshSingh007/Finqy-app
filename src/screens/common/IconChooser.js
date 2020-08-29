import React from "react";
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const IconChooser = props => {
    const {name, style, iconType = 1 ,size = 24,color = '#292929'} = props;
    if (iconType === 2) {
        return (
            <FontAwesome5 name={name} size={size} color={color} style={style} />
        )
    }else if (iconType === 3) {
        return (
            <FontAwesome name={name} size={size} color={color} style={style} />
        )
    } else if (iconType === 4) {
        return (
            <Ionicons name={name} size={size} color={color} style={style} />
        )
    } else if (iconType === 5) {
        return (
            <Octicons name={name} size={size} color={color} style={style} />
        )
    } else if (iconType === 6) {
        return (
            <MaterialIcons name={name} size={size} color={color} style={style} />
        )
    } else if (iconType === 7) {
        return (
            <MaterialCommunityIcons name={name} size={size} color={color} style={style} />
        )
    } else {
        return (
            <Feather name={name} size={size} color={color} style={style} />
        )
    }
}

export default IconChooser;