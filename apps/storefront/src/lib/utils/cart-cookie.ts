import { cookies } from "next/headers";

const CART_COOKIE_NAME = "medusa_cart_id";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// ─── Get cart ID from cookie ─────────────────────────────────────────────────
export async function getCartId(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(CART_COOKIE_NAME)?.value ?? null;
}

// ─── Set cart ID in cookie ───────────────────────────────────────────────────
export async function setCartId(cartId: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(CART_COOKIE_NAME, cartId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: CART_COOKIE_MAX_AGE,
        path: "/",
    });
}

// ─── Clear cart ID from cookie ───────────────────────────────────────────────
export async function clearCartId(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(CART_COOKIE_NAME);
}
