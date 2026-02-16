import type { Metadata } from "next";
import { createMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = createMetadata({
    title: "Shipping & Returns",
    description: "Learn about Naman Ent's shipping options, delivery times, and return policy.",
    url: "/shipping-returns",
});

export default function ShippingReturnsPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-8">Shipping & Returns</h1>
            <div className="prose prose-lg dark:prose-invert max-w-none">
                <h2>Shipping</h2>
                <p>We offer free standard shipping on all orders above ₹999. Standard delivery takes 5-7 business days.</p>
                <ul>
                    <li><strong>Standard:</strong> 5-7 business days — Free on orders ₹999+</li>
                    <li><strong>Express:</strong> 2-3 business days — ₹199</li>
                </ul>
                <h2>Returns</h2>
                <p>We offer a 30-day return policy. Items must be unused and in original packaging.</p>
                <p>To initiate a return, contact us at support@namanent.com with your order number.</p>
            </div>
        </div>
    );
}
