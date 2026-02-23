"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, Package, ChevronDown, Zap } from "lucide-react";
import { useCartStore, useCartItemCount } from "@/lib/store/cart-store";

const CATEGORY_NAV = [
    { label: "Today's Deals", href: "/products?sale=true" },
    { label: "New Arrivals", href: "/collections/new-arrivals" },
    { label: "Gift Guides", href: "/collections/gift-guides" },
    { label: "Support", href: "/help" },
];

const CATEGORIES_DROPDOWN = [
    { label: "Keyboards", href: "/collections/keyboards" },
    { label: "Mice", href: "/collections/mice" },
    { label: "Headsets", href: "/collections/headsets" },
    { label: "Monitors", href: "/collections/monitors" },
    { label: "Cables & Accessories", href: "/collections/accessories" },
    { label: "Controllers", href: "/collections/controllers" },
    { label: "Chairs", href: "/collections/chairs" },
];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [catOpen, setCatOpen] = useState(false);
    const { openCart } = useCartStore();
    const cartCount = useCartItemCount();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) window.location.href = `/products?q=${encodeURIComponent(searchQuery)}`;
    };

    return (
        <header style={{ position: "sticky", top: 0, zIndex: 50, width: "100%" }}>

            {/* ── Announcement Bar ── */}
            <div style={{
                background: "#0A0F1E",
                borderBottom: "1px solid #1F2937",
                textAlign: "center",
                padding: "7px 16px",
                fontSize: 13,
                fontWeight: 600,
                color: "#9CA3AF",
                letterSpacing: "0.02em",
            }}>
                🛒{" "}
                <span style={{
                    background: "linear-gradient(90deg, #7B2FFF, #00D4FF)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>
                    FREE WORLDWIDE SHIPPING ON ORDERS OVER ₹999 | USE CODE: NAMANENT20
                </span>
            </div>

            {/* ── ROW 1: Logo | Search | Account / Orders / Cart ── */}
            <div style={{
                background: "rgba(10,15,30,0.98)",
                backdropFilter: "blur(20px)",
                borderBottom: "1px solid #1F2937",
                padding: "0 48px",
            }}>
                <div style={{
                    maxWidth: 1440, margin: "0 auto",
                    display: "flex", alignItems: "center",
                    height: 64, gap: 20,
                }}>
                    {/* Logo */}
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
                        <Zap size={22} color="#00D4FF" fill="#00D4FF" />
                        <span style={{
                            fontSize: 20, fontWeight: 800, color: "#F9FAFB",
                            fontFamily: "Space Grotesk, sans-serif", letterSpacing: "-0.03em",
                        }}>
                            Naman<span style={{ color: "#00D4FF" }}>Ent</span>
                        </span>
                    </Link>

                    {/* Search Bar — full width center */}
                    <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 640, margin: "0 24px", position: "relative" }}>
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for keyboards, mice, monitors..."
                            style={{
                                width: "100%", height: 42, padding: "0 52px 0 16px",
                                borderRadius: 8,
                                background: "#1F2937", border: "1px solid #374151",
                                color: "#F9FAFB", fontSize: 14, outline: "none",
                                fontFamily: "Inter, sans-serif",
                                boxSizing: "border-box",
                            }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = "#00D4FF"; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = "#374151"; }}
                        />
                        <button type="submit" style={{
                            position: "absolute", right: 0, top: 0, height: "100%",
                            width: 44, background: "#00D4FF", border: "none",
                            borderRadius: "0 8px 8px 0", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#0A0F1E",
                        }}>
                            <Search size={17} />
                        </button>
                    </form>

                    {/* Right: Account / Orders / Cart */}
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto", flexShrink: 0 }}>
                        {/* Account */}
                        <Link href="/account" style={{
                            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                            padding: "6px 14px", textDecoration: "none", color: "#9CA3AF",
                            borderRadius: 8, transition: "color 0.2s ease",
                        }}
                            className="icon-btn-labeled"
                        >
                            <User size={20} strokeWidth={1.5} />
                            <span style={{ fontSize: 11, fontWeight: 500 }}>Account</span>
                        </Link>

                        {/* Orders */}
                        <Link href="/orders" style={{
                            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                            padding: "6px 14px", textDecoration: "none", color: "#9CA3AF",
                            borderRadius: 8, transition: "color 0.2s ease",
                        }}
                            className="icon-btn-labeled"
                        >
                            <Package size={20} strokeWidth={1.5} />
                            <span style={{ fontSize: 11, fontWeight: 500 }}>Orders</span>
                        </Link>

                        {/* Cart */}
                        <button onClick={openCart} style={{
                            position: "relative",
                            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                            padding: "6px 14px", background: "none", border: "none",
                            color: "#9CA3AF", cursor: "pointer", borderRadius: 8,
                        }}
                            className="icon-btn-labeled"
                            aria-label="Open cart"
                        >
                            <ShoppingBag size={20} strokeWidth={1.5} />
                            <span style={{ fontSize: 11, fontWeight: 500 }}>Cart</span>
                            {/* Badge */}
                            <span style={{
                                position: "absolute", top: 2, right: 8,
                                background: "#00D4FF", color: "#0A0F1E",
                                fontSize: 10, fontWeight: 800,
                                width: 18, height: 18, borderRadius: "50%",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                {cartCount > 9 ? "9+" : cartCount}
                            </span>
                        </button>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            style={{
                                display: "none", // hidden on desktop via CSS
                                background: "none", border: "none",
                                color: "#F9FAFB", cursor: "pointer", padding: 8,
                            }}
                            className="mobile-hamburger"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── ROW 2: Shop By Category | Today's Deals | New Arrivals | Gift Guides | Support ── */}
            <div style={{
                background: "rgba(8,12,24,0.98)",
                backdropFilter: "blur(20px)",
                borderBottom: "1px solid #1F2937",
                padding: "0 48px",
            }}>
                <div style={{
                    maxWidth: 1440, margin: "0 auto",
                    display: "flex", alignItems: "center",
                    height: 44, gap: 0,
                }}>
                    {/* Shop By Category dropdown trigger */}
                    <div style={{ position: "relative" }}>
                        <button
                            onClick={() => setCatOpen(!catOpen)}
                            style={{
                                display: "flex", alignItems: "center", gap: 8,
                                background: "none", border: "none", cursor: "pointer",
                                padding: "0 20px 0 0", height: 44,
                                color: "#00D4FF", fontWeight: 700, fontSize: 14,
                                fontFamily: "Space Grotesk, sans-serif",
                            }}
                        >
                            <Menu size={18} style={{ marginRight: 2 }} />
                            Shop By Category
                            <ChevronDown size={14} style={{ marginLeft: 2, transform: catOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                        </button>

                        {/* Dropdown */}
                        {catOpen && (
                            <div style={{
                                position: "absolute", top: "100%", left: 0, zIndex: 100,
                                background: "#111827", border: "1px solid #374151",
                                borderRadius: 10, padding: "8px 0", minWidth: 220,
                                boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                            }}>
                                {CATEGORIES_DROPDOWN.map(cat => (
                                    <Link key={cat.href} href={cat.href}
                                        onClick={() => setCatOpen(false)}
                                        style={{
                                            display: "block", padding: "9px 18px",
                                            fontSize: 14, color: "#9CA3AF", textDecoration: "none",
                                            transition: "all 0.15s ease",
                                        }}
                                        className="footer-link"
                                    >
                                        {cat.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div style={{ width: 1, height: 20, background: "#374151", margin: "0 16px" }} />

                    {/* Nav links */}
                    <nav style={{ display: "flex", alignItems: "center", gap: 0 }}>
                        {CATEGORY_NAV.map(link => (
                            <Link key={link.href} href={link.href}
                                className="nav-link"
                                style={{
                                    padding: "0 16px", height: 44,
                                    display: "flex", alignItems: "center",
                                    fontSize: 14, fontWeight: 500,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* ── Mobile Menu ── */}
            {mobileMenuOpen && (
                <div style={{
                    background: "#111827", borderBottom: "1px solid #374151",
                    padding: "16px 20px", display: "flex", flexDirection: "column", gap: 4,
                }}>
                    {[...CATEGORIES_DROPDOWN, ...CATEGORY_NAV].map(link => (
                        <Link key={link.href} href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            style={{
                                padding: "10px 16px", borderRadius: 8, fontSize: 14,
                                fontWeight: 500, color: "#9CA3AF", textDecoration: "none",
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
}
