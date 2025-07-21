import { GameSatus } from "../../lib/chess/games.enum";
import { User as UserModel } from "../User.model";

export interface GameMatch {
  status: GameSatus;
  connectionId: string;
  opponent?: UserModel;
}
