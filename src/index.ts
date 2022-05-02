import { InteractionCommandClient } from 'detritus-client';
import { GatewayIntents } from 'detritus-client-socket/lib/constants';
import EnvConfig from './lib/EnvConfig';
import ping from './pmaBaseModule/ping';
import test from './pmaBaseModule/test';

const bot = new InteractionCommandClient(EnvConfig.token as string, {
  gateway: {
    intents: [GatewayIntents.GUILDS, GatewayIntents.GUILD_MEMBERS, GatewayIntents.GUILD_MESSAGES],
  },
});

(async () => {
  await bot.add(test);
  await bot.add(ping);
  await bot.run().then(async () => {
    console.log('bot on');
    await bot.client.rest
      .bulkOverwriteApplicationGuildCommands(
        process.env.CLIENT_ID as string,
        process.env.GUILD_ID as string,
        [test, ping],
      )
      .then(() => console.log('commands overwritten'));
  });
})();
