"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    Check, ChevronRight, Lock, CreditCard, Truck, User,
    MapPin, Package, AlertCircle, ShoppingBag
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useCartStore } from "@/lib/store/cart-store";
import {
    setCartEmail,
    setShippingAddress,
    getShippingOptions,
    setShippingMethod,
    completeCart,
} from "@/lib/medusa/actions/cart";
import { getCart } from "@/lib/medusa/queries/cart";
import { getCartIdClient } from "@/lib/utils/cart-cookie.client";
import type { HttpTypes } from "@medusajs/types";

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = "contact" | "address" | "shipping" | "payment";

const STEPS: { id: Step; label: string; icon: React.ElementType }[] = [
    { id: "contact", label: "Contact", icon: User },
    { id: "address", label: "Address", icon: MapPin },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "payment", label: "Payment", icon: CreditCard },
];

// ─── Price formatter ──────────────────────────────────────────────────────────
function formatPrice(amount: number, currency: string = "inr") {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currency.toUpperCase(),
        minimumFractionDigits: 0,
    }).format(amount / 100);
}

// ─── Reusable Input ───────────────────────────────────────────────────────────
function Input({
    label, id, required, ...props
}: { label: string; id: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label} {required && <span className="text-error-500">*</span>}
            </label>
            <input
                id={id}
                {...props}
                className={cn(
                    "h-11 w-full rounded-xl border border-gray-200 dark:border-white/10",
                    "bg-white dark:bg-surface-dark-secondary",
                    "px-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500",
                    "transition-all duration-150",
                    props.className
                )}
            />
        </div>
    );
}

