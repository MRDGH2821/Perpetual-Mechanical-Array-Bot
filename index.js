import { Bot } from '@ruinguard/core';
import commands from './CommandIndex.js';
import essentials from '@ruinguard/essentials';
import events from './EventsIndex.js';

import { token } from './lib/ConfigManager.js';

const bot = new Bot({ modules: [
  essentials,
  events,
  commands
] });

await bot.login(token);
