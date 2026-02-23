#!/usr/bin/env node
/**
 * Naman Ent — Medusa v2 Real Product Seed Script
 * Seeds 110+ real computer accessory products across 9 categories
 * Brands: Razer, Corsair, Logitech, SteelSeries, HyperX, ASUS ROG, MSI, Zebronics, Ant Esports, Redgear, etc.
 *
 * Run: node scripts/seed-inventory.js
 */

const BASE_URL = "http://localhost:9000";
const ADMIN_EMAIL = "admin@namanent.com";
const ADMIN_PASSWORD = "admin123";

// ─── Helper ───────────────────────────────────────────────────────────────────
async function api(method, path, body, token) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    if (!res.ok) {
        throw new Error(`${method} ${path} → ${res.status}: ${text}`);
    }
    return text ? JSON.parse(text) : null;
}

function paise(rupees) { return Math.round(rupees * 100); }
function log(msg) { console.log(`  ${msg}`); }

// ─── Product Data ─────────────────────────────────────────────────────────────
const KEYBOARDS = [
    { title: "Razer BlackWidow V4 Pro", brand: "Razer", desc: "Mechanical gaming keyboard with Razer Yellow switches, Chroma RGB backlighting, multi-functional roller, and Razer HyperShift technology for 100+ programmable keys.", price: 18999, orig: 22999, badge: "NEW" },
    { title: "Razer BlackWidow Lite", brand: "Razer", desc: "Compact TKL gaming keyboard with Razer Orange tactile switches, white individual backlighting, and detachable USB-C cable for portability.", price: 7999, orig: 10999, badge: "SALE" },
    { title: "Corsair K100 RGB", brand: "Corsair", desc: "Flagship mechanical gaming keyboard with OPX optical-mechanical switches, AXON Hyper-processing technology, and dynamic per-key lighting.", price: 22999, orig: 27999, badge: "BESTSELLER" },
    { title: "Corsair K70 RGB Pro", brand: "Corsair", desc: "Premium gaming keyboard with Cherry MX Speed switches, dynamic RGB backlighting, aluminum frame, and dedicated media controls.", price: 14999, orig: 18499, badge: null },
    { title: "Logitech G915 TKL Wireless", brand: "Logitech", desc: "Ultra-thin tenkeyless wireless gaming keyboard with GL mechanical switches, LIGHTSPEED wireless, Bluetooth, and up to 40 hours battery.", price: 16999, orig: 19999, badge: "TOP PICK" },
    { title: "Logitech G Pro X TKL", brand: "Logitech", desc: "Tournament-grade TKL gaming keyboard with swappable GX mechanical switches, USB pass-through, and pro-grade LIGHTSYNC RGB.", price: 11999, orig: 14999, badge: null },
    { title: "SteelSeries Apex Pro", brand: "SteelSeries", desc: "World's first keyboard with adjustable mechanical switches — OmniPoint magnetic switches, OLED Smart Display, and aircraft-grade aluminum frame.", price: 19999, orig: 24999, badge: "NEW" },
    { title: "SteelSeries Apex 5 Hybrid", brand: "SteelSeries", desc: "Hybrid mechanical gaming keyboard with per-key RGB illumination, OLED Smart Display, steel series switches, and multi-function digital dial.", price: 9999, orig: 13499, badge: "SALE" },
    { title: "HyperX Alloy Origins 65", brand: "HyperX", desc: "Compact 65% gaming keyboard with HyperX Red linear switches, double-shot PBT keycaps, aircraft-grade aluminum body, and full RGB per-key backlit.", price: 8499, orig: 10999, badge: null },
    { title: "ASUS ROG Strix Scope II RX", brand: "ASUS ROG", desc: "Gaming keyboard with ROG RX Red optical-mechanical switches, ROG pre-lubed stabilizers, double-shot PBT keycaps, and per-key RGB Aura Sync.", price: 11999, orig: 15499, badge: "NEW" },
    { title: "ASUS ROG Falchion Ace", brand: "ASUS ROG", desc: "75% wireless gaming keyboard with ROG NX switches, interactive touch panel, ROG SpeedNova wireless, and dual-mode connectivity.", price: 14999, orig: 17999, badge: null },
    { title: "MSI Vigor GK71 Sonic", brand: "MSI", desc: "Gaming keyboard with MSI SONIC Red switches, doubleshot PBT keycaps with RGB, anti-ghosting N-Key Rollover, and aluminum reinforcement plate.", price: 7499, orig: 9999, badge: "SALE" },
    { title: "Ant Esports MK3400W", brand: "Ant Esports", desc: "Wireless mechanical gaming keyboard with blue switches, multi-color LED backlight, 2.4GHz wireless, and up to 30 hours battery life.", price: 2999, orig: 4499, badge: "BESTSELLER" },
    { title: "Redgear MK881 RGB", brand: "Redgear", desc: "Mechanical gaming keyboard with Outemu blue switches, multiple lighting modes, anti-ghosting, and durable metal frame design.", price: 1999, orig: 3299, badge: null },
    { title: "Zebronics Zeb-Max Plus", brand: "Zebronics", desc: "Wired mechanical keyboard with blue switches, 104 keys, rainbow backlight, gold-plated USB connector, and ergonomic wrist-rest included.", price: 1499, orig: 2299, badge: null },
    { title: "Cosmic Byte CB-GK-22 Titan", brand: "Cosmic Byte", desc: "Mechanical gaming keyboard with Outemu brown switches, floating keycap design, adjustable backlighting with 9 modes, and Windows key lock.", price: 2499, orig: 3999, badge: "SALE" },
    { title: "Portronics Hydra 2", brand: "Portronics", desc: "Membrane gaming keyboard with multi-color LED backlight, multimedia functions, 19 anti-ghosting keys, and spill-resistant design.", price: 999, orig: 1799, badge: null },
    { title: "Corsair K65 Mini 60%", brand: "Corsair", desc: "Ultra-compact 60% gaming keyboard with Cherry MX Speed Switches, detachable USB-C cable, PBT double-shot keycaps, and RGB backlighting.", price: 12999, orig: 15499, badge: "NEW" },
];

