"use client";

import Link from "next/link";

import { Mail, MapPin, Phone, Twitter, Instagram, Youtube, Github } from "lucide-react";

const FOOTER_LINKS = {
    shop: {
        title: "Quick Links",
        links: [
            { label: "All Products", href: "/products" },
            { label: "New Arrivals", href: "/collections/new-arrivals" },
            { label: "Best Sellers", href: "/collections/best-sellers" },
            { label: "Flash Sale", href: "/products?sale=true" },
            { label: "Collections", href: "/collections" },
        ],
    },
    support: {
        title: "Support",
        links: [
            { label: "Help Center", href: "/help" },
            { label: "Track Order", href: "/orders" },
            { label: "Returns", href: "/shipping-returns" },
            { label: "Size Guide", href: "/size-guide" },
            { label: "Contact Us", href: "/contact" },
        ],
    },
    company: {
        title: "Company",
        links: [
            { label: "About Us", href: "/about" },
            { label: "Blog", href: "/blog" },
            { label: "Careers", href: "/careers" },
            { label: "Privacy Policy", href: "/privacy-policy" },
            { label: "Terms of Service", href: "/terms" },
        ],
    },
};

const SOCIAL_LINKS = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Github, href: "#", label: "GitHub" },
];

const PAYMENT_METHODS = ["VISA", "MC", "UPI", "GPay", "PhonePe"];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{ background: "#080C18", borderTop: "1px solid #374151" }} role="contentinfo">
            {/* Main footer */}
            <div style={{ maxWidth: 1440, margin: "0 auto", padding: "64px 80px 40px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48 }}>
                    {/* Brand column */}
                    <div>
                        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 16 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 10,
                                background: "linear-gradient(135deg, #00D4FF 0%, #7B2FFF 100%)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontWeight: 800, fontSize: 16, color: "#0A0F1E",
                                fontFamily: "Space Grotesk, sans-serif",
                            }}>N</div>
                            <span style={{
                                fontSize: 20, fontWeight: 700, color: "#F9FAFB",
                                fontFamily: "Space Grotesk, sans-serif", letterSpacing: "-0.02em",
                            }}>
                                Naman<span style={{ color: "#00D4FF" }}>Ent</span>
                            </span>
                        </Link>

                        <p style={{ fontSize: 14, color: "#9CA3AF", lineHeight: 1.7, marginBottom: 24, maxWidth: 280 }}>
                            Your ultimate destination for premium gaming peripherals and accessories. Engineered for performance.
                        </p>

                        {/* Contact info */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {[
                                { icon: Mail, text: "support@namanent.com" },
                                { icon: Phone, text: "+91 98765 43210" },
                                { icon: MapPin, text: "Mumbai, India" },
                            ].map(({ icon: Icon, text }) => (
                                <div key={text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <Icon size={15} color="#00D4FF" />
                                    <span style={{ fontSize: 13, color: "#9CA3AF" }}>{text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Social icons */}
                        <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
                            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    style={{
                                        width: 36, height: 36, borderRadius: 8,
                                        background: "rgba(255,255,255,0.05)", border: "1px solid #374151",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: "#9CA3AF", textDecoration: "none", transition: "all 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = "#00D4FF";
                                        e.currentTarget.style.borderColor = "rgba(0,212,255,0.4)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = "#9CA3AF";
                                        e.currentTarget.style.borderColor = "#374151";
                                    }}
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.values(FOOTER_LINKS).map((section) => (
                        <div key={section.title}>
                            <h3 style={{
                                fontSize: 13, fontWeight: 700, color: "#F9FAFB",
                                textTransform: "uppercase", letterSpacing: "0.08em",
                                marginBottom: 20, fontFamily: "Space Grotesk, sans-serif",
                            }}>
                                {section.title}
                            </h3>
                            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            style={{
                                                fontSize: 14, color: "#9CA3AF", textDecoration: "none",
                                                transition: "color 0.2s ease",
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.color = "#00D4FF"; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.color = "#9CA3AF"; }}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom bar */}
            <div style={{ borderTop: "1px solid #1F2937" }}>
                <div style={{
                    maxWidth: 1440, margin: "0 auto", padding: "20px 80px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                    <p style={{ fontSize: 13, color: "#374151" }}>
                        © {currentYear} Naman Enterprises. All rights reserved.
                    </p>

                    {/* Payment icons */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {PAYMENT_METHODS.map((pm) => (
                            <div key={pm} style={{
                                padding: "5px 10px", borderRadius: 6,
                                background: "#111827", border: "1px solid #374151",
                                fontSize: 11, fontWeight: 700, color: "#9CA3AF",
                            }}>
                                {pm}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
