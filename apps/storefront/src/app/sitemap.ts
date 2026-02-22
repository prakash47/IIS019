import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/medusa/queries/products";
import { getCollections } from "@/lib/medusa/queries/collections";
import { getCategories } from "@/lib/medusa/queries/categories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://namanent.com";

    // ── Static pages ──────────────────────────────────────────────────────────
    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
        { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
        { url: `${baseUrl}/collections`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
        { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
        { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
        { url: `${baseUrl}/shipping-returns`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
        { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
        { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    ];

    // ── Dynamic: Products ─────────────────────────────────────────────────────
    let productPages: MetadataRoute.Sitemap = [];
    try {
        // Fetch all products in batches (max 500 at a time)
        const { products, count } = await getProducts({ limit: 100, offset: 0 });
        const allProducts = [...products];

        // Fetch remaining pages if needed
        if (count > 100) {
            const remaining = Math.ceil((count - 100) / 100);
            const batches = await Promise.all(
                Array.from({ length: remaining }, (_, i) =>
                    getProducts({ limit: 100, offset: (i + 1) * 100 })
                )
            );
            batches.forEach((b) => allProducts.push(...b.products));
        }

        productPages = allProducts
            .filter((p) => p.handle)
            .map((p) => ({
                url: `${baseUrl}/products/${p.handle}`,
                lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
                changeFrequency: "weekly" as const,
                priority: 0.8,
            }));
    } catch {
        // Medusa may not be available at build time — skip
    }

    // ── Dynamic: Collections ──────────────────────────────────────────────────
    let collectionPages: MetadataRoute.Sitemap = [];
    try {
        const { collections } = await getCollections();
        collectionPages = (collections ?? [])
            .filter((c) => c.handle)
            .map((c) => ({
                url: `${baseUrl}/collections/${c.handle}`,
                lastModified: c.updated_at ? new Date(c.updated_at) : new Date(),
                changeFrequency: "weekly" as const,
                priority: 0.75,
            }));
    } catch {
        // Skip
    }

    // ── Dynamic: Categories ───────────────────────────────────────────────────
    let categoryPages: MetadataRoute.Sitemap = [];
    try {
        const { categories } = await getCategories({ limit: 100 });
        categoryPages = (categories ?? [])
            .filter((c) => c.handle)
            .map((c) => ({
                url: `${baseUrl}/categories/${c.handle}`,
                lastModified: new Date(),
                changeFrequency: "weekly" as const,
                priority: 0.7,
            }));
    } catch {
        // Skip
    }

    return [...staticPages, ...productPages, ...collectionPages, ...categoryPages];
}