const MICE = [
    { title: "Razer DeathAdder V3 HyperSpeed", brand: "Razer", desc: "Wireless FPS gaming mouse with 90-hour battery life, Focus Pro 30K optical sensor, ultra-light ergonomic design, and Speedflex low-drag cable.", price: 8999, orig: 11999, badge: "NEW" },
    { title: "Razer Basilisk V3 Pro", brand: "Razer", desc: "Wireless customizable gaming mouse with Razer HyperScroll Tilt Wheel, 11 programmable buttons, Focus Pro 30K sensor, and Chroma RGB.", price: 14999, orig: 18999, badge: "BESTSELLER" },
    { title: "Corsair M65 RGB Ultra", brand: "Corsair", desc: "FPS gaming mouse with 26,000 DPI MarkX sensor, aluminum construction, adjustable weight system, and 8 programmable buttons with sniper key.", price: 6999, orig: 9499, badge: null },
    { title: "Logitech G502 X Plus", brand: "Logitech", desc: "Wireless gaming mouse with LIGHTFORCE hybrid switches, HERO 25K sensor, POWERPLAY compatible, and 13 programmable buttons with LIGHTSYNC RGB.", price: 13499, orig: 16999, badge: "TOP PICK" },
    { title: "Logitech G Pro X Superlight 2", brand: "Logitech", desc: "Ultra-lightweight wireless gaming mouse at 60g, HERO 25K sensor, LIGHTSPEED wireless, minimalist design, and 70-hour battery life.", price: 16999, orig: 19999, badge: "NEW" },
    { title: "SteelSeries Aerox 5 Wireless", brand: "SteelSeries", desc: "Ultra-lightweight perforated wireless gaming mouse at 74g, TrueMove Air sensor, 9 programmable buttons, and 180-hour battery life.", price: 10999, orig: 13999, badge: null },
    { title: "HyperX Pulsefire Haste 2 Wireless", brand: "HyperX", desc: "Wireless gaming mouse with HyperX 26K Sensor, honeycomb shell design, HyperFlex USB cable, and a 100-hour battery life.", price: 7499, orig: 9999, badge: "SALE" },
    { title: "ASUS ROG Gladius III Wireless", brand: "ASUS ROG", desc: "Wireless ergonomic gaming mouse with swappable ROG Micro Switch sockets, ROG SpeedNova wireless, tri-mode connectivity, and aimpoint sensor.", price: 9499, orig: 12499, badge: null },
    { title: "ASUS ROG Keris II Ace Wireless", brand: "ASUS ROG", desc: "Lightweight gaming mouse at 54g, ROG AimPoint Pro sensor, asymmetrical body, swappable switches, and ROG SpeedNova wireless technology.", price: 11999, orig: 14999, badge: "NEW" },
    { title: "BenQ Zowie EC2-CW Wireless", brand: "BenQ", desc: "Tournament-grade wireless gaming mouse with plug-and-play connectivity, low-latency 2.4GHz, ergonomic right-hand shape, and matte surface coating.", price: 12499, orig: 15999, badge: null },
    { title: "Glorious Model O Wireless", brand: "Glorious", desc: "Ultra-lightweight wireless gaming mouse at 69g, Glorious wireless technology, advanced optical sensor, honeycomb design, and 71-hour battery.", price: 7999, orig: 10499, badge: "SALE" },
    { title: "MSI Clutch GM51 Lightweight", brand: "MSI", desc: "Lightweight gaming mouse with PAW-3395 sensor, PixArt optical sensor, honeycomb shell, adjustable DPI up to 26000, and Huano switches.", price: 5999, orig: 7999, badge: null },
    { title: "Redgear A-15 Wired", brand: "Redgear", desc: "RGB gaming mouse with 7200 DPI optical sensor, 7 buttons, anti-slip grip, and customizable LED lighting effects.", price: 799, orig: 1299, badge: "BESTSELLER" },
    { title: "Ant Esports GM600 RGB", brand: "Ant Esports", desc: "Gaming mouse with 7200 DPI optical sensor, 6 programmable buttons, RGB lighting, and ergonomic design for long gaming sessions.", price: 999, orig: 1699, badge: null },
    { title: "Zebronics Zeb-Transformer M", brand: "Zebronics", desc: "Gaming mouse with 2400 DPI optical sensor, 7-color LED breathing light, 7 buttons including DPI button, and braided cable.", price: 699, orig: 1199, badge: null },
    { title: "Portronics Toad 24 Wireless", brand: "Portronics", desc: "Ergonomic wireless mouse with 2.4GHz connectivity, 1600 DPI adjustable, 3 button click, and up to 12 months battery life.", price: 1299, orig: 1999, badge: "SALE" },
    { title: "Cosmic Byte Equinox", brand: "Cosmic Byte", desc: "Wired gaming mouse with Pixart 3050 sensor, 7200 DPI, 7 programmable buttons, 24G acceleration, infinity RGB lighting.", price: 1499, orig: 2299, badge: null },
    { title: "SteelSeries Rival 650 Wireless", brand: "SteelSeries", desc: "Wireless gaming mouse with 256g customizable weight and CG system, dual sensor system, 15-hour battery life, and RGB illumination.", price: 13999, orig: 17999, badge: null },
];

