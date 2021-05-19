/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {StyleSheet, View, Text, TouchableHighlight, Image, ActivityIndicator} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Proximiio, {
  ProximiioContextProvider,
  ProximiioEvents,
  ProximiioLocation,
} from 'react-native-proximiio';
import ProximiioMapbox, {
  ProximiioMapboxEvents,
  UserLocationSource,
  AmenitySource,
  GeoJSONSource,
  RoutingSource,
} from 'react-native-proximiio-mapbox';
import RoutePreview from './RoutePreview';
import {FAB} from 'react-native-paper';
import RouteNavigation from './RouteNavigation';
import CardView from '../../utils/CardView';
import FloorPicker from './FloorPicker';
import {Colors} from '../../Style';
import {
  ProximiioMapboxRoute,
  ProximiioFeatureType,
  ProximiioRouteEvent,
  ProximiioRouteUpdateType,
} from 'react-native-proximiio-mapbox/src/types';
import {ProximiioFloor} from 'react-native-proximiio';
import {MAP_STARTING_BOUNDS} from '../../utils/Constants';
import {Trans} from 'react-i18next';
import importDirectionImage from "../../utils/DirectionImageImportUtil";

interface Props {}

interface State {
  followUser: boolean;
  hazardFeature: ProximiioFeatureType;
  location: ProximiioLocation | undefined;
  mapLoaded: boolean;
  mapLevel: number;
  route: ProximiioMapboxRoute;
  routeStarted: Boolean;
  routeUpdate: ProximiioRouteEvent;
  userLevel: number;
}

export default class MapScreen extends React.Component<Props, State> {
  _map: MapboxGL.MapView | null = null;
  _camera: MapboxGL.Camera | null = null;

  state = {
    location: null,
    followUser: true,
    mapLoaded: false,
    mapLevel: 0,
    userLevel: 0,
    route: null,
    routeUpdate: null,
    started: false,
  };

  componentDidMount() {
    this.__onMapPress = this.__onMapPress.bind(this);
    this.__onFloorChange(Proximiio.floor);
    this.__onPositionUpdate(Proximiio.location);
    this.__positionUpdatedSubscription = Proximiio.subscribe(ProximiioEvents.PositionUpdated, (event) => this.__onPositionUpdate(event));
    this.__floorChangedSubscription = Proximiio.subscribe(ProximiioEvents.FloorChanged, (event) => this.__onFloorChange(event));
    this.__routeSubscription = ProximiioMapbox.subscribe(ProximiioMapboxEvents.ROUTE, (event) => this.__onRoute(event));
    this.__routeUpdateSubscription = ProximiioMapbox.subscribe(ProximiioMapboxEvents.ROUTE_UPDATE, (event) => this.__onRouteUpdate(event));
    this.__onHazardSubscription = ProximiioMapbox.subscribe(ProximiioMapboxEvents.ON_HAZARD, (event) => this.__onHazard(event));
  }

  componentWillUnmount() {
    this.__positionUpdatedSubscription.remove();
    this.__floorChangedSubscription.remove();
    this.__routeSubscription.remove();
    this.__routeUpdateSubscription.remove();
    this.__onHazardSubscription.remove();
  }

