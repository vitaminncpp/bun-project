import { Server, Socket } from "socket.io";
import Constants from "../constants/constants";
import Logger from "../utils/logger";
import * as chatService from "../services/chat.service";
import * as gameService from "../services/game.service";
import * as shellService from "../services/shell.service";
import { setIO, activeConnections } from "../sessions/socket.session";
import { randomUUID } from "crypto";
import { authenticate } from "../services/auth.service";
import { Exception } from "../exceptions/app.exception";
import ErrorCode from "../enums/errorcodes.enum";
import SuccessResponse from "../models/SuccessResponse.model";
import ErrorResponse from "../models/ErrorResponse.model";

interface ClientHello {
  connectionId?: string;
  authorization?: string;
}

const io = new Server({
  path: "/socket.io",
  cors: {
    origin: "*",
  },
});

setIO(io);

io.on(Constants.CONNECTION, (socket: Socket) => {
  const connectionId: string = randomUUID();
  activeConnections.set(connectionId, { socket, authorized: false });
  socket.on(Constants.CLIENT_HELLO, (hello: ClientHello) => {
    if (hello.authorization) {
      try {
        const user = authenticate(hello.authorization);
        if (user) {
          activeConnections.set(connectionId, { socket, authorized: true });
          socket.emit(
            Constants.SERVER_HELLO,
            new SuccessResponse(201, "Authentication Successful", { connectionId }),
          );
        } else {
          socket.emit(
            Constants.SERVER_HELLO,
            new ErrorResponse(
              ErrorCode.INVALID_TOKEN,
              401,
              "Invalid token, authentication failed",
              new Exception(ErrorCode.INVALID_TOKEN, "Invalid token, authentication failed", hello),
              { connectionId },
            ),
          );
        }
      } catch (error: Exception | any) {
        socket.emit(
          Constants.SERVER_HELLO,
          new ErrorResponse(
            ErrorCode.INVALID_TOKEN,
            401,
            "Invalid token, authentication failed",
            error,
            { connectionId },
          ),
        );
      }
    } else {
      socket.emit(
        Constants.SERVER_HELLO,
        new ErrorResponse(
          ErrorCode.INVALID_TOKEN,
          401,
          "Invalid token, authentication failed",
          new Exception(ErrorCode.INVALID_TOKEN, "Invalid token, authentication failed", hello),
          { connectionId },
        ),
      );
    }
  });
  Logger.info("User connected", connectionId);
  socket.on(Constants.DISCONNECT, () => {
    Logger.warn("User Disconnected", connectionId);
    activeConnections.delete(connectionId);
  });
  chatService.registerSocket(io, socket);
  gameService.registerSocket(io, socket, connectionId);
  shellService.registerSocket(io, socket, connectionId);
});

export default io;
