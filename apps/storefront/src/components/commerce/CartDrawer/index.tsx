"use client";

import { useEffect, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight, Package } from "lucide-react";
import type { HttpTypes } from "@medusajs/types";
import { cn } from "@/lib/utils/cn";
import { useCartStore, useCartOpen, useCartItemCount } from "@/lib/store/cart-store";
import { removeFromCart, updateCartItem } from "@/lib/medusa/actions/cart";
import { getCart } from "@/lib/medusa/queries/cart";
import { getCartIdClient } from "@/lib/utils/cart-cookie.client";

// ─── Price formatter ──────────────────────────────────────────────────────────
function formatPrice(amount: number, currencyCode: string = "inr") {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currencyCode.toUpperCase(),
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount / 100);
}

// ─── Single Cart Line Item ────────────────────────────────────────────────────
function CartItem({
    item,
    currencyCode,
    onRemove,
    onUpdateQty,
    isUpdating,
}: {
    item: HttpTypes.StoreCartLineItem;
    currencyCode: string;
    onRemove: (id: string) => void;
    onUpdateQty: (id: string, qty: number) => void;
    isUpdating: boolean;
}) {
    const unitPrice = item.unit_price ?? 0;
    const totalPrice = unitPrice * item.quantity;

    return (
        <div className={cn(
            "flex gap-3 py-4 border-b border-gray-100 dark:border-white/5 last:border-0 transition-opacity",
            isUpdating && "opacity-50 pointer-events-none"
        )}>
            {/* Image */}
            <Link href={`/products/${item.variant?.product?.handle}`} className="shrink-0">
                <div className="relative h-18 w-18 rounded-lg border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-surface-dark-tertiary overflow-hidden">
                    {item.thumbnail ? (
                        <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            sizes="72px"
                            className="object-contain p-1"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <Package className="h-6 w-6 text-gray-300" />
                        </div>
                    )}
                </div>
            </Link>

            {/* Details */}
            <div className="flex flex-1 flex-col gap-1 min-w-0">
                <Link href={`/products/${item.variant?.product?.handle}`}>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 leading-snug hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        {item.title}
                    </p>
                </Link>
                {item.variant?.title && item.variant.title !== "Default Title" && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.variant.title}</p>
                )}
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatPrice(totalPrice, currencyCode)}
                </p>

                {/* Qty + Remove */}
                <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark-secondary overflow-hidden">
                        <button
                            onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="flex h-7 w-7 items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-40 transition-colors"
                        >
                            <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-gray-900 dark:text-white">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                            <Plus className="h-3 w-3" />
                        </button>
                    </div>
                    <button
                        onClick={() => onRemove(item.id)}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-error-500 dark:hover:text-error-400 transition-colors"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────
export function CartDrawer() {
    const isOpen = useCartOpen();
    const itemCount = useCartItemCount();
    const { cart, closeCart, setCart, isLoading, setLoading } = useCartStore();
    const [isPending, startTransition] = useTransition();

    const currencyCode = cart?.currency_code ?? "inr";
    const subtotal = cart?.subtotal ?? 0;
    const items = cart?.items ?? [];

    // Load cart on open if not loaded
    useEffect(() => {
        if (isOpen && !cart && !isLoading) {
            setLoading(true);
            const cartId = getCartIdClient();
            if (cartId) {
                getCart(cartId).then((freshCart) => {
                    setCart(freshCart);
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }
        }
    }, [isOpen, cart, isLoading, setCart, setLoading]);

    const handleRemove = (lineItemId: string) => {
        startTransition(async () => {
            await removeFromCart(lineItemId);
            const cartId = getCartIdClient();
            if (cartId) {
                const updated = await getCart(cartId);
                setCart(updated);
            }
        });
    };

    const handleUpdateQty = (lineItemId: string, quantity: number) => {
        if (quantity < 1) return;
        startTransition(async () => {
            const updated = await updateCartItem(lineItemId, quantity);
            if (updated) setCart(updated);
        });
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={closeCart}
                aria-hidden="true"
            />

            {/* Drawer panel */}
            <div
                className={cn(
                    "fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white dark:bg-surface-dark shadow-modal",
                    "transition-transform duration-300 ease-smooth",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
                role="dialog"
                aria-label="Shopping cart"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 px-5 py-4">
                    <div className="flex items-center gap-2.5">
                        <ShoppingBag className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">
                            Cart
                        </h2>
                        {itemCount > 0 && (
                            <span className="rounded-full bg-primary-600 px-2.5 py-0.5 text-xs font-bold text-white">
                                {itemCount}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={closeCart}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        aria-label="Close cart"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-5">
                    {isLoading ? (
                        <div className="flex h-40 items-center justify-center">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/5">
                                <ShoppingBag className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-100">Your cart is empty</p>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Add items to get started
                                </p>
                            </div>
                            <button
                                onClick={closeCart}
                                className="mt-2 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div>
                            {items.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    currencyCode={currencyCode}
                                    onRemove={handleRemove}
                                    onUpdateQty={handleUpdateQty}
                                    isUpdating={isPending}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-gray-100 dark:border-white/5 px-5 py-5 space-y-4">
                        {/* Subtotal */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                {formatPrice(subtotal, currencyCode)}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 -mt-2">
                            Shipping and taxes calculated at checkout
                        </p>

                        {/* Checkout CTA */}
                        <Link
                            href="/checkout"
                            onClick={closeCart}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 text-sm font-semibold text-white hover:bg-primary-700 hover:shadow-glow transition-all active:scale-[0.98]"
                        >
                            Proceed to Checkout
                            <ArrowRight className="h-4 w-4" />
                        </Link>

                        {/* View full cart */}
                        <Link
                            href="/cart"
                            onClick={closeCart}
                            className="block text-center text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                            View full cart
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
