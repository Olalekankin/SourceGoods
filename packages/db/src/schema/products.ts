import { pgTable, text, integer, numeric, boolean, jsonb, timestamp, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productStatusEnum = pgEnum("product_status", ["draft", "published", "archived"]);
export const fulfillmentStatusEnum = pgEnum("fulfillment_status", [
  "pending", "sourcing", "shipped_from_supplier", "in_transit", "delivered", "cancelled"
]);

export const productsTable = pgTable("products", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  category: text("category").notNull(),
  brand: text("brand"),
  basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  primaryImageUrl: text("primary_image_url"),
  images: jsonb("images").$type<string[]>().default([]),
  status: productStatusEnum("status").notNull().default("draft"),
  isPreOrder: boolean("is_pre_order").notNull().default(true),
  moq: integer("moq"),
  currentPreOrderCount: integer("current_pre_order_count").notNull().default(0),
  estimatedShipDate: date("estimated_ship_date", { mode: "string" }),
  fulfillmentStatus: fulfillmentStatusEnum("fulfillment_status").notNull().default("pending"),
  attributes: jsonb("attributes").$type<Array<{
    key: string;
    label: string;
    type: string;
    value: string;
  }>>().default([]),
  variants: jsonb("variants").$type<Array<{
    sku: string;
    price: number;
    stock: number;
    attributeValues: Record<string, string>;
    imageUrl?: string;
  }>>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
