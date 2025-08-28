import { Hono } from "hono";
import { sysInfo as sysInfoController } from "../controllers/app.controller";
import APIEndpoints from "../constants/apiEndpoints";
import authRouter from "./auth.router";
import userRouter from "./user.router";
// import roleRouter from "./role.router";
import gameRouter from "./game.router";
import utilsRouter from "./utils.router";
import projectRouter from "./project.router";
import shelltRouter from "./shell.router";
import { testGrpc } from "../controllers/grpc.controller";

const router = new Hono();

router.get(APIEndpoints.SYS_INFO, sysInfoController);
router.route(APIEndpoints.AUTH, authRouter);
router.route(APIEndpoints.ROOT, userRouter);
router.route(APIEndpoints.ROOT, gameRouter);
router.route(APIEndpoints.ROOT, utilsRouter);
router.route(APIEndpoints.ROOT, projectRouter);
router.route(APIEndpoints.ROOT, shelltRouter);
// router.use(roleRouter);
// router.use(gameRouter);

// router.use(authenticate, error404);
// router.use(errorHandler);
router.get("/grpc/test", testGrpc);
export default router;
