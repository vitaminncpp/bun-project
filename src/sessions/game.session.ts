import { Socket } from "socket.io";
import { User as UserModel } from "../models/User.model";
import { Game } from "../lib/chess/Game";

export const pendingRequests: Map<string, { socket: Socket; user: UserModel }> = new Map<
  string,
  { socket: Socket; user: UserModel }
>();

export const activeGames: Map<
  string,
  {
    playerW: UserModel;
    playerB: UserModel;
    game: Game;
  }
> = new Map<
  string,
  {
    playerW: UserModel;
    playerB: UserModel;
    game: Game;
  }
>();
