import * as React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import importDirectionImage from '../../utils/DirectionImageImportUtil';
import {Colors} from '../../Style';
import ProximiioMapbox, {
  Feature,
  ProximiioFeatureType,
  ProximiioRouteEvent,
} from 'react-native-proximiio-mapbox';
import i18n from 'i18next';
import MapCardView from "./MapCardView";

interface Props {
  routeUpdate: ProximiioRouteEvent;
  hazard: Feature;
  segment: Feature;
}
interface State {}

export default class RouteNavigation extends React.Component<Props, State> {
  state = {};

  render() {
    if (this.props.routeUpdate === undefined) {
      return null;
    }
    return (
      <MapCardView style={styles.container} onClosePressed={() => ProximiioMapbox.route.cancel()}>
        {this.props.segment && (
          <View style={styles.rowSegment}>
            <Text style={styles.rowText}>
              {i18n.t('navigation.you_are_in') + ' ' + this.props.segment.getTitle()}
            </Text>
          </View>
        )}
        {this.props.hazard && (
          <View style={styles.rowHazard}>
            <Text style={styles.rowText}>
              {i18n.t('navigation.watch_out_for') + ' ' + this.props.hazard.properties.getTitle()}
            </Text>
          </View>
        )}
        {this.props.routeUpdate.data !== undefined && (
          <View style={styles.rowNavigation}>
            <Image
              style={styles.image}
              source={importDirectionImage(this.props.routeUpdate.data.stepDirection, true)}
            />
            <Text style={styles.rowText}>{this.props.routeUpdate.text}</Text>
          </View>
        )}
      </MapCardView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // width: '100%',
  },
  image: {
    height: 32,
    tintColor: Colors.black,
    width: 32,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    // padding: 16,
  },
  rowNavigation: {
    alignItems: 'center',
    flexDirection: 'row',
    // padding: 16,
  },
  rowBearing: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 16,
  },
  rowHazard: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.hazardBackground,
  },
  rowSegment: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.segmentBackground,
  },
  rowText: {
    color: Colors.black,
    flex: 1,
    padding: 8,
  },
});
