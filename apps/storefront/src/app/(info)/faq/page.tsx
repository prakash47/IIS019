import type { Metadata } from "next";
import { createMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = createMetadata({
    title: "Frequently Asked Questions",
    description: "Find answers to common questions about orders, shipping, returns, and more at Naman Ent.",
    url: "/faq",
});

const faqs = [
    { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business day delivery." },
    { q: "What is your return policy?", a: "We offer a 30-day hassle-free return policy. Items must be in original condition with tags attached." },
    { q: "Do you offer international shipping?", a: "Yes, we ship to select international destinations. Shipping rates and delivery times vary by location." },
    { q: "How do I track my order?", a: "Once your order ships, you'll receive a tracking number via email. You can also check your order status in your account dashboard." },
    { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, UPI, net banking, and popular wallets through Stripe and PayPal." },
    { q: "Can I cancel my order?", a: "Orders can be cancelled within 2 hours of placement. After that, you can initiate a return once the order is delivered." },
];

export default function FAQPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white text-center mb-12">
                Frequently Asked Questions
            </h1>
            <div className="space-y-4">
                {faqs.map((faq, i) => (
                    <details
                        key={i}
                        className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark-secondary overflow-hidden"
                    >
                        <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-gray-900 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-surface-dark-tertiary transition-colors">
                            {faq.q}
                            <span className="ml-4 text-gray-400 group-open:rotate-45 transition-transform text-xl">+</span>
                        </summary>
                        <div className="px-6 pb-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            {faq.a}
                        </div>
                    </details>
                ))}
            </div>
        </div>
    );
}
