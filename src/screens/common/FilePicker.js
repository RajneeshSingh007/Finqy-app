import React from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import {Title} from '@shoutem/ui';
import {sizeHeight, sizeWidth} from '../../util/Size';
import DocumentPicker from 'react-native-document-picker';
import * as Pref from '../../util/Pref';
import Lodash from 'lodash';
import IconChooser from '../common/IconChooser';
import * as Helper from '../../util/Helper';
import {Menu} from 'react-native-paper';

class FilePicker extends React.PureComponent {
  constructor(props) {
    super(props);
    this.filePicker = this.filePicker.bind(this);
    const {totalFile = 0, downloadList = []} = props;
    const pickedFile = [];
    for (let index = 0; index < totalFile; index++) {
      pickedFile.push({
        fileCopyUri: '',
        key: '',
        name: '',
        size: 0,
        type: '',
        uri: '',
        downloadUrl: Helper.nullStringCheckWithReturn(downloadList[index]),
      });
    }
    this.state = {
      pickedFile: pickedFile,
      visible: false,
      height: 0,
      width: 0,
    };
  }

  componentDidMount() {
    this.fileSetup(this.props);
  }

  componentWillReceiveProps(nextprop) {
    this.fileSetup(nextprop);
  }

  fileSetup = (prop) => {
    const {restoreFileList = []} = prop;
    if (restoreFileList.length > 0) {
      this.setState({pickedFile: restoreFileList});
    } else {
      const {totalFile = 0, downloadList = []} = prop;
      const pickedFile = [];
      for (let index = 0; index < totalFile; index++) {
        pickedFile.push({
          fileCopyUri: '',
          key: '',
          name: '',
          size: 0,
          type: '',
          uri: '',
          downloadUrl: Helper.nullStringCheckWithReturn(downloadList[index]),
        });
      }
      this.setState({pickedFile: pickedFile});
    }
  };

