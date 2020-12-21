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
    const { type = 0, mode = false,fileType = -1 } = this.props;
    if (mode === false) {
      let fileTypes = [];
      if(type === 0){
        fileTypes = [DocumentPicker.types.images];
      }else if(type === 1){
        fileTypes = [DocumentPicker.types.pdf];
      }else{
        fileTypes = [DocumentPicker.types.images, DocumentPicker.types.pdf]; 
      }
      try {
        const res = await DocumentPicker.pick({
          // type: [
          //   type === 0
          //     ? DocumentPicker.types.images
          //     : type === 1
          //       ? DocumentPicker.types.pdf
          //       : DocumentPicker.types.allFiles,
          // ],
          type:fileTypes
        });
        if(res.name !== '' && res.type === 'application/pdf'  && !res.name.includes('.')){
          const pname = res.name;
          res.name = `${pname}.pdf`;
        }else if(res.name !== '' && res.type === 'image/jpeg'  && !res.name.includes('.')){
          const pname = res.name;
          res.name = `${pname}.jpeg`;
        }else if(res.name !== '' && res.type === 'image/jpg' && !res.name.includes('.')){
          const pname = res.name;
          res.name = `${pname}.jpg`;
        }else if(res.name !== '' && res.type === 'image/png'  && !res.name.includes('.')){
          const pname = res.name;
          res.name = `${pname}.png`;
        }
        //console.log(res);
        if (res.name !== '') {
          if (
            res.name.includes('pdf') ||
           fileType === -1 && res.name.includes('png') ||
           fileType === -1 && res.name.includes('jpeg') ||
           fileType === -1 && res.name.includes('jpg')
          ) {
            if (res.size <= 10485760) {
              this.setState({
                pickedName: Lodash.truncate(res.name, {
                  length: 40,
                  separator: '...'
                })
              });
            }
          }
        }
        //2097152 2mb
        //10485760 10mb
        if (res.size <= 10485760) {
          this.props.pickedCallback(res.name !== '' ? false : true, res);
        } else {
          Helper.showToastMessage('Please, select files less than 10MB ')
        }
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
    const { downloadUrl = '', fileName = '', ext = '', mime = 'application/pdf' } = this.props;
    if (downloadUrl != '' && fileName != '' && ext != '') {
      Helper.downloadFileWithFileName(downloadUrl, fileName, `${fileName}.${ext}`, mime, true, false);
    }
  }

  render() {
    const { pickedName } = this.state;
    const { pickedTitle = null, enableDownloads = false, fileType = -1 } = this.props;
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
                  {pickedName === '' ? fileType != -1 ? `PDF` :  ` PDF/Image` : ''}
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
