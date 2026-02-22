import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartDrawer } from "@/components/commerce/CartDrawer";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    ),
    title: {
        default: "Naman Ent — Premium Ecommerce Store",
        template: "%s | Naman Ent",
    },
    description:
        "Discover premium products at Naman Ent. Shop the latest collections with free shipping on orders above ₹999. Quality guaranteed.",
    keywords: [
        "ecommerce",
        "online store",
        "Naman Ent",
        "premium products",
        "shop online",
    ],
    authors: [{ name: "Naman Ent" }],
    creator: "Naman Ent",
    publisher: "Naman Ent",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        siteName: "Naman Ent",
        title: "Naman Ent — Premium Ecommerce Store",
        description:
            "Discover premium products at Naman Ent. Shop the latest collections with free shipping on orders above ₹999.",
    },
    twitter: {
        card: "summary_large_image",
        title: "Naman Ent — Premium Ecommerce Store",
        description:
            "Discover premium products at Naman Ent. Shop the latest collections with free shipping on orders above ₹999.",
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
    ],
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
            <body className="min-h-screen flex flex-col font-sans antialiased">
                <OrganizationJsonLd />
                <WebsiteJsonLd />
                <Header />
                <CartDrawer />
                <ToastContainer />
                <main className="flex-1">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
