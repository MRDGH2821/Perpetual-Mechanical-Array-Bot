import { InteractionCommandClient } from 'detritus-client';
import { GatewayIntents } from 'detritus-client-socket/lib/constants';
import EnvConfig from './lib/EnvConfig';
import ping from './pmaBaseModule/ping';

const bot = new InteractionCommandClient(EnvConfig.token as string, {
  gateway: {
    intents: [GatewayIntents.GUILDS, GatewayIntents.GUILD_MEMBERS, GatewayIntents.GUILD_MESSAGES],
  },
});

bot.addMultiple([ping]);

bot.run().then(() => {
  console.log('bot on');
});
