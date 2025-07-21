import { mysqlTable, varchar, boolean } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { roles } from "./Role.entity";
import { games } from "./Game.entity";
import { profiles } from "./Profile.entity";
import { randomUUID } from "crypto";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().$default(randomUUID),
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
}));
