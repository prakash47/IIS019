import type { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const categoryName = slug[slug.length - 1]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

    return {
        title: categoryName,
        description: `Browse ${categoryName} products at Naman Ent. Quality guaranteed.`,
        alternates: { canonical: `/categories/${slug.join("/")}` },
    };
}

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string[] }>;
}) {
    const { slug } = await params;
    const categoryName = slug[slug.length - 1]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                {categoryName}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
                Category page with filtered products will be implemented in Phase 2.
            </p>
        </div>
    );
}
