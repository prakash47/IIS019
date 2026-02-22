import type { Metadata } from "next";
import { createMetadata } from "@/lib/utils/seo";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = createMetadata({
    title: "Checkout",
    description: "Complete your purchase securely.",
    url: "/checkout",
    noIndex: true,
});

export default function CheckoutPage() {
    return (
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                    Checkout
                </h1>
                <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                    Secure checkout — your data is always protected
                </p>
            </div>
            <CheckoutClient />
        </div>
    );
}
