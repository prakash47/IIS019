import Link from "next/link";
import { ArrowRight, Shield, Truck, RotateCcw, Star, Sparkles, Printer, Droplets, Package, Headphones } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductCard, ProductCardSkeleton } from "@/components/commerce/ProductCard";
import { getProducts } from "@/lib/medusa/queries/products";
import { getCategories } from "@/lib/medusa/queries/categories";
import { getCollections } from "@/lib/medusa/queries/collections";
import { Suspense } from "react";

// ─── Featured Products (async RSC) ────────────────────────────────────────────
async function FeaturedProducts() {
    const { products } = await getProducts({ limit: 8 });

    if (products.length === 0) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

// Category icon map
const CATEGORY_ICONS: Record<string, React.ElementType> = {
    "printer-toner": Printer,
    "toner": Printer,
    "ink": Droplets,
    "ink-cartridges": Droplets,
    "printers": Printer,
    "accessories": Headphones,
    "default": Package,
};

const CATEGORY_COLORS = [
    { gradient: "from-amber-500 to-orange-600", bg: "bg-amber-500/10 dark:bg-amber-500/5" },
    { gradient: "from-violet-600 to-purple-700", bg: "bg-violet-500/10 dark:bg-violet-500/5" },
    { gradient: "from-primary-600 to-primary-800", bg: "bg-primary-500/10 dark:bg-primary-500/5" },
    { gradient: "from-emerald-500 to-teal-600", bg: "bg-emerald-500/10 dark:bg-emerald-500/5" },
    { gradient: "from-rose-500 to-pink-600", bg: "bg-rose-500/10 dark:bg-rose-500/5" },
    { gradient: "from-sky-500 to-cyan-600", bg: "bg-sky-500/10 dark:bg-sky-500/5" },
];

// ─── Category Showcase (async RSC) ────────────────────────────────────────────
async function CategoryShowcase() {
    const { categories } = await getCategories({ limit: 6 });

    // Fallback if no categories in Medusa yet
    if (!categories || categories.length === 0) {
        const fallback = [
            { name: "Printer Toner", handle: "printer-toner" },
            { name: "Ink Cartridges", handle: "ink-cartridges" },
            { name: "Printers", handle: "printers" },
            { name: "Accessories", handle: "accessories" },
        ];
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {fallback.map((cat, i) => {
                    const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
                    const Icon = CATEGORY_ICONS[cat.handle] ?? Package;
                    return (
                        <Link key={cat.handle} href={`/categories/${cat.handle}`}
                            className={`group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-white/5 ${color.bg} p-6 hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5`}>
                            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color.gradient} shadow-sm`}>
                                <Icon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="font-display font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {cat.name}
                            </h3>
                            <span className="mt-2 flex items-center gap-1 text-sm text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                Explore <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                        </Link>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {categories.slice(0, 6).map((cat, i: number) => {
                const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
                const Icon = CATEGORY_ICONS[cat.handle ?? ""] ?? Package;
                return (
                    <Link key={cat.id} href={`/categories/${cat.handle}`}
                        className={`group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-white/5 ${color.bg} p-6 hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5`}>
                        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color.gradient} shadow-sm`}>
                            <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-display font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {cat.name}
                        </h3>
                        <span className="mt-2 flex items-center gap-1 text-sm text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            Explore <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}

// ─── Collections strip (async RSC) ────────────────────────────────────────────
async function CollectionsStrip() {
    const { collections } = await getCollections();
    if (!collections || collections.length === 0) return null;

    return (
        <section className="py-10 border-t border-gray-100 dark:border-white/5 bg-surface dark:bg-surface-dark">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">Shop by Collection</h2>
                    <Link href="/collections" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                        All collections <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {collections.map((col) => (
                        <Link key={col.id} href={`/collections/${col.handle}`}
                            className="shrink-0 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark-secondary px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all whitespace-nowrap">
                            {col.title}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
    return (
        <>
            {/* ── Hero ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent-500/10 blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-primary-500/15 blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-600/5 blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm mb-6 backdrop-blur-sm">
                            <Sparkles className="w-4 h-4 text-accent-400" />
                            <span className="text-white/90">Genuine Products · Fast Delivery</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight">
                            Your One-Stop{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-500">
                                Printer
                            </span>
                            <br />
                            Supplies Shop
                        </h1>

                        <p className="mt-6 text-lg sm:text-xl text-white/70 max-w-xl leading-relaxed">
                            Premium toner cartridges, ink, and printer accessories.
                            Free shipping on orders above ₹500 with easy returns.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link href="/products">
                                <Button size="xl" variant="accent" className="gap-2 group">
                                    Shop Now
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/collections">
                                <Button size="xl" variant="outline"
                                    className="border-white/30 text-white hover:bg-white/10 hover:border-white/50">
                                    Browse Collections
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="mt-14 flex items-center gap-8 sm:gap-12">
                            {[
                                { value: "500+", label: "Products" },
                                { value: "10K+", label: "Happy Customers" },
                                { value: "4.8", label: "Avg. Rating", icon: Star },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</span>
                                        {stat.icon && <stat.icon className="w-5 h-5 text-accent-400 fill-accent-400" />}
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
                            { icon: Truck, title: "Free Shipping", description: "On orders above ₹500" },
                            { icon: RotateCcw, title: "Easy Returns", description: "7-day hassle-free returns" },
                            { icon: Shield, title: "Genuine Products", description: "100% authentic, always" },
                        ].map((badge) => (
                            <div key={badge.title} className="flex items-center gap-4 justify-center sm:justify-start">
                                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                    <badge.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{badge.title}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{badge.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Collections Strip ── */}
            <Suspense fallback={null}>
                <CollectionsStrip />
            </Suspense>

            {/* ── Featured Products ── */}
            <section className="py-16 sm:py-20 bg-surface dark:bg-surface-dark">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white">
                                Featured Products
                            </h2>
                            <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-xl">
                                Top-rated printer supplies trusted by thousands of customers.
                            </p>
                        </div>
                        <Link href="/products" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                            View all <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <Suspense fallback={
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                        </div>
                    }>
                        <FeaturedProducts />
                    </Suspense>

                    <div className="text-center mt-10 sm:hidden">
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
                    <div className="text-center mb-10">
                        <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white">
                            Shop by Category
                        </h2>
                        <p className="mt-3 text-gray-500 dark:text-gray-400">
                            Find the right supplies for your printer brand and model.
                        </p>
                    </div>

                    <Suspense fallback={
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-36 rounded-2xl animate-pulse bg-gray-100 dark:bg-white/5" />
                            ))}
                        </div>
                    }>
                        <CategoryShowcase />
                    </Suspense>
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
                                Get 10% Off Your First Order
                            </h2>
                            <p className="mt-3 text-lg text-white/70 max-w-xl mx-auto">
                                Subscribe for exclusive deals on printer supplies, new arrivals, and
                                compatibility tips for your printer.
                            </p>
                            <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto" action="#">
                                <input type="email" placeholder="Enter your email" required
                                    className="flex-1 h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-white/50 focus:ring-2 focus:ring-white/20 focus:outline-none backdrop-blur-sm" />
                                <button type="submit"
                                    className="h-12 px-8 rounded-xl bg-accent-500 text-white font-semibold hover:bg-accent-600 active:bg-accent-700 transition-colors shrink-0">
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
