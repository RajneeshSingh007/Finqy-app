import React from 'react';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
import {Title} from '@shoutem/ui';
import {sizeHeight, sizeWidth} from '../../util/Size';
import DocumentPicker from 'react-native-document-picker';
import * as Pref from '../../util/Pref';
import Lodash from 'lodash';
import IconChooser from '../common/IconChooser';
import * as Helper from '../../util/Helper';

class CommonFileUpload extends React.PureComponent {
  constructor(props) {
    super(props);
    this.filePicker = this.filePicker.bind(this);
    const {title} = this.props;
    this.state = {
      title: title,
      mode: false,
      pickedName: '',
    };
  }

  componentDidMount() {
    const {title = '', mode = false, pickedTitle=''} = this.props;
    this.setState({mode: mode, title: title, pickedName: pickedTitle});
  }

  componentDidUpdate(prevProp, nextState){
    if(prevProp.pickedName === '' && prevProp.pickedTitle != ''){
      this.setState({pickedName:prevProp.pickedTitle})
    }
  }

  componentWillReceiveProps(prop) {
    if (prop.pickedTitle && prop.pickedTitle != '') {
      this.setState({pickedName: prop.pickedTitle, title: prop.title});
    }
  }

  filePicker = async () => {
    const {type = 0, mode = false, fileType = -1, title = '',keyName=''} = this.props;
    if (mode === false) {
      let fileTypes = [];
      if (type === 0) {
        fileTypes = [DocumentPicker.types.images];
      } else if (type === 1) {
        fileTypes = [DocumentPicker.types.pdf];
      } else {
        fileTypes = [DocumentPicker.types.images, DocumentPicker.types.pdf];
      }
      try {
        const res = await DocumentPicker.pick({type: fileTypes});
        if (
          res.name !== '' &&
          res.type === 'application/pdf' &&
          !res.name.includes('.')
        ) {
          const pname = res.name;
          res.name = `${pname}.pdf`;
        }else if (
          res.name !== '' &&
          res.type === 'application/PDF' &&
          !res.name.includes('.')
        ) {
          const pname = res.name;
          res.name = `${pname}.pdf`;
        } else if (
          res.name !== '' &&
          res.type === 'image/jpeg' &&
          !res.name.includes('.')
        ) {
          const pname = res.name;
          res.name = `${pname}.jpeg`;
        } else if (
          res.name !== '' &&
          res.type === 'image/jpg' &&
          !res.name.includes('.')
        ) {
          const pname = res.name;
          res.name = `${pname}.jpg`;
        } else if (
          res.name !== '' &&
          res.type === 'image/png' &&
          !res.name.includes('.')
        ) {
          const pname = res.name;
          res.name = `${pname}.png`;
        } else if (
          res.name !== '' &&
          res.type === 'image/jfif' &&
          !res.name.includes('.')
        ) {
          const pname = res.name;
          res.name = `${pname}.jfif`;
        } else if (
          res.name !== '' &&
          res.type === 'image/jpe' &&
          !res.name.includes('.')
        ) {
          const pname = res.name;
          res.name = `${pname}.jpe`;
        }
        const fileformatCheck = Helper.extCheckReg(res.name);

        const fileSize =
          Helper.nullCheck(res.size) === false &&
          res.size <= Pref.LIMIT_FILE_SIZE;

        if (fileformatCheck) {
          if (fileSize) {
            res.key = keyName;
            this.props.pickedCallback(res.name !== '' ? false : true, res);
            this.setState({
              pickedName: res.name,
            });
          } else {
            Helper.showToastMessage('Please, select files less than 10MB', 0);
          }
        } else {
          if (
            title === '1 Year Bank Statement' ||
            title === '3 Month Bank Statement'
          ) {
            Helper.showToastMessage('Please, Select PDF file', 0);
          } else {
            Helper.showToastMessage(
              'Please, Select PNG, JPEG, JPG, JPE, JIFI or PDF files only',
              0,
            );
          }
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
    const {
      downloadUrl = '',
      fileName = '',
      ext = '',
      mime = 'application/pdf',
    } = this.props;
    if (Helper.nullStringCheck(downloadUrl) === false) {
      const parseurl = String(downloadUrl);
      let fullName = parseurl.slice(
        parseurl.lastIndexOf('/') + 1,
        parseurl.length,
      );
      let finalName = fullName.slice(0, fullName.lastIndexOf('.'));
      let extension = fullName.slice(fullName.lastIndexOf('.')+1, fullName.length);
      let mimeType = 'application/pdf';
      if(extension !== 'pdf'){
        mimeType = `image/${extension}`;
      }

      //console.log('mimeType', mimeType);
      //console.log('finalName', finalName);
      
      Helper.downloadFileWithFileName(
        downloadUrl,
        finalName,
        fullName,
        mimeType,
        true,
        false,
      );
    } else {
      Helper.showToastMessage('File not available', 0);
    }
  };

  /**
   *
   */
  downloadView = () => {
    const {pickedName} = this.state;
    const {
      pickedTitle = null,
      enableDownloads = false,
      fileType = -1,
      downloadTitles = '',
      downloadUrl = '',
      truDownloadEnable = -1,
      editMode = false
    } = this.props;
    return truDownloadEnable === 1 &&
      Helper.nullStringCheck(downloadUrl) === false ? (
      <View style={styles.maincontainers}>
        <View
          style={StyleSheet.flatten([
            styles.insideContainer,
            {
              flex: enableDownloads ? 0.9 : 1,
            },
            enableDownloads ? {height: 56} : {},
          ])}>
          <View>
            <Title
              style={StyleSheet.flatten([
                styles.title,
                {
                  bottom: pickedName !== '' ? 2 : 0,
                  color: pickedName !== '' ? Pref.RED : '#555555',
                  marginStart: 4,
                },
              ])}>
              {this.state.title === '' ? downloadTitles : this.state.title}
            </Title>
          </View>
        </View>
        {enableDownloads === true ? (
          <TouchableWithoutFeedback onPress={this.download}>
            <View style={{flex: 0.1}}>
              <View style={styles.circle}>
                <IconChooser
                  name={'download'}
                  size={20}
                  color={'white'}
                  style={{
                    alignSelf: 'center',
                  }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        ) : null}
      </View>
    ) : null;
  };

  render() {
    const {pickedName} = this.state;
    const {
      style = {},
      pickedTitle = null,
      enableDownloads = false,
      fileType = -1,
      downloadTitles = '',
      downloadUrl = '',
      truDownloadEnable = -1,
      showPlusIcon = false,
      plusClicked = () => {},
      editMode=false,
      showMinusIcon = false,
      minusClicked = () =>{}
    } = this.props;
    return truDownloadEnable === 1 ? (
      this.downloadView()
    ) : (
      <View style={StyleSheet.flatten([styles.maincontainers, style])}>
        <View
          style={StyleSheet.flatten([
            styles.insideContainer,
            {
              flex: enableDownloads ? 0.9 : 1,
            },
            //enableDownloads ? {height: 56, paddingVertical} : {},
          ])}>
          <View style={styles.filemaincontainers}>
            <TouchableWithoutFeedback onPress={this.filePicker}>
              <View style={{flexShrink: 1,flex:0.9}}>
                <Title
                  style={StyleSheet.flatten([
                    styles.title,
                    {
                      bottom: pickedName !== '' ? 2 : 0,
                      color: pickedName !== '' ? Pref.RED : '#555555',
                      marginStart: 4,
                      //flex: showPlusIcon ? 0.9 : 1,
                    },
                  ])}>
                  {editMode ? `Upload ${this.state.title} File Type:` : downloadTitles === ''
                    ? pickedName === ''
                      ? `Upload ${this.state.title} File Type:`
                      : `${this.state.title}`
                    : this.state.title === ''
                    ? downloadTitles
                    : this.state.title}
                  <Title
                    style={StyleSheet.flatten([
                      styles.title,
                      {
                        color: '#bbbbbb',
                      },
                    ])}>
                    {editMode ? fileType != -1
                          ? `PDF`
                          : ` PDF/Image` : downloadTitles === ''
                      ? pickedName === ''
                        ? fileType != -1
                          ? `PDF`
                          : ` PDF/Image`
                        : ''
                      : ''}
                  </Title>
                </Title>
                {pickedName !== '' ? (
                  <Title style={styles.subtitle}>{Lodash.truncate(pickedName, {
                    separator:'...',
                    length: downloadUrl !== '' ? 29 : 35
                  })}</Title>
                ) : null}
              </View>
            </TouchableWithoutFeedback>
            {showPlusIcon ? (
              <TouchableWithoutFeedback onPress={plusClicked}>
                <View
                  style={{
                    flex: 0.05,
                    marginTop: downloadUrl !== '' ? 4 : 0
                  }}>
                  <View
                    style={StyleSheet.flatten([
                      styles.circle,
                      {justifyContent: 'center', marginEnd: 8, marginTop: 4},
                    ])}>
                    <IconChooser
                      name={'plus'}
                      size={16}
                      iconType={2}
                      color={'white'}
                      style={{
                        alignSelf: 'center',
                      }}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            ) : null}
            {showMinusIcon ? (
              <TouchableWithoutFeedback onPress={minusClicked}>
                <View
                  style={{
                    flex: 0.05,
                    marginTop: downloadUrl !== '' ? 4 : 0
                  }}>
                  <View
                    style={StyleSheet.flatten([
                      styles.circle,
                      {justifyContent: 'center', marginEnd: 8, marginTop: 4,backgroundColor:'#555'},
                    ])}>
                    <IconChooser
                      name={'minus'}
                      size={16}
                      iconType={2}
                      color={'white'}
                      style={{
                        alignSelf: 'center',
                      }}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            ) : null}
          </View>
        </View>
        {enableDownloads === true ? (
          <TouchableWithoutFeedback onPress={this.download}>
            <View
              style={{
                flex: 0.1,
                marginStart: showPlusIcon ? 12 : 0,
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              <View style={styles.circle}>
                <IconChooser
                  name={'download'}
                  size={20}
                  color={'white'}
                  style={{
                    alignSelf: 'center',
                  }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  filemaincontainers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  maincontainers: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  circle: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderRadius: 36 / 2,
    //borderColor: '#4a4949',
    //borderStyle: 'solid',
    //borderWidth: 3,
    backgroundColor: Pref.RED,
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
    marginStart: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#555555',
    letterSpacing: 0.5,
    textAlign: 'left',
  },
  insideContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    borderBottomWidth: 1.3,
    borderBottomColor: '#f2f1e6',
    marginStart: 10,
    marginEnd: 10,
    paddingVertical: 8,
    //height: 56,
    marginVertical: 4,
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
