import { Project as ProjectModel } from "../models/Project.model";
import * as projectRepository from "../repositories/project.repository";
import type { DataRecord } from "../models/Data.record.ts";

export async function createProject(project: ProjectModel): Promise<ProjectModel> {
  project.icon = getIconUrl(project.name);
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
): Promise<DataRecord<ProjectModel>> {
  return projectRepository.findAll(options);
}

export async function deleteProject(projectId: string): Promise<ProjectModel> {
  return projectRepository.removeOne(projectId);
}

export function getIconUrl(description: string) {
  return `https://robohash.org/${description}?size=256x256`;
}
