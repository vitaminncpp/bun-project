import { ChildProcess } from "child_process";

// connectionId => Active Shell
export const activeShell: Map<string, ChildProcess> = new Map<
  string,
  ChildProcess
>();
