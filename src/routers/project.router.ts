import { Hono } from "hono";
import ApiConfig from "../config/api.config";
import * as projectController from "../controllers/project.controller";
import * as authMiddleware from "../middlewares/auth.middleware";
import * as projectValidations from "../validations/project.validations";

const router = new Hono();

router.get(ApiConfig.PROJECTS, authMiddleware.authenticate, projectController.getAllProjects);

router.get(ApiConfig.PROJECT_ID, authMiddleware.authenticate, projectController.getProject);

router.post(
  ApiConfig.PROJECTS,
  authMiddleware.authenticate,
  projectValidations.validateCreateProject,
  projectController.createProject,
);

router.delete(ApiConfig.PROJECT_ID, authMiddleware.authenticate, projectController.deleteProject);

export default router;
