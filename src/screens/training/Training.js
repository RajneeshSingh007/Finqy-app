import React from 'react';
import {
  StyleSheet,
  FlatList,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import {Title, View} from '@shoutem/ui';
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
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({loading: true});
    });
    this.focusListener = navigation.addListener('didFocus', () => {
      Pref.getVal(Pref.userData, userData => {
        this.setState({userData: userData});
        Pref.getVal(Pref.saveToken, value => {
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
      result => {
        const {data, response_header} = result;
        //console.log('resultx', result);
        const {res_type} = response_header;
        if (res_type === `success`) {
          const {categoryList} = this.state;
          categoryList.push({name: `All`, selected: true});
          categoryList.push({name: `PDF`, selected: false});
          categoryList.push({name: `Videos`, selected: false});
          //https://www.youtube.com/embed/GegDvKYZ1rA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture
          const catlist = Lodash.map(data, io => {
            const {product_name, link} = io;
            const find = Lodash.find(
              categoryList,
              ui => ui.name === product_name,
            );
            if (find === undefined) {
              categoryList.push({
                name: product_name,
                selected: false,
              });
            }
            if (link.includes(`embed`)) {
              //https://www.youtube.com/watch?v=GegDvKYZ1rA
              const sp = link.split('/');
              const id = sp[4];
              if (!id.includes(`frameborder`)) {
                io.link = `https://www.youtube.com/watch?v=${id.trim()}`;
              } else {
                let agsp = id.split('frameborder');
                const idx = agsp[0]
                  .replace('"/', '')
                  .replace('"', '')
                  .trim();
                io.link = `https://www.youtube.com/watch?v=${idx}`;
              }
            }
            return io;
          });
          //categoryList.push({ name: `Download`, selected: false });
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
      io => io.name === `Download` && io.selected === true,
    );
    return find === undefined ? false : true;
  };

  /**
   *
   * @param {*} item
   * @param {*} mode
   */
  itemshare = (item, mode) => {
    const videoId =
      item.link !== undefined && item.link !== '' && item.link.includes('?')
        ? item.link.split('?')[1].replace('v=', '')
        : '';
    const url =
      mode === 1
        ? `https://www.youtube.com/watch?v=${videoId}`
        : `${Pref.MainUrl}/erevbay_admin/${item.product_name}/${item.pdf_file}`;
    const title = 'Finpro';
    //const message = `https://erb.ai/corporate_tool/refer_offer.php?offer_id=${id}`;
    const message = ``;
    const options = Platform.select({
      ios: {
        activityItemSources: [
          {
            placeholderItem: {type: 'url', content: url},
            item: {
              default: {type: 'url', content: url},
            },
            subject: {
              default: title,
            },
            linkMetadata: {originalUrl: url, url, title},
          },
          {
            placeholderItem: {type: 'text', content: message},
            item: {
              default: {type: 'text', content: message},
              message: null, // Specify no text to share via Messages app.
            },
          },
        ],
      },
      default: {
        title,
        subject: title,
        url: url,
        message: message,
      },
    });
    Share.open(options);
  };

  /**
   *
   * @param {*} item
   * @param {*} index
   */
  renderItems(item) {
    //console.log('link', item.link)
    const videoid =
      item.link !== undefined && item.link !== '' && item.link.includes('?')
        ? item.link.split('?')[1].replace('v=', '')
        : '';
    const {fileType} = this.state;
    return item.link !== '' &&
      !item.link.includes('.png') &&
      !item.link.includes('.jpeg') &&
      !item.link.includes('.jpg') &&
      (fileType === 0 || fileType === 2) ? (
      <View styleName="sm-gutter">
        <View styleName="vertical" style={styles.itemContainer}>
          <View
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: 8,
              alignItems: 'center',
              marginHorizontal: 12,
            }}>
            <YoutubePlayer
              height={185}
              width={sizeWidth(80)}
              videoId={videoid}
              allowWebViewZoom={false}
            />
          </View>
          <Title
            styleName="v-start h-start"
            numberOfLines={1}
            style={styles.itemtext}>{`${item.header}`}</Title>
          <View
            styleName="horizontal v-center h-center space-between"
            style={{marginBottom: 8}}>
            <TouchableWithoutFeedback onPress={() => this.itemshare(item, 1)}>
              <View style={styles.circle1}>
                <IconChooser
                  name="whatsapp"
                  size={20}
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
              Helper.downloadFile(
                `${Pref.MainUrl}/erevbay_admin/${item.product_name}/${item.pdf_file}`,
                '',
              )
            }>
            <View>
              <View style={styles.pdfbg}>
                <View style={styles.circle}>
                  {/* {item.link !== '' && item.link.includes('.png') || item.link.includes('.jpeg') || item.link.includes('.jpg') ? <Image source={{ uri: `${item.link}` }} styleName='medium' style={styles.pdf} /> : */}
                  <IconChooser
                    name={`file-pdf`}
                    size={32}
                    iconType={5}
                    style={styles.pdf}
                    color={'#8a8a87'}
                  />
                  {/* } */}
                </View>
              </View>
              <Title
                styleName="v-start h-start"
                numberOfLines={1}
                style={styles.itemtext}>{`${item.header}`}</Title>
              <View
                styleName="horizontal v-center h-center space-between"
                style={{marginBottom: 8}}>
                <TouchableWithoutFeedback
                  onPress={() => this.itemshare(item, 2)}>
                  <View style={styles.circle1}>
                    <IconChooser
                      name="whatsapp"
                      size={20}
                      color={'white'}
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
      sort = Lodash.filter(cloneList, kok =>
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
    });
  };

  onLayout = event => {
    const {width, height} = event.nativeEvent.layout;
    this.setState({height: height});
  };

  replacetext = title => {
    return Lodash.upperFirst(title.replace(/_/g, ' '));
  };

  renderFilterItem = item => {
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
            {this.replacetext(item.name)}
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
        body={
          <>
            <LeftHeaders
              showBack
              title={'FinTrain Learning'}
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
                {/* <TouchableWithoutFeedback
                  onPress={() => this.chipclick({ name: 'All' }, 2)}>
                  <Title
                    style={StyleSheet.flatten([
                      styles.passText,
                      {
                        color: '#6e6852',
                        fontSize: 16,
                        lineHeight: 20,
                        paddingVertical: 0,
                      },
                    ])}>
                    {`All`}
                  </Title>
                </TouchableWithoutFeedback>
                <View
                  style={{
                    marginTop: 4,
                    height: 1,
                    width: '100%',
                    backgroundColor: '#e4cbcb',
                  }}></View>
                <TouchableWithoutFeedback
                  onPress={() => this.chipclick({ name: 'Video' }, 0)}>
                  <Title
                    style={StyleSheet.flatten([
                      styles.passText,
                      {
                        marginTop: 10,
                        color: '#6e6852',
                        fontSize: 16,
                        lineHeight: 20,
                        paddingVertical: 0,
                      },
                    ])}>
                    {`Video`}
                  </Title>
                </TouchableWithoutFeedback>
                <View
                  style={{
                    marginTop: 4,
                    height: 1,
                    width: '100%',
                    backgroundColor: '#e4cbcb',
                  }}></View>
                <TouchableWithoutFeedback
                  onPress={() => this.chipclick({ name: 'Download' }, 1)}>
                  <Title
                    style={StyleSheet.flatten([
                      styles.passText,
                      {
                        marginTop: 16,
                        color: '#6e6852',
                        fontSize: 16,
                        lineHeight: 20,
                        paddingVertical: 0,
                        marginBottom: -2,
                      },
                    ])}>
                    {`PDF`}
                  </Title>
                </TouchableWithoutFeedback> */}
              </View>
            ) : null}

            {/* <View style={styles.topfilterIcon}>
              <IconChooser name={'chevron-up'} size={28} color={'#dbdacd'} />
            </View> */}

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
                <ListError subtitle={'No training modules found...'} />
              </View>
            )}
          </>
        }></CScreen>
    );
  }
}

const styles = StyleSheet.create({
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
    color: '#686868',
    fontSize: 16,
    marginStart: 16,
    marginEnd: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingBottom: 12,
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
    borderRadius: 16,
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
