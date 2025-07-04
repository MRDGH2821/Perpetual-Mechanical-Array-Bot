import { Logger, LogLevel } from "@sapphire/framework";

export const pmaLogLevel = LogLevel.Info;

export const pmaLogger = new Logger(pmaLogLevel);
