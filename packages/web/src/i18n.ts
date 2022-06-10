import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      useSuspense: false,
    },
  })
  .catch((e) => { console.error(e); });

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

export default i18n;
