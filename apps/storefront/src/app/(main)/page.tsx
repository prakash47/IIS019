import Link from "next/link";
import { ArrowRight, Shield, Truck, RotateCcw, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
    return (
        <>
            {/* ── Hero Section ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent-500/10 blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-primary-500/15 blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-600/5 blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm mb-6 backdrop-blur-sm">
                            <Sparkles className="w-4 h-4 text-accent-400" />
                            <span className="text-white/90">New Collection 2026</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight">
                            Discover{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-500">
                                Premium
                            </span>
                            <br />
                            Products
                        </h1>

                        <p className="mt-6 text-lg sm:text-xl text-white/70 max-w-xl leading-relaxed">
                            Curated collections of high-quality products. Free shipping on
                            orders above ₹999 with easy 30-day returns.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link href="/products">
                                <Button size="xl" variant="accent" className="gap-2 group">
                                    Shop Now
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/collections">
                                <Button
                                    size="xl"
                                    variant="outline"
                                    className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                                >
                                    Browse Collections
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="mt-14 flex items-center gap-8 sm:gap-12">
                            {[
                                { value: "10K+", label: "Products" },
                                { value: "50K+", label: "Happy Customers" },
                                { value: "4.8", label: "Avg. Rating", icon: Star },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-2xl sm:text-3xl font-bold text-white">
                                            {stat.value}
                                        </span>
                                        {stat.icon && (
                                            <stat.icon className="w-5 h-5 text-accent-400 fill-accent-400" />
                                        )}
                                    </div>
                                    <span className="text-sm text-white/50">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Trust Badges ── */}
            <section className="py-8 border-b border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                        {[
                            {
                                icon: Truck,
                                title: "Free Shipping",
                                description: "On orders above ₹999",
                            },
                            {
                                icon: RotateCcw,
                                title: "Easy Returns",
                                description: "30-day hassle-free returns",
                            },
                            {
                                icon: Shield,
                                title: "Secure Payments",
                                description: "256-bit SSL encryption",
                            },
                        ].map((badge) => (
                            <div
                                key={badge.title}
                                className="flex items-center gap-4 justify-center sm:justify-start"
                            >
                                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                    <badge.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {badge.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {badge.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Featured Products Placeholder ── */}
            <section className="py-16 sm:py-20 bg-surface dark:bg-surface-dark">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white">
                            Featured Products
                        </h2>
                        <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                            Handpicked selections from our latest collection, chosen for their
                            exceptional quality and design.
                        </p>
                    </div>

                    {/* Product grid placeholder */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div
                                key={i}
                                className="group rounded-2xl overflow-hidden bg-white dark:bg-surface-dark-secondary border border-gray-200/60 dark:border-gray-700/40 shadow-xs hover:shadow-elevated transition-all duration-300"
                            >
                                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                        <Sparkles className="w-8 h-8" />
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                                    <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
                                    <div className="h-5 w-1/3 bg-primary-100 dark:bg-primary-900/30 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link href="/products">
                            <Button variant="outline" size="lg" className="gap-2 group">
                                View All Products
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Category Showcase ── */}
            <section className="py-16 sm:py-20 bg-surface-secondary dark:bg-surface-dark-secondary">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white">
                            Shop by Category
                        </h2>
                        <p className="mt-3 text-gray-500 dark:text-gray-400">
                            Browse our curated categories and find exactly what you need.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {[
                            { name: "Electronics", color: "from-blue-500 to-indigo-600" },
                            { name: "Fashion", color: "from-pink-500 to-rose-600" },
                            { name: "Home & Living", color: "from-emerald-500 to-teal-600" },
                            { name: "Accessories", color: "from-amber-500 to-orange-600" },
                        ].map((category) => (
                            <Link
                                key={category.name}
                                href={`/categories/${category.name.toLowerCase().replace(/[& ]+/g, "-")}`}
                                className="group relative aspect-[4/3] rounded-2xl overflow-hidden"
                            >
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90 group-hover:opacity-100 transition-opacity`}
                                />
                                <div className="absolute inset-0 flex items-end p-6">
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-display font-bold text-white">
                                            {category.name}
                                        </h3>
                                        <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors flex items-center gap-1 mt-1">
                                            Explore
                                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Newsletter CTA ── */}
            <section className="py-16 sm:py-20 bg-surface dark:bg-surface-dark">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800 px-8 py-14 sm:px-16 sm:py-20 text-center">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
                            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/20 blur-3xl" />
                        </div>
                        <div className="relative">
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
                                Get 15% Off Your First Order
                            </h2>
                            <p className="mt-3 text-lg text-white/70 max-w-xl mx-auto">
                                Join our community and be the first to know about new arrivals,
                                exclusive deals, and special offers.
                            </p>
                            <form
                                className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                                action="#"
                            >
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-white/50 focus:ring-2 focus:ring-white/20 focus:outline-none backdrop-blur-sm"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="h-12 px-8 rounded-xl bg-accent-500 text-white font-semibold hover:bg-accent-600 active:bg-accent-700 transition-colors shrink-0"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