  filePicker = async (position = 0) => {
    const {type = 0, mode = false, title = '', keyName = ''} = this.props;
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
        } else if (
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
            // this.setState({
            //   pickedName: res.name,
            // });
            const {pickedFile} = this.state;
            const {downloadUrl} = pickedFile[position];
            res.downloadUrl = downloadUrl;
            pickedFile[position] = res;
            this.setState({pickedFile: pickedFile}, () => {
              this.props.pickedCallback(pickedFile);
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
          this.props.pickedCallback([]);
        } else {
          throw err;
        }
      }
    }
  };

  downloadClicked = (position = 0) => {
    const {pickedFile} = this.state;
    if (pickedFile.length > 0) {
      const {downloadUrl} = pickedFile[position];
      if (Helper.nullStringCheck(downloadUrl) === false) {
        const parseurl = String(downloadUrl);
        let fullName = parseurl.slice(
          parseurl.lastIndexOf('/') + 1,
          parseurl.length,
        );
        let finalName = fullName.slice(0, fullName.lastIndexOf('.'));
        let extension = fullName.slice(
          fullName.lastIndexOf('.') + 1,
          fullName.length,
        );
        let mimeType = 'application/pdf';
        if (extension !== 'pdf') {
          mimeType = `image/${extension}`;
        }
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
    }
  };
  /**
   *
   */
  downloadView = (title, download = () => {}) => {
    return (
      <View style={styles.filemaincontainers}>
        <View
          style={{
            flex: 0.9,
          }}>
          <View>
            <Title
              style={StyleSheet.flatten([
                styles.title,
                {
                  fontSize: 16,
                },
              ])}>
              {title}
            </Title>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={() => download()}>
          <View style={{flex: 0.1, marginEnd: 0}}>
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
      </View>
    );
  };

  renderFilePicker = (
    title,
    fileType,
    pickedName,
    showPlusIcon,
    enableDownloads,
    plusClicked = () => {},
    filePicked = () => {},
    downloadClicked = () => {},
  ) => {
    const {totalFile} = this.props;
    return (
      <>
        <TouchableWithoutFeedback onPress={() => filePicked()}>
          <View style={{flex: enableDownloads && showPlusIcon ? 0.77 : 0.87}}>
            {pickedName === '' ? (
              <Title style={styles.title}>
                {`Upload ${title} File Type:`}
                <Title
                  style={StyleSheet.flatten([
                    styles.title,
                    {
                      color: '#555555',
                      alignSelf: 'center',
                    },
                  ])}>
                  {fileType != -1 ? `PDF` : ` PDF/Image`}
                </Title>
              </Title>
            ) : null}
            {pickedName !== '' ? (
              <Title style={styles.title}>
                {`${title}: `}
                <Title
                  style={StyleSheet.flatten([
                    styles.title,
                    {
                      color: '#555555',
                    },
                  ])}>
                  {Lodash.truncate(`${pickedName}`, {
                    separator: '...',
                    length: title.length + 14,
                  })}
                </Title>
              </Title>
            ) : null}
          </View>
        </TouchableWithoutFeedback>
        {showPlusIcon && totalFile > 0 ? (
          <TouchableWithoutFeedback onPress={() => plusClicked()}>
            <View
              style={{
                flex: 0.13,
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              <IconChooser
                name={!this.state.visible ? 'chevron-down' : 'chevron-up'}
                size={16}
                iconType={2}
                color={Pref.RED}
                style={{
                  alignSelf: 'center',
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        ) : null}
        {enableDownloads === true ? (
          <TouchableWithoutFeedback onPress={() => downloadClicked()}>
            <View
              style={{
                flex: 0.13,
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              <View style={styles.circle}>
                <IconChooser
                  name={'download'}
                  size={16}
                  color={'white'}
                  style={{
                    alignSelf: 'center',
                  }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        ) : null}
      </>
    );
  };

  moreFilePickClicked = () => {
    const {visible, pickedFile} = this.state;
    //this.props.pickedCallback(pickedFile);
    this.setState({visible: !visible});
  };

  onLayout = (event) => {
    const {width, height} = event.nativeEvent.layout;
    this.setState({width: width, height: height});
  };

  closeMenu = () => {
    //const {pickedFile} = this.state;
    //this.props.pickedCallback(pickedFile);
    this.setState({visible: false});
  };

  render() {
    const {pickedFile, width, height, visible} = this.state;
    const {
      fileType = -1,
      showPlusIcon = true,
      title,
      truDownloadEnable = -1,
    } = this.props;
    return truDownloadEnable === 1 ? (
      this.downloadView(title, '')
    ) : (
      <Menu
        visible={visible}
        onDismiss={this.closeMenu}
        anchor={
          <View
            style={StyleSheet.flatten([
              styles.maincontainers,
              {
                marginTop: 16,
              },
            ])}
            onLayout={this.onLayout}>
            {this.renderFilePicker(
              title,
              fileType,
              pickedFile.length > 0 ? pickedFile[0]['name'] : '',
              showPlusIcon,
              pickedFile.length > 0
                ? pickedFile[0]['downloadUrl'] !== ''
                  ? true
                  : false
                : false,
              () => this.moreFilePickClicked(),
              () => this.filePicker(0),
              () => this.downloadClicked(0),
            )}
          </View>
        }
        style={{
          maxWidth: width,
          width: '100%',
          marginStart: 8,
          marginEnd: 8,
          marginTop: height + 8,
        }}
        contentStyle={{
          backgroundColor: 'white',
        }}>
        <>
          <FlatList
            data={pickedFile}
            renderItem={({item, index}) => {
              return index === 0 ? null : (
                <View style={styles.maincontainers}>
                  {this.renderFilePicker(
                    `${title} ${index}`,
                    fileType,
                    item.name,
                    false,
                    item.downloadUrl !== '',
                    () => {},
                    () => this.filePicker(index),
                    () => this.downloadClicked(0),
                  )}
                </View>
              );
            }}
            style={{
              maxHeight: 200,
            }}
            extraData={this.state}
            keyExtractor={(item, index) => `${index}`}
          />
        </>
      </Menu>
    );
  }
}

const styles = StyleSheet.create({
  filemaincontainers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    height: 56,
    marginHorizontal: 8,
  },
  maincontainers: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    borderColor: Pref.RED,
    borderWidth: 1.1,
    borderRadius: 4,
    height: 48,
    marginHorizontal: 8,
    marginBottom: 8,
    marginTop: 8,
    position: 'relative',
  },
  circle: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 32 / 2,
    backgroundColor: Pref.RED,
  },
  container: {
    paddingVertical: sizeHeight(0.5),
    marginHorizontal: sizeWidth(3),
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'red',
    borderColor: 'transparent',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginStart: 8,
    marginTop: -10,
    position: 'absolute',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    alignItems: 'center',
    color: '#767676',
    marginStart: 4,
  },
  title: {
    color: '#000',
    width: '100%',
    textAlign: 'left',
    padding: 6,
    fontSize: 14,
    fontFamily: Pref.getFontName(4),
    lineHeight: 24,
    letterSpacing: 0.2,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  insideContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
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

export default FilePicker;
