import {DefaultTheme} from '@react-navigation/native';

/**
 * Define base colors here
 */
const Colors = {
  black: '#000000',
  blue: '#08aee6',
  blueDark: '#0783AC',
  red: '#ed174b',
  gray: '#999999',
  grayLight: '#cccccc',
  offWhite: '#eeeeee',
  white: '#ffffff',
};

/**
 * Define specific uses here
 */
Colors.primary = Colors.blue;
Colors.primaryDark = Colors.blueDark;
Colors.hazardBackground = Colors.red;
Colors.segmentBackground = Colors.gray;
Colors.background = Colors.offWhite;
Colors.navigationContentColor = Colors.white;
Colors.floorSelectorBackground = Colors.blueDark;
Colors.floorSelectorText = Colors.white;
Colors.fab = Colors.blue;
Colors.searchCategoryFilter = '#bfbfbf';
Colors.searchCategoryFilterClose = '#a0a0a0';
Colors.previewTripDetailChipBackground = Colors.grayLight;

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(255,0,0)',
  },
};

console.log('here');

export {MyTheme, Colors};
