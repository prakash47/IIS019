export const DEFAULT_SEO = {
    siteName: "Naman Ent",
    siteUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    defaultTitle: "Naman Ent — Premium Ecommerce Store",
    defaultDescription:
        "Discover premium products at Naman Ent. Shop the latest collections with free shipping on orders above ₹999. Quality guaranteed.",
    defaultImage: "/images/og-default.jpg",
    twitterHandle: "@namanent",
    locale: "en_US",
} as const;

export const JSON_LD_BASE = {
    "@context": "https://schema.org",
} as const;
