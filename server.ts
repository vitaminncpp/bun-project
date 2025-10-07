import { createAdaptorServer } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";

import io from "./src/sockets";
import app from "./src/app";
import { getServerPort } from "./src/services/env.service";

app.use("/*", serveStatic({ root: "./static/public" }));

const port = getServerPort();

const server = createAdaptorServer(app);

io.attach(server);

server.listen(port);
