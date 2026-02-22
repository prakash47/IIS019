import type { Metadata } from "next";
import { createMetadata } from "@/lib/utils/seo";
import ProductsPageClient from "./ProductsPageClient";

export const metadata: Metadata = createMetadata({
    title: "Products — Computer Accessories, Printers & Toner",
    description:
        "Shop our full range of computer accessories, printers, printer toner, and ink cartridges. Compatible with HP, Canon, Epson, Brother and more.",
    url: "/products",
});

export default function ProductsPage() {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {/* ── Page Header ── */}
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                    All Products
                </h1>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Computer accessories, printers, toner cartridges, and ink — all brands.
                </p>
            </div>

            {/* ── Products Layout (sidebar + grid) ── */}
            <ProductsPageClient />
        </div>
    );
}
