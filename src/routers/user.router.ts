import APIEndpoints from "../constants/apiEndpoints";
import * as authMiddleware from "../middlewares/auth.middleware";
import * as userValidation from "../validations/user.validation";
import * as userController from "../controllers/user.controller";
import { Hono } from "hono";

const router = new Hono();

router.get(
  APIEndpoints.USERS,
  authMiddleware.authenticate,
  userController.getAllUsers
);
router.get(
  APIEndpoints.USERNAME,
  authMiddleware.authenticate,
  userValidation.validateGetUser,
  userController.getUser
);
router.put(
  APIEndpoints.USER,
  authMiddleware.authenticate,
  userController.updateUser
);
router.post(
  APIEndpoints.USERS,
  authMiddleware.authenticate,
  userValidation.validateAddUsers,
  userController.addUsers
);

export default router;
