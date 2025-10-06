import { User as UserModel } from "../models/User.model";
import { activeGames, pendingRequests } from "../sessions/game.session";
import { activeConnections } from "../sessions/socket.session";
import Constants from "../constants/constants";
import { GameStatus, Player } from "../lib/chess/games.enum";
import type { GameMatch } from "../models/game/GameMatch.model";
import { Exception } from "../exceptions/app.exception";
import ErrorCode from "../enums/errorcodes.enum";
import { Game as GameModel } from "../models/game/Game.model";
import * as gameRepository from "../repositories/game.repository";
import { Game } from "../lib/chess/game";
import type { Server, Socket } from "socket.io";
import { Move as MoveModel } from "../models/game/Move.model";

export async function findMatch(
  user: UserModel,
  connectionId: string,
  guest?: boolean,
): Promise<GameMatch> {
  if (pendingRequests.size === 0) {
    if (!activeConnections.has(connectionId)) {
      throw new Exception(
        ErrorCode.INVALID_CONNECTION_ID,
        "No Associated Socket Connection Found",
        {
          connectionId,
          user,
        },
      );
    }
    pendingRequests.set(connectionId, user);
    return {
      status: GameStatus.PENDING,
      userId: user.id,
      connectionId,
    } satisfies GameMatch;
  } else {
    const [match] = pendingRequests.entries();
    if (connectionId === match[0]) {
      throw new Exception(
        ErrorCode.REQUEST_ALREADY_PROCESSING,
        "Request is Already in progress ! Please wait..",
        { connectionId, user },
      );
    }
    const mUser = match[1];
    const mConnection = match[0];
    const game: GameModel = await startGame(user, match[1]);

    const playerW = user.id === game.playerW ? user : mUser;
    const playerB = user.id === game.playerB ? user : mUser;

    const connectionW = mUser.id === game.playerW ? mConnection : connectionId;
    const connectionB = mUser.id === game.playerB ? mConnection : connectionId;

    const sockW = activeConnections.get(connectionW);
    const sockB = activeConnections.get(connectionB);

    sockW?.socket.emit(Constants.MATCH_FOUND, {
      status: GameStatus.ACTIVE,
      userId: playerW.id!,
      connectionId: connectionW,
      connectionW,
      connectionB,
      game,
      turn: Player.WHITE,
    } satisfies GameMatch);

    sockB?.socket.emit(Constants.MATCH_FOUND, {
      status: GameStatus.ACTIVE,
      userId: playerB.id!,
      connectionId: connectionB,
      connectionW,
      connectionB,
      game,
      turn: Player.WHITE,
    } satisfies GameMatch);

    sockW?.socket.on(Constants.DISCONNECT, async () => {
      game.status = GameStatus.ABORTED;
      const abortedGame = await gameRepository.updateOne(game.id, game);
      sockB?.socket.emit(Constants.OPPONENT_DISCONNECTED, { game: abortedGame });
    });
    sockB?.socket.on(Constants.DISCONNECT, async () => {
      game.status = GameStatus.ABORTED;
      const abortedGame = await gameRepository.updateOne(game.id, game);
      sockW?.socket.emit(Constants.OPPONENT_DISCONNECTED, { game: abortedGame });
    });

    pendingRequests.delete(mConnection);
    return {
      status: GameStatus.ACTIVE,
      userId: user.id,
      connectionW,
      connectionB,
      connectionId,
      game,
      turn: Player.WHITE,
    } satisfies GameMatch;
  }
}

export function cancelRequest(connectionId: string, user: UserModel): GameMatch {
  if (!pendingRequests.has(connectionId)) {
    throw new Exception(ErrorCode.REQUEST_NOT_FOUND, "Request Not found", {
      connectionId,
    });
  }
  pendingRequests.delete(connectionId);
  return {
    status: GameStatus.CANCELED,
    connectionId,
    userId: user.id,
  } satisfies GameMatch;
}

async function startGame(user1: UserModel, user2: UserModel): Promise<GameModel> {
  const gameModel = new GameModel();
  const players = toss(user1, user2);

  gameModel.playerW = players.white.id;
  gameModel.playerB = players.black.id;

  gameModel.status = GameStatus.ACTIVE;

  const game = new Game();

  const savedGame = await gameRepository.insertOne(gameModel);
  activeGames.set(savedGame.id, { game, gameModel });
  return savedGame;
}

function toss(
  user1: UserModel,
  user2: UserModel,
): {
  white: UserModel;
  black: UserModel;
} {
  const isUser1White = Math.random() < 0.5;
  return {
    white: isUser1White ? user1 : user2,
    black: isUser1White ? user2 : user1,
  };
}

export async function makeMove(move: MoveModel) {
  const { game, gameModel } = activeGames.get(move.gameId)!;
}

export function registerSocket(io: Server, socket: Socket, connectionId: string) {
  socket.on(Constants.DISCONNECT, () => {
    pendingRequests.delete(connectionId);
  });

  socket.on(Constants.GAME_MOVE, makeMove);
}
