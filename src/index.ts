import { ClusterClient, InteractionCommandClient } from 'detritus-client';
import { GatewayIntents } from 'detritus-client-socket/lib/constants';
import EnvConfig from './lib/EnvConfig';

(async () => {
  const cluster = new ClusterClient(EnvConfig.token as string, {
    gateway: {
      intents: [GatewayIntents.GUILDS, GatewayIntents.GUILD_MEMBERS, GatewayIntents.GUILD_MESSAGES],
    },
  });

  await cluster.run();

  const shard = cluster.shards.first()!;

  const bot = new InteractionCommandClient(cluster);
  try {
    await bot.addMultipleIn('./pmaBaseModule');
    await bot.run().then(async () => {
      console.log('bot on');
    });
  } catch (err) {
    console.log(err);
  }
  console.log(await shard.rest.fetchApplicationCommands(shard.applicationId));
})();
