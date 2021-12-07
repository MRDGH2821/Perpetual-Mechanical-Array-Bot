import { Module } from "@ruinguard/core";
import essentials from "@ruinguard/essentials";
import { config as ENV } from "dotenv";
ENV();

await Module.registerGuildCommands([essentials], {
  app: process.env.CLIENTID,
  guild: process.env.GUILDID,
  token: process.env.TOKEN
}).then(console.log);
