import { Intents, Module } from '@ruinguard/core';
import esmImporter from '../lib/esmImporter.js';

export default new Module({
  commands: await esmImporter('src/pmaBaseModule/commands'),
  events: await esmImporter('src//pmaBaseModule/events'),
  name: 'Base PMA module',
  intents: new Intents([Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]),
});
