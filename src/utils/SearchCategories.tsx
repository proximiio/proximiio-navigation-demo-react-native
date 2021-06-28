import {Colors} from '../Style';

/**
 * Class defining category.
 */

export class SearchCategory {
  amenityId: String;
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
    amenityId: 'c1eaab1a-3f02-4491-a515-af8d628f74fb:20b56e81-a640-4d59-aaab-9cdbe2b353d1',
    color: Colors.blueDark2,
    title: 'common.category.washroom',
    image: require('../images/search_categories/ic_explore_nearby_bathroom.png'),
  },
  {
    amenityId: 'c1eaab1a-3f02-4491-a515-af8d628f74fb:109c0242-6346-4333-b6a9-8315841a82a9',
    color: Colors.pink,
    title: 'common.category.cafeteria',
    image: require('../images/search_categories/ic_explore_nearby_cafe.png'),
  },
  {
    amenityId: 'c1eaab1a-3f02-4491-a515-af8d628f74fb:9da478a4-b0ce-47ba-8b44-32a4b31150a8',
    color: Colors.blueLight2,
    title: 'common.category.parking',
    image: require('../images/search_categories/ic_explore_nearby_parking.png'),
  },
  {
    amenityId: 'c1eaab1a-3f02-4491-a515-af8d628f74fb:b2b59e42-de48-442c-b591-a5f8fbc5031d',
    color: Colors.purple,
    title: 'common.category.entrance',
    image: require('../images/search_categories/ic_explore_nearby_exits.png'),
  },
  {
    amenityId: 'c1eaab1a-3f02-4491-a515-af8d628f74fb:65a02cc9-2c78-4ace-8105-5cf5b27f4a6e',
    color: Colors.blueLight3,
    title: 'common.category.meeting_room',
    image: require('../images/search_categories/ic_explore_nearby_meeting_room.png'),
  },
];
