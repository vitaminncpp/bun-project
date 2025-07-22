import { Exception } from "../exceptions/app.exception";
import ErrorCode from "../enums/errorcodes.enum";
import ENV_KEYS from "../constants/env.keys";

function getEnvVariable(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Exception(ErrorCode.ENV_ERROR, "Environment Varibale Error", {
      key,
      value,
    });
  }
  return value;
}

export function getAccessSecret(): string {
  return getEnvVariable(ENV_KEYS.JWT_ACCESS_SECRET);
}

export function getRefreshSecret(): string {
  return getEnvVariable(ENV_KEYS.JWT_REFRESH_SECRET);
}

export function getPasswordSalt(): string {
  return getEnvVariable(ENV_KEYS.PASSWORD_SALT);
}

export function getServerPort(): number {
  return parseInt(getEnvVariable(ENV_KEYS.SERVER_PORT));
}

export function getDatabaseDialect(): string {
  return getEnvVariable(ENV_KEYS.DATABASE_DIALECT);
}

export function getDatabaseHost(): string {
  return getEnvVariable(ENV_KEYS.DATABASE_HOST);
}

export function getDatabasePort(): number {
  return parseInt(getEnvVariable(ENV_KEYS.DATABASE_PORT));
}

export function getDatabaseName(): string {
  return getEnvVariable(ENV_KEYS.DATABASE_NAME);
}

export function getDatabaseUsername(): string {
  return getEnvVariable(ENV_KEYS.DATABASE_USERNAME);
}

export function getDatabasePassword(): string {
  return getEnvVariable(ENV_KEYS.DATABASE_PASSWORD);
}

export function getDatabaseUrl(): string {
  return `${getDatabaseDialect()}://${getDatabaseUsername()}:${getDatabasePassword()}@${getDatabaseHost()}:${getDatabasePort()}/${getDatabaseName()}`;
}

export function getDatabaseConfig(): {
  dialect: string;
  host: string;
  port: number;
  database: string;
  password: string;
  username: string;
} {
  return {
    dialect: getDatabaseDialect(),
    host: getDatabaseHost(),
    port: getDatabasePort(),
    database: getDatabaseName(),
    username: getDatabaseUsername(),
    password: getDatabasePassword(),
  };
}
