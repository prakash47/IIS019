"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { Search, Package } from "lucide-react";
import { ProductCard, ProductCardSkeleton } from "@/components/commerce/ProductCard";
import { FilterSidebar, ProductToolbar } from "@/components/commerce/ProductFilters";
import { getProducts } from "@/lib/medusa/queries/products";
import { getCollections } from "@/lib/medusa/queries/collections";
import { getCategories } from "@/lib/medusa/queries/categories";
import { addToCart } from "@/lib/medusa/actions/cart";
import { useCartStore } from "@/lib/store/cart-store";
import type { HttpTypes } from "@medusajs/types";

const PRODUCTS_PER_PAGE = 12;

type SortOption = "created_at" | "price_asc" | "price_desc" | "title_asc";

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ query }: { query?: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/5">
                <Package className="h-10 w-10 text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                No products found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                {query
                    ? `No results for "${query}". Try different keywords or clear filters.`
                    : "No products match the selected filters. Try adjusting your selection."}
            </p>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProductsPageClient() {
    const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [sort, setSort] = useState<SortOption>("created_at");
    const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [collections, setCollections] = useState<HttpTypes.StoreCollection[]>([]);
    const [categories, setCategories] = useState<HttpTypes.StoreProductCategory[]>([]);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState<string | null>(null);
    const [, startTransition] = useTransition();

    const { openCart, setCart } = useCartStore();

    // ── Load filter options on mount ───────────────────────────────────────────
    useEffect(() => {
        async function loadFilters() {
            const [colData, catData] = await Promise.all([
                getCollections({ limit: 50 }),
                getCategories({ limit: 50 }),
            ]);
            setCollections(colData.collections);
            setCategories(catData.categories);
        }
        loadFilters();
    }, []);

    // ── Load products whenever filters/sort/page change ────────────────────────
    const loadProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            // Build sort param for Medusa
            const orderMap: Record<SortOption, string> = {
                created_at: "-created_at",
                price_asc: "variants.prices.amount",
                price_desc: "-variants.prices.amount",
                title_asc: "title",
            };

            const result = await getProducts({
                limit: PRODUCTS_PER_PAGE,
                offset: page * PRODUCTS_PER_PAGE,
                ...(selectedCollections.length > 0 && { collection_id: selectedCollections }),
                ...(selectedCategories.length > 0 && { category_id: selectedCategories }),
                order: orderMap[sort],
            });
            setProducts(result.products);
            setTotal(result.count);
        } catch (error) {
            console.error("Failed to load products:", error);
        } finally {
            setIsLoading(false);
        }
    }, [page, sort, selectedCollections, selectedCategories]);

    useEffect(() => {
        startTransition(() => {
            loadProducts();
        });
    }, [loadProducts]);

    // ── Reset page on filter/sort change ──────────────────────────────────────
    const handleSortChange = (value: SortOption) => {
        setSort(value);
        setPage(0);
    };
    const handleCollectionChange = (id: string) => {
        setPage(0);
        setSelectedCollections((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };
    const handleCategoryChange = (id: string) => {
        setPage(0);
        setSelectedCategories((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };
    const handleClearFilters = () => {
        setSelectedCollections([]);
        setSelectedCategories([]);
        setPage(0);
    };

    // ── Add to cart handler ───────────────────────────────────────────────────
    const handleAddToCart = async (variantId: string) => {
        setIsAdding(variantId);
        try {
            const updatedCart = await addToCart(variantId, 1);
            if (updatedCart) {
                setCart(updatedCart);
                openCart();
            }
        } catch (error) {
            console.error("Failed to add to cart:", error);
        } finally {
            setIsAdding(null);
        }
    };

    const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);
    const activeFilterCount = selectedCollections.length + selectedCategories.length;

    return (
        <div className="flex gap-8">
            {/* ── Filter Sidebar ── */}
            <FilterSidebar
                collections={collections}
                categories={categories}
                selectedCollections={selectedCollections}
                selectedCategories={selectedCategories}
                onCollectionChange={handleCollectionChange}
                onCategoryChange={handleCategoryChange}
                onClearAll={handleClearFilters}
                mobileOpen={mobileFilterOpen}
                onMobileClose={() => setMobileFilterOpen(false)}
            />

            {/* ── Main Content ── */}
            <div className="flex-1 min-w-0">
                {/* Toolbar */}
                <ProductToolbar
                    total={total}
                    sort={sort}
                    onSortChange={handleSortChange}
                    onMobileFilterOpen={() => setMobileFilterOpen(true)}
                    activeFilterCount={activeFilterCount}
                />

                {/* Product Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
                        {products.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={handleAddToCart}
                                priority={index < 4}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="rounded-lg border border-gray-200 dark:border-white/10 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            Previous
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i)}
                                    className={`h-9 w-9 rounded-lg text-sm font-medium transition-all ${i === page
                                            ? "bg-primary-600 text-white shadow-sm"
                                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={page >= totalPages - 1}
                            className="rounded-lg border border-gray-200 dark:border-white/10 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
