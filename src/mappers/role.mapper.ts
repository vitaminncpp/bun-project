import { Role as RoleModel } from "../models/Role.model";
import { Role as RoleEntity } from "../entities/Role.entity";

export function toRoleEntity(role: RoleModel): RoleEntity {
  return RoleEntity.build(role as any);
}

export function toRoleDTO(entity: RoleEntity): RoleModel {
  return RoleModel.from(entity.dataValues);
}
