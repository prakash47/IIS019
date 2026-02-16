import type { Metadata } from "next";
import { createMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = createMetadata({
    title: "Products",
    description:
        "Browse our full collection of premium products. Filter by category, price, and more.",
    url: "/products",
});

export default function ProductsPage() {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8">
                All Products
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
                Product listing with filters will be implemented in Phase 2.
            </p>
        </div>
    );
}
