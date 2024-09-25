import {use as i18nUse} from 'i18next';
import {initReactI18next} from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18nUse(Backend)
  .use(LanguageDetector)
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    react: {
      useSuspense: false,
    },
  })
  .catch((error: unknown) => { // eslint-disable-line unicorn/prefer-top-level-await
    console.error(error);
  });

export const availableLanguages = [
  {
    short: 'en',
    long: 'English',
    longLocal: 'English',
  },
  {
    short: 'ru',
    long: 'Russian',
    longLocal: 'Русский',
  },
];

export {default} from 'i18next';
