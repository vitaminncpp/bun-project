import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../models/ErrorResponse.model";

export function validateGetUser(req: Request, res: Response, next: NextFunction) {
  const errors: { [key: string]: { [key: string]: string } } = {};
  if (!req.params.id) {
    errors["user_id"] = { required: "field `user_id` is required" };
  }
  if (Object.entries(errors).length > 0) {
    res.status(400).json(new ErrorResponse(400, "Validation(s) failed", new Error(), errors));
  } else {
    next();
  }
}

// TODO add detailed Validation with type checks
export function validateAddUsers(req: Request, res: Response, next: NextFunction) {
  if (!req.body) {
    res.status(400).json(new ErrorResponse(400, "Reqest Body Expected", new Error()));
    return;
  } else {
    next();
  }
}
