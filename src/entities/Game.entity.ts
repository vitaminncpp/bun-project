import { integer, pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./User.entity";
import { moves } from "./Move.entity";
import { GameResult, GameStatus } from "../lib/chess/games.enum";

export const gameStatusEnum = pgEnum(
  "game_status",
  Object.values(GameStatus) as [string, ...string[]],
);
export const gameResultEnum = pgEnum(
  "game_result",
  Object.values(GameResult) as [string, ...string[]],
);

export const games = pgTable("games", {
  id: uuid("id").primaryKey().defaultRandom(),
  playerW: uuid("player_w")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  playerB: uuid("player_b")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  status: gameStatusEnum("status").notNull().default(GameStatus.PENDING),
  result: gameResultEnum("result").notNull().default(GameResult.PENDING),
  ratingChangeW: integer("rating_change_w").notNull().default(0),
  ratingChangeB: integer("rating_change_b").notNull().default(0),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  endedAt: timestamp("ended_at", { withTimezone: true }).defaultNow(),
  timeControl: integer("time_control").notNull().default(600),
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
  moves: many(moves),
}));
