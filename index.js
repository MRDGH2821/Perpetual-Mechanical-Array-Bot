import { Bot } from '@ruinguard/core';
import commands from './PMAIndex.js';
import { configuration } from './lib/ConfigManager.js';
// import triggers from './TriggerIndex.js';

const bot = new Bot({ modules: [commands] });

await bot.login(configuration.token);
