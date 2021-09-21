import * as React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput, TouchableOpacity,
  View,
} from 'react-native';
import CardView from '../../utils/CardView';

import ProximiioMapbox, {
  Amenity,
  Feature,
  ProximiioMapboxEvents,
} from 'react-native-proximiio-mapbox';
import {SearchCategory} from '../../utils/SearchCategories';
import SearchEmptyItem from './SearchEmptyItem';
import {IconButton} from 'react-native-paper';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {Colors} from '../../Style';
import {LEVEL_OVERRIDE_MAP} from '../../utils/Constants';
import i18n from 'i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../RootStack';

type Props = StackScreenProps<RootStackParamList, 'SearchScreen'>;

interface State {
  /**
   * Map of amenityId => amenity.
   */
  amenityMap: Map<String, Amenity>;
  /**
   * Full list of POI features.
   */
  featureList: Feature[];
  /**
   * POI features matching filters (title, category), subset of featureList.
   */
  filteredFeatureList: Feature[];
  /**
   * Filter POIs by title.
   */
  featureListFilterTitle: String | undefined;
  /**
   * Filter POIs by search category.
   */
  featureCategoryFilter: SearchCategory | undefined;
  /**
   * Number of POIs matching filters and showing in the list.
   */
  currentItemCount: Number;
}

/**
 *
 */
export default class SearchScreen extends React.Component<Props, State> {
  state = {
    amenityMap: new Map(),
    featureList: [],
    filteredFeatureList: [],
    featureListFilterTitle: '',
    featureCategoryFilter: undefined,
    currentItemCount: 0,
  };
  featureSubscription = undefined;

  componentDidMount() {
    this.loadAmenitiesAndFeatures();
    if (this.props.route && this.props.route.params && this.props.route.params.searchCategory) {
      this.state.featureCategoryFilter = this.props.route.params.searchCategory;
    }
    this.featureSubscription = ProximiioMapbox.subscribe(ProximiioMapboxEvents.FEATURES_CHANGED, () => this.loadAmenitiesAndFeatures());
  }

