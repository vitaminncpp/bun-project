import { Request, Response } from "express";
import SuccessResponse from "../models/SuccessResponse.model";
import * as userService from "../services/user.service";
import { User as UserModel } from "../models/User.model";

export async function getAllUsers(req: Request, res: Response) {
  let options = undefined;
  const page = req.query.page;
  const size = req.query.size;
  if (page && size) {
    options = {
      page: Number(page),
      size: Number(size),
    };
  }
  const users = await userService.getAllUsers(options);
  res.status(200).json(new SuccessResponse(200, "All users fetched successfully", users));
}

export async function updateUser(req: Request, res: Response) {
  res.status(200).json(req.params);
}

export async function getUser(req: Request, res: Response) {
  const user = await userService.getUser(req.params.id as string);
  res.status(200).json(new SuccessResponse(200, "User info fetched successfully", user));
}

export async function addUsers(req: Request, res: Response) {
  const users: UserModel[] = req.body;
  const records = await userService.addUsers(users);
  res.status(200).json(new SuccessResponse(200, "User were Inserted successfully", records));
}
