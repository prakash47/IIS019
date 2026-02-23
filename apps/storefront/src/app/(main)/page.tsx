import Link from "next/link";
import { Suspense } from "react";
import { Zap, Truck, RotateCcw, ShieldCheck, Headphones, Star, ArrowRight } from "lucide-react";
import { getProducts } from "@/lib/medusa/queries/products";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
    { label: "All", href: "/products", active: true },
    { label: "Buds", href: "/collections/buds" },
    { label: "Cables", href: "/collections/cables" },
    { label: "Collection", href: "/collections" },
    { label: "Mouse", href: "/collections/mice" },
    { label: "Keyboard", href: "/collections/keyboards" },
    { label: "Headsets", href: "/collections/headsets" },
    { label: "Monitors", href: "/collections/monitors" },
];

const TRUST_BADGES = [
    { icon: Truck, title: "Free Delivery", desc: "On orders above ₹999" },
    { icon: RotateCcw, title: "Easy Returns", desc: "30-day hassle-free returns" },
    { icon: ShieldCheck, title: "Secure Payment", desc: "256-bit SSL encryption" },
    { icon: Headphones, title: "24/7 Premium", desc: "Round-the-clock support" },
];

const TESTIMONIALS = [
    {
        text: "Absolutely incredible quality and lightning-fast delivery. Naman Ent is my go-to for all gaming peripherals. Couldn't be happier.",
        name: "Rahul Sharma", role: "Pro Gamer", rating: 5, avatar: "RS",
        color: "linear-gradient(135deg,#00D4FF,#7B2FFF)",
    },
    {
        text: "The keyboard I ordered is beyond perfect. Build quality, RGB, switches — everything is top-tier. Will order again!",
        name: "Priya Patel", role: "Streamer", rating: 5, avatar: "PP",
        color: "linear-gradient(135deg,#7B2FFF,#00D4FF)",
    },
    {
        text: "Best prices in India for premium gear. Support team is super responsive. Highly recommend to every gamer.",
        name: "Arjun Nair", role: "Esports Player", rating: 5, avatar: "AN",
        color: "linear-gradient(135deg,#00D4FF,#10B981)",
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatPrice(amount: number, currency = "INR") {
    return new Intl.NumberFormat("en-IN", {
        style: "currency", currency: currency.toUpperCase(),
        minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(amount / 100);
}

// ─── Product Card ─────────────────────────────────────────────────────────────
// NOTE: uses CSS class for hover — NO event handlers (RSC safe)
function ProductCard({
    title, price, originalPrice, imageSrc, badge, href, rating = 4,
    imageLabel,
}: {
    title: string; price: string; originalPrice?: string;
    imageSrc?: string; badge?: { label: string; color: string };
    href: string; rating?: number; imageLabel?: string;
}) {
    return (
        <Link href={href} style={{ textDecoration: "none", display: "block" }}>
            <div className="home-product-card" style={{
                background: "#111827",
                border: "1px solid #374151",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 4px 24px rgba(0,212,255,0.07)",
            }}>
                {/* Image — white/light bg exactly like design */}
                <div style={{
                    position: "relative",
                    background: "#F8FAFC",
                    height: 180,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                }}>
                    {badge && (
                        <span style={{
                            position: "absolute", top: 10, left: 10, zIndex: 1,
                            background: badge.color, color: badge.color === "#00D4FF" || badge.color === "#F59E0B" ? "#0A0F1E" : "#fff",
                            fontSize: 10, fontWeight: 800, padding: "3px 10px",
                            borderRadius: 999, letterSpacing: "0.06em",
                        }}>{badge.label}</span>
                    )}
                    {imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageSrc} alt={title}
                            style={{ width: "100%", height: "100%", objectFit: "contain", padding: 16 }} />
                    ) : (
                        <div style={{
                            width: "100%", height: "100%",
                            display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center",
                            background: "#F1F5F9", gap: 6,
                        }}>
                            <div style={{
                                width: 64, height: 64, borderRadius: 12,
                                background: "#E2E8F0",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <span style={{ fontSize: 28, opacity: 0.4 }}>📦</span>
                            </div>
                            {imageLabel && <span style={{ fontSize: 11, color: "#94A3B8" }}>{imageLabel}</span>}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div style={{ padding: "12px 14px 14px" }}>
                    {/* Stars */}
                    <div style={{ display: "flex", gap: 2, marginBottom: 6 }}>
                        {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={11} fill={s <= rating ? "#F59E0B" : "transparent"} color={s <= rating ? "#F59E0B" : "#374151"} />
                        ))}
                    </div>
                    {/* Title */}
                    <p style={{
                        fontSize: 13, fontWeight: 600, color: "#F9FAFB",
                        fontFamily: "Space Grotesk, sans-serif",
                        marginBottom: 8, lineHeight: 1.4,
                        display: "-webkit-box", WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>{title}</p>
                    {/* Price row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 15, fontWeight: 700, color: "#00D4FF" }}>{price}</span>
                            {originalPrice && (
                                <span style={{ fontSize: 11, color: "#9CA3AF", textDecoration: "line-through" }}>
                                    {originalPrice}
                                </span>
                            )}
                        </div>
                        <div style={{
                            width: 28, height: 28, borderRadius: 7,
                            background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.25)",
                            display: "flex", alignItems: "center", justifyContent: "center", color: "#00D4FF",
                        }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

// ─── New Arrivals Card (gradient top placeholder) ──────────────────────────────
function NewArrivalCard({
    title, subtitle, price, href, gradientFrom = "#00D4FF", gradientTo = "#7B2FFF",
    badge, rating = 4,
}: {
    title: string; subtitle?: string; price: string; href: string;
    gradientFrom?: string; gradientTo?: string;
    badge?: { label: string; color: string }; rating?: number;
}) {
    return (
        <Link href={href} style={{ textDecoration: "none", display: "block" }}>
            <div className="home-product-card" style={{
                background: "#111827", border: "1px solid #374151",
                borderRadius: 16, overflow: "hidden",
                boxShadow: "0 4px 24px rgba(0,212,255,0.07)",
            }}>
                {/* Gradient top area */}
                <div style={{
                    position: "relative",
                    background: `linear-gradient(135deg, ${gradientFrom}22 0%, ${gradientTo}22 100%)`,
                    height: 160, display: "flex", alignItems: "center", justifyContent: "center",
                    borderBottom: `1px solid ${gradientFrom}22`,
                }}>
                    {badge && (
                        <span style={{
                            position: "absolute", top: 10, left: 10,
                            background: badge.color, color: "#0A0F1E",
                            fontSize: 10, fontWeight: 800, padding: "3px 10px",
                            borderRadius: 999, letterSpacing: "0.06em",
                        }}>{badge.label}</span>
                    )}
                    <div style={{
                        width: 72, height: 72, borderRadius: 16,
                        background: `linear-gradient(135deg, ${gradientFrom}33, ${gradientTo}33)`,
                        border: `1px solid ${gradientFrom}44`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                            opacity: 0.7,
                        }} />
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: "12px 14px 14px" }}>
                    <div style={{ display: "flex", gap: 2, marginBottom: 5 }}>
                        {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={11} fill={s <= rating ? "#F59E0B" : "transparent"} color={s <= rating ? "#F59E0B" : "#374151"} />
                        ))}
                    </div>
                    <p style={{
                        fontSize: 13, fontWeight: 600, color: "#F9FAFB",
                        fontFamily: "Space Grotesk, sans-serif", marginBottom: 4, lineHeight: 1.4,
                    }}>{title}</p>
                    {subtitle && <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 8 }}>{subtitle}</p>}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: "#00D4FF" }}>{price}</span>
                        <div style={{
                            width: 28, height: 28, borderRadius: 7,
                            background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.25)",
                            display: "flex", alignItems: "center", justifyContent: "center", color: "#00D4FF",
                        }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, linkHref = "/products", center = false }: {
    title: string; linkHref?: string; center?: boolean;
}) {
    if (center) {
        return (
            <div style={{ textAlign: "center", marginBottom: 40 }}>
                <h2 style={{
                    fontSize: 30, fontWeight: 700, color: "#F9FAFB",
                    fontFamily: "Space Grotesk, sans-serif", letterSpacing: "-0.02em", margin: 0,
                }}>{title}</h2>
            </div>
        );
    }
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 4, height: 26, background: "linear-gradient(135deg, #00D4FF, #7B2FFF)", borderRadius: 2 }} />
                <h2 style={{
                    fontSize: 24, fontWeight: 700, color: "#F9FAFB",
                    fontFamily: "Space Grotesk, sans-serif", letterSpacing: "-0.02em", margin: 0
                }}>
                    {title}
                </h2>
            </div>
            {linkHref && (
                <Link href={linkHref} className="section-link">
                    See All <ArrowRight size={14} />
                </Link>
            )}
        </div>
    );
}