  render() {
    return (
      <View style={styles.container}>
        <MapboxGL.MapView
          ref={(map) => (this._map = map)}
          style={StyleSheet.absoluteFillObject}
          scrollEnabled={true}
          styleUrl={ProximiioMapbox.styleURL}
          onDidFinishLoadingStyle={(style) => console.log('style loaded', style)}
          onRegionWillChange={this.__onRegionWillChange.bind(this)}
          onDidFinishLoadingMap={() => this.setState({mapLoaded: true})}>
          <MapboxGL.Camera
            ref={(camera) => {
              this._camera = camera;
            }}
            minZoomLevel={1}
            maxZoomLevel={24}
            animationMode={'flyTo'}
            animationDuration={250}
            bounds={MAP_STARTING_BOUNDS}
          />
          {this.state.mapLoaded && (
            <ProximiioContextProvider>
              <AmenitySource />
              <GeoJSONSource level={this.state.mapLevel} onPress={(features: ProximiioFeature[]) => this.__onMapPress(features)} />
              <RoutingSource level={this.state.mapLevel} />
              {
                this.state.mapLevel === this.state.userLevel
                && <UserLocationSource />
              }
            </ProximiioContextProvider>
          )}
        </MapboxGL.MapView>
        <View style={styles.fabWrapper}>
          <FAB color={Colors.primary} icon="plus" style={styles.fab} onPress={() => this.__zoomIn()} />
          <FAB color={Colors.primary} icon="minus" style={styles.fab} onPress={() => this.__zoomOut()} />
          <FAB color={Colors.primary} icon="crosshairs-gps" style={styles.fab} onPress={() => this.__showAndFollowCurrentUserLocation()} />
        </View>
        {/* Route preview */}
        {this.state.started === false && this.state.route !== null && (
          <RoutePreview
            style={{flex: 1, width: '100%'}}
            route={this.state.route}
          />
        )}
        {this.__renderRouteCalculation()}
        {this.__renderNavigation()}
        {this.__renderSearch()}
        {this.__renderFloorSelector()}
      </View>
    );
  }

  /**
   * Render UI when route is re/calculating.
   */
  __renderRouteCalculation() {
    if (
      this.state.started === false
      || this.state.routeUpdate === null
      || (
        this.state.routeUpdate.eventType !== ProximiioRouteUpdateType.CALCULATING
        && this.state.routeUpdate.eventType !== ProximiioRouteUpdateType.RECALCULATING
      )
    ) {
      return null;
    }
    return (
      <View style={styles.calculationRow}>
        <ActivityIndicator size="large" color={Colors.primary} style={styles.calculationIndicator} animating />
        <View style={styles.calculationRowText}>
          <Text>{this.state.routeUpdate.text}</Text>
        </View>
      </View>
    );
  }

  __renderNavigation() {
    if (this.state.started === false || this.state.route == null) {
      return null;
    }
    return (
      <RouteNavigation
        route={this.state.route}
        routeUpdate={this.state.routeUpdate}
        hazard={this.state.hazard}
      />
    );
  }

  __renderSearch() {
    if (this.state.started === true || this.state.route) {
      return null;
    }
    return (
      <View>
        <CardView style={styles.searchCard}>
          <TouchableHighlight
            style={{borderRadius: 8}}
            activeOpacity={0.9}
            underlayColor="#eeeeee"
            onPress={() => {
              this.props.navigation.navigate('SearchScreen');
            }}>
            <Text style={styles.searchText}><Trans>Where do you want to go?</Trans></Text>
          </TouchableHighlight>
        </CardView>
      </View>
    );
  }

  __renderFloorSelector() {
    return (
      <View style={styles.floorPickerWrapper}>
        <FloorPicker
          mapLevel={this.state.mapLevel}
          userLevel={this.state.userLevel}
          onLevelChanged={this.__onLevelChanged.bind(this)}
        />
      </View>
    );
  }

  /**
   * Find pressed POI on map.
   * @param event
   * @returns {Promise<void>}
   * @private
   */
  __onMapPress(event: ProximiioFeatureType[]) {
    let pois = event.filter((it) => it.properties.type === 'poi');
    console.log('MAP ON PRESS', pois);
    if (pois.length > 0) {
      ProximiioMapbox.route.cancel();
      this.props.navigation.navigate('ItemDetail', {item: pois[0]});
    }
  }

  /**
   * Update map when user posiiton is updated.
   * @param location
   * @returns {Promise<void>}
   * @private
   */
  async __onPositionUpdate(location: ProximiioLocation) {
    console.log('location updated: ', location);
    if (!location) {
      return;
    }
    let firstLocationUpdate = this.state.location == null;
    let followUser = this.state.followUser;
    let stateUpdate = {location: location};
    let currentZoom = await this._map.getZoom();
    this.setState(stateUpdate);
    if (followUser || firstLocationUpdate) {
      this._camera?.setCamera({
        centerCoordinate: [location.lng, location.lat],
        animationDuration: 200,
        animationMode: 'flyTo',
        zoomLevel: firstLocationUpdate ? Math.max(currentZoom, 18) : currentZoom,
      });
    }
  }

