import { Hono } from "hono";
import APIEndpoints from "../constants/apiEndpoints";
import * as authMiddleware from "../middlewares/auth.middleware";
import * as gameController from "../controllers/game.controller";
import * as gameValidations from "../validations/game.validation";

const router = new Hono();

router.post(
  APIEndpoints.MATCH_GUEST!,
  gameValidations.validateStartGame,
  gameController.startMatchGuest
);

router.delete(APIEndpoints.MATCH_GUEST_ID!, gameController.cancelMatchRequest);

router.post(
  APIEndpoints.MATCH!,
  authMiddleware.authenticate,
  gameValidations.validateStartGame,
  gameController.startMatch
);

export default router;
