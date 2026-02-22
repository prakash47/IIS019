import { medusa } from "@/lib/medusa/client";

// ─── List all top-level categories ───────────────────────────────────────────
export async function getCategories(params?: {
    limit?: number;
    offset?: number;
}) {
    const response = await medusa.store.category.list({
        limit: params?.limit ?? 50,
        offset: params?.offset ?? 0,
        include_descendants_tree: true,
    });
    return {
        categories: response.product_categories,
        count: response.count,
    };
}

// ─── Get single category by handle ────────────────────────────────────────────
export async function getCategoryByHandle(handle: string[]) {
    // Medusa v2 store API — category by handle array
    const response = await medusa.store.category.list({
        handle: handle[handle.length - 1],
        include_descendants_tree: true,
    });
    return response.product_categories[0] ?? null;
}
