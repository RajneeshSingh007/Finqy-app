import React from "react";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Image, Title, View, Lightbox } from "@shoutem/ui";
import * as Helper from "../../util/Helper";
import * as Pref from "../../util/Pref";
import Lodash from "lodash";
import moment from "moment";
import IconChooser from "../common/IconChooser";

const OfferItem = prop => {
  const {
    item,
    navigate = () => {},
    download = () => {},
    sharing = () => {},
    mailSharing = () => {}
  } = prop;
  if (Helper.nullCheck(item)) {
    return null;
  }

  const [imageUrl, setImageUrl] = React.useState(item.inner_img);
  const [whichImage, setwhichImage] = React.useState(0);

  React.useEffect(() => {}, [imageUrl, whichImage]);

  // const formatDates = `Valid till ${moment(
  //   Helper.dateObj(item.valid_date, '-'),
  // ).format('DD MMM YYYY')}`;

  return (
    <View styleName="sm-gutter">
      <View styleName="vertical" style={styles.itemContainer}>
        {/* <TouchableWithoutFeedback onPress={navigate}>

        </TouchableWithoutFeedback> */}

        <Lightbox
          onOpen={() => {
            setwhichImage(1);
            setImageUrl(item.image);
          }}
          onClose={() => {
            setwhichImage(0);
            setImageUrl(item.inner_img);
          }}
          activeProps={{
            alignContent: "center",
            justifyContent: "center"
          }}
        >
          <View>
            <Image
              source={{ uri: imageUrl,cache:false }}
              styleName={whichImage === 0 ? "large" : ""}
              style={whichImage === 0 ? styles.image : {
                width:'100%',
                height:'100%',
                resizeMode: "contain"
              }}
            />
          </View>
        </Lightbox>

        <View styleName="horizontal" style={styles.footerCon}>
          <View style={{ flex: 0.55 }}>
            <Title
              styleName="v-start h-start"
              numberOfLines={2}
              style={styles.itemtext}
            >
              {Lodash.truncate(`${item.header}`, {
                length: 36,
                separator: "..."
              })}
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
              ])}>{formatDates}</Title> */}
          </View>
          <View style={{ flex: 0.45 }}>
            <View styleName="horizontal v-center" style={{ flex: 12 }}>
              <View style={styles.roundtouch}>
                <TouchableWithoutFeedback onPress={mailSharing}>
                  <View
                    style={StyleSheet.flatten([
                      styles.circle,
                      {
                        backgroundColor: Pref.RED
                      }
                    ])}
                  >
                    <IconChooser
                      name="mail"
                      size={18}
                      color={"white"}
                      iconType={1}
                      style={styles.icon}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <View style={styles.gap}></View>
              <View style={styles.roundtouch}>
                <TouchableWithoutFeedback onPress={sharing}>
                  <View style={styles.circle}>
                    <IconChooser
                      name="whatsapp"
                      size={18}
                      color={"white"}
                      iconType={2}
                      style={styles.icon}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <View style={styles.gap}></View>
              <View style={styles.roundtouch}>
                <TouchableWithoutFeedback onPress={download}>
                  <View
                    style={StyleSheet.flatten([
                      styles.circle,
                      {
                        backgroundColor: "#e8e5d7"
                      }
                    ])}
                  >
                    <IconChooser
                      name="download"
                      size={18}
                      color={"#97948c"}
                      iconType={1}
                      style={styles.icon}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default OfferItem;

const styles = StyleSheet.create({
  roundtouch: { flex: 3 },
  gap: {
    flex: 0.15
  },
  image: {
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 12,
    width: "94%",
    height: 250,
    resizeMode: "contain"
  },
  footerCon: {
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 4,
    flex: 1
  },
  icon: {
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "center"
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Rubik",
    letterSpacing: 1,
    color: "#292929",
    alignSelf: "center",
    fontWeight: "400"
  },
  title: {
    fontSize: 18,
    fontFamily: "Rubik",
    letterSpacing: 1,
    color: "#292929",
    alignSelf: "flex-start",
    fontWeight: "700"
  },
  itemtext: {
    letterSpacing: 0.5,
    fontWeight: "700",
    lineHeight: 20,
    // alignSelf: 'center',
    // justifyContent: 'center',
    // textAlign: 'center',
    color: "#686868",
    fontSize: 16,
    marginStart: 16,
    marginEnd: 16,
    marginTop: 12,
    marginBottom: 10
  },
  emptycont: {
    flex: 0.7,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginVertical: 48,
    paddingVertical: 56
  },
  loader: {
    justifyContent: "center",
    alignSelf: "center",
    flex: 1,
    marginVertical: 48,
    paddingVertical: 48
  },
  itemContainer: {
    marginVertical: 10,
    borderColor: "#bcbaa1",
    borderWidth: 0.8,
    borderRadius: 16,
    marginHorizontal: 16
  },
  passText: {
    fontSize: 20,
    letterSpacing: 0.5,
    color: Pref.RED,
    fontWeight: "700",
    lineHeight: 36,
    alignSelf: "center",
    justifyContent: "center",
    textAlign: "center",
    paddingVertical: 16,
    marginBottom: 12
  },
  circle: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 4,
    borderRadius: 36 / 2,
    //borderColor: '#000',
    //borderStyle: 'solid',
    //borderWidth: 3,
    backgroundColor: "#1bd741"
  }
});