const HEADSETS = [
    { title: "Razer BlackShark V2 Pro Wireless", brand: "Razer", desc: "Wireless pro gaming headset with Razer TriForce Titanium 50mm drivers, HyperClear Supercardioid mic, THX Spatial Audio, and 70-hour battery.", price: 16999, orig: 19999, badge: "BESTSELLER" },
    { title: "Corsair HS80 RGB Wireless", brand: "Corsair", desc: "Gaming headset with Dolby Atmos audio, high-fidelity 50mm neodymium speakers, wireless with 60-foot range, and omni-directional mic.", price: 12999, orig: 16499, badge: null },
    { title: "Logitech G535 Lightspeed Wireless", brand: "Logitech", desc: "Ultra-lightweight wireless gaming headset at 236g, LIGHTSPEED pro-grade wireless, 33-hour battery, Leatherette and cloth ear cushions.", price: 10499, orig: 13499, badge: "SALE" },
    { title: "SteelSeries Arctis Nova Pro Wireless", brand: "SteelSeries", desc: "Premium wireless gaming headset with Active Noise Cancellation, Infinity Power dual battery system, and Hi-Fi grade 40mm drivers.", price: 29999, orig: 34999, badge: "TOP PICK" },
    { title: "HyperX Cloud III Wireless", brand: "HyperX", desc: "Wireless gaming headset with 53mm angled drivers, HyperX DTS Headphone:X Spatial Audio, 200-hour battery life, and memory foam ear cushions.", price: 13999, orig: 17499, badge: "NEW" },
    { title: "ASUS ROG Delta S Wireless", brand: "ASUS ROG", desc: "Wireless AI microphone gaming headset with ROG AI Beamforming Mic tech, ESS 9281 Quad-DAC, and Aura Sync RGB lighting.", price: 17999, orig: 22999, badge: null },
    { title: "JBL Quantum 910 Wireless", brand: "JBL", desc: "Head-tracking-enabled wireless gaming headset with JBL QuantumSPHERE 360, hybrid ANC, and JBL Quantum spatial audio for immersive gaming.", price: 19999, orig: 24999, badge: "NEW" },
    { title: "Sony INZONE H9 Wireless", brand: "Sony", desc: "Wireless noise-cancelling gaming headset with 360 Spatial Sound for Gaming, WH-1000XM5-equivalent ANC, and 32-hour battery life.", price: 23999, orig: 28999, badge: null },
    { title: "HyperX Cloud Alpha S Gaming", brand: "HyperX", desc: "Wired gaming headset with dual-chamber drivers, bass adjustment slider, Discord-certified microphone, and HyperX virtual 7.1 surround sound.", price: 8999, orig: 11499, badge: "SALE" },
    { title: "SteelSeries Arctis 7+ Wireless", brand: "SteelSeries", desc: "7.1 surround sound wireless gaming headset, 30-hour battery, lossless 2.4GHz, simultaneous PC + PS5 multiplatform support, ClearCast mic.", price: 14999, orig: 18999, badge: null },
    { title: "Redgear Cosmo 7.1 USB", brand: "Redgear", desc: "7.1 surround sound gaming headset with USB soundcard, retractable microphone, 40mm driver, and LED backlight for immersive gaming.", price: 1499, orig: 2499, badge: "BESTSELLER" },
    { title: "Ant Esports H707 Pro", brand: "Ant Esports", desc: "3.5mm gaming headset with 50mm drivers, omni-directional microphone, in-line volume control, and compatible with PC, PS4, Xbox, and Switch.", price: 999, orig: 1799, badge: null },
    { title: "Portronics Muffs Prime", brand: "Portronics", desc: "Over-ear wireless headphones with 30-hour playtime, Bluetooth 5.0, 40mm dynamic driver, foldable design, and built-in mic for calls.", price: 1799, orig: 2999, badge: "SALE" },
    { title: "Razer Barracuda X Wireless", brand: "Razer", desc: "Multi-platform wireless gaming headset compatible with PC, PS, Switch, and Android, with Razer HyperClear mic and 40mm angled drivers.", price: 7999, orig: 10499, badge: null },
    { title: "Corsair Virtuoso RGB Wireless XT", brand: "Corsair", desc: "High-fidelity wireless gaming headset with broadcast-quality microphone, support for Bluetooth and SLIPSTREAM 2.4GHz, and 24-hour battery.", price: 18999, orig: 22999, badge: "NEW" },
];

