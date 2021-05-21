/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Proximiio from 'react-native-proximiio';
import ProximiioMapbox from 'react-native-proximiio-mapbox';
import MapScreen from './ui/map/MapScreen';
import PoiScreen from './ui/poi/PoiScreen';
import SearchScreen from './ui/search/SearchScreen';
import {Colors, MyTheme} from './Style';
import PreferenceScreen from './ui/preferences/PreferenceScreen';
import PreferenceHelper from './utils/PreferenceHelper';
import {MAPBOX_TOKEN, PROXIMIIO_TOKEN} from './utils/Constants';
import {
  ProximiioMapboxEvents,
  ProximiioMapboxSyncStatus,
} from 'react-native-proximiio-mapbox/src/instance';
import {Trans} from 'react-i18next';
import i18n from "i18next";

/**
 * Create UI stack to manage screens.
 */
const Stack = createStackNavigator();

/**
 * Set mapbox token.
 */
MapboxGL.setAccessToken(MAPBOX_TOKEN);

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

  componentDidMount() {
    this.__initProximiio();
  }

  componentWillUnmount() {
    // Cancel sync status listener
    this.__syncListener.remove();
  }

  render() {
    if (!this.state.proximiioReady) {
      return (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} style={{marginBottom: 8}} animating />
          <Text>{i18n.t('app.loading')}</Text>
        </View>
      );
    }
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={MapScreen}
            options={({navigation}) => {
              console.log('navigation', navigation);
              return {
                title: i18n.t('app.title_map'),
                headerRight: (tintColor) => this.__getSettingsButton(tintColor, navigation),
              };
            }}
            onOpenDetail={() => {}}
          />
          <Stack.Screen
            name="ItemDetail"
            component={PoiScreen}
            options={{title: ''}}
          />
          <Stack.Screen
            name="SearchScreen"
            component={SearchScreen}
            options={{title: i18n.t('app.title_search')}}
          />
          <Stack.Screen
            name="PreferenceScreen"
            component={PreferenceScreen}
            options={{title: i18n.t('app.title_settings')}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  /**
   * Initializes Proximi.io location and mapbox libraries.
   */
  async __initProximiio() {
    // Proximi.io mapbox library sync listener
    this.__syncListener = ProximiioMapbox.subscribe(ProximiioMapboxEvents.SYNC_STATUS, (status: ProximiioMapboxSyncStatus) => {
        if (status === ProximiioMapboxSyncStatus.INITIAL_ERROR || status === ProximiioMapboxSyncStatus.INITIAL_NETWORK_ERROR) {
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
    await ProximiioMapbox.authorize(PROXIMIIO_TOKEN);
    ProximiioMapbox.setUserLocationToRouteSnappingEnabled(true);
    ProximiioMapbox.setUserLocationToRouteSnappingThreshold(6.0);
    ProximiioMapbox.setRouteFinishThreshold(2.5);
    ProximiioMapbox.setStepImmediateThreshold(3.5);
    ProximiioMapbox.setStepPreparationThreshold(3.0);
    ProximiioMapbox.setRerouteEnabled(true);
    ProximiioMapbox.setReRouteThreshold(15);
    ProximiioMapbox.ttsHeadingCorrectionThresholds(8, 90);
    // Apply user preferences, manageable in preference screen
    await PreferenceHelper.applyPreferences();
    // Request permissions needed for localization
    await Proximiio.requestPermissions();
    // When ready, change state to show UI.
    await this.setState({
      proximiioReady: true,
    });
  }

  /**
   * Create appbar settings button.
   * @param tintColor
   * @param navigation
   * @returns {JSX.Element}
   * @private
   */
  __getSettingsButton(tintColor, navigation) {
    return (
      <TouchableOpacity
        style={styles.appbarButton}
        onPress={() => navigation.navigate('PreferenceScreen')}
        activeOpacity={0.5}>
        <Image style={styles.appBarButtonImage} source={require('./images/ic_settings.png')} />
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
});
