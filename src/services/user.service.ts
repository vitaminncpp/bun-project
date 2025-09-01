import { User as UserModel } from "../models/User.model";
import * as userReposiotry from "../repositories/user.repository";
import * as tokenService from "./token.service";
import * as envService from "./env.service";
export async function createUser(user: UserModel): Promise<UserModel> {
  const hash = await tokenService.hash(
    user.password!,
    envService.getPasswordSalt()
  );
  user.password = hash;
  const savedUser: UserModel = await userReposiotry.insertOne(user);
  delete savedUser.password;
  return savedUser;
}

export async function getAllUsers(
  options: {
    page: number;
    size: number;
  } = { page: 1, size: 10 }
): Promise<UserModel[]> {
  return userReposiotry.findAll(options);
}

export async function getUser(id: string): Promise<UserModel> {
  return userReposiotry.findById(id);
}

export async function addUsers(users: Array<UserModel>) {
  const promises: Array<Promise<UserModel>> = users.map(async (user) => {
    user.password = await tokenService.hash(
      user.password!,
      envService.getPasswordSalt()
    );
    return user;
  });
  await Promise.all(promises);
  return userReposiotry.insertUsers(users);
}