// ─── Step Progress Bar ────────────────────────────────────────────────────────
function StepProgress({ current }: { current: Step }) {
    const currentIndex = STEPS.findIndex((s) => s.id === current);
    return (
        <div className="flex items-center gap-0">
            {STEPS.map((step, i) => {
                const isDone = i < currentIndex;
                const isActive = i === currentIndex;
                const Icon = step.icon;
                return (
                    <div key={step.id} className="flex items-center">
                        <div className="flex flex-col items-center gap-1">
                            <div className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300",
                                isDone
                                    ? "border-success-500 bg-success-500 text-white"
                                    : isActive
                                        ? "border-primary-600 bg-primary-600 text-white shadow-glow"
                                        : "border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark-tertiary text-gray-400"
                            )}>
                                {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                            </div>
                            <span className={cn(
                                "text-xs font-medium hidden sm:block",
                                isActive ? "text-primary-600 dark:text-primary-400" : isDone ? "text-success-600" : "text-gray-400"
                            )}>
                                {step.label}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={cn(
                                "mx-2 mb-4 h-0.5 w-12 sm:w-20 transition-all duration-500",
                                i < currentIndex ? "bg-success-500" : "bg-gray-200 dark:bg-white/10"
                            )} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ─── Order Summary Sidebar ────────────────────────────────────────────────────
function OrderSummary({ cart }: { cart: HttpTypes.StoreCart | null }) {
    const items = cart?.items ?? [];
    const currency = cart?.currency_code ?? "INR";
    const subtotal = cart?.subtotal ?? 0;
    const shippingTotal = cart?.shipping_total ?? 0;
    const taxTotal = cart?.tax_total ?? 0;
    const total = cart?.total ?? subtotal;

    return (
        <div className="rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-surface-dark-secondary shadow-card overflow-hidden">
            <div className="border-b border-gray-100 dark:border-white/5 px-5 py-4">
                <h2 className="font-display text-base font-bold text-gray-900 dark:text-white">
                    Order Summary
                </h2>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-50 dark:divide-white/5 px-5 max-h-64 overflow-y-auto">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-3">
                        <div className="relative h-12 w-12 shrink-0 rounded-lg border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-surface-dark-tertiary overflow-hidden">
                            {item.thumbnail ? (
                                <Image src={item.thumbnail} alt={item.title} fill sizes="48px" className="object-contain p-1" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <Package className="h-4 w-4 text-gray-300" />
                                </div>
                            )}
                            <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center">
                                {item.quantity}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-800 dark:text-gray-100 line-clamp-2">{item.title}</p>
                            {item.variant?.title && item.variant.title !== "Default Title" && (
                                <p className="text-xs text-gray-400">{item.variant.title}</p>
                            )}
                        </div>
                        <span className="text-xs font-semibold text-gray-900 dark:text-white shrink-0">
                            {formatPrice((item.unit_price ?? 0) * item.quantity, currency)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div className="border-t border-gray-100 dark:border-white/5 px-5 py-4 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-700 dark:text-gray-200">{formatPrice(subtotal, currency)}</span>
                </div>
                {shippingTotal > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                        <span className="text-gray-700 dark:text-gray-200">{formatPrice(shippingTotal, currency)}</span>
                    </div>
                )}
                {taxTotal > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">GST</span>
                        <span className="text-gray-700 dark:text-gray-200">{formatPrice(taxTotal, currency)}</span>
                    </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-white/5">
                    <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{formatPrice(total, currency)}</span>
                </div>
            </div>

            {/* Security badge */}
            <div className="flex items-center justify-center gap-2 bg-gray-50 dark:bg-surface-dark-tertiary px-5 py-3">
                <Lock className="h-3.5 w-3.5 text-success-600" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Secure 256-bit SSL encryption</span>
            </div>
        </div>
    );
}

// ─── Main Checkout Component ──────────────────────────────────────────────────
export default function CheckoutClient() {
    const [step, setStep] = useState<Step>("contact");
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [shippingOptions, setShippingOptions] = useState<HttpTypes.StoreCartShippingOption[]>([]);
    const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
    const { cart, setCart } = useCartStore();
    const router = useRouter();

    // Form state
    const [contact, setContact] = useState({ email: "", first_name: "", last_name: "", phone: "" });
    const [address, setAddress] = useState({
        address_1: "", address_2: "", city: "", state: "", postal_code: "", country_code: "in",
    });

    // Load cart if needed
    useEffect(() => {
        if (!cart) {
            const cartId = getCartIdClient();
            if (cartId) getCart(cartId).then(setCart);
        }
    }, [cart, setCart]);

    // Load shipping options when reaching step
    useEffect(() => {
        if (step === "shipping") {
            getShippingOptions().then((opts) => {
                setShippingOptions(opts ?? []);
                if (opts?.[0]) setSelectedShipping(opts[0].id);
            });
        }
    }, [step]);

    const items = cart?.items ?? [];
    if (items.length === 0 && !cart) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                <ShoppingBag className="h-16 w-16 text-gray-200 dark:text-gray-700" />
                <p className="font-semibold text-gray-700 dark:text-gray-300">Your cart is empty</p>
                <Link href="/products" className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors">
                    Browse Products
                </Link>
            </div>
        );
    }

    // ── Step handlers ─────────────────────────────────────────────────────────
    const handleContactNext = () => {
        if (!contact.email || !contact.first_name || !contact.last_name) {
            setError("Please fill in all required fields.");
            return;
        }
        setError(null);
        startTransition(async () => {
            await setCartEmail(contact.email);
            setStep("address");
        });
    };

    const handleAddressNext = () => {
        if (!address.address_1 || !address.city || !address.postal_code) {
            setError("Please fill in all required address fields.");
            return;
        }
        setError(null);
        startTransition(async () => {
            const updated = await setShippingAddress({
                first_name: contact.first_name,
                last_name: contact.last_name,
                address_1: address.address_1,
                city: address.city,
                country_code: address.country_code,
                postal_code: address.postal_code,
                phone: contact.phone || undefined,
            });
            if (updated) setCart(updated);
            setStep("shipping");
        });
    };

    const handleShippingNext = () => {
        if (!selectedShipping && shippingOptions.length > 0) {
            setError("Please select a shipping method.");
            return;
        }
        setError(null);
        startTransition(async () => {
            if (selectedShipping) {
                const updated = await setShippingMethod(selectedShipping);
                if (updated) setCart(updated);
            }
            setStep("payment");
        });
    };

    const handlePlaceOrder = () => {
        setError(null);
        startTransition(async () => {
            const result = await completeCart();
            if (result?.type === "order") {
                setCart(null);
                router.push(`/order-confirmation?id=${(result.order as { id: string }).id}`);
            } else {
                setError("Failed to complete order. Please try again.");
            }
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* ── Left: Steps ── */}
            <div className="lg:col-span-3 space-y-6">
                {/* Step progress */}
                <div className="flex justify-center">
                    <StepProgress current={step} />
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-2.5 rounded-xl border border-error-500/30 bg-error-500/10 px-4 py-3 text-sm text-error-600 dark:text-error-400 animate-slide-down">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {error}
                    </div>
                )}

                {/* ── Step: Contact ── */}
                {step === "contact" && (
                    <div className="rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-surface-dark-secondary shadow-card p-6 space-y-4 animate-fade-in">
                        <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">Contact Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="First Name" id="first_name" required placeholder="Rahul"
                                value={contact.first_name} onChange={(e) => setContact((p) => ({ ...p, first_name: e.target.value }))} />
                            <Input label="Last Name" id="last_name" required placeholder="Sharma"
                                value={contact.last_name} onChange={(e) => setContact((p) => ({ ...p, last_name: e.target.value }))} />
                        </div>
                        <Input label="Email Address" id="email" type="email" required placeholder="rahul@example.com"
                            value={contact.email} onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))} />
                        <Input label="Phone Number" id="phone" type="tel" placeholder="+91 98765 43210"
                            value={contact.phone} onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))} />
                        <button onClick={handleContactNext} disabled={isPending}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 text-sm font-semibold text-white hover:bg-primary-700 hover:shadow-glow transition-all disabled:opacity-60">
                            {isPending ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <>Continue to Address <ChevronRight className="h-4 w-4" /></>}
                        </button>
                    </div>
                )}

                {/* ── Step: Address ── */}
                {step === "address" && (
                    <div className="rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-surface-dark-secondary shadow-card p-6 space-y-4 animate-fade-in">
                        <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">Shipping Address</h2>
                        <Input label="Address Line 1" id="address_1" required placeholder="House No, Street, Area"
                            value={address.address_1} onChange={(e) => setAddress((p) => ({ ...p, address_1: e.target.value }))} />
                        <Input label="Address Line 2 (Optional)" id="address_2" placeholder="Apartment, floor, landmark"
                            value={address.address_2} onChange={(e) => setAddress((p) => ({ ...p, address_2: e.target.value }))} />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="City" id="city" required placeholder="Mumbai"
                                value={address.city} onChange={(e) => setAddress((p) => ({ ...p, city: e.target.value }))} />
                            <Input label="State" id="state" placeholder="Maharashtra"
                                value={address.state} onChange={(e) => setAddress((p) => ({ ...p, state: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Pincode" id="postal_code" required placeholder="400001"
                                value={address.postal_code} onChange={(e) => setAddress((p) => ({ ...p, postal_code: e.target.value }))} />
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
                                <select value={address.country_code} onChange={(e) => setAddress((p) => ({ ...p, country_code: e.target.value }))}
                                    className="h-11 w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark-secondary px-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all">
                                    <option value="in">India</option>
                                    <option value="us">United States</option>
                                    <option value="gb">United Kingdom</option>
                                    <option value="ae">UAE</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setStep("contact")}
                                className="rounded-xl border border-gray-200 dark:border-white/10 px-5 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                                Back
                            </button>
                            <button onClick={handleAddressNext} disabled={isPending}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 text-sm font-semibold text-white hover:bg-primary-700 hover:shadow-glow transition-all disabled:opacity-60">
                                {isPending ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <>Continue to Shipping <ChevronRight className="h-4 w-4" /></>}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Step: Shipping ── */}
                {step === "shipping" && (
                    <div className="rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-surface-dark-secondary shadow-card p-6 space-y-4 animate-fade-in">
                        <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">Shipping Method</h2>
                        {shippingOptions.length > 0 ? (
                            <div className="space-y-3">
                                {shippingOptions.map((opt) => (
                                    <label key={opt.id} className={cn(
                                        "flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all",
                                        selectedShipping === opt.id
                                            ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20"
                                            : "border-gray-100 dark:border-white/10 hover:border-primary-300"
                                    )}>
                                        <input type="radio" name="shipping" value={opt.id} checked={selectedShipping === opt.id}
                                            onChange={() => setSelectedShipping(opt.id)} className="sr-only" />
                                        <div className={cn("h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all",
                                            selectedShipping === opt.id ? "border-primary-600" : "border-gray-300"
                                        )}>
                                            {selectedShipping === opt.id && <div className="h-2 w-2 rounded-full bg-primary-600" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{opt.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">2–5 business days</p>
                                        </div>
                                        <span className="font-bold text-sm text-gray-900 dark:text-white">
                                            {opt.amount ? formatPrice(opt.amount, cart?.currency_code ?? "inr") : "Free"}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-surface-dark-tertiary p-4">
                                <div className="flex items-center gap-3">
                                    <Truck className="h-5 w-5 text-success-600" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Standard Shipping</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">2–5 business days — Free on orders above ₹500</p>
                                    </div>
                                    <span className="ml-auto text-sm font-bold text-success-600">Free</span>
                                </div>
                            </div>
                        )}
                        <div className="flex gap-3">
                            <button onClick={() => setStep("address")}
                                className="rounded-xl border border-gray-200 dark:border-white/10 px-5 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                                Back
                            </button>
                            <button onClick={handleShippingNext} disabled={isPending}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 text-sm font-semibold text-white hover:bg-primary-700 hover:shadow-glow transition-all disabled:opacity-60">
                                {isPending ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <>Continue to Payment <ChevronRight className="h-4 w-4" /></>}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Step: Payment (placeholder) ── */}
                {step === "payment" && (
                    <div className="rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-surface-dark-secondary shadow-card p-6 space-y-5 animate-fade-in">
                        <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">Payment</h2>

                        {/* Placeholder payment notice */}
                        <div className="rounded-xl border-2 border-dashed border-primary-200 dark:border-primary-800/50 bg-primary-50 dark:bg-primary-900/10 p-5 text-center space-y-3">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/30">
                                <CreditCard className="h-7 w-7 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-100">Stripe Payment Coming Soon</p>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Payment gateway integration is in progress. For now, orders will be confirmed directly.
                                </p>
                            </div>
                            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                                <span className="flex items-center gap-1">💳 Visa</span>
                                <span className="flex items-center gap-1">💳 Mastercard</span>
                                <span className="flex items-center gap-1">💳 RuPay</span>
                                <span className="flex items-center gap-1">📱 UPI</span>
                            </div>
                        </div>

                        {/* Order review */}
                        <div className="rounded-xl bg-gray-50 dark:bg-surface-dark-tertiary p-4 space-y-2 text-sm">
                            <p className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Review your order</p>
                            {contact.email && (
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <User className="h-3.5 w-3.5 shrink-0" />
                                    <span>{contact.first_name} {contact.last_name} — {contact.email}</span>
                                </div>
                            )}
                            {address.address_1 && (
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                                    <span>{address.address_1}, {address.city} {address.postal_code}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <Truck className="h-3.5 w-3.5 shrink-0" />
                                <span>Standard Shipping — 2–5 business days</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setStep("shipping")}
                                className="rounded-xl border border-gray-200 dark:border-white/10 px-5 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                                Back
                            </button>
                            <button onClick={handlePlaceOrder} disabled={isPending}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-success-600 hover:bg-success-600 py-3.5 text-sm font-semibold text-white hover:opacity-90 transition-all disabled:opacity-60 shadow-sm">
                                {isPending
                                    ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    : <><Lock className="h-4 w-4" /> Place Order</>}
                            </button>
                        </div>

                        <p className="text-center text-xs text-gray-400">
                            By placing your order, you agree to our{" "}
                            <Link href="/terms" className="underline hover:text-primary-600 transition-colors">Terms of Service</Link>
                            {" "}and{" "}
                            <Link href="/privacy-policy" className="underline hover:text-primary-600 transition-colors">Privacy Policy</Link>
                        </p>
                    </div>
                )}
            </div>

            {/* ── Right: Order Summary ── */}
            <div className="lg:col-span-2">
                <div className="sticky top-24">
                    <OrderSummary cart={cart} />
                </div>
            </div>
        </div>
    );
}
