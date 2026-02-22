"use server";

import { cookies } from "next/headers";
import { medusa } from "@/lib/medusa/client";

// ─── Login customer ────────────────────────────────────────────────────────────
export async function loginCustomer(email: string, password: string) {
    try {
        const token = await medusa.auth.login("customer", "emailpass", {
            email,
            password,
        }) as string;
        // Store token in cookie
        if (token) {
            const cookieStore = await cookies();
            cookieStore.set("medusa_customer_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: "/",
            });
        }
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Invalid email or password",
        };
    }
}

// ─── Register customer ─────────────────────────────────────────────────────────
export async function registerCustomer(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
}) {
    try {
        // Step 1: Create auth identity — returns JWT token as string in Medusa v2
        const token = await medusa.auth.register("customer", "emailpass", {
            email: data.email,
            password: data.password,
        }) as string;

        // Step 2: Create customer profile (pass token via Authorization header)
        await medusa.store.customer.create(
            {
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                ...(data.phone ? { phone: data.phone } : {}),
            },
            {},
            { Authorization: `Bearer ${token}` }
        );

        // Step 3: Log them in with email/password
        await loginCustomer(data.email, data.password);

        return { success: true };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error ? error.message : "Registration failed",
        };
    }
}


// ─── Logout customer ───────────────────────────────────────────────────────────
export async function logoutCustomer() {
    try {
        await medusa.auth.logout();
    } catch {
        // Best-effort logout
    }
    const cookieStore = await cookies();
    cookieStore.delete("medusa_customer_token");
    return { success: true };
}

// ─── Get auth token from cookie ────────────────────────────────────────────────
export async function getAuthToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get("medusa_customer_token")?.value ?? null;
}
