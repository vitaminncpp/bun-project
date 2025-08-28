import type { Context } from "hono";
import SuccessResponse from "../models/SuccessResponse.model";
import * as shellService from "../services/shell.service";

export function startShell(c: Context) {
  const connectionId: string = c.req.query("connectionId")!;

  const shell = shellService.startShell(connectionId);
  return c.json(
    new SuccessResponse(201, "shell started successfully", shell),
    200
  );
}
