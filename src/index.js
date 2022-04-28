import { Bot } from '@ruinguard/core';
import EnvConfig from './lib/EnvConfig.js';
import pmaBaseModule from './AllModules/pmaBaseModule.js';

const bot = new Bot({
  modules: [pmaBaseModule],
  intents: pmaBaseModule.intents,
});

await bot.login(EnvConfig.token);

bot.once('ready', (client) => {
  console.log(`Ready from index file! Logged in as ${client.user.tag}`);
});

bot.emit('leaderboardRefresh', bot);
bot.emit('hofRefresh', bot);
process.env.LEADERBOARD = 'false';
process.env.HALL_OF_FAME = 'false';
