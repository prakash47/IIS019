"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, Package, Tag } from "lucide-react";
import type { HttpTypes } from "@medusajs/types";
import { cn } from "@/lib/utils/cn";
import { useCartStore } from "@/lib/store/cart-store";
import { removeFromCart, updateCartItem } from "@/lib/medusa/actions/cart";
import { getCart } from "@/lib/medusa/queries/cart";
import { getCartIdClient } from "@/lib/utils/cart-cookie.client";

function formatPrice(amount: number, currencyCode: string = "inr") {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currencyCode.toUpperCase(),
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount / 100);
}

function CartLineItem({
    item,
    currencyCode,
}: {
    item: HttpTypes.StoreCartLineItem;
    currencyCode: string;
}) {
    const { cart, setCart } = useCartStore();

    const handleRemove = async () => {
        await removeFromCart(item.id);
        const cartId = getCartIdClient();
        if (cartId) setCart(await getCart(cartId));
    };

    const handleUpdateQty = async (qty: number) => {
        if (qty < 1) return;
        const updated = await updateCartItem(item.id, qty);
        if (updated) setCart(updated);
    };

    const unitPrice = item.unit_price ?? 0;

    return (
        <div className="flex gap-4 py-5 border-b border-gray-100 dark:border-white/5 last:border-0">
            {/* Image */}
            <Link href={`/products/${item.variant?.product?.handle}`} className="shrink-0">
                <div className="relative h-24 w-24 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-surface-dark-tertiary overflow-hidden">
                    {item.thumbnail ? (
                        <Image src={item.thumbnail} alt={item.title} fill sizes="96px" className="object-contain p-2" />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <Package className="h-8 w-8 text-gray-300" />
                        </div>
                    )}
                </div>
            </Link>

            {/* Details */}
            <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                <Link href={`/products/${item.variant?.product?.handle}`}>
                    <p className="font-semibold text-gray-800 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2">
                        {item.title}
                    </p>
                </Link>
                {item.variant?.title && item.variant.title !== "Default Title" && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.variant.title}</p>
                )}
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatPrice(unitPrice * item.quantity, currencyCode)}
                    <span className="ml-2 text-xs font-normal text-gray-400">
                        ({formatPrice(unitPrice, currencyCode)} each)
                    </span>
                </p>

                <div className="flex items-center gap-4 mt-1">
                    {/* Qty stepper */}
                    <div className="flex items-center rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark-secondary overflow-hidden">
                        <button
                            onClick={() => handleUpdateQty(item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="flex h-9 w-9 items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-40 transition-colors"
                        >
                            <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-9 text-center text-sm font-semibold text-gray-900 dark:text-white">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => handleUpdateQty(item.quantity + 1)}
                            className="flex h-9 w-9 items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <button
                        onClick={handleRemove}
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-error-500 dark:hover:text-error-400 transition-colors"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CartPage() {
    const { cart, setCart, isLoading, setLoading } = useCartStore();
    const items = cart?.items ?? [];
    const currencyCode = cart?.currency_code ?? "INR";
    const subtotal = cart?.subtotal ?? 0;
    const shippingTotal = cart?.shipping_total ?? 0;
    const taxTotal = cart?.tax_total ?? 0;
    const total = cart?.total ?? 0;

    // Load cart if needed
    useEffect(() => {
        if (!cart && !isLoading) {
            setLoading(true);
            const cartId = getCartIdClient();
            if (cartId) {
                getCart(cartId).then((c) => {
                    setCart(c);
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }
        }
    }, [cart, isLoading, setCart, setLoading]);

    if (isLoading) {
        return (
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="mb-8 text-3xl font-display font-bold text-gray-900 dark:text-white">
                Shopping Cart
                {items.length > 0 && (
                    <span className="ml-3 text-lg font-normal text-gray-400">({items.length} items)</span>
                )}
            </h1>

            {items.length === 0 ? (
                /* ── Empty state ── */
                <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/5">
                        <ShoppingBag className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                    </div>
                    <div>
                        <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">Your cart is empty</p>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">
                            Start shopping to add items to your cart.
                        </p>
                    </div>
                    <Link
                        href="/products"
                        className="rounded-xl bg-primary-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
                    >
                        Browse Products
                    </Link>
                </div>
            ) : (
                /* ── Cart Layout ── */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ── Line items ── */}
                    <div className="lg:col-span-2">
                        <div className="rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-surface-dark-secondary shadow-card px-6">
                            {items.map((item) => (
                                <CartLineItem key={item.id} item={item} currencyCode={currencyCode} />
                            ))}
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                            <Link
                                href="/products"
                                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                            >
                                ← Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* ── Order Summary ── */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-surface-dark-secondary shadow-card p-6 space-y-4">
                            <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">
                                Order Summary
                            </h2>

                            <div className="space-y-3 divide-y divide-gray-100 dark:divide-white/5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {formatPrice(subtotal, currencyCode)}
                                    </span>
                                </div>
                                {shippingTotal > 0 && (
                                    <div className="flex justify-between text-sm pt-3">
                                        <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {formatPrice(shippingTotal, currencyCode)}
                                        </span>
                                    </div>
                                )}
                                {taxTotal > 0 && (
                                    <div className="flex justify-between text-sm pt-3">
                                        <span className="text-gray-600 dark:text-gray-400">Tax (GST)</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {formatPrice(taxTotal, currencyCode)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-3">
                                    <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                                        {formatPrice(total || subtotal, currencyCode)}
                                    </span>
                                </div>
                            </div>

                            {/* Promo code hint */}
                            <div className="flex items-center gap-2 rounded-lg border border-dashed border-gray-200 dark:border-white/10 px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                <Tag className="h-4 w-4 shrink-0" />
                                Promo code can be applied at checkout
                            </div>

                            <Link
                                href="/checkout"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-4 text-sm font-semibold text-white hover:bg-primary-700 hover:shadow-glow transition-all active:scale-[0.98]"
                            >
                                Proceed to Checkout
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                            {/* Trust signals */}
                            <p className="text-center text-xs text-gray-400">
                                🔒 Secure checkout · Free returns · Genuine products
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
