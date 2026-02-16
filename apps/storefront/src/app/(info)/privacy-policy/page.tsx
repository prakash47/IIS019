import type { Metadata } from "next";
import { createMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = createMetadata({
    title: "Privacy Policy",
    description: "Read Naman Ent's privacy policy to understand how we collect, use, and protect your personal data.",
    url: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
            <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>Last updated: February 2026</p>
                <p>This privacy policy describes how Naman Ent collects, uses, and shares your personal information when you visit or make a purchase from our store.</p>
                <h2>Information We Collect</h2>
                <p>We collect information you provide directly to us, including name, email address, shipping address, and payment information when you make a purchase.</p>
                <h2>How We Use Your Information</h2>
                <p>We use the information we collect to fulfill orders, communicate with you, and improve our services.</p>
                <h2>Contact Us</h2>
                <p>If you have questions about this policy, please contact us at support@namanent.com.</p>
            </div>
        </div>
    );
}
