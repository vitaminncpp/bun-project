import { Hono } from "hono";
import APIEndpoints from "../constants/apiEndpoints";
import * as projectController from "../controllers/project.controller";
import * as authMiddleware from "../middlewares/auth.middleware";
import * as projectValidations from "../validations/project.validations";

const router = new Hono();

router.post(
  APIEndpoints.PROJECT,
  authMiddleware.authenticate,
  projectValidations.validateCreateProject,
  projectController.createProject
);

export default router;
