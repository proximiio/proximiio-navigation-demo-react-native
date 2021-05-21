import React, {Component} from 'react';
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
import i18n from "i18next";

const numColumns = (Dimensions.get('window').width / 200).toFixed(0);
const searchItemFlex = 1 / numColumns;

interface Props {}
interface State {
  /**
   * Map of amenityId => amenity.
   */
  amenityMap: Map;
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
export default class SearchScreen extends Component<Props, State> {
  state = {
    amenityMap: new Map(),
    featureList: [],
    filteredFeatureList: [],
    featureListFilterTitle: '',
    featureCategoryFilter: null,
    currentItemCount: 0,
  };

  componentDidMount() {
    this.__loadAmenitiesAndFeatures();
    this.__featureSubscription = ProximiioMapbox.subscribe(ProximiioMapboxEvents.FEATURES_CHANGED, () => this.__loadAmenitiesAndFeatures());
  }

  componentWillUnmount() {
    console.log('component will unmount');
    if (this.__featureSubscription) {
      this.__featureSubscription.remove();
    }
  }

  render() {
    return (
        <View style={style.container}>
          <CardView style={style.searchInputCard}>
            <View style={style.searchInputCardContent}>
              {this.state.featureCategoryFilter && (
                  <TouchableHighlight
                      activeOpacity={0.5}
                      underlayColor="#fff"
                      onPress={() => this.__updateCategoryFilter()}>
                    <View style={style.categoryFilter}>
                      <Text>{this.state.featureCategoryFilter.title}</Text>
                      <IconButton icon="close" size={16} style={style.categoryFilterClose}/>
                    </View>
                  </TouchableHighlight>
              )}
              <View style={style.searchInput}>
                <TextInput
                    placeholder={i18n.t('common_search_hint')}
                    onChangeText={(title) => this.__updateSearchFilter(title)}
                    autoFocus
                />
              </View>
            </View>
          </CardView>
          <FlatList
              contentContainerStyle={style.scrollviewContent}
              data={this.state.filteredFeatureList}
              numColumns={numColumns}
              ListEmptyComponent={<SearchEmptyItem/>}
              ListFooterComponent={this.state.currentItemCount > 0 && <SearchFooter/>}
              ListHeaderComponent={this.state.featureListFilterTitle === '' && this.state.featureCategoryFilter == undefined && this.state.featureList.length > 0 &&
              <SearchCategories onCategorySelected={this.__updateCategoryFilter.bind(this)}/>}
              renderItem={({item}) => this.__renderSearchItem(item)}
              style={style.searchItemList}
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
  __renderSearchItem(poiFeature) {
    return (
        <View style={style.searchItem}>
          <CardView style={style.searchItemCard} key={poiFeature.properties.id}>
            <TouchableHighlight
                activeOpacity={0.5}
                underlayColor="#eee"
                onPress={() => {
                  this.props.navigation.navigate('ItemDetail', {item: poiFeature});
                }}
                style={style.searchItemTouch}>
              <View>
                <Image
                    source={this.__getCoverImage(poiFeature)}
                    style={style.searchItemImage}
                    on
                />
                <Text style={style.searchItemTitle} numberOfLines={1}>
                  {poiFeature.properties.title}
                </Text>
                <Text style={style.searchItemFloor}>
                  {this.__getLevelString(poiFeature)}
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
  __updateSearchFilter(title) {
    this.setState({featureListFilterTitle: title}, () => {
      this.__updateFilteredFeatureList();
    });
  }

  /**
   * Update search filter by category
   * @param category {SearchCategory}
   * @private
   */
  __updateCategoryFilter(category) {
    this.setState({featureCategoryFilter: category}, () => {
      this.__updateFilteredFeatureList();
    });
  }

  /**
   * Updates state with POIs matching filters.
   * @private
   */
  async __updateFilteredFeatureList() {
    let list = this.state.featureList.filter((item) =>
        this.__matchesSearchItemTitle(
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
  __loadAmenitiesAndFeatures() {
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
        () => this.__updateFilteredFeatureList(),
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
  __matchesSearchItemTitle(item: Feature, title, category) {
    if (category) {
      if (
          !this.state.amenityMap.has(item.properties.amenity)
          || item.properties.amenity !== category.amenityId
      ) {
        return false;
      }
    }

    let featureTitle = item.properties.title;
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
  __getCoverImage(feature) {
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
  __getLevelString(feature) {
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

const style = StyleSheet.create({
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
