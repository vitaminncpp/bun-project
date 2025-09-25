import ErrorCode from "../enums/errorcodes.enum";
import { Exception } from "../exceptions/app.exception";
import AuthToken from "../models/AuthToken.model";
import * as userService from "../services/user.service";
import * as tokenService from "../services/token.service";
import { User as UserModel } from "../models/User.model";
import * as envService from "./env.service";

export async function login(username: string, password: string): Promise<AuthToken> {
  const salt = envService.getPasswordSalt();

  const user = await userService.getUser(username, true);
  const saltedPassword = password + salt;
  const match = await tokenService.comparePass(saltedPassword, user.password!);
  if (!match)
    throw new Exception(ErrorCode.INVALID_PASSWORD, "Invalid Password", {
      username: user.username,
    });
  delete user.password;
  return generateTokens(user);
}

export async function register(user: UserModel): Promise<AuthToken> {
  const savedUser = await userService.createUser(user);
  delete savedUser.password;
  return generateTokens(savedUser);
}

export function refreshToken(refreshToken: string): AuthToken {
  const accessSecret = envService.getAccessSecret();
  const refreshSecret = envService.getRefreshSecret();
  const payload = tokenService.verifyToken(refreshToken, refreshSecret);
  const user: UserModel = UserModel.from(payload);
  const accessToken: string = tokenService.generateToken(
    user,
    accessSecret,
    envService.getRefreshExpire(),
  );
  return new AuthToken(accessToken, "", user);
}

export function authenticate(token: string): UserModel {
  const accessSecret = envService.getAccessSecret();
  return tokenService.verifyToken(token, accessSecret);
}

export async function generateTokens(payload: any) {
  const accessSecret = envService.getAccessSecret();
  const refreshSecret = envService.getRefreshSecret();

  const accessToken = tokenService.generateToken(
    payload,
    accessSecret,
    envService.getAccessExpire(),
  );
  const refreshToken = tokenService.generateToken(
    payload,
    refreshSecret,
    envService.getRefreshExpire(),
  );

  return new AuthToken(accessToken, refreshToken, payload);
}
