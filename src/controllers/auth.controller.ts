import type { Context } from "hono";
import SuccessResponse from "../models/SuccessResponse.model";
import * as userService from "../services/user.service";
import { User as UserModel } from "../models/User.model";
import * as authService from "../services/auth.service";
import AuthToken from "../models/AuthToken.model";

export async function register(c: Context) {
  const body = c.get("body");
  const user = await userService.createUser(
    body.username,
    body.name,
    body.password
  );
  return c.json(
    new SuccessResponse(200, "User Registered Successfully", user),
    200
  );
}

export async function login(c: Context) {
  const body = c.get("body");
  const token: AuthToken = await authService.login(
    body.username,
    body.password
  );
  return c.json(new SuccessResponse(200, "Login successfull", token), 200);
}

export async function refreshToken(c: Context) {
  const body = c.get("body");
  const token: AuthToken = await authService.refreshToken(body.refreshToken);
  return c.json(
    new SuccessResponse(200, "Token Refreshed Successfully", token),
    200
  );
}
