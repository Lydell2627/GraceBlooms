"use client";

import * as React from "react";
import { type CurrencyCode } from "~/lib/currency";
import { useCurrency as useBaseCurrency } from "~/hooks/useCurrency";

interface CurrencyContextValue {
    currency: CurrencyCode;
    setCurrency: (currency: CurrencyCode) => void;
    baseCurrency: CurrencyCode;
    isLoading: boolean;
    convert: (amount: number, targetCurrency?: CurrencyCode) => number;
    format: (amount: number, targetCurrency?: CurrencyCode) => string;
    formatRange: (min: number, max: number, targetCurrency?: CurrencyCode) => string;
}

const CurrencyContext = React.createContext<CurrencyContextValue | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const currencyData = useBaseCurrency();

    return (
        <CurrencyContext.Provider value={currencyData}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = React.useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error("useCurrency must be used within a CurrencyProvider");
    }
    return context;
}
