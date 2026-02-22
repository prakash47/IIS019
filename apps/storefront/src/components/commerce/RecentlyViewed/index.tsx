"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, Clock } from "lucide-react";
import { useRecentlyViewedStore, productToSnapshot } from "@/lib/store/recently-viewed-store";
import type { HttpTypes } from "@medusajs/types";
import { cn } from "@/lib/utils/cn";

function formatPrice(amount: number, currency: string) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currency.toUpperCase(),
        minimumFractionDigits: 0,
    }).format(amount / 100);
}

// ─── Track current product view (call from PDP) ───────────────────────────────
export function useTrackProductView(product: HttpTypes.StoreProduct | null) {
    const addItem = useRecentlyViewedStore((s) => s.addItem);
    useEffect(() => {
        if (product) addItem(productToSnapshot(product));
    }, [product, addItem]);
}

// ─── Recently Viewed Widget ───────────────────────────────────────────────────
export function RecentlyViewedWidget({
    currentProductId,
    className,
}: {
    currentProductId?: string;
    className?: string;
}) {
    const items = useRecentlyViewedStore((s) => s.items);

    // Filter out the current product
    const filtered = items.filter((p) => p.id !== currentProductId);

    if (filtered.length === 0) return null;

    return (
        <section className={cn("mt-12", className)}>
            <div className="flex items-center gap-2.5 mb-5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
                    <Clock className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">
                    Recently Viewed
                </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {filtered.slice(0, 6).map((product) => (
                    <Link
                        key={product.id}
                        href={`/products/${product.handle}`}
                        className="group flex flex-col gap-2 rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-surface-dark-secondary p-3 hover:shadow-card transition-all"
                    >
                        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-50 dark:bg-surface-dark-tertiary">
                            {product.thumbnail ? (
                                <Image
                                    src={product.thumbnail}
                                    alt={product.title}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                                    className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    <Package className="h-6 w-6 text-gray-300" />
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-200 line-clamp-2 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {product.title}
                            </p>
                            {product.price > 0 && (
                                <p className="mt-0.5 text-xs font-bold text-gray-900 dark:text-white">
                                    {formatPrice(product.price, product.currency)}
                                </p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
