import { mysqlTable, varchar, boolean } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { users } from "./User.entity";
import { roleActions } from "./RoleAction.entity";
import { randomUUID } from "crypto";

export const roles = mysqlTable("roles", {
  id: varchar("id", { length: 36 }).primaryKey().$default(randomUUID),
  rolename: varchar("rolename", { length: 255 }).notNull().unique(),
  description: varchar("description", { length: 255 }),
  isDeleted: boolean("isDeleted").notNull().default(false),
});

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
  actions: many(roleActions),
}));
