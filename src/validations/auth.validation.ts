import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../models/ErrorResponse.model";

export function validateRegistration(req: Request, res: Response, next: NextFunction) {
  if (!req.body) {
    res.status(400).json(new ErrorResponse(400, "Reqest Body Expected", new Error()));
    return;
  }
  const errors: { [key: string]: { [key: string]: string } } = {};
  if (!req.body.username) {
    errors["username"] = { required: "field `username` is required" };
  }
  if (!req.body.name) {
    errors["name"] = { required: "field `name` is required" };
  }
  if (!req.body.password) {
    errors["password"] = { required: "field `password` is required" };
  }
  if (Object.entries(errors).length > 0) {
    res.status(400).json(new ErrorResponse(400, "Validation(s) failed", new Error(), errors));
  } else {
    next();
  }
}

export function validateLogin(req: Request, res: Response, next: NextFunction) {
  if (!req.body) {
    res.status(400).json(new ErrorResponse(400, "Reqest Body Expected", new Error()));
    return;
  }
  const errors: { [key: string]: { [key: string]: string } } = {};
  if (!req.body.username) {
    errors["username"] = { required: "field `username` is required" };
  }
  if (!req.body.password) {
    errors["password"] = { required: "field `password` is required" };
  }
  if (Object.entries(errors).length > 0) {
    res.status(400).json(new ErrorResponse(400, "Validation(s) failed", new Error(), errors));
  } else {
    next();
  }
}

export function validateRefresh(req: Request, res: Response, next: NextFunction) {
  if (!req.body) {
    res.status(400).json(new ErrorResponse(400, "Reqest Body Expected", new Error()));
    return;
  }
  const body = req.body;
  const errors: { [key: string]: { [key: string]: string } } = {};
  if (!body.refreshToken) {
    errors["refreshToken"] = { required: "field `refreshToken` is required" };
  }
  if (Object.entries(errors).length > 0) {
    res.status(400).json(new ErrorResponse(400, "Validation(s) failed", new Error(), errors));
  } else {
    next();
  }
}
