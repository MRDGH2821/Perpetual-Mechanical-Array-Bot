import { Module } from '@ruinguard/core';
import essentials from '@ruinguard/essentials';
import commands from './CommandIndex.js';
import events from './EventsIndex.js';
import { config as ENV } from 'dotenv';
ENV();

await Module.registerGuildCommands([
  essentials,
  commands,
  events
], {
  app: process.env.CLIENTID,
  guild: process.env.GUILDID,
  token: process.env.TOKEN
}).then(console.log);
