// import { Intents } from 'discord.js';
import { Intents, Module } from '@ruinguard/core';
import { arrayOfFilesGenerator } from './filesExporter.js';

const cmdIntents = new Intents([Intents.FLAGS.GUILDS]),
  commands = arrayOfFilesGenerator('./commands');

export default await new Module({
  commands,
  intents: cmdIntents.bitfield,
  name: 'PMA commands'
});
