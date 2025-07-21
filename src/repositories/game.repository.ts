import { Game as GameEntity } from "../entities/Game.entity";
import { Game as GameModel } from "../models/game/Game.model";

export function insertOne(game: GameModel): GameModel {
  return game;
}
