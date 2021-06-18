/**
 * Proximi.io authentication token.
 */
// KEKO
export const PROXIMIIO_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImlzcyI6ImUyNTk5MGJkLTQwMTktNGI2NS1hODRmLWI3YWVkMGJkNjZhYSIsInR5cGUiOiJhcHBsaWNhdGlvbiIsImFwcGxpY2F0aW9uX2lkIjoiNjE3ZWU0NGMtNjU4Zi00ZDJmLWI0OTYtZGJmMmY0Mzg2OTViIn0.yLXqlQH97Nec2PRKL4Pa-IWd9Ac7zKKxli0TLyCqHXU';
// Pori - Satasairaala
// export const PROXIMIIO_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImlzcyI6ImQ4ODM5OTEzLTFiZDgtNDI0OC04N2IzLWI4ZjUzYjU5ZWIyNyIsInR5cGUiOiJhcHBsaWNhdGlvbiIsImFwcGxpY2F0aW9uX2lkIjoiMmQzZGZjOTUtYWJkNi00NWMzLWI3NDktM2I1NjM2MzI0Zjk0In0.pNTWHrLl9VT7K8ndNLiZjkXnKEuO0U8KyMVy_5omEh4";
// Matej
// export const PROXIMIIO_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImlzcyI6IjczNzQ4MzdjOTE3MzQzN2VjM2ZmYjRhZWMyNmUxOGI4IiwidHlwZSI6ImFwcGxpY2F0aW9uIiwiYXBwbGljYXRpb25faWQiOiJhYTk2Y2U1Yy03YmJlLTQ2NDUtYTEzMC0zMDdiY2Q5MDY3MjUifQ.xVnuEalY756BOTqpetKmFlr_U-dUhct5H2_DufG2Is8';

export const MAP_STARTING_BOUNDS = {
  ne: [24.92318382557025, 60.16765390266633],
  sw: [24.921130397063337, 60.16592864674095],
  // Pori
  // ne: [21.781533540771647, 61.47522317850135],
  // sw: [21.77686100873956, 61.47073956518548],
};

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
export const LEVEL_OVERRIDE_MAP = levelOverrideMap;
