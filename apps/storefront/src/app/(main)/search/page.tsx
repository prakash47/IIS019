import type { Metadata } from "next";
import { createMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = createMetadata({
    title: "Search",
    description: "Search for products, collections, and more at Naman Ent.",
    url: "/search",
});

export default function SearchPage() {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8">
                Search
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
                MeiliSearch-powered search will be implemented in Phase 2.
            </p>
        </div>
    );
}
