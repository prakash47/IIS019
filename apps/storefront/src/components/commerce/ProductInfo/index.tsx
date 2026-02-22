"use client";

import { useState, useTransition } from "react";
import { ShoppingCart, Zap, Check, Minus, Plus, Star, Shield, Truck, RotateCcw } from "lucide-react";
import type { HttpTypes } from "@medusajs/types";
import { cn } from "@/lib/utils/cn";
import { addToCart } from "@/lib/medusa/actions/cart";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "@/lib/store/toast-store";

// ─── Price formatter ──────────────────────────────────────────────────────────
function formatPrice(amount: number, currencyCode: string = "inr") {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currencyCode.toUpperCase(),
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount / 100);
}

// ─── Trust badges ─────────────────────────────────────────────────────────────
const TRUST_BADGES = [
    { icon: Shield, label: "Genuine Products" },
    { icon: Truck, label: "Fast Delivery" },
    { icon: RotateCcw, label: "Easy Returns" },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProductInfoProps {
    product: HttpTypes.StoreProduct;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function ProductInfo({ product }: ProductInfoProps) {
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [isPending, startTransition] = useTransition();
    const { openCart, setCart } = useCartStore();

    // ── Find matching variant ─────────────────────────────────────────────────
    const selectedVariant = product.variants?.find((variant) =>
        variant.options?.every(
            (opt) => selectedOptions[opt.option_id!] === opt.value
        )
    );

    const price = selectedVariant?.calculated_price;
    const originalAmount = price?.original_amount;
    const calculatedAmount = price?.calculated_amount;
    const currencyCode = price?.currency_code ?? "INR";
    const isOnSale = originalAmount && calculatedAmount && originalAmount > calculatedAmount;

    const isAvailable =
        selectedVariant?.inventory_quantity === undefined ||
        (selectedVariant?.inventory_quantity ?? 0) > 0;
    const canAddToCart = !!selectedVariant && isAvailable;

    // Auto-select single option values
    const initOptions = () => {
        if (Object.keys(selectedOptions).length === 0 && product.options) {
            const auto: Record<string, string> = {};
            product.options.forEach((opt) => {
                if (opt.values?.length === 1) {
                    auto[opt.id!] = opt.values[0].value;
                }
            });
            if (Object.keys(auto).length > 0) setSelectedOptions(auto);
        }
    };
    initOptions();

    // ── Add to cart ───────────────────────────────────────────────────────────
    const handleAddToCart = () => {
        if (!canAddToCart) return;
        startTransition(async () => {
            const result = await addToCart(selectedVariant.id!, quantity);
            if (result.success && result.cart) {
                setCart(result.cart);
                setAddedToCart(true);
                openCart();
                toast.success("Added to cart!", product.title);
                setTimeout(() => setAddedToCart(false), 2500);
            } else {
                toast.error("Failed to add", result.error ?? "Please try again.");
            }
        });
    };

    return (
        <div className="flex flex-col gap-6">
            {/* ── Category badges ── */}
            {product.categories && product.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {product.categories.map((cat) => (
                        <span
                            key={cat.id}
                            className="rounded-full bg-primary-100 dark:bg-primary-900/30 px-3 py-1 text-xs font-medium text-primary-700 dark:text-primary-400"
                        >
                            {cat.name}
                        </span>
                    ))}
                </div>
            )}

            {/* ── Title ── */}
            <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                    {product.title}
                </h1>
                {product.subtitle && (
                    <p className="mt-1.5 text-base text-gray-500 dark:text-gray-400">
                        {product.subtitle}
                    </p>
                )}
            </div>

            {/* ── Rating ── */}
            <div className="flex items-center gap-2">
                <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                            key={s}
                            className={cn("h-4 w-4", s <= 4 ? "text-amber-400 fill-amber-400" : "text-gray-200 dark:text-gray-600")}
                        />
                    ))}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">4.0 (24 reviews)</span>
            </div>

            {/* ── Price ── */}
            <div className="rounded-xl bg-gray-50 dark:bg-surface-dark-tertiary border border-gray-100 dark:border-white/5 p-4">
                {calculatedAmount ? (
                    <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            {formatPrice(calculatedAmount, currencyCode)}
                        </span>
                        {isOnSale && originalAmount && (
                            <>
                                <span className="text-lg text-gray-400 line-through">
                                    {formatPrice(originalAmount, currencyCode)}
                                </span>
                                <span className="rounded-full bg-error-500 px-2.5 py-1 text-xs font-bold text-white">
                                    {Math.round((1 - calculatedAmount / originalAmount) * 100)}% OFF
                                </span>
                            </>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {product.variants && product.variants.length > 1
                            ? "Select a variant to see the price"
                            : "Price on request"}
                    </p>
                )}
                <p className="mt-1 text-xs text-gray-400">Incl. GST · Free delivery on orders above ₹500</p>
            </div>

            {/* ── Variant Options ── */}
            {product.options?.map((option) => (
                <div key={option.id}>
                    <p className="mb-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {option.title}
                        {selectedOptions[option.id!] && (
                            <span className="ml-2 font-normal text-gray-500 dark:text-gray-400">
                                — {selectedOptions[option.id!]}
                            </span>
                        )}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {option.values?.map((val) => {
                            const isSelected = selectedOptions[option.id!] === val.value;
                            // Check if any variant with this option value is in stock
                            const hasStock = product.variants?.some(
                                (v) =>
                                    v.options?.some(
                                        (o) => o.option_id === option.id && o.value === val.value
                                    ) &&
                                    (v.inventory_quantity === undefined ||
                                        (v.inventory_quantity ?? 0) > 0)
                            );

                            return (
                                <button
                                    key={val.value}
                                    onClick={() =>
                                        setSelectedOptions((prev) => ({
                                            ...prev,
                                            [option.id!]: val.value,
                                        }))
                                    }
                                    disabled={!hasStock}
                                    className={cn(
                                        "rounded-lg border-2 px-3.5 py-2 text-sm font-medium transition-all duration-150",
                                        isSelected
                                            ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 shadow-glow"
                                            : hasStock
                                                ? "border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-primary-400 dark:hover:border-primary-600"
                                                : "border-gray-100 dark:border-white/5 text-gray-300 dark:text-gray-600 cursor-not-allowed line-through"
                                    )}
                                >
                                    {val.value}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* ── Quantity + CTA ── */}
            <div className="flex items-center gap-3">
                {/* Quantity stepper */}
                <div className="flex items-center rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark-secondary overflow-hidden">
                    <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="flex h-11 w-11 items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-40 transition-colors"
                        aria-label="Decrease quantity"
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-gray-900 dark:text-white">
                        {quantity}
                    </span>
                    <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="flex h-11 w-11 items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        aria-label="Increase quantity"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>

                {/* Add to Cart */}
                <button
                    onClick={handleAddToCart}
                    disabled={!canAddToCart || isPending}
                    className={cn(
                        "flex flex-1 items-center justify-center gap-2.5 rounded-xl py-3 text-sm font-semibold transition-all duration-200",
                        addedToCart
                            ? "bg-success-600 text-white"
                            : canAddToCart
                                ? "bg-primary-600 hover:bg-primary-700 active:scale-[0.98] text-white shadow-sm hover:shadow-glow"
                                : "bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed"
                    )}
                >
                    {isPending ? (
                        <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : addedToCart ? (
                        <>
                            <Check className="h-4 w-4" />
                            Added to Cart!
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="h-4 w-4" />
                            {canAddToCart ? "Add to Cart" : !selectedVariant ? "Select Options" : "Out of Stock"}
                        </>
                    )}
                </button>

                {/* Buy Now */}
                {canAddToCart && (
                    <button
                        onClick={handleAddToCart}
                        disabled={isPending}
                        className="rounded-xl border-2 border-primary-600 px-4 py-3 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 flex items-center gap-2"
                    >
                        <Zap className="h-4 w-4" />
                        <span className="hidden sm:inline">Buy Now</span>
                    </button>
                )}
            </div>

            {/* ── Trust Badges ── */}
            <div className="grid grid-cols-3 gap-3">
                {TRUST_BADGES.map(({ icon: Icon, label }) => (
                    <div
                        key={label}
                        className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-surface-dark-tertiary p-3 text-center"
                    >
                        <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
                    </div>
                ))}
            </div>

            {/* ── Stock indicator ── */}
            {selectedVariant && (
                <div className={cn(
                    "flex items-center gap-2 text-sm font-medium",
                    isAvailable ? "text-success-600" : "text-error-500"
                )}>
                    <div className={cn(
                        "h-2 w-2 rounded-full",
                        isAvailable ? "bg-success-500 animate-pulse" : "bg-error-500"
                    )} />
                    {isAvailable
                        ? selectedVariant.inventory_quantity !== undefined
                            ? `${selectedVariant.inventory_quantity} in stock`
                            : "In Stock"
                        : "Out of Stock"}
                </div>
            )}
        </div>
    );
}
