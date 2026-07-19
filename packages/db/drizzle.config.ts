import { defineConfig } from "drizzle-kit";
import path from "path";

if (!process.env.DATABASE_URL) {
  // Fallback to user-provided Neon URL for local seeding (temporary)
  process.env.DATABASE_URL = "postgresql://neondb_owner:npg_6zSiEX9FBgRr@ep-square-cloud-atqjj9w6-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
}

export default defineConfig({
  schema: [path.join(__dirname, "./src/schema/*.ts")],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
