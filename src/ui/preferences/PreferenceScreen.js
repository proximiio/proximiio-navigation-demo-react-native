/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
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
  Preference,
  ReassuranceDistanceOption,
  DistanceUnitOption,
} from '../../utils/PreferenceHelper';
import {SettingsData} from 'react-native-settings-screen';

interface Props {
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
interface State {}

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
  };

  componentDidMount() {
    // Load stored preferences
    PreferenceHelper.getPreferences().then((preferences) => {
      this.setState(preferences, () => {
        this.__refreshSettingsData();
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
      <View style={styles.container}>
        <StatusBar />
        <SettingsScreen data={this.state.settingsData} style={styles.settings} />
        {this.__optionsDialog(
          DistanceUnitOption,
          this.state.unitDialogVisible,
          this.__onUnitOptionSelected.bind(this),
          this.__hideDistanceUnitDialog.bind(this),
        )}
        {this.__optionsDialog(
          AccessibilityGuidanceOption,
          this.state.accessibilityDialogVisible,
          this.__onAccessibilityOptionSelected.bind(this),
          this.__hideAccessibilityDialog.bind(this),
        )}
        {this.__optionsDialog(
          ReassuranceDistanceOption,
          this.state.routeConfirmationDistanceDialogVisible,
          this.__onReassuranceDistanceOptionSelected.bind(this),
          this.__hideReassuranceDistanceDialog.bind(this),
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
  __optionsDialog(options, visibility, onOptionSelected, onDismiss) {
    let optionViews = Object.entries(options).map((it) => {
      let item = it[1];
      return (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.5}
          onPress={() => onOptionSelected(item)}>
          <Text style={styles.dialogSelectionOption}>{item.name}</Text>
        </TouchableOpacity>
      );
    });
    return (
      <Dialog
        visible={visibility}
        title="Choose distance unit"
        onDismiss={onDismiss}>
        <View>{optionViews}</View>
      </Dialog>
    );
  }

  /**
   * Updates accessibility preference to new value, updates screen.
   * @param newValue
   * @private
   */
  __onAccessibilityOptionSelected(newValue) {
    console.log('accessibility changed', newValue);
    this.setState({ACCESSIBILITY_GUIDANCE: newValue.id}, () => {
      this.__hideAccessibilityDialog();
      this.__refreshSettingsData(this.state);
    });
  }

  /**
   * Updates reassurance-distance preference to new value, updates screen.
   * @param newValue
   * @private
   */
  __onReassuranceDistanceOptionSelected(newValue) {
    console.log('route confirmation distance changed: ', newValue);
    this.setState({REASSURANCE_DISTANCE: newValue.id}, () => {
      this.__hideReassuranceDistanceDialog();
      this.__refreshSettingsData(this.state);
    });
  }

  /**
   * Updates distance-unit preference to new value, updates screen.
   * @param newValue
   * @private
   */
  __onUnitOptionSelected(newValue) {
    console.log('unit changed', newValue);
    this.setState({DISTANCE_UNIT: newValue.id}, () => {
      this.__hideDistanceUnitDialog();
      this.__refreshSettingsData(this.state);
    });
  }

  __showDistanceUnitDialog() {
    this.setState({unitDialogVisible: true});
  }

  __hideDistanceUnitDialog() {
    this.setState({unitDialogVisible: false});
  }

  __showAccessibilityDialog() {
    this.setState({accessibilityDialogVisible: true});
  }

  __hideAccessibilityDialog() {
    this.setState({accessibilityDialogVisible: false});
  }

  __showReassuranceDistanceDialog() {
    if (this.state.VOICE_GUIDANCE) {
      this.setState({routeConfirmationDistanceDialogVisible: true});
    }
  }

  __hideReassuranceDistanceDialog() {
    this.setState({routeConfirmationDistanceDialogVisible: false});
  }

  /**
   * Generates switch view.
   * @param value value of switch
   * @param onValueChange callback when value is changed
   * @param disabled disables user interaction with the swich
   * @returns {JSX.Element}
   * @private
   */
  __switch(value, onValueChange, disabled: false) {
    console.log('disabled ', disabled);
    return (
      <Switch disabled={disabled} value={value} onValueChange={onValueChange} />
    );
  }

  /**
   * Changes voice guidance state.
   * @param value
   * @private
   */
  __toggleVoiceGuidance(value) {
    this.setState({VOICE_GUIDANCE: value}, () => this.__refreshSettingsData());
  }

  /**
   * Forces update of the UI by re-generating settings data. This a a workaround due to settings screen not refreshing properly.
   * @private
   */
  __refreshSettingsData() {
    let data = [
      {
        type: 'SECTION',
        header: 'Route options',
        rows: [
          {
            title: 'Avoid stairs',
            renderAccessory: () => this.__switch(this.state.AVOID_STAIRS, (value) => this.setState({AVOID_STAIRS: value})),
          },
          {
            title: 'Avoid elevators',
            renderAccessory: () => this.__switch(this.state.AVOID_ELEVATORS, (value) => this.setState({AVOID_ELEVATORS: value})),
          },
          {
            title: 'Avoid revolving doors',
            renderAccessory: () => this.__switch(this.state.AVOID_REVOLVING_DOORS, (value) => this.setState({AVOID_REVOLVING_DOORS: value})),
          },
          {
            title: 'Use accessible routes',
            renderAccessory: () => this.__switch(this.state.AVOID_NARROW_ROUTES, (value) => this.setState({AVOID_NARROW_ROUTES: value})),
          },
          {
            title: 'Measure distance in',
            subtitle: this.__getOptionNameById(DistanceUnitOption, this.state.DISTANCE_UNIT),
            onPress: this.__showDistanceUnitDialog.bind(this),
          },
        ],
      },
      {
        type: 'SECTION',
        header: 'Voice guidance',
        rows: [
          {
            title: 'Enable voice guidance',
            renderAccessory: () => this.__switch(this.state.VOICE_GUIDANCE, (value) => this.__toggleVoiceGuidance(value)),
          },
          {
            title: 'Confirm direction of travel',
            renderAccessory: () => this.__switch(this.state.HEADING_CORRECTION, (value) => this.setState({HEADING_CORRECTION: value}), !this.state.VOICE_GUIDANCE),
          },
          {
            title: 'Tell me about decision points',
            renderAccessory: () => this.__switch(this.state.DECISION_POINTS, (value) => this.setState({DECISION_POINTS: value}), !this.state.VOICE_GUIDANCE),
          },
          {
            title: 'Tell me about hazards',
            renderAccessory: () => this.__switch(this.state.HAZARDS, (value) => this.setState({HAZARDS: value}), !this.state.VOICE_GUIDANCE),
          },
          {
            title: 'Tell me about landmarks',
            renderAccessory: () => this.__switch(this.state.LANDMARKS, (value) => this.setState({LANDMARKS: value}), !this.state.VOICE_GUIDANCE),
          },
          {
            title: 'Tell me about areas',
            renderAccessory: () => this.__switch(this.state.SEGMENTS, (value) => this.setState({SEGMENTS: value}), !this.state.VOICE_GUIDANCE),
          },
          {
            title: 'Confirm route',
            renderAccessory: () => this.__switch(this.state.REASSURANCE_ENABLED, (value) => this.setState({REASSURANCE_ENABLED: value}), !this.state.VOICE_GUIDANCE),
          },
          {
            title: 'Confirm route every',
            subtitle: this.__getOptionNameById(ReassuranceDistanceOption, this.state.REASSURANCE_DISTANCE),
            onPress: this.__showReassuranceDistanceDialog.bind(this),
          },
        ],
      },
      {
        type: 'SECTION',
        header: 'Accessibility options',
        rows: [
          {
            title: 'Guidance based on disability',
            subtitle: this.__getOptionNameById(AccessibilityGuidanceOption, this.state.ACCESSIBILITY_GUIDANCE),
            onPress: this.__showAccessibilityDialog.bind(this),
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
  __getOptionNameById(option, id) {
    let result = Object.entries(option).filter(it => it[1].id === id);
    console.log('option', Object.entries(option), result);
    if (result.length > 0) {
      return result[0][1].name;
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
