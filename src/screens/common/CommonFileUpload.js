import React from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import {TouchableOpacity, Image, Screen, Subtitle, Title} from '@shoutem/ui';
import {
  Button,
  Card,
  Colors,
  Snackbar,
  TextInput,
  DataTable,
  Modal,
  Portal,
  Searchbar,
} from 'react-native-paper';
import {sizeFont, sizeHeight, sizeWidth} from '../../util/Size';
import DocumentPicker from 'react-native-document-picker';
import * as Pref from '../../util/Pref';

class CommonFileUpload extends React.PureComponent {
  constructor(props) {
    super(props);
    this.filePicker = this.filePicker.bind(this);
    const {title, mode = false} = this.props;
    this.state = {
      title: title,
      mode: false,
    };
  }

  componentDidMount() {
    const {title, mode = false} = this.props;
    this.setState({mode: mode, title: title});
  }

  filePicker = async () => {
    const {type = 0, mode = false} = this.props;
    if (mode === false) {
      try {
        const res = await DocumentPicker.pick({
          type: [
            type === 0
              ? DocumentPicker.types.images
              : type === 1
              ? DocumentPicker.types.pdf
              : DocumentPicker.types.allFiles,
          ],
        });
        if (res.name !== '') {
          if (
            res.name.includes('pdf') ||
            res.name.includes('png') ||
            res.name.includes('jpeg') ||
            res.name.includes('jpg')
          ) {
            const sp = res.name.split('.');
            let nameTrim = sp[0].trim();
            if (nameTrim.length > 23) {
              nameTrim = nameTrim.slice(0, 23) + '...';
            }
            this.setState({title: nameTrim});
          }
        }
        this.props.pickedCallback(res.name !== '' ? false : true, res);
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          this.props.pickedCallback(true, null);
        } else {
          throw err;
        }
      }
    }
  };

  render() {
    const {containerStyle, leftText = 'Browse', mode = false} = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        <View
          style={[
            styles.insideContainer,
            {
              height: this.state.mode ? 42 : 44,
            },
          ]}>
          <TouchableWithoutFeedback onPress={this.filePicker}>
            <View
              style={[
                styles.inincontainer,
                {
                  flex: this.state.mode ? 0.5 : 0.3,
                },
              ]}>
              <Subtitle style={styles.title}>{leftText}</Subtitle>
            </View>
          </TouchableWithoutFeedback>

          <View style={{flex: 0.7}}>
            <Subtitle styleName={'v-start h-start'} style={styles.subtitle}>
              {this.state.title}
            </Subtitle>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: sizeHeight(0.5),
    marginHorizontal: sizeWidth(3),
  },
  subtitle: {
    fontSize: 15,
    marginStart: 10,
    fontFamily: 'Rubik',
    fontWeight: '400',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#767676',
    padding: 4,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Rubik',
    fontWeight: '400',
    color: 'white',
  },
  insideContainer: {
    flexDirection: 'row',
    flex: 1,
    borderRadius: 2,
    marginVertical: sizeHeight(1),
    backgroundColor: Colors.grey200,
    alignItems: 'center',
  },
  inincontainer: {
    flexDirection: 'row',
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#292929',
    borderTopEndRadius: 2,
    borderBottomLeftRadius: 2,
    borderTopStartRadius: 2,
  },
});

export default CommonFileUpload;
