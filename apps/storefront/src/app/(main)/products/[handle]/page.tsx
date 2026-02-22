import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { getProduct, getProducts } from "@/lib/medusa/queries/products";
import { ProductGallery } from "@/components/commerce/ProductGallery";
import { ProductInfo } from "@/components/commerce/ProductInfo";
import { ProductAccordion } from "@/components/commerce/ProductAccordion";
import { ProductCard } from "@/components/commerce/ProductCard";

// ─── generateMetadata ─────────────────────────────────────────────────────────
export async function generateMetadata({
    params,
}: {
    params: Promise<{ handle: string }>;
}): Promise<Metadata> {
    const { handle } = await params;
    const product = await getProduct(handle);
    if (!product) {
        return { title: "Product Not Found" };
    }
    return {
        title: `${product.title} — Naman Ent`,
        description: product.description ?? `Shop ${product.title} at Naman Ent. Genuine product, fast delivery.`,
        alternates: { canonical: `/products/${handle}` },
        openGraph: {
            title: product.title,
            description: product.description ?? "",
            images: product.thumbnail ? [{ url: product.thumbnail }] : [],
        },
    };
}

// ─── PDP Page ─────────────────────────────────────────────────────────────────
export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ handle: string }>;
}) {
    const { handle } = await params;
    const product = await getProduct(handle);

    if (!product) {
        notFound();
    }

    // ── Prepare images ─────────────────────────────────────────────────────────
    const images = [
        ...(product.thumbnail ? [{ id: "thumbnail", url: product.thumbnail }] : []),
        ...(product.images?.filter((img) => img.url !== product.thumbnail).map((img) => ({
            id: img.id!,
            url: img.url!,
        })) ?? []),
    ];

    // ── Fetch related products (same collection) ──────────────────────────────
    const related = product.collection_id
        ? (
            await getProducts({
                collection_id: [product.collection_id],
                limit: 5,
            })
        ).products.filter((p) => p.id !== product.id).slice(0, 4)
        : [];

    // ── Accordion content ─────────────────────────────────────────────────────
    const accordionItems = [
        ...(product.description
            ? [
                {
                    id: "description",
                    title: "Description",
                    content: (
                        <p className="whitespace-pre-wrap">{product.description}</p>
                    ),
                },
            ]
            : []),
        {
            id: "compatibility",
            title: "Compatibility",
            content: (
                <p>
                    Please check the product title and description for compatible printer models.
                    If you're unsure, contact our support team with your printer model number.
                </p>
            ),
        },
        {
            id: "shipping",
            title: "Shipping & Delivery",
            content: (
                <ul className="space-y-1.5 list-disc list-inside">
                    <li>Free delivery on orders above ₹500</li>
                    <li>Standard delivery: 2–5 business days</li>
                    <li>Express delivery available at checkout</li>
                    <li>Orders placed before 2 PM ship the same day</li>
                </ul>
            ),
        },
        {
            id: "returns",
            title: "Returns & Warranty",
            content: (
                <ul className="space-y-1.5 list-disc list-inside">
                    <li>7-day return policy on unopened items</li>
                    <li>Manufacturer warranty applicable</li>
                    <li>Contact support within 48 hours of delivery for issues</li>
                </ul>
            ),
        },
    ];

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {/* ── Breadcrumb ── */}
            <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    <Home className="h-4 w-4" />
                </Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <Link href="/products" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    Products
                </Link>
                {product.categories?.[0] && (
                    <>
                        <ChevronRight className="h-3.5 w-3.5" />
                        <span className="text-gray-400">{product.categories[0].name}</span>
                    </>
                )}
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-gray-800 dark:text-gray-200 font-medium line-clamp-1 max-w-[200px]">
                    {product.title}
                </span>
            </nav>

            {/* ── Main Product Layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                {/* Gallery — left */}
                <div className="animate-fade-in">
                    <ProductGallery images={images} title={product.title} />
                </div>

                {/* Info — right */}
                <div className="animate-slide-up">
                    <ProductInfo product={product} />
                </div>
            </div>

            {/* ── Product Details Accordion ── */}
            <div className="mt-12 max-w-3xl">
                <h2 className="mb-4 text-lg font-display font-semibold text-gray-900 dark:text-white">
                    Product Details
                </h2>
                <ProductAccordion items={accordionItems} />
            </div>

            {/* ── Related Products ── */}
            {related.length > 0 && (
                <div className="mt-16">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                            Related Products
                        </h2>
                        <Link
                            href="/products"
                            className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
                        >
                            View all
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {related.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
