export type Currency = {
    code: string;
    symbol: string;
    locale: string;
};

const CURRENCY_MAP: Record<string, Currency> = {
    usd: { code: "USD", symbol: "$", locale: "en-US" },
    eur: { code: "EUR", symbol: "€", locale: "de-DE" },
    gbp: { code: "GBP", symbol: "£", locale: "en-GB" },
    inr: { code: "INR", symbol: "₹", locale: "en-IN" },
};

export function formatPrice(
    amount: number,
    currencyCode: string = "usd"
): string {
    const currency = CURRENCY_MAP[currencyCode.toLowerCase()] ?? {
        code: currencyCode.toUpperCase(),
        symbol: currencyCode.toUpperCase(),
        locale: "en-US",
    };

    return new Intl.NumberFormat(currency.locale, {
        style: "currency",
        currency: currency.code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount / 100);
}

export function calculateDiscount(
    originalPrice: number,
    salePrice: number
): number {
    if (originalPrice <= 0) return 0;
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

export function formatPriceRange(
    minPrice: number,
    maxPrice: number,
    currencyCode: string = "usd"
): string {
    if (minPrice === maxPrice) {
        return formatPrice(minPrice, currencyCode);
    }
    return `${formatPrice(minPrice, currencyCode)} – ${formatPrice(maxPrice, currencyCode)}`;
}
