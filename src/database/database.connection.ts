import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as envService from "../services/env.service";

// Import all your Drizzle schemas
import { users } from "../entities/User.entity";
import { roles } from "../entities/Role.entity";
import { userRoles } from "../entities/UserRole.entity";
import { games } from "../entities/Game.entity";
import { profiles } from "../entities/Profile.entity";
import { moves } from "../entities/Move.entity";
import { roleActions } from "../entities/RoleAction.entity";

// Create a single PostgreSQL client instance.
// The 'postgres' library automatically handles connection pooling.
const client = postgres(envService.getDatabaseUrl(), {
  max: 10, // Sets the maximum number of connections in the pool
});

// Initialize Drizzle ORM for PostgreSQL
export const db = drizzle(client, {
  schema: {
    users,
    roles,
    userRoles,
    games,
    profiles,
    moves,
    roleActions,
  },
  // It's a good practice to enable logging in development for debugging SQL queries
  logger: true,
});