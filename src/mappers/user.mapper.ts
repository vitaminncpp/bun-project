import { User as UserModel } from "../models/User.model";
import { User as UserEntity } from "../entities/User.entity";

// In a mapper utility
export function toUserEntity(user: UserModel): UserEntity {
  return UserEntity.build(user as any);
}

export function toUserDTO(entity: UserEntity, password?: boolean): UserModel {
  return UserModel.from({ ...entity.dataValues, password: password ? entity.password : null });
}
