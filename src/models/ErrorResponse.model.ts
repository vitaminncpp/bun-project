import type ErrorCode from "../enums/errorcodes.enum";
import { Exception } from "../exceptions/app.exception";

interface ErrorDescription {
  message: string;
  stack: string[];
}

export default class ErrorResponse {
  private isSuccessful = false as const;
  public status: number;
  public error: string;
  public description: ErrorDescription = {} as ErrorDescription;
  public trace: string[];
  public data?: any;
  public code: ErrorCode;
  constructor(code: ErrorCode, status: number, error: string, err: Exception | Error, data?: any) {
    ((this.code = code), (this.status = status));
    this.error = error;
    this.data = data;
    this.trace = new Error()
      .stack!.split("\n")
      .splice(2)
      .map((e) => e.trim());

    if (!err) err = new Error();
    this.description.message = err.message;
    this.description.stack = err
      .stack!.split("\n")
      .splice(1)
      .map((e) => e.trim())!;
  }
}
