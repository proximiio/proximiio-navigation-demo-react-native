import DefaultPreference from 'react-native-default-preference';
import ProximiioMapbox from 'react-native-proximiio-mapbox/src/instance';
import {ProximiioWayfindingOptions} from 'react-native-proximiio-mapbox/src/types';
import {ProximiioRouteConfiguration} from 'react-native-proximiio-mapbox/src/types';
import {MetersUnitConversion, StepUnitConversion} from './UnitConversions';

/**
 * Preference values (keys).
 */
export const Preference = {
  AVOID_STAIRS: 'AVOID_STAIRS',
  AVOID_ELEVATORS: 'AVOID_ELEVATORS',
  AVOID_REVOLVING_DOORS: 'AVOID_REVOLVING_DOORS',
  AVOID_NARROW_ROUTES: 'AVOID_NARROW_ROUTES',
  DISTANCE_UNIT: 'DISTANCE_UNIT',
  VOICE_GUIDANCE: 'VOICE_GUIDANCE',
  HEADING_CORRECTION: 'HEADING_CORRECTION',
  DECISION_POINTS: 'DECISION_POINTS',
  HAZARDS: 'HAZARDS',
  LANDMARKS: 'LANDMARKS',
  SEGMENTS: 'SEGMENTS',
  REASSURANCE_ENABLED: 'REASSURANCE_ENABLED',
  REASSURANCE_DISTANCE: 'REASSURANCE_DISTANCE',
  ACCESSIBILITY_GUIDANCE: 'ACCESSIBILITY_GUIDANCE',
};

/**
 * Options for accessibility.
 */
export const AccessibilityGuidanceOption = {
  NONE: {id: 'none', name: 'none'},
  VISUALLY_IMPAIRED: {id: 'visually_impaired', name: 'visually impaired'},
};

/**
 * Options for units used in navigation guidance.
 */
export const DistanceUnitOption = {
  METERS: {id: 'meters', name: 'meters'},
  STEPS: {id: 'steps', name: 'steps'},
};

/**
 * Options for reassuring user about current route each X meters.
 */
export const ReassuranceDistanceOption = {
  METERS_10: {id: 'meters_10', name: '10 meters', value: 10},
  METERS_15: {id: 'meters_15', name: '15 meters', value: 15},
  METERS_20: {id: 'meters_20', name: '20 meters', value: 20},
  METERS_25: {id: 'meters_25', name: '25 meters', value: 25},
};

/**
 * Helper class to manage user preferences.
 */
class PreferenceHelper {
  /**
   * Returns object with all preference values.
   * @returns {Promise<unknown>}
   */
  getPreferences() {
    return new Promise((resolve, reject) => {
      let preferenceKeys = Object.entries(Preference).map((it) => it[0]);
      DefaultPreference.getMultiple(preferenceKeys).then(
        (preferenceResults) => {
          let preferences = {
            AVOID_STAIRS: this.__getPreferenceOrDefault(JSON.parse(preferenceResults[0]), false),
            AVOID_ELEVATORS: this.__getPreferenceOrDefault(JSON.parse(preferenceResults[1]), false),
            AVOID_REVOLVING_DOORS: this.__getPreferenceOrDefault(JSON.parse(preferenceResults[2]), false),
            AVOID_NARROW_ROUTES: this.__getPreferenceOrDefault(JSON.parse(preferenceResults[3]), false),
            DISTANCE_UNIT: this.__getPreferenceOrDefault(preferenceResults[4], DistanceUnitOption.METERS.id),
            VOICE_GUIDANCE: this.__getPreferenceOrDefault(JSON.parse(preferenceResults[5]), true),
            HEADING_CORRECTION: this.__getPreferenceOrDefault(JSON.parse(preferenceResults[6]), true),
            DECISION_POINTS: this.__getPreferenceOrDefault(JSON.parse(preferenceResults[7]), false),
            HAZARDS: this.__getPreferenceOrDefault(JSON.parse(preferenceResults[8]), false),
            LANDMARKS: this.__getPreferenceOrDefault(JSON.parse(preferenceResults[9]), false),
            SEGMENTS: this.__getPreferenceOrDefault(JSON.parse(preferenceResults[10]), true),
            REASSURANCE_ENABLED: this.__getPreferenceOrDefault(JSON.parse(preferenceResults[11]), true),
            REASSURANCE_DISTANCE: this.__getPreferenceOrDefault(preferenceResults[12], ReassuranceDistanceOption.METERS_15.id),
            ACCESSIBILITY_GUIDANCE: this.__getPreferenceOrDefault(preferenceResults[13], AccessibilityGuidanceOption.NONE.id),
          };
          resolve(preferences);
        },
      );
    });
  }

