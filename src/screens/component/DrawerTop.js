import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import * as Pref from '../../util/Pref';
import NavigationActions from '../../util/NavigationActions';
import {sizeHeight, sizeWidth} from '../../util/Size';
import {View} from '@shoutem/ui';
import IconChooser from '../common/IconChooser';

const DrawerTop = (props) => {
  const {
    backClicked = () => {
      NavigationActions.goBack();
    },
  } = props;

  return (
    <View
      style={{
        flex: 0.13,
      }}>
      <View styleName="md-gutter" style={styles.cont}>
        <View style={styles.con}>
          <View style={styles.leftcon}>
            <TouchableWithoutFeedback onPress={backClicked}>
              <View style={styles.circle}>
                <IconChooser
                  name={'x'}
                  size={18}
                  color={Pref.RED}
                  style={styles.icon}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={{flex: 0.5}}></View>
          <View style={styles.rightcon}></View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  belowtext: {
    fontSize: 18,
    letterSpacing: 0.5,
    color: '#555555',
    fontWeight: '700',
    lineHeight: 36,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingVertical: 16,
  },
  insideview: {
    height: sizeHeight(5),
    alignContent: 'center',
    borderRadius: 16,
    width: '40%',
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    marginStart: sizeWidth(10),
  },
  container: {
    //flex:1,
    paddingVertical: sizeHeight(3.2),
    backgroundColor: 'white',
    elevation: 4,
    borderBottomLeftRadius: 64,
  },
  avatar: {
    marginEnd: sizeWidth(3),
    backgroundColor: 'transparent',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: 'white',
    marginStart: sizeWidth(3),
    alignSelf: 'center',
    marginStart: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
  },
  icon: {
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  con: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftcon: {
    flex: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightcon: {
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightText: {
    color: '#bbb8ac',
    fontSize: 18,
    marginEnd: 8,
    letterSpacing: 0.5,
  },
  circle: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 4,
    borderRadius: 42 / 2,
    borderColor: '#4a4949',
    borderStyle: 'solid',
    borderWidth: 3,
  },
  line: {
    backgroundColor: '#f2f1e6',
    height: 1.2,
    marginStart: 12,
    marginEnd: 12,
  },
});

export default DrawerTop;
