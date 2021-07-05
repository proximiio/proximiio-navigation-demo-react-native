import * as React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import importDirectionImage from '../../utils/DirectionImageImportUtil';
import {Colors} from '../../Style';
import ProximiioMapbox, {
  Feature,
  ProximiioRouteEvent,
  ProximiioRouteUpdateType,
  RouteStepSymbol,
} from 'react-native-proximiio-mapbox';
import i18n from 'i18next';
import MapCardView from './MapCardView';

interface Props {
  routeUpdate: ProximiioRouteEvent;
  hazard: Feature;
  segment: Feature;
}
interface State {}

/**
 * Component displaying navigation message
 */
export default class RouteNavigation extends React.Component<Props, State> {
  state = {};

  render() {
    if (this.props.routeUpdate === undefined) {
      return null;
    }
    const hazardStyle = !this.props.segment ? {...styles.rowHazard,  ...styles.topRow} : styles.rowHazard;
    const stepDirection = this.props.routeUpdate.eventType === ProximiioRouteUpdateType.DIRECTION_UPDATE ? RouteStepSymbol.STRAIGHT : this.props.routeUpdate.data.stepDirection;
    return (
      <MapCardView style={styles.container} onClosePressed={() => ProximiioMapbox.route.cancel()}>
        {this.props.segment && (
          <View style={{...styles.rowSegment, ...styles.topRow}}>
            <Text style={styles.rowText}>
              {i18n.t('navigation.you_are_in') + ' ' + this.props.segment.getTitle()}
            </Text>
          </View>
        )}
        {this.props.hazard && (
          <View style={hazardStyle}>
            <Text style={styles.rowText}>
              {i18n.t('navigation.watch_out_for') + ' ' + this.props.hazard.properties.getTitle()}
            </Text>
          </View>
        )}
        {this.props.routeUpdate.data !== undefined && (
          <View style={styles.rowNavigation}>
            <Image
              style={styles.image}
              source={importDirectionImage(stepDirection, true)}
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
  },
  rowNavigation: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  rowHazard: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: -12,
    marginRight: -12,
    marginTop: -12,
    backgroundColor: Colors.hazardBackground,
  },
  rowSegment: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: -12,
    marginRight: -12,
    marginTop: -12,
    backgroundColor: Colors.segmentBackground,
  },
  topRow: {
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
  },
  rowText: {
    color: Colors.black,
    flex: 1,
    padding: 8,
  },
});
