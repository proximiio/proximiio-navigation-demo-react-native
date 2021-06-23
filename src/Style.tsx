import {DefaultTheme} from '@react-navigation/native';

/**
 * Define base colors here
 */
const ColorsBase = {
  black: '#000000',
  blue: '#08aee6',
  blueLight2: '#4F86C3',
  blueDark: '#0783AC',
  red: '#ED246C',
  gray: '#999999',
  grayLight: '#cccccc',
  greenLight: '#9EEE92',
  offWhite: '#eeeeee',
  white: '#ffffff',
  pink: '#DB62B2',
};

/**
 * Define specific uses here
 */
export const Colors = {
  ...ColorsBase,
  primary: ColorsBase.blue,
  primaryDark: ColorsBase.blueDark,
  hazardBackground: ColorsBase.red,
  segmentBackground: ColorsBase.gray,
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
