import { create } from "zustand";
import type { HttpTypes } from "@medusajs/types";

interface CartState {
    cart: HttpTypes.StoreCart | null;
    isOpen: boolean;
    isLoading: boolean;
    setCart: (cart: HttpTypes.StoreCart | null) => void;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    setLoading: (loading: boolean) => void;
}

export const useCartStore = create<CartState>((set) => ({
    cart: null,
    isOpen: false,
    isLoading: false,
    setCart: (cart) => set({ cart }),
    openCart: () => set({ isOpen: true }),
    closeCart: () => set({ isOpen: false }),
    toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    setLoading: (isLoading) => set({ isLoading }),
}));

// ─── Derived selectors ─────────────────────────────────────────────────────────
export const useCart = () => useCartStore((s) => s.cart);
export const useCartOpen = () => useCartStore((s) => s.isOpen);
export const useCartItemCount = () =>
    useCartStore(
        (s) =>
            s.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0
    );
