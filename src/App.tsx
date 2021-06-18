import * as React from 'react';
import {ActivityIndicator, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Proximiio, {NotificationMode, ProximiioContextProvider} from 'react-native-proximiio';
// import MapScreen from './ui/map/MapScreen';
// import PoiScreen from './ui/poi/PoiScreen';
// import SearchScreen from './ui/search/SearchScreen';
import {Colors} from './Style';
// import PreferenceScreen from './ui/preferences/PreferenceScreen';
import PreferenceHelper from './utils/PreferenceHelper';
import {LEVEL_OVERRIDE_MAP, PROXIMIIO_TOKEN} from './utils/Constants';
import ProximiioMapbox, {
  AmenitySource, GeoJSONSource,
  ProximiioMapboxEvents,
  ProximiioMapboxSyncStatus, RoutingSource, UserLocationSource,
} from 'react-native-proximiio-mapbox';
import i18n from 'i18next';
import {MAP_STARTING_BOUNDS} from './utils/Constants';
import {Appbar} from 'react-native-paper';
import MapScreen from "./ui/map/MapScreen";
import PreferenceScreen from "./ui/preferences/PreferenceScreen";

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
  mapLevel: Number;
  proximiioReady: Boolean;
}

/**
 * Main application class
 */
export default class App extends React.Component<Props, State> {
  state = {
    mapLoaded: false,
    mapLevel: 0,
    proximiioReady: false,
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
      <View style={{...StyleSheet.absoluteFillObject, backgroundColor: 'green'}}>
        <Appbar.Header style={{backgroundColor: 'white'}}>
          <Appbar.Content title="Proximiio Demo" />
          <Appbar.Action icon="magnify" onPress={this.openSettings} />
        </Appbar.Header>
        <SafeAreaView style={{flex: 1}}>
          {this.__renderMap()}
          {/*{this.__renderPreferences()}*/}
          {this.__renderPoiDetail()}
          {this.__renderPreview()}
          {this.__renderNavigation()}
        </SafeAreaView>
      </View>
      // <NavigationContainer>
      //   {this.__renderMap()}
      //   <Stack.Navigator screenOptions={props => {}}>
      //     <Stack.Screen
      //       name="Main"
      //       component={MapScreen}
      //       options={({navigation}) => {
      //         console.log('navigation', navigation);
      //         return {
      //           title: i18n.t('app.title_map'),
      //           headerRight: (tintColor) => this.getSettingsButton(tintColor, navigation),
      //           cardStyle: {backgroundColor: 'transparent', shadowColor:'transparent', },
      //           transparentCard: true,
      //           gestureEnabled: false,
      //           cardOverlayEnabled: true,
      //
      //           transitionConfig: () => ({containerStyle: {backgroundColor: 'transparent'}}),
      //         };
      //       }}
      //     />
      //     <Stack.Screen
      //       name="ItemDetail"
      //       component={PoiScreen}
      //       options={{title: ''}}
      //     />
      //     <Stack.Screen
      //       name="SearchScreen"
      //       component={SearchScreen}
      //       options={{title: i18n.t('app.title_search')}}
      //     />
      //     <Stack.Screen
      //       name="PreferenceScreen"
      //       component={PreferenceScreen}
      //       options={{title: i18n.t('app.title_settings')}}
      //     />
      //   </Stack.Navigator>
      // </NavigationContainer>
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
    return (
      <MapScreen
        onOpenSearch={() => {console.log('open search');}}
        onOpenPoi={() => {console.log('open search');}} />
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
    console.log('settings');
  };

  /**
   * Create appbar settings button.
   * @param tintColor
   * @param navigation
   * @returns {JSX.Element}
   * @private
   */
  private getSettingsButton(tintColor, navigation) {
    return (
      <TouchableOpacity
        style={styles.appbarButton}
        onPress={() => navigation.navigate('PreferenceScreen')}
        activeOpacity={0.5}>
        <Image
          style={styles.appBarButtonImage}
          source={require('./images/ic_settings.png')}
        />
      </TouchableOpacity>
    );
  }
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
});
