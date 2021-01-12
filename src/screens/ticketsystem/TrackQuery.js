import React from 'react';
import {
  StyleSheet,
  BackHandler,
  TouchableWithoutFeedback,
  Text,
  FlatList,
} from 'react-native';
import {Title, View, Html, Subtitle, Image} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {
  ActivityIndicator,
  Button,
  Portal,
  RadioButton,
  Avatar,
  FAB,
} from 'react-native-paper';
import {sizeHeight} from '../../util/Size';
import Lodash from 'lodash';
import LeftHeaders from '../common/CommonLeftHeader';
import ListError from '../common/ListError';
import CommonTable from '../common/CommonTable';
import IconChooser from '../common/IconChooser';
import CScreen from './../component/CScreen';
import moment from 'moment';
import NavigationActions from '../../util/NavigationActions';
import Modal from '../../util/Modal';
import NewDropDown from '../component/NewDropDown';
import CustomForm from '../finorbit/CustomForm';
import Loader from '../../util/Loader';
import Timeline from 'react-native-timeline-flatlist';

const regex = /(<([^>]+)>)/gi;

export default class TrackQuery extends React.PureComponent {
  constructor(props) {
    super(props);
    const date = new Date();
    this.backclick = this.backclick.bind(this);
    // this.submitTicketEdit = this.submitTicketEdit.bind(this);
    this.detailThread = this.detailThread.bind(this);
    this.renderDetail = this.renderDetail.bind(this);
    this.filterClicked = this.filterClicked.bind(this);
    this.filterButtonClicked = this.filterButtonClicked.bind(this);
    this.resetFilter = this.resetFilter.bind(this);
    this.state = {
      loader: false,
      dataList: [],
      loading: true,
      showCalendar: false,
      currentDate: date,
      dates: '',
      token: '',
      userData: null,
      tableHead: [
        'Sr. No.',
        'Date',
        'Ticket Number',
        'Ticket Issue',
        'Priority',
        'Status',
        'Remark',
        '',
      ],
      widthArr: [60, 100, 120, 120, 70, 70, 200, 60],
      cloneList: [],
      modalvis: false,
      pdfurl: '',
      pdfTitle: '',
      quotemodalVis: false,
      quotemailData: '',
      quotemail: '',
      type: '',
      itemSize: 5,
      disableNext: false,
      disableBack: false,
      searchQuery: '',
      enableSearch: false,
      orderBy: 'asc',
      fileName: '',
      remark: '',
      status: '',
      showModal: false,
      editItem: null,
      threadList: [],
      detailShow: false,
      threadLoader: false,
      filterModal: false,
      statusFilter: '',
      priorityFilter: '',
      ticketTypeFilter: '',
      originalList: [],
      priorityList: [],
      statusList: [],
      profilePic: null,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backclick);
    const {navigation} = this.props;
    this.willfocusListener = navigation.addListener('willFocus', () => {
      this.setState({
        loading: true,
        dataList: [],
        modalvis: false,
        detailShow: false,
      });
    });
    //this.focusListener = navigation.addListener('didFocus', () => {
    Pref.getVal(Pref.userData, userData => {
      this.fetchData(userData);
    });
    //});

    
  }

  backclick = () => {
    const {modalvis, detailShow} = this.state;

    if (modalvis === true) {
      this.setState({modalvis: false, pdfurl: ''});
      return true;
    } else if (detailShow === true) {
      this.setState({detailShow: false, threadList: [], threadLoader: false});
      return true;
    }
    NavigationActions.goBack();
    //console.log('back',modalvis, detailShow);
    return false;
  };

  componentWillUnMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backclick);
    if (this.focusListener !== undefined) this.focusListener.remove();
    if (this.willfocusListener !== undefined) this.willfocusListener.remove();
  }

  fetchData = userData => {
    if (
      Helper.nullCheck(userData) === false &&
      Helper.nullCheck(userData.rcontact) === true
    ) {
      userData.rcontact = userData.mobile;
    }
    const {rcontact, user_prof} = userData;
    let profilePic =
      user_prof === undefined ||
      user_prof === null ||
      user_prof === '' ||
      (!user_prof.includes('.jpg') &&
        !user_prof.includes('.jpeg') &&
        !user_prof.includes('.png'))
        ? null
        : {uri: decodeURIComponent(user_prof)};

    const body = JSON.stringify({
      mobile: rcontact,
    });
    Helper.networkHelperTokenPost(
      Pref.TICKETS_LIST_URL,
      body,
      Pref.methodPost,
      '',
      result => {
        const {tickets, status} = result;
        //console.log('result', result)
        if (status === `success`) {
          if (tickets.length > 0) {
            // const sorting = tickets.sort((a, b) => {
            //   const sp = a.updated_at.split('-');
            //   const spz = b.updated_at.split('-');
            //   return (
            //     Number(sp[2]) - Number(spz[2]) ||
            //     Number(sp[1]) - Number(spz[1]) ||
            //     Number(sp[0]) - Number(spz[0])
            //   );
            // });
            const sort = Lodash.filter(
              tickets,
              io => io.SCode.toLowerCase() === 'open',
            );
            const {itemSize} = this.state;
            this.setState({
              originalList: tickets,
              cloneList: sort,
              dataList: this.returnData(sort, 0, sort.length).slice(
                0,
                itemSize,
              ),
              loading: false,
              itemSize: sort.length >= 5 ? 5 : sort.length,
              userData: userData,
              profilePic: profilePic,
            });
          } else {
            this.setState({
              loading: false,
              userData: userData,
              profilePic: profilePic,
            });
          }
        } else {
          this.setState({
            loading: false,
            userData: userData,
            profilePic: profilePic,
          });
        }
      },
      e => {
        this.setState({
          loading: false,
          userData: userData,
          profilePic: profilePic,
        });
      },
    );
  };

  editQuery = item => {
    NavigationActions.navigate('RaiseQueryForm', {data: item, editmode: true});
    // const {SCode, message} = item;
    // console.log('item', item);
    // let remark = '';
    // if (Helper.nullStringCheck(message) === false) {
    //   if (message.includes(',')) {
    //     const spl = message.split(',');
    //     remark = spl[0];
    //   } else {
    //     remark = message;
    //   }
    // }
    // this.setState({
    //   showModal: true,
    //   editItem: item,
    //   status: Lodash.capitalize(SCode),
    //   remark: '',
    // });
  };

  /**
   *
   * @param {*} data
   */
  returnData = (sort, start = 0, end) => {
    const dataList = [];
    if (sort.length > 0) {
      if (start >= 0) {
        for (let i = start; i < end; i++) {
          const item = sort[i];
          if (item !== undefined && item !== null) {
            const rowData = [];
            rowData.push(`${Number(i + 1)}`);
            const format = moment(item.updated_at).format('DD-MM-YYYY');
            rowData.push(format);
            rowData.push(item.ticket_id);
            rowData.push(Lodash.capitalize(item.TCode));
            const statusText = (value, color) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View>
                  <Title
                    style={StyleSheet.flatten([
                      styles.itemtext,
                      {
                        color: color || Pref.RED,
                      },
                    ])}>
                    {Lodash.capitalize(value)}
                  </Title>
                </View>
              </View>
            );
            rowData.push(statusText(item.Pcode, item.PColor));

            rowData.push(statusText(item.SCode, item.SColor));

            const msg =
              item.message !== null && item.message !== '' ? item.message : '';
            let finalMsg = '';
            if (Helper.separatorReg(msg)) {
              const split = msg.split(',');
              finalMsg = split.length > 1 ? split[split.length - 1] : '';
            } else {
              finalMsg = '';
            }
            finalMsg = finalMsg.replace(regex, '');

            rowData.push(
              Lodash.capitalize(
                Lodash.truncate(finalMsg, {
                  length: 46,
                  separator: '...',
                }),
              ),
            );

            const editView = value => (
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableWithoutFeedback onPress={() => this.editQuery(value)}>
                  <View>
                    <IconChooser name={`edit-2`} size={20} color={`#9f9880`} />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            );

            rowData.push(item.replied === '0' ? editView(item) : '');

            rowData.push(item.ticket_id);
            let finalMsg1 = '';
            if (Helper.separatorReg(msg)) {
              const split = msg.split(',');
              finalMsg1 = split[0];
            } else {
              finalMsg1 = msg;
            }
            finalMsg1 = finalMsg1.replace(regex, '');
            rowData.push(finalMsg1);
            rowData.push(item.updated_at);
            rowData.push(item.SColor);
            rowData.push(item.PColor);
            dataList.push(rowData);
          }
        }
      }
    }
    return dataList;
  };

  detailThread = editItem => {
    //console.log('editItem', editItem);
    const {profilePic, originalList} = this.state;
    const ticketId = Number(editItem[editItem.length - 5]);
    if (ticketId) {
      const findItem = Lodash.find(originalList, io => io.ticket_id === `${ticketId}`);
      //console.log('findItem', findItem);
      this.setState({threadLoader: true, detailShow: true, editItem: findItem});
      const url = `${Pref.UVDESK_THREAD_LIST}?ticketId=${ticketId}`;
      let fileList = [];
      if (Helper.nullStringCheck(findItem.filepath) === false) {
        const filesList = findItem.filepath.split(',');
        fileList = filesList.map(io => {
          return {
            path:`${Pref.UVDESK_IMAGE_URL}${io}`
          }
        });
      }
      //console.log('url', url);
      const startObj = {
        circleColor: editItem[editItem.length - 2],
        lineColor: editItem[editItem.length - 1],
        time: editItem[editItem.length - 3],
        description: editItem[editItem.length - 4],
        userType: 'customer',
        threadType: 'created',
        title: 'You',
        imageUrl:
          profilePic == null
            ? require('../../res/images/account.png')
            : profilePic,
        fileList: fileList,
      };
      //console.log('startObj', startObj)
      Helper.networkHelperHelpDeskTicketGet(
        url,
        null,
        Pref.methodGet,
        Pref.UVDESK_API,
        result => {
          //console.log('result1', result);
          const {success, thread} = result;
          let threadList = [];
          let priorityList = [];
          let statusList = [];
          if (thread.length > 0) {
            const {ticket_status, ticket_priority, priority, status} = result;
            priorityList = priority;
            statusList = status;
            const colorCodeStatus = Lodash.find(
              status,
              io => io.id === ticket_status,
            ).colorCode;
            const colorCodePriority = Lodash.find(
              priority,
              io => io.id === ticket_priority,
            ).colorCode;
            thread.forEach(element => {
              const {
                formatedCreatedAt,
                userType,
                reply,
                threadType,
                fullname,
                attachments
              } = element;
              threadList.push({
                circleColor: colorCodeStatus,
                lineColor: colorCodePriority,
                time: formatedCreatedAt,
                description: reply.replace(regex, ''),
                userType: userType,
                threadType: threadType,
                title: userType != 'customer' ? 'Agent' : 'You',
                imageUrl:
                  userType != 'customer'
                    ? require('../../res/images/timelineagent.png')
                    : profilePic == null
                    ? require('../../res/images/account.png')
                    : profilePic,
                fileList: attachments,
              });
            });
          }
          threadList.push(startObj);
          this.setState({
            threadList: threadList,
            detailShow: true,
            threadLoader: false,
            priorityList: priorityList,
            statusList: statusList,
          });
        },
        e => {
          this.setState({threadList: [], threadLoader: false});
        },
      );
    } else {
    }
  };

  /**
   *
   * @param {*} mode true ? next : back
   */
  pagination = mode => {
    const {itemSize, cloneList} = this.state;
    let clone = JSON.parse(JSON.stringify(cloneList));
    let plus = itemSize;
    let slicedArray = [];
    if (mode) {
      plus += 5;
      if (itemSize < clone.length) {
        if (plus > clone.length) {
          const rem = clone.length - itemSize;
          plus = itemSize + rem;
        }
        slicedArray = this.returnData(clone, itemSize, plus);
        this.setState({dataList: slicedArray, itemSize: plus});
      }
    } else {
      if (itemSize <= 5) {
        plus = 0;
      } else {
        plus -= 5;
      }
      if (plus >= 0 && plus < clone.length) {
        slicedArray = this.returnData(clone, plus, itemSize);
        if (slicedArray.length > 0) {
          this.setState({dataList: slicedArray, itemSize: plus});
        }
      }
    }
  };

  revertBack = () => {
    const {enableSearch} = this.state;
    const {cloneList} = this.state;
    if (enableSearch === true && cloneList.length > 0) {
      const clone = JSON.parse(JSON.stringify(cloneList));
      const data = this.returnData(clone, 0, 5);
      this.setState({dataList: data});
    }
    this.setState({searchQuery: '', enableSearch: !enableSearch, itemSize: 5});
  };

  // submitTicketEdit = () => {
  //   const {remark, status, userData, editItem} = this.state;
  //   if (Helper.nullCheck(editItem) === true) {
  //     alert('Failed to find ticket');
  //     return false;
  //   } else if (Helper.nullStringCheck(remark) === true) {
  //     alert('Remark empty');
  //     return false;
  //   }
  //   this.setState({loader: true, showModal: false});
  //   const {email} = userData;
  //   const {ticket_id} = editItem;
  //   const ticketID = Number(ticket_id);
  //   const threadBody = JSON.stringify({
  //     message: remark,
  //     actAsType: 'customer',
  //     actAsEmail: email,
  //     threadType: 'reply',
  //     source: 'app',
  //     status: String(status)
  //       .trim()
  //       .toLowerCase(),
  //     createdBy: 'customer',
  //   });
  //   //console.log('threadBody',userData,  threadBody);

  //   Helper.networkHelperHelpDeskTicket(
  //     `${Pref.UVDESK_ASSIGN_AGENT}${ticketID}/thread`,
  //     threadBody,
  //     Pref.methodPost,
  //     Pref.UVDESK_API,
  //     result => {
  //       this.setState({loader: false});
  //       if (result.success.includes('success')) {
  //         this.fetchData(this.state.userData);
  //         Helper.showToastMessage('Ticket updated successfully', 1);
  //       } else {
  //         Helper.showToastMessage(`Failed to update ticket`, 0);
  //       }
  //     },
  //     e => {
  //       this.setState({loader: false});
  //       Helper.showToastMessage(`Something went wrong`, 0);
  //     },
  //   );
  // };

  renderDetail = (rowData, sectionID, rowID) => {
    return (
      <View styleName="vertical" style={styles.mainTcontainer}>
        <View style={styles.timelineContainer}>
          <Avatar.Image
            size={36}
            source={rowData.imageUrl}
            style={{
              backgroundColor: 'transparent',
              marginEnd: 8,
            }}
          />
          <Title style={styles.timelinetitle}>{rowData.title}</Title>
        </View>
        <View
            style={{
              flexDirection: 'column',
              flexShrink: 1,
              marginVertical:2
            }}>
            <Subtitle style={styles.timelinedesc}>
              {rowData.description}
            </Subtitle>
          </View>

        {rowData.fileList.length > 0 ? (
          <FlatList
            style={{
              marginTop:8
            }}
            data={rowData.fileList}
            numColumns={2}
            keyExtractor={({item, index}) => `${index}`}
            renderItem={({item, index}) => {
              if(item.path.includes('.pdf')){
                return <TouchableWithoutFeedback>
                <View styleName="horizontal v-center h-center">
                  <IconChooser
                    name={'file-pdf'}
                    size={36}
                    color={'#555555'}
                    iconType={5}
                    style={{marginHorizontal:2}}
                  />
                </View>
                </TouchableWithoutFeedback>
              }
              return (
                
                <TouchableWithoutFeedback>
                  <Image styleName="small" source={{uri: item.path, cache:false}} style={{marginHorizontal:2}} />
                </TouchableWithoutFeedback>
              );
            }}
          />
        ) : null}
      </View>
    );
  };

  filterClicked = () => {
    this.setState({filterModal: true});
  };

  resetFilter = () => {
    const {originalList} = this.state;
    const sorting = originalList.sort((a, b) => {
      const sp = a.updated_at.split('-');
      const spz = b.updated_at.split('-');
      return (
        Number(sp[2]) - Number(spz[2]) ||
        Number(sp[1]) - Number(spz[1]) ||
        Number(sp[0]) - Number(spz[0])
      );
    });
    const filterData = Lodash.filter(
      sorting,
      io => io.SCode.toLowerCase() === 'open',
    );
    this.setState({
      dataList: this.returnData(filterData, 0, filterData.length).slice(0, 5),
      loading: false,
      filterModal: false,
      itemSize: filterData.length >= 5 ? 5 : filterData.length,
      priorityFilter: '',
      statusFilter: '',
      ticketTypeFilter: '',
    });
  };

  filterButtonClicked = () => {
    this.setState({loading: true});
    const {
      priorityFilter,
      statusFilter,
      ticketTypeFilter,
      originalList,
    } = this.state;
    const filterData = Lodash.filter(originalList, io => {
      const {TCode, Pcode, SCode} = io;
      if (
        ticketTypeFilter != '' &&
        statusFilter != '' &&
        priorityFilter != ''
      ) {
        return (
          ticketTypeFilter.toLowerCase() === TCode.toLowerCase() &&
          priorityFilter.toLowerCase() === Pcode.toLowerCase() &&
          statusFilter.toLowerCase() === SCode.toLowerCase()
        );
      } else if (ticketTypeFilter != '' && statusFilter != '') {
        return (
          ticketTypeFilter.toLowerCase() === TCode.toLowerCase() &&
          statusFilter.toLowerCase() === SCode.toLowerCase()
        );
      } else if (ticketTypeFilter != '' && priorityFilter != '') {
        return (
          ticketTypeFilter.toLowerCase() === TCode.toLowerCase() &&
          priorityFilter.toLowerCase() === Pcode.toLowerCase()
        );
      } else if (ticketTypeFilter != '') {
        return ticketTypeFilter.toLowerCase() === TCode.toLowerCase();
      } else if (statusFilter != '') {
        return statusFilter.toLowerCase() === SCode.toLowerCase();
      } else if (priorityFilter != '') {
        return priorityFilter.toLowerCase() === Pcode.toLowerCase();
      } else {
        return io;
      }
    });
    this.setState({
      dataList: this.returnData(filterData, 0, filterData.length).slice(0, 5),
      loading: false,
      filterModal: false,
      itemSize: filterData.length >= 5 ? 5 : filterData.length,
    });
  };

  render() {
    const {detailShow,editItem} = this.state;
    return (
      <CScreen
        refresh={() => this.fetchData(this.state.userData)}
        absolute={
          <>
            {detailShow === true ? (
              <Portal>
                <View style={{flex: 1, backgroundColor: 'white'}}>
                  <LeftHeaders
                    showBack
                    title={'Ticket Detail'}
                    backClicked={() =>
                      this.setState({
                        detailShow: false,
                        threadList: [],
                        threadLoader: false,
                      })
                    }
                  />
                  {this.state.threadLoader ? (
                    <View style={styles.loader}>
                      <ActivityIndicator />
                    </View>
                  ) : this.state.threadList.length > 0 ? (
                    <>
                      <Timeline
                        style={{
                          flex: 0.87,
                          marginHorizontal: 8,
                          marginTop: 8,
                        }}
                        data={this.state.threadList}
                        circleSize={16}
                        circleColor="#6d6a57"
                        lineColor="#ecebec"
                        timeContainerStyle={{minWidth: 24}}
                        timeStyle={{
                          textAlign: 'center',
                          backgroundColor: '#555',
                          padding: 7,
                          borderRadius: 16,
                          overflow: 'hidden',
                          color: 'white',
                          fontSize: 14,
                        }}
                        renderDetail={this.renderDetail}
                        columnFormat="two-column"
                        separator={false}
                      />
                      {editItem.replied === "0" ? 
                      <FAB
                        style={styles.fab}
                        icon={'pencil'}
                        onPress={() => this.editQuery(this.state.editItem)}
                      /> : null}
                    </>
                  ) : (
                    <View style={styles.emptycont}>
                      <ListError subtitle={'No details Found...'} />
                    </View>
                  )}
                </View>
              </Portal>
            ) : null}
            <Loader isShow={this.state.loader} />
            {/* <Modal
              visible={this.state.showModal}
              setModalVisible={() =>
                this.setState({
                  showModal: false,
                })
              }
              ratioHeight={0.8}
              backgroundColor={`white`}
              topCenterElement={
                <Subtitle
                  style={{
                    color: '#292929',
                    fontSize: 17,
                    fontWeight: '700',
                    letterSpacing: 1,
                  }}>
                  {`Edit Ticket`}
                </Subtitle>
              }
              topRightElement={null}
              children={
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'white',
                  }}>
                  <View style={styles.radiocont}>
                    <View style={styles.radiodownbox}>
                      <Title style={styles.bbstyle}>{`Select Status`}</Title>

                      <RadioButton.Group
                        onValueChange={value => {
                          if (value === 'Closed') {
                            this.setState({status: value});
                          } else {
                            alert('Ticket is already open');
                          }
                        }}
                        value={this.state.status}>
                        <View styleName="horizontal" style={{marginBottom: 8}}>
                          <View
                            styleName="horizontal"
                            style={{alignSelf: 'center', alignItems: 'center'}}>
                            <RadioButton
                              value="Open"
                              style={{alignSelf: 'center'}}
                            />
                            <Title
                              styleName="v-center h-center"
                              style={styles.textopen}>{`Open`}</Title>
                          </View>
                          <View
                            styleName="horizontal"
                            style={{alignSelf: 'center', alignItems: 'center'}}>
                            <RadioButton
                              value="Closed"
                              style={{alignSelf: 'center'}}
                            />
                            <Title
                              styleName="v-center h-center"
                              style={styles.textopen}>{`Close`}</Title>
                          </View>
                        </View>
                      </RadioButton.Group>
                    </View>
                  </View>

                  <CustomForm
                    label={`Remark *`}
                    placeholder={`Remark`}
                    value={this.state.remark}
                    onChange={v => this.setState({remark: v})}
                    keyboardType={'text'}
                    style={{marginHorizontal: 12}}
                  />

                  <Button
                    mode={'flat'}
                    uppercase={false}
                    dark={true}
                    loading={false}
                    style={styles.loginButtonStyle}
                    onPress={this.submitTicketEdit}>
                    <Title style={styles.btntext}>{`Submit`}</Title>
                  </Button>
                </View>
              }
            /> */}

            <Modal
              visible={this.state.filterModal}
              setModalVisible={() =>
                this.setState({
                  filterModal: false,
                })
              }
              ratioHeight={0.65}
              backgroundColor={`white`}
              centerFlex={0.2}
              rightFlex={0.3}
              centerFlex={0.5}
              topCenterElement={
                <Subtitle
                  style={{
                    color: '#292929',
                    fontSize: 17,
                    fontWeight: '700',
                    letterSpacing: 1,
                  }}>
                  {`Filter Tickets`}
                </Subtitle>
              }
              topRightElement={
                <TouchableWithoutFeedback onPress={this.resetFilter}>
                  <Subtitle
                    style={{
                      color: '#0270e3',
                      fontSize: 14,
                      fontWeight: '700',
                      letterSpacing: 0.5,
                    }}>
                    {`Clear Filter`}
                  </Subtitle>
                </TouchableWithoutFeedback>
              }
              children={
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'white',
                  }}>
                  <View
                    style={StyleSheet.flatten([
                      styles.radiocont,
                      {
                        marginVertical: 4,
                      },
                    ])}>
                    <View style={styles.radiodownbox}>
                      <Title style={styles.bbstyle}>{`Ticket Issue`}</Title>

                      <RadioButton.Group
                        onValueChange={value => {
                          this.setState({ticketTypeFilter: value});
                        }}
                        value={this.state.ticketTypeFilter}>
                        <View styleName="horizontal" style={{marginBottom: 8}}>
                          <View
                            styleName="horizontal"
                            style={{alignSelf: 'center', alignItems: 'center'}}>
                            <RadioButton
                              value="IT Issue"
                              style={{alignSelf: 'center'}}
                            />
                            <Title
                              styleName="v-center h-center"
                              style={styles.textopen}>{`IT Issue`}</Title>
                          </View>
                          <View
                            styleName="horizontal"
                            style={{alignSelf: 'center', alignItems: 'center'}}>
                            <RadioButton
                              value="Non-It Issue"
                              style={{alignSelf: 'center'}}
                            />
                            <Title
                              styleName="v-center h-center"
                              style={styles.textopen}>{`NON-IT Issue`}</Title>
                          </View>
                        </View>
                      </RadioButton.Group>
                    </View>
                  </View>

                  <View
                    style={StyleSheet.flatten([
                      styles.radiocont,
                      {
                        marginVertical: 4,
                      },
                    ])}>
                    <View style={styles.radiodownbox}>
                      <Title style={styles.bbstyle}>{`Status`}</Title>

                      <RadioButton.Group
                        onValueChange={value => {
                          this.setState({statusFilter: value});
                        }}
                        value={this.state.statusFilter}>
                        <View styleName="horizontal" style={{marginBottom: 8}}>
                          <View
                            styleName="horizontal"
                            style={{alignSelf: 'center', alignItems: 'center'}}>
                            <RadioButton
                              value="open"
                              style={{alignSelf: 'center'}}
                            />
                            <Title
                              styleName="v-center h-center"
                              style={styles.textopen}>{`Open`}</Title>
                          </View>
                          <View
                            styleName="horizontal"
                            style={{alignSelf: 'center', alignItems: 'center'}}>
                            <RadioButton
                              value="closed"
                              style={{alignSelf: 'center'}}
                            />
                            <Title
                              styleName="v-center h-center"
                              style={styles.textopen}>{`Closed`}</Title>
                          </View>
                          <View
                            styleName="horizontal"
                            style={{alignSelf: 'center', alignItems: 'center'}}>
                            <RadioButton
                              value="wip"
                              style={{alignSelf: 'center'}}
                            />
                            <Title
                              styleName="v-center h-center"
                              style={styles.textopen}>{`WIP`}</Title>
                          </View>
                        </View>
                      </RadioButton.Group>
                    </View>
                  </View>

                  <View
                    style={StyleSheet.flatten([
                      styles.radiocont,
                      {
                        marginVertical: 4,
                      },
                    ])}>
                    <View style={styles.radiodownbox}>
                      <Title style={styles.bbstyle}>{`Priority`}</Title>

                      <RadioButton.Group
                        onValueChange={value => {
                          this.setState({priorityFilter: value});
                        }}
                        value={this.state.priorityFilter}>
                        <View styleName="horizontal" style={{marginBottom: 8}}>
                          <View
                            styleName="horizontal"
                            style={{alignSelf: 'center', alignItems: 'center'}}>
                            <RadioButton
                              value="low"
                              style={{alignSelf: 'center'}}
                            />
                            <Title
                              styleName="v-center h-center"
                              style={styles.textopen}>{`Low`}</Title>
                          </View>
                          <View
                            styleName="horizontal"
                            style={{alignSelf: 'center', alignItems: 'center'}}>
                            <RadioButton
                              value="medium"
                              style={{alignSelf: 'center'}}
                            />
                            <Title
                              styleName="v-center h-center"
                              style={styles.textopen}>{`Medium`}</Title>
                          </View>
                          <View
                            styleName="horizontal"
                            style={{alignSelf: 'center', alignItems: 'center'}}>
                            <RadioButton
                              value="high"
                              style={{alignSelf: 'center'}}
                            />
                            <Title
                              styleName="v-center h-center"
                              style={styles.textopen}>{`High`}</Title>
                          </View>
                        </View>
                      </RadioButton.Group>
                    </View>
                  </View>

                  <Button
                    mode={'flat'}
                    uppercase={false}
                    dark={true}
                    loading={false}
                    style={styles.loginButtonStyle}
                    onPress={this.filterButtonClicked}>
                    <Title style={styles.btntext}>{`Submit`}</Title>
                  </Button>
                </View>
              }
            />
          </>
        }
        body={
          <>
            <LeftHeaders
              showBack
              title={'Track My Query'}
              bottomBody={
                <>
                  {/* <View styleName="md-gutter">
                    <Searchbar
                      placeholder="Search"
                      onChangeText={this.onChangeSearch}
                      value={searchQuery}
                    />
                  </View> */}
                </>
              }
            />

            <View styleName="horizontal md-gutter space-between">
              <View styleName="horizontal">
                <TouchableWithoutFeedback
                  onPress={() => this.pagination(false)}>
                  <Title style={styles.itemtopText}>{`Back`}</Title>
                </TouchableWithoutFeedback>
                <View
                  style={{
                    height: 16,
                    marginHorizontal: 12,
                    backgroundColor: '#0270e3',
                    width: 1.5,
                  }}
                />
                <TouchableWithoutFeedback onPress={() => this.pagination(true)}>
                  <Title style={styles.itemtopText}>{`Next`}</Title>
                </TouchableWithoutFeedback>
              </View>
              <TouchableWithoutFeedback onPress={this.filterClicked}>
                <View styleName="horizontal v-center h-center">
                  <IconChooser
                    name={'filter'}
                    size={24}
                    color={'#555555'}
                    iconType={4}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>

            {this.state.loading ? (
              <View style={styles.loader}>
                <ActivityIndicator />
              </View>
            ) : this.state.dataList.length > 0 ? (
              <CommonTable
                dataList={this.state.dataList}
                widthArr={this.state.widthArr}
                tableHead={this.state.tableHead}
                rowClicked={this.detailThread}
              />
            ) : (
              <View style={styles.emptycont}>
                <ListError subtitle={'No Tickets Found...'} />
              </View>
            )}

            {this.state.dataList.length > 0 ? (
              <>
                <Title style={styles.itemtext}>{`Showing ${
                  this.state.itemSize
                }/${Number(this.state.cloneList.length)} entries`}</Title>
              </>
            ) : null}
          </>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
mainTcontainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderColor: '#bcbaa1',
        borderWidth: 0.8,
        borderRadius: 10,
        marginVertical: 10,
        paddingVertical: 8,
        paddingHorizontal: 6,    
      },
  timelinetitle: {
    color: '#555',
    fontSize: 15,
    fontFamily: Pref.getFontName(5),
    flexShrink:1
  },
  timelinedesc: {
    color: '#292929',
    fontSize: 14,
    fontFamily: Pref.getFontName(1),
    flexShrink:1
  },
  timelineContainer: {
    flexDirection: 'row',
  },
  btntext: {
    color: 'white',
    fontSize: 16,
    letterSpacing: 0.5,
    fontWeight: '700',
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
  itemtext: {
    letterSpacing: 0.5,
    fontWeight: '700',
    lineHeight: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#0270e3',
    fontSize: 14,
    paddingVertical: 16,
    marginTop: 4,
  },
  itemtopText: {
    letterSpacing: 0.5,
    fontWeight: '700',
    lineHeight: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#0270e3',
    fontSize: 16,
  },
  bbstyle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6d6a57',
    lineHeight: 20,
    marginStart: 4,
  },
  radiodownbox: {
    flexDirection: 'column',
    height: 56,
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 16,
  },
  radiocont: {
    marginStart: 24,
    marginEnd: 24,
    borderBottomWidth: 1.3,
    borderBottomColor: '#f2f1e6',
    alignContent: 'center',
    marginVertical: 16,
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
  loginButtonStyle: {
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    color: 'white',
    backgroundColor: Pref.RED,
    textAlign: 'center',
    elevation: 0,
    borderRadius: 0,
    letterSpacing: 0.5,
    borderRadius: 24,
    width: '42%',
    paddingVertical: 4,
    fontWeight: '700',
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Pref.RED,
  },
});
