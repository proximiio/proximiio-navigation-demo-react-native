import DefaultPreference from 'react-native-default-preference';
import ProximiioMapbox, {
  ProximiioWayfindingOptions,
  ProximiioRouteConfiguration, Feature,
} from 'react-native-proximiio-library';
import {
  MetersUnitConversion,
  StepUnitConversion,
} from './UnitConversions';
import {UnitConversionHelper} from './UnitConversionHelper';
import {PreferenceOptionItem} from '../ui/preferences/PreferenceOptionItem';
import {DistanceUnitOption} from '../ui/preferences/DistanceUnitOption';
import * as turf from '@turf/turf';

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
  // Privacy policy
  PRIVACY_POLICY_ACCEPTED: 'PRIVACY_POLICY_ACCEPTED',
};

/**
 * Options for accessibility.
 */
export const AccessibilityGuidanceOption = {
  NONE: {id: 'none', name: 'preferencescreen.accessibility_option_none'} as PreferenceOptionItem,
  VISUALLY_IMPAIRED: {id: 'visually_impaired', name: 'preferencescreen.accessibility_option_visual'} as PreferenceOptionItem,
};



/**
 * Options for reassuring user about current route each X meters.
 */
export const ReassuranceDistanceOption = {
  METERS_10: {id: 'meters_10', name: 'preferencescreen.reassurance_10m', value: 10} as PreferenceOptionItem,
  METERS_15: {id: 'meters_15', name: 'preferencescreen.reassurance_15m', value: 15} as PreferenceOptionItem,
  METERS_20: {id: 'meters_20', name: 'preferencescreen.reassurance_20m', value: 20} as PreferenceOptionItem,
  METERS_25: {id: 'meters_25', name: 'preferencescreen.reassurance_25m', value: 25} as PreferenceOptionItem,
};

/**
 * ID of amenity for parking spaces. Used to add a parking as a waypoint for navigation.
 */
const AMENITY_PARKING_ID = 'c1eaab1a-3f02-4491-a515-af8d628f74fb:9da478a4-b0ce-47ba-8b44-32a4b31150a8';

/**
 * Helper class to manage user preferences.
 */
class PreferenceHelper {