const MONITORS = [
    { title: "LG UltraGear 27GP850-B 27\" 165Hz", brand: "LG", desc: "27-inch Nano IPS gaming monitor with 2560x1440 QHD, 165Hz (overclockable to 180Hz), 1ms GTG response time, G-Sync compatible, and DisplayHDR 400.", price: 34999, orig: 41999, badge: "TOP PICK" },
    { title: "Samsung Odyssey G5 27\" Curved", brand: "Samsung", desc: "27-inch 1000R curved gaming monitor with 2560x1440 QHD, 165Hz refresh rate, 1ms response time, FreeSync Premium, and HDR10 support.", price: 26999, orig: 32999, badge: null },
    { title: "ASUS ROG Swift PG279QM 27\"", brand: "ASUS ROG", desc: "27-inch Fast IPS gaming monitor with 2560x1440, 240Hz, 1ms GTG, G-Sync, ELMB Sync, Aura Sync RGB, and NVIDIA Reflex Latency Analyzer.", price: 54999, orig: 64999, badge: "NEW" },
    { title: "BenQ Mobiuz EX2710Q 27\"", brand: "BenQ", desc: "27-inch IPS gaming monitor with QHD 2560x1440, 165Hz, 1ms IPS GtG, HDRi, FreeSync Premium, and Treble+Bass speakers with SPDIF.", price: 32999, orig: 38999, badge: "SALE" },
    { title: "MSI Optix MPG321UR-QD 32\"", brand: "MSI", desc: "32-inch Quantum Dot UHD 4K gaming monitor with 144Hz, 1ms IPS, DisplayHDR 600, USB-C 90W charging, and Rapid IPS panel technology.", price: 74999, orig: 89999, badge: "BESTSELLER" },
    { title: "Gigabyte M27Q-P 27\" QHD", brand: "Gigabyte", desc: "27-inch IPS gaming monitor with 2560x1440, 170Hz, 0.5ms GTG, KVM switch, USB-C 18W, and AMD FreeSync Premium for stutter-free gaming.", price: 27999, orig: 33499, badge: null },
    { title: "LG UltraGear 32GQ850-B 32\"", brand: "LG", desc: "32-inch Nano IPS gaming monitor with 2560x1440 QHD, 260Hz, 1ms GTG, G-Sync compatible, NVIDIA Reflex, and DisplayHDR 600.", price: 62999, orig: 74999, badge: "NEW" },
    { title: "Samsung Odyssey G7 32\" Curved", brand: "Samsung", desc: "32-inch 1000R curved QLED gaming monitor with 2560x1440, 240Hz, 1ms response, G-Sync compatible, DisplayHDR 600, and Quantum Dot tech.", price: 57999, orig: 68999, badge: null },
    { title: "AOC AGON AG274QZM 27\"", brand: "AOC", desc: "27-inch Fast VA gaming monitor with QHD 2560x1440, 240Hz, 0.5ms MPRT, AGON Lighting System, G-Sync compatible & FreeSync Premium Pro.", price: 44999, orig: 52999, badge: "SALE" },
    { title: "ViewSonic XG272-2K 27\"", brand: "ViewSonic", desc: "27-inch IPS gaming monitor with QHD 2560x1440, 165Hz, 1ms MPRT, FreeSync Premium, 99% sRGB, and two integrated 3W speakers.", price: 28999, orig: 34999, badge: null },
    { title: "Acer Nitro XV272U 27\" IPS", brand: "Acer", desc: "27-inch IPS gaming monitor with QHD 170Hz, 1ms VRB, AMD FreeSync Premium, DCI-P3 90%, and built-in 2W speakers.", price: 24999, orig: 29999, badge: "SALE" },
    { title: "Asus ProArt PA279CRV 27\" 4K", brand: "ASUS", desc: "Professional 27-inch IPS 4K monitor with perfect color accuracy, USB-C 96W PD, Calman verified, 99% DCI-P3, and built-in color calibration sensor.", price: 58999, orig: 69999, badge: null },
];

const CABLES = [
    { title: "Corsair Axon Custom USB-C Cable Set", brand: "Corsair", desc: "Premium coiled custom keyboard cable with USB-C to USB-A connectivity, sleeved braid, gold-plated connectors, and 1.8m length.", price: 3499, orig: 4999, badge: "NEW" },
    { title: "KBDFans Coiled Cable Aviator", brand: "KBDFans", desc: "Handcrafted coiled keyboard cable with aviator connector, polyurethane coil, detachable design, and various color options.", price: 2999, orig: 3999, badge: null },
    { title: "UGREEN USB-C 3.1 Gen2 Cable 1m", brand: "UGREEN", desc: "USB-C 3.1 Gen2 cable with 10Gbps data transfer, 100W 5A fast charging, 4K 60Hz video output, and aluminum alloy housing.", price: 799, orig: 1299, badge: "BESTSELLER" },
    { title: "Anker USB-C to USB-A Nylon Braided 2m", brand: "Anker", desc: "High-durability nylon braided USB-C cable, USB 3.0 data transfer, 60W fast charging, compatible with all USB-C devices.", price: 999, orig: 1599, badge: null },
    { title: "Portronics Konnect L 2.4A Type-C", brand: "Portronics", desc: "USB-C fast charging cable with 2.4A charging speed, nylon braided design, aluminum connector, and 1.2m length.", price: 399, orig: 699, badge: "SALE" },
    { title: "Elgato 4K60 Pro MK.2 HDMI Cable", brand: "Elgato", desc: "High-speed HDMI 2.0 cable supporting 4K 60fps, HDR, and 18Gbps bandwidth for zero-latency capture and streaming setup.", price: 1999, orig: 2799, badge: null },
    { title: "Belkin Boost Charge Pro USB-C 3m", brand: "Belkin", desc: "USB-C cable with braided nylon, 60W fast charging, 480Mbps data transfer, and military-grade durability for long-term use.", price: 1499, orig: 2299, badge: null },
    { title: "Targus USB-C 7-in-1 Hub", brand: "Targus", desc: "Compact USB-C multiport hub with 4K HDMI, 100W PD, 3x USB-A 3.0, SD and microSD card readers in an aluminum housing.", price: 4499, orig: 5999, badge: "TOP PICK" },
    { title: "Ant Esports WC100 Braided USB-C", brand: "Ant Esports", desc: "Braided charging cable with Type-C connector, 3A fast charging, tinned copper conductor, and 1m length for gaming setups.", price: 299, orig: 499, badge: "BESTSELLER" },
    { title: "i-tec USB-C Triple Display Dock", brand: "i-tec", desc: "USB-C docking station supporting triple display output, 100W PD, Gigabit LAN, USB 3.0 hub, and universal compatibility.", price: 12999, orig: 15999, badge: null },
    { title: "Cosmic Byte Neon Coiled Cable", brand: "Cosmic Byte", desc: "PU coiled USB-C to USB-A keyboard cable with 1.5m length, dual aviator connector, gold-plated contacts, and braided sleeving.", price: 1499, orig: 2499, badge: "SALE" },
    { title: "Redgear High-Speed HDMI 2.1 Cable 2m", brand: "Redgear", desc: "HDMI 2.1 ultra-high-speed cable with 48Gbps bandwidth, 8K 60Hz / 4K 120Hz support, and dynamic HDR for gaming monitors and TVs.", price: 599, orig: 999, badge: null },
    { title: "Portronics Mport 11 USB Hub", brand: "Portronics", desc: "USB 3.0 hub with 11-in-1 connectivity, 4K HDMI, USB-C PD 100W, Ethernet RJ45, SD/TF card reader, and aluminum housing.", price: 3299, orig: 4499, badge: "NEW" },
    { title: "Zebronics ZEB-USB Hub 4-Port", brand: "Zebronics", desc: "USB 3.0 4-port hub with high data transfer speed up to 5Gbps, hot-swap support, LED indicator, and compact plug-and-play design.", price: 499, orig: 799, badge: null },
    { title: "FIBBR Ultra HDMI 2.1 Fiber 5m", brand: "FIBBR", desc: "Fiber optic HDMI 2.1 cable with 48Gbps, 8K resolution support, ultra-thin design at 3mm diameter, and 5m length without signal loss.", price: 2499, orig: 3499, badge: "NEW" },
];

