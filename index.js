import { Bot } from '@ruinguard/core';
import commands from './PMAIndex.js';
import { configuration } from './lib/ConfigManager.js';
import triggers from './TriggerIndex.js';

const bot = new Bot({ modules: [
  commands,
  triggers
] });

await bot.login(configuration.token);

// bot.emit('ready', bot);

bot.once('ready', (client) => {
  console.log(`Ready from index file! Logged in as ${client.user.tag}`);
});

bot.emit('leaderboardRefresh', bot);
