import { medusa } from "@/lib/medusa/client";
import type { StoreProductParams } from "@medusajs/types";

// ─── List Products ────────────────────────────────────────────────────────────
export async function getProducts(params?: {
    limit?: number;
    offset?: number;
    collection_id?: string[];
    category_id?: string[];
    handle?: string;
    q?: string;
    order?: string;
    price_list_id?: string[];
}) {
    const response = await medusa.store.product.list({
        limit: params?.limit ?? 20,
        offset: params?.offset ?? 0,
        ...params,
    });
    return {
        products: response.products,
        count: response.count,
        limit: response.limit,
        offset: response.offset,
    };
}

// ─── Get single product by handle ─────────────────────────────────────────────
export async function getProduct(handle: string) {
    const response = await medusa.store.product.list({ handle });
    return response.products[0] ?? null;
}

// ─── Get products by collection ───────────────────────────────────────────────
export async function getProductsByCollection(
    collectionId: string,
    params?: { limit?: number; offset?: number }
) {
    const response = await medusa.store.product.list({
        collection_id: [collectionId],
        limit: params?.limit ?? 12,
        offset: params?.offset ?? 0,
    });
    return {
        products: response.products,
        count: response.count,
    };
}

// ─── Get products by category slug ────────────────────────────────────────────
export async function getProductsByCategory(
    categoryId: string,
    params?: { limit?: number; offset?: number }
) {
    const response = await medusa.store.product.list({
        category_id: [categoryId],
        limit: params?.limit ?? 12,
        offset: params?.offset ?? 0,
    });
    return {
        products: response.products,
        count: response.count,
    };
}

// ─── Search products ──────────────────────────────────────────────────────────
export async function searchProducts(query: string, limit = 12) {
    const response = await medusa.store.product.list({
        q: query,
        limit,
    });
    return response.products;
}
