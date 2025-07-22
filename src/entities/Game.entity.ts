import {
  mysqlTable,
  varchar,
  int,
  mysqlEnum,
  datetime,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { users } from "./User.entity";
import { moves } from "./Move.entity";
import { GameResult, GameSatus } from "../lib/chess/games.enum";
import { randomUUID } from "crypto";

export const games = mysqlTable("games", {
  id: varchar("id", { length: 36 }).primaryKey().$default(randomUUID),
  playerW: varchar("playerW", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  playerB: varchar("playerB", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  status: mysqlEnum("status", Object.values(GameSatus) as [string, ...string[]])
    .notNull()
    .default(GameSatus.PENDING),
  result: mysqlEnum(
    "result",
    Object.values(GameResult) as [string, ...string[]]
  )
    .notNull()
    .default(GameResult.PENDING),
  ratingChangeW: int("ratingChangeW").notNull().default(0),
  ratingChangeB: int("ratingChangeB").notNull().default(0),
  startedAt: datetime("startedAt", { mode: "date" })
    .notNull()
    .$default(() => new Date()),
  endedAt: datetime("endedAt", { mode: "date" })
    .notNull()
    .$default(() => new Date()),
  timeControl: int("timeControl").notNull(),
});

export const gamesRelations = relations(games, ({ one, many }) => ({
  whitePlayer: one(users, {
    fields: [games.playerW],
    references: [users.id],
    relationName: "playerW",
  }),
  blackPlayer: one(users, {
    fields: [games.playerB],
    references: [users.id],
    relationName: "playerB",
  }),
  move: many(moves),
}));
