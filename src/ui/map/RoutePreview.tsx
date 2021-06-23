import * as React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  Button,
  View,
  ListRenderItemInfo, TouchableOpacity, Linking, Dimensions,
} from 'react-native';
import ProximiioMapbox, {
  Feature,
  ProximiioMapboxRoute,
  RouteStepDescriptor,
} from 'react-native-proximiio-mapbox';
import {SliderBox} from 'react-native-image-slider-box';
import importDirectionImage from '../../utils/DirectionImageImportUtil';
import {Colors, Shadow} from '../../Style';
import i18n from 'i18next';
import {UnitConversionHelper} from '../../utils/UnitConversionHelper';
import RoundedButton from '../../utils/RoundedButton';
import CardView from '../../utils/CardView';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {PROXIMIIO_TOKEN} from '../../utils/Constants';
import MapCardView from "./MapCardView";

interface Props {
  route: ProximiioMapboxRoute;
}
interface State {
  showTripDetails: boolean;
  tripDistance: String;
  tripDuration: String;
  hasWaypoint: boolean;
  destination?: Feature;
}

/**
 * Screen previewing steps of displayed route.
 */
export default class RoutePreview extends React.Component<Props, State> {
  state = {
    showTripDetails: false,
    tripDistance: undefined,
    tripDuration: undefined,
    hasWaypoint: false,
    destination: undefined,
  };

  componentDidMount() {
    this.updateEstimates();
  }

  render() {
    return (
      <MapCardView onClosePressed={() => ProximiioMapbox.route.cancel()}>
        {/*{this.renderTripStartEnd()}*/}
        {this.renderCloseButton()}
        {this.renderImageGallery()}
        {this.renderTripSummary()}
        {this.renderExternalLink()}
        {this.renderTripSteps()}
        {this.renderTripButtons()}
      </MapCardView>
    );
  }

  /**
   * Renders info about trip start and end.
   * @returns {boolean|JSX.Element}
   * @private
   */
  // private renderTripStartEnd() {
  //   return (this.state.showTripDetails === false && (
  //       <>
  //         <View style={styles.tripRow}>
  //           <Image
  //             style={styles.tripRowImage}
  //             source={require('../../images/ic_current_position.png')}
  //           />
  //           <Text style={styles.tripRowText}>
  //             {i18n.t('preview.your_location')}
  //           </Text>
  //         </View>
  //         <View style={styles.tripRow}>
  //           <Image
  //             style={styles.tripRowImage}
  //             source={require('../../images/ic_preview_destination.png')}
  //           />
  //           <Text style={styles.tripRowText}>
  //             {this.props.route.destination.properties.title ? this.props.route.destination.properties.title : i18n.t('preview.destination') }
  //           </Text>
  //         </View>
  //       </>
  //   ));
  // }

  private renderExternalLink() {
    const metadata = this.state.destination?.properties?.metadata;
    const linkData = metadata?.link;
    const url = linkData?.link;
    const title = linkData?.title?.get(i18n.language);
    if (!url || !title) {
      return null;
    }
    // TODO: extract into transparent button component?
    return (
      <TouchableOpacity style={styles.link} onPress={() => Linking.openURL(url)}>
        <FontAwesome5Icon name="link" color={Colors.pink} />
        <Text style={styles.linkText}>{title}</Text>
      </TouchableOpacity>
    );
  }

  private renderImageGallery() {
    if (!this.state.destination) {
      return null;
    }
    const images = this.getItemImages(this.state.destination);
    if (!images || images.length === 0) {
      return null;
    }
    const width = Dimensions.get('screen').width - 40;
    return (
      <View>
        <SliderBox images={images} style={styles.slider} parentWidth={width} disableOnPress />
      </View>
    );
  }

  /**
   * Creates views showing summary information about route / trip.
   *
   * @param distanceInMeters
   * @returns {JSX.Element}
   * @private
   */
  private renderTripSummary() {
    if (!this.state.destination) {
      return null;
    }
    const title = this.state.destination.getTitle(i18n.language);
    const description = this.state.destination.getDescription(i18n.language);
    const estimates = this.state.tripDuration + ' | ' + this.state.tripDistance;

    return (
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>{title}</Text>
        {description && <Text style={styles.summaryDescription}>{description}</Text>}
        {estimates && <Text style={styles.summaryEstimates}>{}</Text>}
      </View>
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

  private renderTripButtons() {
    return (
      <>
        <View>
          <RoundedButton
            buttonStyle={styles.buttonStart}
            title={i18n.t('preview.start')}
            onPress={() => ProximiioMapbox.route.start()}
          />
        </View>
        <View style={styles.buttonBar}>
          <RoundedButton
            buttonStyle={styles.buttonParking}
            title={i18n.t(this.state.hasWaypoint ? 'preview.nearest_parking_remove' : 'preview.nearest_parking')}
            onPress={() => ProximiioMapbox.route.cancel()}
          />
          <RoundedButton
            buttonStyle={styles.buttonTrip}
            textStyle={{color: Colors.blueDark}}
            title={i18n.t(this.state.showTripDetails ? 'preview.hide_trip' : 'preview.show_trip')}
            onPress={() => this.setState({showTripDetails: !this.state.showTripDetails})}
          />
        </View>
      </>
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

  /**
   * Get array of image URLs or dummy placeholder if none exist.
   * @param feature
   * @returns {string[]}
   * @private
   */
  private getItemImages(feature: Feature) {
    let imageList = feature.getImageUrls(PROXIMIIO_TOKEN);
    if (!imageList || imageList.length === 0) {
      return null;
    } else {
      return imageList;
    }
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
      console.log(this.props.route);
      let destination = ProximiioMapbox.getFeatures().find(it => it.id === this.props.route.destination.id);
      let hasWaypoint = !!this.props.route.steps.find(it => it.isWaypoint);
      this.setState({
        tripDistance: distance,
        tripDuration: duration,
        hasWaypoint: hasWaypoint,
        destination: destination,
      });
    }
  }
}

const styles = StyleSheet.create({
  tripSteps: {
    maxHeight: 256,
  },
  tripSummary: {
    padding: 12,
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
  buttonBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'stretch',
    alignItems: 'stretch',
  },
  summary: {
    padding: 8,
  },
  summaryTitle: {
    color: Colors.black,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  summaryDescription: {
    color: Colors.gray,
    marginBottom: 2,
  },
  summaryEstimates: {
    color: Colors.blueDark,
    marginBottom: 2,
  },
  buttonStart: {
    backgroundColor: Colors.greenLight,
  },
  buttonParking: {
    flex: 2,
    backgroundColor: Colors.blueLight2,
  },
  buttonTrip: {
    backgroundColor: Colors.grayLight,
    flex: 1,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  linkText: {
    marginStart: 4,
    color: Colors.pink,
  },
  slider: {
    aspectRatio: 1.7666,
    backgroundColor: 'red',
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    flex: 0,
    flexGrow: 0,
  },
});
