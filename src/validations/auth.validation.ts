import type { Context, Next } from "hono";
import ErrorResponse from "../models/ErrorResponse.model";
import ErrorCode from "../enums/errorcodes.enum";

export async function validateRegistration(c: Context, next: Next) {
  const body = await c.req.json().catch(() => null);
  if (!body) {
    return c.json(
      new ErrorResponse(
        ErrorCode.VALIDATION_FAILED,
        400,
        "Request Body Expected",
        new Error()
      ),
      400
    );
  }
  const errors: { [key: string]: { [key: string]: string } } = {};
  if (!body.username) {
    errors["username"] = { required: "field `username` is required" };
  }
  if (!body.name) {
    errors["name"] = { required: "field `name` is required" };
  }
  if (!body.password) {
    errors["password"] = { required: "field `password` is required" };
  }
  if (Object.keys(errors).length > 0) {
    return c.json(
      new ErrorResponse(
        ErrorCode.VALIDATION_FAILED,
        400,
        "Validation(s) failed",
        new Error(),
        errors
      ),
      400
    );
  }
  await next();
}

export async function validateLogin(c: Context, next: Next) {
  const body = await c.req.json().catch(() => null);
  if (!body) {
    return c.json(
      new ErrorResponse(
        ErrorCode.VALIDATION_FAILED,
        400,
        "Request Body Expected",
        new Error()
      ),
      400
    );
  }
  const errors: { [key: string]: { [key: string]: string } } = {};
  if (!body.username) {
    errors["username"] = { required: "field `username` is required" };
  }
  if (!body.password) {
    errors["password"] = { required: "field `password` is required" };
  }
  if (Object.keys(errors).length > 0) {
    return c.json(
      new ErrorResponse(
        ErrorCode.VALIDATION_FAILED,
        400,
        "Validation(s) failed",
        new Error(),
        errors
      ),
      400
    );
  }
  await next();
}

export async function validateRefresh(c: Context, next: Next) {
  const body = await c.req.json().catch(() => null);
  if (!body) {
    return c.json(
      new ErrorResponse(
        ErrorCode.VALIDATION_FAILED,
        400,
        "Request Body Expected",
        new Error()
      ),
      400
    );
  }
  const errors: { [key: string]: { [key: string]: string } } = {};
  if (!body.refreshToken) {
    errors["refreshToken"] = { required: "field `refreshToken` is required" };
  }
  if (Object.keys(errors).length > 0) {
    return c.json(
      new ErrorResponse(
        ErrorCode.VALIDATION_FAILED,
        400,
        "Validation(s) failed",
        new Error(),
        errors
      ),
      400
    );
  }
  await next();
}
