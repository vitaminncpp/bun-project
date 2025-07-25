import { User as UserModel } from "../models/User.model";
import { pendingRequests } from "../sessions/game.session";
import { activeConnections } from "../sessions/socket.session";
import Constants from "../constants/constants";
import { GameStatus } from "../lib/chess/games.enum";
import type { GameMatch } from "../models/game/GameMatch.model";
import { Exception } from "../exceptions/app.exception";
import ErrorCode from "../enums/errorcodes.enum";
import { Game as GameModel } from "../models/game/Game.model";
import * as gameRepository from "../repositories/game.repository";
import { Game } from "../lib/chess/Game";

export function findMatch(user: UserModel, connectionId: string, guest?: boolean): GameMatch {
  if (pendingRequests.size === 0) {
    if (!activeConnections.has(connectionId)) {
      throw new Exception(
        ErrorCode.INVALID_CONNECTION_ID,
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
    return { status: GameStatus.PENDING, playerConnection: connectionId, userId: user.id! };
  } else {
    const [match] = pendingRequests.entries();
    if (connectionId === match![0]!) {
      throw new Exception(
        ErrorCode.REQUEST_ALREADY_PROCESSING,
        "Request is Already in progress ! Please wait..",
        { connectionId, user }
      );
    }
    match![1].socket.emit(Constants.MATCH_FOUND, { opponentConnection: connectionId, opponent: user });
    activeConnections
      .get(connectionId)!
      .emit(Constants.MATCH_FOUND, { opponentConnection: match![0], opponent: match![1].user });
    pendingRequests.delete(match![0]!);
    startGame(user, match![1].user);
    return { status: GameStatus.ACTIVE, playerConnection: connectionId, opponentConnection: match![0], userId: user.id!, opponentId: match![1].user.id! };
  }
}

export function cancelRequest(connectionId: string, user: UserModel): GameMatch {
  if (!pendingRequests.has(connectionId)) {
    throw new Exception(ErrorCode.REQUEST_NOT_FOUND, "Request Not found", {
      connectionId,
    });
  }
  pendingRequests.delete(connectionId);
  return { status: GameStatus.CANCELED, playerConnection: connectionId, userId: user.id! };
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
