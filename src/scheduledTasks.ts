import { scheduleJob } from 'node-schedule';
import { pmaLogger as logger } from './pma-logger';
import { PMAEventHandler } from './baseBot/lib/Utilities';

logger.info('Starting Schedules');

export const HoFJobSchedule = scheduleJob(
  {
    date: 5,
    hour: 0,
    minute: 0,
    second: 0,
    tz: 'Etc/UTC',
  },
  () => {
    logger.info('--------Automated Schedule---------');
    PMAEventHandler.emit('HoFRefresh');
    setTimeout(() => PMAEventHandler.emit('HoFPublish'), 1000 * 60 * 30);
  },
);

export const SAJobSchedule = scheduleJob(
  {
    date: [1, 16],
    hour: 9,
    minute: 0,
    second: 0,
    tz: 'Etc/UTC',
  },
  () => {
    PMAEventHandler.emit('SARefresh');
    setTimeout(() => PMAEventHandler.emit('SAPublish'), 1000 * 60 * 30);
  },
);

export const LBFJobSchedule = scheduleJob(
  {
    dayOfWeek: 6,
    hour: 3,
    minute: 0,
    second: 0,
    tz: 'Etc/UTC',
  },
  () => {
    PMAEventHandler.emit('LBRefresh');
    setTimeout(() => PMAEventHandler.emit('LBFPublish'), 1000 * 60 * 30);
  },
);

export const LBUJobSchedule = scheduleJob(
  {
    dayOfWeek: [0, 1, 2, 3, 4, 5, 6],
    hour: 3,
    minute: 0,
    second: 0,
    tz: 'Etc/UTC',
  },
  () => {
    PMAEventHandler.emit('LBRefresh');
    setTimeout(() => PMAEventHandler.emit('LBUpdate'), 1000 * 60 * 30);
  },
);
