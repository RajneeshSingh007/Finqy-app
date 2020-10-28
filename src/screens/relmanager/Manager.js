import React from 'react';
import {
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  Image,
  Title,
  View,
} from '@shoutem/ui';
import * as Helper from '../../util/Helper';
import * as Pref from '../../util/Pref';
import {
  ActivityIndicator,
} from 'react-native-paper';
import Lodash from 'lodash';
import LeftHeaders from '../common/CommonLeftHeader';
import ListError from '../common/ListError';
import CScreen from '../component/CScreen';

export default class Manager extends React.PureComponent {
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
    };
  }

  componentDidMount() {
    Pref.getVal(Pref.userData, (userData) => {
      this.setState({ userData: userData });
      Pref.getVal(Pref.saveToken, (value) => {
        this.setState({ token: value }, () => {
          this.fetchData();
        });
      });
    });
  }

  fetchData = () => {
    this.setState({ loading: true });
    const { refercode } = this.state.userData;
    const body = JSON.stringify({
      user_refercode: refercode,
    });
    Helper.networkHelperTokenPost(
      Pref.RelationManagerUrl,
      body,
      Pref.methodPost,
      this.state.token,
      (result) => {
        const { data, response_header } = result;
        const { res_type } = response_header;
        if (res_type === `success`) {
          this.setState({ dataList: data, loading: false });
        } else {
          this.setState({ loading: false });
        }
      },
      (error) => {
        this.setState({ loading: false });
      },
    );
  };

  /**
   *
   * @param {*} item
   * @param {*} index
   */
  renderItems(item, index) {
    const inc = index+1;
    return (
      <View styleName="sm-gutter">
        <View styleName="vertical" style={styles.itemContainer}>
          {/* <Image
            source={{
              uri: `https://image.freepik.com/free-vector/online-courses-concept_23-2148524391.jpg`,
            }}
            styleName="large"
            style={styles.image}
          /> */}

          <View styleName="horizontal space-between" style={styles.footerCon}>
            <View>
              {index === -1 ? <Title
                styleName="v-start h-start"
                numberOfLines={1}
                style={StyleSheet.flatten([styles.itemtext, {
                  color: '#bcbaa1'
                }])}>
                {`ERB SPEC`}
              </Title> :
                <Title
                  styleName="v-start h-start"
                  numberOfLines={1}
                  style={StyleSheet.flatten([styles.itemtext, {
                    color: '#bcbaa1'
                  }])}>
                  {`Escalation ${inc}`}
                </Title>
              }
              <Title
                styleName="v-start h-start"
                numberOfLines={1}
                style={StyleSheet.flatten([styles.itemtext, {
                  fontSize: 15,
                  paddingVertical: 2
                }])}>
                {Lodash.truncate(`${item.username}`, {
                  length: 16,
                  separator: '...',
                })}
              </Title>
              <Title
                style={StyleSheet.flatten([
                  styles.itemtext,
                  {
                    paddingVertical: 0,
                    fontSize: 13,
                    color: '#848486',
                    fontWeight: '400',
                    marginTop: 0,
                    marginBottom: 0,
                    paddingBottom: 0,
                  },
                ])}>
                {`${item.email}  `}
                <View style={styles.divider} />
                <Title
                  style={StyleSheet.flatten([
                    styles.itemtext,
                    {
                      paddingVertical: 0,
                      fontSize: 13,
                      color: '#848486',
                      fontWeight: '400',
                      marginTop: 0,
                      marginBottom: 0,
                      paddingBottom: 0,
                    },
                  ])}>
                  {`  ${item.mobile}`}
                </Title>
              </Title>
              {/* <Title
                style={StyleSheet.flatten([
                  styles.itemtext,
                  {
                    paddingVertical: 0,
                    fontSize: 13,
                    color: '#848486',
                    fontWeight: '400',
                    marginTop: 0,
                    marginBottom: 0,
                    paddingBottom: 0,
                  },
                ])}>
                {item.email}
              </Title>
              <Title
                style={StyleSheet.flatten([
                  styles.itemtext,
                  {
                    paddingVertical: 0,
                    fontSize: 13,
                    color: '#848486',
                    fontWeight: '400',
                    marginTop: 0,
                    marginBottom: 0,
                    paddingBottom: 0,
                  },
                ])}>
                {`${item.mobile}  `}
                <View style={styles.divider} />
                <Title
                  style={StyleSheet.flatten([
                    styles.itemtext,
                    {
                      paddingVertical: 0,
                      fontSize: 13,
                      color: '#848486',
                      fontWeight: '400',
                      marginTop: 0,
                      marginBottom: 0,
                      paddingBottom: 0,
                      marginStart: 10,
                    },
                  ])}>
                  {`  ${Lodash.capitalize(item.status)}`}
                </Title>
              </Title> */}
            </View>
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <CScreen
        body={
          <>
            <LeftHeaders
              title={'Relation Manager'}
              showBack
              // bottomtext={
              //   <>
              //     {`Relation `}
              //     <Title style={styles.passText}>{`Manager`}</Title>
              //   </>
              // }
              bottomtextStyle={{
                color: '#555555',
                fontSize: 24,
              }}
            />
            {this.state.loading == true ? (
              <View style={styles.loader}>
                <ActivityIndicator />
              </View>
            ) : <View>
                {this.renderItems({ "created_date": "16-07-2020", "designation": "asdkj", "email": "someone@gmail.com", "id": "1", "ip_add": "106.193.143.165", "mobile": "0000000000", "status": "active", "username": "Someone Static" }, -1)}
                {this.state.dataList.length > 0 ?
                  <FlatList
                    data={this.state.dataList}
                    renderItem={({ item, index }) => this.renderItems(item, index)}
                    nestedScrollEnabled={true}
                    keyExtractor={(item, index) => `${index}`}
                    showsVerticalScrollIndicator={true}
                    showsHorizontalScrollIndicator={false}
                    extraData={this.state}
                  />
                  : <View style={styles.emptycont}>
                    <ListError subtitle={'No relation manager found...'} />
                  </View>}
              </View>}
          </>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  divider: {
    backgroundColor: '#dedede',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  itemContainer: {
    marginVertical: 10,
    borderColor: '#bcbaa1',
    borderWidth: 0.8,
    borderRadius: 16,
    marginHorizontal: 16,
    paddingVertical: 8
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
  gap: {
    marginHorizontal: 8,
  },
  image: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 8,
    width: '90%',
    height: 156,
    resizeMode: 'contain',
  },
  footerCon: {
    paddingBottom: 12,
    paddingHorizontal: 12,
    paddingTop: 4,
  },
  icon: {
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
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
  },
});
