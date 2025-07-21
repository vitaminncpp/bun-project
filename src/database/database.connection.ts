import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as envService from "../services/env.service";

// Import Drizzle models
import { users } from "../entities/User.entity";
import { roles } from "../entities/Role.entity";
import { userRoles } from "../entities/UserRole.entity";
import { games } from "../entities/Game.entity";
import { profiles } from "../entities/Profile.entity";
import { moves } from "../entities/Move.entity";
import { roleActions } from "../entities/RoleAction.entity";

// Create MySQL2 connection pool
const pool = mysql.createPool({
  host: envService.getDatabaseHost(),
  port: envService.getDatabasePort(),
  user: envService.getDatabaseUsername(),
  password: envService.getDatabasePassword(),
  database: envService.getDatabaseName(),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Initialize Drizzle ORM
export const db = drizzle(pool, {
  schema: {
    users,
    roles,
    userRoles,
    games,
    profiles,
    moves,
    roleActions,
  },
  mode: "default",
});
