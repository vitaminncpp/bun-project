import { createAdaptorServer } from "@hono/node-server";
import io from "./src/sockets";
import app from "./src/app";
import { getServerPort } from "./src/services/env.service";

const port = getServerPort();

const server = createAdaptorServer(app);

io.attach(server);

server.listen(port, () => {
  console.log("Server Started");
});