  /**
   * Listener for route object for navigation.
   * @param event
   * @private
   */
  __onRoute(event: ProximiioMapboxRoute) {
    this.setState({route: event});
  }

  /**
   * Listener for route updates during navigation.
   * @param event
   * @private
   */
  __onRouteUpdate(event: ProximiioRouteEvent) {
    if (
      event.eventType === ProximiioRouteUpdateType.FINISHED
      || event.eventType === ProximiioRouteUpdateType.CANCELED
      || event.eventType === ProximiioRouteUpdateType.ROUTE_NOT_FOUND
      || event.eventType === ProximiioRouteUpdateType.ROUTE_OSRM_NETWORK_ERROR
    ) {
      this.setState({route: null, routeUpdate: event, started: false});
    } else {
      if (event.eventType === ProximiioRouteUpdateType.CALCULATING) {
        this.__showAndFollowCurrentUserLocation();
      }else {
        this.setState({routeUpdate: event, started: true});
      }
    }
  }

  /**
   * Listener for floor change. Switches map level if map level is the same as user level currently.
   * @param floor
   * @private
   */
  __onFloorChange(floor: ProximiioFloor) {
    let newUserLevel = floor ? floor.level || 0 : 0;
    let newState = {
      userLevel: newUserLevel,
    };
    if (this.state.userLevel === this.state.mapLevel) {
      newState.mapLevel = newUserLevel;
    }
    this.setState(newState);
  }

  /**
   * Listener on user interacting with map, to prevent moving map camera when user is panning by himself.
   * @param event
   * @private
   */
  __onRegionWillChange(event) {
    if (event.properties.isUserInteraction === true) {
      this.setState({followUser: false});
    }
  }

  /**
   * Listener for hazard feature warning for navigation.
   * @param hazard
   * @private
   */
  __onHazard(hazard: ProximiioFeatureType) {
    this.setState({hazard: hazard});
  }

  /**
   *Listener for user level change.
   * @param newLevel
   * @private
   */
  __onLevelChanged(newLevel) {
    this.setState({mapLevel: newLevel});
  }

  /**
   * Zooms map in.
   * @private
   */
  __zoomIn() {
    this._map.getZoom().then((zoom) => {
      this._camera.zoomTo(zoom + 1, 200);
    });
  }

  /**
   * Zooms map out.
   * @private
   */
  __zoomOut() {
    this._map.getZoom().then((zoom) => {
      this._camera.zoomTo(zoom - 1, 200);
    });
  }

  /**
   * If known, moves the map camera to current user location and level.
   * @returns {Promise<void>}
   * @private
   */
  async __showAndFollowCurrentUserLocation() {
    if (!this.state.location) {
      return;
    }
    this.setState({
      followUser: true,
      mapLevel: this.state.userLevel,
    });
    let currentZoom = await this._map.getZoom();
    let newZoom = Math.max(currentZoom, 18);
    console.log('zoom:', currentZoom, newZoom);
    this._camera.setCamera({
      centerCoordinate: [this.state.location.lng, this.state.location.lat],
      zoomLevel: newZoom,
      animationDuration: 200,
    });
  }
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomContent: {
    flex: 0,
  },
  fabWrapper: {
    alignItems: 'flex-end',
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    width: 'auto',
  },
  fab: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  searchCard: {
    marginBottom: 16,
    marginHorizontal: 16,
    padding: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  searchText: {
    color: Colors.gray,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  floorPickerWrapper: {
    position: 'absolute',
    top: 24,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  calculationRow: {
    alignItems: 'center',
    backgroundColor: Colors.background,
    flexDirection: 'row',
    padding: 8,
    alignContent: 'center',
    justifyContent: 'space-around',
  },
  calculationIndicator: {
    padding: 8,
    height: 24,
    width: 24,
  },
  calculationRowText: {
    flex: 1,
    padding: 8,
    alignItems: 'flex-start',
  },
});
