import { Hono } from "hono";
import { sysInfo as sysInfoController } from "../controllers/app.controller";
import APIEndpoints from "../constants/apiEndpoints";
import authRouter from "./auth.router";
import userRouter from "./user.router";
import roleRouter from "./role.router";
import gameRouter from "./game.router";

const router = new Hono();

router.get(APIEndpoints.SYS_INFO!, sysInfoController);
router.route(APIEndpoints.AUTH!, authRouter);
router.route(APIEndpoints.ROOT!, userRouter);
router.route(APIEndpoints.ROOT!, gameRouter);
// router.use(roleRouter);

// router.use(authenticate, error404);
// router.use(errorHandler);
export default router;
