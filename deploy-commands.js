import { Module } from "@ruinguard/core";
import essentials from "@ruinguard/essentials";
const { token, clientId, guildId } = require("./config.js");

await Module.registerGuildCommands([essentials], {
  app: clientId,
  guild: guildId,
  token: token
}).then(console.log);
