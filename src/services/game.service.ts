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

const onDisconnect = () => {};

export async function findMatch(
  user: UserModel,
  connectionId: string,
  guest?: boolean
): Promise<GameMatch> {
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
    return {
      status: GameStatus.PENDING,
      playerConnection: connectionId,
      userId: user.id,
    };
  } else {
    const [match] = pendingRequests.entries();
    if (connectionId === match[0]) {
      throw new Exception(
        ErrorCode.REQUEST_ALREADY_PROCESSING,
        "Request is Already in progress ! Please wait..",
        { connectionId, user }
      );
    }
    const game: GameModel = await startGame(user, match[1].user);
    match[1].socket.emit(Constants.MATCH_FOUND, {
      status: GameStatus.ACTIVE,
      playerConnection: match[0],
      opponentConnection: connectionId,
      userId: match[1].user.id,

      opponentId: user.id,
      game,
      turn: game.playerW === match[1].user.id ? Player.WHITE : Player.BLACK,
    });
    activeConnections.get(connectionId)!.emit(Constants.MATCH_FOUND, {
      status: GameStatus.ACTIVE,
      playerConnection: connectionId,
      opponentConnection: match[0],
      userId: user.id,

      opponentId: match[1].user.id,
      game,
      turn: game.playerW === user.id ? Player.WHITE : Player.BLACK,
    });
    const sock1 = activeConnections.get(connectionId)!;
    const sock2 = match[1].socket;

    sock1.on(Constants.DISCONNECT, async () => {
      game.status = GameStatus.ABORTED;
      const abortedGame = await gameRepository.updateOne(game.id, game);
      sock2.emit(Constants.OPPONENT_DISCONNECTED, { game: abortedGame });
    });
    sock2.on(Constants.DISCONNECT, async () => {
      game.status = GameStatus.ABORTED;
      const abortedGame = await gameRepository.updateOne(game.id, game);
      sock1.emit(Constants.OPPONENT_DISCONNECTED, {});
    });

    pendingRequests.delete(match[0]);
    return {
      status: GameStatus.ACTIVE,
      playerConnection: connectionId,
      opponentConnection: match[0],
      userId: user.id,

      opponentId: match[1].user.id,
      game,
      turn: game.playerW === user.id ? Player.WHITE : Player.BLACK,
    };
  }
}

export function cancelRequest(
  connectionId: string,
  user: UserModel
): GameMatch {
  if (!pendingRequests.has(connectionId)) {
    throw new Exception(ErrorCode.REQUEST_NOT_FOUND, "Request Not found", {
      connectionId,
    });
  }
  pendingRequests.delete(connectionId);
  return {
    status: GameStatus.CANCELED,
    playerConnection: connectionId,
    userId: user.id,
  };
}

async function startGame(
  user1: UserModel,
  user2: UserModel
): Promise<GameModel> {
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
  user2: UserModel
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

export function registerSocket(
  io: Server,
  socket: Socket,
  connectionId: string
) {
  socket.on(Constants.DISCONNECT, () => {
    pendingRequests.delete(connectionId);
  });

  socket.on(Constants.GAME_MOVE, () => {});
}
