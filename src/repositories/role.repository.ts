import { db } from "../database/database.connection";
import { roles } from "../entities/Role.entity";
import { Role as RoleModel } from "../models/Role.model";
import { Exception } from "../exceptions/app.exception";
import ErrorCode from "../enums/errorcodes.enum";
import { toRoleDTO, toRoleEntity } from "../mappers/role.mapper";
import { eq } from "drizzle-orm";

export async function findAll(options: {
  page: number;
  size: number;
}): Promise<RoleModel[]> {
  try {
    const offset = (options.page - 1) * options.size;
    const result = await db
      .select()
      .from(roles)
      .offset(offset)
      .limit(options.size);
    if (!result || result.length === 0) {
      throw new Exception(ErrorCode.ROLE_NOT_EXIST, "Error Getting all Roles");
    }
    return result.map((_r) => toRoleDTO(_r));
  } catch (err) {
    handleRepositoryError(
      err,
      ErrorCode.ERROR_FETCHING_DATA,
      "Error Fetching Roles"
    );
  }
}

export async function findById(id: string): Promise<RoleModel> {
  try {
    const result = await db.select().from(roles).where(eq(roles.id, id));
    const role = result[0];
    if (!role) {
      throw new Exception(ErrorCode.ROLE_NOT_EXIST, "Role does not Exists", id);
    }
    return toRoleDTO(role);
  } catch (err) {
    handleRepositoryError(
      err,
      ErrorCode.ERROR_FETCHING_DATA,
      "Error Fetching Role Data",
      id
    );
  }
}

export async function insertOne(role: RoleModel): Promise<RoleModel> {
  try {
    const entity = toRoleEntity(role);
    const result = await db.insert(roles).values(entity).returning();
    if (!result || result.length === 0) {
      throw new Exception(
        ErrorCode.ROLE_INSERTION_FAILED,
        "Error Inserting Role"
      );
    }
    return toRoleDTO(result[0]);
  } catch (err) {
    handleRepositoryError(
      err,
      ErrorCode.ROLE_INSERTION_FAILED,
      "Error Inserting Role"
    );
  }
}

function handleRepositoryError(
  err: unknown,
  defaultErrorCode: ErrorCode,
  defaultMessage: string,
  context?: any
): never {
  if (err instanceof Exception) {
    throw err;
  }

  const error = err as Error;
  throw new Exception(
    defaultErrorCode,
    error?.message || defaultMessage,
    context || err
  );
}
