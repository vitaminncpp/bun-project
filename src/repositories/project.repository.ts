import { Project as ProjectModel } from "../models/Project.model";
import { db } from "../database/database.connection";
import { projects as projectTable } from "../entities/Project.entity";
import { Exception } from "../exceptions/app.exception";
import ErrorCode from "../enums/errorcodes.enum";
import { eq, sql } from "drizzle-orm";

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
}): Promise<{
  total: number;
  page: number;
  size: number;
  records: Array<ProjectModel>;
}> {
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
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(projectTable);

    return {
      total: Number(count),
      ...options,
      records: projects.map(ProjectModel.from),
    };
  } catch (err: Error | any) {
    if (err instanceof Exception) throw err;
    throw new Exception(
      ErrorCode.ERROR_FETCHING_DATA,
      err?.message || "Error Fetching Projects",
      err
    );
  }
}

export async function removeOne(projectId: string): Promise<ProjectModel> {
  const project = await db
    .delete(projectTable)
    .where(eq(projectTable.id, projectId))
    .returning();
  return ProjectModel.from(project[0]);
}
