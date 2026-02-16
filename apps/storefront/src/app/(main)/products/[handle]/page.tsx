import type { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ handle: string }>;
}): Promise<Metadata> {
    const { handle } = await params;
    return {
        title: handle.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        description: `Shop ${handle.replace(/-/g, " ")} at Naman Ent. Premium quality, fast delivery.`,
        alternates: { canonical: `/products/${handle}` },
    };
}

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ handle: string }>;
}) {
    const { handle } = await params;

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                {handle.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
                Product detail page will be fully implemented in Phase 2.
            </p>
        </div>
    );
}
