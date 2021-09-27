/**
 * Proximi.io authentication token.
 */
export const PROXIMIIO_TOKEN = '';
/**
 * Initial map bounds, map will start showing area within these bounds.
 */
export const MAP_STARTING_BOUNDS = {
  ne: [24.92318382557025, 60.16765390266633],
  sw: [24.921130397063337, 60.16592864674095],
};

/**
 * Geofence of area covered by localization, it is used to hide user location marker and stop position updates outside of
 * supported area.
 */
export const COVERED_LOCATION_GEOFENCE_ID = '17b96737-0660-4209-8667-090fbc3329a9';
export const IN_COVERED_AREAS_ONLY = false;
/**
 * Override of map levels. Proximi.io considers '0th floor' to be 'ground floor', but
 * it is customary in some regions to use different system, e.g. counting from 1 ('ground floor' is '1st floor').
 */
const generateLevelOverride = () => {
  const levelOverrideMap = new Map();
  levelOverrideMap.set(-1, -1);
  levelOverrideMap.set(0, 1);
  levelOverrideMap.set(1, 2);
  levelOverrideMap.set(2, 3);
  levelOverrideMap.set(3, 4);
  levelOverrideMap.set(4, 5);
  levelOverrideMap.set(5, 6);
  levelOverrideMap.set(6, 7);
  levelOverrideMap.set(7, 8);
  levelOverrideMap.set(8, 9);
  levelOverrideMap.set(9, 10);
  levelOverrideMap.set(10, 11);
  levelOverrideMap.set(11, 12);
  levelOverrideMap.set(12, 13);
  levelOverrideMap.set(13, 14);
  levelOverrideMap.set(14, 15);
  levelOverrideMap.set(15, 16);
  levelOverrideMap.set(16, 17);
  return levelOverrideMap;
};

export const LEVEL_OVERRIDE_MAP = generateLevelOverride();
