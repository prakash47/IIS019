import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { HttpTypes } from "@medusajs/types";

// ─── Lightweight product snapshot (avoids storing full product object) ─────────
export interface RecentProduct {
    id: string;
    handle: string;
    title: string;
    thumbnail: string | null;
    price: number;
    currency: string;
}

interface RecentlyViewedState {
    items: RecentProduct[];
    addItem: (product: RecentProduct) => void;
    clearItems: () => void;
}

const MAX_ITEMS = 12;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
    persist(
        (set) => ({
            items: [],
            addItem: (product) =>
                set((state) => {
                    // Remove if already present, add to front
                    const filtered = state.items.filter((p) => p.id !== product.id);
                    return { items: [product, ...filtered].slice(0, MAX_ITEMS) };
                }),
            clearItems: () => set({ items: [] }),
        }),
        {
            name: "naman-ent-recently-viewed",
        }
    )
);

// ─── Helper: Extract snapshot from Medusa product ─────────────────────────────
export function productToSnapshot(product: HttpTypes.StoreProduct): RecentProduct {
    const firstVariant = product.variants?.[0];
    const firstPrice = firstVariant?.calculated_price;
    return {
        id: product.id,
        handle: product.handle ?? "",
        title: product.title ?? "",
        thumbnail: product.thumbnail ?? null,
        price: firstPrice?.calculated_amount ?? 0,
        currency: firstPrice?.currency_code ?? "INR",
    };
}
