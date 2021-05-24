import {ProximiioUnitConversion} from 'react-native-proximiio-mapbox/src/types';

/**
 * This file contains unit conversion configurations used by Proximi.io mapbox library.
 * Unit conversion are utilized during navigation guidance to handle conversion from meters to desired units.
 */

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
      unitConversionToMeters: 1.538461538461538, // 1 steps = 0.65
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
