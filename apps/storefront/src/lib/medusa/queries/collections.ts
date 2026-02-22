import { medusa } from "@/lib/medusa/client";

// ─── List all collections ─────────────────────────────────────────────────────
export async function getCollections(params?: {
    limit?: number;
    offset?: number;
}) {
    const response = await medusa.store.collection.list({
        limit: params?.limit ?? 50,
        offset: params?.offset ?? 0,
    });
    return {
        collections: response.collections,
        count: response.count,
    };
}

// ─── Get single collection by handle ──────────────────────────────────────────
export async function getCollection(handle: string) {
    const response = await medusa.store.collection.list({ handle });
    return response.collections[0] ?? null;
}
