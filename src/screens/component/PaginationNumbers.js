import React, {useState, useEffect} from 'react';
import {StyleSheet, TouchableWithoutFeedback, FlatList} from 'react-native';
import {Title, View} from '@shoutem/ui';

/**
 *
 * @param {*} props
 */
const PaginationNumbers = props => {
  const {
    dataSize = -1,
    itemSize = 0,
    itemLimit = -1,
    pageNumberClicked = (start, end) => {},
  } = props;

  const [activeNumber, setActiveNumber] = useState(0);
  //[1, 2, 3, 4, 5, 6]
  const [pageNumbers, setPageNumbers] = useState([]);
  const flatRef = React.createRef();
  
  useEffect(() => {
    //console.log('dataSize', dataSize, itemLimit);
    let totalPages = Number(dataSize / itemLimit);
    if(String(totalPages).includes('.')){
      totalPages = Math.ceil(totalPages);
    }
  
    //if (totalPages > 6) {
      let pageNumbersData = [];
      for (let index = 0; index < totalPages; index++) {
        pageNumbersData.push(Number(index));
      }
      if(pageNumbers.length === 0){
        setPageNumbers(pageNumbersData);
        //itemClicked(1);
      }
    //}
    return () => {};
  }, [dataSize]);

  const itemClicked = no => {
    if (no >= 0 && no < pageNumbers.length) {
      const start = no > activeNumber ? no * itemLimit : itemSize - itemLimit - itemLimit;
      const end = no > activeNumber ? start + itemLimit : start + itemLimit;
      setActiveNumber(no);
      pageNumberClicked(start, end);
      if (flatRef.current && flatRef.current.scrollToIndex) {
        const finalpos = no - 1;
        if (finalpos >= 0) {
          flatRef.current.scrollToIndex({animated: true, index: finalpos});
        }
      }
    }
  };

  return (
    <View styleName="horizontal">
      <TouchableWithoutFeedback onPress={() => itemClicked(activeNumber - 1)}>
        <Title style={styles.itemtopText}>{`Back`}</Title>
      </TouchableWithoutFeedback>
      {pageNumbers.length === 0 ? (
        <View styleName="horizontal" style={styles.empty}>
          {null}
        </View>
      ) : (
        <View styleName="horizontal" style={styles.parentStyle}>
          <FlatList
            ref={flatRef}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            alwaysBounceHorizontal={false}
            nestedScrollEnabled={true}
            data={pageNumbers}
            horizontal
            keyExtractor={(item, index) => `${index}`}
            renderItem={({item, index}) => {
              return (
                <TouchableWithoutFeedback onPress={() => itemClicked(item)}>
                  <View style={styles.viewStyle}>
                    <Title
                      style={StyleSheet.flatten([
                        styles.itemtopText,
                        {
                          color: activeNumber !== item ? '#656259' : '#0270e3',
                        },
                      ])}>
                      {Number(item+1)}
                    </Title>
                  </View>
                </TouchableWithoutFeedback>
              );
            }}
          />
        </View>
      )}
      <TouchableWithoutFeedback onPress={() => itemClicked(activeNumber + 1)}>
        <Title style={styles.itemtopText}>{`Next`}</Title>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default PaginationNumbers;

const styles = StyleSheet.create({
  empty: {
    marginStart: 4,
    marginEnd: 4,
  },
  viewStyle: {
    alignContent: 'center',
    flexDirection: 'row',
    marginStart: 4,
    marginEnd: 4,
  },
  parentStyle: {
    marginStart: 4,
    marginEnd: 4,
    maxWidth: 100,
  },
  itemtopText: {
    letterSpacing: 0.5,
    fontWeight: '700',
    lineHeight: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#0270e3',
    fontSize: 15,
  },
});
