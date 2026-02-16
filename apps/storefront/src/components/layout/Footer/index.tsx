import Link from "next/link";
import { FOOTER_LINKS } from "@/lib/constants/navigation";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-950 text-gray-300" role="contentinfo">
            {/* Main footer */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                                <span className="text-white font-bold">N</span>
                            </div>
                            <span className="text-xl font-display font-bold text-white">
                                Naman Ent
                            </span>
                        </Link>
                        <p className="text-sm text-gray-400 max-w-sm leading-relaxed mb-6">
                            Discover premium quality products curated just for you.
                            Shop with confidence — fast delivery, easy returns, and
                            exceptional customer service.
                        </p>
                        <div className="space-y-2.5 text-sm">
                            <div className="flex items-center gap-2.5 text-gray-400">
                                <Mail className="w-4 h-4 shrink-0" />
                                <span>support@namanent.com</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-gray-400">
                                <Phone className="w-4 h-4 shrink-0" />
                                <span>+91 98765 43210</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-gray-400">
                                <MapPin className="w-4 h-4 shrink-0" />
                                <span>Mumbai, India</span>
                            </div>
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.values(FOOTER_LINKS).map((section) => (
                        <div key={section.title}>
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                                {section.title}
                            </h3>
                            <ul className="space-y-2.5">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-gray-400 hover:text-primary-400 transition-colors duration-200"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Newsletter */}
                <div className="mt-14 pt-10 border-t border-gray-800">
                    <div className="max-w-xl">
                        <h3 className="text-lg font-semibold text-white mb-2">
                            Stay in the loop
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Subscribe to our newsletter for exclusive deals, new arrivals, and insider-only discounts.
                        </p>
                        <form className="flex gap-2" action="#">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 h-11 px-4 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder:text-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors text-sm"
                                required
                            />
                            <button
                                type="submit"
                                className="h-11 px-6 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 active:bg-primary-800 transition-colors shrink-0"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
                        <p>© {currentYear} Naman Ent. All rights reserved.</p>
                        <div className="flex items-center gap-6">
                            <Link href="/privacy-policy" className="hover:text-gray-300 transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="hover:text-gray-300 transition-colors">
                                Terms of Service
                            </Link>
                            <Link href="/shipping-returns" className="hover:text-gray-300 transition-colors">
                                Shipping & Returns
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
