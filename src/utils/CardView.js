import React, {Component} from 'react';
import {View} from 'react-native';
import {Colors} from '../Style';

/**
 * CardView wraps content in card with shadow.
 */
export default class CardView extends Component {
  render() {
    return (
      <View style={{...cardStyle, ...this.props.style}}>
        {this.props.children}
      </View>
    );
  }
}

const cardStyle = {
  borderRadius: 8,
  backgroundColor: Colors.white,
  elevation: 5,
  paddingHorizontal: 8,
  paddingVertical: 4,
  shadowColor: Colors.black,
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
};
