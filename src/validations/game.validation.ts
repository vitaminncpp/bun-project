import type { Context, Next } from "hono";
import ErrorResponse from "../models/ErrorResponse.model";
import ErrorCode from "../enums/errorcodes.enum";

export async function validateStartGame(c: Context, next: Next) {
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
  if (!body.connectionId) {
    errors["connectionId"] = { required: "field `connectionId` is required" };
  }
  if (Object.entries(errors).length > 0) {
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
  c.set("body", body);
  await next();
}
