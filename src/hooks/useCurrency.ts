"use client";

import { useState, useEffect } from "react";
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

    // Helper functions that use current rates
    const convert = (amountInINR: number, targetCurrency?: CurrencyCode) => {
        if (!rates) return amountInINR;
        return convertCurrency(amountInINR, targetCurrency || currency, rates);
    };

    const format = (amount: number, targetCurrency?: CurrencyCode) => {
        return formatCurrency(amount, targetCurrency || currency);
    };

    const formatRange = (minINR: number, maxINR: number, targetCurrency?: CurrencyCode) => {
        if (!rates) return `₹${minINR} - ₹${maxINR}`;
        return formatPriceRange(minINR, maxINR, targetCurrency || currency, rates);
    };

    return {
        currency,
        setCurrency: updateCurrency,
        rates,
        isLoading,
        convert,
        format,
        formatRange,
    };
}
