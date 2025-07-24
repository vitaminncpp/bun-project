import { integer, pgEnum, pgTable, smallint, timestamp, uuid, varchar, } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { games } from "./Game.entity";
import { FILE, GamePiece, MoveType, Player } from "../lib/chess/games.enum";

// Define enums for PostgreSQL before using them in the table
export const playerEnum = pgEnum(
  "player",
  Object.values(Player) as [string, ...string[]]
);
export const fileEnum = pgEnum(
  "file",
  Object.values(FILE) as [string, ...string[]]
);
export const gamePieceEnum = pgEnum(
  "game_piece",
  Object.values(GamePiece) as [string, ...string[]]
);
export const moveTypeEnum = pgEnum(
  "move_type",
  Object.values(MoveType) as [string, ...string[]]
);

export const moves = pgTable("moves", {
  id: uuid("id").primaryKey().defaultRandom(),
  gameId: uuid("game_id")
    .notNull()
    .references(() => games.id, { onDelete: "cascade", onUpdate: "cascade" }),
  moveNumber: integer("move_number").notNull(),
  player: playerEnum("player").notNull(),
  fromFile: fileEnum("from_file").notNull(),
  fromRank: smallint("from_rank").notNull(),
  toFile: fileEnum("to_file").notNull(),
  toRank: smallint("to_rank").notNull(),
  piece: gamePieceEnum("piece").notNull(),
  moveType: moveTypeEnum("move_type").notNull(),
  capturedPiece: gamePieceEnum("captured_piece"),
  promotion: gamePieceEnum("promotion"),
  notation: varchar("notation", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const movesRelations = relations(moves, ({ one }) => ({
  game: one(games, {
    fields: [moves.gameId],
    references: [games.id],
  }),
}));