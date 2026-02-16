import type { Metadata } from "next";
import { createMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = createMetadata({
    title: "My Account",
    description: "Manage your Naman Ent account — orders, profile, addresses, and wishlist.",
    url: "/account",
    noIndex: true,
});

export default function AccountPage() {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8">
                My Account
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
                Account dashboard will be implemented in Phase 2.
            </p>
        </div>
    );
}
