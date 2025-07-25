import { GameStatus } from "../../lib/chess/games.enum";
import { Game as GameModel } from "../game/Game.model.ts";

export interface GameMatch {
  status: GameStatus;
  userId: string;
  playerConnection: string;
  opponentConnection?: string;
  opponentId?: string;
  game?: GameModel;
}
