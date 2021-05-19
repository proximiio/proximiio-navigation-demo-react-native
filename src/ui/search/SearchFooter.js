import React, {Component} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

/**
 * Footer component to mark end of search item list.
 */
export default class SearchFooter extends Component {
  render() {
    return (
      <View style={styles.container} key={'footer'}>
        <View style={styles.imageWrapper}>
          <Image source={require('../../images/ic_end_search_results.png')} style={styles.image} />
        </View>
        <Text style={styles.text}>End of results</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 8,
    flex: 1,
    justifyContent: 'center',
  },
  imageWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    maxWidth: 32,
    minWidth: 32,
    aspectRatio: 1,
  },
  text: {
    textAlign: 'center',
    justifyContent: 'center',
  },
});
