import type { Context } from "hono";
import SuccessResponse from "../models/SuccessResponse.model";
import * as userService from "./user.service";
import { User as UserModel } from "../models/User.model";

export async function getAllUsers(c: Context) {
  let options = undefined;
  const page = c.req.query("page");
  const size = c.req.query("size");
  if (page && size) {
    options = {
      page: Number(page),
      size: Number(size),
    };
  }
  const users = await userService.getAllUsers(options);
  return c.json(
    new SuccessResponse<UserModel[]>(200, "All users fetched successfully", users),
    200,
  );
}

export async function updateUser(c: Context) {
  // You may want to implement update logic here
  return c.json(c.req.param(), 200);
}

export async function getUser(c: Context) {
  const user = await userService.getUserById(c.req.param("id"));
  return c.json(new SuccessResponse<UserModel>(200, "User info fetched successfully", user), 200);
}

export async function addUsers(c: Context) {
  const users: UserModel[] = await c.req.json();
  const records = await userService.addUsers(users);
  return c.json(
    new SuccessResponse<UserModel[]>(200, "User were Inserted successfully", records),
    200,
  );
}
