/**
 * Proximi.io authentication token.
 */
// KEKO
export const PROXIMIIO_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImlzcyI6ImUyNTk5MGJkLTQwMTktNGI2NS1hODRmLWI3YWVkMGJkNjZhYSIsInR5cGUiOiJhcHBsaWNhdGlvbiIsImFwcGxpY2F0aW9uX2lkIjoiNjE3ZWU0NGMtNjU4Zi00ZDJmLWI0OTYtZGJmMmY0Mzg2OTViIn0.yLXqlQH97Nec2PRKL4Pa-IWd9Ac7zKKxli0TLyCqHXU';
// Maria
// export const PROXIMIIO_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImlzcyI6IjBjNGYyNjhmLTZjMmYtNDM5Zi1iMTI3LTMzYTcwZGY2MmMwZSIsInR5cGUiOiJhcHBsaWNhdGlvbiIsImFwcGxpY2F0aW9uX2lkIjoiZWJmYTJjMzItNzA1Mi00ZGQxLWEyNTQtOWQ0ZjNkNjg2NzIxIn0.qKK7EK_oWNpoPgh89hZvDAECZ0s52xCCP2XpTDCv__4';
// Pori - Satasairaala
// export const PROXIMIIO_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImlzcyI6ImQ4ODM5OTEzLTFiZDgtNDI0OC04N2IzLWI4ZjUzYjU5ZWIyNyIsInR5cGUiOiJhcHBsaWNhdGlvbiIsImFwcGxpY2F0aW9uX2lkIjoiMmQzZGZjOTUtYWJkNi00NWMzLWI3NDktM2I1NjM2MzI0Zjk0In0.pNTWHrLl9VT7K8ndNLiZjkXnKEuO0U8KyMVy_5omEh4";
// Matej
// export const PROXIMIIO_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImlzcyI6IjczNzQ4MzdjOTE3MzQzN2VjM2ZmYjRhZWMyNmUxOGI4IiwidHlwZSI6ImFwcGxpY2F0aW9uIiwiYXBwbGljYXRpb25faWQiOiJhYTk2Y2U1Yy03YmJlLTQ2NDUtYTEzMC0zMDdiY2Q5MDY3MjUifQ.xVnuEalY756BOTqpetKmFlr_U-dUhct5H2_DufG2Is8';


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
