import type { Metadata } from "next";
import { createMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = createMetadata({
    title: "About Us",
    description: "Learn about Naman Ent — our story, mission, and commitment to delivering premium products.",
    url: "/about",
});

export default function AboutPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-6">
                About Naman Ent
            </h1>
            <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>
                    Naman Ent is committed to bringing you the finest quality products at competitive prices.
                    Our curated collections are designed to meet the needs of modern shoppers who value both
                    quality and style.
                </p>
                <p>
                    Founded with a passion for excellence, we source products from trusted manufacturers
                    and brands to ensure every item meets our high standards.
                </p>
            </div>
        </div>
    );
}
