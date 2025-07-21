import * as roleRepository from "../repositories/role.repository";
import { Role as RoleModel } from "../models/Role.model";

export async function getAllRoles(
  options: { page: number; size: number } = { page: 1, size: 10 }
): Promise<RoleModel[]> {
  return roleRepository.findAll(options);
}

export async function getRole(id: string): Promise<RoleModel> {
  return roleRepository.findById(id);
}

export async function createRole(rolename: string, description: string): Promise<RoleModel> {
  const role: RoleModel = RoleModel.from(
    {
      rolename,
      description,
    },
    true
  );
  return roleRepository.insertOne(role);
}
