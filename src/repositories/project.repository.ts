import { Project as ProjectModel } from "../models/Project.model.ts";
import { db } from "../database/database.connection.ts";
import { projects as projectTable } from "../entities/Project.entity.ts";
import { Exception } from "../exceptions/app.exception.ts";
import ErrorCode from "../enums/errorcodes.enum.ts";
import { eq } from "drizzle-orm";

export async function insertOne(project: ProjectModel): Promise<ProjectModel> {
  try {
    const inserted = await db
      .insert(projectTable)
      .values(project as any)
      .returning();
    if (!inserted || inserted.length === 0) {
      throw new Exception(
        ErrorCode.RECORD_INSERTION_FAILED,
        "Error Creating Project",
        project
      );
    }
    return ProjectModel.from(inserted[0]);
  } catch (err: Error | any) {
    if (err instanceof Exception) throw err;
    throw new Exception(
      ErrorCode.RECORD_INSERTION_FAILED,
      err?.message || "Error Creating Project",
      err
    );
  }
}

export async function findById(projectId: string): Promise<ProjectModel> {
  try {
    const [project] = await db
      .select()
      .from(projectTable)
      .where(eq(projectTable.id, projectId));
    if (!project) {
      throw new Exception(
        ErrorCode.PROJECT_NOT_EXIST,
        "Project does not Exists",
        projectId
      );
    }
    return ProjectModel.from(project);
  } catch (err: Exception | Error | any) {
    if (err instanceof Exception) throw err;
    throw new Exception(
      ErrorCode.ERROR_FETCHING_DATA,
      err?.message || "Error Fetching Project Data",
      err || projectId
    );
  }
}

export async function findAll(options: {
  page: number;
  size: number;
}): Promise<Array<ProjectModel>> {
  try {
    const projects = await db
      .select()
      .from(projectTable)
      .offset((options.page - 1) * options.size)
      .limit(options.size);
    if (!projects) {
      throw new Exception(
        ErrorCode.PROJECT_NOT_EXIST,
        "Error Getting all Projects"
      );
    }
    return projects.map(ProjectModel.from);
  } catch (err: Error | any) {
    if (err instanceof Exception) throw err;
    throw new Exception(
      ErrorCode.ERROR_FETCHING_DATA,
      err?.message || "Error Fetching Projects",
      err
    );
  }
}
