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
  try {
    await bot.add(test); // added await even if not required
    await bot.add(ping);
    await bot.run().then(async () => {
      console.log('bot on');
    });
  } catch (err) {
    console.log(err);
  }
})();
