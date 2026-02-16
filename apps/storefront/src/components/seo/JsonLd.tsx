import { DEFAULT_SEO } from "@/lib/constants/seo";

interface JsonLdProps {
    data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    ...data,
                }),
            }}
        />
    );
}

export function OrganizationJsonLd() {
    return (
        <JsonLd
            data={{
                "@type": "Organization",
                name: DEFAULT_SEO.siteName,
                url: DEFAULT_SEO.siteUrl,
                logo: `${DEFAULT_SEO.siteUrl}/images/logo.png`,
                sameAs: [],
                contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "customer service",
                    availableLanguage: "English",
                },
            }}
        />
    );
}

export function WebsiteJsonLd() {
    return (
        <JsonLd
            data={{
                "@type": "WebSite",
                name: DEFAULT_SEO.siteName,
                url: DEFAULT_SEO.siteUrl,
                potentialAction: {
                    "@type": "SearchAction",
                    target: {
                        "@type": "EntryPoint",
                        urlTemplate: `${DEFAULT_SEO.siteUrl}/search?q={search_term_string}`,
                    },
                    "query-input": "required name=search_term_string",
                },
            }}
        />
    );
}

export function BreadcrumbJsonLd({
    items,
}: {
    items: { name: string; url: string }[];
}) {
    return (
        <JsonLd
            data={{
                "@type": "BreadcrumbList",
                itemListElement: items.map((item, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    name: item.name,
                    item: item.url,
                })),
            }}
        />
    );
}
