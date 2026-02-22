"use server";

import { cookies } from "next/headers";
import { medusa } from "@/lib/medusa/client";
import { getCartId, setCartId } from "@/lib/utils/cart-cookie";
import { createCart } from "@/lib/medusa/queries/cart";

// ─── Get or create cart ───────────────────────────────────────────────────────
async function getOrCreateCart() {
    const cartId = await getCartId();
    if (cartId) {
        try {
            const response = await medusa.store.cart.retrieve(cartId);
            return response.cart;
        } catch {
            // Cart expired — fall through to create a new one
        }
    }
    const newCart = await createCart();
    await setCartId(newCart.id);
    return newCart;
}

// ─── Add item to cart ─────────────────────────────────────────────────────────
export async function addToCart(variantId: string, quantity: number = 1) {
    try {
        const cart = await getOrCreateCart();
        const response = await medusa.store.cart.createLineItem(cart.id, {
            variant_id: variantId,
            quantity,
        });
        return { success: true, cart: response.cart };
    } catch (error) {
        // If cart was somehow invalid, try once more with a fresh cart
        try {
            const newCart = await createCart();
            await setCartId(newCart.id);
            const response = await medusa.store.cart.createLineItem(newCart.id, {
                variant_id: variantId,
                quantity,
            });
            return { success: true, cart: response.cart };
        } catch {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Failed to add to cart",
            };
        }
    }
}

// ─── Remove item from cart ────────────────────────────────────────────────────
export async function removeFromCart(lineItemId: string) {
    const cartId = await getCartId();
    if (!cartId) return null;
    try {
        const response = await medusa.store.cart.deleteLineItem(cartId, lineItemId);
        return response;
    } catch (error) {
        // Line item may already be gone — not an error from the user's perspective
        console.error("removeFromCart:", error);
        return null;
    }
}

// ─── Update item quantity ─────────────────────────────────────────────────────
export async function updateCartItem(lineItemId: string, quantity: number) {
    const cartId = await getCartId();
    if (!cartId) return null;
    try {
        const response = await medusa.store.cart.updateLineItem(
            cartId,
            lineItemId,
            { quantity }
        );
        return response.cart;
    } catch (error) {
        // Line item stale — re-fetch the cart so the UI stays consistent
        console.error("updateCartItem:", error);
        try {
            const response = await medusa.store.cart.retrieve(cartId);
            return response.cart;
        } catch {
            return null;
        }
    }
}

// ─── Set shipping address ─────────────────────────────────────────────────────
export async function setShippingAddress(address: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    country_code: string;
    postal_code: string;
    phone?: string;
}) {
    const cartId = await getCartId();
    if (!cartId) return null;
    try {
        const response = await medusa.store.cart.update(cartId, {
            shipping_address: address,
            billing_address: address,
        });
        return response.cart;
    } catch (error) {
        console.error("setShippingAddress:", error);
        return null;
    }
}

// ─── Set email on cart ────────────────────────────────────────────────────────
export async function setCartEmail(email: string) {
    const cartId = await getCartId();
    if (!cartId) return null;
    try {
        const response = await medusa.store.cart.update(cartId, { email });
        return response.cart;
    } catch {
        return null;
    }
}

// ─── List shipping options for cart ──────────────────────────────────────────
export async function getShippingOptions() {
    const cartId = await getCartId();
    if (!cartId) return [];
    try {
        const response = await medusa.store.fulfillment.listCartOptions({
            cart_id: cartId,
        });
        return response.shipping_options;
    } catch {
        return [];
    }
}

// ─── Add shipping method to cart ─────────────────────────────────────────────
export async function setShippingMethod(shippingOptionId: string) {
    const cartId = await getCartId();
    if (!cartId) return null;
    try {
        const response = await medusa.store.cart.addShippingMethod(cartId, {
            option_id: shippingOptionId,
        });
        return response.cart;
    } catch {
        return null;
    }
}

// ─── Initialize payment session ───────────────────────────────────────────────
export async function initPaymentSession(providerId: string) {
    const cartId = await getCartId();
    if (!cartId) return null;
    try {
        const response = await medusa.store.payment.initiatePaymentSession(
            { cart_id: cartId } as never,
            { provider_id: providerId }
        );
        return response;
    } catch {
        return null;
    }
}

// ─── Complete cart / place order ──────────────────────────────────────────────
export async function completeCart() {
    const cartId = await getCartId();
    if (!cartId) return null;
    try {
        const response = await medusa.store.cart.complete(cartId);
        // Clear cart cookie after successful order
        if (response.type === "order") {
            const cookieStore = await cookies();
            cookieStore.delete("medusa_cart_id");
        }
        return response;
    } catch (error) {
        console.error("completeCart:", error);
        return null;
    }
}
