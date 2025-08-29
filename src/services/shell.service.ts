import { spawn } from "child_process";
import { activeConnections } from "../sessions/socket.session";
import { activeShell } from "../sessions/shell.session";
import Constants from "../constants/constants";
import { Server, Socket } from "socket.io";
import { Exception } from "../exceptions/app.exception";
import ErrorCode from "../enums/errorcodes.enum";

export function startShell(connectionId: string) {
  if (!activeConnections.has(connectionId)) {
    throw new Exception(
      ErrorCode.INVALID_CONNECTION_ID,
      "No Associated Socket Connection Found",
      connectionId
    );
  }
  const sock = activeConnections.get(connectionId);
  const shell = spawn("cmd", [], { stdio: "pipe" });

  // shell.stdout.setEncoding("utf8");

  const callback = (data: any) => {
    sock!.emit(Constants.SHELL_OUT, {
      timestamp: Date.now(),
      data: data.toString(),
    });
    console.log(data.toString());
  };
  shell.stdout.on("data", callback);
  shell.on("error", callback);
  shell.stderr.on("data", callback);
  activeShell.set(connectionId, shell);
  return shell;
}

export function registerSocket(
  io: Server,
  socket: Socket,
  connectionId: string
) {
  socket.on(Constants.DISCONNECT, () => {
    const shell = activeShell.get(connectionId);
    shell?.kill();
    activeShell.delete(connectionId);
  });
  socket.on(Constants.SHELL_IN, (data: { timestamp: number; data: string }) => {
    activeShell.get(connectionId)?.stdin?.write(data.data + "\n");
  });
}
