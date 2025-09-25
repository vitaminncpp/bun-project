import { pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { roles } from "./Role.entity";
import { Action } from "../policies/actions.policy";

export const actionEnum = pgEnum("action", Object.values(Action) as [string, ...string[]]);

export const roleActions = pgTable("role_actions", {
  id: uuid("id").primaryKey().defaultRandom(),
  roleId: uuid("role_id")
    .notNull()
    .references(() => roles.id, { onDelete: "cascade", onUpdate: "cascade" }),
  action: actionEnum("action").notNull(),
  description: varchar("description", { length: 255 }),
});

export const roleActionsRelations = relations(roleActions, ({ one }) => ({
  role: one(roles, {
    fields: [roleActions.roleId],
    references: [roles.id],
  }),
}));
