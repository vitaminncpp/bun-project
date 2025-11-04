import { User as UserModel } from "../models/User.model";
import * as userRepository from "../repositories/user.repository";
import * as tokenService from "../services/token.service";
import * as envService from "../services/env.service";

export async function createUser(user: UserModel): Promise<UserModel> {
  user.password = await tokenService.hash(user.password!, envService.getPasswordSalt());
  const savedUser: UserModel = await userRepository.insertOne(user);
  delete savedUser.password;
  return savedUser;
}

export async function getAllUsers(
  options: {
    page: number;
    size: number;
  } = { page: 1, size: 10 },
): Promise<UserModel[]> {
  return userRepository.findAll(options);
}

export async function getUser(username: string, password: boolean = false): Promise<UserModel> {
  return userRepository.findByUsername(username, password);
}

export async function getUserById(id: string): Promise<UserModel> {
  return userRepository.findById(id);
}

export async function addUsers(users: Array<UserModel>) {
  const promises: Array<Promise<UserModel>> = users.map(async (user) => {
    user.password = await tokenService.hash(user.password!, envService.getPasswordSalt());
    return user;
  });
  await Promise.all(promises);
  return userRepository.insertUsers(users);
}
