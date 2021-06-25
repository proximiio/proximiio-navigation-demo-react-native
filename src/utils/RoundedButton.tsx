import * as React from 'react';
import {
  GestureResponderEvent, Image, StyleProp,
  StyleSheet,
  Text, TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, Shadow} from '../Style';

interface Props {
  buttonStyle?: StyleProp<any>;
  title: string;
  titleStyle?: StyleProp<any>;
  icon?: NodeRequire;
  iconStyle?: StyleProp<any>;
  onPress: (event: GestureResponderEvent) => any;
}
interface State {}

/**
 * Screen with detailed info about POI Feature.
 */
export default class RoundedButton extends React.Component<Props, State> {
  state = {};

  public render() {
    const buttonStyle = this.props.buttonStyle || {};
    const title = this.props.title;
    const titleStyle = this.props.titleStyle || {};
    const icon = this.props.icon;
    const iconStyle = this.props.iconStyle || {};
    return (
      <View style={{...styles.container, ...buttonStyle}}>
        <TouchableOpacity
          style={styles.touchable}
          accessibilityRole="button"
          activeOpacity={0.7}
          onPress={this.props.onPress}>
          {icon && <Image style={{...styles.image, ...iconStyle}} source={icon} />}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Colors.white,
    textAlign: 'center',
  },
  image: {
    aspectRatio: 1,
    width: 24,
    marginEnd: 4,
    tintColor: Colors.white,
  },
});
