import * as React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from '../Style';

interface Props {
  title: string;
  onPress: (event: GestureResponderEvent) => any;
  buttonStyle?: StyleSheet;
  titleStyle?: StyleSheet;
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
      <TouchableOpacity
        style={styles.touchable}
        accessibilityRole="button"
        activeOpacity={0.8}
        onPress={this.props.onPress}>
        <View style={{...styles.container, ...buttonStyle}}>
          <Text style={{...styles.title, ...titleStyle}}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 100,
    margin: 8,
  },
  container: {
    borderRadius: 100,
    backgroundColor: Colors.blue,
    padding: 12,
    textAlign: 'center',
    alignContent: 'center',
  },
  title: {
    color: '#fff',
    textAlign: 'center',
  },
});
