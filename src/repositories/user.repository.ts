import { db } from "../database/database.connection";
import { users as usersTable } from "../entities/User.entity";
import { User as UserModel } from "../models/User.model";
import ErrorCode from "../enums/errorcodes.enum";
import { Exception } from "../exceptions/app.exception";
// import { toUserDTO, toUserEntity } from "../mappers/user.mapper";
import { eq } from "drizzle-orm";

export async function insertOne(user: UserModel) {
  try {
    const inserted = await db
      .insert(usersTable)
      .values(user as any)
      .$returningId();
    if (!inserted) {
      throw new Exception(
        ErrorCode.USER_INSERTION_FAILED,
        "Error Inserting User",
        user
      );
    }
    return inserted;
  } catch (err: Error | any) {
    if (err instanceof Exception) throw err;
    throw new Exception(
      ErrorCode.USER_INSERTION_FAILED,
      err?.message || "Error Inserting User",
      err
    );
  }
}

export async function findById(id: string) {
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));
    if (!user) {
      throw new Exception(ErrorCode.USER_NOT_EXIST, "User does not Exists", id);
    }
    return user;
  } catch (err: Exception | Error | any) {
    if (err instanceof Exception) throw err;
    throw new Exception(
      ErrorCode.ERROR_FETCHNG_DATA,
      err?.message || "Error Fetching User Data",
      err || id
    );
  }
}

export async function insertUsers(users: Array<UserModel>) {
  try {
    const inserted = await db.insert(usersTable).values(users as any);
    // if (!inserted || inserted.length === 0) {
    //   throw new Exception(
    //     ErrorCode.USER_INSERTION_FAILED,
    //     "Error Inserting Users",
    //     users
    //   );
    // }
    return inserted;
  } catch (err: Exception | Error | any) {
    if (err instanceof Exception) throw err;
    throw new Exception(
      ErrorCode.ERROR_FETCHNG_DATA,
      err?.message || "Error Inserting Users",
      err || users
    );
  }
}

export async function findByUsername(username: string, password?: boolean) {
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username));
    console.log(user);
    if (!user) {
      throw new Exception(
        ErrorCode.USER_NOT_EXIST,
        "User does not Exists",
        username
      );
    }
    return user;
  } catch (err: Error | any) {
    if (err instanceof Exception) throw err;
    throw new Exception(
      ErrorCode.ERROR_FETCHNG_DATA,
      err?.message || "Error Fetching User Data",
      err || username
    );
  }
}

export async function findAll(options: { page: number; size: number }) {
  try {
    const users = await db
      .select()
      .from(usersTable)
      .offset((options.page - 1) * options.size)
      .limit(options.size);
    if (!users) {
      throw new Exception(ErrorCode.USER_NOT_EXIST, "Error Getting all users");
    }
    return users;
  } catch (err: Error | any) {
    if (err instanceof Exception) throw err;
    throw new Exception(
      ErrorCode.ERROR_FETCHNG_DATA,
      err?.message || "Error Fetching Users",
      err
    );
  }
}
