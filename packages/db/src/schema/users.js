"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertUserSchema = exports.usersTable = exports.userRoleEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_zod_1 = require("drizzle-zod");
exports.userRoleEnum = (0, pg_core_1.pgEnum)("user_role", ["customer", "admin", "superadmin"]);
exports.usersTable = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.text)("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: (0, pg_core_1.text)("email").notNull().unique(),
    passwordHash: (0, pg_core_1.text)("password_hash"),
    name: (0, pg_core_1.text)("name").notNull(),
    avatarUrl: (0, pg_core_1.text)("avatar_url"),
    role: (0, exports.userRoleEnum)("role").notNull().default("customer"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.usersTable).omit({ id: true, createdAt: true, updatedAt: true });
//# sourceMappingURL=users.js.map