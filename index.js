import { Bot } from "@ruinguard/core";
import essentials from "@ruinguard/essentials";

import { config as ENV } from "dotenv";
ENV();

const bot = new Bot({
  modules: [essentials]
});

await bot.login(process.env.TOKEN);
