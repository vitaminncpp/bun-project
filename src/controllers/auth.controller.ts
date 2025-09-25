import type { Context } from "hono";
import SuccessResponse from "../models/SuccessResponse.model";
import { User as UserModel } from "../models/User.model";
import * as authService from "../services/auth.service";
import AuthToken from "../models/AuthToken.model";
import { setCookie } from "hono/cookie";

const options = {
  domain: "*",
  maxAge: 3600 * 24 * 7,
  httpOnly: false,
  secure: false,
  path: "/",
};

export async function register(c: Context) {
  const body = await c.req.json();
  const user = UserModel.from(body, true);
  const auth = await authService.register(user);
  setCookie(c, "authorization", auth.accessToken, options);
  setCookie(c, "refresh", auth.refreshToken, options);
  return c.json(new SuccessResponse<AuthToken>(201, "User Registered Successfully", auth), 201);
}

export async function login(c: Context) {
  const body = await c.req.json();
  const auth: AuthToken = await authService.login(body.username, body.password);

  setCookie(c, "authorization", auth.accessToken, options);
  setCookie(c, "refresh", auth.refreshToken, options);
  return c.json(new SuccessResponse<AuthToken>(200, "Login Successful", auth), 200);
}

export async function refreshToken(c: Context) {
  const body = await c.req.json();
  const token: AuthToken = authService.refreshToken(body.refreshToken);
  return c.json(new SuccessResponse<AuthToken>(200, "Token Refreshed Successfully", token), 200);
}
