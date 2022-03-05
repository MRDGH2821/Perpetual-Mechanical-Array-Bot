// import { Intents } from 'discord.js';
import { Intents, Module } from '@ruinguard/core';
import { arrayOfFilesGenerator } from './filesExporter.js';
import { resolve } from 'path';
import { getDir } from 'file-ez';

const cmdIntents = new Intents([
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES
]);

export default await new Module({
  commands: getDir('./commands').path,
  events: getDir('./events').path,
  intents: cmdIntents.bitfield,
  name: 'PMA commands & Events'
});
