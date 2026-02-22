import Link from "next/link";
import { ArrowRight, Package2 } from "lucide-react";
import type { Metadata } from "next";
import { createMetadata } from "@/lib/utils/seo";
import { getCollections } from "@/lib/medusa/queries/collections";
import { getProducts } from "@/lib/medusa/queries/products";

export const metadata: Metadata = createMetadata({
    title: "Collections",
    description: "Browse our curated collections of printer toner, ink cartridges, and accessories at Naman Ent.",
    url: "/collections",
});

export default async function CollectionsPage() {
    const [collectionsData, featuredData] = await Promise.all([
        getCollections(),
        getProducts({ limit: 4 }),
    ]);

    const collections = collectionsData.collections ?? [];

    // ── Category color map for visual variety ─────────────────────────────────
    const colors = [
        { gradient: "from-primary-600 to-primary-800", badge: "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400" },
        { gradient: "from-amber-500 to-orange-600", badge: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" },
        { gradient: "from-violet-600 to-purple-700", badge: "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400" },
        { gradient: "from-emerald-500 to-teal-600", badge: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" },
        { gradient: "from-rose-500 to-pink-600", badge: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400" },
        { gradient: "from-sky-500 to-cyan-600", badge: "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400" },
    ];

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {/* ── Header ── */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white">
                    Collections
                </h1>
                <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                    Browse our curated collections of genuine printer supplies and accessories.
                </p>
            </div>

            {/* ── Collection grid ── */}
            {collections.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.map((col, i) => {
                        const color = colors[i % colors.length];
                        return (
                            <Link
                                key={col.id}
                                href={`/collections/${col.handle}`}
                                className="group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-surface-dark-secondary shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5"
                            >
                                {/* Gradient accent stripe */}
                                <div className={`h-2 w-full bg-gradient-to-r ${color.gradient}`} />

                                <div className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                {col.title}
                                            </h2>
                                            {typeof col.metadata?.description === "string" && col.metadata.description && (
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                                    {col.metadata.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className={`shrink-0 flex h-10 w-10 items-center justify-center rounded-xl ${color.badge}`}>
                                            <Package2 className="h-5 w-5" />
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${color.badge}`}>
                                            Browse collection
                                        </span>
                                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                /* ── Empty state ── */
                <div className="flex flex-col items-center gap-5 py-20 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/5">
                        <Package2 className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-100">No collections yet</p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Collections will appear here once added in Medusa admin.
                        </p>
                    </div>
                    <Link href="/products"
                        className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors">
                        Browse All Products
                    </Link>
                </div>
            )}

            {/* ── All products CTA ── */}
            {collections.length > 0 && (
                <div className="mt-12 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 p-8 text-center text-white">
                    <h3 className="font-display text-xl font-bold">Can&apos;t find what you need?</h3>
                    <p className="mt-2 text-white/70 text-sm">Browse all {featuredData.count ?? 0}+ products in our catalog.</p>
                    <Link href="/products"
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2.5 text-sm font-semibold transition-all">
                        View All Products <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            )}
        </div>
    );
}
