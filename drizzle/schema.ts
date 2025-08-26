import { pgTable, unique, uuid, varchar, boolean, foreignKey, integer, timestamp, smallint, text, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const action = pgEnum("action", ['SUPER_USER', 'INSERT_USER', 'DELETE_USER', 'UPDATE_USER'])
export const file = pgEnum("file", ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'])
export const gamePiece = pgEnum("game_piece", ['PAWN', 'KNIGHT', 'BISHOP', 'ROOK', 'QUEEN', 'KING'])
export const gameResult = pgEnum("game_result", ['WHITE_WIN', 'BLACK_WIN', 'DRAW', 'WHITE_WIN_BY_RESIGNATION', 'BLACK_WIN_BY_RESIGNATION', 'WHITE_WIN_ON_TIME', 'BLACK_WIN_ON_TIME', 'DRAW_INSUFFICIENT_MATERIAL', 'DRAW_STALEMATE', 'DRAW_THREEFOLD_REPETITION', 'DRAW_FIFTY_MOVE_RULE', 'DRAW_AGREEMENT', 'ABORTED', 'PENDING'])
export const gameStatus = pgEnum("game_status", ['PENDING', 'ACTIVE', 'FINISHED', 'ABORTED', 'INVALID', 'CANCELED'])
export const moveType = pgEnum("move_type", ['NOT_APPLICABLE', 'ILLEGAL_MOVE', 'WRONG_PLAYER', 'REGULAR_MOVE', 'CAPTURE_MOVE', 'PROMOTION_MOVE', 'EN_PASSANT_MOVE', 'LONG_CASTLE', 'SHORT_CASTLE', 'CHECK_MOVE', 'CHECKMATE_MOVE', 'RESIGNATION_MOVE', 'STALEMATE_MOVE', 'THREEFOLD_REPETITION_MOVE', 'FIFTY_MOVE_RULE_MOVE', 'AGREEMENT_MOVE'])
export const player = pgEnum("player", ['WHITE', 'BLACK'])


export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	username: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	isDeleted: boolean("is_deleted").default(false).notNull(),
}, (table) => [
	unique("users_username_unique").on(table.username),
]);

export const games = pgTable("games", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	playerW: uuid("player_w").notNull(),
	playerB: uuid("player_b").notNull(),
	status: gameStatus().default('PENDING').notNull(),
	result: gameResult().default('PENDING').notNull(),
	ratingChangeW: integer("rating_change_w").default(0).notNull(),
	ratingChangeB: integer("rating_change_b").default(0).notNull(),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	endedAt: timestamp("ended_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	timeControl: integer("time_control").default(600).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.playerW],
			foreignColumns: [users.id],
			name: "games_player_w_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.playerB],
			foreignColumns: [users.id],
			name: "games_player_b_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const moves = pgTable("moves", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	gameId: uuid("game_id").notNull(),
	moveNumber: integer("move_number").notNull(),
	player: player().notNull(),
	fromFile: file("from_file").notNull(),
	fromRank: smallint("from_rank").notNull(),
	toFile: file("to_file").notNull(),
	toRank: smallint("to_rank").notNull(),
	piece: gamePiece().notNull(),
	moveType: moveType("move_type").notNull(),
	capturedPiece: gamePiece("captured_piece"),
	promotion: gamePiece(),
	notation: varchar({ length: 255 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.gameId],
			foreignColumns: [games.id],
			name: "moves_game_id_games_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const profiles = pgTable("profiles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	rating: integer().default(400).notNull(),
	gamesPlayed: integer("games_played").default(0).notNull(),
	wins: integer().default(0).notNull(),
	losses: integer().default(0).notNull(),
	draws: integer().default(0).notNull(),
	bio: varchar({ length: 255 }),
	avatarUrl: varchar("avatar_url", { length: 255 }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "profiles_user_id_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("profiles_user_id_unique").on(table.userId),
]);

export const roles = pgTable("roles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	rolename: varchar({ length: 255 }).notNull(),
	description: varchar({ length: 255 }),
	isDeleted: boolean("is_deleted").default(false).notNull(),
}, (table) => [
	unique("roles_rolename_unique").on(table.rolename),
]);

export const roleActions = pgTable("role_actions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	roleId: uuid("role_id").notNull(),
	action: action().notNull(),
	description: varchar({ length: 255 }),
}, (table) => [
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.id],
			name: "role_actions_role_id_roles_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const userRoles = pgTable("user_roles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	roleId: uuid("role_id").notNull(),
	description: varchar({ length: 255 }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_roles_user_id_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.id],
			name: "user_roles_role_id_roles_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const workspaces = pgTable("workspaces", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	userId: uuid("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "workspaces_user_id_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);
