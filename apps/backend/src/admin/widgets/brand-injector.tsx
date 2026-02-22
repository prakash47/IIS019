import { defineWidgetConfig } from "@medusajs/admin-sdk";

// ─── Brand CSS Injector ───────────────────────────────────────────────────────
// Runs on every dashboard page to apply Naman Enterprises accent colors
const BrandInjector = () => {
    return null; // renders nothing, all work done via global.css
};

export const config = defineWidgetConfig({
    zone: "product.list.before",
});

export default BrandInjector;