const CONTROLLERS = [
    { title: "Sony DualSense Wireless Controller", brand: "Sony", desc: "Next-gen gaming controller with haptic feedback, adaptive triggers, built-in microphone, rechargeable battery, and USB-C charging for PS5.", price: 6499, orig: 7499, badge: "BESTSELLER" },
    { title: "Xbox Wireless Controller Carbon Black", brand: "Microsoft", desc: "Redesigned Xbox Wireless Controller with Share button, textured grip on triggers/bumpers/back case, and USB-C port.", price: 5499, orig: 6499, badge: null },
    { title: "Razer Wolverine V2 Chroma", brand: "Razer", desc: "Wired gaming controller with Razer Mecha-Tactile buttons, Chroma RGB, 4 remappable multi-function buttons, and trigger stop switches.", price: 11999, orig: 14999, badge: "NEW" },
    { title: "PowerA FUSION Pro 2 Wired", brand: "PowerA", desc: "Wired gaming controller with mappable advanced gaming buttons, removable rumble motors, interchangeable faceplates, and swappable thumbstick heads.", price: 7999, orig: 9999, badge: null },
    { title: "Nacon Revolution 5 Pro", brand: "Nacon", desc: "Licensed PS5 gaming controller with Hall Effect sticks, adaptive triggers, back buttons, gyroscope, Dolby Atmos audio pass-through.", price: 16999, orig: 19999, badge: "TOP PICK" },
    { title: "Redgear Pro Series Wireless", brand: "Redgear", desc: "2.4GHz wireless gamepad with vibration feedback, 10m range, USB nano receiver, and compatibility with PC and Android.", price: 1799, orig: 2999, badge: "SALE" },
    { title: "Ant Esports GP100W Wireless", brand: "Ant Esports", desc: "Wireless gamepad with 2.4GHz receiver, vibration motor feedback, 8 hours battery, 6-axis gyroscope, and PC/Android compatibility.", price: 2499, orig: 3599, badge: "BESTSELLER" },
    { title: "Cosmic Byte C3070W Wireless", brand: "Cosmic Byte", desc: "Wireless gaming controller with 8 hours battery, vibration feedback, 2.4GHz USB receiver, and compatible with PC, PS3, and Android.", price: 1999, orig: 2999, badge: null },
    { title: "SteelSeries Stratus Duo Wireless", brand: "SteelSeries", desc: "Wireless gaming controller with dual wireless connectivity (2.4GHz + Bluetooth), PC/Android/VR compatible, and rechargeable battery.", price: 7499, orig: 9999, badge: null },
    { title: "Zebronics Zeb-Ultimate Pro", brand: "Zebronics", desc: "Wireless gamepad with dual vibration motors, 2.4GHz wireless, 6-axis gyroscope, OLED display for battery status, and multi-platform support.", price: 2299, orig: 3499, badge: "SALE" },
];

