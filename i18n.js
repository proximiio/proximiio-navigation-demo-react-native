import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      'Where do you want to go?': 'Where do you want to go?',
      'Map': 'Map',
      'Search': 'Search',
      'Settings': 'Settings',
      'Loading...': 'Loading...',
      'You are currently in': 'You are currently in',
      'Watch out for': 'Watch out for',
      'North': 'North',
      'North-East': 'North-East',
      'East': 'East',
      'South-East': 'South-East',
      'North-West': 'North-West',
      'West': 'West',
      'South-West': 'South-West',
      'South': 'South',
      'Your location': 'Your location',
      'Destination': 'Destination',
      'Start navigation': 'Start navigation',
      'meter(s)': 'meter(s)',
      '(Calculating distance...)': '(Calculating distance...)',
      'Could not calculate steps!': 'Could not calculate steps!',
      '{count} steps': '{count} steps',
      'No description available.': 'No description available.',
      'floor_0': 'Ground Floor',
      'floor_1': 'First Floor',
      'floor_2': 'Second Floor',
      'floor_3': 'Third Floor',
      'floor_4': 'Fourth Floor',
      'floor_5': '{count}nth Floor',
    },
  },
  fr: {
    translation: {
      'Welcome to React': 'Bienvenue à React et react-i18next',
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
