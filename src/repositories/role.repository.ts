import { Role as RoleEntity } from "../entities/Role.entity";
import { Role as RoleModel } from "../models/Role.model";
import { Exception } from "../exceptions/app.exception";
import ErrorCode from "../enums/errorcodes.enum";
import { toRoleDTO, toRoleEntity } from "../mappers/role.mapper";

export async function findAll(options: { page: number; size: number }): Promise<RoleModel[]> {
  try {
    const roles = await RoleEntity.findAll({
      offset: (options.page - 1) * options.size,
      limit: options.size,
    });
    if (!roles) {
      throw new Exception(ErrorCode.ROLE_NOT_EXIST, "Error Getting all Roles");
    }
    return roles.map((_r) => toRoleDTO(_r));
  } catch (err: Error | any) {
    if (err instanceof Exception) {
      throw err;
    }
    throw new Exception(ErrorCode.ERROR_FETCHNG_DATA, err?.message || "Error Fetching Roles", err);
  }
}

export async function findById(id: string): Promise<RoleModel> {
  try {
    const user = await RoleEntity.findByPk(id);
    if (!user) {
      throw new Exception(ErrorCode.ROLE_NOT_EXIST, "Role does not Exists", id);
    }
    return toRoleDTO(user);
  } catch (err: Error | any) {
    if (err instanceof Exception) {
      throw err;
    }
    throw new Exception(
      ErrorCode.ERROR_FETCHNG_DATA,
      err?.message || "Error Fetching Role Data",
      err || id
    );
  }
}

export async function insertOne(role: RoleModel): Promise<RoleModel> {
  try {
    const roleSaved: RoleEntity = await toRoleEntity(role).save();
    return toRoleDTO(roleSaved);
  } catch (err: Error | any) {
    throw new Exception(
      ErrorCode.ROLE_INSERTION_FAILED,
      err?.message || "Error Inserting Role",
      err
    );
  }
}
