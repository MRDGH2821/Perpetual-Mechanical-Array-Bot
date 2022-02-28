import { Intents } from 'discord.js';
import { Module } from '@ruinguard/core';
import { resolve } from 'path';

export default await new Module({
  events: resolve('./events'),
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
});
