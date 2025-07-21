import { mysqlTable, varchar, int } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { users } from "./User.entity";
import { randomUUID } from "crypto";

export const profiles = mysqlTable("profiles", {
  id: varchar("id", { length: 36 }).primaryKey().$default(randomUUID),
  userId: varchar("userId", { length: 36 }).notNull().unique(),
  rating: int("rating").notNull().default(400),
  gamesPlayed: int("gamesPlayed").notNull().default(0),
  wins: int("wins").notNull().default(0),
  losses: int("losses").notNull().default(0),
  draws: int("draws").notNull().default(0),
  bio: varchar("bio", { length: 255 }),
  avatarUrl: varchar("avatarUrl", { length: 255 }),
});

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));
