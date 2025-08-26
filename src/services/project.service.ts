import { Project as ProjectModel } from "../models/Project.model";
import * as projectRepository from "../repositories/project.repository";

export async function createProject(
  project: ProjectModel
): Promise<ProjectModel> {
  return await projectRepository.insertOne(project);
}
