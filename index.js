import { Bot } from '@ruinguard/core';
import commands from './CommandIndex.js';
import { configuration } from './lib/ConfigManager.js';
import essentials from '@ruinguard/essentials';

const bot = new Bot({ modules: [
  commands,
  essentials
] });

await bot.login(configuration.token);
