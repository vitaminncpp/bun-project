import { Request, Response } from "express";
import SuccessResponse from "../models/SuccessResponse.model";
import * as userService from "../services/user.service";
import { User as UserModel } from "../models/User.model";
import * as authService from "../services/auth.service";
import AuthToken from "../models/AuthToken.model";

export async function register(req: Request, res: Response) {
  const user: UserModel = await userService.createUser(
    req.body.username,
    req.body.name,
    req.body.password
  );
  res.status(200).json(new SuccessResponse(200, "User Registered Successfully", user));
}

export async function login(req: Request, res: Response) {
  const token: AuthToken = await authService.login(req.body.username, req.body.password);
  res.status(200).json(new SuccessResponse(200, "Login successfull", token));
}

export function refreshToken(req: Request, res: Response) {
  const token: AuthToken = authService.refreshToken(req.body.refreshToken);
  res.status(200).json(new SuccessResponse(200, "Token Refreshed Successfully", token));
}
