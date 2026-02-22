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
            // Cart expired — create new one
        }
    }
    const newCart = await createCart();
    await setCartId(newCart.id);
    return newCart;
}

// ─── Add item to cart ─────────────────────────────────────────────────────────
export async function addToCart(variantId: string, quantity: number = 1) {
    const cart = await getOrCreateCart();
    const response = await medusa.store.cart.lineItems.create(cart.id, {
        variant_id: variantId,
        quantity,
    });
    return response.cart;
}

// ─── Remove item from cart ────────────────────────────────────────────────────
export async function removeFromCart(lineItemId: string) {
    const cartId = await getCartId();
    if (!cartId) return null;
    const response = await medusa.store.cart.lineItems.delete(
        cartId,
        lineItemId
    );
    return response;
}

// ─── Update item quantity ─────────────────────────────────────────────────────
export async function updateCartItem(lineItemId: string, quantity: number) {
    const cartId = await getCartId();
    if (!cartId) return null;
    const response = await medusa.store.cart.lineItems.update(
        cartId,
        lineItemId,
        { quantity }
    );
    return response.cart;
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
    const response = await medusa.store.cart.update(cartId, {
        shipping_address: address,
        billing_address: address,
    });
    return response.cart;
}

// ─── Set email on cart ────────────────────────────────────────────────────────
export async function setCartEmail(email: string) {
    const cartId = await getCartId();
    if (!cartId) return null;
    const response = await medusa.store.cart.update(cartId, { email });
    return response.cart;
}

// ─── List shipping options for cart ──────────────────────────────────────────
export async function getShippingOptions() {
    const cartId = await getCartId();
    if (!cartId) return [];
    const response = await medusa.store.fulfillment.listCartOptions({
        cart_id: cartId,
    });
    return response.shipping_options;
}

// ─── Add shipping method to cart ─────────────────────────────────────────────
export async function setShippingMethod(shippingOptionId: string) {
    const cartId = await getCartId();
    if (!cartId) return null;
    const response = await medusa.store.cart.addShippingMethod(cartId, {
        option_id: shippingOptionId,
    });
    return response.cart;
}

// ─── Initialize payment session ───────────────────────────────────────────────
export async function initPaymentSession(providerId: string) {
    const cartId = await getCartId();
    if (!cartId) return null;
    const response = await medusa.store.payment.initiatePaymentSession(
        { cart_id: cartId } as never,
        { provider_id: providerId }
    );
    return response;
}

// ─── Complete cart / place order ──────────────────────────────────────────────
export async function completeCart() {
    const cartId = await getCartId();
    if (!cartId) return null;
    const response = await medusa.store.cart.complete(cartId);
    // Clear cart cookie after successful order
    if (response.type === "order") {
        const cookieStore = await cookies();
        cookieStore.delete("medusa_cart_id");
    }
    return response;
}
