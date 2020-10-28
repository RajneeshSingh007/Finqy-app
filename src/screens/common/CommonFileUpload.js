import React from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import { Title } from '@shoutem/ui';
import { sizeHeight, sizeWidth } from '../../util/Size';
import DocumentPicker from 'react-native-document-picker';
import * as Pref from '../../util/Pref';
import Lodash from 'lodash';
import IconChooser from '../common/IconChooser';
import * as Helper from '../../util/Helper';

class CommonFileUpload extends React.PureComponent {
  constructor(props) {
    super(props);
    this.filePicker = this.filePicker.bind(this);
    const { title } = this.props;
    this.state = {
      title: title,
      mode: false,
      pickedName: '',
    };
  }

  componentDidMount() {
    const { title, mode = false } = this.props;
    this.setState({ mode: mode, title: title });
  }

  filePicker = async () => {
    const { type = 0, mode = false } = this.props;
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
            this.setState({
              pickedName: Lodash.truncate(res.name, {
                length: 40,
                separator: '...'
              })
            });
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

  download = () => {
    const { downloadUrl = '', fileName = '', ext = '', mime = 'application/pdf'} = this.props;
    if(downloadUrl != '' && fileName != '' && ext != ''){
      Helper.downloadFileWithFileName(downloadUrl, fileName, `${fileName}.${ext}`, mime, true, false);
    }
  }

  render() {
    const { pickedName } = this.state;
    const { pickedTitle = null, enableDownloads = false, } = this.props;
    return (
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableWithoutFeedback onPress={this.filePicker}>
          <View style={StyleSheet.flatten([styles.insideContainer, {
            flex: enableDownloads ? 0.9 : 1
          }])}>
            <View>
              <Title
                style={StyleSheet.flatten([
                  styles.title,
                  {
                    bottom: pickedName !== '' ? 2 : 0,
                    color: pickedName !== '' ? Pref.RED : '#555555',
                  },
                ])}>
                {pickedName === ''
                  ? `Upload ${this.state.title} File Type:`
                  : `${this.state.title}`}
                <Title
                  style={StyleSheet.flatten([
                    styles.title,
                    {
                      color: '#bbbbbb',
                    },
                  ])}>
                  {pickedName === '' ? ` PDF/Image` : ''}
                </Title>
              </Title>
              {pickedName !== '' ? (
                <Title style={styles.subtitle}>{pickedName}</Title>
              ) : null}
              {pickedTitle !== '' ? (
                <Title style={styles.subtitle}>{pickedTitle}</Title>
              ) : null}
            </View>
          </View>
        </TouchableWithoutFeedback>
        {enableDownloads === true ? <TouchableWithoutFeedback onPress={this.download}>
          <View style={{ flex: 0.1 }}>
            <View style={styles.circle}>
              <IconChooser name={'download'} size={20} color={'white'} style={{
                alignSelf: 'center'
              }} />
            </View>
          </View>
        </TouchableWithoutFeedback> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  circle: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 4,
    borderRadius: 36 / 2,
    //borderColor: '#4a4949',
    //borderStyle: 'solid',
    //borderWidth: 3,
    backgroundColor: Pref.RED
  },
  container: {
    paddingVertical: sizeHeight(0.5),
    marginHorizontal: sizeWidth(3),
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    alignItems: 'center',
    color: '#767676',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#555555',
    letterSpacing: 0.5,
  },
  insideContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    borderBottomWidth: 1.3,
    borderBottomColor: '#f2f1e6',
    marginStart: 10,
    marginEnd: 10,
    paddingVertical: 10,
    height: 56,
    marginVertical: 4
  },
  inincontainer: {
    flexDirection: 'row',
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopEndRadius: 2,
    borderBottomLeftRadius: 2,
    borderTopStartRadius: 2,
  },
});

export default CommonFileUpload;
