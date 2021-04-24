import React from 'react';
import {
  StyleSheet,
  FlatList,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import {Title, Subtitle, View, Html} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {Colors, ActivityIndicator, Chip} from 'react-native-paper';
import {sizeWidth, sizeHeight} from '../../util/Size';
import Lodash from 'lodash';
import LeftHeaders from '../common/CommonLeftHeader';
import ListError from '../common/ListError';
import IconChooser from '../common/IconChooser';
import YoutubePlayer from 'react-native-youtube-iframe';
import CScreen from '../component/CScreen';
import Share from 'react-native-share';
import Pdf from 'react-native-pdf';
import Modal from '../../util/Modal';

const youtubeURL = 'https://www.youtube.com/watch?v=';

export default class Training extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderItems = this.renderItems.bind(this);
    this.state = {
      dataList: [],
      loading: false,
      showCalendar: false,
      dates: '',
      token: '',
      userData: '',
      categoryList: [],
      cloneList: [],
      showFilter: false,
      fileType: 2,
      height: 0,
      selectedFilterTitle: '',
      modalVisible: false,
      modalPdfUrl: '',
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({loading: true});
    });
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.userData, (userData) => {
        this.setState({userData: userData});
        Pref.getVal(Pref.saveToken, (value) => {
          this.setState({token: value}, () => {
            this.fetchData();
          });
        });
      });
    });
  }

  componentWillUnMount() {
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  fetchData = () => {
    this.setState({loading: true});
    const body = JSON.stringify({
      training_id: '1',
    });
    Helper.networkHelperTokenPost(
      Pref.TrainingUrl,
      body,
      Pref.methodPost,
      this.state.token,
      (result) => {
        const {data, response_header} = result;
        //console.log('resultx', result);
        const {res_type} = response_header;
        if (res_type === `success`) {
          const categoryList = [];
          categoryList.push({name: `All`, selected: true});
          categoryList.push({name: `PDF`, selected: false});
          categoryList.push({name: `Videos`, selected: false});
          const catlist = Lodash.map(data, (io) => {
            const {product_name, link} = io;
            const find = Lodash.find(
              categoryList,
              (ui) => ui.name === product_name,
            );
            if (find === undefined) {
              categoryList.push({
                name: product_name,
                selected: false,
              });
            }
            if (link.includes(`embed`)) {
              const sp = link.split('/');
              const id = sp[4];
              if (!id.includes(`frameborder`)) {
                io.link = `${youtubeURL}${id.trim()}`;
              } else {
                let agsp = id.split('frameborder');
                const idx = agsp[0].replace('"/', '').replace('"', '').trim();
                io.link = `${youtubeURL}${idx}`;
              }
            }
            return io;
          });
          let sort = Lodash.sortBy(catlist, ['link']).reverse();
          this.setState({
            cloneList: catlist,
            dataList: sort,
            categoryList: Lodash.uniq(categoryList),
            loading: false,
          });
        } else {
          this.setState({loading: false});
        }
      },
      () => {
        this.setState({loading: false});
      },
    );
  };

  findDownloadSelected = () => {
    const {categoryList} = this.state;
    const find = Lodash.find(
      categoryList,
      (io) => io.name === `Download` && io.selected === true,
    );
    return find === undefined ? false : true;
  };

  /**
   *
   * @param {*} item
   * @param {*} mode
   */
  itemshare = (item, mode) => {
    const videoId = item.link !== undefined && item.link !== '' && item.link.includes('?') ? item.link.split('?')[1].replace('v=', ''): '';
    const url = mode === 1? `${youtubeURL}${videoId}` : item.pdf_url;
    const shareOptions = {
      title: '',
      message: '',
      url: url,
      social: Share.Social.WHATSAPP,
      whatsAppNumber: '',
    };
    Share.shareSingle(shareOptions);
  };

  /**
   *
   * @param {*} item
   * @param {*} index
   */
  renderItems(item) {
    const videoid = item.link !== undefined && item.link !== '' && item.link.includes('?') ? item.link.split('?')[1].replace('v=', '') : '';
    const {fileType, selectedFilterTitle} = this.state;
    return item.link !== '' &&
      !item.link.includes('.png') &&
      !item.link.includes('.jpeg') &&
      !item.link.includes('.jpg') &&
      (fileType === 0 || fileType === 2) ? (
      <View styleName="sm-gutter">
        <View styleName="vertical" style={styles.itemContainer}>
          <View style={styles.youtubecontainer}>
            <YoutubePlayer
              height={185}
              width={sizeWidth(80)}
              videoId={videoid}
              allowWebViewZoom={false}
            />
          </View>
          {selectedFilterTitle !== '' &&
          selectedFilterTitle !== 'All' &&
          selectedFilterTitle !== 'Videos' &&
          selectedFilterTitle !== 'PDF' ? (
            <Subtitle
              styleName="v-start h-start"
              numberOfLines={1}
              style={styles.itemtextSubtitle}>
              {Helper.replacetext(selectedFilterTitle)}
            </Subtitle>
          ) : null}
          <Title
            styleName="v-start h-start"
            numberOfLines={2}
            style={styles.itemtext}>{`${item.header}`}</Title>
          <View
            styleName="horizontal v-center h-center space-between"
            style={{marginBottom: 8}}>
            <TouchableWithoutFeedback onPress={() => this.itemshare(item, 1)}>
              <View style={styles.circle1}>
                <IconChooser
                  name="whatsapp"
                  size={18}
                  color={'white'}
                  iconType={2}
                  style={styles.icon}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    ) : item.link === '' && (fileType === 1 || fileType === 2) ? (
      <View styleName="sm-gutter">
        <View styleName="vertical" style={styles.itemContainer}>
          <TouchableWithoutFeedback
            onPress={() =>
              this.setState({
                modalVisible: true,
                modalPdfUrl: item.pdf_url,
              })
            }>
            <View>
              <Pdf
                source={{
                  uri: item.pdf_url,
                  cache: false,
                }}
                style={StyleSheet.flatten([
                  styles.youtubecontainer,
                  {
                    flex: 1,
                    width: sizeWidth(80),
                    height: 185,
                  },
                ])}
                fitWidth
                fitPolicy={0}
                enablePaging
                scale={1}
              />
              {selectedFilterTitle !== '' &&
              selectedFilterTitle !== 'All' &&
              selectedFilterTitle !== 'Videos' &&
              selectedFilterTitle !== 'PDF' ? (
                <Subtitle
                  styleName="v-start h-start"
                  numberOfLines={1}
                  style={styles.itemtextSubtitle}>
                  {Helper.replacetext(selectedFilterTitle)}
                </Subtitle>
              ) : null}
              <Title
                styleName="v-start h-start"
                numberOfLines={2}
                style={styles.itemtext}>{`${item.header}`}</Title>
              <View styleName="horizontal v-center" style={{marginBottom: 8}}>
                <TouchableWithoutFeedback
                  onPress={() => this.itemshare(item, 2)}>
                  <View style={styles.circle1}>
                    <IconChooser
                      name="whatsapp"
                      size={18}
                      color={'white'}
                      iconType={2}
                      style={styles.icon}
                    />
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() =>Helper.downloadFile(item.pdf_url,'',)}>
                  <View
                    style={StyleSheet.flatten([
                      styles.circle1,
                      {
                        backgroundColor: '#e8e5d7',
                        marginStart: 12,
                      },
                    ])}>
                    <IconChooser
                      name="download"
                      size={18}
                      color={'#97948c'}
                      iconType={2}
                      style={styles.icon}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    ) : null;
  }

  filterSelect = (title, fileType) => {
    const {cloneList} = this.state;
    let sort = [];
    if (title === 'All') {
      sort = cloneList;
    } else {
      sort = Lodash.filter(cloneList, (kok) =>
        fileType === 0
          ? kok.link !== ''
          : fileType === 1
          ? kok.link === ''
          : kok.product_name === title,
      );
    }
    sort = Lodash.sortBy(sort, ['link']).reverse();
    this.setState({
      dataList: sort,
      showFilter: false,
      fileType: fileType,
      selectedFilterTitle: title,
    });
  };

  onLayout = (event) => {
    const {width, height} = event.nativeEvent.layout;
    this.setState({height: height});
  };

  renderFilterItem = (item) => {
    return (
      <View style={{justifyContent: 'center'}}>
        <TouchableWithoutFeedback
          onPress={() =>
            this.filterSelect(
              item.name,
              item.name === 'Videos' ? 0 : item.name === 'PDF' ? 1 : 2,
            )
          }>
          <Title
            style={StyleSheet.flatten([
              styles.passText,
              {
                color: '#555',
                fontSize: 14,
                paddingVertical: 0,
                alignSelf: 'center',
                fontWeight: '400',
                lineHeight: 20,
              },
            ])}>
            {Helper.replacetext(item.name)}
          </Title>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  render() {
    const {showFilter} = this.state;
    return (
      <CScreen
        refresh={() => this.fetchData()}
        absolute={
          <>
            <Modal
              visible={this.state.modalVisible}
              setModalVisible={() =>
                this.setState({modalPdfUrl: '', modalVisible: false})
              }
              ratioHeight={0.87}
              backgroundColor={`white`}
              topCenterElement={
                <Subtitle
                  style={{
                    color: '#292929',
                    fontSize: 17,
                    fontWeight: '700',
                    letterSpacing: 1,
                  }}>
                  {``}
                </Subtitle>
              }
              children={
                <View
                  style={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'white',
                  }}>
                  <Pdf
                    source={{
                      uri: this.state.modalPdfUrl,
                      cache: true,
                    }}
                    style={{
                      flex: 1,
                      width: '100%',
                      height: '100%',
                    }}
                    fitWidth
                    fitPolicy={0}
                    enablePaging
                    scale={1}
                  />
                </View>
              }
            />
          </>
        }
        body={
          <>
            <LeftHeaders
              showBack
              title={Helper.getScreenName(this.props)}
              // bottomtext={
              //   <>
              //     {`FinTrain `}
              //     <Title style={styles.passText}>{`Learning`}</Title>
              //   </>
              // }
              bottomtextStyle={{
                color: '#555555',
                fontSize: 20,
              }}
            />
            <View styleName="horizontal v-end h-end md-gutter">
              <TouchableWithoutFeedback
                onPress={() => this.setState({showFilter: !showFilter})}
                onLayout={this.onLayout}>
                <Title
                  style={StyleSheet.flatten([
                    styles.passText,
                    {
                      color: '#82b9f4',
                      fontSize: 16,
                      lineHeight: 20,
                      paddingVertical: 0,
                    },
                  ])}>
                  {`Filter by `}
                  <IconChooser
                    name={showFilter ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={'#82b9f4'}
                    style={{
                      alignSelf: 'center',
                      justifyContent: 'center',
                    }}
                  />
                </Title>
              </TouchableWithoutFeedback>
            </View>

            {showFilter ? (
              <View
                styleName="vertical md-gutter"
                style={StyleSheet.flatten([
                  styles.filtercont,
                  {
                    top: sizeHeight(14) + this.state.height,
                  },
                ])}>
                <FlatList
                  data={this.state.categoryList}
                  renderItem={({item, index}) => this.renderFilterItem(item)}
                  keyExtractor={(_item, index) => `${index}`}
                  showsVerticalScrollIndicator={true}
                  showsHorizontalScrollIndicator={false}
                  extraData={this.state}
                  style={{maxHeight: 200}}
                  nestedScrollEnabled
                  ItemSeparatorComponent={() => (
                    <View
                      style={{
                        marginVertical: 6,
                        height: 1,
                        width: '100%',
                        backgroundColor: '#e4cbcb',
                      }}></View>
                  )}
                />
              </View>
            ) : null}

            {this.state.loading ? (
              <View style={styles.loader}>
                <ActivityIndicator />
              </View>
            ) : this.state.dataList.length > 0 ? (
              <FlatList
                data={this.state.dataList}
                renderItem={({item}) => this.renderItems(item)}
                nestedScrollEnabled={true}
                keyExtractor={(item, index) => `${index}`}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={false}
                extraData={this.state}
              />
            ) : (
              <View style={styles.emptycont}>
                <ListError subtitle={'No Training modules found...'} />
              </View>
            )}
          </>
        }></CScreen>
    );
  }
}

const styles = StyleSheet.create({
  youtubecontainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 8,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  pdfbg: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 8,
    alignItems: 'center',
    marginHorizontal: 12,
    backgroundColor: '#ecebdf',
    width: '90%',
    height: 130,
    marginBottom: 10,
  },
  pdf: {
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 4,
  },
  topfilterIcon: {
    position: 'absolute',
    top: 0,
    zIndex: 99,
    right: sizeWidth(13),
    top: sizeHeight(30.2),
    backgroundColor: 'white',
  },
  filtercont: {
    position: 'absolute',
    zIndex: 99,
    borderColor: '#dbdacd',
    borderWidth: 0.8,
    backgroundColor: Pref.WHITE,
    width: '36%',
    //top:56,
    right: sizeWidth(4),
    borderRadius: 8,
    //top: sizeHeight(17),
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    }),
  },
  emptycont: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginVertical: 48,
    paddingVertical: 56,
  },
  loader: {
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 1,
    marginVertical: 48,
    paddingVertical: 48,
  },
  itemContainer: {
    marginVertical: 10,
    borderColor: '#bcbaa1',
    borderWidth: 0.8,
    borderRadius: 16,
    marginHorizontal: 16,
  },
  itemtext: {
    letterSpacing: 0.5,
    fontWeight: '700',
    lineHeight: 20,
    // alignSelf: 'center',
    // justifyContent: 'center',
    // textAlign: 'center',
    color: '#292929',
    fontSize: 16,
    marginStart: 16,
    marginEnd: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingBottom: 12,
  },
  itemtextSubtitle: {
    letterSpacing: 0.5,
    fontWeight: '400',
    lineHeight: 20,
    // alignSelf: 'center',
    // justifyContent: 'center',
    // textAlign: 'center',
    color: '#686868',
    fontSize: 15,
    marginStart: 16,
    marginEnd: 16,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'center',
    fontWeight: '400',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Rubik',
    letterSpacing: 1,
    color: '#292929',
    alignSelf: 'flex-start',
    fontWeight: '700',
  },
  passText: {
    fontSize: 20,
    letterSpacing: 0.5,
    color: Pref.RED,
    fontWeight: '700',
    lineHeight: 36,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingVertical: 16,
    marginBottom: 12,
  },
  circle: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 4,
    borderRadius: 64 / 2,
    borderColor: '#d7d6c7',
    borderStyle: 'solid',
    borderWidth: 2,
  },
  circle1: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 6,
    borderRadius: 36 / 2,
    //borderColor: '#000',
    //borderStyle: 'solid',
    //borderWidth: 3,
    backgroundColor: '#1bd741',
    marginStart: 8,
  },
  icon: {
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
});