  componentWillUnmount() {
    if (this.featureSubscription) {
      this.featureSubscription.remove();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderSearchInputCard()}
        <FlatList
          contentContainerStyle={styles.scrollviewContent}
          data={this.state.filteredFeatureList}
          // numColumns={numColumns}
          ListEmptyComponent={<SearchEmptyItem/>}
          // ListFooterComponent={this.state.currentItemCount > 0 && <SearchFooter/>}
          ListHeaderComponent={this.renderSearchHeader()}
          renderItem={({item}) => this.renderSearchItem(item)}
          style={styles.searchItemList}
        />
      </View>
    );
  }

  private renderSearchInputCard() {
    return (
      <CardView style={styles.searchInputCard}>
        <View style={styles.searchInputCardContent}>
          <Image style={styles.searchIcon} source={require('../../images/ic_search.png')} />
          <View style={styles.searchInput}>
            <TextInput
              placeholder={i18n.t('common.search_hint')}
              onChangeText={(title) => this.updateSearchFilter(title)}
              autoFocus
            />
          </View>
          {this.state.featureCategoryFilter && (
            <TouchableHighlight
              activeOpacity={0.5}
              underlayColor="#fff"
              onPress={() => this.updateCategoryFilter(undefined)}>
              <View style={styles.categoryFilter}>
                <Text>{i18n.t(this.state.featureCategoryFilter.title)}</Text>
                <IconButton icon="close" size={16} style={styles.categoryFilterClose}/>
              </View>
            </TouchableHighlight>
          )}
        </View>
      </CardView>
    );
  }

  private renderSearchHeader() {
    if (this.state.filteredFeatureList.length === 0) {
      return;
    }
    return (
      <Text style={styles.searchItemHeader}>{i18n.t('searchscreen.results', {count: this.state.filteredFeatureList.length})}</Text>
    );
  }

  /**
   * Render single item in search.
   * @param poiFeature {Feature}
   * @returns {JSX.Element}
   * @private
   */
  private renderSearchItem(poiFeature) {
    return (
      <TouchableOpacity
        activeOpacity={0.4}
        onPress={() => this.openPoi(poiFeature)}>
        <View style={styles.searchItem}>
          <Image
            source={this.getFeatureImage(poiFeature)}
            style={styles.searchItemImage}
          />
          <View style={styles.searchItemDescription}>
            <Text style={styles.searchItemTitle} numberOfLines={1}>
              {poiFeature.getTitle(i18n.language)}
            </Text>
            <Text style={styles.searchItemFloor}>
              {this.getLevelString(poiFeature)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  private openPoi(feature: Feature) {
    this.props.navigation.navigate('MapScreen', { feature });
  }

  /**
   * Update search filter by title.
   * @param title {String}
   * @private
   */
  private updateSearchFilter(title) {
    this.setState({featureListFilterTitle: title}, () => {
      this.updateFilteredFeatureList();
    });
  }

  /**
   * Update search filter by category
   */
  private updateCategoryFilter(category: SearchCategory | undefined) {
    this.setState({featureCategoryFilter: category}, () => {
      this.updateFilteredFeatureList();
    });
  }

  /**
   * Updates state with POIs matching filters.
   * @private
   */
  private async updateFilteredFeatureList() {
    let list = this.state.featureList.filter((item) =>
      this.matchesSearchItemTitle(
        item,
        this.state.featureListFilterTitle,
        this.state.featureCategoryFilter,
      ),
    );
    this.setState({
      currentItemCount: list.length,
      filteredFeatureList: list,
    });
  }

  /**
   * Update amenity and feature data and update component state.
   * @private
   */
  private loadAmenitiesAndFeatures() {
    // Create map amenity id => amenity object for easier access
    let amenityMap = new Map();
    const amenities = ProximiioMapbox.getAmenities();
    amenities.forEach((item) => amenityMap.set(item.id, item));
    // Load features, filter out POIs and sort them
    const features = ProximiioMapbox.getFeatures();
    const filteredFeatures = features.filter((feature) => feature.properties.type === 'poi');
    filteredFeatures.sort((a, b) => {
      const orderBool = a.properties.title > b.properties.title;
      return orderBool ? 1 : -1;
    });
    // Update state with amenities and POIs
    this.setState(
      {
        amenityMap: amenityMap,
        featureList: filteredFeatures,
      },
      () => this.updateFilteredFeatureList(),
    );
  }

  /**
   * Tests if feature matches fiters (title, category).
   * @param item {Feature}
   * @param title {String}
   * @param category {SearchCategory}
   * @returns {boolean}
   * @private
   */
  private matchesSearchItemTitle(item: Feature, title: String, category: SearchCategory) {
    if (category) {
      if (item.properties.amenity !== category.amenityId) {
        return false;
      }
    }

    let featureTitle = item.getTitle(i18n.language);
    if (featureTitle === undefined) {
      featureTitle = '';
    }
    return (
      title === '' ||
      (
        item.properties.title !== undefined &&
        featureTitle.toLocaleLowerCase().includes(title.toLocaleLowerCase())
      )
    );
  }

  /**
   * Get cover image for feature.
   * @param feature {Feature}
   * @returns {null|{uri: string}}
   * @private
   */
  private getFeatureImage(feature) {
    let amenity: Amenity = this.state.amenityMap.has(feature.properties.amenity) ? this.state.amenityMap.get(feature.properties.amenity) : null;
    return amenity ? {uri: amenity.icon} : null;
  }

  /**
   * Get nice level string for feature level
   * @param feature {Feature}
   * @returns {string}
   * @private
   */
  private getLevelString(feature) {
    let overrideLevel = LEVEL_OVERRIDE_MAP.get(feature.properties.level);
    let levelString = i18n.t('common.floor_' + overrideLevel);
    return levelString;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    height: 400,
    flex: 1,
  },
  searchItemTouch: {
    backgroundColor: 'red',
  },
  searchItem: {
    // flex: searchItemFlex,
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  searchItemImage: {
    aspectRatio: 1,
    flexDirection: 'row',
    backgroundColor: Colors.gray,
    borderRadius: 48,
    margin: 8,
    width: 48,
  },
  searchItemDescription: {
    alignSelf: 'center',
  },
  searchItemTitle: {
    paddingHorizontal: 8,
  },
  searchItemFloor: {
    color: Colors.gray,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  searchItemList: {
    flex: 1,
  },
  searchItemHeader: {
    paddingHorizontal: 16,
    fontSize: 16,
    paddingTop: 4,
    paddingBottom: 12,
  },
  scrollviewContent: {
    flexGrow: 1,
  },
  searchInputCard: {
    margin: 16,
    borderRadius: 100,
  },
  searchInputCardContent: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  searchIcon: {
    paddingHorizontal: 8,
    width: 24,
    height: 24,
  },
  searchInput: {
    flex: 1,
  },
  categoryFilter: {
    backgroundColor: Colors.searchCategoryFilter,
    borderRadius: 50,
    flex: 0,
    flexDirection: 'row',
    paddingStart: 12,
    paddingEnd: 6,
    paddingVertical: 6,
  },
  categoryFilterClose: {
    backgroundColor: Colors.searchCategoryFilterClose,
    marginStart: 4,
    marginEnd: 0,
    marginVertical: 0,
  },
});
