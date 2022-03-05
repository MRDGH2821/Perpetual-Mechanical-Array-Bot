import { Module } from '@ruinguard/core';
import commands from './CommandIndex.js';
import { configuration } from './lib/ConfigManager.js';
import essentials from '@ruinguard/essentials';

await Module.registerGuildCommands([
  commands,
  essentials
], {
  app: configuration.clientId,
  guild: configuration.guildId,
  token: configuration.token
}).then(console.log);
