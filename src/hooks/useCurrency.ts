"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import {
    type CurrencyCode,
    type ExchangeRates,
    getExchangeRates,
    getPreferredCurrency,
    setPreferredCurrency,
    convertCurrency,
    formatCurrency,
    formatPriceRange,
} from "~/lib/currency";

export function useCurrency() {
    const [currency, setCurrency] = useState<CurrencyCode>("INR");
    const [rates, setRates] = useState<ExchangeRates | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch base currency from settings
    const settings = useQuery(api.settings.get, {});
    const baseCurrency = (settings?.baseCurrency as CurrencyCode) || "INR";

    // Load preferred currency and rates on mount
    useEffect(() => {
        const loadCurrency = async () => {
            const preferred = getPreferredCurrency();
            setCurrency(preferred);

            const exchangeRates = await getExchangeRates();
            setRates(exchangeRates);
            setIsLoading(false);
        };

        loadCurrency();
    }, []);

    // Update currency and save preference
    const updateCurrency = (newCurrency: CurrencyCode) => {
        setCurrency(newCurrency);
        setPreferredCurrency(newCurrency);
    };

    // Helper functions that use current rates and base currency
    const convert = (amountInBase: number, targetCurrency?: CurrencyCode) => {
        if (!rates) return amountInBase;
        return convertCurrency(amountInBase, baseCurrency, targetCurrency || currency, rates);
    };

    const format = (amount: number, targetCurrency?: CurrencyCode) => {
        return formatCurrency(amount, targetCurrency || currency);
    };

    const formatRange = (minAmount: number, maxAmount: number, targetCurrency?: CurrencyCode) => {
        if (!rates) {
            const curr = targetCurrency || currency;
            const symbol = curr === "INR" ? "₹" : "$";
            return `${symbol}${minAmount} - ${symbol}${maxAmount}`;
        }
        return formatPriceRange(minAmount, maxAmount, baseCurrency, targetCurrency || currency, rates);
    };

    return {
        currency,
        setCurrency: updateCurrency,
        baseCurrency,
        rates,
        isLoading,
        convert,
        format,
        formatRange,
    };
}
