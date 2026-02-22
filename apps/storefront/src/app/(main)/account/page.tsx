"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    User, Package, LogOut, ShoppingBag, ChevronRight,
    Clock, CheckCircle, Truck, AlertCircle, Shield, Edit2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { logoutCustomer } from "@/lib/medusa/actions/auth";
import { getCustomer, getCustomerOrders } from "@/lib/medusa/queries/customer";
import type { HttpTypes } from "@medusajs/types";

type Tab = "orders" | "profile" | "security";

function formatPrice(amount: number, currency: string = "inr") {
    return new Intl.NumberFormat("en-IN", {
        style: "currency", currency: currency.toUpperCase(),
        minimumFractionDigits: 0,
    }).format(amount / 100);
}

function formatDate(dateString: string | Date) {
    return new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
    });
}

// ─── Status badge helper ──────────────────────────────────────────────────────
function OrderStatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; icon: React.ElementType; color: string }> = {
        pending: { label: "Pending", icon: Clock, color: "bg-warning-100 text-warning-700 dark:bg-warning-500/20 dark:text-warning-400" },
        processing: { label: "Processing", icon: Package, color: "bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400" },
        shipped: { label: "Shipped", icon: Truck, color: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400" },
        delivered: { label: "Delivered", icon: CheckCircle, color: "bg-success-100 text-success-700 dark:bg-success-500/20 dark:text-success-400" },
        cancelled: { label: "Cancelled", icon: AlertCircle, color: "bg-error-100 text-error-700 dark:bg-error-500/20 dark:text-error-400" },
    };
    const s = map[status] ?? map.pending;
    const Icon = s.icon;
    return (
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize", s.color)}>
            <Icon className="h-3 w-3" />
            {s.label}
        </span>
    );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────
function OrdersTab({ orders, loading }: { orders: HttpTypes.StoreOrder[]; loading: boolean }) {
    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 rounded-xl animate-pulse bg-gray-100 dark:bg-white/5" />
                ))}
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/5">
                    <ShoppingBag className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                </div>
                <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">No orders yet</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Place your first order to see it here.</p>
                </div>
                <Link href="/products" className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors">
                    Shop Now
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <div key={order.id} className="rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-surface-dark-tertiary shadow-card p-5">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-xs font-bold text-gray-500 dark:text-gray-400">
                                    #{order.display_id ?? order.id.slice(-8).toUpperCase()}
                                </span>
                                <OrderStatusBadge status={order.status} />
                            </div>
                            <p className="text-xs text-gray-400">
                                {order.created_at ? formatDate(order.created_at) : "—"}
                                {" · "}
                                {order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? "s" : ""}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-gray-900 dark:text-white">
                                {formatPrice(order.total ?? 0, order.currency_code ?? "INR")}
                            </span>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    {/* Item thumbnails */}
                    {(order.items?.length ?? 0) > 0 && (
                        <div className="mt-4 flex gap-2">
                            {order.items!.slice(0, 4).map((item) => (
                                <div key={item.id} className="relative h-12 w-12 rounded-lg overflow-hidden border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-surface-dark-tertiary">
                                    {item.thumbnail ? (
                                        <Image src={item.thumbnail} alt={item.title} fill sizes="48px" className="object-contain p-1" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <Package className="h-4 w-4 text-gray-300" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {(order.items?.length ?? 0) > 4 && (
                                <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5 text-xs font-semibold text-gray-500">
                                    +{(order.items?.length ?? 0) - 4}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab({ customer }: { customer: HttpTypes.StoreCustomer | null }) {
    if (!customer) return null;

    const fields = [
        { label: "First Name", value: customer.first_name ?? "—" },
        { label: "Last Name", value: customer.last_name ?? "—" },
        { label: "Email", value: customer.email ?? "—" },
        { label: "Phone", value: customer.phone ?? "Not set" },
    ];

    return (
        <div className="rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-surface-dark-tertiary shadow-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 px-6 py-4">
                <h3 className="font-display font-semibold text-gray-800 dark:text-gray-100">Personal Information</h3>
                <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-white/10 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <Edit2 className="h-3 w-3" /> Edit
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-50 dark:divide-white/5 px-6 py-2">
                {fields.map(({ label, value }) => (
                    <div key={label} className="py-4 sm:px-4 first:pl-0 last:pr-0">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
                        <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-100">{value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Security Tab ─────────────────────────────────────────────────────────────
function SecurityTab({ onLogout, isPending }: { onLogout: () => void; isPending: boolean }) {
    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-surface-dark-tertiary shadow-card p-6">
                <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
                        <Shield className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-gray-800 dark:text-gray-100">Password</p>
                        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Last changed: Unknown</p>
                    </div>
                    <button className="rounded-xl border border-gray-200 dark:border-white/10 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        Change
                    </button>
                </div>
            </div>

            <div className="rounded-xl border border-error-500/20 bg-error-500/5 p-6">
                <p className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Sign Out</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    You will be signed out from all sessions on this device.
                </p>
                <button onClick={onLogout} disabled={isPending}
                    className="flex items-center gap-2 rounded-xl bg-error-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-error-600 transition-colors disabled:opacity-60">
                    {isPending
                        ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        : <><LogOut className="h-4 w-4" /> Sign Out</>}
                </button>
            </div>
        </div>
    );
}

// ─── Account Dashboard ────────────────────────────────────────────────────────
export default function AccountPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("orders");
    const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null);
    const [orders, setOrders] = useState<HttpTypes.StoreOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        Promise.all([getCustomer(), getCustomerOrders()])
            .then(([c, o]) => {
                if (!c) {
                    router.replace("/login");
                    return;
                }
                setCustomer(c);
                setOrders(o?.orders ?? []);
            })
            .finally(() => setLoading(false));
    }, [router]);

    const handleLogout = () => {
        startTransition(async () => {
            await logoutCustomer();
            router.push("/login");
            router.refresh();
        });
    };

    const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
        { id: "orders", label: "Orders", icon: Package },
        { id: "profile", label: "Profile", icon: User },
        { id: "security", label: "Security", icon: Shield },
    ];

    if (loading) {
        return (
            <div className="flex justify-center py-24">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
            {/* ── Profile header ── */}
            <div className="mb-8 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md">
                    <span className="text-2xl font-bold text-white">
                        {customer?.first_name?.[0]?.toUpperCase() ?? "U"}
                    </span>
                </div>
                <div>
                    <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                        {customer ? `${customer.first_name} ${customer.last_name}` : "My Account"}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{customer?.email}</p>
                </div>
            </div>

            {/* ── Stats bar ── */}
            <div className="mb-8 grid grid-cols-3 gap-4">
                {[
                    { label: "Total Orders", value: orders.length },
                    { label: "Completed", value: orders.filter((o) => o.status === "delivered").length },
                    { label: "Processing", value: orders.filter((o) => ["pending", "processing", "shipped"].includes(o.status)).length },
                ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-surface-dark-secondary shadow-card px-4 py-4 text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            {/* ── Tab nav ── */}
            <div className="mb-6 flex gap-1 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-surface-dark-tertiary p-1.5">
                {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={cn(
                            "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all duration-200",
                            activeTab === id
                                ? "bg-white dark:bg-surface-dark-secondary text-primary-600 dark:text-primary-400 shadow-card"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{label}</span>
                    </button>
                ))}
            </div>

            {/* ── Tab content ── */}
            <div className="animate-fade-in">
                {activeTab === "orders" && <OrdersTab orders={orders} loading={false} />}
                {activeTab === "profile" && <ProfileTab customer={customer} />}
                {activeTab === "security" && <SecurityTab onLogout={handleLogout} isPending={isPending} />}
            </div>
        </div>
    );
}
