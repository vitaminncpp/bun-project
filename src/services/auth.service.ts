import ErrorCode from "../enums/errorcodes.enum";
import { Exception } from "../exceptions/app.exception";
import AuthToken from "../models/AuthToken.model";
import * as userRepository from "../repositories/user.repository";
import * as tokenService from "../services/token.service";
import { User as UserModel } from "../models/User.model";
import * as envService from "./env.service";

export async function login(
  username: string,
  password: string
): Promise<AuthToken> {
  const salt = envService.getPasswordSalt();

  const user = await userRepository.findByUsername(username, true);
  const saltedPassword = password + salt;
  const match = await tokenService.comparePass(saltedPassword, user.password!);
  if (!match)
    throw new Exception(ErrorCode.INVALID_PASSWORD, "Invalid Password", {
      username: user.username,
    });
  delete user.password;
  const accessSecret = envService.getAccessSecret();
  const refreshSecret = envService.getRefreshSecret();

  const accessToken = tokenService.generateToken(
    user,
    accessSecret,
    envService.getAccessExpire()
  );
  const refreshToken = tokenService.generateToken(
    user,
    refreshSecret,
    envService.getRefreshExpire()
  );

  return new AuthToken(accessToken, refreshToken, user);
}

export function refreshToken(refreshToken: string): AuthToken {
  const accessSecret = envService.getAccessSecret();
  const refreshSecret = envService.getRefreshSecret();
  const payload: any = tokenService.verifyToken(refreshToken, refreshSecret);
  delete payload.iat;
  delete payload.exp;
  const user: UserModel = { ...payload } as UserModel;
  const accessToken: string = tokenService.generateToken(
    user,
    accessSecret,
    envService.getRefreshExpire()
  );
  return new AuthToken(accessToken, "", user);
}

export function authenticate(token: string): UserModel {
  const accessSecret = envService.getAccessSecret();
  return tokenService.verifyToken(token, accessSecret);
}
