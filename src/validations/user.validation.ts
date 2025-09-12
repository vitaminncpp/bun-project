import type { Context, Next } from "hono";
import ErrorResponse from "../models/ErrorResponse.model";
import ErrorCode from "../enums/errorcodes.enum";
import { validateObjectFields } from "../utils/validationFields";
import { Exception } from "../exceptions/app.exception";

export async function validateGetUser(c: Context, next: Next) {
  const params = c.req.param();
  const { valid, errors } = validateObjectFields(params, ["id"]);
  if (valid) await next();
  else
    return c.json(
      new ErrorResponse(
        ErrorCode.VALIDATION_FAILED,
        400,
        "Validation(s) failed",
        new Exception(
          ErrorCode.VALIDATION_FAILED,
          "Validation(s) failed",
          errors
        ),
        errors
      ),
      400
    );
}

export async function validateAddUsers(c: Context, next: Next) {
  const body = await c.req.json().catch(() => null);
  if (!Array.isArray(body) || body.length === 0) {
    return c.json(
      new ErrorResponse(
        ErrorCode.VALIDATION_FAILED,
        400,
        "Request Body must be a non-empty array of objects",
        new Exception(
          ErrorCode.VALIDATION_FAILED,
          "Request Body must be a non-empty array of objects"
        )
      ),
      400
    );
  }
  const errors: Array<{
    index: number;
    errors: Record<string, Record<string, string>>;
  }> = [];
  body.forEach((item, idx) => {
    const validation = validateObjectFields(item, [
      "username",
      "name",
      "password",
    ]);
    if (!validation.valid) {
      errors.push({
        index: idx,
        errors: validation.errors!,
      });
    }
  });
  if (errors.length > 0) {
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
