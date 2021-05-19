import React, {Component} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';

interface Props {
  onCategorySelected: void;
}
interface State {
  categoryList: [];
  showingAll: boolean;
}

/**
 * Component that show list of POI categories in search screen.
 * User can click to show/hide more categories.
 */
export default class SearchCategories extends Component<Props, State> {
  state = {
    categoryList: [],
    showingAll: false,
  };

  render() {
    return (
      <View style={style.categoryList} key={'header'}>
        {categoryList.filter((item, index) => (this.state.showingAll || index < 5)).map((category, index) => this.__renderCategoryItem(category, index))}
        {this.__renderCategoryItem(this.state.showingAll ?  toggleClose : toggleOpen, 'toggle')}
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
  __renderCategoryItem(item, key) {
    return (
      <TouchableHighlight
        activeOpacity={0.5}
        underlayColor="#dddddd"
        containerStyle={style.categoryItem}
        onPress={() => this.__onCategoryPressed(item)}
        key={'category_' + key}>
        <View>
          <View style={style.categoryItemImageWrapper}>
            <Image source={item.image} style={style.categoryItemImage} />
          </View>
          <Text style={style.categoryItemTitle}>{item.title}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  /**
   * Fired when user clicks category.
   * @param category
   * @private
   */
  __onCategoryPressed(category) {
    if (category === toggleOpen || category === toggleClose) {
      this.setState({showingAll: !this.state.showingAll});
    } else {
      if (this.props.onCategorySelected !== undefined) {
        this.props.onCategorySelected(category);
      }
    }
  }
}

const style = StyleSheet.create({
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
  title: String;
  image: Object;
}

/**
 * Full list of all categories.
 * @type {SearchCategory[]}
 */
const categoryList: SearchCategory[] = [
  {
    amenityCategoryId: 'cef3a774-27e3-4df3-b4ec-a72ee15bed55',
    title: 'Cafeteria',
    image: require('../../images/search_categories/cafeteria.png'),
  },
  {
    amenityCategoryId: '07bef616-619b-4a34-99ab-362dd4bc0075',
    title: 'Lift',
    image: require('../../images/search_categories/lift.png'),
  },
  {
    amenityCategoryId: '16b509c5-aa6d-48f8-98bf-5a88b6c1e4fb',
    title: 'Washrooms',
    image: require('../../images/search_categories/washrooms.png'),
  },
  {
    amenityCategoryId: '0368ed37-9f49-45d4-8c30-0a4a03badf6e',
    title: 'Reception',
    image: require('../../images/search_categories/reception.png'),
  },
  {
    amenityCategoryId: 'f6fd8bff-d04e-4e2a-8ea2-8980e1c9b326',
    title: 'Offices',
    image: require('../../images/search_categories/offices.png'),
  },
  {
    amenityCategoryId: 'e23fd1da-de48-4dca-8038-1c9ef1ebdd1b',
    title: 'Meeting room',
    image: require('../../images/search_categories/meeting.png'),
  },
  {
    amenityCategoryId: 'c55b7222-153d-4afa-8824-8be2f0d92aa3',
    title: 'Entrance',
    image: require('../../images/search_categories/entrance.png'),
  },
];

/**
 * Special category, when user clicks it, shows rest of categories.
 */
const toggleOpen = {
  amenityCategoryId: undefined,
  title: 'More',
  image: require('../../images/search_categories/toggle.png'),
};

/**
 * Special category, when user clicks it, hides some categories.
 */
const toggleClose = {
  amenityCategoryId: undefined,
  title: 'Less',
  image: require('../../images/search_categories/toggle.png'),
};