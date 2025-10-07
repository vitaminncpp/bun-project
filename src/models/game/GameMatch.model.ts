import { GameStatus, PLAYER } from "../../lib/chess/games.enum";
import { Game as GameModel } from "../game/Game.model";

export interface GameMatch {
  status: GameStatus;
  userId: string;
  connectionW?: string;
  connectionB?: string;
  connectionId: string;
  game?: GameModel;
  turn?: PLAYER;
}
