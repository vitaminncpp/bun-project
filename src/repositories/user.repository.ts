import { User as UserEntity } from "../entities/User.entity";
import { User as UserModel } from "../models/User.model";
import ErrorCode from "../enums/errorcodes.enum";
import { Exception } from "../exceptions/app.exception";
import { toUserDTO, toUserEntity } from "../mappers/user.mapper";
import Logger from "../utils/logger";

export async function insertOne(user: UserModel): Promise<UserModel> {
  try {
    const userSaved: UserEntity = await toUserEntity(user).save();
    return toUserDTO(userSaved);
  } catch (err: Error | any) {
    if (err instanceof Exception) {
      throw err;
    }
    throw new Exception(
      ErrorCode.USER_INSERTION_FAILED,
      err?.message || "Error Inserting User",
      err
    );
  }
}

export async function findById(id: string): Promise<UserModel> {
  try {
    const user = await UserEntity.findByPk(id);
    if (!user) {
      throw new Exception(ErrorCode.USER_NOT_EXIST, "User does not Exists", id);
    }
    return toUserDTO(user);
  } catch (err: Exception | Error | any) {
    if (err instanceof Exception) {
      throw err;
    }
    throw new Exception(
      ErrorCode.ERROR_FETCHNG_DATA,
      err?.message || "Error Fetching User Data",
      err || id
    );
  }
}

export async function insertUsers(users: Array<UserModel>): Promise<Array<UserModel>> {
  try {
    const entries = await UserEntity.bulkCreate(users as any, {
      validate: true,
      returning: true,
    });
    if (!entries) {
      throw new Exception(ErrorCode.USER_INSERTION_FAILED, "Error Inserting Users", users);
    }
    return entries.map((user) => toUserDTO(user));
  } catch (err: Exception | Error | any) {
    if (err instanceof Exception) {
      throw err;
    }
    throw new Exception(
      ErrorCode.ERROR_FETCHNG_DATA,
      err?.message || "Error Inserting Users",
      err || users
    );
  }
}

export async function findByUsername(username: string, password?: boolean): Promise<UserModel> {
  try {
    const user = await UserEntity.findOne({ where: { username } });
    if (!user) {
      throw new Exception(ErrorCode.USER_NOT_EXIST, "User does not Exists", username);
    }
    return toUserDTO(user, password);
  } catch (err: Error | any) {
    if (err instanceof Exception) {
      throw err;
    }
    throw new Exception(
      ErrorCode.ERROR_FETCHNG_DATA,
      err?.message || "Error Fetching User Data",
      err || username
    );
  }
}

export async function findAll(opitons: { page: number; size: number }): Promise<UserModel[]> {
  try {
    const users = await UserEntity.findAll({
      offset: (opitons.page - 1) * opitons.size,
      limit: opitons.size,
    });
    if (!users) {
      throw new Exception(ErrorCode.USER_NOT_EXIST, "Error Getting all users");
    }
    return users.map((_u) => toUserDTO(_u));
  } catch (err: Error | any) {
    if (err instanceof Exception) {
      throw err;
    }
    throw new Exception(ErrorCode.ERROR_FETCHNG_DATA, err?.message || "Error Fetching Users", err);
  }
}
