import React, {Component} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import IconChooser from '../screens/common/IconChooser';
import {Colors} from 'react-native-paper';

const {height: heightWindow} = Dimensions.get('window');

const getHeightView = (heightFull = heightWindow, ratio = 0.5) => {
  const getRatio = ratio < 0.5 || ratio > 1 ? 0.5 : ratio;
  return heightFull * getRatio;
};

class ModalComponent extends React.PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: this.props.visible,
      opacity: new Animated.Value(0),
      height: getHeightView(heightWindow, props.ratio),
    };
  }

  animation = (type = 'open', cb = () => {}) => {
    const {
      topLeftElement,
      topRightElement,
      underTopElement,
      ratioHeight,
      children,
      setModalVisible,
      backgroundColor,
      topCenterElement,
    } = this.props;

    const toValue = type === 'open' ? 0.5 : 0;
    const duration = 100;
    Animated.timing(this.state.opacity, {
      toValue: toValue,
      duration: duration,
      useNativeDriver: false,
    }).start(cb);
  };

  onShow = () => {
    this.animation();
  };

  componentDidUpdate(preProps) {
    const {visible} = this.props;
    // Close
    if (!visible && preProps.visible !== visible) {
      this.animation('close', () => this.setState({visible}));
    }
    // Open
    if (visible && preProps.visible !== visible) {
      this.setState({visible});
    }
  }

  render() {
    const {
      topLeftElement,
      topRightElement,
      underTopElement,
      ratioHeight,
      children,
      setModalVisible,
      backgroundColor,
      topCenterElement,
      leftFlex = 0.2,
      rightFlex = 0.2,
      centerFlex = 0.6
    } = this.props;
    const {opacity, visible, height} = this.state;

    const topLeft = topLeftElement ? (
      topLeftElement
    ) : (
      <TouchableOpacity
        onPress={() => setModalVisible(false)}
        style={{padding: 2}}>
        <IconChooser name={'x'} size={24} iconType={1} color={'#555'} />
      </TouchableOpacity>
    );

    const topRight = topRightElement ? topRightElement : null;
    const topCenter = topCenterElement ? topCenterElement : null;

    const bottom = opacity.interpolate({
      inputRange: [0, 0.5],
      outputRange: [-height, 0],
    });

    return (
      <Modal transparent visible={visible} onShow={this.onShow}>
        <View
          style={styles.container}
          onLayout={(event) => {
            let {height: heightFull} = event.nativeEvent.layout;
            this.setState({
              height: getHeightView(heightFull, ratioHeight),
            });
          }}>
          <Animated.View
            style={{
              flex: 1,
              backgroundColor: 'black',
              opacity: opacity,
            }}>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => setModalVisible(false)}
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.modal,
              {
                height: height,
                backgroundColor: backgroundColor,
                bottom: bottom,
              },
            ]}>
            {/*Header*/}
            <View style={styles.header}>
              <View
                style={{
                  flex: leftFlex,
                  //alignItems: 'center',
                  //alignContent: 'center',
                }}>
                {topLeft}
              </View>
              <View
                style={{
                  flex: centerFlex,
                  alignItems: 'center',
                  alignContent: 'center',
                }}>
                {topCenter}
              </View>
              <View
                style={{
                  flex: rightFlex,
                  alignItems: 'center',
                  alignContent: 'center',
                }}>
                {topRight}
              </View>
              {/* {topCenter}
              {topLeft} */}
            </View>

            {underTopElement}

            {/*Content*/}
            <View style={{flex: 1}}>{children}</View>
          </Animated.View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    paddingStart: 24,
    paddingEnd: 16,
    paddingBottom: 16,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    //justifyContent: 'space-between',
    borderBottomColor: Colors.grey200,
    borderBottomWidth: 1,
    backgroundColor: 'white',
  },
});

// ModalComponent.propTypes = {
//   visible: PropTypes.bool,
//   setModalVisible: PropTypes.func,
//   ratioHeight: PropTypes.number,
//   topRightElement: PropTypes.node,
// };

ModalComponent.defaultProps = {
  topBottomElement: null,
  visible: false,
  ratioHeight: 0.5,
};

export default ModalComponent;
