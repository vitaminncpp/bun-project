import { Sequelize } from "sequelize-typescript";
import { Role } from "../entities/Role.entity";
import { UserRole } from "../entities/UserRole.entity";
import { User } from "../entities/User.entity";
import { Game } from "../entities/Game.entity";
import { Move } from "../entities/Move.entity";
import { Profile } from "../entities/Profile.entity";
import { RoleAction } from "../entities/RoleAction.entity";
import * as envService from "../services/env.service";

declare type Dialect = "mysql" | "mssql" | "postgres" | "sqlite" | "mariadb" | "oracle";

export const sequelize = new Sequelize({
  dialect: envService.getDatabaseDialect() as Dialect,
  host: envService.getDatabaseHost(),
  port: envService.getDatabasePort(),
  username: envService.getDatabaseUsername(),
  password: envService.getDatabasePassword(),
  database: envService.getDatabaseName(),
  models: [User, Role, UserRole, Game, Profile, Move, RoleAction],
  logging: true,
});
