import { getLanguage } from 'lightcone/api/localStorgeAPI';
import { initReactI18next } from 'react-i18next'; // have a own xhr fallback
import Backend from 'i18next-chained-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import XHR from 'i18next-xhr-backend';
import i18n from 'i18next';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: getLanguage(),
    backend: {
      backends: [
        LocalStorageBackend, // primary
        XHR, // fallback
      ],
      backendOptions: [
        {
          prefix: 'i18n_',
          expirationTime: 7 * 24 * 60 * 60 * 1000, // 7 days
          versions: {
            zh: process.env.COMMITHASH,
            en: process.env.COMMITHASH,
          },
          store: window.localStorage,
        },
        {
          loadPath: '/assets/i18n/{{ns}}/{{lng}}.json',
        },
      ],
    },
    fallbackLng: 'en',
    debug: false,
    ns: ['translations'],
    defaultNS: 'translations',
    keySeparator: false,
    interpolation: {
      escapeValue: false,
      formatSeparator: ',',
    },
    react: {
      wait: true,
    },
  });

export default i18n;
