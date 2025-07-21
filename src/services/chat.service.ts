import { Server, Socket } from "socket.io";
import Constants from "../constants/constants";
import Logger from "../utils/logger";

export function register(io: Server, socket: Socket): void {
  socket.on(Constants.REGISTER_EVENT, (data: any) => {
    Logger.info(`User registered: ${data.user}`);
    io.emit(Constants.REGISTER_EVENT, data);
  });

  socket.on(Constants.PRIVATE_CHAT, (data: any) => {
    io.emit(Constants.PRIVATE_CHAT, data);
  });
}
