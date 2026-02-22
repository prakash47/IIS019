---
description: How to start all services and servers for the Naman Ent ecommerce platform after a system restart
---

# Startup Guide — Naman Ent Ecommerce Platform

After restarting your system, follow these steps **in order** to get everything running.

## Step 1: Start Docker Desktop
Open **Docker Desktop** from the Start Menu and wait until the system tray icon turns green.

## Step 2: Start Docker containers (PostgreSQL, Redis, MeiliSearch)
// turbo
```powershell
cd C:\Projects\IIS019
docker compose up -d
```

## Step 3: Verify Docker services are running
// turbo
```powershell
docker compose ps
```
All 3 should show **running**: `naman-ent-postgres`, `naman-ent-redis`, `naman-ent-meilisearch`.

## Step 4: Start MedusaJS Backend (port 9000)
Open a terminal:
```powershell
cd C:\Projects\IIS019\apps\backend
npm install        # only needed if node_modules is missing
node node_modules\@medusajs\cli\cli.js develop
```
Wait for: `✔ Server is ready on port: 9000`

**URLs:**
- API: http://localhost:9000
- Admin Dashboard: http://localhost:9000/app
- Login: `admin@namanent.com` / `admin123`

## Step 5: Start Next.js Storefront (port 3000)
Open a **new** terminal:
```powershell
cd C:\Projects\IIS019
pnpm --filter @naman-ent/storefront dev
```
Wait for: `Ready in XXXms`

**URL:** http://localhost:3000

---

## Summary of All Services

| Service | Port | Start Command |
|---------|------|--------------|
| PostgreSQL | 5432 | `docker compose up -d` (from `C:\Projects\IIS019`) |
| Redis | 6379 | `docker compose up -d` |
| MeiliSearch | 7700 | `docker compose up -d` |
| Medusa Backend | 9000 | `node node_modules\@medusajs\cli\cli.js develop` (from `apps\backend\`) |
| Next.js Storefront | 3000 | `pnpm --filter @naman-ent/storefront dev` (from `C:\Projects\IIS019`) |

## Shutting Down

1. `Ctrl+C` in the storefront terminal
2. `Ctrl+C` in the backend terminal
3. `docker compose down` from project root (or just close Docker Desktop)

## If node_modules are missing after restart

For the **backend** (npm):
```powershell
cd C:\Projects\IIS019\apps\backend
npm install    # ~2-3 min first time, then faster
```

For the **storefront/root** (pnpm):
```powershell
cd C:\Projects\IIS019
pnpm install   # ~30 seconds (packages cached in C:\pnpm-store)
```
