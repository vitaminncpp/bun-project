import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { users } from "./User.entity";
import { roles } from "./Role.entity";
import { randomUUID } from "crypto";

export const userRoles = mysqlTable("user_roles", {
  id: varchar("id", { length: 36 }).primaryKey().$default(randomUUID),
  userId: varchar("userId", { length: 36 }).notNull(),
  roleId: varchar("roleId", { length: 36 }).notNull(),
  description: varchar("description", { length: 255 }),
});

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));
