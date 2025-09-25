import type { Context, Next } from "hono";
import ErrorResponse from "../models/ErrorResponse.model";
import * as authService from "../services/auth.service";
import { User as UserModel } from "../models/User.model";
import Constants from "../constants/constants";
import ErrorCode from "../enums/errorcodes.enum";
export async function authenticate(c: Context, next: Next) {
  const authHeader = c.req.header("authorization");
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (token) {
      const user: UserModel = UserModel.from(authService.authenticate(token));
      if (user) {
        c.set(Constants.AUTH_DATA, user);
        await next();
        return;
      }
    }
  }
  return c.json(new ErrorResponse(ErrorCode.UNAUTHORIZED, 401, "Unauthorized", new Error()), 401);
}
