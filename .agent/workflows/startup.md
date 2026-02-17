---
description: How to start all services and servers for the Naman Ent ecommerce platform after a system restart
---

# Startup Guide — Naman Ent Ecommerce Platform

After restarting your system, follow these steps **in order** to get everything running.

## Step 1: Start Docker Desktop
Open **Docker Desktop** from the Start Menu and wait until the system tray icon turns green ("Docker Desktop is running").

## Step 2: Start Docker containers (PostgreSQL, Redis, MeiliSearch)
// turbo
```powershell
cd c:\Users\iis02\OneDrive\Documents\Projects\New\cdpl\IIS019
docker compose up -d
```

## Step 3: Verify Docker services
// turbo
```powershell
docker compose ps
```
All 3 services should show **"running"**: `naman-ent-postgres`, `naman-ent-redis`, `naman-ent-meilisearch`.

## Step 4: Start MedusaJS Backend (port 9000)
```powershell
cd c:\Users\iis02\OneDrive\Documents\Projects\New\cdpl\IIS019\apps\backend
node node_modules\@medusajs\cli\cli.js develop
```
Wait for: `Server is ready on port: 9000`

**URLs:**
- API: http://localhost:9000
- Admin Dashboard: http://localhost:9000/app
- Admin login: `admin@namanent.com` / `admin123`

## Step 5: Start Next.js Storefront (port 3000)
Open a **new terminal**:
```powershell
cd c:\Users\iis02\OneDrive\Documents\Projects\New\cdpl\IIS019
pnpm --filter @naman-ent/storefront dev
```
Wait for: `Ready in XXXms`

**URL:** http://localhost:3000

## Summary of Running Services

| Service | Port | Command to Start |
|---------|------|-----------------|
| PostgreSQL | 5432 | `docker compose up -d` |
| Redis | 6379 | `docker compose up -d` |
| MeiliSearch | 7700 | `docker compose up -d` |
| Medusa Backend | 9000 | `node node_modules\@medusajs\cli\cli.js develop` (from `apps/backend/`) |
| Next.js Storefront | 3000 | `pnpm --filter @naman-ent/storefront dev` (from project root) |

## Shutting Down

To stop everything:
1. Press `Ctrl+C` in the storefront terminal
2. Press `Ctrl+C` in the backend terminal
3. Run `docker compose down` from the project root (or just close Docker Desktop)