const CHAIRS = [
    { title: "Secretlab Titan Evo 2022 SoftWeave", brand: "Secretlab", desc: "Award-winning gaming chair with L-ADAPT lumbar system, 4-way L-ADAPT lumbar support, magnetic memory foam head pillow, and NEO Hybrid Leatherette.", price: 39999, orig: 44999, badge: "BESTSELLER" },
    { title: "DXRacer Formula Series F08", brand: "DXRacer", desc: "Classic gaming chair with cold cure foam, Class 4 gas lift, 3D armrests, 135° recline, and racing-style design for extended gaming sessions.", price: 18999, orig: 23999, badge: null },
    { title: "ASUS ROG Chariot Core SL200", brand: "ASUS ROG", desc: "Gaming chair with certified ergonomic neck and lumbar support, Class 4 hydraulics, 2D armrests, and ROG-branded premium PU leather.", price: 27999, orig: 33999, badge: "NEW" },
    { title: "Green Soul Monster Ultimate", brand: "Green Soul", desc: "Multi-functional gaming chair with adjustable lumbar and headrest cushions, 180° recline, 4D armrests, Class 4 gas lift, PU leather.", price: 14999, orig: 18999, badge: "TOP PICK" },
    { title: "Ant Esports Royal Series Gaming", brand: "Ant Esports", desc: "Gaming chair with ergonomic design, retractable footrest, lumbar cushion, headrest pillow, 90-180° adjustable recline, and PU leather covering.", price: 12999, orig: 16999, badge: null },
    { title: "Corsair TC200 Leatherette Gaming", brand: "Corsair", desc: "Gaming chair with soft leatherette upholstery, high-density foam cushioning, 4D armrests, Class 4 gas cylinder, and 165° recline range.", price: 32999, orig: 39999, badge: "NEW" },
    { title: "Zebronics Zeb-Jupiter Gaming Chair", brand: "Zebronics", desc: "Ergonomic gaming chair with high-back design, lumbar support, 3D adjustable armrests, tilt mechanism, and high-density durable foam.", price: 9999, orig: 13999, badge: "SALE" },
    { title: "Portronics MySeat L1 Pro", brand: "Portronics", desc: "Gaming chair with bucket seat design, adjustable head and lumbar pillow, reclining backrest 90-165°, 4D armrests, and 360° swivel base.", price: 11499, orig: 14999, badge: null },
];

const WEBCAMS = [
    { title: "Razer Kiyo Pro Ultra 4K", brand: "Razer", desc: "4K streaming webcam with Sony STARVIS 2 sensor, AI-powered background removal, HDR, adaptive light sensor, and Ring Light compatibility.", price: 22999, orig: 26999, badge: "NEW" },
    { title: "Logitech StreamCam 1080p", brand: "Logitech", desc: "Full HD 1080p/60fps streaming camera with USB-C, portrait mode support, AI-powered auto-focus and light adjustment, and smart framing.", price: 8999, orig: 11499, badge: "BESTSELLER" },
    { title: "Elgato Facecam Pro 4K", brand: "Elgato", desc: "True 4K 60fps webcam with 1/1.8\" Sony sensor, ultra-wide 90° lens, advanced controls via Camera Hub software, and glass lens for stunning clarity.", price: 19999, orig: 24499, badge: null },
    { title: "ASUS ROG Eye S 1080p", brand: "ASUS ROG", desc: "1080p 60fps streaming webcam with fixed-focus f/2.0 lens, Beamforming AI Noise-Canceling Mic, plug-and-play USB, and Aura Sync RGB.", price: 7499, orig: 9999, badge: "SALE" },
    { title: "Logitech C920 HD Pro 1080p", brand: "Logitech", desc: "Full HD 1080p webcam with autofocus, built-in dual mics with noise cancellation, universal clip for laptop/monitor, and H.264 compression.", price: 6999, orig: 8999, badge: "TOP PICK" },
    { title: "Microsoft Modern Webcam 1080p", brand: "Microsoft", desc: "True 1080p 30fps full HD webcam with HDR, 78° field of view, front-facing noise-cancelling mic, and built-in privacy shutter.", price: 5499, orig: 6999, badge: null },
    { title: "Portronics Clap 2 HD Webcam", brand: "Portronics", desc: "HD 1080p webcam with built-in microphone, digital zoom, plug-and-play, compatible with Windows and Mac, for video calls and streaming.", price: 1499, orig: 2299, badge: "SALE" },
];

const MOUSEPADS = [
    { title: "Razer Gigantus V2 XXL Gaming", brand: "Razer", desc: "XXL gaming mouse mat with micro-textured cloth surface for precise tracking, anti-fraying stitched frame, and non-slip rubber base.", price: 3499, orig: 4499, badge: "BESTSELLER" },
    { title: "Corsair MM700 RGB Extended Mousepad", brand: "Corsair", desc: "RGB gaming mouse pad with 360° dynamic multicolor RGB lighting, premium micro-weave cloth top, and non-slip natural rubber base.", price: 6999, orig: 8999, badge: "NEW" },
    { title: "SteelSeries QcK XXL Edge", brand: "SteelSeries", desc: "Extra-large gaming mousepad with stitched edge, micro-textured cloth for precision tracking at any speed, and non-slip rubber base.", price: 2999, orig: 3999, badge: null },
    { title: "HyperX Pulsefire Mat XL Speed", brand: "HyperX", desc: "XL gaming mouse pad with smooth speed surface, stitched edges, and anti-slip natural rubber base. Perfect for FPS players.", price: 1999, orig: 2799, badge: "SALE" },
    { title: "ASUS ROG Sheath BLK Edition XL", brand: "ASUS ROG", desc: "Extra-large gaming desk mat with ROG logo, micro-textured anti-fray stitched surface, non-slip rubber base, and cable management groove.", price: 3999, orig: 4999, badge: null },
    { title: "Logitech G840 XL Gaming Mouse Pad", brand: "Logitech", desc: "XL gaming surface measuring 900x400mm, consistent surface texture, Logitech G optimized for use with gaming mice, and stable rubber base.", price: 3799, orig: 4799, badge: "TOP PICK" },
    { title: "Redgear Manticore Speed Mousepad", brand: "Redgear", desc: "Speed surface gaming mouse pad with stitched edges, anti-skid rubber base, and silky smooth surface for maximum speed movement.", price: 699, orig: 1199, badge: "SALE" },
    { title: "Ant Esports MP290 Control Large", brand: "Ant Esports", desc: "Control surface mousepad with precision cloth top, reinforced anti-fray stitched border, anti-slip rubber base, 45x40cm.", price: 499, orig: 799, badge: "BESTSELLER" },
];

