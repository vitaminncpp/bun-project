import type { Context } from "hono";

export async function testGrpc(c: Context) {
  try {
    return c.json({ success: true, message: "gRPC test route reached" });
  } catch (error: Error | any) {
    return c.json({ success: false, error: error.message }, 500);
  }
}
