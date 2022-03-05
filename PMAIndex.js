// import { Intents } from 'discord.js';
import { Intents, Module } from '@ruinguard/core';
import { arrayOfFilesGenerator } from './filesExporter.js';

const cmdIntents = new Intents([
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES
]);

export default await new Module({
  commands: await arrayOfFilesGenerator('./commands'),
  events: await arrayOfFilesGenerator('./events'),
  intents: cmdIntents.bitfield,
  name: 'PMA commands & Events'
});
