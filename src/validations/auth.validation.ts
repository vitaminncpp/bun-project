import type { Context, Next } from "hono";
import ErrorResponse from "../models/ErrorResponse.model";
import ErrorCode from "../enums/errorcodes.enum";
import { validateObjectFields } from "../utils/validationFields";
import { Exception } from "../exceptions/app.exception";

export async function validateRegistration(c: Context, next: Next) {
  const body = await c.req.json().catch(() => null);
  const { valid, errors } = validateObjectFields(body, ["username", "name", "password"]);
  if (valid) await next();
  else
    return c.json(
      new ErrorResponse(
        ErrorCode.VALIDATION_FAILED,
        400,
        "Validation(s) failed",
        new Exception(ErrorCode.VALIDATION_FAILED, "Validation(s) failed", errors),
        errors,
      ),
      400,
    );
}

export async function validateLogin(c: Context, next: Next) {
  const body = await c.req.json().catch(() => null);
  const { valid, errors } = validateObjectFields(body, ["username", "password"]);
  if (valid) await next();
  else
    return c.json(
      new ErrorResponse(
        ErrorCode.VALIDATION_FAILED,
        400,
        "Validation(s) failed",
        new Exception(ErrorCode.VALIDATION_FAILED, "Validation(s) failed", errors),
        errors,
      ),
      400,
    );
}

export async function validateRefresh(c: Context, next: Next) {
  const body = await c.req.json().catch(() => null);
  const { valid, errors } = validateObjectFields(body, ["refreshToken"]);
  if (valid) await next();
  else
    return c.json(
      new ErrorResponse(
        ErrorCode.VALIDATION_FAILED,
        400,
        "Validation(s) failed",
        new Exception(ErrorCode.VALIDATION_FAILED, "Validation(s) failed", errors),
        errors,
      ),
      400,
    );
}
