import type { Context } from "hono";
import SuccessResponse from "../models/SuccessResponse.model";
import * as userService from "../services/user.service";
import { User as UserModel } from "../models/User.model";
import * as authService from "../services/auth.service";
import AuthToken from "../models/AuthToken.model";
import { setCookie } from "hono/cookie";

export async function register(c: Context) {
  const body = await c.req.json();
  const user = UserModel.from(body, true);
  const savedUser = await userService.createUser(user);
  return c.json(
    new SuccessResponse<UserModel>(
      200,
      "User Registered Successfully",
      savedUser
    ),
    200
  );
}

export async function login(c: Context) {
  const body = await c.req.json();
  const token: AuthToken = await authService.login(
    body.username,
    body.password
  );
  setCookie(c, 'authorization', token.accessToken, {
    maxAge: 3600, // Cookie expires in 1 hour
    httpOnly: false, // Not accessible via client-side JavaScript
    secure: false, // Only sent over HTTPS
    path: '/', // Available across the entire domain
  });
  ;
  setCookie(c, 'refresh', token.refreshToken, {
    maxAge: 3600, // Cookie expires in 1 hour
    httpOnly:true, // Not accessible via client-side JavaScript
    secure: true, // Only sent over HTTPS
    path: '/', // Available across the entire domain
  });
  return c.json(
    new SuccessResponse<AuthToken>(200, "Login successfull", token),
    200
  );
}

export async function refreshToken(c: Context) {
  const body = await c.req.json();
  const token: AuthToken = await authService.refreshToken(body.refreshToken);
  return c.json(
    new SuccessResponse<AuthToken>(200, "Token Refreshed Successfully", token),
    200
  );
}
