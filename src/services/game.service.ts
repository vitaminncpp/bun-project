import { User as UserModel } from "../models/User.model";
import { pendingRequests } from "../sessions/game.session";
import { activeConnections } from "../sessions/socket.session";
import Logger from "../utils/logger";
import Constants from "../constants/constants";
import { GameStatus } from "../lib/chess/games.enum";
import type { GameMatch } from "../models/game/GameMatch.model";
import { Exception } from "../exceptions/app.exception";
import ErrorCode from "../enums/errorcodes.enum";
import { Game as GameModel } from "../models/game/Game.model";
import * as gameRepository from "../repositories/game.repository";

export function findMatch(user: UserModel, guest?: boolean): GameMatch {
  const connectionId = user.metaInfo.connectionId;
  Logger.debug("Size of Map", pendingRequests.size);
  if (pendingRequests.size === 0) {
    if (!activeConnections.has(connectionId)) {
      throw new Exception(
        ErrorCode.BAD_CONNECTION,
        "No Associated Socket Connection Found",
        {
          connectionId,
          user,
        }
      );
    }
    pendingRequests.set(connectionId, {
      socket: activeConnections.get(connectionId)!,
      user,
    });
    return { status: GameStatus.PENDING, connectionId };
  } else {
    const [match] = [...pendingRequests.values()];
    if (connectionId === match!.user.metaInfo.connectionId) {
      throw new Exception(
        ErrorCode.REQUEST_ALREADY_PROCESSING,
        "Request is Already in progress ! Please wait..",
        { connectionId, user }
      );
    }
    match!.socket.emit(Constants.MATCH_FOUND, { opponent: user });
    Logger.debug("Matched", match);
    activeConnections
      .get(connectionId)!
      .emit(Constants.MATCH_FOUND, { opponent: match!.user });
    Logger.debug("Match Found", match!.user);
    pendingRequests.delete(match!.user.metaInfo.connectionId);
    startGame(user, match!.user);
    return { status: GameStatus.ACTIVE, opponent: match!.user, connectionId };
  }
}

export function cancelRequest(connectionId: string): GameMatch {
  if (!pendingRequests.has(connectionId)) {
    throw new Exception(ErrorCode.REQUEST_NOT_FOUND, "Request Not found", {
      connectionId,
    });
  }
  pendingRequests.delete(connectionId);
  return { status: GameStatus.CANCELED, connectionId };
}

function startGame(user1: UserModel, user2: UserModel) {
  const game = new GameModel();
  const players = toss(user1, user2);

  game.playerW = players.white.id!;
  game.playerB = players.black.id!;

  const startedGame: GameModel = gameRepository.insertOne(game);
}

function toss(
  user1: UserModel,
  user2: UserModel
): {
  white: UserModel;
  black: UserModel;
} {
  const white = Math.random() < 0.5 ? user1 : user2;
  const black = white === user1 ? user2 : user1;
  return { white, black };
}
