"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, Heart } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants/navigation";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 w-full">
            {/* Top bar */}
            <div className="bg-primary-900 text-white text-xs sm:text-sm text-center py-2 px-4">
                <p>
                    Free shipping on orders above ₹999 •{" "}
                    <Link href="/products" className="underline underline-offset-2 hover:text-accent-300 transition-colors">
                        Shop Now
                    </Link>
                </p>
            </div>

            {/* Main header */}
            <div className="bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-700/60">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between gap-4">
                        {/* Mobile menu button */}
                        <button
                            className="lg:hidden p-2 -ml-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                            aria-expanded={mobileMenuOpen}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>

                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center gap-2 shrink-0"
                        >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">N</span>
                            </div>
                            <span className="text-xl font-display font-bold text-gray-900 dark:text-white hidden sm:block">
                                Naman Ent
                            </span>
                        </Link>

                        {/* Desktop navigation */}
                        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all duration-200"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Right actions */}
                        <div className="flex items-center gap-1">
                            {/* Search */}
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="p-2.5 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-primary-950/30 transition-colors"
                                aria-label="Search products"
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Wishlist */}
                            <Link
                                href="/account"
                                className="p-2.5 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-primary-950/30 transition-colors hidden sm:flex"
                                aria-label="Wishlist"
                            >
                                <Heart className="w-5 h-5" />
                            </Link>

                            {/* Account */}
                            <Link
                                href="/login"
                                className="p-2.5 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-primary-950/30 transition-colors"
                                aria-label="Account"
                            >
                                <User className="w-5 h-5" />
                            </Link>

                            {/* Cart */}
                            <Link
                                href="/cart"
                                className="relative p-2.5 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-primary-950/30 transition-colors"
                                aria-label="Shopping cart"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent-500 text-white text-[10px] font-bold flex items-center justify-center">
                                    0
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search overlay */}
            {searchOpen && (
                <div className="absolute inset-x-0 top-full bg-white dark:bg-surface-dark shadow-elevated animate-slide-down border-b border-gray-200 dark:border-gray-700">
                    <div className="mx-auto max-w-3xl px-4 py-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="search"
                                placeholder="Search products, collections, brands..."
                                className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-surface-dark-secondary text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors"
                                autoFocus
                            />
                        </div>
                        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                            <p>Popular searches: T-shirts, Electronics, Summer collection</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute inset-x-0 top-full bg-white dark:bg-surface-dark shadow-elevated animate-slide-down border-b border-gray-200 dark:border-gray-700">
                    <nav className="px-4 py-4 space-y-1" aria-label="Mobile navigation">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-lg transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                            <Link
                                href="/login"
                                className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-lg transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Sign In / Register
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
