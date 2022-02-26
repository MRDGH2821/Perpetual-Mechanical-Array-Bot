import { Bot } from '@ruinguard/core';
import commands from './CommandIndex.js';
import { configuration } from './lib/ConfigManager.js';
import essentials from '@ruinguard/essentials';
import events from './EventsIndex.js';
import triggers from './TriggerIndex.js';

const bot = new Bot({ modules: [
  commands,
  essentials,
  events,
  triggers
] });

await bot.login(configuration.token);
