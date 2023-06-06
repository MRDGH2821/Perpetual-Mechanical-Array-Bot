import { container } from '@sapphire/framework';
import { Range, RecurrenceRule, scheduleJob } from 'node-schedule';
import { PMAEventHandler } from './baseBot/lib/Utilities';

container.logger.info('Starting Schedules');
const HoFRule = new RecurrenceRule(undefined, undefined, 5, undefined, 0, 0, 0, 'Etc/UTC');

export const HoFJobSchedule = scheduleJob(HoFRule, () => {
  container.logger.info('--------Automated Schedule---------');
  PMAEventHandler.emit('HoFRefresh');
  setTimeout(() => PMAEventHandler.emit('HoFPublish'), 1000 * 60 * 30);
});

const SARule = new RecurrenceRule(undefined, undefined, [1, 16], undefined, 9, 0, 0, 'Etc/UTC');

export const SAJobSchedule = scheduleJob(SARule, () => {
  PMAEventHandler.emit('spiralAbyssRefresh');
  setTimeout(() => PMAEventHandler.emit('spiralAbyssPublish'), 1000 * 60 * 30);
});

const LBFRule = new RecurrenceRule(
  undefined,
  undefined,
  undefined,
  new Range(0, 7),
  3,
  0,
  0,
  'Etc/UTC',
);

export const LBFJobSchedule = scheduleJob(LBFRule, () => {
  PMAEventHandler.emit('LBRefresh');
  setTimeout(() => PMAEventHandler.emit('LBFPublish'), 1000 * 60 * 30);
});