  /**
   * Updates preferences with passed value.
   * Also automatically applies config to proximi.io libraries.
   */
  async setPreferences(preferences) {
    await DefaultPreference.setMultiple(preferences);
    await this.applyPreferences();
  }

  /**
   * Reads preferences and applies them to proximi.io libraries.
   */
  async applyPreferences() {
    let preferences = await this.getPreferences();
    let disabilityPreference = preferences[Preference.ACCESSIBILITY_GUIDANCE];
    let medataKeys = [];
    if (disabilityPreference === AccessibilityGuidanceOption.VISUALLY_IMPAIRED.id) {
      medataKeys = [1];
    }
    let reassuranceDistanceOption = this.__getOptionById(
      ReassuranceDistanceOption,
      preferences[Preference.REASSURANCE_DISTANCE],
    ).value;
    let unit = preferences[Preference.DISTANCE_UNIT];
    let unitConversion;
    if (unit === DistanceUnitOption.STEPS.id) {
      unitConversion = StepUnitConversion;
    } else {
      unitConversion = MetersUnitConversion;
    }
    ProximiioMapbox.ttsEnabled(preferences[Preference.VOICE_GUIDANCE]);
    ProximiioMapbox.ttsDecisionAlert(preferences[Preference.DECISION_POINTS], medataKeys);
    ProximiioMapbox.ttsHazardAlert(preferences[Preference.HAZARDS], medataKeys);
    ProximiioMapbox.ttsHeadingCorrectionEnabled(preferences[Preference.HEADING_CORRECTION], medataKeys);
    ProximiioMapbox.ttsLandmarkAlert(preferences[Preference.LANDMARKS], medataKeys);
    ProximiioMapbox.ttsSegmentAlert(preferences[Preference.SEGMENTS], preferences[Preference.SEGMENTS], medataKeys);
    ProximiioMapbox.ttsReassuranceInstructionEnabled(preferences[Preference.REASSURANCE_ENABLED]);
    ProximiioMapbox.ttsReassuranceInstructionDistance(reassuranceDistanceOption);
    ProximiioMapbox.setUnitConversion(unitConversion);
    ProximiioMapbox.setLevelOverrideMap({
      '-1': 0,
      '0': 1,
      '1': 2,
      '2': 3,
      '3': 4,
      '4': 5,
      '5': 6,
      '6': 7,
    });
  }

  /**
   * Finds appropriate option matching ID.
   * @param option {Object}
   * @param id {String}
   * @returns {undefined|*}
   * @private
   */
  __getOptionById(option, id) {
    let result = Object.entries(option).filter((it) => it[1].id === id);
    if (result.length > 0) {
      return result[0][1];
    } else {
      return undefined;
    }
  }

  /**
   * Returns value if exists otherwise returns passed default value.
   * @param value
   * @param defaultValue
   * @returns {*}
   * @private
   */
  __getPreferenceOrDefault(value, defaultValue) {
    if (value !== undefined && value !== null) {
      return value;
    } else {
      return defaultValue;
    }
  }

  /**
   * Helper method to find route while applying restrictions set by user in preference screen.
   * @param destinationFeatureId
   * @returns {Promise<void>}
   */
  async routeFindWithPreferences(destinationFeatureId) {
    let preferences = this.getPreferences();
    let wayfindingOptions: ProximiioWayfindingOptions = {
      avoidElevators: preferences[Preference.AVOID_ELEVATORS],
      avoidNarrowPaths: preferences[Preference.AVOID_NARROW_ROUTES],
      avoidRevolvingDoors: preferences[Preference.AVOID_REVOLVING_DOORS],
      avoidStaircases: preferences[Preference.AVOID_STAIRS],
      pathFixDistance: 2.0,
    };
    let routeConfiguration: ProximiioRouteConfiguration = {
      destinationFeatureId: destinationFeatureId,
      wayfindingOptions: wayfindingOptions,
    };
    ProximiioMapbox.route.findAndPreview(routeConfiguration);
  }
}

export default PreferenceHelper = new PreferenceHelper();
