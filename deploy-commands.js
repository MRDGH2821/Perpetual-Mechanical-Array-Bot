import { Module } from '@ruinguard/core';
import commands from './CommandIndex.js';
import { configuration } from './lib/ConfigManager.js';
import essentials from '@ruinguard/essentials';
import events from './EventsIndex.js';

await Module.registerGuildCommands([
  essentials,
  commands,
  events
], {
  app: configuration.clientId,
  guild: configuration.guildId,
  token: configuration.token
}).then(console.log);
