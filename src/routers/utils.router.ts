import { Hono } from "hono";
import ApiConfig from "../config/api.config";
import * as utilsController from "../controllers/utils.controller";
import * as authMiddleware from "../middlewares/auth.middleware";
import * as commonValidations from "../validations/common.validations";

const router = new Hono();

router.post(
  ApiConfig.FILE,
  authMiddleware.authenticate,
  commonValidations.validateUploadFile,
  utilsController.uploadFile,
);

export default router;
