import {ProximiioUnitConversion} from 'react-native-proximiio-mapbox';
import PreferenceHelper, {DistanceUnitOption, Preference} from "./PreferenceHelper";
import i18n from "i18next";

/**
 * This file contains unit conversion configurations used by Proximi.io mapbox library.
 * Unit conversion are utilized during navigation guidance to handle conversion from meters to desired units.
 */

/**
 * Length of a single step in meters.
 * @type {number}
 */
export const STEP_LENGTH = 0.65;

/**
 * Step unit conversion. Uses:
 * - steps for distances < 1km,
 * - kilometers with one decimal for distances < 2km,
 * - kilometers without decimals otherwise.
 */
export const StepUnitConversion: ProximiioUnitConversion = {
  stageList: [
    {
      unitName: 'steps',
      unitConversionToMeters: 1 / STEP_LENGTH, // 1 steps = 0.65
      minValueInMeters: 0,
      decimalPoints: 0,
    },
    {
      unitName: 'kilometers',
      unitConversionToMeters: 0.001,
      minValueInMeters: 1000,
      decimalPoints: 1,
    },
    {
      unitName: 'kilometers',
      unitConversionToMeters: 0.001,
      minValueInMeters: 2000,
      decimalPoints: 0,
    },
  ],
};

/**
 * Step unit conversion. Uses:
 * - meters for distances < 1km,
 * - kilometers with one decimal for distances < 2km,
 * - kilometers without decimals otherwise.
 */
export const MetersUnitConversion: ProximiioUnitConversion = {
  stageList: [
    {
      unitName: 'meters',
      unitConversionToMeters: 1,
      minValueInMeters: 0,
      decimalPoints: 0,
    },
    {
      unitName: 'kilometers',
      unitConversionToMeters: 0.001,
      minValueInMeters: 1000,
      decimalPoints: 1,
    },
    {
      unitName: 'kilometers',
      unitConversionToMeters: 0.001,
      minValueInMeters: 2000,
      decimalPoints: 0,
    },
  ],
};
