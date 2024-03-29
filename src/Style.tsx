import {DefaultTheme} from '@react-navigation/native';

/**
 * Define base colors here
 */
const ColorsBase = {
  black: '#000000',
  blue: '#08aee6',
  blueLight2: '#4F86C3',
  blueLight3: '#71D9DE',
  blueDark: '#0783AC',
  blueDark2: '#004B8A',
  red: '#ED246C',
  gray: '#999999',
  grayLight: '#cccccc',
  greenLight: '#9EEE92',
  offWhite: '#eeeeee',
  white: '#ffffff',
  pink: '#DB62B2',
  yellow: '#E2CE19',
  purple: '#8C62B6',
};

/**
 * Define specific uses here
 */
export const Colors = {
  ...ColorsBase,
  primary: ColorsBase.blue,
  primaryDark: ColorsBase.blueDark,
  hazardBackground: ColorsBase.red,
  segmentBackground: ColorsBase.blue,
  background: ColorsBase.offWhite,
  navigationContentColor: ColorsBase.white,
  floorSelectorBackground: ColorsBase.blueDark,
  floorSelectorText: ColorsBase.white,
  fab: ColorsBase.blue,
  searchCategoryFilter: '#bfbfbf',
  searchCategoryFilterClose: '#a0a0a0',
  previewTripDetailChipBackground: ColorsBase.grayLight,
};

export const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(255,0,0)',
  },
};

export const Shadow = {
  elevation: 5,
  shadowColor: Colors.black,
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
};
