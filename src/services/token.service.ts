import jwt from "jsonwebtoken";
import { Exception } from "../exceptions/app.exception";
import ErrorCode from "../enums/errorcodes.enum";
import type { StringValue } from "ms";
import bcrypt from "bcrypt";

export function generateToken(
  payload: any,
  secret: string,
  expiresIn: string | number
): string {
  let accessToken = "";
  try {
    accessToken = jwt.sign({ ...payload }, secret, {
      expiresIn: expiresIn as StringValue | number,
    });
  } catch (err: Error | any) {
    throw new Exception(ErrorCode.INTERNAL_SERVER_ERROR, err?.message, payload);
  }

  return accessToken;
}

export function verifyToken(token: string, secret: string): any {
  try {
    const payload = jwt.verify(token, secret);
    if (!payload) {
      throw new Exception(ErrorCode.INVALID_TOKEN, "Invalid Token", token);
    }
    return payload;
  } catch (err: Error | any) {
    if (err instanceof Exception) {
      throw err;
    }
    throw new Exception(ErrorCode.INTERNAL_SERVER_ERROR, err?.message, err);
  }
}

export async function hash(password: string, salt: string): Promise<string> {
  const saltedPassword = password + salt;
  return (await bcrypt.hash(saltedPassword, 10)) as string;
}

export async function comparePass(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
