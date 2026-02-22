import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  admin: {
    // ── Vite plugin: replace "Welcome to Medusa" text at build time ──────────
    vite: () => ({
      plugins: [
        {
          name: "naman-ent-branding",
          enforce: "post" as const,
          transform(code: string, id: string) {
            // Target the compiled dashboard bundle
            if (id.includes("@medusajs/dashboard") || id.includes("app.js")) {
              return {
                code: code
                  .replace(/Welcome to Medusa/g, "Welcome to Naman Enterprises")
                  .replace(/Sign in to access the account area/g, "Sign in to access the admin portal"),
                map: null,
              };
            }
          },
        },
      ],
    }),
  },
})
