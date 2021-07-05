import * as React from 'react';
import {
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SettingsScreen} from 'react-native-settings-screen';
import {Dialog} from 'react-native-paper';
import PreferenceHelper, {
  AccessibilityGuidanceOption,
  ReassuranceDistanceOption,
} from '../../utils/PreferenceHelper';
import {SettingsData} from 'react-native-settings-screen';
import i18n from 'i18next';
import {DistanceUnitOption} from './DistanceUnitOption';

interface Props {}

interface State {
  /** Unit selection dialog visibility state toggle */
  unitDialogVisible: Boolean;
  /** Accessibility selection dialog visibility state toggle */
  accessibilityDialogVisible: Boolean;
  /** Route confirmation distance selection dialog visibility state toggle */
  routeConfirmationDistanceDialogVisible: Boolean;
  // Preference options
  AVOID_STAIRS: Boolean;
  AVOID_ELEVATORS: Boolean;
  AVOID_REVOLVING_DOORS: Boolean;
  AVOID_NARROW_ROUTES: Boolean;
  DISTANCE_UNIT: String;
  VOICE_GUIDANCE: Boolean;
  HEADING_CORRECTION: Boolean;
  DECISION_POINTS: Boolean;
  HAZARDS: Boolean;
  LANDMARKS: Boolean;
  SEGMENTS: Boolean;
  REASSURANCE_ENABLED: Boolean;
  REASSURANCE_DISTANCE: String;
  ACCESSIBILITY_GUIDANCE: String;
  /** Settings data structure, describes screen content. */
  settingsData: SettingsData;
}

/**
 * Screen providing management of user preferences.
 */
export default class PreferenceScreen extends React.Component<Props, State> {
  state = {
    unitDialogVisible: false,
    accessibilityDialogVisible: false,
    routeConfirmationDistanceDialogVisible: false,
    // Settings
    AVOID_STAIRS: false,
    AVOID_ELEVATORS: false,
    AVOID_REVOLVING_DOORS: false,
    AVOID_NARROW_ROUTES: false,
    DISTANCE_UNIT: DistanceUnitOption.METERS.id,
    VOICE_GUIDANCE: false,
    HEADING_CORRECTION: false,
    DECISION_POINTS: false,
    HAZARDS: false,
    LANDMARKS: false,
    SEGMENTS: false,
    REASSURANCE_ENABLED: false,
    REASSURANCE_DISTANCE: ReassuranceDistanceOption.METERS_15.id,
    ACCESSIBILITY_GUIDANCE: AccessibilityGuidanceOption.NONE.id,
    settingsData: [],
  } as State;

  componentDidMount() {
    // Load stored preferences
    PreferenceHelper.getPreferences().then((preferences) => {
      this.setState(preferences, () => {
        this.refreshSettingsData();
      });
    });
  }

  componentWillUnmount() {
    // Store preferences when exiting screen, this will also apply preferences.
    PreferenceHelper.setPreferences({
      AVOID_STAIRS:           JSON.stringify(this.state.AVOID_STAIRS),
      AVOID_ELEVATORS:        JSON.stringify(this.state.AVOID_ELEVATORS),
      AVOID_REVOLVING_DOORS:  JSON.stringify(this.state.AVOID_REVOLVING_DOORS),
      AVOID_NARROW_ROUTES:    JSON.stringify(this.state.AVOID_NARROW_ROUTES),
      DISTANCE_UNIT:          this.state.DISTANCE_UNIT,
      VOICE_GUIDANCE:         JSON.stringify(this.state.VOICE_GUIDANCE),
      HEADING_CORRECTION:     JSON.stringify(this.state.HEADING_CORRECTION),
      DECISION_POINTS:        JSON.stringify(this.state.DECISION_POINTS),
      HAZARDS:                JSON.stringify(this.state.HAZARDS),
      LANDMARKS:              JSON.stringify(this.state.LANDMARKS),
      SEGMENTS:               JSON.stringify(this.state.SEGMENTS),
      REASSURANCE_ENABLED:    JSON.stringify(this.state.REASSURANCE_ENABLED),
      REASSURANCE_DISTANCE:   this.state.REASSURANCE_DISTANCE,
      ACCESSIBILITY_GUIDANCE: this.state.ACCESSIBILITY_GUIDANCE,
    });
  }

