import * as React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  ListRenderItemInfo,
  TouchableOpacity,
  Linking,
  Dimensions, ScrollView,
} from 'react-native';
import ProximiioMapbox, {
  Feature,
  ProximiioMapboxRoute,
  RouteStepDescriptor,
} from 'react-native-proximiio-mapbox';
import {SliderBox} from 'react-native-image-slider-box';
import importDirectionImage from '../../utils/DirectionImageImportUtil';
import {Colors} from '../../Style';
import i18n from 'i18next';
import {UnitConversionHelper} from '../../utils/UnitConversionHelper';
import RoundedButton from '../../utils/RoundedButton';
import {PROXIMIIO_TOKEN} from '../../utils/Constants';
import MapCardView from './MapCardView';
import PreferenceHelper from '../../utils/PreferenceHelper';

interface Props {
  route: ProximiioMapboxRoute;
}
interface State {
  showTripDetails: boolean;
  tripDistance: string;
  tripDuration: string;
  hasWaypoint: boolean;
  destination?: Feature;
}

/**
 * Screen previewing steps of displayed route and basic route and destination information.
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
      <MapCardView onClosePressed={() => ProximiioMapbox.route.cancel()} style={styles.mapCardView}>
        <ScrollView style={styles.scrollView}>
          {this.renderImageGallery()}
          {this.renderTripSummary()}
          {this.renderExternalLink()}
          {this.renderTripSteps()}
          {this.renderTripButtons()}
        </ScrollView>
      </MapCardView>
    );
  }

  private renderExternalLink() {
    const metadata = this.state.destination?.properties?.metadata;
    const linkData = metadata?.link;
    const url = linkData?.link;
    const title = linkData?.title?.get(i18n.language);
    if (!url || !title) {
      return null;
    }
    return (
      <TouchableOpacity
        style={styles.link}
        onPress={() => Linking.openURL(url)}>
        <Image source={require('../../images/ic_link.png')} style={styles.linkIcon} />
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
    const width = Dimensions.get('screen').width - 48;
    return (
      <View style={styles.sliderWrapper}>
        <SliderBox
          images={images}
          style={styles.slider}
          parentWidth={width}
          disableOnPress
        />
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
    const descriptionMetadata: Object = this.state.destination?.properties?.metadata?.description;
    let description = null;
    if (descriptionMetadata != null) {
      if (descriptionMetadata.hasOwnProperty(i18n.language)) {
        description = descriptionMetadata[i18n.language];
      } else {
        description = descriptionMetadata['en'];
      }
    }
    const estimates = this.state.tripDuration + ' | ' + this.state.tripDistance;

    return (
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>{title}</Text>
        {estimates && <Text style={styles.summaryEstimates}>{estimates}</Text>}
        {description && <Text style={styles.summaryDescription}>{description}</Text>}
      </View>
    );
  }

  /**
   * Renders list of trip steps.
   * @returns {boolean|JSX.Element}
   * @private
   */
  private renderTripSteps() {
    if (!this.state.showTripDetails) {
      return null;
    }
    return this.props.route.steps.map((it, index) => this.renderTripStep(it, index));
    // return (
    //   <>
    //     <Text>Detail Trip Directions</Text>
    //     <FlatList
    //       style={styles.tripSteps}
    //       data={this.props.route.steps}
    //       renderItem={(item) => this.renderTripStep(item)}
    //       keyExtractor={(item, index) => 'index_' + index}
    //     />
    //   </>
    // );
  }

  private renderTripButtons() {
    return (
      <>
        <View>
          <RoundedButton
            buttonStyle={styles.buttonStart}
            icon={require('../../images/ic_navigate.png')}
            iconStyle={{tintColor: Colors.blueDark}}
            title={i18n.t('preview.start')}
            titleStyle={{color: Colors.blueDark}}
            onPress={this.startRoute}
          />
        </View>
        <View style={styles.buttonBar}>
          <RoundedButton
            buttonStyle={styles.buttonParking}
            icon={require('../../images/ic_parking.png')}
            title={i18n.t(this.state.hasWaypoint ? 'preview.nearest_parking_remove' : 'preview.nearest_parking')}
            onPress={this.toggleParking}
          />
          <RoundedButton
            buttonStyle={styles.buttonTrip}
            icon={require('../../images/ic_route.png')}
            iconStyle={{tintColor: Colors.blueDark}}
            titleStyle={{color: Colors.blueDark}}
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
  private renderTripStep(item: RouteStepDescriptor, index: number) {
    const instruction = index === 0 ? i18n.t('preview.start_navigation') : item.instruction;
    let distance = undefined;
    if (index > 0 && item.distanceFromLastStep !== undefined) {
      distance = UnitConversionHelper.getDistanceInPreferredUnits(item.distanceFromLastStep);
    }

    if (instruction === undefined) return <View />;
    return (
      <View style={styles.tripRow}>
        <Image
          style={styles.tripRowImage}
          source={importDirectionImage(item.symbol)}
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

  private toggleParking = () => {
    PreferenceHelper.routeFindWithPreferences(this.props.route.destination.id, !this.state.hasWaypoint);
  };

  private startRoute = () => {
    ProximiioMapbox.route.start();
  };

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
    fontSize: 20,
    marginBottom: 2,
  },
  summaryDescription: {
    color: Colors.gray,
    marginBottom: 2,
  },
  summaryEstimates: {
    color: Colors.blueDark2,
    marginBottom: 2,
  },
  buttonStart: {
    backgroundColor: Colors.greenLight,
  },
  buttonParking: {
    backgroundColor: Colors.blueLight2,
    flex: 2,
    marginEnd: 4,
  },
  buttonTrip: {
    backgroundColor: Colors.grayLight,
    flex: 1,
    marginStart: 4,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  linkText: {
    marginStart: 4,
    color: Colors.pink,
  },
  linkIcon: {
    height: 24,
    width: 24,
    tintColor: Colors.pink,
  },
  slider: {
    aspectRatio: 1.7666,
    flex: 0,
    flexGrow: 0,
  },
  sliderWrapper: {
    marginBottom: 4,
  },
  scrollView: {
    maxHeight: '100%',
  },
  mapCardView: {
    elevation: 10,
    maxHeight: '100%',
  },
});
