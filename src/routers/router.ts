import { Hono } from "hono";
import { sysInfo as sysInfoController } from "../controllers/app.controller";
import ApiConfig from "../config/api.config";
import authRouter from "./auth.router";
import userRouter from "./user.router";
import gameRouter from "./game.router";
import utilsRouter from "./utils.router";
import projectRouter from "./project.router";
import shelltRouter from "./shell.router";
import { testGrpc } from "../controllers/grpc.controller";

const router = new Hono();

router.get(ApiConfig.SYS_INFO, sysInfoController);
router.route(ApiConfig.AUTH, authRouter);
router.route(ApiConfig.ROOT, userRouter);
router.route(ApiConfig.ROOT, gameRouter);
router.route(ApiConfig.ROOT, utilsRouter);
router.route(ApiConfig.ROOT, projectRouter);
router.route(ApiConfig.ROOT, shelltRouter);
router.get("/grpc/test", testGrpc);
export default router;
