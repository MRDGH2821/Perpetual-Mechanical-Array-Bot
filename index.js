import { Bot } from '@ruinguard/core';
import HallOfFame from './HallOfFameEventsIndex.js';
import PMAIndex from './PMAIndex.js';
import { configuration } from './lib/ConfigManager.js';
import triggers from './TriggerIndex.js';

const bot = new Bot({
  modules: [PMAIndex, triggers, HallOfFame],
});

await bot.login(configuration.token);

// bot.emit('ready', bot);

bot.once('ready', (client) => {
  console.log(`Ready from index file! Logged in as ${client.user.tag}`);
});

bot.emit('leaderboardRefresh', bot);
bot.emit('hofRefresh', bot);
process.env.LEADERBOARD = false;
process.env.HALL_OF_FAME = false;
