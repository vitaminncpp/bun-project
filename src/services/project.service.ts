import { Project as ProjectModel } from "../models/Project.model";

export async function createProject(
  project: ProjectModel
): Promise<ProjectModel> {
  return new ProjectModel();
}
