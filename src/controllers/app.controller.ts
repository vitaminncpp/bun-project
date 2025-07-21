import type { Context } from "hono";
import os from "os";

export async function sysInfo(c: Context) {
  const cpus = os.cpus();

  const metaInfo = {
    name: "Optimus-M Server",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),

    uptime: process.uptime(),
    readableUptime: `${Math.floor(process.uptime() / 60)} mins`,
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    machine: os.machine?.(),
    userInfo: os.userInfo(),
    cpus,
    loadAverage: os.loadavg(),

    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    usedMemory: os.totalmem() - os.freemem(),
    networkInterfaces: os.networkInterfaces(),

    env: process.env,
  };

  return c.json(metaInfo);
}

export async function test(req: Request, res: Response) {
  res.status(200).send("Hello World !!");
}
