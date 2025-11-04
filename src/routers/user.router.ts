import ApiConfig from "../config/api.config";
import * as authMiddleware from "../middlewares/auth.middleware";
import * as userValidation from "../validations/user.validation";
import * as userController from "../user/user.controller";
import { Hono } from "hono";

const router = new Hono();

router.get(ApiConfig.USERS, authMiddleware.authenticate, userController.getAllUsers);
router.get(
  ApiConfig.USERNAME,
  authMiddleware.authenticate,
  userValidation.validateGetUser,
  userController.getUser,
);
router.put(ApiConfig.USER, authMiddleware.authenticate, userController.updateUser);
router.post(
  ApiConfig.USERS,
  authMiddleware.authenticate,
  userValidation.validateAddUsers,
  userController.addUsers,
);

export default router;