  static getPrivacyPolicyAccepted(): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      const acceptedPreference = await DefaultPreference.get(Preference.PRIVACY_POLICY_ACCEPTED);
      const accepted = acceptedPreference ? JSON.parse(acceptedPreference) : false;
      resolve(accepted);
    });
  }

  static async setPrivacyPolicyAccepted() {
    await DefaultPreference.set(Preference.PRIVACY_POLICY_ACCEPTED, JSON.stringify(true));
  }

  /**
   * Returns object with all preference values.
   * @returns {Promise<unknown>}
   */
  static getPreferences(): Promise<any> {
    return new Promise((resolve, _) => {
      let preferenceKeys = Object.entries(Preference).map((it) => it[0]);
      DefaultPreference.getMultiple(preferenceKeys).then(
        (preferenceResults) => {
          let preferences = {
            AVOID_STAIRS: this.getPreferenceOrDefault(JSON.parse(preferenceResults[0]), false),
            AVOID_ELEVATORS: this.getPreferenceOrDefault(JSON.parse(preferenceResults[1]), false),
            AVOID_REVOLVING_DOORS: this.getPreferenceOrDefault(JSON.parse(preferenceResults[2]), false),
            AVOID_NARROW_ROUTES: this.getPreferenceOrDefault(JSON.parse(preferenceResults[3]), false),
            DISTANCE_UNIT: this.getPreferenceOrDefault(preferenceResults[4], DistanceUnitOption.METERS.id),
            VOICE_GUIDANCE: this.getPreferenceOrDefault(JSON.parse(preferenceResults[5]), true),
            HEADING_CORRECTION: this.getPreferenceOrDefault(JSON.parse(preferenceResults[6]), true),
            DECISION_POINTS: this.getPreferenceOrDefault(JSON.parse(preferenceResults[7]), false),
            HAZARDS: this.getPreferenceOrDefault(JSON.parse(preferenceResults[8]), false),
            LANDMARKS: this.getPreferenceOrDefault(JSON.parse(preferenceResults[9]), false),
            SEGMENTS: this.getPreferenceOrDefault(JSON.parse(preferenceResults[10]), true),
            REASSURANCE_ENABLED: this.getPreferenceOrDefault(JSON.parse(preferenceResults[11]), false),
            REASSURANCE_DISTANCE: this.getPreferenceOrDefault(preferenceResults[12], ReassuranceDistanceOption.METERS_15.id),
            ACCESSIBILITY_GUIDANCE: this.getPreferenceOrDefault(preferenceResults[13], AccessibilityGuidanceOption.NONE.id),
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
  static async setPreferences(preferences) {
    await DefaultPreference.setMultiple(preferences);
    await this.applyPreferences();
  }

  /**
   * Reads preferences and applies them to proximi.io libraries.
   */
  static async applyPreferences() {
    let preferences = await this.getPreferences();
    let disabilityPreferenceId = preferences[Preference.ACCESSIBILITY_GUIDANCE];
    let medataKeys = [];
    if (disabilityPreferenceId === AccessibilityGuidanceOption.VISUALLY_IMPAIRED.id) {
      medataKeys = [1];
    }
    let reassuranceDistanceOption = this.getOptionById(
      ReassuranceDistanceOption,
      preferences[Preference.REASSURANCE_DISTANCE],
    ).value;
    let unitId = preferences[Preference.DISTANCE_UNIT];
    let unitConversion;
    if (unitId === DistanceUnitOption.STEPS.id) {
      unitConversion = StepUnitConversion;
    } else {
      unitConversion = MetersUnitConversion;
    }
    ProximiioMapbox.ttsEnabled(preferences[Preference.VOICE_GUIDANCE]);
    ProximiioMapbox.ttsDecisionAlert(preferences[Preference.DECISION_POINTS], medataKeys);
    ProximiioMapbox.ttsHazardAlert(preferences[Preference.HAZARDS], medataKeys);
    ProximiioMapbox.ttsHeadingCorrectionEnabled(preferences[Preference.HEADING_CORRECTION]);
    ProximiioMapbox.ttsLandmarkAlert(preferences[Preference.LANDMARKS], medataKeys);
    ProximiioMapbox.ttsSegmentAlert(preferences[Preference.SEGMENTS], preferences[Preference.SEGMENTS], medataKeys);
    ProximiioMapbox.ttsReassuranceInstructionEnabled(preferences[Preference.REASSURANCE_ENABLED]);
    ProximiioMapbox.ttsReassuranceInstructionDistance(reassuranceDistanceOption);
    ProximiioMapbox.setUnitConversion(unitConversion);
    UnitConversionHelper.refreshPreferenceDistanceUnit(preferences);
  }

  /**
   * Finds appropriate option matching ID.
   * @param option {Object}
   * @param id {String}
   * @returns {undefined|*}
   * @private
   */
  private static getOptionById(option, id): PreferenceOptionItem {
    let result = Object.entries(option).filter((it) => it[1].id === id);
    if (result.length > 0) {
      return result[0][1] as PreferenceOptionItem;
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
  private static getPreferenceOrDefault(value, defaultValue) {
    if (value !== undefined && value !== null) {
      return value;
    } else {
      return defaultValue;
    }
  }

  /**
   * Helper method to find route while applying restrictions set by user in preference screen.
   * @param destinationFeatureId
   * @param withParking
   * @returns {Promise<void>}
   */
  static async routeFindWithPreferences(destinationFeatureId: String, withParking: boolean = false) {
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
    if (withParking) {
      const destination = ProximiioMapbox.getFeatures().find((it) => it.id === destinationFeatureId);
      const parkingFeatures = ProximiioMapbox.getFeatures().filter((it) => it.properties.amenity === AMENITY_PARKING_ID);
      const bestParking = parkingFeatures.reduce((prev, curr) => this.returnFeatureNearerToDestination(destination, curr, prev));
      routeConfiguration.waypointFeatureIdList = [[bestParking.id]];
    }
    ProximiioMapbox.route.findAndPreview(routeConfiguration);
  }

  private static returnFeatureNearerToDestination(destination: Feature, featureA: Feature, featureB?: Feature): Feature {
    const distanceA = turf.distance(featureA, destination, {units: 'meters'});
    const distanceB = featureB ? turf.distance(featureB, destination, {units: 'meters'}) : null;
    if (!distanceB || distanceA < distanceB) {
      return featureA;
    } else {
      return featureB;
    }
  }
}

export default PreferenceHelper;
