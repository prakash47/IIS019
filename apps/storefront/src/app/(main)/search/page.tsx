"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import Link from "next/link";
import { Search, X, Loader2, SlidersHorizontal } from "lucide-react";
import { searchProducts } from "@/lib/medusa/queries/products";
import { ProductCard } from "@/components/commerce/ProductCard";
import type { HttpTypes } from "@medusajs/types";

// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<HttpTypes.StoreProduct[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [isPending, startTransition] = useTransition();
    const debouncedQuery = useDebounce(query, 350);

    const doSearch = useCallback((q: string) => {
        if (!q.trim()) {
            setResults([]);
            setHasSearched(false);
            return;
        }
        startTransition(async () => {
            const products = await searchProducts(q, 24);
            setResults(products);
            setHasSearched(true);
        });
    }, []);

    useEffect(() => {
        doSearch(debouncedQuery);
    }, [debouncedQuery, doSearch]);

    const popular = [
        "Printer Toner", "Ink Cartridge", "HP Toner", "Canon Ink",
        "Brother Toner", "Epson Cartridge",
    ];

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {/* ── Search bar ── */}
            <div className="max-w-2xl mx-auto mb-10">
                <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white text-center mb-6">
                    Search Products
                </h1>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for products, brands, categories..."
                        autoFocus
                        className="h-14 w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark-secondary pl-12 pr-12 text-base text-gray-900 dark:text-white placeholder:text-gray-400 shadow-card focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                    />
                    {isPending ? (
                        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin" />
                    ) : query && (
                        <button onClick={() => setQuery("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Popular searches */}
                {!query && (
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                        <span className="text-xs text-gray-400 self-center">Popular:</span>
                        {popular.map((term) => (
                            <button key={term} onClick={() => setQuery(term)}
                                className="rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark-secondary px-3.5 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all">
                                {term}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Results ── */}
            {isPending && (
                <div className="flex flex-col items-center gap-3 py-16 text-gray-400">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                    <p className="text-sm">Searching...</p>
                </div>
            )}

            {!isPending && hasSearched && (
                <>
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {results.length > 0
                                ? <><span className="font-semibold text-gray-800 dark:text-gray-100">{results.length}</span> result{results.length !== 1 ? "s" : ""} for &ldquo;{debouncedQuery}&rdquo;</>
                                : <>No results for &ldquo;{debouncedQuery}&rdquo;</>}
                        </p>
                        {results.length > 0 && (
                            <Link href={`/products?q=${encodeURIComponent(debouncedQuery)}`}
                                className="flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:underline">
                                <SlidersHorizontal className="h-3.5 w-3.5" />
                                Refine results
                            </Link>
                        )}
                    </div>

                    {results.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {results.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 py-16 text-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/5">
                                <Search className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-100">No products found</p>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Try a different search term or browse our categories.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setQuery("")}
                                    className="rounded-xl border border-gray-200 dark:border-white/10 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    Clear search
                                </button>
                                <Link href="/products"
                                    className="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors">
                                    Browse All
                                </Link>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ── Idle state ── */}
            {!query && !hasSearched && (
                <div className="mt-8 text-center">
                    <p className="text-gray-400 text-sm">Start typing to search products</p>
                </div>
            )}
        </div>
    );
}
