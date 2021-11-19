import {RouteStepSymbol} from 'react-native-proximiio-library';

/**
 * Helper function to select appropriate image for direction
 * @param direction {RouteStepSymbol}
 * @param monocolorOnly {Boolean}
 * @returns {*}
 */
export default function importDirectionImage(direction: RouteStepSymbol, monocolorOnly: Boolean = false) {
  switch (direction) {
    case RouteStepSymbol.START:
      return require('../images/ic_current_position.png');
    case RouteStepSymbol.TURN_AROUND:
      return require('../images/direction_icons/turn_around.png');
    case RouteStepSymbol.HARD_LEFT:
      return require('../images/direction_icons/turn_right_hard.png');
    case RouteStepSymbol.LEFT:
      return require('../images/direction_icons/turn_left.png');
    case RouteStepSymbol.SLIGHT_LEFT:
      return require('../images/direction_icons/turn_left_slight.png');
    case RouteStepSymbol.STRAIGHT:
      return require('../images/direction_icons/turn_straight.png');
    case RouteStepSymbol.SLIGHT_RIGHT:
      return require('../images/direction_icons/turn_right_slight.png');
    case RouteStepSymbol.RIGHT:
      return require('../images/direction_icons/turn_right.png');
    case RouteStepSymbol.HARD_RIGHT:
      return require('../images/direction_icons/turn_right_hard.png');
    case RouteStepSymbol.UP_ELEVATOR:
      return require('../images/direction_icons/ic_elevator_up.png');
    case RouteStepSymbol.UP_ESCALATOR:
    case RouteStepSymbol.UP_STAIRS:
      return require('../images/direction_icons/level_up.png');
    case RouteStepSymbol.DOWN_ELEVATOR:
      return require('../images/direction_icons/ic_elevator_down.png');
    case RouteStepSymbol.DOWN_ESCALATOR:
    case RouteStepSymbol.DOWN_STAIRS:
      return require('../images/direction_icons/level_down.png');
    case RouteStepSymbol.FINISH:
      if (monocolorOnly) {
        return require('../images/direction_icons/finish.png');
      } else {
        return require('../images/ic_preview_destination.png');
      }
    default:
      return require('../images/dummy.png');
  }
}
