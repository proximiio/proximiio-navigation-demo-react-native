import {RouteStepSymbol} from 'react-native-proximiio-mapbox';

/**
 * Helper function to select appropriate image for direction
 * @param direction {RouteStepSymbol}
 * @param monocolorOnly {Boolean}
 * @returns {*}
 */
export default function importDirectionImage(direction: RouteStepSymbol, monocolorOnly: Boolean = false) {
  switch (direction) {
    case 'START':
      return require('../images/ic_current_position.png');
    case 'TURN_AROUND':
      return require('../images/direction_icons/turn_around.png');
    case 'HARD_LEFT':
      return require('../images/direction_icons/turn_right_hard.png');
    case 'LEFT':
      return require('../images/direction_icons/turn_left.png');
    case 'SLIGHT_LEFT':
      return require('../images/direction_icons/turn_left_slight.png');
    case 'STRAIGHT':
      return require('../images/direction_icons/turn_straight.png');
    case 'SLIGHT_RIGHT':
      return require('../images/direction_icons/turn_right_slight.png');
    case 'RIGHT':
      return require('../images/direction_icons/turn_right.png');
    case 'HARD_RIGHT':
      return require('../images/direction_icons/turn_right_hard.png');
    case 'UP_ELEVATOR':
      return require('../images/direction_icons/ic_elevator_up.png');
    case 'UP_ESCALATOR':
    case 'UP_STAIRS':
      return require('../images/direction_icons/level_up.png');
    case 'DOWN_ELEVATOR':
      return require('../images/direction_icons/ic_elevator_down.png');
    case 'DOWN_ESCALATOR':
    case 'DOWN_STAIRS':
      return require('../images/direction_icons/level_down.png');
    case 'FINISH':
      if (monocolorOnly) {
        return require('../images/direction_icons/finish.png');
      } else {
        return require('../images/ic_preview_destination.png');
      }
    default:
      return require('../images/dummy.png');
  }
}
