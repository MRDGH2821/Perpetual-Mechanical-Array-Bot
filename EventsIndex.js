import { Intents, Module } from '@ruinguard/core';

import { arrayOfFilesGenerator } from './filesExporter.js';

const eventIntents = new Intents([
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]),
  events = arrayOfFilesGenerator('./events');

export default await new Module({
  events,
  intents: eventIntents.bitfield,
  name: 'PMA Events'
});
