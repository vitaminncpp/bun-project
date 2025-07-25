import { integer, pgEnum, pgTable, timestamp, uuid, } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./User.entity";
import { moves } from "./Move.entity";
import { GameResult, GameStatus } from "../lib/chess/games.enum";

// It's a good practice to define enums for PostgreSQL at the top level.
export const gameStatusEnum = pgEnum(
  "game_status",
  Object.values(GameStatus) as [string, ...string[]]
);
export const gameResultEnum = pgEnum(
  "game_result",
  Object.values(GameResult) as [string, ...string[]]
);

export const games = pgTable("games", {
  // Use the native `uuid` type for primary keys in PostgreSQL.
  id: uuid("id").primaryKey().defaultRandom(),

  // Foreign keys should also be `uuid` to match the `users` table.
  // Column names are converted to snake_case for PostgreSQL convention.
  playerW: uuid("player_w")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  playerB: uuid("player_b")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),

  // Use the defined pgEnum for status and result.
  status: gameStatusEnum("status").notNull().default(GameStatus.PENDING),
  result: gameResultEnum("result").notNull().default(GameResult.PENDING),

  // Use `integer` for integer types.
  ratingChangeW: integer("rating_change_w").notNull().default(0),
  ratingChangeB: integer("rating_change_b").notNull().default(0),

  // Use `timestamp` for date-time values. `defaultNow()` is the PG equivalent.
  startedAt: timestamp("started_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  // `endedAt` should be nullable as it's not set when a game starts.
  endedAt: timestamp("ended_at", { withTimezone: true }).defaultNow(),
  timeControl: integer("time_control").notNull().default(600),
});

export const gamesRelations = relations(games, ({ one, many }) => ({
  // The relation names `playerW` and `playerB` are kept for consistency with the User entity.
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
  // Renamed from `move` to `moves` for clarity.
  moves: many(moves),
}));