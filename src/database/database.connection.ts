import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as envService from "../services/env.service";

import { users } from "../entities/User.entity";
import { roles } from "../entities/Role.entity";
import { userRoles } from "../entities/UserRole.entity";
import { games } from "../entities/Game.entity";
import { profiles } from "../entities/Profile.entity";
import { moves } from "../entities/Move.entity";
import { roleActions } from "../entities/RoleAction.entity";
import { projects } from "../entities/Project.entity";

const client = postgres(envService.getDatabaseUrl(), {
  max: 10,
  ssl: true,
});

export const db = drizzle(client, {
  schema: {
    users,
    roles,
    userRoles,
    games,
    profiles,
    moves,
    roleActions,
    projects,
  },
  logger: true,
});
