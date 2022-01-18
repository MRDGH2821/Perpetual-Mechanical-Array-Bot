import { Bot } from '@ruinguard/core';
import essentials from '@ruinguard/essentials';
import events from './EventsIndex.js';
import commands from './CommandIndex.js';
import { config as ENV } from 'dotenv';
ENV();

const bot = new Bot({
  modules: [essentials, events, commands],
});

await bot.login(process.env.TOKEN);
