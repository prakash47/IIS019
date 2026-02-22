import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Zap, Star } from "lucide-react";
import type { HttpTypes } from "@medusajs/types";
import { cn } from "@/lib/utils/cn";

// ─── Category badge color mapping ─────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
    "printer-toner": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    "ink-cartridge": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    "printer": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "accessories": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    "default": "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400",
};

function getCategoryColor(handle?: string): string {
    if (!handle) return CATEGORY_COLORS.default;
    for (const key of Object.keys(CATEGORY_COLORS)) {
        if (handle.includes(key)) return CATEGORY_COLORS[key];
    }
    return CATEGORY_COLORS.default;
}

// ─── Price formatter ──────────────────────────────────────────────────────────
function formatPrice(amount: number, currencyCode: string = "inr") {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currencyCode.toUpperCase(),
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount / 100);
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProductCardProps {
    product: HttpTypes.StoreProduct;
    onAddToCart?: (variantId: string) => void;
    className?: string;
    priority?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function ProductCard({
    product,
    onAddToCart,
    className,
    priority = false,
}: ProductCardProps) {
    const thumbnail = product.thumbnail ?? product.images?.[0]?.url;
    const firstVariant = product.variants?.[0];
    const price = firstVariant?.calculated_price;
    const originalAmount = price?.original_amount;
    const calculatedAmount = price?.calculated_amount;
    const currencyCode = price?.currency_code ?? "INR";
    const isOnSale =
        originalAmount &&
        calculatedAmount &&
        originalAmount > calculatedAmount;
    const category = product.categories?.[0];
    const collection = product.collection;
    const hasMultipleVariants = (product.variants?.length ?? 0) > 1;

    return (
        <article
            className={cn(
                "group relative flex flex-col bg-white dark:bg-surface-dark-secondary",
                "rounded-xl border border-gray-100 dark:border-white/5",
                "shadow-card hover:shadow-elevated",
                "transition-all duration-300 ease-smooth",
                "hover:-translate-y-1 overflow-hidden",
                className
            )}
        >
            {/* ── Image Container ── */}
            <Link href={`/products/${product.handle}`} className="block relative aspect-square overflow-hidden bg-gray-50 dark:bg-surface-dark-tertiary">
                {thumbnail ? (
                    <Image
                        src={thumbnail}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                        priority={priority}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <Zap className="h-16 w-16 text-gray-200 dark:text-gray-700" />
                    </div>
                )}

                {/* Sale badge */}
                {isOnSale && (
                    <div className="absolute top-3 left-3 rounded-full bg-error-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                        SALE
                    </div>
                )}

                {/* Hover overlay — Quick view */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </Link>

            {/* ── Content ── */}
            <div className="flex flex-col gap-2 p-4 flex-1">
                {/* Category + Collection */}
                <div className="flex items-center gap-2 flex-wrap">
                    {category && (
                        <span className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            getCategoryColor(category.handle)
                        )}>
                            {category.name}
                        </span>
                    )}
                    {collection && (
                        <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
                            {collection.title}
                        </span>
                    )}
                </div>

                {/* Title */}
                <Link href={`/products/${product.handle}`}>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {product.title}
                    </h3>
                </Link>

                {/* Subtitle / short desc */}
                {product.subtitle && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                        {product.subtitle}
                    </p>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Rating (placeholder — Phase 3) */}
                <div className="flex items-center gap-1.5">
                    <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={cn(
                                    "h-3 w-3",
                                    star <= 4
                                        ? "text-amber-400 fill-amber-400"
                                        : "text-gray-200 dark:text-gray-600"
                                )}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-400">(4.0)</span>
                </div>

                {/* Price + CTA Row */}
                <div className="flex items-center justify-between gap-2 mt-1">
                    {/* Price */}
                    <div className="flex flex-col">
                        {calculatedAmount ? (
                            <>
                                <span className="text-base font-bold text-gray-900 dark:text-white">
                                    {formatPrice(calculatedAmount, currencyCode)}
                                </span>
                                {isOnSale && originalAmount && (
                                    <span className="text-xs text-gray-400 line-through">
                                        {formatPrice(originalAmount, currencyCode)}
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="text-sm text-gray-400">
                                {hasMultipleVariants ? "From — Select options" : "Price on request"}
                            </span>
                        )}
                    </div>

                    {/* Add to Cart / View Options */}
                    {firstVariant && !hasMultipleVariants ? (
                        <button
                            onClick={() => onAddToCart?.(firstVariant.id!)}
                            className={cn(
                                "flex items-center gap-1.5 rounded-lg px-3 py-2",
                                "bg-primary-600 hover:bg-primary-700 active:scale-95",
                                "text-white text-xs font-semibold",
                                "transition-all duration-200",
                                "shadow-sm hover:shadow-glow"
                            )}
                            aria-label={`Add ${product.title} to cart`}
                        >
                            <ShoppingCart className="h-3.5 w-3.5" />
                            <span>Add</span>
                        </button>
                    ) : (
                        <Link
                            href={`/products/${product.handle}`}
                            className={cn(
                                "flex items-center gap-1.5 rounded-lg px-3 py-2",
                                "bg-gray-100 hover:bg-primary-50 dark:bg-white/5 dark:hover:bg-primary-900/20",
                                "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400",
                                "text-xs font-semibold border border-gray-200 dark:border-white/10",
                                "transition-all duration-200"
                            )}
                        >
                            Options
                        </Link>
                    )}
                </div>
            </div>
        </article>
    );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
export function ProductCardSkeleton() {
    return (
        <div className="flex flex-col rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-surface-dark-secondary overflow-hidden">
            {/* Image */}
            <div className="aspect-square animate-shimmer bg-gray-100 dark:bg-white/5" />
            {/* Content */}
            <div className="flex flex-col gap-3 p-4">
                <div className="h-3 w-20 rounded animate-shimmer bg-gray-100 dark:bg-white/5" />
                <div className="h-4 w-full rounded animate-shimmer bg-gray-100 dark:bg-white/5" />
                <div className="h-4 w-3/4 rounded animate-shimmer bg-gray-100 dark:bg-white/5" />
                <div className="mt-2 flex items-center justify-between">
                    <div className="h-5 w-16 rounded animate-shimmer bg-gray-100 dark:bg-white/5" />
                    <div className="h-8 w-16 rounded-lg animate-shimmer bg-gray-100 dark:bg-white/5" />
                </div>
            </div>
        </div>
    );
}
