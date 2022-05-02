import { InteractionCommandClient } from 'detritus-client';
import { GatewayIntents } from 'detritus-client-socket/lib/constants';
import EnvConfig from './lib/EnvConfig';
import test from './pmaBaseModule/test';

const bot = new InteractionCommandClient(EnvConfig.token as string, {
  gateway: {
    intents: [GatewayIntents.GUILDS, GatewayIntents.GUILD_MEMBERS, GatewayIntents.GUILD_MESSAGES],
  },
});

bot.add(test);

bot.run().then(() => {
  console.log('bot on');
  bot.client.rest
    .bulkOverwriteApplicationGuildCommands(
      process.env.CLIENT_ID as string,
      process.env.GUILD_ID as string,
      [test],
    )
    .then(() => console.log('commands overwritten'));
});