  render() {
    return (
      <View style={StyleSheet.absoluteFill}>
      {/*<StatusBar />*/}
        <SettingsScreen data={this.state.settingsData} style={styles.settings} />
        {this.optionsDialog(
          DistanceUnitOption,
          this.state.unitDialogVisible,
          this.onUnitOptionSelected.bind(this),
          this.hideDistanceUnitDialog.bind(this),
        )}
        {this.optionsDialog(
          AccessibilityGuidanceOption,
          this.state.accessibilityDialogVisible,
          this.onAccessibilityOptionSelected.bind(this),
          this.hideAccessibilityDialog.bind(this),
        )}
        {this.optionsDialog(
          ReassuranceDistanceOption,
          this.state.routeConfirmationDistanceDialogVisible,
          this.onReassuranceDistanceOptionSelected.bind(this),
          this.hideReassuranceDistanceDialog.bind(this),
        )}
      </View>
    );
  }

  /**
   * Generates dialog for options.
   * @param options options to display
   * @param visibility visibility toggle state variable
   * @param onOptionSelected callback when an option is selected
   * @param onDismiss callback when dialog is dismissed
   * @returns {JSX.Element}
   * @private
   */
  private optionsDialog(options, visibility, onOptionSelected, onDismiss) {
    let optionViews = Object.entries(options).map((it) => {
      let item = it[1];
      return (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.5}
          onPress={() => onOptionSelected(item)}>
          <Text style={styles.dialogSelectionOption}>{i18n.t(item.name)}</Text>
        </TouchableOpacity>
      );
    });
    return (
      <Dialog visible={visibility} onDismiss={onDismiss}>
        <View>{optionViews}</View>
      </Dialog>
    );
  }

  /**
   * Updates accessibility preference to new value, updates screen.
   * @param newValue
   * @private
   */
  private onAccessibilityOptionSelected(newValue) {
    this.setState({ACCESSIBILITY_GUIDANCE: newValue.id}, () => {
      this.hideAccessibilityDialog();
      this.refreshSettingsData();
    });
  }

  /**
   * Updates reassurance-distance preference to new value, updates screen.
   * @param newValue
   * @private
   */
  private onReassuranceDistanceOptionSelected(newValue) {
    this.setState({REASSURANCE_DISTANCE: newValue.id}, () => {
      this.hideReassuranceDistanceDialog();
      this.refreshSettingsData();
    });
  }

  /**
   * Updates distance-unit preference to new value, updates screen.
   * @param newValue
   * @private
   */
  private onUnitOptionSelected(newValue) {
    this.setState({DISTANCE_UNIT: newValue.id}, () => {
      this.hideDistanceUnitDialog();
      this.refreshSettingsData();
    });
  }

  private showDistanceUnitDialog() {
    this.setState({unitDialogVisible: true});
  }

  private hideDistanceUnitDialog() {
    this.setState({unitDialogVisible: false});
  }

  private showAccessibilityDialog() {
    this.setState({accessibilityDialogVisible: true});
  }

  private hideAccessibilityDialog() {
    this.setState({accessibilityDialogVisible: false});
  }

  private showReassuranceDistanceDialog() {
    if (this.state.VOICE_GUIDANCE) {
      this.setState({routeConfirmationDistanceDialogVisible: true});
    }
  }

  private hideReassuranceDistanceDialog() {
    this.setState({routeConfirmationDistanceDialogVisible: false});
  }

  private openPolicy = () => {
    this.props.navigation.navigate('PolicyScreen');
  };

  /**
   * Generates switch view.
   * @param value value of switch
   * @param onValueChange callback when value is changed
   * @param disabled disables user interaction with the swich
   * @returns {JSX.Element}
   * @private
   */
  private renderSwitch(value, onValueChange, disabled: false) {
    return (
      <Switch disabled={disabled} value={value} onValueChange={onValueChange} />
    );
  }

  /**
   * Changes voice guidance state.
   * @param value
   * @private
   */
  private toggleVoiceGuidance(value) {
    this.setState({VOICE_GUIDANCE: value}, () => this.refreshSettingsData());
  }

  private setAvoidStairs = (enabled: boolean) => {
    const stairs = enabled;
    const elevator = stairs && this.state.AVOID_ELEVATORS ? false : this.state.AVOID_ELEVATORS;
    this.setState({AVOID_ELEVATORS: elevator, AVOID_STAIRS: stairs});
  };

  private setAvoidElevator = (enabled: boolean) => {
    const elevator = enabled;
    const stairs = elevator && this.state.AVOID_STAIRS ? false : this.state.AVOID_STAIRS;
    this.setState({AVOID_ELEVATORS: elevator, AVOID_STAIRS: stairs});
  };

  /**
   * Forces update of the UI by re-generating settings data. This a a workaround due to settings screen not refreshing properly.
   * @private
   */
  private refreshSettingsData() {
    let data = [
      {
        type: 'SECTION',
        header: i18n.t('preferencescreen.route_options'),
        rows: [
          {
            title: i18n.t('preferencescreen.avoid_stairs'),
            renderAccessory: () => this.renderSwitch(this.state.AVOID_STAIRS, (value) => this.setAvoidStairs(value)),
          },
          {
            title: i18n.t('preferencescreen.avoid_elevators'),
            renderAccessory: () => this.renderSwitch(this.state.AVOID_ELEVATORS, (value) => this.setAvoidElevator(value)),
          },
          {
            title: i18n.t('preferencescreen.avoid_revolving_doors'),
            renderAccessory: () => this.renderSwitch(this.state.AVOID_REVOLVING_DOORS, (value) => this.setState({AVOID_REVOLVING_DOORS: value})),
          },
          {
            title: i18n.t('preferencescreen.accessible_routes'),
            renderAccessory: () => this.renderSwitch(this.state.AVOID_NARROW_ROUTES, (value) => this.setState({AVOID_NARROW_ROUTES: value})),
          },
          {
            title: i18n.t('preferencescreen.distance_units'),
            subtitle: this.getOptionNameById(DistanceUnitOption, this.state.DISTANCE_UNIT),
            onPress: this.showDistanceUnitDialog.bind(this),
          },
        ],
      },
      {
        type: 'SECTION',
        header: i18n.t('preferencescreen.voice_guidance'),
        rows: [
          {
            title: i18n.t('preferencescreen.voice_guidance_enable'),
            renderAccessory: () => this.renderSwitch(this.state.VOICE_GUIDANCE, (value) => this.toggleVoiceGuidance(value)),
          },
          {
            title: i18n.t('preferencescreen.voice_guidance_confirm_direction'),
            renderAccessory: () => this.renderSwitch(this.state.HEADING_CORRECTION, (value) => this.setState({HEADING_CORRECTION: value}), !this.state.VOICE_GUIDANCE),
          },
          {
            title: i18n.t('preferencescreen.voice_guidance_decision_points'),
            renderAccessory: () => this.renderSwitch(this.state.DECISION_POINTS, (value) => this.setState({DECISION_POINTS: value}), !this.state.VOICE_GUIDANCE),
          },
          {
            title: i18n.t('preferencescreen.voice_guidance_hazards'),
            renderAccessory: () => this.renderSwitch(this.state.HAZARDS, (value) => this.setState({HAZARDS: value}), !this.state.VOICE_GUIDANCE),
          },
          {
            title: i18n.t('preferencescreen.voice_guidance_landmarks'),
            renderAccessory: () => this.renderSwitch(this.state.LANDMARKS, (value) => this.setState({LANDMARKS: value}), !this.state.VOICE_GUIDANCE),
          },
          {
            title: i18n.t('preferencescreen.voice_guidance_areas'),
            renderAccessory: () => this.renderSwitch(this.state.SEGMENTS, (value) => this.setState({SEGMENTS: value}), !this.state.VOICE_GUIDANCE),
          },
          {
            title: i18n.t('preferencescreen.voice_guidance_reasurrance'),
            renderAccessory: () => this.renderSwitch(this.state.REASSURANCE_ENABLED, (value) => this.setState({REASSURANCE_ENABLED: value}), !this.state.VOICE_GUIDANCE),
          },
          {
            title: i18n.t('preferencescreen.voice_guidance_reasurrance_distance'),
            subtitle: this.getOptionNameById(ReassuranceDistanceOption, this.state.REASSURANCE_DISTANCE),
            onPress: this.showReassuranceDistanceDialog.bind(this),
          },
        ],
      },
      {
        type: 'SECTION',
        header: i18n.t('preferencescreen.accessibility_options'),
        rows: [
          {
            title: i18n.t('preferencescreen.accessibility_guidance'),
            subtitle: this.getOptionNameById(AccessibilityGuidanceOption, this.state.ACCESSIBILITY_GUIDANCE),
            onPress: this.showAccessibilityDialog.bind(this),
          },
        ],
      },
      {
        type: 'SECTION',
        // header: null,
        rows: [
          {
            title: i18n.t('preferencescreen.privacy_policy'),
            onPress: this.openPolicy,
          },
        ],
      },
    ];
    this.setState({settingsData: data});
  }

  /**
   * Get string name of specific item by ID from given option class.
   * @param option
   * @param id
   * @returns {undefined|*}
   * @private
   */
  private getOptionNameById(option, id) {
    let result = Object.entries(option).filter(it => it[1].id === id);
    if (result.length > 0) {
      return i18n.t(result[0][1].name);
    } else {
      return undefined;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  dialogSelectionOption: {
    padding: 16,
    width: '100%',
  },
  settings: {
    height: '100%',
    paddingTop: 12,
  },
});
