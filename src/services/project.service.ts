import { Project as ProjectModel } from "../models/Project.model";
import * as projectRepository from "../repositories/project.repository";

export async function createProject(project: ProjectModel): Promise<ProjectModel> {
  project.icon = `https://robohash.org/${project.name}?size=256x256`;
  return await projectRepository.insertOne(project);
}

export async function getProject(projectId: string): Promise<ProjectModel> {
  return await projectRepository.findById(projectId);
}

export async function getAllProjects(
  options: {
    page: number;
    size: number;
  } = { page: 1, size: 10 },
): Promise<{
  total: number;
  page: number;
  size: number;
  records: Array<ProjectModel>;
}> {
  return projectRepository.findAll(options);
}

export async function deleteProject(projectId: string): Promise<ProjectModel> {
  return projectRepository.removeOne(projectId);
}
