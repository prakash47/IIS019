import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Naman Ent — Premium Ecommerce Store",
        short_name: "Naman Ent",
        description:
            "Discover premium products at Naman Ent. Shop the latest collections.",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#4338ca",
        icons: [
            {
                src: "/icons/icon-192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icons/icon-512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}
