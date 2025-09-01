import type { Context, Next } from "hono";
import ErrorResponse from "../models/ErrorResponse.model";
import ErrorCode from "../enums/errorcodes.enum";

export async function validateStartGame(c: Context, next: Next) {
  const connectionId = c.req.query("connectionId");
  const errors: { [key: string]: { [key: string]: string } } = {};
  if (!connectionId) {
    errors["connectionId"] = {
      required: "query param `connectionId` is required",
    };
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
  await next();
}
