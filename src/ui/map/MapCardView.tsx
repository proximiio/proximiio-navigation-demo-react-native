import * as React from 'react';
import CardView from '../../utils/CardView';
import {StyleProp, StyleSheet, TouchableOpacity} from 'react-native';
import ProximiioMapbox from 'react-native-proximiio-mapbox';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {Colors, Shadow} from '../../Style';

interface Props {
  onClosePressed: () => any;
  style?: StyleProp<any>;
}
interface State {}

export default class MapCardView extends React.Component<Props, State> {
  render() {
    return (
      <CardView style={{...styles.cardView, ...this.props.style}}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => this.props.onClosePressed()}>
          <FontAwesome5Icon name={'times'} color={Colors.white} size={16} />
        </TouchableOpacity>
        {this.props.children}
      </CardView>
    );
  }
}

const styles = StyleSheet.create({
  cardView: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    margin: 12,
    borderRadius: 24,
  },
  closeButton: {
    ...Shadow,
    backgroundColor: Colors.red,
    padding: 8,
    borderRadius: 100,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    top: -26,
  },
});
