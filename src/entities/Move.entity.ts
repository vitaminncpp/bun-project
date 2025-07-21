import {
  mysqlTable,
  varchar,
  int,
  mysqlEnum,
  tinyint,
  datetime,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { games } from "./Game.entity";
import { GamePiece, Player, FILE, MoveType } from "../lib/chess/games.enum";
import { randomUUID } from "crypto";

export const moves = mysqlTable("moves", {
  id: varchar("id", { length: 36 }).primaryKey().$default(randomUUID),
  gameId: varchar("gameId", { length: 36 }).notNull(),
  moveNumber: int("moveNumber").notNull(),
  player: mysqlEnum(
    "player",
    Object.values(Player) as [string, ...string[]]
  ).notNull(),
  fromFile: mysqlEnum(
    "fromFile",
    Object.values(FILE) as [string, ...string[]]
  ).notNull(),
  fromRank: tinyint("fromRank").notNull(),
  toFile: mysqlEnum(
    "toFile",
    Object.values(FILE) as [string, ...string[]]
  ).notNull(),
  toRank: tinyint("toRank").notNull(),
  piece: mysqlEnum(
    "piece",
    Object.keys(GamePiece) as [string, ...string[]]
  ).notNull(),
  moveType: mysqlEnum(
    "moveType",
    Object.keys(MoveType) as [string, ...string[]]
  ).notNull(),
  capturedPiece: mysqlEnum(
    "capturedPiece",
    Object.keys(GamePiece) as [string, ...string[]]
  ),
  promotion: mysqlEnum(
    "promotion",
    Object.keys(GamePiece) as [string, ...string[]]
  ),
  notation: varchar("notation", { length: 255 }).notNull(),
  createdAt: datetime("createdAt", { mode: "date" })
    .notNull()
    .$default(() => new Date()),
  updatedAt: datetime("updatedAt", { mode: "date" })
    .notNull()
    .$default(() => new Date()),
});

export const movesRelations = relations(moves, ({ one }) => ({
  game: one(games, {
    fields: [moves.gameId],
    references: [games.id],
  }),
}));
