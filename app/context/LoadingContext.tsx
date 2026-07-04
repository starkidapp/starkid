import React, { createContext, useContext, useState } from "react";

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

    const showLoading = () => setLoading(true);
    const hideLoading = () => setLoading(false);

    return (
        <LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>
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

    return async <T,>(fn: () => Promise<T>): Promise<T> => {
        showLoading();
        try {
            return await fn();
        } finally {
            hideLoading();
        }
    };
};
