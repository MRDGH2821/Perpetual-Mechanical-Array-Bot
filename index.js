import { Bot } from '@ruinguard/core';
import commands from './CommandIndex.js';
import { configuration } from './lib/ConfigManager.js';
import essentials from '@ruinguard/essentials';
import events from './EventsIndex.js';

const bot = new Bot({ modules: [
  essentials,
  events,
  commands
] });

await bot.login(configuration.token);
