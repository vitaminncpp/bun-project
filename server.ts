import { serve } from "@hono/node-server";
import { createServer } from "node:https";
import { getCertificate, getPrivateKey } from "./src/services/utils.service";
import { serveStatic } from "@hono/node-server/serve-static";

import io from "./src/sockets";
import app from "./src/app";
import { getServerPort } from "./src/services/env.service";

app.use("/*", serveStatic({ root: "./static/public" }));

const port = getServerPort();

const server = serve({
  fetch: app.fetch,
  createServer: createServer,
  serverOptions: {
    key: getPrivateKey(),
    cert: getCertificate(),
  },
  port,
});

io.attach(server);
