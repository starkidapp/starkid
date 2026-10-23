import { AppLocale, currentLocale, setLocale, t } from '@/lib/i18n';
import React, { createContext, useContext } from 'react';

interface LocaleContextType {
    locale: AppLocale;
    setLocale: (locale: AppLocale) => Promise<void>;
    t: (key: string, params?: Record<string, any>) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// The app reloads on every language change (see lib/i18n setLocale), so the
// locale is fixed for the lifetime of this provider.
export function LocaleProvider({ children }: { children: React.ReactNode }) {
    return (
        <LocaleContext.Provider value={{ locale: currentLocale(), setLocale, t }}>
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
