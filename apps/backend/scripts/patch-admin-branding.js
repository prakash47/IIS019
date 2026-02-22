#!/usr/bin/env node
/**
 * Naman Enterprises — Medusa Admin Branding Patch
 * 
 * Patches @medusajs/dashboard translation files to rebrand the admin UI.
 * This script runs automatically via the "postinstall" hook in package.json
 * so it survives every `pnpm install` and works on all environments (dev + production).
 */

const fs = require("fs");
const path = require("path");

const REPLACEMENTS = [
    { from: "Welcome to Medusa", to: "Welcome to Naman Enterprises" },
    { from: "Sign in to access the account area", to: "Sign in to access the admin portal" },
    { from: "Get started with Medusa Admin right away.", to: "Get started with Naman Enterprises Admin right away." },
    { from: "Start Medusa Admin", to: "Start Naman Enterprises Admin" },
];

const TARGET_FILES = [
    "node_modules/@medusajs/dashboard/src/i18n/translations/en.json",
    "node_modules/@medusajs/dashboard/dist/en.json",
    "node_modules/@medusajs/dashboard/dist/app.js",
];

// Also patch any .mjs chunk that contains the string
const distDir = path.join(__dirname, "..", "node_modules/@medusajs/dashboard/dist");
if (fs.existsSync(distDir)) {
    const chunks = fs.readdirSync(distDir)
        .filter(f => f.endsWith(".mjs") || f.endsWith(".js"))
        .map(f => `node_modules/@medusajs/dashboard/dist/${f}`);
    TARGET_FILES.push(...chunks);
}

let patchedCount = 0;

for (const relPath of TARGET_FILES) {
    const fullPath = path.join(__dirname, "..", relPath);
    if (!fs.existsSync(fullPath)) continue;

    let content = fs.readFileSync(fullPath, "utf8");
    let changed = false;

    for (const { from, to } of REPLACEMENTS) {
        if (content.includes(from)) {
            content = content.split(from).join(to);
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(fullPath, content, "utf8");
        console.log(`✅ Patched: ${relPath}`);
        patchedCount++;
    }
}

console.log(`\n🎉 Naman Enterprises branding applied to ${patchedCount} file(s).`);
