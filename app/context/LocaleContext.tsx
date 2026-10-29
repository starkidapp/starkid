import { AppLocale, setLocale as applyLocale, t as translate } from '@/lib/i18n';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface LocaleContextType {
    locale: AppLocale;
    setLocale: (locale: AppLocale) => Promise<void>;
    t: (key: string, params?: Record<string, any>) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// `locale` is held in state (not read from i18n during render) so the React
// Compiler can't cache a stale value, and every consumer re-renders on change.
export function LocaleProvider({
    locale: loadedLocale,
    children,
}: {
    locale: AppLocale;
    children: React.ReactNode;
}) {
    const [locale, setLocaleState] = useState(loadedLocale);
    useEffect(() => setLocaleState(loadedLocale), [loadedLocale]);

    const setLocale = useCallback(async (next: AppLocale) => {
        setLocaleState(next);
        await applyLocale(next);
    }, []);

    // Depends on `locale` so screens using it re-render with the new strings.
    const t = useCallback(
        (key: string, params?: Record<string, any>) => translate(key, params),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [locale],
    );

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
