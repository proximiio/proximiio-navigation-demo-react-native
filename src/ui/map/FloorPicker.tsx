import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Proximiio, {ProximiioEvents, ProximiioFloor} from 'react-native-proximiio';
import {Colors} from '../../Style';

interface Props {
  mapLevel: number;
  userLevel: number;
  onLevelChanged: (newMapLevel: number) => void;
}
interface State {
  floorList: [];
}

export default class FloorPicker extends React.Component<Props, State> {
  dropdown = null;
  state = {
    floorList: null,
  };
  floorChangedSubscription = undefined;

  componentDidMount() {
    this.refreshFloorList();
    this.floorChangedSubscription = Proximiio.subscribe(ProximiioEvents.FloorChanged, this.onFloorChanged.bind(this));
  }

  componentWillUnmount() {
    this.floorChangedSubscription.remove();
  }

  render() {
    if (!this.state.floorList) {
      this.dropdown = null;
      return <View />;
    }
    return (
      <DropDownPicker
        controller={(instance) => (this.dropdown = instance)}
        items={this.state.floorList}
        arrowColor={'#ffffff'}
        style={styles.main}
        dropDownStyle={styles.dropdown}
        itemStyle={styles.item}
        labelStyle={styles.label}
        selectedLabelStyle={styles.selectedLabel}
        placeholderStyle={styles.selectedLabel}
        defaultValue={this.props.mapLevel}
        onChangeItem={(newLevel) => this.onFloorSelected(newLevel)}
      />
    );
  }

  private onFloorSelected(selectedFloor) {
    this.props.onLevelChanged(selectedFloor.value);
  }

  private onFloorChanged(floorChange) {
    console.log(floorChange);
    this.refreshFloorList();
  }

  private async refreshFloorList() {
    let floor = Proximiio.floor;

    // No current floor selected, user is outside
    if (!floor) {
      this.setState({floorList: null});
      return;
    }
    let placeId = floor.place_id;
    let floors = await Proximiio.floors();
    let newFloorList = floors
      .filter((item) => item.place_id === placeId)
      .filter(this.filterUnique)
      .map((item) => {
        return {
          label: item.name,
          value: item.level,
        };
      })
      .sort((a, b) => a.value - b.value);
    this.setState({floorList: newFloorList});
  }

  /**
   * Helper method for filtering out only unique floors
   * @param value {ProximiioFloor}
   * @param index {Number}
   * @param self {Array}
   * @returns {boolean}
   * @private
   */
  private filterUnique(value, index, self: ProximiioFloor[]) {
    let firstIndex = self.findIndex((it) => it.id === value.id);
    return self.indexOf(value) === firstIndex;
  }
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: Colors.floorSelectorBackground,
    borderWidth: 0,
    width: 256,
  },
  container: {
    backgroundColor: Colors.floorSelectorBackground,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedLabel: {
    textAlign: 'left',
    color: Colors.floorSelectorText,
    backgroundColor: Colors.floorSelectorBackground,
  },
  label: {
    textAlign: 'left',
    color: Colors.floorSelectorText,
    paddingVertical: 8,
  },
  item: {
    justifyContent: 'flex-start',
    padding: 12,
  },
  dropdown: {
    backgroundColor: Colors.floorSelectorBackground,
    width: 256,
  },
});
