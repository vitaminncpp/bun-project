import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";

import io from "./src/sockets";
import app from "./src/app";
import { getServerPort } from "./src/services/env.service";
import { createServer } from "http";

app.use("/*", serveStatic({ root: "./static/public" }));

const port = getServerPort();

const server = serve({
  fetch: app.fetch,
  createServer,
  port,
  hostname: "0.0.0.0",
});

io.attach(server);