// ─── Top Picks from Medusa ────────────────────────────────────────────────────
async function TopPicksGrid() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let products: any[] = [];
    try {
        const res = await getProducts({ limit: 4 });
        products = res.products;
    } catch { /* backend offline */ }

    const PLACEHOLDERS = [
        { title: "Gaming Keyboard Pro X", badge: { label: "NEW", color: "#00D4FF" }, price: "₹8,999", orig: "₹12,999" },
        { title: "Precision Mouse Elite", badge: undefined, price: "₹4,499" },
        { title: "7.1 Surround Headset", badge: { label: "SALE", color: "#EF4444" }, price: "₹5,999", orig: "₹8,499" },
        { title: "4K Gaming Monitor", badge: undefined, price: "₹32,999", orig: "₹38,999" },
    ];

    const items = products.length > 0 ? products : null;

    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
            {items ? items.map((p: any, i: number) => {
                const price = p.variants?.[0]?.calculated_price;
                return (
                    <ProductCard
                        key={p.id}
                        title={p.title}
                        price={price?.calculated_amount ? formatPrice(price.calculated_amount, price.currency_code) : "₹—"}
                        originalPrice={price?.original_amount && price.original_amount > (price.calculated_amount ?? 0)
                            ? formatPrice(price.original_amount, price.currency_code) : undefined}
                        imageSrc={p.thumbnail || p.images?.[0]?.url}
                        badge={i === 0 ? { label: "NEW", color: "#00D4FF" } : i === 2 ? { label: "SALE", color: "#EF4444" } : undefined}
                        href={`/products/${p.handle}`}
                    />
                );
            }) : PLACEHOLDERS.map((p, i) => (
                <ProductCard key={i} title={p.title} price={p.price}
                    originalPrice={p.orig} badge={p.badge} href="/products" />
            ))}
        </div>
    );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default async function HomePage() {
    return (
        <div style={{ background: "#0A0F1E", minHeight: "100vh" }}>

            {/* ════════════════════ HERO ════════════════════ */}
            <section style={{ background: "#0A0F1E", padding: "24px 0 0" }}>
                <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 48px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, alignItems: "stretch" }}>

                        {/* ── Left: Large hero card with warm gradient + keyboard ── */}
                        <div style={{
                            position: "relative", borderRadius: 20, overflow: "hidden",
                            background: "linear-gradient(135deg, #1a0e00 0%, #3d1f00 30%, #c47a2e 70%, #e8a045 100%)",
                            minHeight: 420, display: "flex", alignItems: "flex-end",
                        }}>
                            {/* Dark overlay left side for text readability */}
                            <div style={{
                                position: "absolute", inset: 0,
                                background: "linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.05) 100%)",
                            }} />

                            {/* Keyboard image — right side overlay */}
                            <div style={{
                                position: "absolute", right: -20, top: "50%", transform: "translateY(-50%)",
                                width: "58%", height: "95%",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 110, opacity: 0.75,
                                filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.6))",
                            }}>⌨️</div>

                            {/* Text content — bottom left */}
                            <div style={{ position: "relative", padding: "0 44px 40px", zIndex: 1, maxWidth: 420 }}>
                                {/* LATEST RELEASES badge */}
                                <div style={{
                                    display: "inline-flex", alignItems: "center",
                                    background: "linear-gradient(135deg, #7B2FFF, #5B8FFF)",
                                    borderRadius: 999, padding: "5px 14px", marginBottom: 18,
                                }}>
                                    <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: "0.1em" }}>
                                        LATEST RELEASES
                                    </span>
                                </div>

                                <h1 style={{
                                    fontSize: "clamp(30px, 3.2vw, 46px)", fontWeight: 700, color: "#F9FAFB",
                                    lineHeight: 1.1, letterSpacing: "-1px",
                                    fontFamily: "Space Grotesk, sans-serif",
                                    margin: "0 0 12px 0",
                                }}>
                                    Build The Setup You<br />
                                    <span style={{ color: "#00D4FF" }}>Deserve</span>
                                </h1>

                                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.65, marginBottom: 28 }}>
                                    Experience the pinnacle of performance with<br />hand-curated hardware.
                                </p>

                                <div style={{ display: "flex", gap: 12 }}>
                                    <Link href="/collections/keyboards" style={{
                                        background: "#00D4FF", color: "#0A0F1E",
                                        fontWeight: 700, fontSize: 14, padding: "12px 22px",
                                        borderRadius: 8, textDecoration: "none",
                                        display: "inline-flex", alignItems: "center",
                                    }}>
                                        Shop Keyboards
                                    </Link>
                                    <Link href="/products" style={{
                                        background: "rgba(255,255,255,0.1)",
                                        backdropFilter: "blur(8px)",
                                        border: "1px solid rgba(255,255,255,0.2)",
                                        color: "#F9FAFB", fontWeight: 600, fontSize: 14,
                                        padding: "12px 22px", borderRadius: 8, textDecoration: "none",
                                        display: "inline-flex", alignItems: "center",
                                    }}>
                                        View Deals
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* ── Right: 2 stacked product mini-cards ── */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {/* Pro Mice card */}
                            <div style={{
                                flex: 1, background: "#111827",
                                border: "1px solid #1F2937", borderRadius: 16,
                                padding: "24px 20px", position: "relative", overflow: "hidden",
                                minHeight: 195,
                            }}>
                                <div style={{ fontSize: 16, fontWeight: 700, color: "#F9FAFB", fontFamily: "Space Grotesk, sans-serif", marginBottom: 4 }}>
                                    Pro Mice
                                </div>
                                <div style={{ fontSize: 13, color: "#00D4FF", fontWeight: 600, marginBottom: 8 }}>
                                    Starting from ₹4,999
                                </div>
                                <Link href="/collections/mice" style={{
                                    fontSize: 11, fontWeight: 700, color: "#9CA3AF",
                                    textDecoration: "none", letterSpacing: "0.08em",
                                }}>
                                    SHOP NOW →
                                </Link>
                                <div style={{
                                    position: "absolute", right: 12, bottom: 8,
                                    fontSize: 64, opacity: 0.9,
                                }}>🖱️</div>
                            </div>

                            {/* Custom Cables card */}
                            <div style={{
                                flex: 1,
                                background: "linear-gradient(135deg, #130a2a 0%, #1a0f3a 100%)",
                                border: "1px solid rgba(123,47,255,0.2)", borderRadius: 16,
                                padding: "24px 20px", position: "relative", overflow: "hidden",
                                minHeight: 195,
                            }}>
                                <div style={{ fontSize: 16, fontWeight: 700, color: "#F9FAFB", fontFamily: "Space Grotesk, sans-serif", marginBottom: 4 }}>
                                    Custom Cables
                                </div>
                                <div style={{ fontSize: 13, color: "#F59E0B", fontWeight: 600, marginBottom: 8 }}>
                                    Flash Sale: 20% Off
                                </div>
                                <Link href="/collections/cables" style={{
                                    fontSize: 11, fontWeight: 700, color: "#9CA3AF",
                                    textDecoration: "none", letterSpacing: "0.08em",
                                }}>
                                    VIEW ALL →
                                </Link>
                                <div style={{
                                    position: "absolute", right: 16, bottom: 16,
                                    background: "rgba(123,47,255,0.15)",
                                    border: "1px solid rgba(123,47,255,0.4)",
                                    borderRadius: 10, padding: "12px 20px",
                                    fontSize: 20, fontWeight: 800, color: "#7B2FFF",
                                    fontFamily: "Space Grotesk, sans-serif",
                                }}>
                                    Cables
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ════════════════════ CATEGORY PILLS ════════════════════ */}
            <section style={{ borderBottom: "1px solid #1F2937", padding: "14px 0" }}>
                <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 48px" }}>
                    <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
                        {CATEGORIES.map((cat) => (
                            <Link key={cat.label} href={cat.href}
                                className={`cat-pill${cat.active ? " cat-pill-active" : ""}`}
                                style={{ flexShrink: 0 }}>
                                {cat.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>


            {/* ════════════════════ TODAY'S TOP PICKS ════════════════════ */}
            <section style={{ padding: "56px 0" }}>
                <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 80px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 4, height: 26, background: "linear-gradient(135deg, #00D4FF, #7B2FFF)", borderRadius: 2 }} />
                            <h2 style={{
                                fontSize: 24, fontWeight: 700, color: "#F9FAFB",
                                fontFamily: "Space Grotesk, sans-serif", letterSpacing: "-0.02em", margin: 0
                            }}>
                                Today&apos;s Top Picks
                            </h2>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            {/* filter hint badges */}
                            {["New", "Trending", "Sale"].map(f => (
                                <span key={f} style={{
                                    fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 999,
                                    background: "rgba(255,255,255,0.05)", border: "1px solid #374151",
                                    color: "#9CA3AF", cursor: "pointer",
                                }}>{f}</span>
                            ))}
                            <Link href="/products" className="section-link" style={{ marginLeft: 8 }}>
                                See All <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>

                    <Suspense fallback={
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} style={{ height: 300, borderRadius: 16, background: "#111827" }} className="animate-shimmer" />
                            ))}
                        </div>
                    }>
                        <TopPicksGrid />
                    </Suspense>
                </div>
            </section>

            {/* ════════════════════ FLASH SALE BANNER ════════════════════ */}
            <section style={{ padding: "0 0 56px" }}>
                <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 80px" }}>
                    <div style={{
                        background: "linear-gradient(90deg, #00D4FF 0%, #7B2FFF 100%)",
                        borderRadius: 16, padding: "24px 36px",
                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
                        boxShadow: "0 8px 32px rgba(0,212,255,0.2)",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: 12,
                                background: "rgba(10,15,30,0.25)", backdropFilter: "blur(8px)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <Zap size={24} color="#0A0F1E" fill="#0A0F1E" />
                            </div>
                            <div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: "#0A0F1E", fontFamily: "Space Grotesk, sans-serif", lineHeight: 1 }}>
                                    ⚡ FLASH SALE
                                </div>
                                <div style={{ fontSize: 13, color: "rgba(10,15,30,0.65)", fontWeight: 500, marginTop: 4 }}>
                                    Up to 60% OFF on Selected Peripherals
                                </div>
                            </div>
                        </div>
                        <Link href="/products" className="btn-flash-cta" style={{ fontSize: 13, padding: "12px 24px" }}>
                            Shop The Deals <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ════════════════════ BRAND SECTION ════════════════════ */}
            <section style={{ padding: "0 0 56px" }}>
                <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 80px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                        {/* RAZER */}
                        <div style={{
                            background: "linear-gradient(135deg, #0d1a0d 0%, #111827 100%)",
                            border: "1px solid #1a2e1a",
                            borderRadius: 16, height: 200,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            position: "relative", overflow: "hidden",
                        }}>
                            <div style={{
                                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                                width: 280, height: 280, borderRadius: "50%",
                                background: "radial-gradient(circle, rgba(0,255,100,0.06) 0%, transparent 70%)",
                            }} />
                            <div style={{ textAlign: "center", position: "relative" }}>
                                <div style={{
                                    fontSize: 36, fontWeight: 900, letterSpacing: "-1px",
                                    fontFamily: "Space Grotesk, sans-serif",
                                    background: "linear-gradient(135deg, #00FF41, #00CC33)",
                                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                                }}>RAZER</div>
                                <div style={{ fontSize: 11, color: "#374151", marginTop: 4, letterSpacing: "0.1em" }}>FOR GAMERS. BY GAMERS.</div>
                            </div>
                        </div>

                        {/* CORSAIR */}
                        <div style={{
                            background: "linear-gradient(135deg, #1a0a0a 0%, #111827 100%)",
                            border: "1px solid #2e1a1a",
                            borderRadius: 16, height: 200,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            position: "relative", overflow: "hidden",
                        }}>
                            <div style={{
                                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                                width: 280, height: 280, borderRadius: "50%",
                                background: "radial-gradient(circle, rgba(255,50,50,0.06) 0%, transparent 70%)",
                            }} />
                            <div style={{ textAlign: "center", position: "relative" }}>
                                <div style={{
                                    fontSize: 32, fontWeight: 900, letterSpacing: "2px",
                                    fontFamily: "Space Grotesk, sans-serif",
                                    background: "linear-gradient(135deg, #FF6B6B, #FF0000)",
                                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                                }}>CORSAIR</div>
                                <div style={{ fontSize: 11, color: "#374151", marginTop: 4, letterSpacing: "0.1em" }}>IMPOSSIBLE MADE POSSIBLE.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════ NEW ARRIVALS ════════════════════ */}
            <section style={{ padding: "0 0 64px" }}>
                <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 80px" }}>
                    <SectionHeader title="New Arrivals" center />

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
                        {[
                            { title: "Product Name 1", subtitle: "Description text 1", price: "₹2,999", from: "#00D4FF", to: "#0066FF" },
                            { title: "Product Name 2", subtitle: "Description text 2", price: "₹1,999", from: "#7B2FFF", to: "#FF2FBF" },
                            { title: "Product Name 3", subtitle: "Description text 3", price: "₹4,499", from: "#00D4FF", to: "#7B2FFF" },
                            { title: "Product Name 4", subtitle: "Description text 4", price: "₹3,199", from: "#FF6B2F", to: "#FF2F2F" },
                        ].map((p, i) => (
                            <NewArrivalCard
                                key={i} title={p.title} subtitle={p.subtitle} price={p.price}
                                href="/products"
                                gradientFrom={p.from} gradientTo={p.to}
                                badge={{ label: "NEW", color: "#00D4FF" }}
                            />
                        ))}
                    </div>

                    {/* Second row */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginTop: 18 }}>
                        {[
                            { title: "Place Item 1", subtitle: "Featured text 1", price: "₹1,499", from: "#10B981", to: "#00D4FF" },
                            { title: "Place Item 2", subtitle: "Featured text 2", price: "₹5,999", from: "#7B2FFF", to: "#00D4FF" },
                            { title: "Place Item 3", subtitle: "Featured text 3", price: "₹3,799", from: "#FF6B2F", to: "#7B2FFF" },
                            { title: "Place Item 4", subtitle: "Featured text 4", price: "₹2,499", from: "#00D4FF", to: "#10B981" },
                        ].map((p, i) => (
                            <NewArrivalCard
                                key={i} title={p.title} subtitle={p.subtitle} price={p.price}
                                href="/products"
                                gradientFrom={p.from} gradientTo={p.to}
                                badge={{ label: "NEW", color: "#00D4FF" }}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════ TRUST BADGES ════════════════════ */}
            <section style={{ padding: "0 0 64px" }}>
                <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 80px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
                        {TRUST_BADGES.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="hover-card-cyan" style={{
                                background: "#111827", border: "1px solid #1F2937",
                                borderRadius: 16, padding: "24px 20px",
                                display: "flex", flexDirection: "column", alignItems: "center",
                                textAlign: "center", gap: 10,
                            }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: 12,
                                    background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.15)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <Icon size={22} color="#00D4FF" />
                                </div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#F9FAFB", fontFamily: "Space Grotesk, sans-serif" }}>
                                    {title}
                                </div>
                                <div style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.5 }}>{desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════ TESTIMONIALS ════════════════════ */}
            <section style={{ padding: "0 0 64px" }}>
                <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 80px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
                        {TESTIMONIALS.map(t => (
                            <div key={t.name} className="hover-card-cyan" style={{
                                background: "#111827", border: "1px solid #1F2937",
                                borderRadius: 16, padding: "24px",
                            }}>
                                <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} size={13} fill="#F59E0B" color="#F59E0B" />
                                    ))}
                                </div>
                                <p style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 1.7, marginBottom: 20 }}>
                                    &ldquo;{t.text}&rdquo;
                                </p>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{
                                        width: 38, height: 38, borderRadius: "50%",
                                        background: t.color, flexShrink: 0,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 12, fontWeight: 800, color: "#0A0F1E",
                                    }}>{t.avatar}</div>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: "#F9FAFB" }}>{t.name}</div>
                                        <div style={{ fontSize: 11, color: "#9CA3AF" }}>{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════ JOIN INNER CIRCLE ════════════════════ */}
            <section style={{ padding: "0 0 80px" }}>
                <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 80px" }}>
                    <div style={{
                        background: "linear-gradient(135deg, #0e0626 0%, #130a2a 50%, #0a0f1e 100%)",
                        border: "1px solid rgba(123,47,255,0.25)",
                        borderRadius: 20, padding: "56px 48px",
                        textAlign: "center", position: "relative", overflow: "hidden",
                    }}>
                        {/* Purple glow */}
                        <div style={{
                            position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)",
                            width: 400, height: 400, borderRadius: "50%",
                            background: "radial-gradient(circle, rgba(123,47,255,0.2) 0%, transparent 70%)",
                            pointerEvents: "none",
                        }} />
                        <div style={{ position: "relative", maxWidth: 500, margin: "0 auto" }}>
                            <h2 style={{
                                fontSize: 32, fontWeight: 700, color: "#F9FAFB",
                                fontFamily: "Space Grotesk, sans-serif", letterSpacing: "-0.02em",
                                marginBottom: 12,
                            }}>Join the Inner Circle</h2>
                            <p style={{ fontSize: 14, color: "#9CA3AF", lineHeight: 1.7, marginBottom: 28 }}>
                                Get exclusive access to drops, deals, and gaming insights.<br />
                                Join 50,000+ members already subscribed.
                            </p>
                            <form action="#" style={{ display: "flex", gap: 10, maxWidth: 380, margin: "0 auto" }}>
                                <input type="email" placeholder="Enter your email address" required style={{
                                    flex: 1, height: 46, padding: "0 16px", borderRadius: 10,
                                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(123,47,255,0.3)",
                                    color: "#F9FAFB", fontSize: 13, outline: "none",
                                }} />
                                <button type="submit" style={{
                                    background: "linear-gradient(135deg, #7B2FFF, #00D4FF)",
                                    color: "#0A0F1E", fontWeight: 700, fontSize: 13,
                                    padding: "0 20px", borderRadius: 10, border: "none",
                                    cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                                }}>Subscribe Now</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div >
    );
}
