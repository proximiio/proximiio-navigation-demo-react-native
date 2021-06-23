import * as React from 'react';
import {
  GestureResponderEvent, StyleProp,
  StyleSheet,
  Text, TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, Shadow} from '../Style';

interface Props {
  title: string;
  onPress: (event: GestureResponderEvent) => any;
  buttonStyle?: StyleProp<any>;
  titleStyle?: StyleProp<any>;
}
interface State {}

/**
 * Screen with detailed info about POI Feature.
 */
export default class RoundedButton extends React.Component<Props, State> {
  state = {};

  public render() {
    const title = this.props.title;
    const buttonStyle = this.props.buttonStyle || {};
    const titleStyle = this.props.titleStyle || {};
    return (
      <View style={{...styles.container, ...buttonStyle}}>
        <TouchableOpacity
          style={styles.touchable}
          accessibilityRole="button"
          activeOpacity={0.7}
          onPress={this.props.onPress}>
          <Text numberOfLines={1} lineBreakMode={'tail'} style={{...styles.title, ...titleStyle}}>{title}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Shadow,
    borderRadius: 100,
    backgroundColor: Colors.blue,
    textAlign: 'center',
    alignContent: 'center',
    margin: 8,
  },
  touchable: {
    borderRadius: 100,
    padding: 12,
  },
  title: {
    color: '#fff',
    textAlign: 'center',
  },
});
