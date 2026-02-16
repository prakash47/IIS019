export const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Collections", href: "/collections" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = {
    shop: {
        title: "Shop",
        links: [
            { label: "All Products", href: "/products" },
            { label: "Collections", href: "/collections" },
            { label: "New Arrivals", href: "/products?sort=newest" },
            { label: "Sale", href: "/products?on_sale=true" },
        ],
    },
    company: {
        title: "Company",
        links: [
            { label: "About Us", href: "/about" },
            { label: "Contact", href: "/contact" },
            { label: "FAQ", href: "/faq" },
            { label: "Careers", href: "/about#careers" },
        ],
    },
    support: {
        title: "Support",
        links: [
            { label: "Shipping & Returns", href: "/shipping-returns" },
            { label: "Privacy Policy", href: "/privacy-policy" },
            { label: "Terms of Service", href: "/terms" },
            { label: "Track Order", href: "/account/orders" },
        ],
    },
} as const;

export type NavLink = (typeof NAV_LINKS)[number];
