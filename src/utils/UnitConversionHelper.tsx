import {Preference} from './PreferenceHelper';
import i18n from 'i18next';
import {STEP_LENGTH} from './UnitConversions';
import {DistanceUnitOption} from '../ui/preferences/DistanceUnitOption';

class UnitConversionHelperClass {
  private preferredDistanceUnit = DistanceUnitOption.METERS.id;

  public refreshPreferenceDistanceUnit = (preferences) => {
    this.preferredDistanceUnit = preferences[Preference.DISTANCE_UNIT];
  };

  public getDistanceInPreferredUnits = (distanceInMeters: number) => {
    if (this.preferredDistanceUnit === DistanceUnitOption.STEPS.id) {
      let steps = Math.round(distanceInMeters / STEP_LENGTH);
      return i18n.t('common.steps', {count: steps});
    } else {
      let meters = Math.round(distanceInMeters);
      return i18n.t('common.meters', {count: meters});
    }
  };
}

export const UnitConversionHelper = new UnitConversionHelperClass();
