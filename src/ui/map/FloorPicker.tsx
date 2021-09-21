import * as React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  ListRenderItemInfo,
  TouchableOpacity,
  StyleProp,
} from 'react-native';
import Proximiio, {ProximiioEvents} from 'react-native-proximiio';
import {Colors, Shadow} from '../../Style';
import i18n from 'i18next';
import {LEVEL_OVERRIDE_MAP} from '../../utils/Constants';

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

  componentDidMount() {
    this.refreshFloorList();
    Proximiio.subscribe(ProximiioEvents.Initialized, this.initialize);
    Proximiio.subscribe(ProximiioEvents.FloorChanged, this.onFloorChanged);
    Proximiio.subscribe(ProximiioEvents.ItemsChanged, this.itemsChanged);
  }

  componentWillUnmount() {
    Proximiio.unsubscribe(ProximiioEvents.Initialized, this.initialize);
    Proximiio.unsubscribe(ProximiioEvents.FloorChanged, this.onFloorChanged);
    Proximiio.unsubscribe(ProximiioEvents.ItemsChanged, this.itemsChanged);
  }

  initialize = () => {
    this.refreshFloorList();
  }

  itemsChanged = () => {
    this.refreshFloorList();
  }

  render() {
    const currentFloorLevelKey = 'common.floor_' + LEVEL_OVERRIDE_MAP.get(this.props.mapLevel);
    const currentFloorLevelImageWithRotation = {...styles.currentFloorLevelImage} as StyleProp<any>;
    if (this.state.open) {
      currentFloorLevelImageWithRotation.transform = [{rotate: '180deg'}];
    }
    return (
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={this.toggleOpen}>
          <View style={styles.currentFloorLevel}>
            <Text style={styles.currentFloorLevelText}>{i18n.t(currentFloorLevelKey)}</Text>
            <Image style={currentFloorLevelImageWithRotation} source={require('../../images/ic_floor_spinner.png')} />
          </View>
        </TouchableOpacity>
        {this.state.open && <FlatList style={styles.floorList} data={this.state.levelList} keyExtractor={(item, index) => '' + index} renderItem={this.renderLevelItem} />}
      </View>
    );
  }

  private renderLevelItem = (renderItem: ListRenderItemInfo<any>) => {
    const floorLevelStringKey = 'common.floor_' + LEVEL_OVERRIDE_MAP.get(renderItem.item);
    return (
      <TouchableOpacity onPress={() => this.onFloorSelected(renderItem.item)} activeOpacity={0.8}>
        <Text style={styles.floorListItem}>
          {i18n.t(floorLevelStringKey)}
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

  private onFloorChanged = () => {
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
   * Helper method for filtering out only unique floor levels
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
    marginTop: 16,
    marginEnd: 16,
    marginBottom: 8,
  },
  currentFloorLevel: {
    ...Shadow,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.greenLight,
    borderRadius: 100,
    flexDirection: 'row',
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  currentFloorLevelText: {
    color: Colors.blueDark2,
    fontSize: 16,
    marginEnd: 8,
  },
  currentFloorLevelImage: {
    height: 12,
    width: 12,
  },
  floorList: {
    flex: 0,
    alignSelf: 'flex-end',
    maxHeight: 156,
  },
  floorListItem: {
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
