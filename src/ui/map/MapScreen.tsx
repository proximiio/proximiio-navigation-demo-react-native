import * as React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableHighlight,
  ActivityIndicator,
  BackHandler,
  TouchableNativeFeedback,
} from 'react-native';
import MapboxGL, {SymbolLayerStyle} from '@react-native-mapbox-gl/maps';
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
  ProximiioRouteUpdateType, Feature,
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
  followUserHeading: boolean;
  hazard?: Feature;
  userLocationSourceStyle?: Object;
  location?: ProximiioLocation;
  mapLoaded: boolean;
  mapLevel: number;
  route?: ProximiioMapboxRoute;
  routeUpdate?: ProximiioRouteEvent;
  segment?: Feature;
  started: Boolean;
  userLevel: number;
}

const routeEndedEventTypes = [
  ProximiioRouteUpdateType.ROUTE_NOT_FOUND,
  ProximiioRouteUpdateType.ROUTE_OSRM_NETWORK_ERROR,
  ProximiioRouteUpdateType.CANCELED,
  ProximiioRouteUpdateType.FINISHED,
];

const cameraAnimationDuration = 250;

const userLocationSourceStyleOverride = {
  heading: {iconSize: 1.8},
  outerRing: {circleRadius: 24},
  middleRing: {circleRadius: 23},
  innerRing: {circleColor: '#ff0000', circleRadius: 15},
};
const userLocationSourceStyleNoOverride = {
  heading: {},
  outerRing: {},
  middleRing: {},
  innerRing: {},
};

export default class MapScreen extends React.Component<Props, State> {
  private map: MapboxGL.MapView | null = null;
  private camera: MapboxGL.Camera | null = null;
  state = {
    followUser: true,
    followUserHeading: false,
    hazard: undefined,
    userLocationSourceStyle: userLocationSourceStyleNoOverride,
    location: undefined,
    mapLoaded: false,
    mapLevel: 0,
    route: undefined,
    routeUpdate: undefined,
    segment: undefined,
    started: false,
    userLevel: 0,
  };

