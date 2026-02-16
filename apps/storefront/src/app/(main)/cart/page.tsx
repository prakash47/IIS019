import type { Metadata } from "next";
import { createMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = createMetadata({
    title: "Shopping Cart",
    description: "Review and manage items in your shopping cart.",
    url: "/cart",
    noIndex: true,
});

export default function CartPage() {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8">
                Shopping Cart
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
                Cart page will be implemented in Phase 2.
            </p>
        </div>
    );
}
