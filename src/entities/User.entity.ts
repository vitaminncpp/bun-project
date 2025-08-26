import { pgTable, varchar, boolean, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { roles } from "./Role.entity";
import { games } from "./Game.entity";
import { profiles } from "./Profile.entity";
import { projects } from "./Project.entity";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  roles: many(roles),
  gamesW: many(games, { relationName: "playerW" }),
  gamesB: many(games, { relationName: "playerB" }),
  profile: one(profiles),
  workspace: many(projects),
}));
