import * as React from 'react';
import {View, Title} from '@shoutem/ui';
import {StyleSheet} from 'react-native';
import {
  Button,
  Paragraph,
  Dialog,
  Portal,
  RadioButton,
  Text,
} from 'react-native-paper';
import { TouchableHighlight, TouchableWithoutFeedback } from 'react-native-gesture-handler';

const OptionsDialog = prop => {
  const {visible = false, optionsList, onClicked = (newValue) => {}, title = ''} = prop;

  return visible && optionsList && optionsList.length > 0 ? (
    <Portal>
      <Dialog visible={visible} dismissable={false}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
            {optionsList.map(io => {
              return (
                <TouchableHighlight onPress={() => onClicked(io.value)} underlayColor={'rgba(0,0,0,0.1)'}>
                  <View
                  styleName="horizontal v-center"
                  style={{
                    marginVertical: 10,
                    paddingVertical:4
                  }}>
                  <Title styleName="v-center h-center" style={styles.textopen}>
                    {io.value}
                  </Title>
                </View>
                </TouchableHighlight>
              );
            })}
        </Dialog.Content>
      </Dialog>
    </Portal>
  ) : null;
};

const styles = StyleSheet.create({
  textopen: {
    fontSize: 15,
    fontWeight: '700',
    color: '#555555',
    lineHeight: 20,
    alignSelf: 'center',
    marginStart: 4,
    letterSpacing: 0.5,
  },
});

export default OptionsDialog;
