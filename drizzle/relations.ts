import { relations } from "drizzle-orm/relations";
import { users, games, moves, profiles, projects, roles, roleActions, userRoles } from "./schema";

export const gamesRelations = relations(games, ({one, many}) => ({
	user_playerW: one(users, {
		fields: [games.playerW],
		references: [users.id],
		relationName: "games_playerW_users_id"
	}),
	user_playerB: one(users, {
		fields: [games.playerB],
		references: [users.id],
		relationName: "games_playerB_users_id"
	}),
	moves: many(moves),
}));

export const usersRelations = relations(users, ({many}) => ({
	games_playerW: many(games, {
		relationName: "games_playerW_users_id"
	}),
	games_playerB: many(games, {
		relationName: "games_playerB_users_id"
	}),
	profiles: many(profiles),
	projects: many(projects),
	userRoles: many(userRoles),
}));

export const movesRelations = relations(moves, ({one}) => ({
	game: one(games, {
		fields: [moves.gameId],
		references: [games.id]
	}),
}));

export const profilesRelations = relations(profiles, ({one}) => ({
	user: one(users, {
		fields: [profiles.userId],
		references: [users.id]
	}),
}));

export const projectsRelations = relations(projects, ({one}) => ({
	user: one(users, {
		fields: [projects.userId],
		references: [users.id]
	}),
}));

export const roleActionsRelations = relations(roleActions, ({one}) => ({
	role: one(roles, {
		fields: [roleActions.roleId],
		references: [roles.id]
	}),
}));

export const rolesRelations = relations(roles, ({many}) => ({
	roleActions: many(roleActions),
	userRoles: many(userRoles),
}));

export const userRolesRelations = relations(userRoles, ({one}) => ({
	user: one(users, {
		fields: [userRoles.userId],
		references: [users.id]
	}),
	role: one(roles, {
		fields: [userRoles.roleId],
		references: [roles.id]
	}),
}));