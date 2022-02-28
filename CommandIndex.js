import { Intents } from 'discord.js';
import { Module } from '@ruinguard/core';
import { resolve } from 'path';

export default await new Module({
  commands: resolve('./commands'),
  intents: [Intents.FLAGS.GUILDS]
});
