import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../models/ErrorResponse.model";
import * as authService from "../services/auth.service";
import { User as UserModel } from "../models/User.model";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  if (req.headers.authorization) {
    const token: string = req.headers.authorization;
    const user: UserModel = authService.authenticate(token.split(" ")[1]);
    if (user) {
      req.authData = user;
      next();
    } else {
      res.status(401).json(new ErrorResponse(401, "Unauthorized", new Error()));
    }
  } else {
    res.status(401).json(new ErrorResponse(401, "Unauthorized", new Error()));
    next();
  }
}
