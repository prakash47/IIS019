import type { Metadata } from "next";
import { createMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = createMetadata({
    title: "Terms of Service",
    description: "Read the terms of service for Naman Ent.",
    url: "/terms",
});

export default function TermsPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>
            <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>Last updated: February 2026</p>
                <p>By accessing and using the Naman Ent website, you accept and agree to be bound by these terms.</p>
                <h2>Use of the Website</h2>
                <p>You agree to use this website for lawful purposes only and in a way that does not infringe the rights of any third party.</p>
                <h2>Purchases</h2>
                <p>All purchases are subject to product availability. Prices are subject to change without notice.</p>
            </div>
        </div>
    );
}
