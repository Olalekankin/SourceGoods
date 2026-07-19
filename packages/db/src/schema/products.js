"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertProductSchema = exports.productsTable = exports.fulfillmentStatusEnum = exports.productStatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_zod_1 = require("drizzle-zod");
exports.productStatusEnum = (0, pg_core_1.pgEnum)("product_status", ["draft", "published", "archived"]);
exports.fulfillmentStatusEnum = (0, pg_core_1.pgEnum)("fulfillment_status", [
    "pending", "sourcing", "shipped_from_supplier", "in_transit", "delivered", "cancelled"
]);
exports.productsTable = (0, pg_core_1.pgTable)("products", {
    id: (0, pg_core_1.text)("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: (0, pg_core_1.text)("name").notNull(),
    slug: (0, pg_core_1.text)("slug").notNull().unique(),
    description: (0, pg_core_1.text)("description"),
    category: (0, pg_core_1.text)("category").notNull(),
    brand: (0, pg_core_1.text)("brand"),
    basePrice: (0, pg_core_1.numeric)("base_price", { precision: 10, scale: 2 }).notNull(),
    currency: (0, pg_core_1.text)("currency").notNull().default("USD"),
    primaryImageUrl: (0, pg_core_1.text)("primary_image_url"),
    images: (0, pg_core_1.jsonb)("images").$type().default([]),
    status: (0, exports.productStatusEnum)("status").notNull().default("draft"),
    isPreOrder: (0, pg_core_1.boolean)("is_pre_order").notNull().default(true),
    moq: (0, pg_core_1.integer)("moq"),
    currentPreOrderCount: (0, pg_core_1.integer)("current_pre_order_count").notNull().default(0),
    estimatedShipDate: (0, pg_core_1.date)("estimated_ship_date", { mode: "string" }),
    fulfillmentStatus: (0, exports.fulfillmentStatusEnum)("fulfillment_status").notNull().default("pending"),
    attributes: (0, pg_core_1.jsonb)("attributes").$type().default([]),
    variants: (0, pg_core_1.jsonb)("variants").$type().default([]),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});
exports.insertProductSchema = (0, drizzle_zod_1.createInsertSchema)(exports.productsTable).omit({ id: true, createdAt: true, updatedAt: true });
//# sourceMappingURL=products.js.map