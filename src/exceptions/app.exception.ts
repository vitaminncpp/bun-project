import ErrorCode from "../enums/errorcodes.enum";

export class Exception extends Error {
  public readonly code: ErrorCode;
  public readonly data: any;

  constructor(code: ErrorCode, message?: string, data?: any) {
    super(message || "Internal Server Error");
    this.name = "Exception";
    this.code = code;
    this.data = data;
    Object.setPrototypeOf(this, Exception.prototype);
  }
}
