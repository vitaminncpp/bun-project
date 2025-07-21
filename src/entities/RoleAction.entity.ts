import { mysqlTable, varchar, mysqlEnum } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { roles } from "./Role.entity";
import { Action } from "../policies/actions.policy";
import { randomUUID } from "crypto";

export const roleActions = mysqlTable("role_actions", {
  id: varchar("id", { length: 36 }).primaryKey().$default(randomUUID),
  roleId: varchar("roleId", { length: 36 }).notNull(),
  action: mysqlEnum(
    "action",
    Object.values(Action) as [string, ...string[]]
  ).notNull(),
  description: varchar("description", { length: 255 }),
});

export const roleActionsRelations = relations(roleActions, ({ one }) => ({
  role: one(roles, {
    fields: [roleActions.roleId],
    references: [roles.id],
  }),
}));
