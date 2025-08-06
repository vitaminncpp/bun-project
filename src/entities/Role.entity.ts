import { boolean, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { userRoles } from "./UserRole.entity";
import { roleActions } from "./RoleAction.entity";

export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  rolename: varchar("rolename", { length: 255 }).notNull().unique(),
  description: varchar("description", { length: 255 }),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
  actions: many(roleActions),
}));
