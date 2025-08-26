import type { Context, Next } from "hono";
import ErrorResponse from "../models/ErrorResponse.model";
import ErrorCode from "../enums/errorcodes.enum";

export async function validateCreateProject(c: Context, next: Next) {
  const body = await c.req.json().catch(() => null);
  if (!body) {
    return c.json(
      new ErrorResponse(
        ErrorCode.VALIDATION_FAILED,
        400,
        "Request Body must be a non-empty array of objects",
        new Error()
      ),
      400
    );
  }
  const errors: { [key: string]: { [key: string]: string } } = {};
  if (!body.name) {
    errors["name"] = { required: "field `name` is required" };
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
