import {View, Image} from '@shoutem/ui';
import React, {useState, useRef} from 'react';
import {StyleSheet, Platform, Dimensions} from 'react-native';
import {sizeWidth, sizeHeight} from '../../../util/Size';
import Carousel, {Pagination} from 'react-native-snap-carousel';

const {width} = Dimensions.get('window');

const ratio = 300 / 720;

const Banner = (props) => {
  const {bannerData, shareChild = (item) =>{}} = props;
  const [bannerActiveIndex, setBannerActiveIndex] = useState(0);
  const crousalRef = useRef();

  const renderItem = (item, index) => {
    return (
      <>
        <Image
          source={{uri: item.banner}}
          style={styles.bannerImg}
        />
        {shareChild(item)}
      </>
    );
  };
  return (
    <>
      <Carousel
        ref={crousalRef}
        data={bannerData}
        renderItem={({item, index}) => renderItem(item, index)}
        sliderWidth={width}
        itemWidth={sizeWidth(95)}
        //itemHeight={width*ratio}
        autoplay
        loop
        autoplayInterval={2000}
        onSnapToItem={(val) => setBannerActiveIndex(val)}
      />
      <Pagination
        carouselRef={crousalRef}
        dotsLength={bannerData.length}
        activeDotIndex={bannerActiveIndex}
        dotStyle={styles.dotstyle}
        inactiveDotStyle={styles.dotbg}
        inactiveDotOpacity={0.5}
        inactiveDotScale={0.7}
        tappableDots={false}
        containerStyle={styles.dot}
      />
    </>
  );
};

export default Banner;

const styles = StyleSheet.create({
  dotbg: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dotstyle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0270e3',
  },
  dot: {
    marginTop: -sizeHeight(8),
  },
  inactivedot: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dotsyle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
    backgroundColor: '#0270e3',
  },
  bannerImg: {
    height: width * ratio,
    width: '99%',
    //resizeMode: 'contain',
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomEndRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomStartRadius: 12,
  },
  bannerView: {
  },
});
