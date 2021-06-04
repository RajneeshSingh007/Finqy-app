import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import {
  Image,
  Title,
  View,
  Html,
} from '@shoutem/ui';
import {
  Divider,
} from 'react-native-paper';
import NavigationActions from '../../util/NavigationActions';
import {sizeHeight, sizeWidth} from '../../util/Size';
import CommonScreen from '../common/CommonScreen';
import LeftHeaders from '../common/CommonLeftHeader';
import ListError from '../common/ListError';

export default class OffersDetails extends React.Component {
  constructor(props) {
    super(props);
   // this.backClick = this.backClick.bind(this);
    this.state = {
      loading: false,
      item: {},
      type: -1,
    };
  }

  componentDidMount() {
   // BackHandler.addEventListener('hardwareBackPress', this.backClick);
    const {navigation} = this.props;
    const item = navigation.getParam('item', null);
    const type = navigation.getParam('type', -1);
    this.setState({item: item, type: type});
  }

  backClick = () => {
    NavigationActions.navigate('MyOffers', {type: this.state.type});
    return true;
  };

  componentWillUnmount() {
   // BackHandler.removeEventListener('hardwareBackPress', this.backClick);
  }

  componentDidUpdate(prevProp, nextState) {
    if (prevProp.navigation !== null) {
      const olditem = prevProp.navigation.getParam('item', null);
      const {navigation} = this.props;
      const item = navigation.getParam('item', null);
      if (olditem !== item) {
        const type = navigation.getParam('type', -1);
        this.setState({item: item, type: type});
      }
    }
  }

  render() {
    const {item} = this.state;
    return (
      <CommonScreen
        title={''}
        loading={this.state.loading}
        backgroundColor={'white'}
        body={
          <>
            <LeftHeaders
              title={''}
              showBack
              showBottom={false}
              bottomBody={null}
              backClicked={this.backClick}
            />
            <View
              style={{
                marginVertical: sizeHeight(1),
                flex: 1,
                backgroundColor:'white',
                height: '100%',
              }}>
              {item && item !== null ? (
                <View>
                  {item.image && item.image !== null ? (
                    <View
                      style={{
                        width: '100%',
                        height: 400,
                      }}>
                      <Image
                        source={{
                          uri: `${item.image}`,
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                        }}
                      />
                    </View>
                  ) : null}

                  <Title
                    style={{
                      marginTop: sizeHeight(2),
                      marginBottom: 4,
                      fontSize: 15,
                      fontFamily: 'Rubik',
                      letterSpacing: 0.6,
                      color: '#292929',
                      fontWeight: '700',
                      marginHorizontal: sizeWidth(5),
                    }}>
                    {`ABOUT THE OFFER`}
                  </Title>

                  <Title
                    style={{
                      fontSize: 14,
                      fontFamily: 'Rubik',
                      letterSpacing: 0.6,
                      color: '#292929',
                      fontWeight: '400',
                      marginHorizontal: sizeWidth(5),
                      marginBottom: 12,
                    }}>
                    {`${item.header}`}
                  </Title>

                  <Divider
                    styleName="dark"
                    style={{width: '100%', marginHorizontal: 24}}
                  />

                  {item.description !== '' ? (
                    <Html body={`${item.description}`} />
                  ) : // <Subtitle
                  //   style={{
                  //     fontSize: 13,
                  //     fontFamily: 'Rubik',
                  //     letterSpacing: 0.6,
                  //     color: '#292929',
                  //     fontWeight: '400',
                  //     marginHorizontal: sizeWidth(5),
                  //     marginBottom: 12,
                  //   }}>
                  //   {`${item.description}`}
                  // </Subtitle>
                  null}

                  {/* {middleContent.length > 0 ? middleContent.map((ele, index) => {
                                        if (ele == "") {
                                            return null
                                        }
                                        return <View style={{ flexDirection: 'row' }}>
                                            <Subtitle style={{
                                                fontSize: 14, fontFamily: 'Rubik', letterSpacing: 0.6, color: '#757575', fontWeight: '400',
                                                marginHorizontal: sizeWidth(5)
                                            }}> {`\u2022 ${ele}`}</Subtitle>
                                        </View>
                                    }) : null}

                                    <Title style={{
                                        marginTop: sizeHeight(2),
                                        fontSize: 15, fontFamily: 'Rubik', letterSpacing: 0.6, color: '#292929', fontWeight: '700',
                                        marginHorizontal: sizeWidth(5),
                                        marginBottom: 12,
                                    }}> {`HOW TO AVAIL THE OFFER`}</Title> */}

                  {/* {lastContent.length > 0
                    ? lastContent.map((ele) => {
                        if (ele == '' || ele.includes('Valid')) {
                          return null;
                        }
                        return (
                          <View style={{flexDirection: 'row'}}>
                            <Subtitle
                              style={{
                                fontSize: 14,
                                fontFamily: 'Rubik',
                                letterSpacing: 0.6,
                                color: '#757575',
                                fontWeight: '400',
                                marginHorizontal: sizeWidth(5),
                              }}>
                              {`\u2022 ${ele}`}
                            </Subtitle>
                          </View>
                        );
                      })
                    : null} */}

                  <Title
                    style={{
                      marginTop: sizeHeight(2),
                      fontSize: 15,
                      fontFamily: 'Rubik',
                      letterSpacing: 0.6,
                      color: 'black',
                      fontWeight: '400',
                      marginHorizontal: sizeWidth(5),
                      marginBottom: 12,
                    }}>
                    {`Validity ${item.valid_date}`}
                  </Title>
                </View>
              ) : (
                <ListError subtitle={'No data found...'} url={''} />
              )}
            </View>
          </>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
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
});
