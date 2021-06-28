import * as React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  ListRenderItem,
  ListRenderItemInfo,
  TouchableOpacity, TouchableHighlight, StyleProp
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Proximiio, {ProximiioEvents, ProximiioFloor} from 'react-native-proximiio';
import {Colors, Shadow} from '../../Style';
import i18n from "i18next";

interface Props {
  mapLevel: number;
  userLevel: number;
  onLevelChanged: (newMapLevel: number) => void;
}
interface State {
  currentFloor: number;
  levelList: number[];
  open: boolean;
}

export default class FloorPicker extends React.Component<Props, State> {
  state = {
    currentFloor: 0,
    levelList: [],
    open: false,
  } as State;
  floorChangedSubscription = undefined;

  componentDidMount() {
    this.refreshFloorList();
    Proximiio.subscribe(ProximiioEvents.FloorChanged, this.onFloorChanged);
  }

  componentWillUnmount() {
    Proximiio.unsubscribe(ProximiioEvents.FloorChanged, this.onFloorChanged);
  }

  render() {
    const currentFloorLevelKey = 'common.floor_' + this.props.mapLevel;
    const currentFloorLevelImageWithRotation = {...styles.currentFloorLevelImage} as StyleProp<any>;
    if (this.state.open) {
      currentFloorLevelImageWithRotation.transform = [{rotate: '180deg'}];
    }
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.toggleOpen}
          activeOpacity={0.8}>
          <View style={styles.currentFloorLevel}>
            <Text style={styles.currentFloorLevelText}>{i18n.t(currentFloorLevelKey)}</Text>
            <Image style={currentFloorLevelImageWithRotation} source={require('../../images/ic_floor_spinner.png')} />
          </View>
        </TouchableOpacity>
        {this.state.open && <FlatList style={styles.list} data={this.state.levelList} keyExtractor={(item, index) => '' + index} renderItem={this.renderLevelItem} />}
      </View>
    );
  }

  private renderLevelItem = (renderItem: ListRenderItemInfo<any>) => {
    const floorLevelKey = 'common.floor_' + renderItem.item;
    return (
      <TouchableOpacity onPress={() => this.onFloorSelected(renderItem.item)} activeOpacity={0.8}>
        <Text style={styles.listItem}>
          {i18n.t(floorLevelKey)}
        </Text>
      </TouchableOpacity>
    );
  };

  private toggleOpen = () => {
    this.setState({open: !this.state.open});
  };

  private onFloorSelected = (selectedFloorLevel) => {
    this.props.onLevelChanged(selectedFloorLevel);
    this.toggleOpen();
  };

  private onFloorChanged = (floorChange) => {
    console.log(floorChange);
    this.refreshFloorList();
  };

  private async refreshFloorList() {
    let floor = Proximiio.floor;
    let floors = await Proximiio.floors();
    let newLevelList = floors
      .map((it) => it.level)
      .filter(this.filterUnique)
      .sort((a, b) => a - b);
    this.setState({
      levelList: newLevelList,
      currentFloor: floor?.level || 0,
    });
  }

  /**
   * Helper method for filtering out only unique floors
   * @param value {number}
   * @param index {number}
   * @param self {Array<number>}
   * @returns {boolean}
   * @private
   */
  private filterUnique(value: number, index: number, self: number[]) {
    let firstIndex = self.findIndex((it) => it === value);
    return index === firstIndex;
  }
}

const styles = StyleSheet.create({
  container: {
    marginEnd: 16,
    marginBottom: 16,
  },
  currentFloorLevel: {
    ...Shadow,
    alignItems: 'center',
    backgroundColor: Colors.greenLight,
    borderRadius: 100,
    color: Colors.blueDark,
    flexDirection: 'row',
    fontSize: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  currentFloorLevelText: {
    color: Colors.blueDark2,
  },
  currentFloorLevelImage: {
    marginStart: 8,
    height: 12,
    width: 12,
  },
  list: {
    flex: 0,
    alignSelf: 'flex-end',
    paddingStart: 24,
    maxHeight: 156,
  },
  listItem: {
    ...Shadow,
    alignSelf: 'flex-end',
    backgroundColor: Colors.blueDark,
    borderRadius: 100,
    color: Colors.white,
    fontSize: 12,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
