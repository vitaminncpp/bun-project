import type { Context } from "hono";
// Import your gRPC client here
// import { grpcClient } from "../services/grpc.service";

export async function testGrpc(c: Context) {
  try {
    // Example gRPC call (replace with actual method and params)
    // const result = await grpcClient.testMethod({ message: "Hello from gRPC!" });
    // For now, just return a mock response
    return c.json({ success: true, message: "gRPC test route reached" });
  } catch (error: Error | any) {
    return c.json({ success: false, error: error.message }, 500);
  }
}
