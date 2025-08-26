import { Project as ProjectModel } from "../models/Project.model.ts";
import { db } from "../database/database.connection.ts";
import { projects as projectTable } from "../entities/Project.entity.ts";
import { Exception } from "../exceptions/app.exception.ts";
import ErrorCode from "../enums/errorcodes.enum.ts";

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
