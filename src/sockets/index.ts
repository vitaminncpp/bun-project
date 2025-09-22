import { Server, Socket } from "socket.io";
import Constants from "../constants/constants";
import Logger from "../utils/logger";
import * as chatService from "../services/chat.service";
import * as gameService from "../services/game.service";
import * as shellService from "../services/shell.service";
import { activeConnections } from "../sessions/socket.session";
import { randomUUID } from "crypto";

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

io.on(Constants.CONNECTION, (socket: Socket) => {
  const connectionId: string = randomUUID();
  // setTimeout(() => {
  //   socket.emit(Constants.SERVER_HELLO, { connectionId });
  // }, 50);
  Logger.info("User connected", connectionId);
  activeConnections.set(connectionId, { socket, authorized: false });
  socket.on(Constants.CLIENT_HELLO, (hello: ClientHello) => {
    if (hello.connectionId) {
      socket.emit(Constants.SERVER_HELLO, { connectionId });
    } else if (hello.authorization) {
      activeConnections.set(connectionId, { socket, authorized: true });
    }
  })
  socket.on(Constants.DISCONNECT, () => {
    Logger.warn("User Disconnected", connectionId);
    activeConnections.delete(connectionId);
  });
  chatService.register(io, socket);
  gameService.registerSocket(io, socket, connectionId);
  shellService.registerSocket(io, socket, connectionId);
});

export default io;
