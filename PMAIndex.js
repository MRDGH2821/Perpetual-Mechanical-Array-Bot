// import { Intents } from 'discord.js';
import { Intents, Module } from '@ruinguard/core';
import { arrayOfFilesGenerator } from './filesExporter.js';
import dmg_leaderboard from './commands/dmg_leaderboard.js';
import ping from './commands/ping.js';
import view_leaderboard from './commands/view_leaderboard.js';

const cmdIntents = new Intents([
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES
]);

export default await new Module({
  // await arrayOfFilesGenerator('./commands'),
  commands: [
    dmg_leaderboard,
    view_leaderboard,
    ping
  ],
  events: await arrayOfFilesGenerator('./events'),
  intents: cmdIntents.bitfield,
  name: 'PMA commands & Events'
});
