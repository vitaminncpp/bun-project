import { Hono, type Context } from "hono";
import {
  sysInfo as sysInfoController,
} from "../controllers/app.controller";
import APIEndpoints from "../constants/apiEndpoints";
import authRouter from "./auth.router";
import userRouter from "./user.router";
import roleRouter from "./role.router";
import gameRouter from "./game.router";
import { error404, errorHandler } from "../middlewares/error.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import type { HandlerInterface } from "hono/types";

const router = new Hono();

router.get(APIEndpoints.SYS_INFO!, sysInfoController);
router.route(APIEndpoints.AUTH!, authRouter);
// router.use(userRouter);
// router.use(roleRouter);
// router.use(gameRouter);

// router.use(authenticate, error404);
// router.use(errorHandler);
export default router;
