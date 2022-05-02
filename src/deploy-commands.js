import { Module } from '@ruinguard/core';
import pmaBaseModule from './AllModules/pmaBaseModule.js';
import EnvConfig from './lib/EnvConfig.js';

await Module.registerGuildCommands([pmaBaseModule], {
  app: EnvConfig.clientId,
  guild: EnvConfig.guildId,
  token: EnvConfig.token,
}).then((err) => console.log(JSON.stringify(err, null, 2)));
