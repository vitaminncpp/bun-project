import { Server, Socket } from "socket.io";
import Constants from "../constants/constants";
import Logger from "../utils/logger";
import * as chatService from "../services/chat.service";
import * as gameService from "../services/game.service";
import * as shellService from "../services/shell.service";
import { activeConnections } from "../sessions/socket.session";
import { randomUUID } from "crypto";

const io = new Server({
  path: "/socket.io",
  cors: {
    origin: "*",
  },
});

io.on(Constants.CONNECTION, (socket: Socket) => {
  // TODO Auth logic Goes Here

  const connectionId: string = randomUUID();
  setTimeout(() => {
    socket.emit(Constants.SERVER_HELLO, { connectionId });
  }, 50);
  Logger.info("User connected", connectionId);
  activeConnections.set(connectionId, socket);
  socket.on(Constants.DISCONNECT, () => {
    Logger.warn("User Disconnected", connectionId);
    activeConnections.delete(connectionId);
  });
  chatService.register(io, socket);
  gameService.registerSocket(io, socket, connectionId);
  shellService.registerSocket(io, socket, connectionId);
});

export default io;
