import Paths from "../constants/path.constants";
import fs from "fs";
import path from "path";
import { FileModel } from "../models/File.model";

export async function saveFile(data: ArrayBuffer, projectId: string): Promise<FileModel> {
  const filename = `${Date.now()}-${crypto.randomUUID()}.zip`;
  const outPath = path.join(Paths.ZIP_UPLOAD_PATH, filename);
  fs.writeFileSync(outPath, Buffer.from(data));
  return FileModel.from({
    id: crypto.randomUUID(),
    name: filename,
    path: outPath,
    projectId,
  });
}

export function getPrivateKey() {
  return fs.readFileSync(Paths.SSL_KEY_PATH);
}

export function getCertificate() {
  return fs.readFileSync(Paths.SSL_CERTIFICATE_PATH);
}
