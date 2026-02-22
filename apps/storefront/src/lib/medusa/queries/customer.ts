import { medusa } from "@/lib/medusa/client";
import { getAuthToken } from "@/lib/medusa/actions/auth";

// ─── Get current customer ──────────────────────────────────────────────────────
export async function getCustomer() {
    const token = await getAuthToken();
    if (!token) return null;
    try {
        const response = await medusa.store.customer.retrieve({}, {
            Authorization: `Bearer ${token}`,
        });
        return response.customer;
    } catch {
        return null;
    }
}

// ─── Get customer orders ───────────────────────────────────────────────────────
export async function getCustomerOrders(params?: {
    limit?: number;
    offset?: number;
}) {
    const token = await getAuthToken();
    if (!token) return { orders: [], count: 0 };
    try {
        const response = await medusa.store.order.list(
            { limit: params?.limit ?? 10, offset: params?.offset ?? 0 },
            { Authorization: `Bearer ${token}` }
        );
        return { orders: response.orders, count: response.count };
    } catch {
        return { orders: [], count: 0 };
    }
}

// ─── Get single order ─────────────────────────────────────────────────────────
export async function getOrder(id: string) {
    const token = await getAuthToken();
    if (!token) return null;
    try {
        const response = await medusa.store.order.retrieve(id, {}, {
            Authorization: `Bearer ${token}`,
        });
        return response.order;
    } catch {
        return null;
    }
}
