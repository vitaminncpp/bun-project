import { Hono } from "hono";
import routes from "./routers/router";
import APIEndpoints from "./constants/apiEndpoints";

import { showRoutes } from "hono/dev";
import { error404, errorHandler } from "./middlewares/error.middleware";

const app = new Hono();
app.route(APIEndpoints.API!, routes);
app.onError(errorHandler);
app.notFound(error404);

showRoutes(app);

export default app;
