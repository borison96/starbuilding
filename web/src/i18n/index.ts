import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import fr from './locales/fr';
import query from '../utils/queryStr';
import { getLanguage, setLanguage } from '../storage/local.storage';

const userLang = query?.params?.lang
  || getLanguage()
  || navigator.language
  || (navigator as any).userLanguage
  || 'fr';
const lng = userLang?.includes('-') ? userLang.split('-')[0] : userLang;

if (lng) {
  setLanguage(lng);
}

i18n.use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      fr: {
        translation: fr,
      },
    },
    lng,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });
export const supportedLanguages = [
  'en',
  'fr',
];
export default i18n;
