"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertOrderSchema = exports.ordersTable = exports.orderFulfillmentStatusEnum = exports.paymentStatusEnum = exports.paymentMethodEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_zod_1 = require("drizzle-zod");
exports.paymentMethodEnum = (0, pg_core_1.pgEnum)("payment_method", ["stripe", "bank_transfer"]);
exports.paymentStatusEnum = (0, pg_core_1.pgEnum)("payment_status", [
    "pending", "paid", "failed", "refunded", "awaiting_verification"
]);
exports.orderFulfillmentStatusEnum = (0, pg_core_1.pgEnum)("order_fulfillment_status", [
    "pending", "sourcing", "shipped_from_supplier", "in_transit", "delivered", "cancelled"
]);
exports.ordersTable = (0, pg_core_1.pgTable)("orders", {
    id: (0, pg_core_1.text)("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    orderNumber: (0, pg_core_1.text)("order_number").notNull().unique(),
    userId: (0, pg_core_1.text)("user_id"),
    items: (0, pg_core_1.jsonb)("items").$type().notNull(),
    subtotal: (0, pg_core_1.numeric)("subtotal", { precision: 10, scale: 2 }).notNull(),
    shippingFee: (0, pg_core_1.numeric)("shipping_fee", { precision: 10, scale: 2 }).notNull().default("0"),
    total: (0, pg_core_1.numeric)("total", { precision: 10, scale: 2 }).notNull(),
    currency: (0, pg_core_1.text)("currency").notNull().default("USD"),
    paymentMethod: (0, exports.paymentMethodEnum)("payment_method").notNull(),
    paymentStatus: (0, exports.paymentStatusEnum)("payment_status").notNull().default("pending"),
    fulfillmentStatus: (0, exports.orderFulfillmentStatusEnum)("fulfillment_status").notNull().default("pending"),
    shippingAddress: (0, pg_core_1.jsonb)("shipping_address").$type().notNull(),
    estimatedShipDate: (0, pg_core_1.date)("estimated_ship_date", { mode: "string" }),
    statusHistory: (0, pg_core_1.jsonb)("status_history").$type().default([]),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});
exports.insertOrderSchema = (0, drizzle_zod_1.createInsertSchema)(exports.ordersTable).omit({ id: true, createdAt: true, updatedAt: true });
//# sourceMappingURL=orders.js.map