// ─── Category & Collection Definitions ───────────────────────────────────────
const CATEGORY_DEFS = [
    { name: "Keyboards", handle: "keyboards", desc: "Mechanical and membrane gaming keyboards from top brands" },
    { name: "Gaming Mice", handle: "mice", desc: "Wired and wireless gaming mice with high DPI sensors" },
    { name: "Headsets", handle: "headsets", desc: "Gaming and stereo headsets with surround sound" },
    { name: "Monitors", handle: "monitors", desc: "High refresh rate gaming monitors from 1080p to 4K" },
    { name: "Cables & Accessories", handle: "cables", desc: "USB cables, hubs, HDMI cables and connectivity accessories" },
    { name: "Controllers", handle: "controllers", desc: "Wireless and wired gaming controllers and gamepads" },
    { name: "Gaming Chairs", handle: "chairs", desc: "Ergonomic gaming chairs for extended play sessions" },
    { name: "Webcams", handle: "webcams", desc: "HD and 4K webcams for streaming and video calls" },
    { name: "Mousepads", handle: "mousepads", desc: "Speed and control surface gaming mouse pads" },
];

const COLLECTION_DEFS = [
    { title: "New Arrivals", handle: "new-arrivals", desc: "Freshest products just added to our store" },
    { title: "Top Picks", handle: "top-picks", desc: "Hand-curated fan favorites and bestsellers" },
    { title: "Flash Sale", handle: "flash-sale", desc: "Limited-time deals up to 60% off" },
    { title: "Budget Gaming", handle: "budget-gaming", desc: "Great gaming gear under ₹2,999" },
    { title: "Premium Collection", handle: "premium", desc: "High-end gear for professionals and enthusiasts" },
    { title: "Razer Collection", handle: "razer", desc: "Official Razer products" },
    { title: "Corsair Collection", handle: "corsair", desc: "Official Corsair products" },
    { title: "Logitech G Series", handle: "logitech-g", desc: "Logitech G gaming products" },
];

// badge → collection mapping
function getBadgeCollections(badge, price, brand, collections) {
    const ids = [];
    if (badge === "NEW") ids.push(collections["new-arrivals"]);
    if (badge === "TOP PICK" || badge === "BESTSELLER") ids.push(collections["top-picks"]);
    if (badge === "SALE") ids.push(collections["flash-sale"]);
    if (price <= 299900) ids.push(collections["budget-gaming"]); // ≤ ₹2,999
    if (price >= 1499900) ids.push(collections["premium"]);       // ≥ ₹14,999
    if (brand === "Razer") ids.push(collections["razer"]);
    if (brand === "Corsair") ids.push(collections["corsair"]);
    if (brand?.startsWith("Logitech")) ids.push(collections["logitech-g"]);
    return ids.filter(Boolean);
}

// ─── Thumbnail URLs (Unsplash — free to use) ──────────────────────────────────
const CATEGORY_IMAGES = {
    keyboards: [
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80",
        "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80",
        "https://images.unsplash.com/photo-1541140134513-85a161dc4a00?w=600&q=80",
        "https://images.unsplash.com/photo-1561005638-abb4b812eb05?w=600&q=80",
    ],
    mice: [
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80",
        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80",
        "https://images.unsplash.com/photo-1586349906319-47f2b96571d8?w=600&q=80",
    ],
    headsets: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80",
        "https://images.unsplash.com/photo-1599669454699-248893623440?w=600&q=80",
    ],
    monitors: [
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80",
        "https://images.unsplash.com/photo-1547082034-e5f2699a9fcf?w=600&q=80",
        "https://images.unsplash.com/photo-1593640408182-31c228f6b69a?w=600&q=80",
    ],
    cables: [
        "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&q=80",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    ],
    controllers: [
        "https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=600&q=80",
        "https://images.unsplash.com/photo-1606407873037-9a4e3fbe31b4?w=600&q=80",
        "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&q=80",
    ],
    chairs: [
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80",
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    ],
    webcams: [
        "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&q=80",
        "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80",
    ],
    mousepads: [
        "https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?w=600&q=80",
        "https://images.unsplash.com/photo-1563297007-0686b7003af7?w=600&q=80",
    ],
};

