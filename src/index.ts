import { ClusterClient, InteractionCommandClient } from 'detritus-client';
import { GatewayIntents } from 'detritus-client-socket/lib/constants';
import EnvConfig from './lib/EnvConfig';
import esmImporter from './lib/esmImporter';

(async () => {
  const pmaEvents = await esmImporter('./pmaBaseModule/events');

  const clusterBot = new ClusterClient(EnvConfig.token as string, {
    gateway: {
      intents: [GatewayIntents.GUILDS, GatewayIntents.GUILD_MEMBERS, GatewayIntents.GUILD_MESSAGES],
    },
    cache: {
      members: { enabled: true, limit: 500 },
    },
  });

  await clusterBot.run();

  const clusterShard1 = clusterBot.shards.first()!;

  const interactionBot = new InteractionCommandClient(clusterBot);

  await interactionBot.addMultipleIn('./pmaBaseModule');
  await interactionBot.run().then(async () => {
    console.log('Bot On');
  });
  console.log(`Logged in as ${clusterShard1.user?.toString()}`);
  console.log(
    'Guild cmds: ',
    await clusterShard1.rest.fetchApplicationGuildCommands(
      clusterShard1.applicationId,
      EnvConfig.guildId as string,
    ),
  );
  console.log(
    'Global cmds: ',
    await clusterShard1.rest.fetchApplicationCommands(clusterShard1.applicationId),
  );
})();
