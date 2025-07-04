import { scheduleJob } from "node-schedule";
import { PMAEventHandler } from "./baseBot/lib/Utilities.js";
import { pmaLogger as logger } from "./pma-logger.js";

logger.info("Starting Schedules");

export const HoFJobSchedule = scheduleJob(
  {
    date: 5,
    hour: 0,
    minute: 0,
    second: 0,
    tz: "Etc/UTC",
  },
  () => {
    logger.info("--------Automated Schedule---------");
    PMAEventHandler.emit("HoFRefresh");
    setTimeout(() => PMAEventHandler.emit("HoFPublish"), 1_000 * 60 * 30);
  },
);

export const SAJobSchedule = scheduleJob(
  {
    date: [1, 16],
    hour: 9,
    minute: 0,
    second: 0,
    tz: "Etc/UTC",
  },
  () => {
    PMAEventHandler.emit("SARefresh");
    setTimeout(() => PMAEventHandler.emit("SAPublish"), 1_000 * 60 * 30);
  },
);

export const LBFJobSchedule = scheduleJob(
  {
    dayOfWeek: 6,
    hour: 3,
    minute: 0,
    second: 0,
    tz: "Etc/UTC",
  },
  () => {
    PMAEventHandler.emit("LBRefresh");
    setTimeout(() => PMAEventHandler.emit("LBFPublish"), 1_000 * 60 * 30);
  },
);

export const LBUJobSchedule = scheduleJob(
  {
    dayOfWeek: [0, 1, 2, 3, 4, 5, 6],
    hour: 3,
    minute: 0,
    second: 0,
    tz: "Etc/UTC",
  },
  () => {
    PMAEventHandler.emit("LBRefresh");
    setTimeout(() => PMAEventHandler.emit("LBUpdate"), 1_000 * 60 * 30);
  },
);
