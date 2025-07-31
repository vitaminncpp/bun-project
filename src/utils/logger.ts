type LogLevel = "success" | "info" | "debug" | "warn" | "error";

const COLORS: Record<LogLevel, string> = {
  success: "\x1b[32m", // Green
  info: "\x1b[94m", // Light blue
  debug: "\x1b[36m", // Cyan
  warn: "\x1b[33m", // Yellow
  error: "\x1b[31m", // Red
};
const RESET = "\x1b[0m";

// Additional colors for parts
const PART_COLORS = {
  timestamp: "\x1b[90m", // Bright gray
  level: {
    success: "\x1b[42m\x1b[30m", // Green background, black text
    info: "\x1b[104m\x1b[30m", // Light blue background, black text
    debug: "\x1b[46m\x1b[30m", // Cyan background, black text
    warn: "\x1b[43m\x1b[30m", // Yellow background, black text
    error: "\x1b[41m\x1b[37m", // Red background, white text
  },
  message: "\x1b[1m", // Bold
  tag: "\x1b[44m\x1b[37m", // Blue background, white text
};

// TODO improve everything in this file

class Logger {
  private static getTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Logs a message with optional tags.
   * @param level Log level
   * @param message Log message
   * @param tags Optional array of tags (strings)
   * @param args Additional arguments
   */
  private static log(level: LogLevel, message: string, ...args: any[]) {
    const color = COLORS[level] || "";
    const timestamp = `${
      PART_COLORS.timestamp
    }[${Logger.getTimestamp()}]${RESET}`;
    const levelStr = `${
      PART_COLORS.level[level]
    } [${level.toUpperCase()}] ${RESET}`;

    const msg = `${PART_COLORS.message}${message}${RESET}`;
    const output = `${timestamp} ${levelStr}${color}${msg}${RESET}`;
    switch (level) {
      case "success":
        console.log(output, ...args);
        break;
      case "debug":
        if (
          process.env.LOG_LEVEL === "debug" ||
          process.env.LOG_LEVEL === "info" ||
          process.env.LOG_LEVEL === "success"
        ) {
          console.debug(output, ...args);
        }
        break;
      case "info":
        if (
          ["debug", "info", "success"].includes(process.env.LOG_LEVEL || "info")
        ) {
          console.info(output, ...args);
        }
        break;
      case "warn":
        if (
          ["debug", "info", "warn", "success"].includes(
            process.env.LOG_LEVEL || "info"
          )
        ) {
          console.warn(output, ...args);
        }
        break;
      case "error":
        console.error(output, ...args);
        break;
    }
  }

  static success(message: string, ...args: any[]) {
    Logger.log("success", message, ...args);
  }

  static debug(message: string, ...args: any[]) {
    Logger.log("debug", message, ...args);
  }

  static info(message: string, ...args: any[]) {
    Logger.log("info", message, ...args);
  }

  static warn(message: string, ...args: any[]) {
    Logger.log("warn", message, ...args);
  }

  static error(message: string, ...args: any[]) {
    Logger.log("error", message, ...args);
  }
}

export default Logger;
