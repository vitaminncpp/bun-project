import type { Context } from "hono";
import { saveFile } from "../services/utils.service";
import SuccessResponse from "../models/SuccessResponse.model";
import type { FileModel } from "../models/File.model";

export async function uploadFile(c: Context) {
  const projectId = c.req.query("projectId")!;
  const data = await c.req.arrayBuffer();
  const file: FileModel = await saveFile(data, projectId);
  return c.json(new SuccessResponse<FileModel>(201, "File Uploaded SuccessFully", file),
    201
  );
}
