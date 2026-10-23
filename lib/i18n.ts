import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import * as Updates from 'expo-updates';
import { I18n } from 'i18n-js';
import { DevSettings, I18nManager } from 'react-native';

import ar from './locales/ar.json';
import en from './locales/en.json';

export type AppLocale = 'en' | 'ar';

const STORAGE_KEY = 'app.locale';

const i18n = new I18n({ en, ar }, { defaultLocale: 'en' });

// Detect device locale (overridden by the saved choice in loadSavedLocale)
const deviceLocale = getLocales()?.[0]?.languageCode || 'en';
i18n.locale = deviceLocale === 'ar' ? 'ar' : 'en';
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

export function t(key: string, params?: Record<string, any>) {
  return i18n.t(key, params) as string;
}

export function currentLocale(): AppLocale {
  return i18n.locale.startsWith('ar') ? 'ar' : 'en';
}

export function isRTL() {
  return i18n.locale.startsWith('ar');
}

function applyDirection(locale: string) {
  const shouldBeRTL = locale.startsWith('ar');
  try {
    if (I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.allowRTL(shouldBeRTL);
      I18nManager.forceRTL(shouldBeRTL);
    }
  } catch (error) {
    console.warn('Failed applying RTL change', error);
  }
}

/** Apply the language the user picked last time. Call once before rendering screens. */
export async function loadSavedLocale() {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'ar') i18n.locale = saved;
  } catch (error) {
    console.warn('Failed loading saved locale', error);
  }
  applyDirection(i18n.locale);
}

/**
 * Switch language, remember it, and reload the app so every screen picks up
 * the new strings and the RTL/LTR layout direction (which only applies on start).
 */
export async function setLocale(locale: AppLocale) {
  i18n.locale = locale;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, locale);
  } catch (error) {
    console.warn('Failed saving locale', error);
  }
  applyDirection(locale);

  try {
    if (__DEV__) {
      DevSettings.reload();
    } else {
      await Updates.reloadAsync();
    }
  } catch (error) {
    console.warn('Failed reloading after locale change', error);
  }
}

export default i18n;
