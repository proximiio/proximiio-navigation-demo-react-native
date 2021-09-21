import { Feature } from 'react-native-proximiio-mapbox';
import { SearchCategory } from './utils/SearchCategories';

export type RootStackParamList = {
  MapScreen: {
    feature?: Feature
  };
  SearchScreen: {
    searchCategory: SearchCategory
  };
  PreferenceScreen: undefined;
  PolicyScreen: undefined;
};
