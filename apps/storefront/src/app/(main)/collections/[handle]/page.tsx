import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package2 } from "lucide-react";
import { getCollection } from "@/lib/medusa/queries/collections";
import { getProductsByCollection } from "@/lib/medusa/queries/products";
import { ProductCard, ProductCardSkeleton } from "@/components/commerce/ProductCard";
import { Suspense } from "react";
import type { HttpTypes } from "@medusajs/types";

// ─── Dynamic Metadata ─────────────────────────────────────────────────────────
export async function generateMetadata({
    params,
}: {
    params: Promise<{ handle: string }>;
}): Promise<Metadata> {
    const { handle } = await params;
    const collection = await getCollection(handle);
    if (!collection) return { title: "Collection not found" };

    return {
        title: `${collection.title} | Naman Ent`,
        description: `Shop the ${collection.title} collection — genuine printer supplies at the best prices.`,
        alternates: { canonical: `/collections/${handle}` },
        openGraph: {
            title: collection.title,
            description: `Browse ${collection.title} at Naman Ent`,
        },
    };
}

// ─── Products grid (async, streamable) ───────────────────────────────────────
async function CollectionProducts({
    collectionId,
}: {
    collectionId: string;
}) {
    const { products, count } = await getProductsByCollection(collectionId, { limit: 24 });

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/5">
                    <Package2 className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                </div>
                <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">No products yet</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Products will appear here once added in Medusa admin.
                    </p>
                </div>
                <Link href="/products"
                    className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors">
                    Browse All Products
                </Link>
            </div>
        );
    }

    return (
        <>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-800 dark:text-gray-100">{count}</span> product{count !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product: HttpTypes.StoreProduct) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function CollectionDetailPage({
    params,
}: {
    params: Promise<{ handle: string }>;
}) {
    const { handle } = await params;
    const collection = await getCollection(handle);

    if (!collection) notFound();

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {/* ── Breadcrumb ── */}
            <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</Link>
                <span>/</span>
                <Link href="/collections" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Collections</Link>
                <span>/</span>
                <span className="text-gray-900 dark:text-white font-medium">{collection.title}</span>
            </nav>

            {/* ── Header ── */}
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white">
                        {collection.title}
                    </h1>
                    {typeof collection.metadata?.description === "string" && (
                        <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-xl">
                            {collection.metadata.description}
                        </p>
                    )}
                </div>
                <Link href="/collections"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-gray-200 dark:border-white/10 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">All Collections</span>
                </Link>
            </div>

            {/* ── Products (streamed) ── */}
            <Suspense fallback={
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
            }>
                <CollectionProducts collectionId={collection.id} />
            </Suspense>
        </div>
    );
}
