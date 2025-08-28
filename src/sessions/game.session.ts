import { Socket } from "socket.io";
import { User as UserModel } from "../models/User.model";
import { Game } from "../lib/chess/game";
import { Game as GameModel } from "../models/game/Game.model";

// connectionId => Socket and User data
export const pendingRequests: Map<string, { socket: Socket; user: UserModel }> = new Map<
  string,
  { socket: Socket; user: UserModel }
>();

// gameId => Game Live Game
export const activeGames: Map<string, {
  game: Game;
  gameModel: GameModel;
}> = new Map<string, {
  game: Game;
  gameModel: GameModel;
}
>();