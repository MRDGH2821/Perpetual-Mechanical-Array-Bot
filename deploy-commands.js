import { Module } from "@ruinguard/core";
import commands from "./PMAIndex.js";
import { configuration } from "./lib/ConfigManager.js";

await Module.registerGuildCommands([commands], {
  app: configuration.clientId,
  guild: configuration.guildId,
  token: configuration.token
}).then(console.log);
