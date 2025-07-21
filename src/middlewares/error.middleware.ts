import { Request, Response, NextFunction } from "express";
import { Exception } from "../exceptions/app.exception";
import ErrorResponse from "../models/ErrorResponse.model";
import ErrorCode from "../enums/errorcodes.enum";

export function errorHandler(
  err: Exception | Error | any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(err);
  }
  let status = 500;
  let errorMsg = "Internal Server Error";
  let data = req.body;

  if (err instanceof Exception) {
    errorMsg = err.message;
    data = err.data || req.body;
    switch (err.code) {
      case ErrorCode.USERNAME_NOT_EXIST:
      case ErrorCode.USER_NOT_EXIST:
      case ErrorCode.ROLE_NOT_EXIST:
      case ErrorCode.REQUEST_NOT_FOUND:
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
      case ErrorCode.BAD_CONNECTION:
        status = 412;
        break;
      case ErrorCode.USER_INSERTION_FAILED:
      case ErrorCode.ROLE_INSERTION_FAILED:
        status = 500;
        break;
      default:
        status = 500;
        break;
    }
  } else if (err instanceof Error) {
    errorMsg = err.message;
    status = 500;
  }

  res.status(status).json(new ErrorResponse(status, errorMsg, err, data));
}

export function error404(req: Request, res: Response) {
  const message = "Resource Not found";
  res.status(404).json(
    new ErrorResponse(404, message, new Error(message), {
      resource: req.url,
      method: req.method,
    })
  );
}
