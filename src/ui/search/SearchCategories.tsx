import * as React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import i18n from 'i18next';

interface Props {
  onCategorySelected: (onCategorySelected: SearchCategory) => void;
}
interface State {
  categoryList: SearchCategory[];
  showingAll: boolean;
}

/**
 * Component that show list of POI categories in search screen.
 * User can click to show/hide more categories.
 */
export default class SearchCategories extends React.Component<Props, State> {
  state = {
    categoryList: [],
    showingAll: false,
  };

  render() {
    return (
      <View style={styles.categoryList} key={'header'}>
        {categoryList.filter((item, index) => (this.state.showingAll || index < 5)).map((category, index) => this.renderCategoryItem(category, index))}
        {categoryList.length > 5 && this.renderCategoryItem(this.state.showingAll ?  toggleClose : toggleOpen, 'toggle')}
      </View>
    );
  }

  /**
   * Render single category.
   * @param item
   * @param key
   * @returns {JSX.Element}
   * @private
   */
  private renderCategoryItem(item, key) {
    return (
      <TouchableHighlight
        activeOpacity={0.5}
        underlayColor="#dddddd"
        containerStyle={styles.categoryItem}
        onPress={() => this.onCategoryPressed(item)}
        key={'category_' + key}>
        <View>
          <View style={styles.categoryItemImageWrapper}>
            <Image source={item.image} style={styles.categoryItemImage} />
          </View>
          <Text style={styles.categoryItemTitle}>{i18n.t(item.title)}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  /**
   * Fired when user clicks category.
   * @param category
   * @private
   */
  private onCategoryPressed(category) {
    if (category === toggleOpen || category === toggleClose) {
      this.setState({showingAll: !this.state.showingAll});
    } else {
      if (this.props.onCategorySelected !== undefined) {
        this.props.onCategorySelected(category);
      }
    }
  }
}

const styles = StyleSheet.create({
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryItem: {
    padding: 8,
    maxWidth: '33.33%',
    width: '33.33%',
  },
  categoryItemImageWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  categoryItemImage: {
    aspectRatio: 1,
    flex: 1,
    marginHorizontal: 24,
    marginVertical: 8,
    maxWidth: 72,
  },
  categoryItemTitle: {
    textAlign: 'center',
  },
});

/**
 * Class defining category.
 */

export class SearchCategory {
  amenityCategoryId: String;
  color: String;
  title: String;
  image: Object;
}

/**
 * Full list of all categories.
 * @type {SearchCategory[]}
 */
export const categoryList: SearchCategory[] = [
  {
    amenityCategoryId: 'cef3a774-27e3-4df3-b4ec-a72ee15bed55',
    color: '#E2CE19',
    title: 'common.category.cafeteria',
    image: require('../../images/search_categories/cafeteria.png'),
  },
  {
    amenityCategoryId: '07bef616-619b-4a34-99ab-362dd4bc0075',
    color: '#4F86C3',
    title: 'common.category.lift',
    image: require('../../images/search_categories/lift.png'),
  },
  {
    amenityCategoryId: '16b509c5-aa6d-48f8-98bf-5a88b6c1e4fb',
    color: '#71D9DE',
    title: 'common.category.washroom',
    image: require('../../images/search_categories/washrooms.png'),
  },
  {
    amenityCategoryId: '0368ed37-9f49-45d4-8c30-0a4a03badf6e',
    color: '#8C62B6',
    title: 'common.category.reception',
    image: require('../../images/search_categories/reception.png'),
  },
  {
    amenityCategoryId: 'f6fd8bff-d04e-4e2a-8ea2-8980e1c9b326',
    color: '#E2CE19',
    title: 'common.category.offices',
    image: require('../../images/search_categories/offices.png'),
  },
  {
    amenityCategoryId: 'e23fd1da-de48-4dca-8038-1c9ef1ebdd1b',
    color: '#71D9DE',
    title: 'common.category.meeting_room',
    image: require('../../images/search_categories/meeting.png'),
  },
  {
    amenityCategoryId: 'c55b7222-153d-4afa-8824-8be2f0d92aa3',
    color: '#8C62B6',
    title: 'common.category.entrance',
    image: require('../../images/search_categories/entrance.png'),
  },
];

/**
 * Special category, when user clicks it, shows rest of categories.
 */
const toggleOpen = {
  amenityId: undefined,
  title: 'common.category.more',
  image: require('../../images/search_categories/toggle.png'),
};

/**
 * Special category, when user clicks it, hides some categories.
 */
const toggleClose = {
  amenityId: undefined,
  title: 'common.category.less',
  image: require('../../images/search_categories/toggle.png'),
};
