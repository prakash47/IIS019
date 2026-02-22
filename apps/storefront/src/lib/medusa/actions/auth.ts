"use server";

import { cookies } from "next/headers";
import { medusa } from "@/lib/medusa/client";

// ─── Login customer ────────────────────────────────────────────────────────────
export async function loginCustomer(email: string, password: string) {
    try {
        const response = await medusa.auth.login("customer", "emailpass", {
            email,
            password,
        });
        // Store token in cookie
        if (response.token) {
            const cookieStore = await cookies();
            cookieStore.set("medusa_customer_token", String(response.token), {
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
        // Step 1: Create auth identity
        const token = await medusa.auth.register("customer", "emailpass", {
            email: data.email,
            password: data.password,
        });

        // Step 2: Create customer profile using the token
        const customerResponse = await medusa.store.customer.create(
            { email: data.email, first_name: data.first_name, last_name: data.last_name, phone: data.phone },
            { Authorization: `Bearer ${token}` }
        );

        // Step 3: Log them in
        await loginCustomer(data.email, data.password);

        return { success: true, customer: customerResponse.customer };
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
