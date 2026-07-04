import ar from '@/lib/locales/ar.json';
import en from '@/lib/locales/en.json';
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import React, { createContext, useContext, useState } from 'react';
import { I18nManager } from 'react-native';

// Create i18n instance
const i18n = new I18n({ en, ar }, { defaultLocale: 'en' });
const deviceLocale = getLocales()?.[0]?.languageCode || 'en';
i18n.locale = deviceLocale === 'ar' ? 'ar' : 'en';
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

interface LocaleContextType {
    locale: string;
    setLocale: (locale: string) => Promise<void>;
    t: (key: string, params?: Record<string, any>) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState(i18n.locale);

    const setLocale = async (newLocale: string) => {
        i18n.locale = newLocale;
        setLocaleState(newLocale);

        // Apply RTL changes
        const shouldBeRTL = newLocale.startsWith('ar');
        try {
            if (I18nManager.isRTL !== shouldBeRTL) {
                I18nManager.allowRTL(shouldBeRTL);
                I18nManager.forceRTL(shouldBeRTL);
            }
        } catch (error) {
            console.warn('Failed applying RTL change', error);
        }
    };

    const t = (key: string, params?: Record<string, any>) => {
        return i18n.t(key, params) as string;
    };

    return (
        <LocaleContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    const context = useContext(LocaleContext);
    if (!context) {
        throw new Error('useLocale must be used within LocaleProvider');
    }
    return context;
}
