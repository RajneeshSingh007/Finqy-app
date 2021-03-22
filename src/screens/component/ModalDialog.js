import { Title, View } from '@shoutem/ui';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Colors, Modal, Portal } from 'react-native-paper';
import * as Pref from '../../util/Pref';
import { sizeHeight, sizeWidth } from '../../util/Size';
import IconChooser from '../common/IconChooser';

const ModalDialog = (props) => {
  const {
    content = '',
    iconName = 'info',
    cancelClicked = () => {},
    okClicked = () => {},
    leftbtnText = 'Cancel',
    rightBtnText = 'Ok',
    visiblity = false,
    dismissable = false
  } = props;
  

  const [modalVis, setModalVis] = useState(visiblity);

  useEffect(() => {
      setModalVis(visiblity);
      return () => {};
  }, [visiblity]);

  const leftBtn = () =>{
    setModalVis(false);
    cancelClicked();
  }

  const rightBtn = () =>{
    setModalVis(false);
    okClicked();
  }


  return (
    <Portal>
      <Modal
        visible={modalVis}
        dismissable={dismissable}
        onDismiss={() => setModalVis(false)}
        contentContainerStyle={{
          flex: 1,
        }}>
        <View style={{flex: 1}}>
          <View style={{flex: 0.7}}></View>
          <View
            style={{
              flex: 0.3,
              backgroundColor: 'white',
              flexDirection: 'column',
            }}>
            <IconChooser
              name={iconName}
              color={'#b8b28f'}
              size={40}
              style={{alignSelf: 'center', marginVertical: 12}}
            />
            <Title style={styles.title}>{content}</Title>

            <View styleName="horizontal space-between md-gutter">
              <Button
                mode={'flat'}
                uppercase={false}
                dark={true}
                loading={false}
                style={[
                  styles.loginButtonStyle,
                  {
                    backgroundColor: 'transparent',
                    borderColor: '#d5d3c1',
                    borderWidth: 1.3,
                    marginTop: 8,
                    paddingVertical: 0,
                  },
                ]}
                onPress={() => leftBtn()}>
                <Title
                  style={StyleSheet.flatten([
                    styles.btntext,
                    {
                      color: '#b8b28f',
                    },
                  ])}>
                  {leftbtnText}
                </Title>
              </Button>
              <Button
                mode={'flat'}
                uppercase={false}
                dark={true}
                loading={false}
                style={[
                  styles.loginButtonStyle,
                  {
                    marginTop: 8,
                    paddingVertical: 0,
                  },
                ]}
                onPress={() => rightBtn()}>
                <Title style={styles.btntext}>{rightBtnText}</Title>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default ModalDialog;

/**
 * styles
 */
const styles = StyleSheet.create({
  dropdowntextstyle: {
    color: '#6d6a57',
    fontSize: 14,
    fontFamily: Pref.getFontName(4),
  },
  dropdowncontainers: {
    borderRadius: 0,
    borderBottomColor: '#f2f1e6',
    borderBottomWidth: 1.3,
    borderWidth: 0,
    marginStart: 10,
    marginEnd: 10,
    paddingVertical: 10,
  },
  radiocont: {
    marginStart: 10,
    marginEnd: 10,
    borderBottomWidth: 1.3,
    borderBottomColor: '#f2f1e6',
    alignContent: 'center',
  },
  animatedInputCont: {
    marginStart: 8,
    marginEnd: 8,
    paddingVertical: 10,
  },
  line: {
    backgroundColor: Pref.RED,
    height: 1.2,
    marginHorizontal: sizeWidth(3),
    marginTop: 4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Rubik',
    fontFamily: 'bold',
    letterSpacing: 1,
    color: '#555555',
    alignSelf: 'center',
  },
  title: {
    fontSize: 17,
    fontFamily: Pref.getFontName(4),
    color: '#292929',
    alignSelf: 'center',
    marginVertical: 8,
  },
  inputStyle: {
    height: sizeHeight(8),
    backgroundColor: 'white',
    color: '#555555',
    borderBottomColor: '#dedede',
    fontFamily: 'Rubik',
    fontSize: 16,
    borderBottomWidth: 1,
    fontWeight: '400',
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
  },
  inputPassStyle: {
    height: sizeHeight(8),
    backgroundColor: 'white',
    color: '#555555',
    borderBottomColor: Colors.grey300,
    fontFamily: 'Rubik',
    fontSize: 16,
    borderBottomWidth: 0.6,
    fontWeight: '400',
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
    marginVertical: sizeHeight(1),
  },
  inputPass1Style: {
    height: sizeHeight(8),
    backgroundColor: 'white',
    color: '#555555',
    fontFamily: 'Rubik',
    fontSize: 16,
    fontWeight: '400',
    marginHorizontal: sizeWidth(3),
    letterSpacing: 1,
    marginTop: -7,
  },
  loginButtonStyle: {
    color: 'white',
    backgroundColor: Pref.RED,
    textAlign: 'center',
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 0.5,
    borderRadius: 48,
    width: '40%',
    paddingVertical: 4,
    fontWeight: '700',
    marginTop: 24,
  },
  dropdownbox: {
    flexDirection: 'row',
    height: 56,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  radiodownbox: {
    flexDirection: 'column',
    height: 56,
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 16,
  },
  boxsubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6d6a57',
    lineHeight: 20,
    alignSelf: 'center',
    marginStart: 4,
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
  downIcon: {
    alignSelf: 'center',
  },
  bbstyle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6d6a57',
    lineHeight: 20,
    marginStart: 4,
  },
  btntext: {
    color: 'white',
    fontSize: 16,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
});
