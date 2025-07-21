import { mysqlTable, mysqlSchema, index, foreignKey, primaryKey, varchar, mysqlEnum, int, datetime, tinyint, unique } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const games = mysqlTable("games", {
	id: varchar({ length: 255 }).notNull(),
	playerW: varchar({ length: 255 }).notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	playerB: varchar({ length: 255 }).notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	status: mysqlEnum(['PENDING','ACTIVE','FINISHED','ABORTED','INVALID','CANCELED']).default('PENDING').notNull(),
	result: mysqlEnum(['WHITE_WIN','BLACK_WIN','DRAW','WHITE_WIN_BY_RESIGNATION','BLACK_WIN_BY_RESIGNATION','WHITE_WIN_ON_TIME','BLACK_WIN_ON_TIME','DRAW_INSUFFICIENT_MATERIAL','DRAW_STALEMATE','DRAW_THREEFOLD_REPETITION','DRAW_FIFTY_MOVE_RULE','DRAW_AGREEMENT','ABORTED','PENDING']).default('PENDING').notNull(),
	ratingChangeW: int().default(0).notNull(),
	ratingChangeB: int().default(0).notNull(),
	startedAt: datetime({ mode: 'string'}).notNull(),
	endedAt: datetime({ mode: 'string'}).notNull(),
	timeControl: int().notNull(),
	createdAt: datetime({ mode: 'string'}).notNull(),
	updatedAt: datetime({ mode: 'string'}).notNull(),
},
(table) => [
	index("playerW").on(table.playerW),
	index("playerB").on(table.playerB),
	primaryKey({ columns: [table.id], name: "games_id"}),
]);

export const moves = mysqlTable("moves", {
	id: varchar({ length: 255 }).notNull(),
	gameId: varchar({ length: 255 }).notNull().references(() => games.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	moveNumber: int().notNull(),
	player: mysqlEnum(['WHITE','BLACK']).notNull(),
	fromFile: mysqlEnum(['a','b','c','d','e','f','g','h']).notNull(),
	fromRank: tinyint().notNull(),
	toFile: mysqlEnum(['a','b','c','d','e','f','g','h']).notNull(),
	toRank: tinyint().notNull(),
	piece: mysqlEnum(['PAWN','KNIGHT','BISHOP','ROOK','QUEEN','KING']).notNull(),
	moveType: mysqlEnum(['REGULAR','CAPTURE','CASTLE','EN_PASSANT','CHECK','CHECKMATE']).notNull(),
	capturedPiece: mysqlEnum(['PAWN','KNIGHT','BISHOP','ROOK','QUEEN','KING']),
	promotion: mysqlEnum(['PAWN','KNIGHT','BISHOP','ROOK','QUEEN','KING']),
	notation: varchar({ length: 255 }).notNull(),
	createdAt: datetime({ mode: 'string'}),
	updatedAt: datetime({ mode: 'string'}),
},
(table) => [
	index("gameId").on(table.gameId),
	primaryKey({ columns: [table.id], name: "moves_id"}),
]);

export const profiles = mysqlTable("profiles", {
	id: varchar({ length: 255 }).notNull(),
	userId: varchar({ length: 255 }).notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	rating: int().default(400).notNull(),
	gamesPlayed: int().default(0).notNull(),
	wins: int().default(0).notNull(),
	losses: int().default(0).notNull(),
	draws: int().default(0).notNull(),
	bio: varchar({ length: 255 }),
	avatarUrl: varchar({ length: 255 }),
	createdAt: datetime({ mode: 'string'}).notNull(),
	updatedAt: datetime({ mode: 'string'}).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "profiles_id"}),
	unique("userId").on(table.userId),
]);

export const roleActions = mysqlTable("role_actions", {
	id: varchar({ length: 255 }).notNull(),
	roleId: varchar({ length: 255 }).notNull().references(() => roles.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	action: mysqlEnum(['INSERT_USER','DELETE_USER','UPDATE_USER']).notNull(),
	description: varchar({ length: 255 }),
},
(table) => [
	index("roleId").on(table.roleId),
	primaryKey({ columns: [table.id], name: "role_actions_id"}),
]);

export const roles = mysqlTable("roles", {
	id: varchar({ length: 255 }).notNull(),
	rolename: varchar({ length: 255 }).notNull(),
	description: varchar({ length: 255 }),
	isDeleted: varchar("is_deleted", { length: 255 }).default('0').notNull(),
	createdAt: datetime({ mode: 'string'}).notNull(),
	updatedAt: datetime({ mode: 'string'}).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "roles_id"}),
	unique("rolename").on(table.rolename),
]);

export const userRoles = mysqlTable("user_roles", {
	id: varchar({ length: 255 }).notNull(),
	userId: varchar({ length: 255 }).notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	roleId: varchar({ length: 255 }).notNull().references(() => roles.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	description: varchar({ length: 255 }),
},
(table) => [
	index("roleId").on(table.roleId),
	primaryKey({ columns: [table.id], name: "user_roles_id"}),
	unique("user_roles_roleId_userId_unique").on(table.userId, table.roleId),
]);

export const users = mysqlTable("users", {
	id: varchar({ length: 255 }).notNull(),
	username: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	isDeleted: tinyint().default(0).notNull(),
	createdAt: datetime({ mode: 'string'}).notNull(),
	updatedAt: datetime({ mode: 'string'}).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "users_id"}),
	unique("username").on(table.username),
]);
