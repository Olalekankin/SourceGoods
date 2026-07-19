import { pgTable, text, numeric, integer, jsonb, timestamp, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const paymentMethodEnum = pgEnum("payment_method", ["stripe", "bank_transfer"]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending", "paid", "failed", "refunded", "awaiting_verification"
]);
export const orderFulfillmentStatusEnum = pgEnum("order_fulfillment_status", [
  "pending", "sourcing", "shipped_from_supplier", "in_transit", "delivered", "cancelled"
]);

export const ordersTable = pgTable("orders", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderNumber: text("order_number").notNull().unique(),
  userId: text("user_id"),
  items: jsonb("items").$type<Array<{
    productId: string;
    slug: string;
    sku: string;
    name: string;
    unitPrice: number;
    currency: string;
    quantity: number;
    imageUrl?: string | null;
  }>>().notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingFee: numeric("shipping_fee", { precision: 10, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  paymentStatus: paymentStatusEnum("payment_status").notNull().default("pending"),
  fulfillmentStatus: orderFulfillmentStatusEnum("fulfillment_status").notNull().default("pending"),
  shippingAddress: jsonb("shipping_address").$type<{
    fullName: string;
    line1: string;
    line2?: string | null;
    city: string;
    state?: string | null;
    postalCode?: string | null;
    country: string;
    phone?: string | null;
  }>().notNull(),
  estimatedShipDate: date("estimated_ship_date", { mode: "string" }),
  statusHistory: jsonb("status_history").$type<Array<{
    status: string;
    note?: string | null;
    changedAt: string;
    changedBy?: string | null;
  }>>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
