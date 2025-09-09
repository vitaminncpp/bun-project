import type { Context } from "hono";
import * as projectService from "../services/project.service";
import Constants from "../constants/constants";
import type { User as UserModel } from "../models/User.model";
import type { Project as ProjectModel } from "../models/Project.model";
import SuccessResponse from "../models/SuccessResponse.model";

export async function createProject(c: Context) {
  const user: UserModel = c.get(Constants.AUTH_DATA);
  const project: ProjectModel = await c.req.json();
  project.userId = user.id;
  const savedProject: ProjectModel = await projectService.createProject(
    project
  );
  return c.json(
    new SuccessResponse(201, "Project Created Successfully", savedProject),
    201
  );
}

export async function getProject(c: Context) {
  const projectId = c.req.param("id");
  const project: ProjectModel = await projectService.getProject(projectId);
  return c.json(
    new SuccessResponse(200, "Project Fetched Successfully", project),
    200
  );
}

export async function getAllProjects(c: Context) {
  let options = undefined;
  const page = c.req.query("page");
  const size = c.req.query("size");
  if (page && size) {
    options = {
      page: Number(page),
      size: Number(size),
    };
  }
  const projects: {
    total: number;
    page: number;
    size: number;
    records: Array<ProjectModel>;
  } = await projectService.getAllProjects(options);
  return c.json(
    new SuccessResponse<{
      total: number;
      page: number;
      size: number;
      records: Array<ProjectModel>;
    }>(200, "All Projects fetched successfully", projects),
    200
  );  
}

export async function deleteProject(c: Context) {
  const projectId = c.req.param("id");
  const project: ProjectModel = await projectService.deleteProject(projectId);
  return c.json(
    new SuccessResponse(200, "Project Deleted Successfully", project),
    200
  );
}
