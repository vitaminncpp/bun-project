import type { Context, Next } from "hono";
import ErrorResponse from "../models/ErrorResponse.model";
import ErrorCode from "../enums/errorcodes.enum";

export async function validateUploadfile(c: Context, next: Next) {
  const blob = await c.req.blob();
  if (blob.size === 0) {
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
  const contentType = c.req.header("content-type");
  if (contentType !== "application/zip") {
    errors["file"] = { file_format: "`zip` file format is expected" };
  }
  const project = c.req.query("project");
  if (!project) {
    errors["project"] = { required: "`project` query param is required" };
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

export async function validateConnectionId(c: Context, next: Next) {
  const connectionId: string | undefined = c.req.query("connectionId");
  const errors: { connectionId?: { required: string } } = {};
  if (!connectionId) {
    errors.connectionId = { required: "`connectionId` is required" };
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
