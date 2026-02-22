/**
 * Client-side cart ID helpers using document.cookie
 * Use this in "use client" components.
 * For server components / server actions, use @/lib/utils/cart-cookie (next/headers)
 */

const CART_COOKIE = "medusa_cart_id";

export function getCartIdClient(): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(
        new RegExp("(?:^|; )" + CART_COOKIE + "=([^;]*)")
    );
    return match ? decodeURIComponent(match[1]) : null;
}
