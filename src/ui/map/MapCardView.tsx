import * as React from 'react';
import CardView from '../../utils/CardView';
import {Image, StyleProp, StyleSheet, View} from 'react-native';
import {Colors, Shadow} from '../../Style';
import {TouchableHighlight} from 'react-native-gesture-handler';

interface Props {
  onClosePressed: () => any;
  style?: StyleProp<any>;
}
interface State {}

/**
 * CardView used in mapScreen, with cancel button in top right.
 */
export default class MapCardView extends React.Component<Props, State> {
  render() {
    return (
      <CardView style={{...styles.cardView, ...this.props.style}}>
        <View style={styles.closeButtonAbsoluteWrapper}>
          <TouchableHighlight
            activeOpacity={0.5}
            style={styles.closeButtonHighlight}
            onPress={() => this.props.onClosePressed()}
            underlayColor={Colors.gray}>
            <View style={styles.closeButton}>
              <Image
                source={require('../../images/ic_close.png')}
                style={styles.closeButtonImage}
              />
            </View>
          </TouchableHighlight>
        </View>
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
  closeButtonAbsoluteWrapper: {
    ...Shadow,
    borderRadius: 100,
    position: 'absolute',
    right: 24,
    top: -20,
  },
  closeButtonHighlight: {
    borderRadius: 100,
  },
  closeButton: {
    backgroundColor: Colors.red,
    borderRadius: 100,
    padding: 8,
  },
  closeButtonImage: {
    aspectRatio: 1,
    width: 24,
    height: 24,
    tintColor: Colors.white,
  },
});
