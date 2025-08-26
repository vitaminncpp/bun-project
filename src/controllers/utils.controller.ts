import type { Context } from "hono";
import fs from "fs";
import path from "path";
import Paths from "../constants/path.constants";

export async function uploadFile(c: Context) {
  const contentType =
    c.req.header("content-type") || "application/octet-stream";
  const filename = `${Date.now()}-${crypto.randomUUID()}.zip`;

  const buf = await c.req.arrayBuffer();

  const outPath = path.join(Paths.ZIP_UPLOAD_PATH, filename);
  fs.writeFileSync(outPath, Buffer.from(buf));

  return c.json(
    { ok: true, savedAs: outPath, type: contentType, size: buf.byteLength },
    201
  );
}