  componentDidMount() {
    this.onFloorChange(Proximiio.floor);
    this.onPositionUpdate(Proximiio.location);
    Proximiio.subscribe(ProximiioEvents.PositionUpdated, this.onPositionUpdate);
    Proximiio.subscribe(ProximiioEvents.FloorChanged, this.onFloorChange);
    ProximiioMapbox.subscribe(ProximiioMapboxEvents.ROUTE, this.onRoute);
    ProximiioMapbox.subscribe(ProximiioMapboxEvents.ROUTE_UPDATE, this.onRouteUpdate);
    ProximiioMapbox.subscribe(ProximiioMapboxEvents.ON_HAZARD, this.onHazard);
    ProximiioMapbox.subscribe(ProximiioMapboxEvents.ON_SEGMENT, this.onSegment);
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    Proximiio.unsubscribe(ProximiioEvents.PositionUpdated, this.onPositionUpdate);
    Proximiio.unsubscribe(ProximiioEvents.FloorChanged, this.onFloorChange);
    ProximiioMapbox.unsubscribe(ProximiioMapboxEvents.ROUTE, this.onRoute);
    ProximiioMapbox.unsubscribe(ProximiioMapboxEvents.ROUTE_UPDATE, this.onRouteUpdate);
    ProximiioMapbox.unsubscribe(ProximiioMapboxEvents.ON_HAZARD, this.onHazard);
    ProximiioMapbox.unsubscribe(ProximiioMapboxEvents.ON_SEGMENT, this.onSegment);
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  // shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
  //   if (
  //     this.state.followUser === nextState.followUser
  //     && this.state.hazard === nextState.hazard
  //     && this.state.mapLoaded === nextState.mapLoaded
  //     && this.state.mapLevel === nextState.mapLevel
  //     && this.state.route === nextState.route
  //     && this.state.routeUpdate === nextState.routeUpdate
  //     && this.state.started === nextState.started
  //     && this.state.userLevel === nextState.userLevel
  //   ) {
  //     console.log('should component update', false);
  //     return false;
  //   } else {
  //     console.log('should component update', true);
  //     return true;
  //   }
  // }

  render() {
    return (
      <View style={styles.container}>
        <MapboxGL.MapView
          ref={(map) => (this.map = map)}
          style={StyleSheet.absoluteFillObject}
          scrollEnabled={true}
          compassEnabled={false}
          styleURL={ProximiioMapbox.styleURL}
          onRegionWillChange={this.onRegionWillChange}
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
                  showHeadingIndicator={false}
                  onAccuracyChanged={(accuracy) => console.log('accuracy: ', accuracy)}
                  onHeadingChanged={this.onHeadingChanged}
                  visible={this.state.mapLevel === this.state.userLevel}
                />
              </GeoJSONSource>
            </ProximiioContextProvider>
          )}
        </MapboxGL.MapView>
        <View style={styles.fabWrapper}>
          <FAB
            color={Colors.primary}
            icon="plus"
            style={styles.fab}
            onPress={() => this.zoomIn()}
          />
          <FAB
            color={Colors.primary}
            icon="minus"
            style={styles.fab}
            onPress={() => this.zoomOut()}
          />
          <FAB
            color={this.state.followUserHeading ? Colors.primary : Colors.gray}
            icon="compass"
            style={styles.fab}
            onPress={() => this.toggleFollowUserHeading()}
          />
          <FAB
            color={Colors.primary}
            icon="crosshairs-gps"
            style={styles.fab}
            onPress={() => this.showAndFollowCurrentUserLocation()}
          />
        </View>
        {/* Route preview */}
        {!this.state.started && this.state.route && (
          <RoutePreview style={styles.routePreview} route={this.state.route} />
        )}
        {this.renderRouteCalculation()}
        {this.renderRouteEnded()}
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
      this.state.started === false ||
      this.state.routeUpdate === null ||
      (this.state.routeUpdate.eventType !==
        ProximiioRouteUpdateType.CALCULATING &&
        this.state.routeUpdate.eventType !==
          ProximiioRouteUpdateType.RECALCULATING)
    ) {
      return null;
    }
    return (
      <View style={styles.calculationRow}>
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={styles.calculationIndicator}
          animating
        />
        <View style={styles.calculationRowText}>
          <Text>{this.state.routeUpdate.text}</Text>
        </View>
      </View>
    );
  }

  private renderRouteEnded() {
    if (
      !this.state.routeUpdate ||
      !routeEndedEventTypes.includes(this.state.routeUpdate.eventType)
    ) {
      return null;
    }
    let isFinish =
      this.state.routeUpdate.eventType === ProximiioRouteUpdateType.FINISHED;
    return (
      <View style={styles.calculationRow}>
        <Image
          style={styles.calculationImage}
          source={
            isFinish
              ? require('../../images/direction_icons/finish.png')
              : require('../../images/dummy.png')
          }
        />
        <View style={styles.calculationRowText}>
          <Text>{this.state.routeUpdate.text}</Text>
        </View>
        <TouchableNativeFeedback onPress={this.clearRoute}>
          <Image
            style={styles.calculationRowCancel}
            source={require('../../images/ic_close.png')}
          />
        </TouchableNativeFeedback>
      </View>
    );
  }

  private renderNavigation() {
    if (this.state.started === false || this.state.route == null) {
      return null;
    }
    return (
      <RouteNavigation
        routeUpdate={this.state.routeUpdate}
        hazard={this.state.hazard}
        segment={this.state.segment}
      />
    );
  }

  private renderSearch() {
    if (
      this.state.started === true ||
      this.state.route ||
      this.state.routeUpdate
    ) {
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
  private onPositionUpdate = async (location: ProximiioLocation) => {
    console.log('location updated: ', location, this.state.location);
    if (!location) {
      return;
    }
    let firstLocationUpdate = this.state.location == null;
    let followUser = this.state.followUser;
    let overrideUserLocationMarkerStyle = location.sourceType === 'native';
    let stateUpdate = {
      location: location,
      userLocationSourceStyle: overrideUserLocationMarkerStyle ? userLocationSourceStyleOverride : userLocationSourceStyleNoOverride,
    };
    let currentZoom = await this.map.getZoom();
    this.setState(stateUpdate);
    if (followUser || firstLocationUpdate) {
      this.camera?.setCamera({
        centerCoordinate: [location.lng, location.lat],
        animationDuration: cameraAnimationDuration,
        animationMode: 'flyTo',
        zoomLevel: firstLocationUpdate
          ? Math.max(currentZoom, 18)
          : currentZoom,
      });
    }
  };

  private onHeadingChanged = (heading: number) => {
    if (this.state.followUserHeading) {
      this.camera?.setCamera({
        heading: heading,
        animationDuration: cameraAnimationDuration,
      });
    }
  };

  private toggleFollowUserHeading = () => {
    let willFollowUserHeading = !this.state.followUserHeading;
    let newState;
    if (willFollowUserHeading) {
      newState = {
        followUser: true,
        followUserHeading: true,
      };
    } else {
      newState = {followUserHeading: false};
      this.onHeadingChanged(0);
    }
    this.setState(newState);
  };

  /**
   * Override back press behaviour when navigation to just cancel navigation and not go out of map.
   */
  private onBackPress = () => {
    if (this.state.route || this.state.routeUpdate) {
      if (routeEndedEventTypes.includes(this.state.routeUpdate.eventType)) {
        this.clearRoute();
      } else {
        ProximiioMapbox.route.cancel();
      }
      return true;
    } else {
      return false;
    }
  };

  /**
   * Listener for route object for navigation.
   * @param event
   */
  private onRoute = (event: ProximiioMapboxRoute) => {
    this.setState({route: event});
  };

  /**
   * Listener for route updates during navigation.
   * @param event
   */
  private onRouteUpdate = (event: ProximiioRouteEvent) => {
    if (
      event.eventType === ProximiioRouteUpdateType.FINISHED ||
      event.eventType === ProximiioRouteUpdateType.CANCELED ||
      event.eventType === ProximiioRouteUpdateType.ROUTE_NOT_FOUND ||
      event.eventType === ProximiioRouteUpdateType.ROUTE_OSRM_NETWORK_ERROR
    ) {
      this.setState({route: null, routeUpdate: event, started: false});
    } else {
      if (event.eventType === ProximiioRouteUpdateType.CALCULATING) {
        this.showAndFollowCurrentUserLocation();
      } else {
        this.setState({routeUpdate: event, started: true});
      }
    }
  };

  private clearRoute = () => {
    this.setState({
      route: undefined,
      routeUpdate: undefined,
    });
  };

  /**
   * Listener for floor change. Switches map level if map level is the same as user level currently.
   * @param floor
   */
  private onFloorChange = (floor: ProximiioFloor) => {
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
  };

  /**
   * Listener on user interacting with map, to prevent moving map camera when user is panning by himself.
   * @param event
   * @private
   */
  private onRegionWillChange = (event) => {
    if (this.state.followUser && event.properties.isUserInteraction === true) {
      console.log('rotating?');
      this.setState({
        followUser: false,
        followUserHeading: false,
      });
    }
  };

  /**
   * Listener for hazard feature warning for navigation.
   * @param hazard
   * @private
   */
  private onHazard = (hazard: ProximiioFeatureType) => {
    this.setState({hazard: new Feature(hazard)});
  };

  /**
   * Listener for segment feature warning for navigation.
   * @param segment
   * @private
   */
  private onSegment = (event) => {
    if (event.type === 'enter') {
      this.setState({segment: new Feature(event.segment)});
    } else {
      this.setState({segment: undefined});
    }
  };

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
      this.camera.zoomTo(zoom + 1, cameraAnimationDuration);
    });
  }

  /**
   * Zooms map out.
   * @private
   */
  private zoomOut() {
    this.map.getZoom().then((zoom) => {
      this.camera.zoomTo(zoom - 1, cameraAnimationDuration);
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
      animationDuration: cameraAnimationDuration,
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
  calculationImage: {
    padding: 0,
    height: 32,
    width: 32,
  },
  calculationRowText: {
    flex: 1,
    padding: 8,
    alignItems: 'flex-start',
  },
  calculationRowCancel: {
    height: 32,
    tintColor: Colors.black,
    width: 32,
  },
  routePreview: {
    flex: 1,
    width: '100%',
  },
});
