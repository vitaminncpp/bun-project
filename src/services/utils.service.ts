import fs from "fs";
import path from "path";
import { FileModel } from "../models/File.model";
import { getFileUploadDir, getSSLCertPath, getSSLKeyPath } from "./env.service";

export async function saveFile(data: ArrayBuffer, projectId: string): Promise<FileModel> {
  const filename = `${Date.now()}-${crypto.randomUUID()}.zip`;
  const outPath = path.join(getFileUploadDir(), filename);
  fs.writeFileSync(outPath, Buffer.from(data));
  return FileModel.from({
    id: crypto.randomUUID(),
    name: filename,
    path: outPath,
    projectId,
  });
}

export function getPrivateKey() {
  return fs.readFileSync(getSSLKeyPath());
}

export function getCertificate() {
  return fs.readFileSync(getSSLCertPath());
}
