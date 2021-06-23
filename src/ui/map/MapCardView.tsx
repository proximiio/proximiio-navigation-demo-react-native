import * as React from 'react';
import CardView from '../../utils/CardView';
import {StyleSheet, TouchableOpacity} from 'react-native';
import ProximiioMapbox from 'react-native-proximiio-mapbox';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {Colors, Shadow} from '../../Style';

interface Props {
  onClosePressed: () => any;
}
interface State {}

export default class MapCardView extends React.Component<Props, State> {
  render() {
    return (
      <CardView style={styles.cardView}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => ProximiioMapbox.route.cancel()}>
          <FontAwesome5Icon name={'times'} color={Colors.white} size={16} />
        </TouchableOpacity>
        {this.props.children}
      </CardView>
    );
  }
}

const styles = StyleSheet.create({
  cardView: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    margin: 12,
  },
  closeButton: {
    ...Shadow,
    backgroundColor: Colors.red,
    padding: 8,
    borderRadius: 100,
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 12,
    top: -16,
  },
});
