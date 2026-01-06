// Currency types and utilities for international customer support

export const SUPPORTED_CURRENCIES = {
    INR: { code: "INR", symbol: "₹", name: "Indian Rupee" },
    USD: { code: "USD", symbol: "$", name: "US Dollar" },
    EUR: { code: "EUR", symbol: "€", name: "Euro" },
    GBP: { code: "GBP", symbol: "£", name: "British Pound" },
    AED: { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
} as const;

export type CurrencyCode = keyof typeof SUPPORTED_CURRENCIES;

export interface ExchangeRates {
    base: string;
    rates: Record<CurrencyCode, number>;
    timestamp: number;
}

const CACHE_KEY = "grace_blooms_exchange_rates";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Fetches current exchange rates from API
 * Using exchangerate-api.com free tier (1500 requests/month)
 */
export async function fetchExchangeRates(): Promise<ExchangeRates> {
    const apiUrl = "https://api.exchangerate-api.com/v4/latest/INR";

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Exchange rate API error: ${response.status}`);
        }

        const data = await response.json();

        const rates: ExchangeRates = {
            base: "INR",
            rates: {
                INR: 1,
                USD: data.rates.USD || 0.012,
                EUR: data.rates.EUR || 0.011,
                GBP: data.rates.GBP || 0.0095,
                AED: data.rates.AED || 0.044,
            },
            timestamp: Date.now(),
        };

        // Cache for 24 hours
        if (typeof window !== "undefined") {
            localStorage.setItem(CACHE_KEY, JSON.stringify(rates));
        }

        return rates;
    } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
        // Return fallback rates
        return getFallbackRates();
    }
}

/**
 * Gets cached exchange rates or fetches new ones if expired
 */
export async function getExchangeRates(): Promise<ExchangeRates> {
    if (typeof window === "undefined") {
        return getFallbackRates();
    }

    const cached = localStorage.getItem(CACHE_KEY);

    if (cached) {
        try {
            const rates: ExchangeRates = JSON.parse(cached);
            const age = Date.now() - rates.timestamp;

            // Use cached if less than 24 hours old
            if (age < CACHE_DURATION) {
                return rates;
            }
        } catch (error) {
            console.error("Invalid cached rates:", error);
        }
    }

    // Fetch fresh rates
    return fetchExchangeRates();
}

/**
 * Fallback exchange rates (approximate, updated manually)
 */
function getFallbackRates(): ExchangeRates {
    return {
        base: "INR",
        rates: {
            INR: 1,
            USD: 0.012, // 1 INR ≈ $0.012
            EUR: 0.011, // 1 INR ≈ €0.011
            GBP: 0.0095, // 1 INR ≈ £0.0095
            AED: 0.044, // 1 INR ≈ د.إ0.044
        },
        timestamp: Date.now(),
    };
}

/**
 * Converts amount from base currency to target currency
 * @param amount - Amount in the base currency
 * @param baseCurrency - The base currency the amount is in
 * @param targetCurrency - Currency to convert to
 * @param rates - Current exchange rates
 */
export function convertCurrency(
    amount: number,
    baseCurrency: CurrencyCode,
    targetCurrency: CurrencyCode,
    rates: ExchangeRates
): number {
    if (baseCurrency === targetCurrency) return amount;

    // If rates are in the base currency we're converting from, use directly
    if (rates.base === baseCurrency) {
        const rate = rates.rates[targetCurrency];
        return parseFloat((amount * rate).toFixed(2));
    }

    // Otherwise, convert via the rates' base currency
    // Step 1: Convert from baseCurrency to rates.base
    const baseRate = rates.rates[baseCurrency as CurrencyCode];
    if (!baseRate) return amount; // Fallback if rate not found

    const amountInRatesBase = amount / baseRate;

    // Step 2: Convert from rates.base to targetCurrency
    const targetRate = rates.rates[targetCurrency];
    return parseFloat((amountInRatesBase * targetRate).toFixed(2));
}

/**
 * Formats currency amount with proper symbol and notation
 */
export function formatCurrency(
    amount: number,
    currency: CurrencyCode
): string {
    const currencyInfo = SUPPORTED_CURRENCIES[currency];

    // Format with appropriate decimal places
    const formatted = new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: currency === "INR" ? 0 : 2,
        maximumFractionDigits: currency === "INR" ? 0 : 2,
    }).format(amount);

    // Special handling for AED (symbol after amount)
    if (currency === "AED") {
        return `${formatted} ${currencyInfo.symbol}`;
    }

    return `${currencyInfo.symbol}${formatted}`;
}

/**
 * Format price range with currency conversion from base currency
 */
export function formatPriceRange(
    minAmount: number,
    maxAmount: number,
    baseCurrency: CurrencyCode,
    targetCurrency: CurrencyCode,
    rates: ExchangeRates
): string {
    const min = convertCurrency(minAmount, baseCurrency, targetCurrency, rates);
    const max = convertCurrency(maxAmount, baseCurrency, targetCurrency, rates);

    return `${formatCurrency(min, targetCurrency)} - ${formatCurrency(max, targetCurrency)}`;
}

/**
 * Get user's preferred currency from localStorage
 */
export function getPreferredCurrency(): CurrencyCode {
    if (typeof window === "undefined") return "INR";

    const stored = localStorage.getItem("preferred_currency");
    if (stored && stored in SUPPORTED_CURRENCIES) {
        return stored as CurrencyCode;
    }

    return "INR";
}

/**
 * Save user's preferred currency
 */
export function setPreferredCurrency(currency: CurrencyCode): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("preferred_currency", currency);
}
