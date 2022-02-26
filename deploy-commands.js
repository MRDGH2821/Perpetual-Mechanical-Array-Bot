import { Module } from '@ruinguard/core';
import commands from './CommandIndex.js';
import { configuration } from './lib/ConfigManager.js';
import essentials from '@ruinguard/essentials';
import events from './EventsIndex.js';
import triggers from './TriggerIndex.js';

await Module.registerGuildCommands([
  commands,
  essentials,
  events,
  triggers
], {
  app: configuration.clientId,
  guild: configuration.guildId,
  token: configuration.token
}).then(console.log);
