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
    amenityId: 'e25990bd-4019-4b65-a84f-b7aed0bd66aa:1e86ea0a-cbf2-4fdc-a9a0-802ffea95fee',
    color: Colors.blueDark2,
    title: 'common.category.washroom',
    image: require('../images/search_categories/ic_explore_nearby_bathroom.png'),
  },
  {
    amenityId: 'e25990bd-4019-4b65-a84f-b7aed0bd66aa:3b2624ab-3d34-4a32-8d95-60a1a50561a8',
    color: Colors.pink,
    title: 'common.category.cafeteria',
    image: require('../images/search_categories/ic_explore_nearby_cafe.png'),
  },
  {
    amenityId: 'e25990bd-4019-4b65-a84f-b7aed0bd66aa:086a0d59-0696-442b-b8d7-2928c3847de4',
    color: Colors.blueLight2,
    title: 'common.category.parking',
    image: require('../images/search_categories/ic_explore_nearby_parking.png'),
  },
  {
    amenityId: 'e25990bd-4019-4b65-a84f-b7aed0bd66aa:ef811677-1245-4348-aa96-dfc4cb888af5',
    color: Colors.purple,
    title: 'common.category.entrance',
    image: require('../images/search_categories/ic_explore_nearby_exits.png'),
  },
  {
    amenityId: 'eventspace',
    color: Colors.blueLight3,
    title: 'common.category.meeting_room',
    image: require('../images/search_categories/ic_explore_nearby_meeting_room.png'),
  },
];
