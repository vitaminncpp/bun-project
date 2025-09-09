import { Hono } from "hono";
import APIEndpoints from "../constants/apiEndpoints";
import * as projectController from "../controllers/project.controller";
import * as authMiddleware from "../middlewares/auth.middleware";
import * as projectValidations from "../validations/project.validations";

const router = new Hono();

router.get(
  APIEndpoints.PROJECTS,
  authMiddleware.authenticate,
  projectController.getAllProjects
);

router.get(
  APIEndpoints.PROJECT_ID,
  authMiddleware.authenticate,
  projectController.getProject
);

router.post(
  APIEndpoints.PROJECTS,
  authMiddleware.authenticate,
  projectValidations.validateCreateProject,
  projectController.createProject
);

router.delete(
  APIEndpoints.PROJECT_ID,
  authMiddleware.authenticate,
  projectController.deleteProject
);

export default router;
