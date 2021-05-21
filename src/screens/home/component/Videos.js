import React,{useState, useRef} from 'react';
import {
  StyleSheet,
} from 'react-native';
import {sizeWidth, sizeHeight} from '../../../util/Size';
import LinearGradient from 'react-native-linear-gradient';
import YoutubePlayer from 'react-native-youtube-iframe';
import Carousel, {Pagination} from 'react-native-snap-carousel';

const Videos = (props) => {
  const {videoData} = props;
  const [videoActiveIndex, setVideoActiveIndex] = useState(0);
  const crousalRef = useRef();

  const renderItem = (item, index) => {
    return (
      <LinearGradient
        colors={['#eeeeee', '#eeeeee', '#f5f5f5']}
        style={styles.videoscontainer}>
        <YoutubePlayer
          height={200}
          width={sizeWidth(94)}
          videoId={item.id}
          allowWebViewZoom={false}
          color={'white'}
          initialPlayerParams={{
            loop:false,
            controls:true,
          }}
        />
      </LinearGradient>
    );
  };

  return (
    <>
      <Carousel
        ref={crousalRef}
        data={videoData}
        renderItem={({item, index}) => renderItem(item, index)}
        sliderWidth={sizeWidth(96)}
        itemWidth={sizeWidth(94)}
        autoplay
        loop
        onSnapToItem={(val) => setVideoActiveIndex(val)}
      />
      <Pagination
        carouselRef={crousalRef}
        dotsLength={videoData.length}
        activeDotIndex={videoActiveIndex}
        dotStyle={styles.dotsyle}
        inactiveDotStyle={styles.inactivedot}
        inactiveDotOpacity={0.5}
        inactiveDotScale={0.7}
        tappableDots={false}
        containerStyle={styles.dot}
      />
    </>
  );
};

export default Videos;

const styles = StyleSheet.create({
  dot: {
    marginTop: -sizeHeight(5.5),
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
  videoscontainer: {
    width: '94%',
    height: 200,
    marginEnd: 10,
    marginStart: 10,
    borderRadius: 12,
    elevation: 2,
    marginTop: 24,
  },
});
