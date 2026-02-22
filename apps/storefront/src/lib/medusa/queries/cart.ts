import { medusa } from "@/lib/medusa/client";

// ─── Get cart by ID ───────────────────────────────────────────────────────────
export async function getCart(cartId: string) {
    try {
        const response = await medusa.store.cart.retrieve(cartId);
        return response.cart;
    } catch {
        return null;
    }
}

// ─── Create new cart ──────────────────────────────────────────────────────────
export async function createCart(regionId?: string) {
    const response = await medusa.store.cart.create({
        region_id: regionId,
    });
    return response.cart;
}

// ─── Get region list (for cart creation) ─────────────────────────────────────
export async function getRegions() {
    const response = await medusa.store.region.list();
    return response.regions;
}
