import { Module } from '@ruinguard/core';
import EnvConfig from './lib/EnvConfig.js';
import pmaBaseModule from './pmaBaseModule/pmaBaseModule.js';

await Module.registerGuildCommands([pmaBaseModule], {
  app: EnvConfig.clientId,
  guild: EnvConfig.guildId,
  token: EnvConfig.token,
}).then(console.log);
