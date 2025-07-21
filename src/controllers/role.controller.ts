import { Request, Response } from "express";
import * as roleService from "../services/role.service";
import SuccessResponse from "../models/SuccessResponse.model";
import { Role as RoleModel } from "../models/Role.model";

export async function getAllRoles(req: Request, res: Response) {
  let options = undefined;
  const page = req.query.page;
  const size = req.query.size;
  if (page && size) {
    options = {
      page: Number(page),
      size: Number(size),
    };
  }
  const roles = await roleService.getAllRoles(options);
  res.status(200).json(new SuccessResponse(200, "All users fetched successfully", roles));
}
export async function getRole(req: Request, res: Response) {
  const roleId = req.params.id;
  const role = await roleService.getRole(roleId);
  res.status(200).json(new SuccessResponse(200, "All users fetched successfully", role));
}
export async function createRole(req: Request, res: Response) {
  const role: RoleModel = await roleService.createRole(req.body.rolename, req.body.description);
  res.status(200).json(new SuccessResponse(200, "All users fetched successfully", role));
}
export function updateRole(req: Request, res: Response) {}
export function deleteRole(req: Request, res: Response) {}
