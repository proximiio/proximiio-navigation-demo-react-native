import React, {Component} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import i18n from 'i18next';
import {Colors} from '../../Style';

/**
 * Dummy component to show when search is empty.
 */
export default class SearchEmptyItem extends Component {
  render() {
    return (
      <View style={styles.container} key={'empty-item'}>
        <View style={styles.imageWrapper}>
          <Image source={require('../../images/ic_search_no_results.png')} style={styles.image} />
        </View>
        <Text style={styles.textBig}>{i18n.t('searchscreen.no_items')}</Text>
        <Text style={styles.textSmall}>{i18n.t('searchscreen.no_items_less_specific')}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  imageWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  image: {
    aspectRatio: 1,
    flex: 1,
    maxWidth: 96,
    tintColor: Colors.gray,
  },
  textBig: {
    color: Colors.gray,
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: 'center',
    marginBottom: 6,
    textAlign: 'center',
  },
  textSmall: {
    color: Colors.gray,
    textAlign: 'center',
    justifyContent: 'center',
  },
});
