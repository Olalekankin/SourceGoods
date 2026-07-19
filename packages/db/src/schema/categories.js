"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertCategorySchema = exports.categoriesTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_zod_1 = require("drizzle-zod");
exports.categoriesTable = (0, pg_core_1.pgTable)("categories", {
    id: (0, pg_core_1.text)("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: (0, pg_core_1.text)("name").notNull(),
    slug: (0, pg_core_1.text)("slug").notNull().unique(),
    iconUrl: (0, pg_core_1.text)("icon_url"),
    description: (0, pg_core_1.text)("description"),
    productCount: (0, pg_core_1.integer)("product_count").notNull().default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});
exports.insertCategorySchema = (0, drizzle_zod_1.createInsertSchema)(exports.categoriesTable).omit({ id: true, createdAt: true, updatedAt: true });
//# sourceMappingURL=categories.js.map