function getImage(categoryKey, index) {
    const imgs = CATEGORY_IMAGES[categoryKey] || [];
    return imgs[index % imgs.length] || "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80";
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    console.log("\n╔════════════════════════════════════════╗");
    console.log("║  Naman Ent — Inventory Seed Script    ║");
    console.log("╚════════════════════════════════════════╝\n");

    // 1. Authenticate
    console.log("1. Authenticating as admin...");
    let token;
    try {
        const auth = await api("POST", "/auth/user/emailpass", { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
        token = auth.token;
        console.log("   ✓ Authenticated\n");
    } catch (e) {
        console.error("   ✗ Auth failed:", e.message);
        console.log("\n   Trying alternative admin email...");
        try {
            const auth2 = await api("POST", "/auth/user/emailpass", { email: "admin@medusajs.com", password: "supersecret" });
            token = auth2.token;
            console.log("   ✓ Authenticated with fallback credentials\n");
        } catch (e2) {
            console.error("   ✗ Fallback auth also failed:", e2.message);
            process.exit(1);
        }
    }

    // 2. Get default sales channel
    console.log("2. Fetching default sales channel...");
    let salesChannelId;
    try {
        const sc = await api("GET", "/admin/sales-channels?limit=1", null, token);
        salesChannelId = sc?.sales_channels?.[0]?.id;
        if (salesChannelId) log(`✓ Sales channel: ${salesChannelId}`);
        else log("⚠ No sales channel found, products won't be assigned to a channel");
    } catch (e) { log(`⚠ Could not fetch sales channels: ${e.message}`); }

    // 3. Create product categories
    console.log("\n3. Creating product categories...");
    const categoryMap = {};
    for (const cat of CATEGORY_DEFS) {
        try {
            const res = await api("POST", "/admin/product-categories", {
                name: cat.name, handle: cat.handle, description: cat.desc,
                is_active: true, is_internal: false,
            }, token);
            categoryMap[cat.handle] = res.product_category.id;
            log(`✓ Category: ${cat.name}`);
        } catch (e) {
            // Already exists — fetch it
            try {
                const existing = await api("GET", `/admin/product-categories?handle=${cat.handle}`, null, token);
                const found = existing?.product_categories?.[0];
                if (found) { categoryMap[cat.handle] = found.id; log(`~ Exists: ${cat.name}`); }
            } catch { log(`✗ Failed: ${cat.name} — ${e.message}`); }
        }
    }

    // 4. Create collections
    console.log("\n4. Creating collections...");
    const collectionMap = {};
    for (const col of COLLECTION_DEFS) {
        try {
            const res = await api("POST", "/admin/collections", {
                title: col.title, handle: col.handle, metadata: { description: col.desc },
            }, token);
            collectionMap[col.handle] = res.collection.id;
            log(`✓ Collection: ${col.title}`);
        } catch (e) {
            try {
                const existing = await api("GET", `/admin/collections?handle=${col.handle}`, null, token);
                const found = existing?.collections?.[0];
                if (found) { collectionMap[col.handle] = found.id; log(`~ Exists: ${col.title}`); }
            } catch { log(`✗ ${col.title}: ${e.message}`); }
        }
    }

    // 5. Seed products
    const ALL_PRODUCTS = [
        { items: KEYBOARDS, catHandle: "keyboards", catKey: "keyboards" },
        { items: MICE, catHandle: "mice", catKey: "mice" },
        { items: HEADSETS, catHandle: "headsets", catKey: "headsets" },
        { items: MONITORS, catHandle: "monitors", catKey: "monitors" },
        { items: CABLES, catHandle: "cables", catKey: "cables" },
        { items: CONTROLLERS, catHandle: "controllers", catKey: "controllers" },
        { items: CHAIRS, catHandle: "chairs", catKey: "chairs" },
        { items: WEBCAMS, catHandle: "webcams", catKey: "webcams" },
        { items: MOUSEPADS, catHandle: "mousepads", catKey: "mousepads" },
    ];

    let total = 0;
    for (const group of ALL_PRODUCTS) {
        console.log(`\n5. Seeding ${group.catHandle}...`);
        const catId = categoryMap[group.catHandle];

        for (let i = 0; i < group.items.length; i++) {
            const p = group.items[i];
            const handle = p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
            const thumbnail = getImage(group.catKey, i);

            // Build collection IDs for this product
            const colIds = getBadgeCollections(p.badge, paise(p.price), p.brand, collectionMap);
            const collectionId = colIds[0] || null; // Medusa v2 uses collection_id (single)

            try {
                const payload = {
                    title: p.title,
                    subtitle: p.brand,
                    handle,
                    description: p.desc,
                    status: "published",
                    thumbnail,
                    ...(catId ? { categories: [{ id: catId }] } : {}),
                    ...(collectionId ? { collection_id: collectionId } : {}),
                    ...(salesChannelId ? { sales_channels: [{ id: salesChannelId }] } : {}),
                    options: [{ title: "Variant", values: ["Standard"] }],
                    variants: [
                        {
                            title: "Standard",
                            sku: `NAM-${group.catKey.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(3, "0")}`,
                            manage_inventory: false,
                            prices: [
                                { currency_code: "inr", amount: paise(p.price) },
                            ],
                            options: { Variant: "Standard" },
                        },
                    ],
                    metadata: {
                        brand: p.brand,
                        badge: p.badge || "",
                        original_price_inr: p.orig || p.price,
                        category: group.catHandle,
                    },
                };

                await api("POST", "/admin/products", payload, token);
                log(`✓ [${++total}] ${p.title}`);
            } catch (e) {
                if (e.message.includes("already exists") || e.message.includes("duplicate")) {
                    log(`~ Skip (exists): ${p.title}`);
                } else {
                    log(`✗ Failed: ${p.title} — ${e.message.substring(0, 100)}`);
                }
            }

            // Small delay to avoid overwhelming the API
            await new Promise(r => setTimeout(r, 100));
        }
    }

    console.log(`\n╔════════════════════════════════════════╗`);
    console.log(`║  ✅ Seeded ${total} products successfully!    `);
    console.log(`║  Categories: ${Object.keys(categoryMap).length} created`);
    console.log(`║  Collections: ${Object.keys(collectionMap).length} created`);
    console.log(`╚════════════════════════════════════════╝\n`);
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
