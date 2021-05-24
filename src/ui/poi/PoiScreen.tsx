import * as React from 'react';
import {Button, Image, StyleSheet, Text, View} from 'react-native';
import {SliderBox} from 'react-native-image-slider-box';
import ProximiioMapbox from 'react-native-proximiio-mapbox';
import {Colors} from '../../Style';
import PreferenceHelper from '../../utils/PreferenceHelper';
import {PROXIMIIO_TOKEN} from '../../utils/Constants';
import {ProximiioMapboxRoute} from 'react-native-proximiio-mapbox/src/types';
import {Feature} from 'react-native-proximiio-mapbox/src/feature';
import i18n from 'i18next';

/**
 * Length of a single step in meters.
 * @type {number}
 */
const STEP_LENGTH = 0.65;

interface Props {
  route: ProximiioMapboxRoute;
  navigation: any;
}
interface State {
  steps: Number;
}

/**
 * Screen with detailed info about POI Feature.
 */
export default class PoiScreen extends React.Component<Props, State> {
  private mounted = false;
  state = {
    steps: null,
  };

  componentDidMount() {
    this.mounted = true;
    let item: Feature = this.props.route.params.item;
    this.props.navigation.setOptions({title: item.getTitle()});
    ProximiioMapbox.route
      .calculate({destinationFeatureId: item.id})
      .then(this.onRouteCalculated.bind(this))
      .catch((_) => this.onRouteCalculated(undefined));
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    let item: Feature = this.props.route.params.item;
    return (
      <View style={styles.container}>
        <SliderBox
          images={this.getItemImages(item)}
          style={styles.slider}
          disableOnPress
        />
        <View style={styles.content}>
          <Text style={styles.heading}>{item.getTitle()}</Text>
          {this.renderImageTextRow(
            require('../../images/ic_location.png'),
            this.getLevel(item),
          )}
          {this.renderImageTextRow(
            require('../../images/ic_steps.png'),
            this.getStepsText(this.state.steps),
          )}
          {this.renderImageTextRow(
            require('../../images/ic_trip.png'),
            i18n.t('poiscreen.trip'),
          )}
          <Button
            title={this.getTripButtonText(this.state.steps)}
            onPress={() => {
              PreferenceHelper.routeFindWithPreferences(item.id);
              console.log('start trip button pressed');
              this.props.navigation.navigate('Main');
            }}
            style={styles.tripButton}
          />
          {this.renderImageTextRow(
            require('../../images/ic_description.png'),
            i18n.t('poiscreen.description'),
          )}
          <Text style={styles.description}>{this.getDescription(item)}</Text>
        </View>
      </View>
    );
  }

  /**
   * Callback when route is calculated, updates state with estimation of number of steps to destination.
   * @param route
   * @private
   */
  private onRouteCalculated(route: ProximiioMapboxRoute) {
    if (!this.mounted) {
      return;
    }
    if (route) {
      this.setState({
        steps: Math.round(route.distanceMeters / STEP_LENGTH),
      });
    } else {
      this.setState({
        steps: -1,
      });
    }
  }

  /**
   * Get description or placeholder text.
   * @param feature
   * @returns {string|*}
   * @private
   */
  private getDescription(feature: Feature) {
    let description = feature.getDescription();
    if (!description) {
      return i18n.t('poiscreen.no_description');
    } else {
      return description;
    }
  }

  private getTripButtonText(steps) {
    let stepsText = this.getStepsText(steps);
    return i18n.t('poiscreen.start_my_trip') + '\n(' + stepsText + ')';
  }

  /**
   * Generates text with number of steps to destination or placeholder if calculation failed or is in progress.
   * @param steps
   * @returns {string}
   * @private
   */
  private getStepsText(steps) {
    switch (steps) {
      case undefined:
      case null:
        return i18n.t('poiscreen.calculating_steps');
      case -1:
        return i18n.t('poiscreen.calculating_steps_failed');
      default:
        return i18n.t('poiscreen.calculating_steps_result', {count: steps});
    }
  }

  /**
   * Helper method to generate a view with image on the left and text on the right
   * @param image
   * @param text
   * @returns {JSX.Element}
   * @private
   */
  private renderImageTextRow(image, text) {
    return (
      <View style={styles.row}>
        <Image source={image} style={styles.rowImage} />
        <Text style={styles.rowText}>{text}</Text>
      </View>
    );
  }

  /**
   * Translate feature's level number into 'nice' text.
   * @param feature
   * @returns {string}
   * @private
   */
  private getLevel(feature) {
    let level = '';
    switch (feature.properties.level) {
      case 0:
        level = i18n.t('common.floor_0');
        break;
      case 1:
        level = i18n.t('common.floor_1');
        break;
      case 2:
        level = i18n.t('common.floor_2');
        break;
      case 3:
        level = i18n.t('common.floor_3');
        break;
      case 4:
        level = i18n.t('common.floor_4');
        break;
      case 5:
        level = i18n.t('common.floor_5');
        break;
      default:
        level = i18n.t('common.floor_n', {count: (feature.properties.level)});
    }
    return level;
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
      return [
        'https://dummyimage.com/800x450/787878/fff.jpg&text=' + i18n.t('poiscreen.no_image'),
      ];
    } else {
      return imageList;
    }
  }
}

const styles = StyleSheet.create({
  container: {},
  content: {
    padding: 24,
  },
  slider: {
    aspectRatio: 1.7666,
    width: '100%',
    maxWidth: '100%',
    flex: 0,
    flexGrow: 0,
  },
  sliderImage: {
    borderRadius: 16,
    width: '100%',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 16,
    marginTop: 0,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 16,
  },
  rowImage: {
    aspectRatio: 1,
    height: 'auto',
    width: 24,
  },
  rowText: {
    marginStart: 8,
  },
  tripButton: {
    marginBottom: 36,
    marginTop: 16,
  },
  description: {
    borderRadius: 16,
    padding: 12,
    backgroundColor: Colors.white,
  },
});
