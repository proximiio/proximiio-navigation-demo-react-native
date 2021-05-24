import * as React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import CardView from '../../utils/CardView';

import ProximiioMapbox, {
  Amenity,
  Feature,
  ProximiioMapboxEvents,
} from 'react-native-proximiio-mapbox';
import SearchCategories, {SearchCategory} from './SearchCategories';
import SearchEmptyItem from './SearchEmptyItem';
import {IconButton} from 'react-native-paper';
import {TouchableHighlight} from 'react-native-gesture-handler';
import SearchFooter from './SearchFooter';
import {Colors} from '../../Style';
import {PROXIMIIO_TOKEN} from '../../utils/Constants';
import i18n from 'i18next';

const numColumns = Math.round(Dimensions.get('window').width / 200);
const searchItemFlex = 1 / numColumns;

interface Props {
  navigation: any;
}
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
    this.featureSubscription = ProximiioMapbox.subscribe(ProximiioMapboxEvents.FEATURES_CHANGED, () => this.loadAmenitiesAndFeatures());
  }

  componentWillUnmount() {
    console.log('component will unmount');
    if (this.featureSubscription) {
      this.featureSubscription.remove();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <CardView style={styles.searchInputCard}>
          <View style={styles.searchInputCardContent}>
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
            <View style={styles.searchInput}>
              <TextInput
                placeholder={i18n.t('common.search_hint')}
                onChangeText={(title) => this.updateSearchFilter(title)}
                autoFocus
              />
            </View>
          </View>
        </CardView>
        <FlatList
          contentContainerStyle={styles.scrollviewContent}
          data={this.state.filteredFeatureList}
          numColumns={numColumns}
          ListEmptyComponent={<SearchEmptyItem/>}
          ListFooterComponent={this.state.currentItemCount > 0 && <SearchFooter/>}
          ListHeaderComponent={this.state.featureListFilterTitle === '' && !this.state.featureCategoryFilter && this.state.featureList.length > 0 &&
          <SearchCategories onCategorySelected={this.updateCategoryFilter.bind(this)}/>}
          renderItem={({item}) => this.renderSearchItem(item)}
          style={styles.searchItemList}
        />
      </View>
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
      <View style={styles.searchItem}>
        <CardView style={styles.searchItemCard} key={poiFeature.properties.id}>
          <TouchableHighlight
            activeOpacity={0.5}
            underlayColor="#eee"
            onPress={() => {
              this.props.navigation.navigate('ItemDetail', {item: poiFeature});
            }}
            style={styles.searchItemTouch}>
            <View>
              <Image
                source={this.getCoverImage(poiFeature)}
                style={styles.searchItemImage}
              />
              <Text style={styles.searchItemTitle} numberOfLines={1}>
                {poiFeature.getTitle(i18n.language)}
              </Text>
              <Text style={styles.searchItemFloor}>
                {this.getLevelString(poiFeature)}
              </Text>
            </View>
          </TouchableHighlight>
        </CardView>
      </View>
    );
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
      if (
        !this.state.amenityMap.has(item.properties.amenity)
        || this.state.amenityMap.get(item.properties.amenity).category_id !== category.amenityCategoryId
      ) {
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
  private getCoverImage(feature) {
    let imageUrlList = feature.getImageUrls(PROXIMIIO_TOKEN);
    if (!imageUrlList || imageUrlList.length === 0) {
      return null;
    } else {
      return {
        uri: imageUrlList[0],
      };
    }
  }

  /**
   * Get nice level string for feature level
   * @param feature {Feature}
   * @returns {string}
   * @private
   */
  private getLevelString(feature) {
    let level = '';
    switch (feature.properties.level) {
      case -1:
        level = i18n.t('common.floor_0');
        break;
      case 0:
        level = i18n.t('common.floor_1');
        break;
      case 1:
        level = i18n.t('common.floor_2');
        break;
      case 2:
        level = i18n.t('common.floor_3');
        break;
      case 3:
        level = i18n.t('common.floor_4');
        break;
      default:
        level = i18n.t('common.floor_n', {count: (feature.properties.level + 1)});
    }
    return level;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    height: 400,
    flex: 1,
  },
  searchItemTouch: {
    flex: 1,
    borderRadius: 8,
  },
  searchItem: {
    flex: searchItemFlex,
  },
  searchItemCard: {
    margin: 8,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  searchItemImage: {
    aspectRatio: 1.766,
    flexDirection: 'row',
    backgroundColor: Colors.gray,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    margin: 0,
  },
  searchItemTitle: {
    backgroundColor: Colors.primary,
    textAlign: 'center',
    color: Colors.white,
    justifyContent: 'center',
    padding: 8,
    flex: 1,
  },
  searchItemFloor: {
    textAlign: 'center',
    justifyContent: 'center',
    padding: 8,
    flex: 1,
  },
  searchItemList: {
    flex: 1,
  },
  scrollviewContent: {
    padding: 8,
    flexGrow: 1,
  },
  searchInputCard: {
    margin: 16,
  },
  searchInputCardContent: {
    alignItems: 'center',
    flexDirection: 'row',
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
