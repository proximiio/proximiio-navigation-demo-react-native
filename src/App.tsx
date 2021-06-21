import * as React from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Proximiio, {NotificationMode} from 'react-native-proximiio';
import {Colors} from './Style';
import PreferenceHelper from './utils/PreferenceHelper';
import {LEVEL_OVERRIDE_MAP, PROXIMIIO_TOKEN} from './utils/Constants';
import ProximiioMapbox, {
  ProximiioMapboxEvents,
  ProximiioMapboxSyncStatus,
} from 'react-native-proximiio-mapbox';
import i18n from 'i18next';
import {Appbar} from 'react-native-paper';
import MapScreen from './ui/map/MapScreen';
import PreferenceScreen from './ui/preferences/PreferenceScreen';
import SearchScreen from './ui/search/SearchScreen';
import {SearchCategory} from './ui/search/SearchCategories';

/**
 * Create UI stack to manage screens.
 */
// const Stack = createStackNavigator();

/**
 * Call necessary to init mapbox.
 */
MapboxGL.setAccessToken('');

/**
 * RNComponent properties
 */
interface Props {}
/**
 * RNComponent state
 */
interface State {
  mapLoaded: Boolean;
  proximiioReady: Boolean;
  showSearch: Boolean;
  showPreferences: Boolean;
}

// TODO use?
enum ScreenState {
  MAP,
  SEARCH,
  SETTINGS,
  PREVIEW,
  NAVIGATION,
}

/**
 * Main application class
 */
export default class App extends React.Component<Props, State> {
  state = {
    mapLoaded: false,
    proximiioReady: false,
    showSearch: false,
    showPreferences: false,
  };
  private syncListener = undefined;

  componentDidMount() {
    this.initProximiio();
  }

  componentWillUnmount() {
    // Cancel sync status listener
    this.syncListener.remove();
  }

  render() {
    if (!this.state.proximiioReady) {
      return (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={{marginBottom: 8}}
            animating
          />
          <Text>{i18n.t('app.loading')}</Text>
        </View>
      );
    }
    return (
      <View
        style={{...StyleSheet.absoluteFillObject, backgroundColor: 'green'}}>
        <Appbar.Header style={{backgroundColor: 'white'}}>
          <Appbar.Content title="Proximiio Demo" />
          <Appbar.Action icon={'magnify'} onPress={this.openSettings} />
        </Appbar.Header>
        <SafeAreaView style={{flex: 1}}>
          {this.__renderMap()}
          <View style={styles.screensWrapper}>
            {this.state.showSearch && this.__renderSearch()}
            {this.state.showPreferences && this.__renderPreferences()}
            {this.__renderPoiDetail()}
            {this.__renderPreview()}
            {this.__renderNavigation()}
          </View>
        </SafeAreaView>
      </View>
    );
  }

  __renderPreferences() {
    return <PreferenceScreen />;
  }

  __renderPoiDetail() {
    return <View />;
  }

  __renderPreview() {
    return <View />;
  }

  __renderNavigation() {
    return <View />;
  }

  __renderMap() {
    if (this.state.showSearch || this.state.showPreferences) {
      return;
    }
    return (
      <MapScreen onOpenSearch={this.openSearch} onOpenPoi={this.openPoi} />
    );
  }

  __renderSearch() {
    return (
      <SearchScreen onPoiSelected={(poi) => console.log('poi selected', poi.id)} />
    );
  }

  /**
   * Initializes Proximi.io location and mapbox libraries.
   */
  private async initProximiio() {
    // Proximi.io mapbox library sync listener
    this.syncListener = ProximiioMapbox.subscribe(
      ProximiioMapboxEvents.SYNC_STATUS,
      (status: ProximiioMapboxSyncStatus) => {
        if (
          status === ProximiioMapboxSyncStatus.INITIAL_ERROR ||
          status === ProximiioMapboxSyncStatus.INITIAL_NETWORK_ERROR
        ) {
          setTimeout(() => {
            ProximiioMapbox.startSyncNow();
          }, 5000);
        }
      },
    );
    // Authorize libraries with token
    await Proximiio.authorize(PROXIMIIO_TOKEN);
    Proximiio.setPdr(true, 4);
    Proximiio.setSnapToRoute(true, 20);
    Proximiio.setNotificationMode(NotificationMode.Disabled);
    Proximiio.updateOptions();
    await ProximiioMapbox.authorize(PROXIMIIO_TOKEN);
    ProximiioMapbox.setRerouteEnabled(true);
    ProximiioMapbox.setReRouteThreshold(3);
    ProximiioMapbox.setRouteFinishThreshold(2.5);
    ProximiioMapbox.setStepImmediateThreshold(3.5);
    ProximiioMapbox.setStepPreparationThreshold(3.0);
    ProximiioMapbox.setUserLocationToRouteSnappingEnabled(true);
    ProximiioMapbox.setUserLocationToRouteSnappingThreshold(6.0);
    ProximiioMapbox.ttsHeadingCorrectionThresholds(8, 90);
    ProximiioMapbox.setLevelOverrideMap(LEVEL_OVERRIDE_MAP);
    // Apply user preferences, manageable in preference screen
    await PreferenceHelper.applyPreferences();
    // Request permissions needed for localization
    await Proximiio.requestPermissions();
    // When ready, change state to show UI.
    await this.setState({
      proximiioReady: true,
    });
  }

  private openSettings = () => {
    console.log('open settings');
    this.setState({showPreferences: true});
  };

  private openSearch = (searchCategory?: SearchCategory) => {
    console.log('open search');
    this.setState({
      showSearch: true,
    });
  };

  private openPoi = () => {
    console.log('open poi');
  };
}

const styles = StyleSheet.create({
  appbarButton: {
    marginRight: 8,
  },
  appBarButtonImage: {
    height: 32,
    width: 32,
  },
  loadingOverlay: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  map: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#66660066',
  },
  screensWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
});
