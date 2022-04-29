import { Intents, Module } from '@ruinguard/core';
import esmImporter from '../lib/esmImporter.js';

export default new Module({
  commands: await esmImporter('src/christmasModule/commands'),
  name: 'Christmas module',
  intents: new Intents([Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]),
});
