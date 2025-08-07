import type { Context, Next } from "hono";
import { Exception } from "../exceptions/app.exception";
import ErrorResponse from "../models/ErrorResponse.model";
import ErrorCode from "../enums/errorcodes.enum";
import type { StatusCode } from "hono/utils/http-status";

export async function errorHandler(err: Error, c: Context) {
  let status: StatusCode = 500;
  let errorMsg = "Internal Server Error";
  let data = c.req.json ? await c.req.json().catch(() => ({})) : {};
  let code!: ErrorCode;

  if (err instanceof Exception) {
    code = err.code;
    errorMsg = err.message;
    data = err.data || data;
    switch (err.code) {
      case ErrorCode.USERNAME_NOT_EXIST:
      case ErrorCode.USER_NOT_EXIST:
      case ErrorCode.ROLE_NOT_EXIST:
      case ErrorCode.REQUEST_NOT_FOUND:
      case ErrorCode.INVALID_GAME_ID:
        status = 404;
        break;
      case ErrorCode.INVALID_PASSWORD:
      case ErrorCode.INVALID_TOKEN:
        status = 401;
        break;
      case ErrorCode.USERNAME_ALREADY_PRESENT:
      case ErrorCode.REQUEST_ALREADY_PROCESSING:
        status = 409;
        break;
      case ErrorCode.INVALID_CONNECTION_ID:
        status = 412;
        break;
      case ErrorCode.RECORD_INSERTION_FAILED:
      case ErrorCode.ROLE_INSERTION_FAILED:
      case ErrorCode.USER_INSERTION_FAILED:
      case ErrorCode.GAME_UPDATE_FAILED:
        status = 500;
        break;
      default:
        status = 500;
        break;
    }
  } else if (err instanceof Error) {
    code = ErrorCode.INTERNAL_SERVER_ERROR;
    errorMsg = err.message;
    status = 500;
  }
  c.status(status);
  return c.json(new ErrorResponse(code, status, errorMsg, err, data));
}

export function error404(c: Context) {
  const message = "Resource Not found";
  return c.json(
    new ErrorResponse(
      ErrorCode.RESOURCE_NOT_FOUND,
      404,
      message,
      new Error(message),
      {
        resource: c.req.path,
        method: c.req.method,
      }
    ),
    404
  );
}
