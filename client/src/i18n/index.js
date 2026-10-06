import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';
import hi from './hi.json';
import pa from './pa.json';
import mr from './mr.json';
import ta from './ta.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  hne: { translation: hi }, // Haryanvi uses Hindi UI strings per PRD
  pa: { translation: pa },
  mr: { translation: mr },
  ta: { translation: ta }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'hi',
    supportedLngs: ['hi', 'en', 'pa', 'mr', 'ta', 'hne'],
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export const languages = [
  { code: 'hi', label: 'हिंदी', scriptName: 'Hindi' },
  { code: 'en', label: 'English', scriptName: 'English' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', scriptName: 'Punjabi' },
  { code: 'hne', label: 'हरियाणवी', scriptName: 'Haryanvi' },
  { code: 'mr', label: 'मराठी', scriptName: 'Marathi' },
  { code: 'ta', label: 'தமிழ்', scriptName: 'Tamil' }
];

export default i18n;
