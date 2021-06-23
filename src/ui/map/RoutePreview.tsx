import * as React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  Button,
  View,
  ListRenderItemInfo,
} from 'react-native';
import ProximiioMapbox, {
  ProximiioMapboxRoute,
  RouteStepDescriptor,
} from 'react-native-proximiio-mapbox';
import importDirectionImage from '../../utils/DirectionImageImportUtil';
import {Colors} from '../../Style';
import i18n from 'i18next';
import {UnitConversionHelper} from "../../utils/UnitConversionHelper";

interface Props {
  route: ProximiioMapboxRoute;
}
interface State {
  showTripDetails: boolean;
  tripDistance: String;
  tripDuration: String;
}

/**
 * Screen previewing steps of displayed route.
 */
export default class RoutePreview extends React.Component<Props, State> {
  state = {
    showTripDetails: false,
    tripDistance: undefined,
    tripDuration: undefined,
  };

  componentDidMount() {
    this.updateEstimates();
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderTripStartEnd()}
        {this.renderTripSummary(this.props.route.distanceMeters)}
        {this.renderTripSteps()}
        <View style={styles.buttonBar}>
          <View style={styles.button}>
            <Button
              color={'#777'}
              title={i18n.t(this.state.showTripDetails ? 'preview.hide_trip' : 'preview.show_trip')}
              onPress={() => this.setState({showTripDetails: !this.state.showTripDetails})}
            />
          </View>
          <View style={styles.button}>
            <Button
              color={'#cc0000'}
              title={i18n.t('preview.cancel')}
              onPress={() => ProximiioMapbox.route.cancel()}
            />
          </View>
        </View>
        <View style={{padding: 8}}>
          <Button
            title={i18n.t('preview.start')}
            onPress={() => ProximiioMapbox.route.start()}
          />
        </View>
      </View>
    );
  }

  /**
   * Renders info about trip start and end.
   * @returns {boolean|JSX.Element}
   * @private
   */
  private renderTripStartEnd() {
    return (this.state.showTripDetails === false && (
        <>
          <View style={styles.tripRow}>
            <Image
              style={styles.tripRowImage}
              source={require('../../images/ic_current_position.png')}
            />
            <Text style={styles.tripRowText}>
              {i18n.t('preview.your_location')}
            </Text>
          </View>
          <View style={styles.tripRow}>
            <Image
              style={styles.tripRowImage}
              source={require('../../images/ic_preview_destination.png')}
            />
            <Text style={styles.tripRowText}>
              {this.props.route.destination.properties.title ? this.props.route.destination.properties.title : i18n.t('preview.destination') }
            </Text>
          </View>
        </>
    ));
  }

  /**
   * Creates views showing summary information about route / trip.
   *
   * @param distanceInMeters
   * @returns {JSX.Element}
   * @private
   */
  private renderTripSummary() {
    // if (distanceInMeters == undefined) {
    //   return <View />;
    // }
    return (
      <>
        {this.state.showTripDetails === false && <View style={styles.tripSummarySeparatorVertical} />}
        <View style={styles.tripSummary}>
          <View style={styles.tripSummaryItem}>
            <Image style={styles.tripSummaryItemImage} source={require('../../images/ic_steps.png')} />
            <Text>{this.state.tripDistance}</Text>
          </View>
          <View style={styles.tripSummarySeparator}/>
          <View style={styles.tripSummaryItem}>
            <Image style={styles.tripSummaryItemImage} source={require('../../images/ic_time.png')} />
            <Text>{this.state.tripDuration}</Text>
          </View>
        </View>
      </>
    );
  }

  /**
   * Renders list of trip steps.
   * @returns {boolean|JSX.Element}
   * @private
   */
  private renderTripSteps() {
    return (
      this.state.showTripDetails &&
      <Text>Detail Trip Directions</Text> &&
      <FlatList
        style={styles.tripSteps}
        data={this.props.route.steps}
        renderItem={(item, index) => this.renderTripStep(item)}
        keyExtractor={(item, index) => 'index_' + index}
      />
    );
  }

  /**
   * Renders single step of trip.
   * @param item
   * @returns {JSX.Element}
   * @private
   */
  private renderTripStep(item: ListRenderItemInfo<RouteStepDescriptor>) {
    const instruction = item.index === 0 ? i18n.t('preview.start_navigation') : item.item.instruction;
    let distance = undefined;
    if (item.index > 0 && item.item.distanceFromLastStep !== undefined) {
      distance = UnitConversionHelper.getDistanceInPreferredUnits(item.item.distanceFromLastStep);
    }

    if (instruction === undefined) return <View />;
    return (
      <View style={styles.tripRow}>
        <Image
          style={styles.tripRowImage}
          source={importDirectionImage(item.item.symbol)}
        />
        <View style={styles.tripRowText}>
          <Text>{instruction}</Text>
          {distance != null && (<Text style={styles.tripRowTextDistance}>{distance}</Text>)}
        </View>
      </View>
    );
  }

  private async updateEstimates() {
    if (!this.props.route) {
      this.setState({
        tripDistance: undefined,
        tripDuration: undefined,
      });
    } else {
      let timeInMinutes = Math.max(1, Math.round(this.props.route.distanceMeters / 1.4 / 60));
      let distance = UnitConversionHelper.getDistanceInPreferredUnits(this.props.route.distanceMeters);
      let duration = i18n.t('preview.summary_minutes', {count: timeInMinutes});
      this.setState({
        tripDistance: distance,
        tripDuration: duration,
      });
    }
  }
}

const styles = StyleSheet.create({
  tripSteps: {
    maxHeight: 256,
  },
  tripSummary: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  tripSummaryItem: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  tripSummaryItemImage: {
    height: 24,
    margin: 4,
    width: 24,
  },
  tripSummarySeparator: {
    backgroundColor: Colors.gray,
    flex: 0,
    width: 1,
    marginHorizontal: 8,
  },
  tripSummarySeparatorVertical: {
    backgroundColor: Colors.gray,
    flexDirection: 'row',
    height: 1,
    margin: 8,
    width: 'auto',
  },
  tripRow: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 8,
    alignContent: 'center',
    justifyContent: 'space-around',
  },
  tripRowImage: {
    padding: 8,
    height: 24,
    width: 24,
  },
  tripRowText: {
    flex: 1,
    padding: 8,
    alignItems: 'flex-start',
  },
  tripRowTextDistance: {
    borderRadius: 50,
    backgroundColor: Colors.previewTripDetailChipBackground,
    marginTop: 4,
    padding: 8,
  },
  container: {
    borderTopColor: 'green',
    borderTopWidth: 2,
    borderStyle: 'solid',
    backgroundColor: Colors.background,
    width: '100%',
    padding: 16,
  },
  buttonBar: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    padding: 8,
  },
});
