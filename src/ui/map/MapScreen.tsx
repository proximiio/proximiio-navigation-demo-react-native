import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
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
  ProximiioMapboxRoute,
  ProximiioFeatureType,
  ProximiioRouteEvent,
  ProximiioRouteUpdateType,
} from 'react-native-proximiio-mapbox';
import RoutePreview from './RoutePreview';
import {FAB} from 'react-native-paper';
import RouteNavigation from './RouteNavigation';
import CardView from '../../utils/CardView';
import FloorPicker from './FloorPicker';
import {Colors} from '../../Style';
import {ProximiioFloor} from 'react-native-proximiio';
import {MAP_STARTING_BOUNDS} from '../../utils/Constants';
import i18n from 'i18next';

interface Props {
  navigation: any;
}

interface State {
  followUser: boolean;
  hazard: ProximiioFeatureType | undefined;
  location: ProximiioLocation | undefined;
  mapLoaded: boolean;
  mapLevel: number;
  route: ProximiioMapboxRoute | undefined;
  routeUpdate: ProximiioRouteEvent | undefined;
  started: Boolean;
  userLevel: number;
}

export default class MapScreen extends React.Component<Props, State> {
  private map: MapboxGL.MapView | null = null;
  private camera: MapboxGL.Camera | null = null;
  state = {
    followUser: true,
    hazard: undefined,
    location: undefined,
    mapLoaded: false,
    mapLevel: 0,
    route: undefined,
    routeUpdate: undefined,
    started: false,
    userLevel: 0,
  };
  private positionUpdatedSubscription = undefined;
  private floorChangedSubscription = undefined;
  private routeSubscription = undefined;
  private routeUpdateSubscription = undefined;
  private onHazardSubscription = undefined;

  componentDidMount() {
    this.onFloorChange(Proximiio.floor);
    this.onPositionUpdate(Proximiio.location);
    this.positionUpdatedSubscription = Proximiio.subscribe(ProximiioEvents.PositionUpdated, (event) => this.onPositionUpdate(event));
    this.floorChangedSubscription = Proximiio.subscribe(ProximiioEvents.FloorChanged, (event) => this.onFloorChange(event));
    this.routeSubscription = ProximiioMapbox.subscribe(ProximiioMapboxEvents.ROUTE, (event) => this.onRoute(event));
    this.routeUpdateSubscription = ProximiioMapbox.subscribe(ProximiioMapboxEvents.ROUTE_UPDATE, (event) => this.onRouteUpdate(event));
    this.onHazardSubscription = ProximiioMapbox.subscribe(ProximiioMapboxEvents.ON_HAZARD, (event) => this.onHazard(event));
  }

  componentWillUnmount() {
    this.positionUpdatedSubscription.remove();
    this.floorChangedSubscription.remove();
    this.routeSubscription.remove();
    this.routeUpdateSubscription.remove();
    this.onHazardSubscription.remove();
  }

  render() {
    return (
      <View style={styles.container}>
        <MapboxGL.MapView
          ref={(map) => (this.map = map)}
          style={StyleSheet.absoluteFillObject}
          scrollEnabled={true}
          styleURL={ProximiioMapbox.styleURL}
          onRegionWillChange={this.onRegionWillChange.bind(this)}
          onDidFinishLoadingMap={() => this.setState({mapLoaded: true})}>
          <MapboxGL.Camera
            ref={(camera) => {
              this.camera = camera;
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
              <GeoJSONSource
                level={this.state.mapLevel}
                onPress={this.onMapPress}>
                <RoutingSource level={this.state.mapLevel} />
                <UserLocationSource
                  showHeadingIndicator={true}
                  visible={this.state.mapLevel === this.state.userLevel}
                  onAccuracyChanged={(accuracy) => console.log('accuracy: ', accuracy)} />
              </GeoJSONSource>
            </ProximiioContextProvider>
          )}
      </MapboxGL.MapView>
        <View style={styles.fabWrapper}>
          <FAB color={Colors.primary} icon="plus" style={styles.fab} onPress={() => this.zoomIn()} />
          <FAB color={Colors.primary} icon="minus" style={styles.fab} onPress={() => this.zoomOut()} />
          <FAB color={Colors.primary} icon="crosshairs-gps" style={styles.fab} onPress={() => this.showAndFollowCurrentUserLocation()} />
        </View>
        {/* Route preview */}
        {!this.state.started && this.state.route && (
          <RoutePreview
            style={styles.routePreview}
            route={this.state.route}
          />
        )}
        {this.renderRouteCalculation()}
        {this.renderNavigation()}
        {this.renderSearch()}
        {this.renderFloorSelector()}
      </View>
    );
  }

