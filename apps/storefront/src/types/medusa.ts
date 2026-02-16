/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Extended Medusa types — these will be refined as we integrate
 * with the actual Medusa SDK types.
 */

export interface MedusaProduct {
    id: string;
    title: string;
    handle: string;
    description: string | null;
    subtitle: string | null;
    thumbnail: string | null;
    images: MedusaImage[];
    variants: MedusaVariant[];
    options: MedusaOption[];
    collection?: MedusaCollection;
    collection_id: string | null;
    categories?: MedusaCategory[];
    tags?: MedusaTag[];
    created_at: string;
    updated_at: string;
    metadata: Record<string, any> | null;
}

export interface MedusaImage {
    id: string;
    url: string;
    metadata: Record<string, any> | null;
}

export interface MedusaVariant {
    id: string;
    title: string;
    sku: string | null;
    barcode: string | null;
    prices: MedusaPrice[];
    options: MedusaOptionValue[];
    inventory_quantity: number;
    manage_inventory: boolean;
    allow_backorder: boolean;
    metadata: Record<string, any> | null;
}

export interface MedusaPrice {
    id: string;
    amount: number;
    currency_code: string;
    min_quantity: number | null;
    max_quantity: number | null;
}

export interface MedusaOption {
    id: string;
    title: string;
    values: MedusaOptionValue[];
}

export interface MedusaOptionValue {
    id: string;
    value: string;
    option_id: string;
}

export interface MedusaCollection {
    id: string;
    title: string;
    handle: string;
    metadata: Record<string, any> | null;
    created_at: string;
    updated_at: string;
}

export interface MedusaCategory {
    id: string;
    name: string;
    handle: string;
    description: string | null;
    parent_category: MedusaCategory | null;
    parent_category_id: string | null;
    category_children: MedusaCategory[];
    metadata: Record<string, any> | null;
}

export interface MedusaTag {
    id: string;
    value: string;
}

export interface MedusaCart {
    id: string;
    items: MedusaLineItem[];
    region_id: string;
    subtotal: number;
    tax_total: number;
    shipping_total: number;
    discount_total: number;
    total: number;
}

export interface MedusaLineItem {
    id: string;
    title: string;
    description: string | null;
    thumbnail: string | null;
    quantity: number;
    unit_price: number;
    subtotal: number;
    total: number;
    variant_id: string;
    variant: MedusaVariant;
}

export interface MedusaCustomer {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string | null;
    has_account: boolean;
    created_at: string;
    updated_at: string;
}

export interface MedusaOrder {
    id: string;
    display_id: number;
    status: string;
    fulfillment_status: string;
    payment_status: string;
    items: MedusaLineItem[];
    subtotal: number;
    tax_total: number;
    shipping_total: number;
    total: number;
    created_at: string;
    updated_at: string;
}

export interface MedusaRegion {
    id: string;
    name: string;
    currency_code: string;
    tax_rate: number;
    countries: { iso_2: string; display_name: string }[];
}
