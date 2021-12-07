import { Bot } from "@ruinguard/core";
import essentials from "@ruinguard/essentials";
const { token } = require("./config.js");

const bot = new Bot({
  modules: [essentials]
});

await bot.login(token);
