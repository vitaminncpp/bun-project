import { GameStatus } from "../../lib/chess/games.enum";
import { User as UserModel } from "../User.model";

export interface GameMatch {
  status: GameStatus;
  userId: string;
  playerConnection: string;
  opponentConnection?: string;
  opponentId?: string;
}
