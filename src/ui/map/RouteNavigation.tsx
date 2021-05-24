import * as React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';

import ProximiioMapbox from 'react-native-proximiio-mapbox';
import importDirectionImage from '../../utils/DirectionImageImportUtil';
import {Colors} from '../../Style';
import {
  ProximiioFeatureType,
  ProximiioRouteEvent,
} from 'react-native-proximiio-mapbox/src/types';
import i18n from 'i18next';

interface Props {
  routeUpdate: ProximiioRouteEvent;
  hazard: ProximiioFeatureType;
  segment: ProximiioFeatureType;
}
interface State {}

export default class RouteNavigation extends React.Component<Props, State> {
  state = {};

  render() {
    if (this.props.routeUpdate === undefined) {
      return <View />;
    }
    return (
      <View style={styles.container}>
        {this.props.segment !== undefined && (
          <View style={styles.rowSegment}>
            <Text style={styles.rowText}>
              {i18n.t('navigation.you_are_in') + ' ' + this.props.segment.properties.title}
            </Text>
          </View>
        )}
        {this.props.hazard !== undefined && (
          <View style={styles.rowHazard}>
            <Text style={styles.rowText}>
              {i18n.t('navigation.watch_out_for') + ' ' + this.props.hazard.properties.title}
            </Text>
          </View>
        )}
        {this.props.routeUpdate.data !== undefined && (
          <View style={styles.rowBearing}>
            <Image
              style={{
                ...styles.image,
                transform: this.__getDirectionRotation(this.props.routeUpdate.data.stepBearing),
              }}
              source={require('../../images/direction_icons/turn_straight.png')}
            />
            <Text style={styles.rowText}>
              {this.__getDirectionString(this.props.routeUpdate.data.stepBearing)}
            </Text>
            <TouchableNativeFeedback
              onPress={() => ProximiioMapbox.route.cancel()}>
              <Image style={styles.image} source={require('../../images/ic_close.png')}/>
            </TouchableNativeFeedback>
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
      </View>
    );
  }

  /**
   * Transforms bearing degrees into 'nice' text info.
   * @param bearing
   * @returns {string}
   * @private
   */
  __getDirectionString(bearing) {
    if (bearing > -22.5 && bearing < 22.5) {
      return i18n.t('navigation.north');
    } else if (bearing > 22.5 && bearing < 67.5) {
      return i18n.t('navigation.north-east');
    } else if (bearing > 67.5 && bearing < 112.5) {
      return i18n.t('navigation.east');
    } else if (bearing > 112.5 && bearing < 157.5) {
      return i18n.t('navigation.south-east');
    } else if (bearing > -67.5 && bearing < -22.5) {
      return i18n.t('navigation.north-west');
    } else if (bearing > -112.5 && bearing < -67.5) {
      return i18n.t('navigation.west');
    } else if (bearing > -157.5 && bearing < -112.5) {
      return i18n.t('navigation.south-west');
    } else {
      return i18n.t('navigation.south');
    }
  }

  /**
   * Transforms bearing degrees into rotation transformation style that rotates arrow to appropriate cardinal direction.
   * @param bearing
   * @returns {[{rotate: Array}]}
   * @private
   */
  __getDirectionRotation(bearing) {
    let rotation;
    if (bearing > -22.5 && bearing < 22.5) {
      rotation = 0;
    } else if (bearing > 22.5 && bearing < 67.5) {
      rotation = 45;
    } else if (bearing > 67.5 && bearing < 112.5) {
      rotation = 90;
    } else if (bearing > 112.5 && bearing < 157.5) {
      rotation = 135;
    } else if (bearing > -67.5 && bearing < -22.5) {
      rotation = -45;
    } else if (bearing > -112.5 && bearing < -67.5) {
      rotation = -90;
    } else if (bearing > -157.5 && bearing < -112.5) {
      rotation = -135;
    } else {
      rotation = 180;
    }
    let degreesString = rotation + 'deg';
    return [{rotate: degreesString}];
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  image: {
    height: 32,
    tintColor: Colors.navigationContentColor,
    width: 32,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 16,
  },
  rowNavigation: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.primary,
  },
  rowBearing: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.primaryDark,
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
    color: Colors.navigationContentColor,
    flex: 1,
    padding: 8,
  },
});
