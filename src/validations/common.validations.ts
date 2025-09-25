import type { Context, Next } from "hono";
import ErrorResponse from "../models/ErrorResponse.model";
import ErrorCode from "../enums/errorcodes.enum";
import { validateObjectFields } from "../utils/validationFields";
import { Exception } from "../exceptions/app.exception";

export async function validateUploadFile(c: Context, next: Next) {
  const blob = await c.req.blob();
  if (blob.size === 0) {
    return c.json(
      new ErrorResponse(ErrorCode.VALIDATION_FAILED, 400, "Request Body Expected", new Error()),
      400,
    );
  }
  const errors: { [key: string]: { [key: string]: string } } = {};
  const contentType = c.req.header("content-type");
  if (contentType !== "application/zip") {
    errors["file"] = { file_format: "`zip` file format is expected" };
  }
  const projectId = c.req.query("projectId");
  if (!projectId) {
    errors["projectId"] = { required: "`projectId` query param is required" };
  }
  if (Object.keys(errors).length > 0) {
    return c.json(
      new ErrorResponse(
        ErrorCode.VALIDATION_FAILED,
        400,
        "Validation(s) failed",
        new Error(),
        errors,
      ),
      400,
    );
  }
  await next();
}

export async function validateConnectionId(c: Context, next: Next) {
  const queries = c.req.query();
  const { valid, errors } = validateObjectFields(queries, ["connectionId"]);
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
