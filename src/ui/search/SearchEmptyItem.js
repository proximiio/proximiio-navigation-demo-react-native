import React, {Component} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

/**
 * Dummy component to show when search is empty.
 */
export default class SearchEmptyItem extends Component {
  render() {
    return (
      <View style={styles.container} key={'footer'}>
        <View style={styles.imageWrapper}>
          <Image source={require('../../images/dummy.png')} style={styles.image} />
        </View>
        <Text style={styles.text}>There are no items!</Text>
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
    flex: 1,
    maxWidth: 96,
    aspectRatio: 1,
  },
  text: {
    textAlign: 'center',
    justifyContent: 'center',
  },
});
