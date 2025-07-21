import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../models/ErrorResponse.model";

export function validateCreateRole(req: Request, res: Response, next: NextFunction) {
  if (!req.body) {
    res.status(400).json(new ErrorResponse(400, "Reqest Body Expected", new Error()));
    return;
  }
  const errors: { [key: string]: { [key: string]: string } } = {};
  if (!req.body.rolename) {
    errors["rolename"] = { required: "field `rolename` is required" };
  }
  if (Object.entries(errors).length > 0) {
    res.status(400).json(new ErrorResponse(400, "Validation(s) failed", new Error(), errors));
  } else {
    next();
  }
}
