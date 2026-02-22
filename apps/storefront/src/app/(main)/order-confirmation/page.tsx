"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle, Package, Mail, ArrowRight, Home } from "lucide-react";

function OrderConfirmationContent() {
    const params = useSearchParams();
    const orderId = params.get("id");

    return (
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 text-center">
            {/* Success icon */}
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-success-500/10 animate-scale-in">
                <CheckCircle className="h-14 w-14 text-success-500" />
            </div>

            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white animate-slide-up">
                Order Placed! 🎉
            </h1>
            <p className="mt-3 text-gray-500 dark:text-gray-400 animate-fade-in">
                Thank you for your purchase. We've received your order and will process it shortly.
            </p>

            {orderId && (
                <div className="mt-6 rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-surface-dark-secondary shadow-card px-6 py-4 inline-block animate-fade-in">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Order ID</p>
                    <p className="mt-1 font-mono text-sm font-bold text-gray-800 dark:text-gray-100 break-all">
                        {orderId}
                    </p>
                </div>
            )}

            {/* Next steps */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {[
                    {
                        icon: Mail,
                        title: "Confirmation Email",
                        desc: "A confirmation email will be sent to your inbox shortly.",
                    },
                    {
                        icon: Package,
                        title: "Processing",
                        desc: "Your order will be packed and dispatched within 24 hours.",
                    },
                ].map(({ icon: Icon, title, desc }) => (
                    <div
                        key={title}
                        className="rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-surface-dark-secondary p-4 flex gap-3 shadow-card"
                    >
                        <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
                            <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{title}</p>
                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                    href="/products"
                    className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 hover:shadow-glow transition-all"
                >
                    Continue Shopping
                    <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                    href="/"
                    className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                >
                    <Home className="h-4 w-4" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center py-24">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
            </div>
        }>
            <OrderConfirmationContent />
        </Suspense>
    );
}
