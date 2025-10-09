import { User as UserModel } from "../models/User.model";
import { Game } from "../lib/chess/game";
import { Game as GameModel } from "../models/game/Game.model";

// connectionId => User data
export const pendingRequests: Map<string, UserModel> = new Map<string, UserModel>();

// gameId => Game Live Game
export const activeGames: Map<
  string,
  {
    game: Game;
    gameModel: GameModel;
  }
> = new Map<
  string,
  {
    game: Game;
    gameModel: GameModel;
  }
>();
