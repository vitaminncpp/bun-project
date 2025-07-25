// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import * as envService from "./src/services/env.service";
export default defineConfig({
  dialect: envService.getDatabaseDialect() as any,
  schema: "./src/entities/*.entity.ts",
  dbCredentials: {
    url: envService.getDatabaseUrl(),
  },
});