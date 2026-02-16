import type { Metadata } from "next";

const SITE_NAME = "Naman Ent";
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export function createMetadata({
    title,
    description,
    image,
    url,
    type = "website",
    noIndex = false,
}: {
    title: string;
    description: string;
    image?: string;
    url?: string;
    type?: "website" | "article";
    noIndex?: boolean;
}): Metadata {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const canonicalUrl = url ? `${SITE_URL}${url}` : SITE_URL;
    const ogImage = image || `${SITE_URL}/images/og-default.jpg`;

    return {
        title: fullTitle,
        description,
        ...(noIndex && { robots: { index: false, follow: false } }),
        openGraph: {
            title: fullTitle,
            description,
            url: canonicalUrl,
            siteName: SITE_NAME,
            images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
            type,
            locale: "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title: fullTitle,
            description,
            images: [ogImage],
        },
        alternates: {
            canonical: canonicalUrl,
        },
    };
}

export function getBaseUrl(): string {
    return SITE_URL;
}

export function getSiteName(): string {
    return SITE_NAME;
}
