import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type LoadingContextType = {
    loading: boolean;
    showLoading: () => void;
    hideLoading: () => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(
    undefined,
);

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(false);

    // Stable identities: screens list these in effect deps, so new functions
    // on every render would re-run those effects (and re-subscribe auth listeners).
    const showLoading = useCallback(() => setLoading(true), []);
    const hideLoading = useCallback(() => setLoading(false), []);
    const value = useMemo(
        () => ({ loading, showLoading, hideLoading }),
        [loading, showLoading, hideLoading],
    );

    return (
        <LoadingContext.Provider value={value}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const ctx = useContext(LoadingContext);
    if (!ctx) throw new Error("useLoading must be used within LoadingProvider");
    return ctx;
};

export default LoadingContext;

export const useWithLoading = () => {
    const { showLoading, hideLoading } = useLoading();

    return useCallback(
        async <T,>(fn: () => Promise<T>): Promise<T> => {
            showLoading();
            try {
                return await fn();
            } finally {
                hideLoading();
            }
        },
        [showLoading, hideLoading],
    );
};
