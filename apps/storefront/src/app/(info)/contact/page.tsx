import type { Metadata } from "next";
import { createMetadata } from "@/lib/utils/seo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = createMetadata({
    title: "Contact Us",
    description: "Get in touch with Naman Ent. We're here to help with orders, returns, and any questions.",
    url: "/contact",
});

export default function ContactPage() {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white">
                    Contact Us
                </h1>
                <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                    Have a question or need help? We&apos;d love to hear from you.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact form */}
                <div className="bg-white dark:bg-surface-dark-secondary rounded-2xl shadow-card border border-gray-200/60 dark:border-gray-700/60 p-8">
                    <form className="space-y-5" action="#">
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="First Name" placeholder="John" required />
                            <Input label="Last Name" placeholder="Doe" required />
                        </div>
                        <Input label="Email" type="email" placeholder="you@example.com" required />
                        <Input label="Subject" placeholder="How can we help?" required />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Message
                            </label>
                            <textarea
                                rows={5}
                                placeholder="Tell us more..."
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-dark-secondary px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors dark:text-white"
                                required
                            />
                        </div>
                        <Button type="submit" size="lg" className="w-full">
                            Send Message
                        </Button>
                    </form>
                </div>

                {/* Contact info */}
                <div className="space-y-8">
                    {[
                        { icon: Mail, title: "Email Us", detail: "support@namanent.com", sub: "We reply within 24 hours" },
                        { icon: Phone, title: "Call Us", detail: "+91 98765 43210", sub: "Mon–Sat, 10AM–7PM IST" },
                        { icon: MapPin, title: "Visit Us", detail: "Mumbai, Maharashtra", sub: "India" },
                    ].map((item) => (
                        <div key={item.title} className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                <item.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{item.detail}</p>
                                <p className="text-sm text-gray-500">{item.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