  /**
   * Render UI when route is re/calculating.
   */
  private renderRouteCalculation() {
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

  private renderNavigation() {
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

  private renderSearch() {
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
            <Text style={styles.searchText}>
              {i18n.t('common.search_hint')}
            </Text>
          </TouchableHighlight>
        </CardView>
      </View>
    );
  }

  private renderFloorSelector() {
    return (
      <View style={styles.floorPickerWrapper}>
        <FloorPicker
          mapLevel={this.state.mapLevel}
          userLevel={this.state.userLevel}
          onLevelChanged={this.onLevelChanged.bind(this)}
        />
      </View>
    );
  }

  /**
   * Find pressed POI on map.
   */
  private onMapPress = (event: ProximiioFeatureType[]) => {
    let pois = event.filter((it) => it.properties.type === 'poi');
    if (pois.length > 0) {
      ProximiioMapbox.route.cancel();
      this.props.navigation.navigate('ItemDetail', {item: pois[0]});
    }
  };

  /**
   * Update map when user posiiton is updated.
   */
  private async onPositionUpdate(location: ProximiioLocation) {
    console.log('location updated: ', location);
    if (!location) {
      return;
    }
    let firstLocationUpdate = this.state.location == null;
    let followUser = this.state.followUser;
    let stateUpdate = {location: location};
    let currentZoom = await this.map.getZoom();
    this.setState(stateUpdate);
    if (followUser || firstLocationUpdate) {
      this.camera?.setCamera({
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
   */
  private onRoute(event: ProximiioMapboxRoute) {
    this.setState({route: event});
  }

  /**
   * Listener for route updates during navigation.
   * @param event
   */
  private onRouteUpdate(event: ProximiioRouteEvent) {
    if (
      event.eventType === ProximiioRouteUpdateType.FINISHED
      || event.eventType === ProximiioRouteUpdateType.CANCELED
      || event.eventType === ProximiioRouteUpdateType.ROUTE_NOT_FOUND
      || event.eventType === ProximiioRouteUpdateType.ROUTE_OSRM_NETWORK_ERROR
    ) {
      this.setState({route: null, routeUpdate: event, started: false});
    } else {
      if (event.eventType === ProximiioRouteUpdateType.CALCULATING) {
        this.showAndFollowCurrentUserLocation();
      }else {
        this.setState({routeUpdate: event, started: true});
      }
    }
  }

  /**
   * Listener for floor change. Switches map level if map level is the same as user level currently.
   * @param floor
   */
  private onFloorChange(floor: ProximiioFloor) {
    let newUserLevel = floor ? floor.level || 0 : 0;
    let newState;
    if (this.state.userLevel === this.state.mapLevel) {
      newState = {
        mapLevel: newUserLevel,
        userLevel: newUserLevel,
      };
    } else {
      newState = {
        userLevel: newUserLevel,
      };
    }
    this.setState(newState);
  }

  /**
   * Listener on user interacting with map, to prevent moving map camera when user is panning by himself.
   * @param event
   * @private
   */
  private onRegionWillChange(event) {
    if (this.state.followUser && event.properties.isUserInteraction === true) {
      this.setState({followUser: false});
    }
  }

  /**
   * Listener for hazard feature warning for navigation.
   * @param hazard
   * @private
   */
  private onHazard(hazard: ProximiioFeatureType) {
    this.setState({hazard: hazard});
  }

  /**
   *Listener for user level change.
   * @param newLevel
   * @private
   */
  private onLevelChanged(newLevel) {
    this.setState({mapLevel: newLevel});
  }

  /**
   * Zooms map in.
   * @private
   */
  private zoomIn() {
    this.map.getZoom().then((zoom) => {
      this.camera.zoomTo(zoom + 1, 200);
    });
  }

  /**
   * Zooms map out.
   * @private
   */
  private zoomOut() {
    this.map.getZoom().then((zoom) => {
      this.camera.zoomTo(zoom - 1, 200);
    });
  }

  /**
   * If known, moves the map camera to current user location and level.
   * @returns {Promise<void>}
   * @private
   */
  private async showAndFollowCurrentUserLocation() {
    if (!this.state.location) {
      return;
    }
    this.setState({
      followUser: true,
      mapLevel: this.state.userLevel,
    });
    let currentZoom = await this.map.getZoom();
    let newZoom = Math.max(currentZoom, 18);
    console.log('zoom:', currentZoom, newZoom);
    this.camera.setCamera({
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
  routePreview: {
    flex: 1,
    width: '100%',
  },
});
