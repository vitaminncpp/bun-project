import type { Context } from "hono";
import * as projectService from "../services/project.service";
import Constants from "../constants/constants";
import type { User as UserModel } from "../models/User.model";
import type { Project as ProjectModel } from "../models/Project.model";

export async function createProject(c: Context) {
  const user: UserModel = c.get(Constants.AUTH_DATA);
  const project: ProjectModel = await c.req.json();
  project.userId = user.id;
  const savedProject: ProjectModel = await  projectService.createProject(project);
}
