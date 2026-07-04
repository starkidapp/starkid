import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import { I18nManager } from 'react-native';

import ar from './locales/ar.json';
import en from './locales/en.json';

const i18n = new I18n({ en, ar }, { defaultLocale: 'en' });

// Detect device locale
const deviceLocale = getLocales()?.[0]?.languageCode || 'en';
i18n.locale = deviceLocale === 'ar' ? 'ar' : 'en';
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

export function t(key: string, params?: Record<string, any>) {
  return i18n.t(key, params) as string;
}

export function currentLocale() {
  return i18n.locale;
}

export function isRTL() {
  return i18n.locale.startsWith('ar');
}

export async function setLocale(locale: string) {
  i18n.locale = locale;

  const shouldBeRTL = locale.startsWith('ar');
  try {
    if (I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.allowRTL(shouldBeRTL);
      I18nManager.forceRTL(shouldBeRTL);
      // Reload would happen automatically on native build, skip in Expo Go
    }
  } catch (error) {
    console.warn('Failed applying RTL change', error);
  }
}

export default i18n;
