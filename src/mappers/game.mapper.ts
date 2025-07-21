import { Game as GameModel } from "../models/game/Game.model";
import { Game as GameEntity } from "../entities/Game.entity";

export function toGameEntity(user: GameModel): GameEntity {
  return GameEntity.build({ ...user, id: user.id || undefined } as any);
}

export function toGameDTO(entity: GameEntity): GameModel {
  return GameModel.from(entity.dataValues);
}
